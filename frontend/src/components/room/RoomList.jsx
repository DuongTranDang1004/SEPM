import React, { useMemo, useRef, useState, useEffect } from "react";
import RoomCard from "./RoomCard";
import useHoverAutoscroll from "../../hooks/useHoverAutoscroll";

export default function RoomList({
  rooms, filters, currency, isTenant, bookmarks, onToggleBookmark
}) {
  const filteredRooms = useMemo(() => {
    let list = [...rooms];

    if (filters.district !== "all") {
      list = list.filter(r => String(r.district) === String(filters.district));
    }
    // ưu tiên distance trước, rồi price
    list.sort((a, b) => filters.sortDistance === "ascending" ? a.distanceKm - b.distanceKm : b.distanceKm - a.distanceKm);
    list.sort((a, b) => filters.sortPrice    === "lowest"    ? a.pricePerMonth - b.pricePerMonth : b.pricePerMonth - a.pricePerMonth);

    if (filters.bookmarked === "yes") list = list.filter(r => bookmarks.has(r.id));
    if (filters.bookmarked === "no")  list = list.filter(r => !bookmarks.has(r.id));
    return list;
  }, [rooms, filters, bookmarks]);

  const wrapRef = useRef(null);

  // DEBUG STATE
  const [dbg, setDbg] = useState({ target: "-", scrollTop: 0, v: 0, targetV: 0, enabled: false });

  useHoverAutoscroll(wrapRef, {
    edge: 90,
    margin: 50,
    xMargin: 20,
    maxSpeed: 800,
    easing: 0.22,
    onlyWhenHovering: true, 
    forceEnable: true,
  });


  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => setDbg(d => ({ ...d, scrollTop: el.scrollTop }));
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Kiểm tra container có scrollable không, log 1 lần
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const can = el.scrollHeight > el.clientHeight;
    console.log("[AUTO] container scrollable:", can, { sh: el.scrollHeight, ch: el.clientHeight });
  }, []);

  return (
    <div ref={wrapRef} className="bm-rooms-scroll" aria-label="Rooms list">
      {/* Overlay debug góc dưới trái */}

      <div className="bm-rooms-stack">
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
    </div>
  );
}
