import React, { useState, useEffect } from 'react';
import Header from './Header';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in again.');
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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && Array.isArray(data.freightCoordinators)) {
          setMembers(data.freightCoordinators);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching members:', error.message);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized. Redirecting to login.');
          // Handle unauthorized error (e.g., redirect to login page)
        }
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member =>
    member.Coordinator_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Members</h2>
        <input
          type="text"
          placeholder="Search members..."
          className="w-full p-2 border rounded-md mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="bg-gray-100 rounded-md p-4">
          {filteredMembers.map((member) => (
            <div key={member.CoordinatorID} className="flex justify-between items-center p-3 bg-white shadow-sm rounded-lg mb-2 hover:bg-blue-50 transition duration-200 ease-in-out">
              <div>
                <p className="font-semibold text-gray-900 text-lg">{member.Coordinator_Name}</p>
                <p className="text-gray-600 text-sm">{member.Email}</p>
                <p className="text-gray-600 text-sm">{member.ContactNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MembersPage;