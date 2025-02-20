import React, { useState } from 'react';
import Layout from '../../Layouts/Main_Layout';
import { FaSearch } from 'react-icons/fa';

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
    <div className="p-4 mt-40">
      <div className="flex items-center justify-between mb-6">
              <span className="px-4 py-2 border-2 border-orange-500 text-orange-500 bg-transparent rounded-md">
        Completed
      </span>
      
      
      
                <form
                            onSubmit={handleSearchSubmit}
                            className="flex items-center border border-gray-300 rounded-full overflow-hidden h-10"
                          >
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={handleSearchChange}
                              placeholder="Search..."
                              className="flex-grow outline-none px-4 text-sm"
                            />
                            <button
                              type="submit"
                              className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white hover:bg-orange-600"
                              style={{ transition: 'all 0.3s ease' }}
                            >
                              <FaSearch />
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
