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
          "http://localhost:5056/api/select/view-freight-agents",
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
          console.error("Unauthorized. Redirecting to login.");
          navigate('/login'); // Navigate to login page
          return;
          // Handle unauthorized error (e.g., redirect to login page)
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
        const response = await fetch("http://localhost:5056/api/update/update-freight-agents/status", {
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
        "http://localhost:5056/api/select/view-freight-agents",
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
    <div>
      <Header />
      <main className="mt-24">
        <div className="p-4 mt-8">
        <div className="flex items-center justify-between mb-6">
      <div className="flex flex-wrap justify-start gap-4 mb-6">
        <button
          onClick={() => handleFilterChange("All")}
          className={`px-4 py-2 rounded-full border-2 ${
            filterStatus === "All"
              ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white border-transparent"
              : "border-gray-400 text-gray-700 hover:border-[#0534F0] hover:text-[#0534F0]"
          }`}
        >
          All ({agents.length})
        </button>
        <button
          onClick={() => handleFilterChange("Active")}
          className={`px-4 py-2 rounded-full border-2 ${
            filterStatus === "Active"
              ? "bg-green-600 text-white border-transparent"
              : "border-gray-400 text-gray-700 hover:border-green-600 hover:text-green-600"
          }`}
        >
          Active ({agents.filter((agent) => agent.AgentStatus === "Active").length})
        </button>
        <button
          onClick={() => handleFilterChange("Non Active")}
          className={`px-4 py-2 rounded-full border-2 ${
            filterStatus === "Non Active"
              ? "bg-yellow-500 text-white border-yellow-500"
              : "border-gray-400 text-gray-500 hover:border-yellow-500 hover:text-yellow-500"
          }`}
        >
          Non Active (
          {agents.filter((agent) => agent.AgentStatus === "Non Active").length}
          )
        </button>
        <button
          onClick={() => handleFilterChange("Blacklisted")}
          className={`px-4 py-2 rounded-full border-2 ${
            filterStatus === "Blacklisted"
              ? "bg-red-500 text-white border-red-500"
              : "border-gray-400 text-gray-500 hover:border-red-500 hover:text-red-500"
          }`}
        >
          Blacklisted (
          {agents.filter((agent) => agent.AgentStatus === "Blacklisted").length}
          )
        </button>
      </div>
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center border border-gray-300 rounded-full overflow-hidden h-10"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Agent Name"
          className="flex-grow outline-none px-4 text-sm"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white hover:from-[#0429C7] hover:to-[#7A0080] transition-all duration-300"
        >
          <FaSearch />
        </button>
      </form>
    </div>

    <div className="table-wrapper border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full bg-white">
        <thead className="bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white sticky top-0 z-[1]">
          <tr>
            <th className="px-6 py-3 text-center font-semibold text-sm">Freight Agent Name</th>
            <th className="px-6 py-3 text-center font-semibold text-sm">Email</th>
            <th className="px-6 py-3 text-center font-semibold text-sm">Contact Numbers</th>
            <th className="px-6 py-3 text-center font-semibold text-sm">No. of Coordinators</th>
            <th className="px-6 py-3 text-center font-semibold text-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 overflow-y-auto h-[400px]">
          {filteredAgents.map((agent, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(agent)}
              className="hover:bg-gray-50 cursor-pointer transition-all duration-300"
            >
              <td className="px-6 py-4 text-sm text-center font-medium text-gray-700">{agent.Freight_Agent}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-500">{agent.Email || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-500">{agent.ContactNumber}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-500">{agent.CoordinatorCount}</td>
              <td className="px-6 py-4 text-sm text-center font-medium text-gray-700">
                <span
                  className={`px-3 py-1 rounded-full border-2 
                    ${
                      agent.AgentStatus === "Active"
                        ? "border-green-700 bg-green-100 text-green-700"
                        : agent.AgentStatus === "Non Active"
                        ? "border-yellow-700 bg-yellow-100 text-yellow-700"
                        : "border-red-700 bg-red-100 text-red-700"
                    }`}
                >
                  {agent.AgentStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {showPopup && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
    <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0534F0] to-[#98009E] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {selectedAgent.Freight_Agent}
          </h2>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold
            ${selectedAgent.AgentStatus === "Active" ? 'bg-green-100/20 text-green-100 border border-green-200/30' :
              selectedAgent.AgentStatus === "Non Active" ? 'bg-yellow-100/20 text-yellow-100 border border-yellow-200/30' :
              'bg-red-100/20 text-red-100 border border-red-200/30'}`
          }>
            {selectedAgent.AgentStatus}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 overflow-y-auto">
        {/* Status Control Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
            {!isAdmin && <span className="text-sm text-gray-500">(Admin only)</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Active", "Non Active", "Blacklisted"].map((status) => (
              <label 
                key={status}
                className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3
                  ${selectedAgent.AgentStatus === status ? 
                    'border-[#0534F0] bg-blue-50' : 
                    'border-gray-200 hover:border-blue-200'}
                  ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedAgent.AgentStatus === status}
                  onChange={() => handleStatusChange(status)}
                  disabled={!isAdmin}
                  className="form-radio h-5 w-5 text-[#0534F0] border-2 border-gray-300"
                />
                <span className={`font-medium ${
                  selectedAgent.AgentStatus === status ? 
                  'text-[#0534F0]' : 'text-gray-700'}`}
                >
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Business Details</h3>
              <div className="space-y-2">
                <p><span className="font-semibold text-gray-800">BR Number:</span> {selectedAgent.BRNumber || "—"}</p>
                <p><span className="font-semibold text-gray-800">Country:</span> {selectedAgent.Country || "—"}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold text-gray-800">Email:</span> {selectedAgent.Email || "—"}</p>
                <p><span className="font-semibold text-gray-800">Phone:</span> {selectedAgent.ContactNumber || "—"}</p>
                <p><span className="font-semibold text-gray-800">Address:</span> {selectedAgent.Address || "—"}</p>
              </div>
            </div>
          </div>

          {/* Directors Section */}
          <div className="space-y-6">
            {[selectedAgent.Director1_Name, selectedAgent.Director2_Name].map((director, index) => (
              director && (
                <div key={index} className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Director {index + 1}
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium text-gray-700">Name:</span> {director}</p>
                    <p><span className="font-medium text-gray-700">Contact:</span> 
                      {selectedAgent[`Director${index+1}_Contact_Number`] || "—"}
                    </p>
                    <p><span className="font-medium text-gray-700">Email:</span> 
                      {selectedAgent[`Director${index+1}_Email`] || "—"}
                    </p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 border-t pt-6">
          <button
            onClick={handleViewCoordinatorsClick}
            className="flex-1 py-3 bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white rounded-xl
                      hover:from-[#0429C7] hover:to-[#7A0080] transition-all shadow-lg
                      flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Coordinators ({selectedAgent.CoordinatorCount})
          </button>
          <button
            onClick={saveChanges}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl
                      hover:from-green-600 hover:to-green-700 transition-all shadow-lg
                      flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
          <button
            onClick={closePopup}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl
                      hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
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
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70]">
    <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-3xl max-h-[90vh] flex flex-col">
      <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-[#0534F0] to-[#98009E]">
        <h2 className="text-xl font-bold text-white">Coordinators List</h2>
        <button
          onClick={closeCoordinatorPopup}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coordinators.map((coordinator, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center font-medium text-gray-900">{coordinator.Coordinator_Name}</td>
                <td className="px-6 py-4 text-center font-medium text-gray-600 break-all">{coordinator.Email}</td>
                <td className="px-6 py-4 text-center font-medium text-gray-600">{coordinator.ContactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={closeCoordinatorPopup}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-lg"
        >
          Close Window
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;