import React from 'react';
const RoomCard = ({ listing }) => { 
  // basic structure to prevent errors
  return (
    <div className="room-card">
      {/* display title after checking listing */}
      <h3>{listing ? listing.title : 'Notitle'}</h3>
      <p>Temporary card component</p>
    </div>
  );
};

export default RoomCard; 