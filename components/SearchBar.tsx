
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-xl">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Find a specialist..."
        className="w-full pl-10 pr-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all duration-300 focus:translate-y-[-2px] focus:shadow-[0_10px_25px_rgba(59,130,246,0.15)] placeholder-gray-600"
      />
      <svg className="absolute left-7 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
  );
};

export default SearchBar;
