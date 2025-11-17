import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, DollarSign, Calendar, Bookmark, Search, 
  SlidersHorizontal, ChevronLeft, Filter, X 
} from 'lucide-react';

/**
 * FindRoomsPage - Browse and filter available rooms
 */
function FindRoomsPage() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    districts: [],
    minStayMonths: '',
    hasWindow: false,
    hasWashingMachine: false,
    bookmarkedOnly: false,
    sortBy: 'price-asc' // price-asc, price-desc, newest
  });

  const districts = [
    'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
    'District 6', 'District 7', 'District 8', 'District 9', 'District 10',
    'District 11', 'District 12', 'Binh Thanh', 'Phu Nhuan', 'Tan Binh',
    'Go Vap', 'Thu Duc', 'Tan Phu'
  ];

  // Mock room data
  useEffect(() => {
    const mockRooms = [
      {
        id: 1,
        name: "Cozy Studio in District 1",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        address: "123 Nguyen Hue St, District 1",
        district: "District 1",
        minStayMonths: 6,
        price: 450,
        landlord: { name: "John Doe", avatar: "https://i.pravatar.cc/50?img=10" },
        hasWindow: true,
        hasWashingMachine: true,
        hasAircon: true,
        squareMeters: 25,
        isBookmarked: false,
        postedDate: "2024-11-10"
      },
      {
        id: 2,
        name: "Modern Apartment in Binh Thanh",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        address: "456 Xo Viet Nghe Tinh, Binh Thanh",
        district: "Binh Thanh",
        minStayMonths: 3,
        price: 550,
        landlord: { name: "Jane Smith", avatar: "https://i.pravatar.cc/50?img=11" },
        hasWindow: true,
        hasWashingMachine: true,
        hasAircon: true,
        squareMeters: 35,
        isBookmarked: true,
        postedDate: "2024-11-12"
      },
      {
        id: 3,
        name: "Bright Room in District 2",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        address: "789 Thao Dien, District 2",
        district: "District 2",
        minStayMonths: 12,
        price: 600,
        landlord: { name: "Mike Johnson", avatar: "https://i.pravatar.cc/50?img=12" },
        hasWindow: true,
        hasWashingMachine: false,
        hasAircon: true,
        squareMeters: 30,
        isBookmarked: false,
        postedDate: "2024-11-08"
      },
      {
        id: 4,
        name: "Spacious Shared Room in District 7",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
        address: "321 Nguyen Van Linh, District 7",
        district: "District 7",
        minStayMonths: 6,
        price: 380,
        landlord: { name: "Anna Lee", avatar: "https://i.pravatar.cc/50?img=13" },
        hasWindow: true,
        hasWashingMachine: true,
        hasAircon: false,
        squareMeters: 28,
        isBookmarked: true,
        postedDate: "2024-11-15"
      },
      {
        id: 5,
        name: "Luxury Apartment in District 3",
        image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&h=300&fit=crop",
        address: "555 Vo Van Tan, District 3",
        district: "District 3",
        minStayMonths: 12,
        price: 700,
        landlord: { name: "David Park", avatar: "https://i.pravatar.cc/50?img=14" },
        hasWindow: true,
        hasWashingMachine: true,
        hasAircon: true,
        squareMeters: 45,
        isBookmarked: false,
        postedDate: "2024-11-14"
      },
      {
        id: 6,
        name: "Affordable Room in Tan Binh",
        image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
        address: "888 Hoang Van Thu, Tan Binh",
        district: "Tan Binh",
        minStayMonths: 3,
        price: 320,
        landlord: { name: "Lisa Chen", avatar: "https://i.pravatar.cc/50?img=15" },
        hasWindow: false,
        hasWashingMachine: true,
        hasAircon: true,
        squareMeters: 20,
        isBookmarked: false,
        postedDate: "2024-11-16"
      },
      {
        id: 7,
        name: "Charming Studio in Phu Nhuan",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
        address: "234 Phan Dinh Phung, Phu Nhuan",
        district: "Phu Nhuan",
        minStayMonths: 6,
        price: 480,
        landlord: { name: "Tom Wilson", avatar: "https://i.pravatar.cc/50?img=16" },
        hasWindow: true,
        hasWashingMachine: false,
        hasAircon: true,
        squareMeters: 26,
        isBookmarked: false,
        postedDate: "2024-11-13"
      },
      {
        id: 8,
        name: "Premium Loft in District 1",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
        address: "999 Le Loi, District 1",
        district: "District 1",
        minStayMonths: 12,
        price: 850,
        landlord: { name: "Sarah Kim", avatar: "https://i.pravatar.cc/50?img=17" },
        hasWindow: true,
        hasWashingMachine: true,
        hasAircon: true,
        squareMeters: 50,
        isBookmarked: false,
        postedDate: "2024-11-17"
      }
    ];
    setRooms(mockRooms);
    setFilteredRooms(mockRooms);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...rooms];

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.district.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range
    if (filters.priceMin) {
      filtered = filtered.filter(room => room.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(room => room.price <= parseInt(filters.priceMax));
    }

    // Districts
    if (filters.districts.length > 0) {
      filtered = filtered.filter(room => filters.districts.includes(room.district));
    }

    // Min stay
    if (filters.minStayMonths) {
      filtered = filtered.filter(room => room.minStayMonths <= parseInt(filters.minStayMonths));
    }

    // Amenities
    if (filters.hasWindow) {
      filtered = filtered.filter(room => room.hasWindow);
    }
    if (filters.hasWashingMachine) {
      filtered = filtered.filter(room => room.hasWashingMachine);
    }

    // Bookmarked only
    if (filters.bookmarkedOnly) {
      filtered = filtered.filter(room => room.isBookmarked);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      default:
        break;
    }

    setFilteredRooms(filtered);
  }, [filters, searchQuery, rooms]);

  const toggleBookmark = (roomId) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, isBookmarked: !room.isBookmarked } : room
      )
    );
  };

  const toggleDistrict = (district) => {
    setFilters(prev => ({
      ...prev,
      districts: prev.districts.includes(district)
        ? prev.districts.filter(d => d !== district)
        : [...prev.districts, district]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      districts: [],
      minStayMonths: '',
      hasWindow: false,
      hasWashingMachine: false,
      bookmarkedOnly: false,
      sortBy: 'price-asc'
    });
    setSearchQuery('');
  };

  const activeFilterCount = 
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    filters.districts.length +
    (filters.minStayMonths ? 1 : 0) +
    (filters.hasWindow ? 1 : 0) +
    (filters.hasWashingMachine ? 1 : 0) +
    (filters.bookmarkedOnly ? 1 : 0);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard/tenant')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find Rooms 🏠</h1>
              <p className="text-gray-600 text-sm mt-1">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden md:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Options
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range ($/month)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Min Stay */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Min. Stay (months)</label>
                  <input
                    type="number"
                    placeholder="e.g., 6"
                    value={filters.minStayMonths}
                    onChange={(e) => setFilters({ ...filters, minStayMonths: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Quick Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasWindow}
                        onChange={(e) => setFilters({ ...filters, hasWindow: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Has Window</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasWashingMachine}
                        onChange={(e) => setFilters({ ...filters, hasWashingMachine: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Has Washing Machine</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.bookmarkedOnly}
                        onChange={(e) => setFilters({ ...filters, bookmarkedOnly: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Bookmarked Only</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Districts */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Districts {filters.districts.length > 0 && `(${filters.districts.length} selected)`}
                </label>
                <div className="max-h-32 overflow-y-auto bg-white rounded-lg border border-gray-300 p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {districts.map(district => (
                      <label
                        key={district}
                        className={`flex items-center px-3 py-2 border-2 rounded-lg cursor-pointer transition text-sm ${
                          filters.districts.includes(district)
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-teal-300 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={filters.districts.includes(district)}
                          onChange={() => toggleDistrict(district)}
                          className="w-4 h-4 text-teal-600 rounded mr-2"
                        />
                        <span className="truncate">{district}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Room Listings */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => navigate(`/dashboard/tenant/room/${room.id}`)}
                    />
                    <button
                      onClick={() => toggleBookmark(room.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition ${
                        room.isBookmarked
                          ? 'bg-teal-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" fill={room.isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-teal-600 transition"
                      onClick={() => navigate(`/dashboard/tenant/room/${room.id}`)}
                    >
                      {room.name}
                    </h3>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-500" />
                        {room.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          Min. {room.minStayMonths} months
                        </span>
                        <span className="flex items-center gap-1">
                          📏 {room.squareMeters}m²
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.hasWindow && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">🪟 Window</span>
                      )}
                      {room.hasWashingMachine && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🧺 Washer</span>
                      )}
                      {room.hasAircon && (
                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">❄️ AC</span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={room.landlord.avatar}
                          alt={room.landlord.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600">{room.landlord.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-5 h-5 text-teal-600" />
                        <span className="text-xl font-bold text-teal-600">{room.price}</span>
                        <span className="text-sm text-gray-500">/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindRoomsPage;