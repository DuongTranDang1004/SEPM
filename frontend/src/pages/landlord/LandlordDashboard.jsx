import React, { useMemo, useState } from "react";
import RoomFilter from "../../components/room/RoomFilter";
import RoomList from "../../components/room/RoomList";
import ErrorBoundary from "../../components/ErrorBoundary";
// ---------------- Fake data (swap with API later) ----------------
const users = [
  { id: "u1", name: "User1", role: "landlord", avatar: "🧑🏻‍💼" },
  { id: "u2", name: "User2", role: "landlord", avatar: "👩🏻‍💼" },
  { id: "u3", name: "Truc", role: "tenant", avatar: "🧑🏻" },
];

// choose who is logged in
const currentUser = users[2]; // toggle to test landlord vs tenant

const rooms = [
  {
    id: "r1",
    title: "Room 1",
    address: "123 Nguyen Van Linh, Tan Phong",
    minStayMonths: 6,
    pricePerMonth: 4500000,
    district: 7,
    distanceKm: 1.2,
    imgUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
  },
  {
    id: "r2",
    title: "Room 1",
    address: "45 Tran Xuan Soan, Tan Hung",
    minStayMonths: 3,
    pricePerMonth: 3800000,
    district: 7,
    distanceKm: 2.4,
    imgUrl:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2bc1?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
  },
  {
    id: "r3",
    title: "Room 1",
    address: "88 Dinh Tien Hoang, Da Kao",
    minStayMonths: 1,
    pricePerMonth: 5200000,
    district: 1,
    distanceKm: 6.8,
    imgUrl:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u2",
  },
  {
    id: "r4",
    title: "Room 1",
    address: "12A Le Loi, Ben Nghe",
    minStayMonths: 2,
    pricePerMonth: 7000000,
    district: 1,
    distanceKm: 5.9,
    imgUrl:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2bc1?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u2",
  },
];

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export default function LandlordDashboard() {
    const isTenant = currentUser.role === "tenant";

  // bookmarks như cũ
    const [bookmarks, setBookmarks] = useState(() => new Set());

    // ✅ Dùng 1 state filters duy nhất, áp dụng ngay khi chọn
    const [filters, setFilters] = useState({
        sortDistance: "ascending",
        sortPrice: "lowest",
        district: "all",
        bookmarked: "all",
    });

    const districtOptions = useMemo(
        () => [...Array.from(new Set(rooms.map(r => r.district))).sort((a,b)=>a-b)],
        []
    );

    const setFilter = (key, value) =>
        setFilters(prev => ({ ...prev, [key]: value }));

    const clearFilters = () =>
        setFilters({
        sortDistance: "ascending",
        sortPrice: "lowest",
        district: "all",
        bookmarked: "all",
        });

    const toggleBookmark = (roomId) => {
        setBookmarks(prev => {
        const next = new Set(prev);
        next.has(roomId) ? next.delete(roomId) : next.add(roomId);
        return next;
        });
    };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontWeight: 700, fontSize: 24, marginBottom: 12 }}>Broomate</h1>

    <RoomFilter
        filters={filters}
        setFilter={setFilter}
        onClear={clearFilters}
        isTenant={isTenant}
        districtOptions={districtOptions}
      />

      <div style={{ height: 12 }} />

      <ErrorBoundary>
        <RoomList
            rooms={rooms}
          filters={filters}
          currency={currency}
          isTenant={isTenant}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
        />
      </ErrorBoundary>
    </div>
  );
}
