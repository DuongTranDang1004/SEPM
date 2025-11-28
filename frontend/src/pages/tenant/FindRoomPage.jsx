import React, { useMemo, useState, useNavigate } from "react";
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
  {
    "id": "r5",
    "title": "Cozy Studio in D3",
    "address": "212 Cao Thang, Ward 12",
    "minStayMonths": 3,
    "pricePerMonth": 5500000,
    "district": 3,
    "distanceKm": 4.5,
    "imgUrl": "https://images.unsplash.com/photo-1512918717608-632G7EH5960?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u3"
  },
  {
    "id": "r6",
    "title": "Bright Room near University",
    "address": "456 Xo Viet Nghe Tinh, Ward 25",
    "minStayMonths": 6,
    "pricePerMonth": 4200000,
    "district": "Binh Thanh",
    "distanceKm": 8.1,
    "imgUrl": "https://images.unsplash.com/photo-1502672260266-1c1c2e9a5a85?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u1"
  },
  {
    "id": "r7",
    "title": "Spacious Room with Balcony",
    "address": "789 Su Van Hanh, Ward 12",
    "minStayMonths": 1,
    "pricePerMonth": 6000000,
    "district": 10,
    "distanceKm": 5.0,
    "imgUrl": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u4"
  },
  {
    "id": "r8",
    "title": "Affordable Room in D4",
    "address": "101 Ben Van Don, Ward 1",
    "minStayMonths": 2,
    "pricePerMonth": 3900000,
    "district": 4,
    "distanceKm": 3.3,
    "imgUrl": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u2"
  },
  {
    "id": "r9",
    "title": "Modern Apartment",
    "address": "55 Phan Xich Long, Ward 2",
    "minStayMonths": 12,
    "pricePerMonth": 7500000,
    "district": "Phu Nhuan",
    "distanceKm": 6.2,
    "imgUrl": "https://images.unsplash.com/photo-1493809842364-78817add72d2?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u3"
  },
  {
    "id": "r10",
    "title": "Quiet Room in D7",
    "address": "33 Nguyen Thi Thap, Tan Phu",
    "minStayMonths": 6,
    "pricePerMonth": 4800000,
    "district": 7,
    "distanceKm": 2.0,
    "imgUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u1"
  },
  {
    "id": "r11",
    "title": "Luxury D1 Apartment",
    "address": "22 Nguyen Trai, Ben Thanh",
    "minStayMonths": 3,
    "pricePerMonth": 9000000,
    "district": 1,
    "distanceKm": 7.1,
    "imgUrl": "https://images.unsplash.com/photo-1533777857896-26a4b14d3340?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u5"
  },
  {
    "id": "r12",
    "title": "Shared Room near Van Hanh Mall",
    "address": "123 To Hien Thanh, Ward 14",
    "minStayMonths": 1,
    "pricePerMonth": 5300000,
    "district": 10,
    "distanceKm": 4.8,
    "imgUrl": "https://images.unsplash.com/photo-1503174971373-b1d6f830bdd6?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u4"
  },
  {
    "id": "r13",
    "title": "Private Room",
    "address": "99 Dinh Bo Linh, Ward 19",
    "minStayMonths": 6,
    "pricePerMonth": 4000000,
    "district": "Binh Thanh",
    "distanceKm": 9.0,
    "imgUrl": "https://images.unsplash.com/photo-1521783968255-6d09c313a246?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u2"
  },
  {
    "id": "r14",
    "title": "Central D3 Room",
    "address": "77 Nguyen Dinh Chieu, Ward 6",
    "minStayMonths": 2,
    "pricePerMonth": 6800000,
    "district": 3,
    "distanceKm": 4.1,
    "imgUrl": "https://images.unsplash.com/photo-1502672023588-b61e050c5341?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u5"
  },
  {
    "id": "r15",
    "title": "Room with River View",
    "address": "40 Ton Dan, Ward 12",
    "minStayMonths": 3,
    "pricePerMonth": 4100000,
    "district": 4,
    "distanceKm": 3.8,
    "imgUrl": "https://images.unsplash.com/photo-1523217582582-84b9e7c65c2b?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u3"
  },
  {
    "id": "r16",
    "title": "Serviced Apartment",
    "address": "80 Nguyen Van Troi, Ward 7",
    "minStayMonths": 6,
    "pricePerMonth": 8200000,
    "district": "Phu Nhuan",
    "distanceKm": 5.5,
    "imgUrl": "https://images.unsplash.com/photo-1516455590571-33791657c9c0?q=80&w=1400&auto=format&fit=crop",
    "landlordUserId": "u1"
  }
];

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);


export default function FindRoomPage() {
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
