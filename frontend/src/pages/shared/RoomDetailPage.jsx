// src/pages/shared/RoomDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import landlordService from "../../services/landlordService";
import tenantService from "../../services/tenantService";
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
  const [bookmarked, setBookmarked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState(null);

  // Determine user role
  const isTenant = currentUser.role === 'tenant';
  const isOwnerLandlord =
    currentUser.role === 'landlord' &&
    currentUser.userId === room?.landlordUserId;

  // Fetch room data if not passed via location.state
  useEffect(() => {
    if (!room) {
      console.warn(
        "No room passed via location.state. You may want to fetch by roomId from API:",
        roomId
      );
      // TODO: Add API call to fetch room by ID
      // const fetchRoom = async () => {
      //   try {
      //     const data = await roomService.getRoomById(roomId);
      //     setRoom(data);
      //   } catch (err) {
      //     setError(err.response?.data?.message || 'Room not found');
      //   }
      // };
      // fetchRoom();
    }
  }, [room, roomId]);

  // Initialize form data when room loads
  useEffect(() => {
    if (!room) return;

    setFormRoom({
      id: room.id,
      title: room.title || "",
      description: room.description || "",
      rentPricePerMonth: room.rentPricePerMonth || room.pricePerMonth || "",
      minimumStayMonths: room.minimumStayMonths || room.minStayMonths || 1,
      address: room.address || "",
      latitude: room.latitude || "",
      longitude: room.longitude || "",
      numberOfToilets: room.numberOfToilets || 1,
      numberOfBedRooms: room.numberOfBedRooms || 1,
      hasWindow: typeof room.hasWindow === "boolean" ? room.hasWindow : true,
      status: room.status || "PUBLISHED",
      landlordUserId: room.landlordUserId,
      district: room.district,
      distanceKm: room.distanceKm,
      imgUrl: room.imgUrl || FALLBACK_IMG,
      landlordName: room.landlordName,
      landlordAvatar: room.landlordAvatar,
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
    try {
      if (bookmarked) {
        await tenantService.removeBookmark(room.id);
        setBookmarked(false);
      } else {
        await tenantService.addBookmark(room.id);
        setBookmarked(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      alert(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

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

  const previewUrl = formRoom.imgUrl || FALLBACK_IMG;

  return (
    <div className="roomDetail-page">
      {/* Overlay saving */}
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

      {/* Error message */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          color: '#991b1b'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Hero section */}
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
                ~{formRoom.distanceKm} km away
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

          {/* Action buttons */}
          <div className="rd-actions">
            {isTenant && (
              <button
                type="button"
                className={
                  "rd-btn " +
                  (bookmarked ? "rd-btn-outline" : "rd-btn-primary")
                }
                onClick={handleToggleBookmark}
              >
                {bookmarked ? "Remove bookmark" : "Add to bookmark"}
              </button>
            )}

            {isOwnerLandlord && (
              <button
                type="button"
                className="rd-btn rd-btn-primary-room"
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

      {/* Main content */}
      <div className="rd-grid">
        {/* LEFT: view or edit form */}
        <div className="rd-left">
          {isOwnerLandlord && isEditing ? (
            <form className="upload-form" onSubmit={handleSaveEdit}>
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
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="upload-field">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={formRoom.description}
                    onChange={handleChange("description")}
                    placeholder="Short description..."
                  />
                </div>
              </section>

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

        {/* RIGHT: landlord info */}
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
    </div>
  );
}

export default RoomDetailPage;
