import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';

function RoomDetailPage() {
  const navigate = useNavigate();
  const { roomId } = useParams(); // Get room ID from URL
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // TODO: Get user role from auth context/state
  // For now, we'll determine from the route
  const userRole = window.location.pathname.includes('/tenant') ? 'tenant' : 'landlord';

  // TODO: Fetch room data from API using roomId
  // Mock data based on CreateRoomRequest DTO
  const roomData = {
    id: roomId || '123',
    title: 'Cozy Studio Apartment in District 1',
    description: 'Beautiful modern studio apartment with all amenities. Perfect for students or young professionals. Close to public transport, shopping centers, and restaurants. Fully furnished with AC, WiFi, and kitchen appliances.',
    rentPricePerMonth: 450,
    minimumStayMonths: 3,
    address: '123 Nguyen Hue Street, Ben Nghe Ward, District 1, Ho Chi Minh City',
    latitude: 10.7758,
    longitude: 106.7017,
    numberOfToilets: 1,
    numberOfBedRooms: 1,
    hasWindow: true,
    hasBalcony: true,
    hasWashingMachine: true,
    hasAirConditioner: true,
    hasWifi: true,
    thumbnail: 'https://via.placeholder.com/800x600/FF69B4/FFFFFF?text=Room+Thumbnail',
    images: [
      'https://via.placeholder.com/800x600/FF69B4/FFFFFF?text=Image+1',
      'https://via.placeholder.com/800x600/20B2AA/FFFFFF?text=Image+2',
      'https://via.placeholder.com/800x600/9370DB/FFFFFF?text=Image+3',
      'https://via.placeholder.com/800x600/FF6347/FFFFFF?text=Image+4'
    ],
    landlord: {
      id: 'landlord-456',
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/100/4A90E2/FFFFFF?text=JD',
      phone: '+84 912 345 678',
      email: 'john.doe@example.com'
    },
    status: 'available', // 'available', 'rented', 'draft'
    createdAt: '2025-01-10',
    updatedAt: '2025-01-15'
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Call API to bookmark/unbookmark room
    console.log(isBookmarked ? 'Removed bookmark' : 'Added bookmark');
  };

  const handleEdit = () => {
    navigate(`/dashboard/landlord/edit-room/${roomId}`);
  };

  const handleContactLandlord = () => {
    // TODO: Open messenger or create conversation
    console.log('Contact landlord:', roomData.landlord.id);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  // Check if current user owns this room
  const isOwnRoom = userRole === 'landlord'; // TODO: Compare with actual user ID

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image Gallery Section */}
          <div className="relative">
            {/* Main Thumbnail */}
            <div className="relative h-96 bg-gradient-to-br from-pink-200 to-purple-200">
              <img
                src={roomData.thumbnail}
                alt={roomData.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openImageModal(roomData.thumbnail)}
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  roomData.status === 'available' 
                    ? 'bg-green-500 text-white' 
                    : roomData.status === 'rented'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {roomData.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
              {roomData.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Room ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg cursor-pointer hover:opacity-75 transition"
                  onClick={() => openImageModal(image)}
                />
              ))}
            </div>
          </div>

          {/* Room Details Section */}
          <div className="p-8">
            {/* Header with Title and Actions */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {roomData.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{roomData.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {userRole === 'tenant' && (
                  <Button
                    variant={isBookmarked ? 'danger' : 'secondary'}
                    onClick={handleBookmark}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xl">
                      {isBookmarked ? '❤️' : '🤍'}
                    </span>
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                )}

                {userRole === 'landlord' && isOwnRoom && (
                  <Button
                    variant="primary"
                    onClick={handleEdit}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Room
                  </Button>
                )}
              </div>
            </div>

            {/* Price and Duration */}
            <div className="bg-gradient-to-r from-pink-50 to-teal-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                  <p className="text-3xl font-bold text-pink-600">
                    ${roomData.rentPricePerMonth}
                    <span className="text-sm text-gray-600 font-normal">/month</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Minimum Stay</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {roomData.minimumStayMonths}
                    <span className="text-sm text-gray-600 font-normal"> months</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Room Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-bold text-gray-900">{roomData.numberOfBedRooms}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🚽</span>
                  <div>
                    <p className="text-sm text-gray-600">Toilets</p>
                    <p className="font-bold text-gray-900">{roomData.numberOfToilets}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{roomData.hasWindow ? '🪟' : '❌'}</span>
                  <div>
                    <p className="text-sm text-gray-600">Window</p>
                    <p className="font-bold text-gray-900">{roomData.hasWindow ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{roomData.hasBalcony ? '🏠' : '❌'}</span>
                  <div>
                    <p className="text-sm text-gray-600">Balcony</p>
                    <p className="font-bold text-gray-900">{roomData.hasBalcony ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {roomData.hasAirConditioner && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2">
                    <span>❄️</span>
                    Air Conditioner
                  </span>
                )}
                {roomData.hasWifi && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full flex items-center gap-2">
                    <span>📶</span>
                    WiFi
                  </span>
                )}
                {roomData.hasWashingMachine && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full flex items-center gap-2">
                    <span>🧺</span>
                    Washing Machine
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {roomData.description}
              </p>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{roomData.address}</p>
                    {roomData.latitude && roomData.longitude && (
                      <p className="text-sm text-gray-600 mt-1">
                        Coordinates: {roomData.latitude}, {roomData.longitude}
                      </p>
                    )}
                  </div>
                </div>
                {/* TODO: Add Google Maps integration */}
                <div className="h-64 bg-gradient-to-br from-teal-200 to-blue-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">📍 Map view (Coming soon)</p>
                </div>
              </div>
            </div>

            {/* Landlord Info */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Landlord Information</h2>
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
                <img
                  src={roomData.landlord.avatar}
                  alt={roomData.landlord.name}
                  className="w-16 h-16 rounded-full border-2 border-pink-300"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{roomData.landlord.name}</h3>
                  <p className="text-sm text-gray-600">{roomData.landlord.email}</p>
                  <p className="text-sm text-gray-600">{roomData.landlord.phone}</p>
                </div>
                {userRole === 'tenant' && (
                  <Button
                    variant="primary"
                    onClick={handleContactLandlord}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact Landlord
                  </Button>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
              <span>Posted: {new Date(roomData.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(roomData.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Room Image"
        size="large"
      >
        <img
          src={selectedImage}
          alt="Room"
          className="w-full h-auto rounded-lg"
        />
      </Modal>
    </div>
  );
}

export default RoomDetailPage;