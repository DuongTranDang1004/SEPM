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
    </div>
  );
}

export default RoomDetailPage;
