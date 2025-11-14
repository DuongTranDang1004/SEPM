import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FindRoommatesPage from './FindRoommatesPage';
import FindRoomPage from './FindRoomPage';
import './TenantDashboard.css'; // Load separated CSS file

// Modal Component: Handles popup background and close button
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close-button">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/**
 * TenantDashboard: Tenant Dashboard page.
 * Toggles Broomate search and Room search functionalities as modals.
 */
const TenantDashboard = () => {
  const [isRoommatesModalOpen, setRoommatesModalOpen] = useState(false);
  const [isRoomsModalOpen, setRoomsModalOpen] = useState(false);

  // Modal toggle functions
  const toggleRoommatesModal = () => setRoommatesModalOpen(!isRoommatesModalOpen);
  const toggleRoomsModal = () => setRoomsModalOpen(!isRoomsModalOpen);

  return (
    <div className="tenant-dashboard-container">
      <h1 className="dashboard-title">Tenant Dashboard</h1>

      {/* 1. Broomate Search Card (Coral - Find Roommates) */}
      <div className="dashboard-card dashboard-card-broomate">
        <h2 className="card-title card-title-broomate">Looking for Broomates?</h2>
        <p className="card-description card-description-broomate">
          Lorem ipsum dolor sit amet consectetur. Aliquat accumsan sed vestibulum vestibulum cras tempus.
        </p>
        <button
          onClick={toggleRoommatesModal}
          className="search-button search-button-broomate"
        >
          <span>Search</span>
          <Search size={20} />
        </button>
      </div>

      {/* 2. Room Search Card (Teal - Find Rooms) */}
      <div className="dashboard-card dashboard-card-room">
        <h2 className="card-title card-title-room">Looking for Rooms?</h2>
        <p className="card-description card-description-room">
          Lorem ipsum dolor sit amet consectetur. Aliquat accumsan sed vestibulum vestibulum cras tempus.
        </p>
        <button
          onClick={toggleRoomsModal}
          className="search-button search-button-room"
        >
          <span>Search</span>
          <Search size={20} />
        </button>
      </div>

      {/* Renders FindRoommatesPage inside a Modal */}
      <Modal 
        isOpen={isRoommatesModalOpen} 
        onClose={toggleRoommatesModal} 
        title="Find Roommates (Swipe)"
      >
        <FindRoommatesPage />
      </Modal>

      {/* Renders FindRoomsPage inside a Modal */}
      <Modal 
        isOpen={isRoomsModalOpen} 
        onClose={toggleRoomsModal} 
        title="Find Available Rooms"
      >
        <FindRoomPage />
      </Modal>
    </div>
  );
};

export default TenantDashboard;