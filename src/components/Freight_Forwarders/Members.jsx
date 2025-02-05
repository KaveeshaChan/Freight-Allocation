import React, { useState, useEffect } from 'react';
import Header from './Header';


const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch members from API (mock data for now)
    setMembers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Worker' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Client' },
      { id: 3, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin' },
    ]);
  }, []);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div key={member.id} className="flex justify-between items-center p-3 bg-white shadow-sm rounded-lg mb-2">
            <div>
              <p className="font-semibold text-gray-900">{member.name}</p>
              <p className="text-gray-600 text-sm">{member.email}</p>
            </div>
            <span className="text-sm font-medium text-blue-600">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default MembersPage;