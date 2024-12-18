import React from "react";
import "./SearchBar.css";

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
