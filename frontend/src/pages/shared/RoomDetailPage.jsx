<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck,
  MapPin, 
  MessageSquare,
  Calendar,
  Bed,
  Bath,
  Maximize2,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Share2,
  Loader,
  ChevronLeft,
  ChevronRight,
  Play,
  X
} from 'lucide-react';
import roomService from '../../services/roomService';
import tenantService from '../../services/tenantService';
import messageService from '../../services/messageService';

function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // State
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
    checkIfBookmarked();
  }, [roomId]);

  // ✅ Fetch room details using service
  const fetchRoomDetails = async () => {
    try {
      const data = await roomService.getRoomById(roomId);
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room:', error);
      if (error.response?.status === 404) {
        alert('Room not found');
        navigate('/dashboard/tenant/find-rooms');
      } else {
        alert('Error loading room details. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Check if room is bookmarked using service
  const checkIfBookmarked = async () => {
    try {
      const bookmarks = await tenantService.getBookmarks();
      const isBookmarked = bookmarks.some(bookmark => 
        bookmark.room?.id === roomId || bookmark.roomId === roomId
      );
      setIsBookmarked(isBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  // ✅ Toggle bookmark using service
  const handleToggleBookmark = async () => {
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await tenantService.removeBookmark(roomId);
      } else {
        await tenantService.addBookmark(roomId);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  // ✅ Contact landlord - create conversation using service
  const handleContactLandlord = async () => {
    setIsCreatingConversation(true);

    try {
      // Create or get existing conversation with landlord
      const conversation = await messageService.createOrGetConversation(room.landlordId);
      
      // Navigate to messages page with conversation
      navigate('/dashboard/messages', {
        state: {
          conversationId: conversation.conversationId,
          recipientName: room.landlordName
        }
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Image navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? room.imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === room.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  // Video modal
  const handlePlayVideo = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoUrl('');
  };

  // Format currency (VND)
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Immediately';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center">
          <p className="text-gray-600 font-medium mb-4">Room not found</p>
          <button
            onClick={() => navigate('/dashboard/tenant/find-rooms')}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const hasImages = room.imageUrls && room.imageUrls.length > 0;
  const hasVideos = room.videoUrls && room.videoUrls.length > 0;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-teal-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  isBookmarked
                    ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600 hover:text-teal-600'
                } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {bookmarkLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {isBookmarked ? 'Saved' : 'Save'}
                </span>
              </button>

              <button
                onClick={() => {
                  alert('Share functionality coming soon!');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Image Gallery */}
        {hasImages && (
          <div className="mb-8">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden" style={{ height: '500px' }}>
              <img
                src={room.imageUrls[currentImageIndex]}
                alt={`${room.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { 
                  e.target.src = 'https://placehold.co/800x600/E0E0E0/666666?text=No+Image'; 
                }}
              />

              {/* Image Navigation */}
              {room.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {room.imageUrls.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {room.imageUrls.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {room.imageUrls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === index
                        ? 'border-teal-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        e.target.src = 'https://placehold.co/200x200/E0E0E0/666666?text=No+Image'; 
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Gallery */}
        {hasVideos && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Tour</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {room.videoUrls.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handlePlayVideo(video)}
                  className="relative flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden bg-gray-900 hover:opacity-90 transition group"
                >
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-teal-600 ml-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{room.address}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-teal-600">
                  {formatCurrency(room.rentPricePerMonth)}
                </span>
                <span className="text-2xl font-bold text-teal-600">₫</span>
                <span className="text-gray-600">/month</span>
              </div>
              {room.depositAmount > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Security Deposit: {formatCurrency(room.depositAmount)}₫
                </p>
              )}
            </div>

            {/* Key Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold text-gray-900">{room.numberOfBedRooms || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold text-gray-900">{room.numberOfToilets || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Maximize2 className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Floor Area</p>
                    <p className="font-semibold text-gray-900">{room.floorArea || 'N/A'} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(room.availableFrom)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Min. Stay</p>
                  <p className="font-semibold text-gray-900">{room.minimumStayMonths || 0} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Furnishing</p>
                  <p className="font-semibold text-gray-900">{room.furnishingStatus || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pet Policy</p>
                  <p className="font-semibold text-gray-900">
                    {room.petAllowed ? 'Pets Allowed' : 'No Pets'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {room.description || 'No description available.'}
              </p>
            </div>

            {/* Window Feature */}
            {room.hasWindow !== undefined && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  {room.hasWindow ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Has Window</p>
                        <p className="text-sm text-gray-600">This room has natural lighting</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">No Window</p>
                        <p className="text-sm text-gray-600">This room doesn't have a window</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Smoking Policy */}
            {room.smokingAllowed !== undefined && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  {room.smokingAllowed ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Smoking Allowed</p>
                        <p className="text-sm text-gray-600">This property allows smoking</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-gray-900">No Smoking</p>
                        <p className="text-sm text-gray-600">This is a smoke-free property</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Landlord Info & Actions */}
          <div className="space-y-6">
            {/* Landlord Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Landlord</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{room.landlordName || 'Owner'}</p>
                  <p className="text-sm text-gray-600">Property Owner</p>
                </div>
              </div>

              {room.landlordEmail && (
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-teal-600" />
                    <span className="text-sm">{room.landlordEmail}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleContactLandlord}
                disabled={isCreatingConversation}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingConversation ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
                <p className="text-xs text-gray-600 text-center">
                  Message the landlord to schedule a viewing or ask questions
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(room.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    room.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {room.status || 'Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && currentVideoUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={handleCloseVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X className="w-8 h-8" />
            </button>
            <video
              src={currentVideoUrl}
              controls
              autoPlay
              className="w-full rounded-xl"
            />
          </div>
        </div>
      )}
=======
// src/pages/room/RoomDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./room-detail.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1505692794401-7a51e21c7c52?q=80&w=1600&auto=format&fit=crop";

const formatVnd = (n) =>
  !n
    ? ""
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(n);

// TODO: sau này thay bằng AuthContext
const currentUser = {
  id: "u3",
  name: "Truc",
  role: "tenant", // đổi qua "landlord" để test
};

function RoomDetailPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // room gốc (từ list hoặc sau này từ API)
  const [room, setRoom] = useState(location.state?.room || null);

  // state cho edit form (giống UploadRoomPage)
  const [formRoom, setFormRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // bookmark local fake
  const [bookmarked, setBookmarked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Nếu không nhận được room từ location.state → sau này chỗ này call API theo roomId
  useEffect(() => {
    if (!room) {
      console.warn(
        "No room passed via location.state. Later: fetch by roomId from API:",
        roomId
      );
      // Ví dụ sau này:
      // fetch(`/api/rooms/${roomId}`).then(...)
    }
  }, [room, roomId]);

  // Khi có room → chuẩn hoá formRoom giống UploadRoomPage
  useEffect(() => {
    if (!room) return;

    setFormRoom({
      id: room.id,
      title: room.title || "",
      description: room.description || "",
      rentPricePerMonth: room.pricePerMonth || room.rentPricePerMonth || "",
      minimumStayMonths: room.minStayMonths || room.minimumStayMonths || 1,
      address: room.address || "",
      latitude: room.latitude || "",
      longitude: room.longitude || "",
      numberOfToilets: room.numberOfToilets || 1,
      numberOfBedRooms: room.numberOfBedRooms || 1,
      hasWindow:
        typeof room.hasWindow === "boolean" ? room.hasWindow : true,
      status: room.status || "PUBLISHED",
      landlordUserId: room.landlordUserId,
      district: room.district,
      distanceKm: room.distanceKm,
      imgUrl: room.imgUrl || FALLBACK_IMG,
      landlordName: room.landlordName,
      landlordAvatar: room.landlordAvatar,
    });
  }, [room]);

  if (!formRoom) {
    return (
      <div className="roomDetail-page">
        <p>Room not found or loading…</p>
        <button
          type="button"
          className="rd-btn rd-btn-secondary"
          onClick={() => navigate(-1)}
        >
          ← Go back
        </button>
      </div>
    );
  }

  const isTenant = currentUser.role === "tenant";
  const isOwnerLandlord =
    currentUser.role === "landlord" &&
    currentUser.id === formRoom.landlordUserId;

  /* ---------- form handlers (giống UploadRoomPage) ---------- */
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

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage("");

    const payload = {
      id: formRoom.id,
      title: formRoom.title,
      description: formRoom.description,
      rentPricePerMonth: Number(formRoom.rentPricePerMonth) || 0,
      minimumStayMonths: formRoom.minimumStayMonths || 1,
      address: formRoom.address,
      latitude: formRoom.latitude || null,
      longitude: formRoom.longitude || null,
      numberOfToilets: formRoom.numberOfToilets || 1,
      numberOfBedRooms: formRoom.numberOfBedRooms || 1,
      hasWindow: formRoom.hasWindow,
      status: formRoom.status,
    };

    console.log("UpdateRoomRequest from detail page:", payload);

    // fake API call
    setTimeout(() => {
      setSaving(false);
      setSaveMessage("Room updated successfully.");
      setRoom((prev) => ({ ...(prev || {}), ...payload }));
      setIsEditing(false);

      setTimeout(() => setSaveMessage(""), 2000);
    }, 800);
  };

  const previewUrl = formRoom.imgUrl || FALLBACK_IMG;

  return (
    <div className="roomDetail-page">
      {/* overlay saving */}
      {saving && (
        <div className="rd-overlay">
          <div className="rd-overlayCard">
            <div className="rd-spinner" />
            <p className="rd-overlayTitle">Saving your changes…</p>
            <p className="rd-overlaySub">
              Please wait while we validate data and update your room.
            </p>
          </div>
        </div>
      )}

      <div className="rd-hero">
        <div className="rd-heroImageWrap">
          <img src={previewUrl} alt={formRoom.title} className="rd-heroImage" />
        </div>
        <div className="rd-heroInfo">
          <button
            type="button"
            className="rd-backBtn"
            onClick={() => navigate(-1)}
          >
            ← Back to list
          </button>

          <h1 className="rd-title">{formRoom.title || "Room title"}</h1>
          <p className="rd-address">{formRoom.address || "Address"}</p>

          <div className="rd-metaRow">
            <span className="rd-priceTag">
              {formRoom.rentPricePerMonth
                ? formatVnd(formRoom.rentPricePerMonth) + " / month"
                : "Price not set"}
            </span>
            <span className="rd-chip">
              Min stay: {formRoom.minimumStayMonths || 1} months
            </span>
            {formRoom.district && (
              <span className="rd-chip">District: {formRoom.district}</span>
            )}
            {formRoom.distanceKm != null && (
              <span className="rd-chip">
                ~{formRoom.distanceKm} km from campus
              </span>
            )}
            {formRoom.status && (
              <span
                className={
                  "rd-status rd-status-" + formRoom.status.toLowerCase()
                }
              >
                {formRoom.status}
              </span>
            )}
          </div>

          {/* action buttons theo role */}
          <div className="rd-actions">
            {isTenant && (
              <button
                type="button"
                className={
                  "rd-btn rd-btn-primary rd-btn-big" +
                  (bookmarked ? " rd-btn-outline" : "")
                }
                onClick={() => setBookmarked((b) => !b)}
              >
                {bookmarked ? "Remove bookmark" : "Add to bookmark"}
              </button>
            )}

            {isOwnerLandlord && (
              <button
                type="button"
                className="rd-btn rd-btn-primary-room rd-btn-big"
                onClick={() => setIsEditing((v) => !v)}
              >
                {isEditing ? "Cancel edit" : "Edit room details"}
              </button>
            )}
          </div>

          {saveMessage && (
            <p className="rd-saveMessage rd-saveMessage-success">
              {saveMessage}
            </p>
          )}
        </div>
      </div>

      {/* MAIN CONTENT: 2 cột giống vibe UploadRoomPage */}
      <div className="rd-grid">
        {/* LEFT: VIEW / EDIT FORM */}
        <div className="rd-left">
          {isOwnerLandlord && isEditing ? (
            <form className="upload-form" onSubmit={handleSaveEdit}>
              {/* Basic details */}
              <section className="upload-section">
                <h3 className="upload-sectionTitle">Basic details</h3>

                <div className="upload-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formRoom.title}
                    onChange={handleChange("title")}
                    placeholder="Cozy 2BR Apartment"
                    required
                  />
                </div>

                <div className="upload-field">
                  <label>Address *</label>
                  <input
                    type="text"
                    value={formRoom.address}
                    onChange={handleChange("address")}
                    placeholder="Indiranagar, Bengaluru"
                    required
                  />
                </div>

                <div className="upload-field">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={formRoom.description}
                    onChange={handleChange("description")}
                    placeholder="Short description of the room, surroundings, etc."
                  />
                </div>
              </section>

              {/* Pricing & stay */}
              <section className="upload-section">
                <h3 className="upload-sectionTitle">Pricing & stay</h3>

                <div className="upload-row">
                  <div className="upload-field">
                    <label>Rent / month (VND) *</label>
                    <input
                      type="number"
                      min="0"
                      value={formRoom.rentPricePerMonth}
                      onChange={handleChange("rentPricePerMonth")}
                      placeholder="5000000"
                      required
                    />
                  </div>

                  <div className="upload-field">
                    <label>Minimum stay (months) *</label>
                    <input
                      type="number"
                      min="1"
                      value={formRoom.minimumStayMonths}
                      onChange={handleChange("minimumStayMonths")}
                      placeholder="6"
                      required
                    />
                  </div>
                </div>

                <div className="upload-row">
                  <div className="upload-field">
                    <label>Status *</label>
                    <select
                      value={formRoom.status}
                      onChange={handleSelect("status")}
                      required
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="HIDDEN">Hidden</option>
                    </select>
                  </div>

                  <div className="upload-field upload-checkboxField">
                    <label>Has window</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={formRoom.hasWindow}
                        onChange={handleCheckbox("hasWindow")}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </section>

              {/* Layout & location */}
              <section className="upload-section">
                <h3 className="upload-sectionTitle">Layout & location</h3>

                <div className="upload-row">
                  <div className="upload-field">
                    <label>Bedrooms *</label>
                    <input
                      type="number"
                      min="1"
                      value={formRoom.numberOfBedRooms}
                      onChange={handleChange("numberOfBedRooms")}
                      required
                    />
                  </div>

                  <div className="upload-field">
                    <label>Toilets *</label>
                    <input
                      type="number"
                      min="1"
                      value={formRoom.numberOfToilets}
                      onChange={handleChange("numberOfToilets")}
                      required
                    />
                  </div>
                </div>

                <div className="upload-row">
                  <div className="upload-field">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formRoom.latitude}
                      onChange={handleChange("latitude")}
                      placeholder="10.7769"
                    />
                  </div>

                  <div className="upload-field">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formRoom.longitude}
                      onChange={handleChange("longitude")}
                      placeholder="106.7009"
                    />
                  </div>
                </div>
              </section>

              <button type="submit" className="upload-submit">
                Save changes
              </button>
            </form>
          ) : (
            // VIEW MODE: show info read-only
            <div className="rd-readonly">
              <section className="rd-section">
                <h3 className="rd-sectionTitle">About this room</h3>
                <p className="rd-sectionText">
                  {formRoom.description ||
                    "No description provided by landlord yet."}
                </p>
              </section>

              <section className="rd-section">
                <h3 className="rd-sectionTitle">Key details</h3>
                <div className="rd-detailGrid">
                  <div className="rd-detailItem">
                    <span className="rd-detailLabel">Monthly rent</span>
                    <span className="rd-detailValue">
                      {formRoom.rentPricePerMonth
                        ? formatVnd(formRoom.rentPricePerMonth)
                        : "Not set"}
                    </span>
                  </div>
                  <div className="rd-detailItem">
                    <span className="rd-detailLabel">Minimum stay</span>
                    <span className="rd-detailValue">
                      {formRoom.minimumStayMonths || 1} months
                    </span>
                  </div>
                  <div className="rd-detailItem">
                    <span className="rd-detailLabel">Bedrooms</span>
                    <span className="rd-detailValue">
                      {formRoom.numberOfBedRooms || 1}
                    </span>
                  </div>
                  <div className="rd-detailItem">
                    <span className="rd-detailLabel">Toilets</span>
                    <span className="rd-detailValue">
                      {formRoom.numberOfToilets || 1}
                    </span>
                  </div>
                  <div className="rd-detailItem">
                    <span className="rd-detailLabel">Has window</span>
                    <span className="rd-detailValue">
                      {formRoom.hasWindow ? "Yes" : "No"}
                    </span>
                  </div>
                  {formRoom.latitude && formRoom.longitude && (
                    <div className="rd-detailItem">
                      <span className="rd-detailLabel">Coordinates</span>
                      <span className="rd-detailValue">
                        {formRoom.latitude}, {formRoom.longitude}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* RIGHT: LANDLORD ONLY */}
        <div className="rd-right">
          <section className="rd-landlordCard">
            <h3 className="rd-sectionTitle">Landlord</h3>
            <div className="rd-landlordInfo">
              <div className="rd-landlordAvatar">
                {formRoom.landlordAvatar || "🧑🏻‍💼"}
              </div>
              <div>
                <p className="rd-landlordName">
                  {formRoom.landlordName || "Landlord name"}
                </p>
                <p className="rd-landlordRole">Verified landlord</p>
              </div>
            </div>
          </section>
        </div>
      </div>
>>>>>>> origin/Truc_Frontend_Landlords
    </div>
  );
}

<<<<<<< HEAD
export default RoomDetailPage;
=======
export default RoomDetailPage;
>>>>>>> origin/Truc_Frontend_Landlords
