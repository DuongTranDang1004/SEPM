import React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react"; // npm i lucide-react
import "./RoomCard.css";

// mapping landlord demo (đổi sang prop/API nếu bạn muốn)
const landlordById = {
  u1: { name: "User1", avatar: "🧑🏻‍💼" },
  u2: { name: "User2", avatar: "👩🏻‍💼" },
};

function RoomCard({
  room,
  currency,
  isBookmarked,
  canBookmark,
  onToggleBookmark,
}) {
  const landlord = landlordById[room.landlordUserId] || { name: "Unknown", avatar: "🏠" };

  // an toàn kiểu dữ liệu
  const priceNum = Number(room?.pricePerMonth);
  const priceLabel = Number.isFinite(priceNum) ? currency(priceNum) : "N/A";

  return (
    <article className="bm-room-card" aria-label={`Room card ${room?.title || ""}`}>
      {/* Media left */}
      <div className="bm-room-media">
        <img
          src={room?.imgUrl || "https://picsum.photos/640/480"}
          alt={`${room?.title || "Room"} photo`}
          loading="lazy"
        />
      </div>

      {/* Content right */}
      <div className="bm-room-content">
        <h3 className="bm-room-title">{room?.title || "Room"}</h3>
        <ul className="bm-room-facts">
          <li><span className="k">Address:</span> {room?.address || "—"}</li>
          <li><span className="k">Min. Month of Stay:</span> {room?.minStayMonths ?? "—"}</li>
          <li><span className="k">Price per month:</span> {priceLabel}</li>
          <li className="bm-landlord">
            <span className="k">Landlord:</span>
            <span className="avatar">{landlord.avatar}</span>
            {landlord.name}
          </li>
        </ul>
      </div>

      {/* Bookmark ở góc phải */}
      {canBookmark && (
        <button
          className="bm-bookmark"
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          onClick={() => onToggleBookmark(room.id)}
        >
          <div className="bm-bookmark-box">
            {isBookmarked ? (
              <BookmarkCheck size={22} strokeWidth={2.25} />
            ) : (
              <Bookmark size={22} strokeWidth={2.25} />
            )}
          </div>
        </button>
      )}
    </article>
  );
}

export default RoomCard;