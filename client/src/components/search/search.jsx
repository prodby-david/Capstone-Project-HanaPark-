import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full max-w-xs text-sm">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mb-4 p-3 bg-white rounded-sm text-color-2 outline-0 w-full"
      />
      <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 right-3 text-color-2" />
    </div>
  );
};

export default SearchBar;
