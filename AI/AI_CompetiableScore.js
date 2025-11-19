// --- CONFIGURATION ---
// API Key is not needed; Canvas will provide it automatically.
// If running locally (outside Canvas), replace "" with your actual API key.
const API_KEY = "AIzaSyByOpIi8DpLNFrDaOuvv0ti3Uh8O7mLGPA"; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" + API_KEY;

// --- STATE MANAGEMENT ---
let currentHistory = [];
let isWaitingForAnswer = false;
let lastScore = null; 

// --- DOM ELEMENTS (Cached) ---
const DOM = {
    clientProfile: document.getElementById('clientProfile'),
    qaHistory: document.getElementById('qaHistory'),
    resultOutput: document.getElementById('resultOutput'),
    startAgent1: document.getElementById('startAgent1'),
    continueAgent2: document.getElementById('continueAgent2'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    statusMessage: document.getElementById('statusMessage'),
    answerWarning: document.getElementById('answerWarning'),
};


// --- UTILITY FUNCTIONS ---

/**
 * Renders the Q&A history with input fields for unanswered questions.
 */
function renderAnswerInputs() {
    DOM.qaHistory.innerHTML = '';
    if (currentHistory.length === 0) {
        DOM.qaHistory.innerHTML = '<p class="text-gray-500 italic">No questions have been asked yet. Click \'Start\' to begin.</p>';
        return;
    }

    let hasUnansweredQuestions = false;

    currentHistory.forEach((item, index) => {
        const container = document.createElement('div');
        container.className = 'question-answer-container';
        
        const questionElement = document.createElement('p');
        questionElement.className = 'font-semibold text-primary-blue mb-2';
        questionElement.textContent = `Q${index + 1}: ${item.question}`;
        container.appendChild(questionElement);

        if (item.answer) {
            // If already answered, show the static answer
            const answerElement = document.createElement('p');
            answerElement.className = 'ml-4 text-gray-700 border-l-2 border-primary-green pl-2 italic text-sm';
            answerElement.textContent = `Answered: ${item.answer}`;
            container.style.backgroundColor = '#ecfdf5'; // light green background
            container.appendChild(answerElement);
        } else {
            // If unanswered, show a textarea for input
            const answerInput = document.createElement('textarea');
            answerInput.id = `answerInput-${index}`;
            answerInput.className = 'w-full p-2 border border-yellow-400 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 mt-2';
            answerInput.placeholder = 'Type your answer here...';
            answerInput.rows = 2;
            container.appendChild(answerInput);
            container.style.backgroundColor = '#fffbeb'; // light yellow background
            hasUnansweredQuestions = true;
        }
        DOM.qaHistory.appendChild(container);
    });
    DOM.qaHistory.scrollTop = DOM.qaHistory.scrollHeight;
    
    // Show/hide warning and manage button state based on answers
    DOM.answerWarning.classList.toggle('hidden', !hasUnansweredQuestions);
    DOM.continueAgent2.disabled = !hasUnansweredQuestions;
    isWaitingForAnswer = hasUnansweredQuestions;
}

/**
 * Reads answers from the UI inputs and saves them to currentHistory.
 * @returns {boolean} True if all current questions were answered, false otherwise.
 */
function readAndValidateAnswers() {
    let allAnswered = true;
    currentHistory.forEach((item, index) => {
        if (!item.answer) {
            const inputElement = document.getElementById(`answerInput-${index}`);
            const answerText = inputElement ? inputElement.value.trim() : '';
            
            if (answerText.length > 0) {
                item.answer = answerText;
            } else {
                allAnswered = false;
            }
        }
    });
    
    if (allAnswered) {
        DOM.answerWarning.classList.add('hidden');
    } else {
        DOM.answerWarning.classList.remove('hidden');
    }

    return allAnswered;
}

/**
 * Toggles the Loading state and updates buttons
 * @param {boolean} isLoading 
 */
function toggleLoading(isLoading) {
    DOM.startAgent1.disabled = isLoading || isWaitingForAnswer;
    DOM.continueAgent2.disabled = isLoading || !isWaitingForAnswer; 
    DOM.loadingIndicator.classList.toggle('hidden', !isLoading);
    DOM.resultOutput.textContent = isLoading ? 'Processing...' : 'Awaiting Command...';
}

/**
 * Handles the Gemini API call with exponential backoff for reliability.
 * @param {object} payload - Payload for the API.
 * @returns {Promise<object>} The parsed JSON result from the API.
 */
async function fetchWithBackoff(payload) {
    let maxRetries = 5;
    let delay = 1000;

    // Log the payload being sent
    console.log(`[API REQUEST - Payload Sent]:`, payload);

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && i < maxRetries - 1) {
                    // Too Many Requests, retry
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                    continue;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Log raw response
            console.log(`[API RESPONSE - Raw]:`, result);

            // Check and parse structured JSON content
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (jsonText) {
                // Log the structured text content
                console.log(`[API RESPONSE - JSON Text]:\n${jsonText}`); 
                const parsedResult = JSON.parse(jsonText);
                console.log(`[API RESPONSE - Parsed JSON]:`, parsedResult);
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

// --- AGENT LOGIC FUNCTIONS ---

/**
 * AGENT 1: Initialization, creates 5 initial questions.
 */
async function startMatching() {
    const clientData = DOM.clientProfile.value.trim();
    if (!clientData) {
        alert('Please enter the Current User Data (Client Profile) before starting.');
        return;
    }
    
    // Reset state
    currentHistory = [];
    isWaitingForAnswer = true;
    renderAnswerInputs();
    toggleLoading(true);
    DOM.statusMessage.classList.add('hidden');
    lastScore = null;

    // AGENT 1: System Prompt (English)
    const systemPrompt = `You are an expert in evaluating and assisting in finding a suitable roommate. You will be sent a brief summary of the user's information [Data]. Your task is to evaluate this brief and generate 5 core questions to ask the person who wants to connect with your client to determine their compatibility. The output must be a JSON object with exactly 5 questions, strictly following this structure: { "Question": [ "Question 1", "Question 2", "Question 3", "Question 4", "Question 5" ] }`;

    // User Query (English)
    const userQuery = `The client's data is: [${clientData}]. Provide the first 5 questions.`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "Question": { 
                        type: "ARRAY",
                        description: "Array containing 5 questions to ask the potential roommate.",
                        items: { type: "STRING" }
                    }
                },
                required: ["Question"]
            }
        }
    };

    try {
        const apiResult = await fetchWithBackoff(payload);
        
        // Log final processed result for Agent 1
        console.log(`[AGENT 1 - FINAL PROCESSED RESULT]:`, apiResult); 

        // Process Agent 1 result
        if (apiResult && apiResult.Question && apiResult.Question.length === 5) {
            currentHistory = apiResult.Question.map(q => ({ question: q, answer: null }));
            
            DOM.resultOutput.textContent = `AGENT 1 (Question Generation) SUCCESS:\n\n${JSON.stringify(apiResult, null, 2)}`;
            DOM.statusMessage.textContent = `5 initial questions generated. Please provide answers and click 'Continue'.`;
            DOM.statusMessage.className = 'mt-4 p-3 rounded-lg text-center font-medium bg-blue-100 text-primary-blue';
            DOM.statusMessage.classList.remove('hidden');
            
            // Render the new input fields
            renderAnswerInputs();

        } else {
            throw new Error("Invalid Agent 1 JSON structure or missing questions. Ensure exactly 5 questions are returned.");
        }

    } catch (error) {
        DOM.resultOutput.textContent = error.message;
        isWaitingForAnswer = false;
    } finally {
        toggleLoading(false);
    }
}

/**
 * AGENT 2: Evaluates answers and decides based on score:
 * - Score < 50: Done (Fail)
 * - Score 50-70: Ask more (Max 3 Qs)
 * - Score > 70: Done (Pass)
 */
async function continueMatching() {
    const clientData = DOM.clientProfile.value.trim();
    if (currentHistory.length === 0) {
        alert('Please run Agent 1 first.');
        return;
    }
    
    // --- STEP 1: READ AND VALIDATE ANSWERS ---
    if (!readAndValidateAnswers()) {
        return;
    }
    
    // Update the display with the newly read answers (now static text)
    renderAnswerInputs(); 

    // --- STEP 2: FORMAT HISTORY STRING FOR API ---
    
    let historyString = "";
    currentHistory.forEach((item, index) => {
         historyString += `\n[Q${index + 1}]: ${item.question}\n[A${index + 1}]: ${item.answer}`;
    });
    
    // --- STEP 3: CALL GEMINI API (AGENT 2) FOR SCORE ---

    toggleLoading(true);
    DOM.statusMessage.classList.add('hidden');
    isWaitingForAnswer = false;
    
    // AGENT 2: System Prompt (English) - First Call: Score & Reason
    const systemPrompt = `You are an expert in evaluating and assisting in finding a suitable roommate. You will be sent the client's data [Data] and the full Q&A history [Question : Answer . . ] from the potential roommate.
    
    Your ONLY task is to provide an initial assessment of compatibility. You MUST return a JSON object containing the total Score (out of 100) and a brief evaluation Reason (50-70 words).

    You DO NOT decide if more questions are needed. Just provide the score and reason.
    
    Structure: { "Score": score / 100, "Reason": concise reason (50-70 words, starting with 'You are 'so suitable/ some fit/ can be' with 'Your User' because [50 clear words]) }`;

    // User Query (English)
    const userQuery = `Client data: [${clientData}]. Full Q&A history: [${historyString}]. Provide the compatibility score and reason.`;

    // Define JSON Schema for Agent 2 to enforce the structure
    const responseSchema = {
        type: "OBJECT",
        properties: {
            "Score": { type: "INTEGER", description: "Compatibility score from 0 to 100." },
            "Reason": { type: "STRING", description: "Short evaluation reason (50-70 words)." },
        },
        required: ["Score", "Reason"]
    };


    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    };

    try {
        const apiResult = await fetchWithBackoff(payload);
        
        // Log final processed result for Agent 2 (Scoring)
        console.log(`[AGENT 2 - SCORING RESULT (Processed)] Score: ${apiResult.Score}, Reason: ${apiResult.Reason}`);
        
        lastScore = apiResult.Score; // Store the score
        
        // --- STEP 4: CLIENT-SIDE LOGIC TO ENFORCE 50-70 RULE ---
        
        DOM.resultOutput.textContent = `AGENT 2 (Initial Score & Reason) SUCCESS:\n\n${JSON.stringify(apiResult, null, 2)}`;

        if (apiResult.Score < 50) {
            // RULE 1: Score < 50 => Auto-Fail (Done: true)
            
            DOM.statusMessage.textContent = `❌ FINAL DECISION (Score: ${apiResult.Score}/100): Compatibility is LOW. Evaluation is complete. Reason: ${apiResult.Reason}`;
            DOM.statusMessage.className = 'mt-4 p-3 rounded-lg text-center font-bold bg-red-100 text-red-800';
            DOM.continueAgent2.disabled = true;

        } else if (apiResult.Score >= 50 && apiResult.Score <= 70) {
            // RULE 2: Score 50-70 => Ask More (Done: false) -> Reroute to a follow-up prompt
            
            // Since the score is mid-range, we need to ask the model for follow-up questions
            await askFollowUpQuestions(clientData, historyString);
            
        } else if (apiResult.Score > 70) {
            // RULE 3: Score > 70 => Auto-Pass (Done: true)
            
            DOM.statusMessage.textContent = `✅ FINAL DECISION (Score: ${apiResult.Score}/100): Compatibility is HIGH. Evaluation is complete. Reason: ${apiResult.Reason}`;
            DOM.statusMessage.className = 'mt-4 p-3 rounded-lg text-center font-bold bg-green-100 text-primary-green';
            DOM.continueAgent2.disabled = true;
        } else {
            // Fallback for unexpected score format
            throw new Error("Score out of range (0-100) or invalid format.");
        }
        
        DOM.statusMessage.classList.remove('hidden');

    } catch (error) {
        DOM.resultOutput.textContent = error.message;
    } finally {
        toggleLoading(false);
        DOM.continueAgent2.disabled = !isWaitingForAnswer;
    }
}


/**
 * Follow-up prompt to ask for 1-3 more questions when score is 50-70.
 */
async function askFollowUpQuestions(clientData, historyString) {
    
    // This is a secondary call to the model, specifically asking for questions only.
    DOM.resultOutput.textContent += `\n\n--- SECONDARY CALL: Asking for Follow-up Questions (Score: ${lastScore}) ---`;

    // AGENT 2: System Prompt (English) - Second Call: Follow-up Questions
    const followUpSystemPrompt = `You are an expert in finding roommates. Based on the client's data and the current Q&A history, the compatibility score is mid-range (${lastScore}/100). Your task is to generate 1 to 3 targeted follow-up questions to clarify the potential roommate's compatibility in the most ambiguous areas. You MUST return ONLY the list of questions in the specified JSON format.`;

    const followUpUserQuery = `Client data: [${clientData}]. Full Q&A history: [${historyString}]. Generate 1-3 clarifying questions.`;

    const followUpPayload = {
        contents: [{ parts: [{ text: followUpUserQuery }] }],
        systemInstruction: {
            parts: [{ text: followUpSystemPrompt }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "Question": { 
                        type: "ARRAY",
                        description: "Array containing 1-3 follow-up questions.",
                        items: { type: "STRING" }
                    },
                    "Done": { type: "BOOLEAN", description: "MUST be false for this operation."}
                },
                required: ["Question", "Done"]
            }
        }
    };

    try {
        const followUpResult = await fetchWithBackoff(followUpPayload);
        
        // Log final processed result for Agent 2 (Questions)
        console.log(`[AGENT 2 - FOLLOW-UP QUESTIONS RESULT (Processed)] Questions: ${followUpResult.Question.length}, Done: ${followUpResult.Done}`);

        if (followUpResult.Question && followUpResult.Question.length > 0) {
            const newQuestions = followUpResult.Question;
            newQuestions.forEach(q => {
                currentHistory.push({ question: q, answer: null });
            });
            
            // Update History String to reflect the secondary call result
            DOM.resultOutput.textContent += `\n\nSECONDARY CALL RESULT (Questions):\n${JSON.stringify(followUpResult, null, 2)}`;

            // Render new input fields for the follow-up questions
            renderAnswerInputs();
            
            isWaitingForAnswer = true;
            
            DOM.statusMessage.textContent = `⚠️ MID-RANGE SCORE (${lastScore}/100): AI has provided ${newQuestions.length} follow-up questions. Please provide answers and click 'Continue' for final scoring.`;
            DOM.statusMessage.className = 'mt-4 p-3 rounded-lg text-center font-medium bg-yellow-100 text-yellow-800';

        } else {
             // Fallback if model fails to provide questions
             throw new Error("Follow-up question generation failed. Ending evaluation.");
        }
        
    } catch (error) {
        DOM.resultOutput.textContent = error.message;
        isWaitingForAnswer = false;
    }

}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Set initial sample data for the client profile (English translation of the original sample)
    DOM.clientProfile.value = "Name: Nguyen Van A. Age: 22. Job: IT Student. Habits: Sleeps early (10 PM), likes quiet, non-smoker. Budget: 3-4 Million VND/month. Hobby: Playing online games (with headphones) and light cooking.";
    renderAnswerInputs(); 
});