const express = require('express');
const bodyParser = require('body-parser');

// Tạo một Router Express mới
const router = express.Router(); 

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" + API_KEY; 

if (!API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in environment variables.");
    process.exit(1);
}

// --- UTILITY FUNCTIONS (Được chuyển từ Frontend sang Backend) --- 

/**
 * Handles the Gemini API call with exponential backoff for reliability.
 * @param {object} payload - Payload for the API.
 * @returns {Promise<object>} The parsed JSON result from the API.
 */
async function fetchWithBackoff(payload) {
    let maxRetries = 5;
    let delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                    continue;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (jsonText) {
                const cleanJsonText = jsonText.replace(/^```json\s*|```$/g, '').trim();
                const parsedResult = JSON.parse(cleanJsonText);
                return parsedResult;
            } else {
                throw new Error("API did not return structured JSON content.");
            }

        } catch (error) {
            if (i === maxRetries - 1) {
                console.error("Gemini API call failed after multiple retries:", error);
                throw new Error("API Error: Could not retrieve response from Gemini.");
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}


// --- REST API ENDPOINTS (Chuyển đổi các hàm async thành Express Routes) ---

/**
 * @function POST /api/v1/questions
 * @description Agent 1: Generates 5 core questions based on two client profiles.
 */
router.post('/questions', async (req, res) => {
    const { client1Data, client2Data } = req.body;

    if (!client1Data || !client2Data) {
        return res.status(400).json({ error: "Missing client1Data or client2Data in request body." });
    }

    const systemPrompt = `You are a warm, approachable, and expert roommate matching specialist dedicated to helping tenants **find common ground on living habits** (referred to locally as 'nếp sống'). 
    Your task is to analyze the profile differences between Client 1 and Client 2, focusing on common conflicts in Vietnamese shared living (e.g., quiet hours, noise levels, guest etiquette, shared space cleanliness, regional habits, and utility split).
    Based on this analysis, you must draft **exactly 5 conversational questions** for Client 1 to ask Client 2.
    The tone of these questions must be **collaborative, respectful, and constructive**, aiming to **propose compromises and mutually agreeable solutions** rather than imposing rigid rules.
    Example tone shift: Instead of asking, 'Will you commit to silence after 10 PM?', phrase it as, 'To ensure both of us have quiet time after 10 PM, what compromises or arrangements do you think would work best for both our schedules?'
    The output MUST be a JSON object with a "Type" of "Question" and exactly 5 questions, strictly following this structure: 
    { "Type": "Question", "Question": [ "Friendly Question 1", "Friendly Question 2", "..." ] }`;

    const userQuery = `Client 1 Data (The Asker): [${client1Data}]. Client 2 Data (The Answerer): [${client2Data}]. Provide the first 5 questions.`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "Type": { type: "STRING", enum: ["Question"] },
                    "Question": { type: "ARRAY", items: { type: "STRING" } }
                },
                required: ["Type", "Question"]
            }
        }
    };

    try {
        const apiResult = await fetchWithBackoff(payload);
        if (apiResult && apiResult.Question && apiResult.Question.length === 5 && apiResult.Type === "Question") {
            return res.status(200).json(apiResult);
        } else {
            console.error("Invalid Agent 1 JSON structure:", apiResult);
            return res.status(500).json({ error: "Invalid API response structure for questions." });
        }
    } catch (error) {
        console.error("Error in /api/v1/questions:", error.message);
        return res.status(500).json({ error: error.message });
    }
});
// -----------------------------------------------------------------------------

/**
 * @function POST /score
 * @description Agent 2 (Call 1): Scores compatibility and provides a reason in bullet points.
 */
router.post('/score', async (req, res) => {
    const { client1Data, client2Data, historyString } = req.body;

    if (!client1Data || !client2Data || !historyString) {
        return res.status(400).json({ error: "Missing required data for scoring." });
    }

    const systemPrompt = `You are an expert in evaluating roommate compatibility, specifically focused on **Vietnamese cultural norms and urban living habits**. You will receive Client 1's data, Client 2's data, and the full Q&A history.
    Your SOLE task is to provide a final assessment of compatibility. You MUST return a JSON object containing the total **Score** (out of 100), the **Type** as "Result", and a detailed evaluation reason broken down into **3 to 5 clear bullet points** (\`ReasonBulletPoints\`).
    The evaluation must prioritize how Client 2's answers resolve or worsen the potential lifestyle conflicts (e.g., quiet hours, motorbike parking, wet market shopping/smells, shared cooking/utilities) identified between the two profiles.
    Structure: { "Type": "Result", "Score": score / 100, "ReasonBulletPoints": [ "Point 1: Focus on compatibility/conflict area.", "Point 2: Focus on compatibility/conflict area.", "..." ] }`;

    const userQuery = `Client 1 Data: [${client1Data}]. Client 2 Data: [${client2Data}]. Full Q&A history: [${historyString}]. Provide the compatibility score and detailed reason in bullet points.`;

    const responseSchema = {
        type: "OBJECT",
        properties: {
            "Type": { type: "STRING", enum: ["Result"] },
            "Score": { type: "INTEGER", description: "Compatibility score from 0 to 100." },
            "ReasonBulletPoints": { 
                type: "ARRAY", 
                description: "3 to 5 clear bullet points explaining the score.",
                items: { type: "STRING" }
            },
        },
        required: ["Type", "Score", "ReasonBulletPoints"]
    };

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    };

    try {
        const apiResult = await fetchWithBackoff(payload);
        if (apiResult.Type === "Result" && typeof apiResult.Score === 'number') {
            return res.status(200).json(apiResult);
        } else {
             console.error("Invalid Agent 2 Score JSON structure:", apiResult);
            return res.status(500).json({ error: "Invalid API response structure for scoring." });
        }
    } catch (error) {
        console.error("Error in /api/v1/score:", error.message);
        return res.status(500).json({ error: error.message });
    }
});
// -----------------------------------------------------------------------------

/**
 * @function POST /api/v1/followup-questions
 * @description Agent 2 (Call 2): Generates 1-3 follow-up questions for mid-range scores.
 */
router.post('/followup-questions', async (req, res) => {
    const { client1Data, client2Data, historyString, currentScore } = req.body;

    if (!client1Data || !client2Data || !historyString || typeof currentScore !== 'number') {
        return res.status(400).json({ error: "Missing required data for follow-up questions." });
    }

    const followUpSystemPrompt = `You are an expert in finding roommates, specializing in **Vietnamese-specific compatibility factors**. Based on both client's data and the Q&A history, the compatibility score is mid-range (${currentScore}/100). 
    Your task is to generate **1 to 3 targeted follow-up questions** to clarify Client 2's compatibility in the most ambiguous conflict areas (e.g., shared fridge use, utility bill split, guest frequency). 
    You MUST return ONLY the list of questions in the specified JSON format with "Type": "Question".`;

    const followUpUserQuery = `Client 1 Data: [${client1Data}]. Client 2 Data: [${client2Data}]. Full Q&A history: [${historyString}]. Generate 1-3 clarifying questions.`;

    const followUpPayload = {
        contents: [{ parts: [{ text: followUpUserQuery }] }],
        systemInstruction: { parts: [{ text: followUpSystemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "Type": { type: "STRING", enum: ["Question"] },
                    "Question": { type: "ARRAY", items: { type: "STRING" } },
                },
                required: ["Type", "Question"]
            }
        }
    };

    try {
        const followUpResult = await fetchWithBackoff(followUpPayload);
        if (followUpResult.Question && followUpResult.Question.length > 0 && followUpResult.Type === "Question") {
            return res.status(200).json(followUpResult);
        } else {
            console.error("Follow-up question generation failed with invalid structure:", followUpResult);
            return res.status(500).json({ error: "Follow-up question generation failed. Invalid API response structure." });
        }
    } catch (error) {
        console.error("Error in /api/v1/followup-questions:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;