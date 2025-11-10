import React from "react";

function RoomFilter({
  pending,
  setPending,
  onApply,
  onClear,
  isTenant,
  districtOptions,
}) {
  const chip = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    padding: "10px 14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  };

  const label = { fontSize: 14, color: "#4b5563", whiteSpace: "nowrap" };
  const select = { border: "none", outline: "none", background: "transparent" };

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <div style={chip}>
          <span style={label}>Located near you</span>
          <select
            style={select}
            value={pending.sortDistance}
            onChange={(e) => setPending((p) => ({ ...p, sortDistance: e.target.value }))}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>

        <div style={chip}>
          <span style={label}>Price per month</span>
          <select
            style={select}
            value={pending.sortPrice}
            onChange={(e) => setPending((p) => ({ ...p, sortPrice: e.target.value }))}
          >
            <option value="lowest">Lowest</option>
            <option value="highest">Highest</option>
          </select>
        </div>

        <div style={chip}>
          <span style={label}>District No</span>
          <select
            style={select}
            value={pending.district}
            onChange={(e) => setPending((p) => ({ ...p, district: e.target.value }))}
          >
            <option value="all">All</option>
            {districtOptions.map((d) => (
              <option key={d} value={String(d)}>
                District {d}
              </option>
            ))}
          </select>
        </div>

        {isTenant && (
          <div style={chip}>
            <span style={label}>Bookmarked</span>
            <select
              style={select}
              value={pending.bookmarked}
              onChange={(e) => setPending((p) => ({ ...p, bookmarked: e.target.value }))}
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button
            onClick={onClear}
            style={{
              background: "transparent",
              border: "none",
              color: "#2563eb",
              padding: "10px 12px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
          <button
            onClick={onApply}
            style={{
              background: "#10b981",
              color: "white",
              border: "1px solid #10b981",
              padding: "10px 14px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomFilter;