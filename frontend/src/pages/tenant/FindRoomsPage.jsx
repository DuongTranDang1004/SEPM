import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, DollarSign, Calendar, Bookmark, Search, 
  SlidersHorizontal, ChevronLeft, Filter, X, Loader
} from 'lucide-react';

/**
 * FindRoomsPage - Browse and filter available rooms
 * Connected to real backend API
 */
function FindRoomsPage() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkedRoomIds, setBookmarkedRoomIds] = useState(new Set());

  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    districts: [],
    minStayMonths: '',
    hasWindow: false,
    bedroomsMin: '',
    toiletsMin: '',
    sortBy: 'price-asc' // price-asc, price-desc, newest
  });

  const districts = [
    'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
    'District 6', 'District 7', 'District 8', 'District 9', 'District 10',
    'District 11', 'District 12', 'Binh Thanh', 'Phu Nhuan', 'Tan Binh',
    'Go Vap', 'Thu Duc', 'Tan Phu'
  ];

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
    fetchBookmarks();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/user/rooms', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      console.log('Fetched rooms:', data); // Debug log
      
      setRooms(data.rooms || []);
      setFilteredRooms(data.rooms || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/tenant/bookmarks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const bookmarks = await response.json();
        const bookmarkedIds = new Set(bookmarks.map(b => b.roomId));
        setBookmarkedRoomIds(bookmarkedIds);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...rooms];

    // Search query - search in title, description, and address
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(room =>
        room.title?.toLowerCase().includes(query) ||
        room.description?.toLowerCase().includes(query) ||
        room.address?.toLowerCase().includes(query)
      );
    }

    // Price range
    if (filters.priceMin) {
      filtered = filtered.filter(room => room.rentPricePerMonth >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(room => room.rentPricePerMonth <= parseFloat(filters.priceMax));
    }

    // Districts - extract district from address
    if (filters.districts.length > 0) {
      filtered = filtered.filter(room => {
        if (!room.address) return false;
        return filters.districts.some(district => 
          room.address.toLowerCase().includes(district.toLowerCase())
        );
      });
    }

    // Min stay
    if (filters.minStayMonths) {
      filtered = filtered.filter(room => 
        room.minimumStayMonths <= parseInt(filters.minStayMonths)
      );
    }

    // Bedrooms minimum
    if (filters.bedroomsMin) {
      filtered = filtered.filter(room => 
        room.numberOfBedRooms >= parseInt(filters.bedroomsMin)
      );
    }

    // Toilets minimum
    if (filters.toiletsMin) {
      filtered = filtered.filter(room => 
        room.numberOfToilets >= parseInt(filters.toiletsMin)
      );
    }

    // Has window
    if (filters.hasWindow) {
      filtered = filtered.filter(room => room.hasWindow);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.rentPricePerMonth - b.rentPricePerMonth);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.rentPricePerMonth - a.rentPricePerMonth);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredRooms(filtered);
  }, [filters, searchQuery, rooms]);

  const toggleBookmark = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const isBookmarked = bookmarkedRoomIds.has(roomId);

      if (isBookmarked) {
        // Unbookmark
        const response = await fetch(`http://localhost:8080/api/tenant/bookmarks/rooms/${roomId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setBookmarkedRoomIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(roomId);
            return newSet;
          });
        }
      } else {
        // Bookmark
        const response = await fetch(`http://localhost:8080/api/tenant/bookmarks/rooms/${roomId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setBookmarkedRoomIds(prev => new Set(prev).add(roomId));
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark. Please try again.');
    }
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
      bedroomsMin: '',
      toiletsMin: '',
      sortBy: 'price-asc'
    });
    setSearchQuery('');
  };

  const activeFilterCount = 
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    filters.districts.length +
    (filters.minStayMonths ? 1 : 0) +
    (filters.bedroomsMin ? 1 : 0) +
    (filters.toiletsMin ? 1 : 0) +
    (filters.hasWindow ? 1 : 0);

  // Extract district from address
  const extractDistrict = (address) => {
    if (!address) return 'Unknown';
    const districtMatch = address.match(/District \d+|Binh Thanh|Phu Nhuan|Tan Binh|Go Vap|Thu Duc|Tan Phu/i);
    return districtMatch ? districtMatch[0] : 'HCMC';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRooms}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (VND/month)</label>
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

                {/* Room Specs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min. Bedrooms</label>
                  <input
                    type="number"
                    placeholder="e.g., 2"
                    value={filters.bedroomsMin}
                    onChange={(e) => setFilters({ ...filters, bedroomsMin: e.target.value })}
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
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min. Toilets</label>
                  <input
                    type="number"
                    placeholder="e.g., 1"
                    value={filters.toiletsMin}
                    onChange={(e) => setFilters({ ...filters, toiletsMin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasWindow}
                      onChange={(e) => setFilters({ ...filters, hasWindow: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Has Window</span>
                  </label>
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
            <p className="text-gray-600 mb-4">
              {searchQuery || activeFilterCount > 0 
                ? 'Try adjusting your filters or search query'
                : 'No rooms available at the moment'}
            </p>
            {(searchQuery || activeFilterCount > 0) && (
              <button
                onClick={clearFilters}
                className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
              >
                Clear Filters
              </button>
            )}
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
                      src={room.thumbnailUrl || room.imageUrls?.[0] || 'https://placehold.co/400x300/E0E0E0/666666?text=No+Image'}
                      alt={room.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => navigate(`/dashboard/tenant/room/${room.id}`)}
                      onError={(e) => { 
                        e.target.src = 'https://placehold.co/400x300/E0E0E0/666666?text=No+Image'; 
                      }}
                    />
                    <button
                      onClick={() => toggleBookmark(room.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition ${
                        bookmarkedRoomIds.has(room.id)
                          ? 'bg-teal-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark 
                        className="w-5 h-5" 
                        fill={bookmarkedRoomIds.has(room.id) ? 'currentColor' : 'none'} 
                      />
                    </button>
                    
                    {/* Status Badge */}
                    {room.status && room.status !== 'PUBLISHED' && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {room.status}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-teal-600 transition line-clamp-1"
                      onClick={() => navigate(`/dashboard/tenant/room/${room.id}`)}
                      title={room.title}
                    >
                      {room.title}
                    </h3>

                    {/* Description */}
                    {room.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {room.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        <span className="line-clamp-1" title={room.address}>{room.address}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          Min. {room.minimumStayMonths} months
                        </span>
                        <span className="flex items-center gap-1">
                          🛏️ {room.numberOfBedRooms} bed{room.numberOfBedRooms !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          🚽 {room.numberOfToilets} toilet{room.numberOfToilets !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.hasWindow && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          🪟 Window
                        </span>
                      )}
                      {room.imageUrls && room.imageUrls.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          📷 {room.imageUrls.length} photo{room.imageUrls.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {room.videoUrls && room.videoUrls.length > 0 && (
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                          🎥 Video tour
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        {extractDistrict(room.address)}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-teal-600">
                          {room.rentPricePerMonth?.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xl font-bold text-teal-600">₫</span>
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