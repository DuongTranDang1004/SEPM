// src/pages/landlord/UploadRoomPage.jsx
import React, { useState, useCallback, useRef } from "react";
import PublishedRoomCard from "../../components/landlord/PublishedRoomCard";
import Confetti from "react-confetti"; // Nhớ npm install react-confetti
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
    status: "DRAFT",
  });

  // media state
  const [images, setImages] = useState([]); // 0–3
  const [videos, setVideos] = useState([]); // 0–2
  const [documents, setDocuments] = useState([]); // 0–3

  // UI state
  const [submitted, setSubmitted] = useState(false); // màn celebrate
  const [saving, setSaving] = useState(false); // overlay “Saving…”
  const [dragOver, setDragOver] = useState(null); // "images" | "videos" | "docs" | null

  // input refs
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const docInputRef = useRef(null);

  // index preview cho từng loại media
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

  const handleSelect = (field) => (e) => {
    setRoom((prev) => ({ ...prev, [field]: e.target.value }));
    setSubmitted(false);
  };

  /* -------- media: add file ---------- */
  const addFiles = useCallback((type, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    if (type === "images") {
      setImages((prev) => {
        const merged = [...prev, ...files];
        if (merged.length > 3) alert("Chỉ chọn tối đa 3 ảnh.");
        return merged.slice(0, 3);
      });
      setCurrentIdx((prev) => ({ ...prev, images: 0 }));
    } else if (type === "videos") {
      setVideos((prev) => {
        const merged = [...prev, ...files];
        if (merged.length > 2) alert("Chỉ chọn tối đa 2 video.");
        return merged.slice(0, 2);
      });
      setCurrentIdx((prev) => ({ ...prev, videos: 0 }));
    } else if (type === "docs") {
      setDocuments((prev) => {
        const merged = [...prev, ...files];
        if (merged.length > 3) alert("Chỉ chọn tối đa 3 tài liệu.");
        return merged.slice(0, 3);
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
      <div
        className="media-previewLarge"
        onClick={(e) => e.stopPropagation()}
      >
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

        {/* remove current file */}
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
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: room.title,
      description: room.description,
      rentPricePerMonth: Number(room.rentPricePerMonth) || 0,
      minimumStayMonths: room.minimumStayMonths || 1,
      address: room.address,
      latitude: room.latitude || null,
      longitude: room.longitude || null,
      numberOfToilets: room.numberOfToilets || 1,
      numberOfBedRooms: room.numberOfBedRooms || 1,
      hasWindow: room.hasWindow,
      status: room.status,
    };

    console.log("UpdateRoomRequest payload:", payload);
    console.log("Media:", { images, videos, documents });

    // fake API
    setSaving(true);
    setSubmitted(false);

    setTimeout(() => {
      setSaving(false);
      setSubmitted(true);
    }, 1000); // Tăng thời gian giả lập lên xíu để thấy hiệu ứng loading
  };

  const previewUrl =
    images[0] ? URL.createObjectURL(images[0]) : FALLBACK_IMG;

  /* ---------- RENDER ---------- */
  return (
    <div className="upload-page">
      <div className="upload-headerChip">Room Information</div>

      {/* overlay "saving" */}
      {saving && (
        <div className="upload-overlay">
          <div className="upload-loadingCard">
            <div className="loading-spinner" />
            <p className="loading-title">Saving your room…</p>
            <p className="loading-sub">
              Please wait while we validate data and attach media files.
            </p>
          </div>
        </div>
      )}

      {/* NẾU ĐÃ SUBMIT → CHỈ HIỆN CELEBRATE VIEW */}
      {submitted ? (
        <>
          {/* Pháo giấy */}
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={600}
            gravity={0.2}
            recycle={false} // Chỉ nổ 1 lần rồi dừng
          />
          
          <div className="upload-celebrate">
            {/* Animated Checkmark SVG */}
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

            <h2 className="celebrate-title">Room Saved Successfully!</h2>
            <p className="celebrate-text">
              Your room <strong>"{room.title}"</strong> has been created. <br />
              It is now ready to be viewed by potential tenants.
            </p>

            {/* Card Preview */}
            <div className="celebrate-card-preview">
              <PublishedRoomCard
                title={room.title || "Room title"}
                location={room.address || "Location"}
                description={
                  room.description ||
                  "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum."
                }
                rentLabel={
                  room.rentPricePerMonth
                    ? formatVnd(room.rentPricePerMonth)
                    : "₫ 5.000.000"
                }
                subletDuration={
                  room.minimumStayMonths
                    ? `${room.minimumStayMonths}+ months`
                    : "1–6 Months"
                }
                imgUrl={previewUrl}
              />
            </div>

            <button
              type="button"
              className="celebrate-againBtn"
              onClick={() => {
                // Reset form để tạo phòng mới
                setSubmitted(false);
                setRoom({ ...room, title: "", description: "" });
                setImages([]);
                setVideos([]);
                setDocuments([]);
                window.scrollTo(0,0);
              }}
            >
              Upload Another Room
            </button>
          </div>
        </>
      ) : (
        /* FORM NHẬP LIỆU */
        <div className="upload-grid">
          {/* LEFT: FORM */}
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
                  placeholder="Indiranagar, Bengaluru"
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
                <div className="upload-field">
                  <label>Status *</label>
                  <select
                    value={room.status}
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
              Save room
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
  );
}