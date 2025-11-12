import React, { useState } from 'react';
import './FindRoomsPage.css';

/**
 * FindRoomsPage Component displays and filters Room lists
 */
function FindRoomsPage() {
  // Dummy data placeholder for filters
  const [filters, setFilters] = useState({
    location: 'Ascending',
    price: 'Lowest',
    district: 'District 7',
    bookmarked: 'Yes',
  });

  // Room list dummy data
  const rooms = [
    {
      id: 1,
      name: "Room 1",
      image: "https://via.placeholder.com/150x100/D3D3D3?text=Room+Image",
      address: "----",
      minStay: "---",
      price: "---",
      landlord: "User1",
      isBookmarked: false,
    },
    {
      id: 2,
      name: "Room 1",
      image: "https://via.placeholder.com/150x100/D3D3D3?text=Room+Image",
      address: "----",
      minStay: "---",
      price: "---",
      landlord: "User1",
      isBookmarked: true, // Bookmarked example
    },
    {
      id: 3,
      name: "Room 1",
      image: "https://via.placeholder.com/150x100/D3D3D3?text=Room+Image",
      address: "----",
      minStay: "---",
      price: "---",
      landlord: "User1",
      isBookmarked: false,
    },
  ];

  // Dummy handler for filter dropdown
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    console.log(`Filter ${filterName} changed to ${value}`);
  };

  // Details page routing handler(without routing logic)
  const goToRoomDetails = (roomId) => {
    alert(`Room ID ${roomId}의 상세 정보 페이지로 이동합니다.`);
    // history.push(`/rooms/${roomId}`); // To be used for real routing
  };
  
  // Bookmark toggle handler
  const toggleBookmark = (roomId) => {
    alert(`Room ID ${roomId}의 북마크 상태를 토글합니다.`);
    // TODO : Enter status update logic here
  };


  // Placeholder component for room status display
  const RoomListingCard = ({ room }) => (
    <div className="room-listing-card">
      <div className="card-content-left">
        {/* Room name click will route to room details*/}
        <h3 className="room-name" onClick={() => goToRoomDetails(room.id)}>
          {room.name}
        </h3>
        {/* Room pic click will route to room details */}
        <div className="room-image" onClick={() => goToRoomDetails(room.id)}>
          <img src={room.image} alt={room.name} />
        </div>
      </div>
      
      <div className="card-content-right">
        <div className="room-details">
          <p><strong>Address:</strong> {room.address}</p>
          <p><strong>Min. Month of Stay:</strong> {room.minStay}</p>
          <p><strong>Price per month:</strong> {room.price}</p>
          <p><strong>Landlord:</strong> {room.landlord} 🧑🏻‍🎤</p>
        </div>
        
        {/* Bookmark Button */}
        <button 
          className={`bookmark-icon-button ${room.isBookmarked ? 'bookmarked' : ''}`}
          onClick={() => toggleBookmark(room.id)}
        >
          {/* Bookmark Icon */}
          {room.isBookmarked ? '☑️' : '☐'}
        </button>
      </div>
    </div>
  );


  return (
    <div className="main-layout-flex-container">
      
      {/* 1. 측면 내비게이션 바 (Sidebar Placeholder) */}
      <aside className="sidebar-placeholder">
        {/* ... Sidebar like other pages, enter component here ... */}
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

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="content-area-vertical-flex">
        
        {/* Search Filter Header */}
        <div className="filter-header">
          {/* 각 필터는 드롭다운 컴포넌트 Placeholder로 처리 */}
          <div className="filter-dropdown">
            <label>Located near you</label>
            <select value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          <div className="filter-dropdown">
            <label>Price per month</label>
            <select value={filters.price} onChange={(e) => handleFilterChange('price', e.target.value)}>
              <option value="Lowest">Lowest</option>
              <option value="Highest">Highest</option>
            </select>
          </div>
          <div className="filter-dropdown">
            <label>District No</label>
            <select value={filters.district} onChange={(e) => handleFilterChange('district', e.target.value)}>
              <option value="District 7">District 7</option>
              <option value="District 1">District 1</option>
            </select>
          </div>
          <div className="filter-dropdown">
            <label>Bookmarked</label>
            <select value={filters.bookmarked} onChange={(e) => handleFilterChange('bookmarked', e.target.value)}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          
          <button className="apply-filters-btn">Apply Filters</button>
        </div>
        
        {/* Room Listings Area */}
        <div className="room-listings">
          {rooms.map(room => (
            <RoomListingCard key={room.id} room={room} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default FindRoomsPage;