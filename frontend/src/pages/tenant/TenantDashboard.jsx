// your-project/src/pages/tenant/TenantDashboard.jsx

import React, { useState } from 'react';
// ----------------------------------------------------
// Import reusable component
// ----------------------------------------------------
import InputField from '../../components/common/Input';
import Button from '../../components/common/Button';     
import RoomCard from '../../components/room/RoomCard';

import './TenantDashboard.css'; 
import { mockRoomData } from '../../data/MockData'; // Assuming usage of temporary data

/*** 
 Tenant Dashboard Component
 ***/
const TenantDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Eventhandler for search
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        // Enter actual API calls here
        console.log(`Searching for: ${searchTerm}`);
    };
    
    // Eventhandler for click routing
    const handleCardClick = (roomId) => {
        // Enter actual routing logic below.
        console.log(`Navigating to Room Details for ID: ${roomId}`);
    };

    return (
        <div className="tenant-dashboard-container">
            {/* ---------------------------------------------------- */}
            {/* A. Header / Main Search Area */}
            {/* ---------------------------------------------------- */}
            <header className="dashboard-search-header">
                {/* 
                Header can be made into component - currently making it onto the page.
                */}
                <h1>Find Your Next Home</h1>
                
                <div className="main-search-wrapper">
                    <InputField
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Location, Price Range, or Keywords..."
                        variant="large-search" 
                    />
                    <Button 
                        text="Search" 
                        variant="primary" 
                        icon_name="search" 
                        onClick={handleSearchSubmit}
                    />
                </div>
                
                {/* Rooms Search filter bar Placeholder */}
                <div className="filter-placeholder">
                    {/* Where filters locate */}
                    <p>Advanced Filters: Budget, Move-in Date, Preferences...</p>
                </div>
            </header>

            {/* ---------------------------------------------------- */}
            {/* B. Listing Grid for rooms */}
            {/* ---------------------------------------------------- */}
            <main className="listing-grid-section">
                <h2>Recommended Listings ({mockRoomData.length} available)</h2>
                <div className="listing-grid">
                    {/* Render room data with RoomCard component */}
                    {mockRoomData.map((room) => (
                        <RoomCard
                            key={room.id}
                            room_data={room}
                            is_bookmarked={room.isBookmarked}
                            onToggleBookmark={() => console.log(`Bookmark toggled for room ${room.id}`)}
                            onClickCard={() => handleCardClick(room.id)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TenantDashboard;