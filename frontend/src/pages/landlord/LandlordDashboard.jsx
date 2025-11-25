<<<<<<< HEAD
import React from 'react';

function LandlordDashboard() {
  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Landlord!</h1>
          <p className="text-gray-600">Manage your properties and connect with tenants</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Total Rooms</h3>
              <span className="text-2xl">🏘️</span>
            </div>
            <p className="text-3xl font-bold text-pink-600">12</p>
            <p className="text-xs text-gray-500 mt-2">Published listings</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Rented</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-600">8</p>
            <p className="text-xs text-gray-500 mt-2">Currently occupied</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Available</h3>
              <span className="text-2xl">🔓</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">4</p>
            <p className="text-xs text-gray-500 mt-2">Ready to rent</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Inquiries</h3>
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">15</p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="flex flex-col items-center gap-3 p-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-xl transition transform hover:scale-105">
              <span className="text-5xl">➕</span>
              <div className="text-center">
                <h3 className="font-bold text-lg">Upload Room</h3>
                <p className="text-sm text-pink-100">Add new listing</p>
              </div>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition transform hover:scale-105">
              <span className="text-5xl">🏘️</span>
              <div className="text-center">
                <h3 className="font-bold text-lg">My Rooms</h3>
                <p className="text-sm text-teal-100">Manage listings</p>
              </div>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition transform hover:scale-105">
              <span className="text-5xl">📊</span>
              <div className="text-center">
                <h3 className="font-bold text-lg">Analytics</h3>
                <p className="text-sm text-purple-100">View insights</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Recent Listings</h2>
            <button className="text-sm text-pink-600 font-semibold hover:text-pink-700">
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Room Card 1 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                <span className="text-6xl">🏠</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Cozy Studio</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Rented
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">District 1</p>
                <p className="text-xl font-bold text-pink-600">$450/month</p>
              </div>
            </div>

            {/* Room Card 2 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-teal-200 to-blue-200 flex items-center justify-center">
                <span className="text-6xl">🏘️</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Modern Apartment</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Available
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">District 2</p>
                <p className="text-xl font-bold text-pink-600">$550/month</p>
              </div>
            </div>

            {/* Room Card 3 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center">
                <span className="text-6xl">🏡</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Shared Room</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Available
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Binh Thanh</p>
                <p className="text-xl font-bold text-pink-600">$300/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
=======
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
>>>>>>> origin/Truc_Frontend_Landlords
    </div>
  );
}

<<<<<<< HEAD
export default LandlordDashboard;
=======
export default LandlordDashboard;
>>>>>>> origin/Truc_Frontend_Landlords
