import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import LandlordGreeting from "../../components/landlord/LandlordGreeting";
import LandlordOverview from "../../components/landlord/LandlordOverview";
import LandlordPublished from "../../components/landlord/LandlordPublished";

// Fake users
const users = [
  { id: "u1", name: "John", role: "landlord", avatar: "🧑🏻‍💼" },
  { id: "u2", name: "User2", role: "landlord", avatar: "👩🏻‍💼" },
  { id: "u3", name: "Truc", role: "tenant", avatar: "🧑🏻" },
];

// TODO: sau này thay bằng AuthContext (user đang login)
const currentUser = users[0]; // giả sử đang login là landlord u1

// Fake rooms (6 cái)
const rooms = [
  {
    id: "r1",
    title: "3BHK",
    address: "Indiranagar, Bengaluru",
    location: "Indiranagar, Bengaluru",
    minStayMonths: 3,
    pricePerMonth: 12000,
    district: 7,
    distanceKm: 1.2,
    status: "available",
    imgUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
  },
  {
    id: "r2",
    title: "2BHK",
    address: "Phu Nhuan, HCMC",
    location: "Phu Nhuan, HCMC",
    minStayMonths: 6,
    pricePerMonth: 9000000,
    district: 3,
    distanceKm: 5.4,
    status: "available",
    imgUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
  },
  {
    id: "r3",
    title: "Studio",
    address: "District 7, HCMC",
    location: "District 7, HCMC",
    minStayMonths: 1,
    pricePerMonth: 4800000,
    district: 7,
    distanceKm: 2.0,
    status: "rented",
    imgUrl:
      "https://images.unsplash.com/photo-1512918717608-632G7EH5960?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
    tenant: {
      name: "Nguyen Minh Khoa",
      avatar: "https://i.pravatar.cc/64?img=11",
    },
  },
  {
    id: "r4",
    title: "1BR",
    address: "District 4, HCMC",
    location: "District 4, HCMC",
    minStayMonths: 2,
    pricePerMonth: 3900000,
    district: 4,
    distanceKm: 3.3,
    status: "available",
    imgUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
  },
  {
    id: "r5",
    title: "Loft",
    address: "District 10, HCMC",
    location: "District 10, HCMC",
    minStayMonths: 1,
    pricePerMonth: 6000000,
    district: 10,
    distanceKm: 5.0,
    status: "available",
    imgUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
  },
  {
    id: "r6",
    title: "3BHK",
    address: "District 3, HCMC",
    location: "District 3, HCMC",
    minStayMonths: 2,
    pricePerMonth: 6800000,
    district: 3,
    distanceKm: 4.1,
    status: "rented",
    imgUrl:
      "https://images.unsplash.com/photo-1502672023588-b61e050c5341?q=80&w=1400&auto=format&fit=crop",
    landlordUserId: "u1",
    tenant: {
      name: "Tran Bao Anh",
      avatar: "https://i.pravatar.cc/64?img=21",
    },
  },
];

const currency = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)
    : "N/A";

function LandlordDashboard() {
  const { landlordId } = useParams();

  // landlord đang được xem trong dashboard
  const viewedLandlord = useMemo(() => {
    if (!landlordId) return currentUser; // không có param → xem của mình
    const found = users.find(
      (u) => u.id === landlordId && u.role === "landlord"
    );
    return found || currentUser; // nếu không tìm thấy thì fallback về mình
  }, [landlordId]);

  const isOwnDashboard = viewedLandlord.id === currentUser.id;

  const myRooms = useMemo(
    () => rooms.filter((r) => r.landlordUserId === viewedLandlord.id),
    [viewedLandlord.id]
  );

  const overview = useMemo(() => {
    const total = myRooms.length;
    const available = myRooms.filter((r) => r.status === "available").length;
    const rented = myRooms.filter((r) => r.status === "rented").length;
    return { total, available, rented };
  }, [myRooms]);

  const publishedTitle = isOwnDashboard
    ? "My Published Rooms"
    : `${viewedLandlord.name}'s Published Rooms`;

  const lastLoginLabel = isOwnDashboard
    ? "2 hours ago"
    : "N/A • viewing public dashboard";

  return (
    <div className="ldb-wrap">
      <LandlordGreeting
        name={viewedLandlord.name}
        lastLogin={lastLoginLabel}
      />

      <LandlordOverview
        stats={overview}
        isOwnDashboard={isOwnDashboard}
        name={viewedLandlord.name}
      />

      <LandlordPublished
        title={publishedTitle}
        rooms={myRooms.slice(0, 6)}
      />
    </div>
  );
}

export default LandlordDashboard;
