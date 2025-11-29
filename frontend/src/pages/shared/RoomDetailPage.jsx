import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, Calendar, Bookmark, ChevronLeft, Loader,
  Home, Bed, Bath, CheckCircle, XCircle
} from 'lucide-react';
import roomService from "../../services/roomService";
import landlordService from "../../services/landlordService";
import tenantService from "../../services/tenantService";

const formatVnd = (n) =>
  !n
    ? ""
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(n);

function RoomDetailPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Room data
  const [room, setRoom] = useState(location.state?.room || null);
  const [formRoom, setFormRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // UI states
  const [loading, setLoading] = useState(!location.state?.room);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState(null);

  // Determine user role
  const isTenant = currentUser.role === 'tenant';
  const isOwnerLandlord =
    currentUser.role === 'landlord' &&
    currentUser.userId === room?.landlordId;

  // ✅ Fetch room data by ID if not passed via location.state
  useEffect(() => {
    if (!room && roomId) {
      fetchRoomById();
    }
  }, [room, roomId]);

  // ✅ Check if room is bookmarked (tenant only)
  useEffect(() => {
    if (room && isTenant) {
      checkIfBookmarked();
    }
  }, [room, isTenant]);

  const fetchRoomById = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await roomService.getRoomById(roomId);
      console.log('Fetched room:', data);
      setRoom(data);
    } catch (err) {
      console.error('Error fetching room:', err);
      setError(err.response?.data?.message || 'Room not found');
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkIfBookmarked = async () => {
    try {
      const bookmarks = await tenantService.getBookmarks();
      const isBookmarked = bookmarks.some(b => 
        (b.room?.id || b.roomId) === room.id
      );
      setBookmarked(isBookmarked);
    } catch (err) {
      console.error('Error checking bookmark status:', err);
    }
  };

  // Initialize form data when room loads
  useEffect(() => {
    if (!room) return;

    setFormRoom({
      id: room.id,
      title: room.title || "",
      description: room.description || "",
      rentPricePerMonth: room.rentPricePerMonth || "",
      minimumStayMonths: room.minimumStayMonths || 1,
      address: room.address || "",
      latitude: room.latitude || "",
      longitude: room.longitude || "",
      numberOfToilets: room.numberOfToilets || 1,
      numberOfBedRooms: room.numberOfBedRooms || 1,
      hasWindow: typeof room.hasWindow === "boolean" ? room.hasWindow : true,
      status: room.status || "PUBLISHED",
      landlordId: room.landlordId,
      thumbnailUrl: room.thumbnailUrl,
      imageUrls: room.imageUrls || [],
      videoUrls: room.videoUrls || [],
    });
  }, [room]);

  /* ---------- Form handlers ---------- */
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? e.target.valueAsNumber || "" : e.target.value;
    setFormRoom((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (field) => (e) => {
    setFormRoom((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSelect = (field) => (e) => {
    setFormRoom((prev) => ({ ...prev, [field]: e.target.value }));
  };

  /* ---------- Save edit ---------- */
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Basic fields matching backend parameter names
    formData.append('title', formRoom.title);
    formData.append('description', formRoom.description || '');
    formData.append('rentPricePerMonth', Number(formRoom.rentPricePerMonth) || 0);
    formData.append('minimumStayMonths', formRoom.minimumStayMonths || 1);
    formData.append('address', formRoom.address);

    if (formRoom.latitude) formData.append('latitude', formRoom.latitude);
    if (formRoom.longitude) formData.append('longitude', formRoom.longitude);

    formData.append('numberOfToilets', formRoom.numberOfToilets || 1);
    formData.append('numberOfBedRooms', formRoom.numberOfBedRooms || 1);
    formData.append('hasWindow', formRoom.hasWindow);
    formData.append('status', formRoom.status);

    try {
      setSaving(true);
      setSaveMessage("");
      setError(null);

      const updatedRoom = await landlordService.updateRoom(formRoom.id, formData);

      console.log('Room updated successfully:', updatedRoom);

      setRoom(updatedRoom);
      setFormRoom(updatedRoom);
      setSaving(false);
      setIsEditing(false);
      setSaveMessage("Room updated successfully.");

      setTimeout(() => setSaveMessage(""), 3000);

    } catch (err) {
      console.error('Failed to update room:', err);
      setSaving(false);
      setError(err.response?.data?.message || 'Failed to update room');
      setSaveMessage("Failed to update room. Please try again.");

      setTimeout(() => setSaveMessage(""), 3000);

      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  /* ---------- Bookmark handling (tenant) ---------- */
  const handleToggleBookmark = async () => {
    if (!isTenant) {
      alert('Only tenants can bookmark rooms');
      return;
    }

    setBookmarking(true);

    try {
      if (bookmarked) {
        await tenantService.removeBookmark(room.id);
        setBookmarked(false);
        
        window.dispatchEvent(new CustomEvent('dashboardActivity', {
          detail: { type: 'unbookmark', data: { roomId: room.id, roomTitle: room.title } }
        }));
      } else {
        await tenantService.addBookmark(room.id);
        setBookmarked(true);
        
        window.dispatchEvent(new CustomEvent('dashboardActivity', {
          detail: { type: 'bookmark', data: { roomId: room.id, roomTitle: room.title } }
        }));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      alert(err.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading room details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !formRoom) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Room Not Found</h3>
          <p className="text-red-600 mb-4">{error || 'This room does not exist or has been removed'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayImage = formRoom.thumbnailUrl || formRoom.imageUrls?.[0] || 
    'https://placehold.co/1200x600/14B8A6/FFFFFF?text=Room+Image';

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-teal-50 to-white">
      {/* Overlay saving */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
            <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">Saving your changes…</p>
            <p className="text-sm text-gray-600">
              Please wait while we update your room.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800"><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Success message */}
        {saveMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800"><strong>Success:</strong> {saveMessage}</p>
          </div>
        )}

        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <img
            src={displayImage}
            alt={formRoom.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/1200x600/14B8A6/FFFFFF?text=Room+Image';
            }}
          />
          
          {/* Bookmark Button (Tenant Only) */}
          {isTenant && (
            <button
              onClick={handleToggleBookmark}
              disabled={bookmarking}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition ${
                bookmarked
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-teal-50'
              } ${bookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {bookmarking ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <Bookmark className="w-6 h-6" fill={bookmarked ? 'currentColor' : 'none'} />
              )}
            </button>
          )}

          {/* Status Badge */}
          {formRoom.status && (
            <div className={`absolute top-4 left-4 px-4 py-2 rounded-full font-semibold text-sm shadow-lg ${
              formRoom.status === 'PUBLISHED'
                ? 'bg-green-500 text-white'
                : formRoom.status === 'RENTED'
                ? 'bg-red-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {formRoom.status}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {formRoom.title || "Room Title"}
              </h1>
              
              {formRoom.address && (
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-teal-500" />
                  {formRoom.address}
                </p>
              )}

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-teal-600">
                  {formRoom.rentPricePerMonth?.toLocaleString('vi-VN')}
                </span>
                <span className="text-4xl font-bold text-teal-600">₫</span>
                <span className="text-xl text-gray-500">/month</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg">
                  <Bed className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-xs text-gray-600">Bedrooms</p>
                    <p className="font-semibold text-gray-900">{formRoom.numberOfBedRooms}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Bath className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Bathrooms</p>
                    <p className="font-semibold text-gray-900">{formRoom.numberOfToilets}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Min. Stay</p>
                    <p className="font-semibold text-gray-900">{formRoom.minimumStayMonths}mo</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  {formRoom.hasWindow ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Window</p>
                    <p className="font-semibold text-gray-900">
                      {formRoom.hasWindow ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnerLandlord && (
                <div className="mt-6">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition"
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Room Details'}
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            {!isEditing && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Room</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {formRoom.description || "No description provided."}
                </p>
              </div>
            )}

            {/* Edit Form (Owner Only) */}
            {isOwnerLandlord && isEditing && (
              <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Room Details</h2>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formRoom.title}
                      onChange={handleChange("title")}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={formRoom.description}
                      onChange={handleChange("description")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={formRoom.address}
                      onChange={handleChange("address")}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent (₫) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formRoom.rentPricePerMonth}
                        onChange={handleChange("rentPricePerMonth")}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min. Stay (months) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formRoom.minimumStayMonths}
                        onChange={handleChange("minimumStayMonths")}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formRoom.numberOfBedRooms}
                        onChange={handleChange("numberOfBedRooms")}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formRoom.numberOfToilets}
                        onChange={handleChange("numberOfToilets")}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formRoom.status}
                        onChange={handleSelect("status")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="HIDDEN">Hidden</option>
                        <option value="RENTED">Rented</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="hasWindow"
                        checked={formRoom.hasWindow}
                        onChange={handleCheckbox("hasWindow")}
                        className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label htmlFor="hasWindow" className="text-sm font-medium text-gray-700">
                        Has Window
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>

          {/* Right: Landlord Info & Media */}
          <div className="space-y-6">
            {/* Landlord Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Landlord</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-2xl">
                  🧑🏻‍💼
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Property Owner</p>
                  <p className="text-sm text-teal-600">Verified landlord</p>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            {(formRoom.imageUrls?.length > 0 || formRoom.videoUrls?.length > 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Media</h3>
                
                {formRoom.imageUrls?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      📷 {formRoom.imageUrls.length} photo{formRoom.imageUrls.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {formRoom.videoUrls?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">
                      🎥 {formRoom.videoUrls.length} video tour{formRoom.videoUrls.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {(formRoom.latitude && formRoom.longitude) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                <p className="text-sm text-gray-600">
                  <strong>Coordinates:</strong><br />
                  {formRoom.latitude}, {formRoom.longitude}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailPage;