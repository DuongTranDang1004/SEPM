// RoomList.jsx
import React, { useMemo } from "react";
import RoomCard from "./RoomCard";

export default function RoomList({
  rooms = [],
  filters = {},
  currency,
  isTenant,
  bookmarks,
  onToggleBookmark,
}) {
  const {
    sortDistance = "ascending",
    sortPrice = "lowest",
    district = "all",
    bookmarked = "all",
  } = filters;

  const filteredRooms = useMemo(() => {
    let list = Array.isArray(rooms) ? [...rooms] : [];

    if (district !== "all") {
      const d = Number(district);
      list = list.filter((r) => Number(r.district) === d);
    }

    if (isTenant && bookmarked !== "all") {
      list = list.filter((r) =>
        bookmarked === "yes" ? bookmarks.has(r.id) : !bookmarks.has(r.id)
      );
    }

    list.sort((a, b) => {
      const da = Number(a.distanceKm);
      const db = Number(b.distanceKm);
      const dist =
        sortDistance === "ascending" ? da - db : db - da;

      if (Number.isFinite(dist) && dist !== 0) return dist;

      const pa = Number(a.pricePerMonth);
      const pb = Number(b.pricePerMonth);
      return sortPrice === "lowest" ? pa - pb : pb - pa;
    });

    return list;
  }, [rooms, district, bookmarked, sortDistance, sortPrice, bookmarks, isTenant]);

  if (!filteredRooms.length) {
    return (
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, background: "#fff" }}>
        No rooms match your filters.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {filteredRooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          currency={currency}
          isBookmarked={bookmarks.has(room.id)}
          canBookmark={isTenant}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
