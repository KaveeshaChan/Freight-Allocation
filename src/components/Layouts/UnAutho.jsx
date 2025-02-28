import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full mx-4 transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col items-center">
          {/* Gradient Icon Container */}
          <div className="mb-6 bg-gradient-to-r from-[#0534F0] to-[#98009E] p-4 rounded-full shadow-lg">
            <FiAlertTriangle className="text-4xl text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-700 text-center mb-6 leading-relaxed">
            You don't have permission to view this page. Please contact your administrator or return to the homepage.
          </p>
          
          <button
            onClick={handleGoBack}
            className="w-full py-3 px-6 text-sm font-semibold text-white transition-all duration-300
                     bg-[#0534F0] hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E]
                     rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Return to Safety
          </button>
        </div>
      </div>
      
      {/* Additional Visual Elements */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Need help?{' '}
          <a 
            href="mailto:systems6.basilurtea@gmail.com" 
            className="font-semibold text-[#0534F0] hover:text-[#98009E] transition-colors"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;