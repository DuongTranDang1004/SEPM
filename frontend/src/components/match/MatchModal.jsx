import React from 'react';
// Importing resuable component
import Modal from '../common/Modal';
import ProfileCard from '../tenant/TenantProfile';
import CompatibilityInfo from './CompatibilityInfo'; // Currently placeholder. Add file and link it up here

import './MatchModal.css'; 

/**
 * MatchModal Component (It's a Match! Pop up)
 * * @param {boolean} isOpen - Modal open/closed
 * @param {function} onClose - Handler to close Modal
 * @param {object} userProfile - Current user profile data
 * @param {object} matchedProfile - matched user data
 * @param {object} compatibilityData - { score: '90%', reason: '...' }
 */
const MatchModal = ({ 
    isOpen, 
    onClose, 
    userProfile, 
    matchedProfile, 
    compatibilityData 
}) => {

    const handleAccept = () => {
        console.log("Match Accepted! Starting Chat...");
        onClose(); // Close modal
        // Enter chat creation and reposition logic here
    };

    const handleReject = () => {
        console.log("Match Rejected.");
        onClose(); // Close modal
        // Enter matching history termination logic here
    };

    return (
        <Modal 
            is_open={isOpen} 
            onClose={onClose} 
            title="🎉 It's a Match!" 
            size="large"
        >
            <div className="match-modal-content">
                
                {/* A. Profile Cards Display (Two profile cards alignment) */}
                <div className="profile-comparison-grid">
                    {/* Current user profile (Left) */}
                    <ProfileCard profileData={userProfile} isEditable={false} />
                    
                    {/* Matched user profile (Right) */}
                    <ProfileCard profileData={matchedProfile} isEditable={false} />
                </div>

                {/* B. Compatibility & Action Area */}
                <CompatibilityInfo 
                    score={compatibilityData.score}
                    reason={compatibilityData.reason}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
                
            </div>
        </Modal>
    );
};

export default MatchModal;