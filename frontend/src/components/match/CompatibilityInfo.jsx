import React from 'react';
// Import reusable component
import Button from '../common/Button'; 
import './CompatibilityInfo.css'; 
/**
 * CompatibilityInfo Component
 * Displays the score and reason for the two users' compatibility
 * * @param {string} score - ex) 90%
 * @param {string} reason - Simplified reason
 * @param {function} onAccept - 'Accept' button click handler
 * @param {function} onReject - 'Reject' button click handler
 */
const CompatibilityInfo = ({ score, reason, onAccept, onReject }) => {
    
    // 1. Score based styling logic
    // Extract only number
    const scoreInt = parseInt(score.replace('%', ''));
    let scoreClass = 'score-low'; 
    if (scoreInt >= 80) {
        scoreClass = 'score-high';
    } else if (scoreInt >= 50) {
        scoreClass = 'score-medium';
    }

    return (
        <div className="compatibility-info-root">
            
            {/* A. Score Display Area */}
            <div className={`score-display-area ${scoreClass}`}>
                <span className="score-text">{score}</span>
                <p className="score-label">Compatibility Score</p>
            </div>
            
            {/* B. Reason & Action Buttons */}
            <div className="info-and-actions">
                <p className="reason-text">
                    <span className="reason-label">Why you matched:</span> {reason}
                </p>
                
                <div className="action-buttons-wrapper">
                    <Button 
                        text="Reject" 
                        variant="secondary" 
                        size="large"
                        onClick={onReject}
                    />
                    <Button 
                        text="Accept & Open Chat" 
                        variant="primary" 
                        size="large"
                        icon_name="chat"
                        onClick={onAccept}
                    />
                </div>
            </div>
        </div>
    );
};

export default CompatibilityInfo;