import React, { useState, useEffect } from 'react';
import Header from './Header';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaIdBadge } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from storage
        if (!token) {
          navigate('/login'); // Redirect to login if no token
          return;
        }
        const agentID = localStorage.getItem('agentID');
        const response = await fetch(
          `http://localhost:5056/api/select/view-freight-agents/coordinators/${agentID}`, 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        if (data?.freightCoordinators) {
          setMembers(data.freightCoordinators);
        }
      } catch (error) {
        console.error('Error fetching members:', error.message);
        // Add error handling logic here
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member =>
    member.Coordinator_Name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaIdBadge className="text-[#98009E] w-8 h-8" />
                Team Members
              </h1>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search members by name..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <div key={member.CoordinatorID} className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0534F0]/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0534F0] to-[#98009E] flex items-center justify-center">
                        <FaUser className="text-white w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {member.Coordinator_Name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <FaEnvelope className="w-4 h-4 text-[#98009E]" />
                        <span className="text-sm break-all">{member.Email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="w-4 h-4 text-[#0534F0]" />
                        <span className="text-sm">{member.ContactNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4 text-gray-400">
                  <FaSearch className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-600">No members found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MembersPage;