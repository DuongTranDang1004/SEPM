// src/pages/landlord/UploadRoomPage.jsx
import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PublishedRoomCard from "../../components/landlord/PublishedRoomCard";
import landlordService from "../../services/landlordService";
import Confetti from "react-confetti";
import "./upload-room.css";

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

export default function UploadRoomPage() {
  const navigate = useNavigate();

  const [room, setRoom] = useState({
    title: "",
    description: "",
    rentPricePerMonth: "",
    minimumStayMonths: 1,
    address: "",
    latitude: "",
    longitude: "",
    numberOfToilets: 1,
    numberOfBedRooms: 1,
    hasWindow: true,
  });

  // media state
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(null);
  const [error, setError] = useState(null);

  // input refs
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const docInputRef = useRef(null);

  // index preview
  const [currentIdx, setCurrentIdx] = useState({
    images: 0,
    videos: 0,
    docs: 0,
  });

  /* -------- helpers ---------- */
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? e.target.valueAsNumber || "" : e.target.value;
    setRoom((prev) => ({ ...prev, [field]: value }));
    setSubmitted(false);
  };

  const handleCheckbox = (field) => (e) => {
    setRoom((prev) => ({ ...prev, [field]: e.target.checked }));
    setSubmitted(false);
  };

  /* -------- media: add file ---------- */
  const addFiles = useCallback((type, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    if (type === "images") {
      setImages((prev) => {
        const merged = [...prev, ...files];
        if (merged.length > 3) {
          alert("Maximum 3 images allowed.");
          return merged.slice(0, 3);
        }
        return merged;
      });
      setCurrentIdx((prev) => ({ ...prev, images: 0 }));
    } else if (type === "videos") {
      setVideos((prev) => {
        const merged = [...prev, ...files];
        if (merged.length > 2) {
          alert("Maximum 2 videos allowed.");
          return merged.slice(0, 2);
        }
        return merged;
      });
      setCurrentIdx((prev) => ({ ...prev, videos: 0 }));
    } else if (type === "docs") {
      setDocuments((prev) => {
        const merged = [...prev, ...files];
        if (merged.length > 3) {
          alert("Maximum 3 documents allowed.");
          return merged.slice(0, 3);
        }
        return merged;
      });
      setCurrentIdx((prev) => ({ ...prev, docs: 0 }));
    }
    setSubmitted(false);
  }, []);

  const handleInputChange = (type) => (e) => {
    addFiles(type, e.target.files);
  };

  const handleDrop = (type) => (e) => {
    e.preventDefault();
    setDragOver(null);
    addFiles(type, e.dataTransfer.files);
  };

  const handleDragOver = (type) => (e) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (type) => (e) => {
    e.preventDefault();
    if (dragOver === type) setDragOver(null);
  };

  /* ---------- preview helpers ---------- */
  const getFilesByType = (type) => {
    if (type === "images") return images;
    if (type === "videos") return videos;
    return documents;
  };

  const setFilesByType = (type, updater) => {
    if (type === "images") setImages(updater);
    else if (type === "videos") setVideos(updater);
    else setDocuments(updater);
  };

  const stepPreview = (type, dir) => {
    setCurrentIdx((prev) => {
      const list = getFilesByType(type);
      const len = list.length;
      if (!len) return prev;

      const cur = prev[type] ?? 0;
      const next = (cur + dir + len) % len;
      return { ...prev, [type]: next };
    });
  };

  const removeFile = (type, index) => {
    setFilesByType(type, (prev) => {
      const next = prev.filter((_, i) => i !== index);

      setCurrentIdx((cur) => {
        const len = next.length;
        let newIdx = cur[type] ?? 0;
        if (newIdx >= len) newIdx = Math.max(len - 1, 0);
        return { ...cur, [type]: newIdx };
      });

      return next;
    });

    setSubmitted(false);
  };

  const renderPreviewLarge = (type) => {
    const list = getFilesByType(type);
    if (!list.length) return null;

    const idx = Math.min(currentIdx[type] ?? 0, list.length - 1);
    const file = list[idx];
    const url = URL.createObjectURL(file);
    const many = list.length > 1;

    return (
      <div className="media-previewLarge" onClick={(e) => e.stopPropagation()}>
        {type === "images" ? (
          <img src={url} alt={file.name} className="media-previewImg" />
        ) : type === "videos" ? (
          <video src={url} className="media-previewVideo" controls />
        ) : (
          <div className="media-previewDoc">
            <span className="media-docIcon">📄</span>
            <span className="media-docName">{file.name}</span>
          </div>
        )}

        <button
          type="button"
          className="media-removeBtn"
          onClick={(e) => {
            e.stopPropagation();
            removeFile(type, idx);
          }}
        >
          ✕
        </button>

        {many && (
          <>
            <button
              type="button"
              className="media-arrow media-arrow--left"
              onClick={(e) => {
                e.stopPropagation();
                stepPreview(type, -1);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="media-arrow media-arrow--right"
              onClick={(e) => {
                e.stopPropagation();
                stepPreview(type, 1);
              }}
            >
              ›
            </button>
            <div className="media-counter">
              {idx + 1}/{list.length}
            </div>
          </>
        )}
      </div>
    );
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build FormData matching backend parameter names EXACTLY
    const formData = new FormData();

    // Basic fields - MUST match LandlordController @RequestParam names
    formData.append('title', room.title);
    formData.append('description', room.description || '');
    formData.append('rentPricePerMonth', Number(room.rentPricePerMonth) || 0);
    formData.append('minimumStayMonths', room.minimumStayMonths || 1);
    formData.append('address', room.address);
    
    if (room.latitude) formData.append('latitude', room.latitude);
    if (room.longitude) formData.append('longitude', room.longitude);
    
    formData.append('numberOfToilets', room.numberOfToilets || 1);
    formData.append('numberOfBedRooms', room.numberOfBedRooms || 1);
    formData.append('hasWindow', room.hasWindow);

    // Media files - MUST match @RequestPart names in backend
    // Thumbnail: use first image
    if (images.length > 0) {
      formData.append('thumbnail', images[0]);
    }

    // Images
    images.forEach(file => {
      formData.append('images', file);
    });

    // Videos
    videos.forEach(file => {
      formData.append('videos', file);
    });

    // Documents
    documents.forEach(file => {
      formData.append('documents', file);
    });

    try {
      setSaving(true);
      setSubmitted(false);
      setError(null);

      console.log('Creating room with data...');
      
      const response = await landlordService.createRoom(formData);
      
      console.log('Room created successfully:', response);

      setCreatedRoom(response);
      setSaving(false);
      setSubmitted(true);

      // Navigate to room detail after 3 seconds
      setTimeout(() => {
        navigate(`/rooms/${response.id}`, {
          state: { room: response, from: 'upload-room' }
        });
      }, 3000);

    } catch (err) {
      console.error('Failed to create room:', err);
      setSaving(false);
      setError(err.response?.data?.message || 'Failed to create room. Please try again.');

      // Redirect to login if 401
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const previewUrl = images[0] ? URL.createObjectURL(images[0]) : FALLBACK_IMG;

  /* ---------- RENDER ---------- */
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-white">
        <div className="upload-page">
      <div className="upload-headerChip">Room Information</div>

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

      {/* overlay "saving" */}
      {saving && (
        <div className="upload-overlay">
          <div className="upload-loadingCard">
            <div className="loading-spinner" />
            <p className="loading-title">Creating your room…</p>
            <p className="loading-sub">
              Please wait while we upload files and save your room.
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS VIEW */}
      {submitted && createdRoom ? (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={600}
            gravity={0.2}
            recycle={false}
          />

          <div className="upload-celebrate">
            <div className="checkmark-wrapper">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>

            <h2 className="celebrate-title">Room Created Successfully!</h2>
            <p className="celebrate-text">
              Your room <strong>"{createdRoom.title}"</strong> has been created. <br />
              Redirecting to room details...
            </p>

            <div className="celebrate-card-preview">
              <PublishedRoomCard
                title={createdRoom.title || "Room title"}
                location={createdRoom.address || "Location"}
                description={createdRoom.description || "No description"}
                rentLabel={formatVnd(createdRoom.rentPricePerMonth)}
                subletDuration={`${createdRoom.minimumStayMonths}+ months`}
                imgUrl={previewUrl}
              />
            </div>

            <button
              type="button"
              className="celebrate-againBtn"
              onClick={() => {
                setSubmitted(false);
                setCreatedRoom(null);
                setRoom({
                  title: "",
                  description: "",
                  rentPricePerMonth: "",
                  minimumStayMonths: 1,
                  address: "",
                  latitude: "",
                  longitude: "",
                  numberOfToilets: 1,
                  numberOfBedRooms: 1,
                  hasWindow: true,
                });
                setImages([]);
                setVideos([]);
                setDocuments([]);
                window.scrollTo(0, 0);
              }}
            >
              Upload Another Room
            </button>
          </div>
        </>
      ) : (
        /* FORM */
        <div className="upload-grid">
          <form className="upload-form" onSubmit={handleSubmit}>
            {/* Basic details */}
            <section className="upload-section">
              <h3 className="upload-sectionTitle">Basic details</h3>

              <div className="upload-field">
                <label>Title *</label>
                <input
                  type="text"
                  value={room.title}
                  onChange={handleChange("title")}
                  placeholder="Cozy 2BR Apartment"
                  required
                />
              </div>

              <div className="upload-field">
                <label>Address *</label>
                <input
                  type="text"
                  value={room.address}
                  onChange={handleChange("address")}
                  placeholder="123 Main Street, District 7, HCMC"
                  required
                />
              </div>

              <div className="upload-field">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={room.description}
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
                    value={room.rentPricePerMonth}
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
                    value={room.minimumStayMonths}
                    onChange={handleChange("minimumStayMonths")}
                    placeholder="6"
                    required
                  />
                </div>
              </div>

              <div className="upload-row">
                <div className="upload-field upload-checkboxField">
                  <label>Has window</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={room.hasWindow}
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
                    value={room.numberOfBedRooms}
                    onChange={handleChange("numberOfBedRooms")}
                    required
                  />
                </div>

                <div className="upload-field">
                  <label>Toilets *</label>
                  <input
                    type="number"
                    min="1"
                    value={room.numberOfToilets}
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
                    value={room.latitude}
                    onChange={handleChange("latitude")}
                    placeholder="10.7769"
                  />
                </div>

                <div className="upload-field">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={room.longitude}
                    onChange={handleChange("longitude")}
                    placeholder="106.7009"
                  />
                </div>
              </div>
            </section>

            <button type="submit" className="upload-submit">
              Create Room
            </button>
          </form>

          {/* RIGHT: DROP ZONES */}
          <div className="upload-mediaCol">
            {/* IMAGES */}
            <div
              className={
                "media-dropZone" +
                (dragOver === "images" ? " media-dropZone--over" : "")
              }
              onDragOver={handleDragOver("images")}
              onDragLeave={handleDragLeave("images")}
              onDrop={handleDrop("images")}
              onClick={() => imgInputRef.current?.click()}
            >
              <div className="media-titleRow">
                <h4>Images (0–3)</h4>
                <span>JPG, PNG, GIF, WEBP · max 10MB</span>
              </div>
              <p className="media-help">
                Drag & drop images here, or click to browse.
              </p>
              <p className="media-files">
                {images.length
                  ? `Selected: ${images.length} file(s)`
                  : "No images yet."}
              </p>

              {renderPreviewLarge("images")}

              {images.length > 0 && (
                <div className="media-chipRow">
                  {images.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      className="media-chipFile"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("images", i);
                      }}
                    >
                      <span className="media-chipName">{f.name}</span>
                      <span className="media-chipClose">✕</span>
                    </button>
                  ))}
                </div>
              )}

              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleInputChange("images")}
              />
            </div>

            {/* VIDEOS */}
            <div
              className={
                "media-dropZone" +
                (dragOver === "videos" ? " media-dropZone--over" : "")
              }
              onDragOver={handleDragOver("videos")}
              onDragLeave={handleDragLeave("videos")}
              onDrop={handleDrop("videos")}
              onClick={() => vidInputRef.current?.click()}
            >
              <div className="media-titleRow">
                <h4>Videos (0–2)</h4>
                <span>MP4, MOV, WEBM · max 100MB</span>
              </div>
              <p className="media-help">
                Drag & drop videos here, or click to browse.
              </p>
              <p className="media-files">
                {videos.length
                  ? `Selected: ${videos.length} file(s)`
                  : "No videos yet."}
              </p>

              {renderPreviewLarge("videos")}

              {videos.length > 0 && (
                <div className="media-chipRow">
                  {videos.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      className="media-chipFile"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("videos", i);
                      }}
                    >
                      <span className="media-chipName">{f.name}</span>
                      <span className="media-chipClose">✕</span>
                    </button>
                  ))}
                </div>
              )}

              <input
                ref={vidInputRef}
                type="file"
                accept="video/*"
                multiple
                hidden
                onChange={handleInputChange("videos")}
              />
            </div>

            {/* DOCUMENTS */}
            <div
              className={
                "media-dropZone" +
                (dragOver === "docs" ? " media-dropZone--over" : "")
              }
              onDragOver={handleDragOver("docs")}
              onDragLeave={handleDragLeave("docs")}
              onDrop={handleDrop("docs")}
              onClick={() => docInputRef.current?.click()}
            >
              <div className="media-titleRow">
                <h4>Documents (0–3)</h4>
                <span>PDF, DOCX, XLSX, CSV · max 20MB</span>
              </div>
              <p className="media-help">
                Drag & drop documents here, or click to browse.
              </p>
              <p className="media-files">
                {documents.length
                  ? `Selected: ${documents.length} file(s)`
                  : "No documents yet."}
              </p>

              {renderPreviewLarge("docs")}

              {documents.length > 0 && (
                <div className="media-chipRow">
                  {documents.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      className="media-chipFile"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("docs", i);
                      }}
                    >
                      <span className="media-chipName">{f.name}</span>
                      <span className="media-chipClose">✕</span>
                    </button>
                  ))}
                </div>
              )}

              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                multiple
                hidden
                onChange={handleInputChange("docs")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}