// import React from "react";

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  selectedSector,
  setSelectedSector,
  communities,
  type,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
      {/* Text search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder={`Search ${type}...`}
          className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-xs focus:ring-2 ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sector filter */}
      <div className="w-full md:w-64">
        <select
          className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500 transition-all cursor-pointer appearance-none"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
        >
          <option value="">-- ALL SECTORS --</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
