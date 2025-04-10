// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layouts/Main_Layout';
import { FaSearch } from 'react-icons/fa';
import '../../assests/table.css';

function Dashboard() {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showCoordinatorPopup, setShowCoordinatorPopup] = useState(false); // New state for coordinator popup
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState([]);
  const [coordinators, setCoordinators] = useState([])
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          navigate('/login'); // Navigate to login page
          return;
        }

        const response = await fetch(
          "http://192.168.100.20:5056/api/select/view-freight-agents",
          {
            method: "GET", // Use GET for fetching data
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response

        setAgents(data.freightAgents || []); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching freight agents:", error.message);
        if (error.message.includes("401")) {
          navigate('/login'); // Navigate to login page
          return;
        }
      }
    };

    fetchAgents();
  }, [navigate]);

  //checking user role = 'admin'
  useEffect(() => {
    // Add this to your existing useEffect or create a new one
    const checkUserRole = () => {
      const role = localStorage.getItem("userRole"); // Assuming role is stored in localStorage
      setIsAdmin(role === "admin");
    };
    
    checkUserRole();
  }, []);

  const handleRowClick = (agent) => {
    setSelectedAgent(agent);
    setShowPopup(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const handleStatusChange = (status) => {
    if (!isAdmin) return;
    if (selectedAgent) {
      setSelectedAgent({ ...selectedAgent, AgentStatus: status });
    }
  };

  const saveChanges = async () => {
    if (selectedAgent) {
      try {
        const token = localStorage.getItem("token"); // Retrieve authentication token
        const response = await fetch("http://192.168.100.20:5056/api/update/update-freight-agents/status", {
          method: "PUT", // Use PUT or POST based on your backend implementation
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token if required
          },
          body: JSON.stringify({
            AgentID: selectedAgent.AgentID,
            AgentStatus: selectedAgent.AgentStatus,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update the agent status.");
        }
  
        const updatedAgent = await response.json(); // Get the updated agent from the response
  
      // Fetch fresh data after successful update
      const refreshResponse = await fetch(
        "http://192.168.100.20:5056/api/select/view-freight-agents",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setAgents(refreshedData.freightAgents || []);
      }
  
        console.log("Agent status updated successfully:");
      } catch (error) {
        console.error("Error updating agent status:", error.message);
      }
    }
    closePopup();
  };

  // Close only the agent details popup
const closePopup = () => {
  setSelectedAgent(null);
  setShowPopup(false);
};

// Close only the coordinator details popup
const closeCoordinatorPopup = () => {
  setShowCoordinatorPopup(false);
};

  
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesStatus =
      filterStatus === "All" || agent.AgentStatus === filterStatus;
    const matchesSearch =
      agent.Freight_Agent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCoordinatorsForAgent = async(agentID) => {
    if (!agentID) {
      console.error("No agent selected.");
      return;
    }
    try{
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

          // Fetch coordinators for the selected agent
    const response = await fetch(
      `http://192.168.100.20:5056/api/select/view-freight-agents/coordinators/${agentID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coordinators.");
    }

    const coordinatorsData = await response.json();
    setCoordinators(coordinatorsData.freightCoordinators || []);
    }catch (error) {
    console.error("Error fetching coordinators:", error.message);
    setCoordinators([]);
  }
    // return coordinators.filter((coord) => coord.Freight_Agent === agentID);
  };

  // Handle View Coordinators button click
const handleViewCoordinatorsClick = async() => {
  await getCoordinatorsForAgent(selectedAgent.AgentID);
  setShowCoordinatorPopup(true)
};


return (
  <div className="bg-gray-50 min-h-screen">
    <Header />
    <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Filters Section */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex flex-wrap gap-3">
            {[
              { status: "All", count: agents.length, color: "bg-gradient-to-r from-[#0534F0] to-[#98009E]" },
              { status: "Active", count: agents.filter(a => a.AgentStatus === "Active").length, color: "bg-green-600" },
              { status: "Non Active", count: agents.filter(a => a.AgentStatus === "Non Active").length, color: "bg-yellow-500" },
              
            ].map((filter, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterChange(filter.status)}
                className={`px-4 py-2 rounded-full transition-all ${
                  filterStatus === filter.status 
                    ? `${filter.color.includes('bg') ? filter.color : 'bg-gradient-to-r'} text-white shadow-lg`
                    : 'bg-white text-gray-600 shadow-md hover:shadow-lg'
                } ${filter.color.startsWith('bg') ? '' : 'bg-gradient-to-r'}`}
              >
                {filter.status} ({filter.count})
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#0534F0] focus:ring-2 focus:ring-[#0534F0]/20 transition-all"
            />
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#0534F0] to-[#98009E]">
              <tr>
                {['Freight Agent', 'Email', 'Contact', 'Coordinators', 'Status'].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 h-[400px]">
              {filteredAgents.map((agent, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(agent)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 max-w-xs text-center text-gray-900 font-medium truncate">
                    {agent.Freight_Agent}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{agent.Email || 'N/A'}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{agent.ContactNumber}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {agent.CoordinatorCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      agent.AgentStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      agent.AgentStatus === 'Non Active' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.AgentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAgents.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No agents found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Agent Details Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-[#0534F0] to-[#98009E] p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{selectedAgent.Freight_Agent}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedAgent.AgentStatus === 'Active' ? 'bg-green-100/20 text-green-100' :
                  selectedAgent.AgentStatus === 'Non Active' ? 'bg-yellow-100/20 text-yellow-100' :
                  'bg-red-100/20 text-red-100'
                }`}>
                  {selectedAgent.AgentStatus}
                </span>
              </div>
            </div>

            {/* Popup Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Selector */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Active', 'Non Active',].map(status => (
                    <label
                      key={status}
                      className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        selectedAgent.AgentStatus === status 
                          ? 'border-[#0534F0] bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'
                      } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={selectedAgent.AgentStatus === status}
                        onChange={() => handleStatusChange(status)}
                        disabled={!isAdmin}
                        className="h-5 w-5 text-[#0534F0] border-2 border-gray-300 rounded-full"
                      />
                      <span className="font-medium">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Details Card */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Business Details</h3>
                  <div className="space-y-2">
                    <DetailItem label="BR Number" value={selectedAgent.BRNumber} />
                    <DetailItem label="Country" value={selectedAgent.Country} />
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <DetailItem label="Email" value={selectedAgent.Email} />
                    <DetailItem label="Phone" value={selectedAgent.ContactNumber} />
                    <DetailItem label="Address" value={selectedAgent.Address} />
                  </div>
                </div>

                {/* Directors Section */}
                {[1, 2].map(num => (
                  selectedAgent[`Director${num}_Name`] && (
                    <div key={num} className="bg-gray-50 p-5 rounded-xl">
                      <h3 className="text-sm font-semibold text-gray-500 mb-3">Director {num}</h3>
                      <div className="space-y-2">
                        <DetailItem label="Name" value={selectedAgent[`Director${num}_Name`]} />
                        <DetailItem label="Contact" value={selectedAgent[`Director${num}_Contact_Number`]} />
                        <DetailItem label="Email" value={selectedAgent[`Director${num}_Email`]} />
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleViewCoordinatorsClick}
                  className="py-3 bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  View Coordinators ({selectedAgent.CoordinatorCount})
                </button>
                <button
                  onClick={saveChanges}
                  className="py-3 bg-green-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
                <button
                  onClick={closePopup}
                  className="py-3 bg-red-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coordinators Popup */}
      {showCoordinatorPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-[#0534F0] to-[#98009E] p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Coordinators</h2>
                <button
                  onClick={closeCoordinatorPopup}
                  className="text-white hover:text-gray-200"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coordinators.map((coordinator, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{coordinator.Coordinator_Name}</td>
                      <td className="px-4 py-3 text-gray-600">{coordinator.Email}</td>
                      <td className="px-4 py-3 text-gray-600">{coordinator.ContactNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
);
}

// Helper component for detail items
const DetailItem = ({ label, value }) => (
<div className="flex justify-between items-center">
  <span className="text-sm text-gray-600">{label}:</span>
  <span className="text-sm text-gray-900 font-medium">{value || 'N/A'}</span>
</div>
);

// XIcon component for close button
const XIcon = ({ className }) => (
<svg
  className={className}
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M6 18L18 6M6 6l12 12"
  />
</svg>
);

export default Dashboard;