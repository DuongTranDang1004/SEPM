import React from 'react';
// import './RoomDetails.css'; // CSS

/**
 * RoomDetailsPage Component displays room details and landlord information
 */
function RoomDetailsPage() {
  // Dummy data Room details
  const roomDetails = {
    name: "Room 1",
    image: "https://via.placeholder.com/200x150/D3D3D3?text=Room+Interior",
    address: "---",
    price: "---",
    minStay: "---",
    availableFrom: "---",
    numToilets: "---",
    status: "Available",
    windows: "yes",
    updatedOn: "DD/MM/YYYY"
  };

  // Landlord info dummy data
  const landlordDetails = {
    name: "Jane Doe",
    avatar: "https://via.placeholder.com/150/FF69B4/FFFFFF?text=Jane",
    description: "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus."
  };

  // Page moving and Bookmark handler
  const handleReturn = () => {
    alert("Routing back to Room search.");
    // Actual routing Logic: history.goBack() or history.push('/find-rooms')
  };

  const toggleBookmark = () => {
    alert("Bookmarked this room.");
    // TODO : Enter status update logic here
  };

  // Placeholder component for room details
  const RoomInfoCard = ({ details }) => (
    <div className="info-card room-info-card">
      <div className="info-card-image">
        <img src={details.image} alt={details.name} />
      </div>
      <div className="info-card-details">
        <h3 className="card-name">{details.name}</h3>
        <p><strong>Address:</strong> {details.address}</p>
        <p><strong>Price:</strong> {details.price}</p>
        <p><strong>Min. months of stay:</strong> {details.minStay}</p>
        <p><strong>Available from:</strong> {details.availableFrom}</p>
        <p><strong>Number of toilets:</strong> {details.numToilets}</p>
        <p><strong>Status:</strong> {details.status}</p>
        <p><strong>Windows:</strong> {details.windows}</p>
        <p className="update-date">Updated on: {details.updatedOn}</p>
      </div>
    </div>
  );

  // Placeholder component for landlord info
  const LandlordInfoCard = ({ details }) => (
    <div className="info-card landlord-info-card">
      <div className="info-card-avatar">
        <img src={details.avatar} alt={details.name} />
      </div>
      <div className="info-card-details">
        <h3 className="card-name">{details.name}</h3>
        <p>{details.description}</p>
      </div>
    </div>
  );

  return (
    <div className="main-layout-flex-container">
      
      {/* Sidebar Placeholder */}
      <aside className="sidebar-placeholder">
        {/* ... Sidebar like other pages, enter component here... */}
        <h2 className="logo-sidebar">Broomate</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#home">Broomates</a></li>
            <li><a href="#find-roommates">Find Roommates</a></li>
            <li><a href="#bookmarks-roommates">Bookmarks</a></li>
            <li><a href="#blocked">Blocked</a></li>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <li><a href="#rooms">Rooms</a></li>
            <li><a href="#find-rooms">Find Rooms</a></li>
            <li><a href="#bookmarks-rooms">Bookmarks</a></li>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <li><a href="#chats">Chats</a></li>
            <li><a href="#manage-chats">Manage Chats</a></li>
          </ul>
        </nav>
        <div className="sign-out-placeholder">Sign Out</div>
      </aside>

      {/* Main content */}
      <main className="content-area-details-flex">
        <RoomInfoCard details={roomDetails} />
        <LandlordInfoCard details={landlordDetails} />
        <div className="details-actions">
          <button className="action-button return-button" onClick={handleReturn}>Return</button>
          
          <button className="bookmark-icon-large" onClick={toggleBookmark}>
            🔖
          </button>
        </div>
      </main>
    </div>
  );
}

export default RoomDetailsPage;