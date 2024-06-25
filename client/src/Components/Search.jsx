import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';

const Search = ({ setLocations }) => {
  const [query, setQuery] = useState('');
  const [colorIndex, setColorIndex] = useState(0);

  const colorPalette = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'cyan', 'magenta'];

  const searchLocation = async () => {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&polygon_geojson=1`);
    const data = response.data.map((item) => ({
      name: item.display_name,
      geojson: item.geojson,
      color: generateColor(),
    }));
    setLocations(prevLocations => [...prevLocations, ...data]);
    setQuery('');
  };

  const generateColor = () => {
    const color = colorPalette[colorIndex % colorPalette.length];
    setColorIndex(colorIndex + 1);
    return color;
  };

  return (
    <div className="flex justify-center items-center p-4 bg-gray-100 w-full fixed top-0 z-50">
      <input
        type="text"
        value={query}
        className="p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location"
      />
      <button
        className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={searchLocation}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
