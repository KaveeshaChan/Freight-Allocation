import React, { useState } from 'react';
import Layout from './Layout';

const InProgress = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search submit (e.g., filter items or show results)
    console.log('Searching for:', searchTerm);
  };

  return (
    <Layout>
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          style={{ transition: 'all 0.3s ease' }}
        >
          Completed
        </button>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center border border-gray-300 rounded-md"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="px-4 py-2 w-80"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>

      {/* Additional content goes here (e.g., list of items) */}
      <div>
        <p>Search results or content for "Completed" will appear here.</p>
      </div>
    </div>
    </Layout>
  );
};

export default InProgress;
