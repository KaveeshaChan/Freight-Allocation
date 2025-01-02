import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Layout from './Main_Layout';

const InProgress = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [documentDate, setDocumentDate] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const handleImport = () => {
    console.log('Import action triggered');
    // Add the logic for import action here
  };

  const handleExport = () => {
    console.log('Export action triggered');
    // Add the logic for export action here
  };

  useEffect(() => {
    const fetchDocumentDate = async () => {
      try {
        const response = await fetch('/api/document-date');
        if (!response.ok) {
          throw new Error('Failed to fetch document date');
        }
        const data = await response.json();
        setDocumentDate(data.date);
      } catch (error) {
        console.error('Error fetching document date:', error);
        setDocumentDate('Error loading date'); // Fallback if fetch fails
      }
    };

    fetchDocumentDate();
  }, []);

  return (
    <Layout>
      <div className="p-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            style={{ transition: 'all 0.3s ease' }}
          >
            In Progress
          </button>

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

        <div className="border-2 border-orange-500 rounded-md p-8 flex justify-between items-center">
          {/* Left Section: Main Content */}
          <div className="flex items-center space-x-4">
            <p className="text-gray-700">Document type:</p>
            <button
              onClick={handleImport}
              disabled={!documentDate || documentDate === 'Error loading date'}
              className={`px-4 py-2 rounded-md ${
                documentDate ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Import
            </button>
            <button
              onClick={handleExport}
              disabled={!documentDate || documentDate === 'Error loading date'}
              className={`px-4 py-2 rounded-md ${
                documentDate ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Export
            </button>
          </div>

          {/* Right Section: Document Created Date */}
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-600 mr-2">Document Created:</p>
            <p className="text-sm text-gray-800">
              {documentDate || 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InProgress;
