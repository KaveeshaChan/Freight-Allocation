// Import necessary libraries
import React, { useState } from 'react';
import Layout from './Layouts/Main_Layout';
import { FaSearch } from 'react-icons/fa';
import '../assests/table.css';

// Mock JSON data
const agents = [
  {
    AgentID: -1,
    Freight_Agent: "Basilur",
    Address: "",
    ContactNumber: "+90000000000",
    Email: "",
    Director1_Name: "",
    Director1_Contact_Number: "+90000000000",
    Director1_Email: "",
    Director2_Name: "",
    Director2_Contact_Number: "+90000000000",
    Director2_Email: "",
    BRNumber: "",
    Country: null,
    PasswordHash: "",
    AgentStatus: "Blacklisted",
  },
  {
    AgentID: -1,
    Freight_Agent: "Basilur",
    Address: "",
    ContactNumber: "+90000000000",
    Email: "",
    Director1_Name: "",
    Director1_Contact_Number: "+90000000000",
    Director1_Email: "",
    Director2_Name: "",
    Director2_Contact_Number: "+90000000000",
    Director2_Email: "",
    BRNumber: "",
    Country: null,
    PasswordHash: "",
    AgentStatus: "Blacklisted",
  },{
    AgentID: -1,
    Freight_Agent: "Basilur",
    Address: "",
    ContactNumber: "+90000000000",
    Email: "",
    Director1_Name: "",
    Director1_Contact_Number: "+90000000000",
    Director1_Email: "",
    Director2_Name: "",
    Director2_Contact_Number: "+90000000000",
    Director2_Email: "",
    BRNumber: "",
    Country: null,
    PasswordHash: "",
    AgentStatus: "Blacklisted",
  },{
    AgentID: -1,
    Freight_Agent: "Basilur",
    Address: "",
    ContactNumber: "+90000000000",
    Email: "",
    Director1_Name: "",
    Director1_Contact_Number: "+90000000000",
    Director1_Email: "",
    Director2_Name: "",
    Director2_Contact_Number: "+90000000000",
    Director2_Email: "",
    BRNumber: "",
    Country: null,
    PasswordHash: "",
    AgentStatus: "Blacklisted",
  },{
    AgentID: -1,
    Freight_Agent: "Basilur",
    Address: "",
    ContactNumber: "+90000000000",
    Email: "",
    Director1_Name: "",
    Director1_Contact_Number: "+90000000000",
    Director1_Email: "",
    Director2_Name: "",
    Director2_Contact_Number: "+90000000000",
    Director2_Email: "",
    BRNumber: "",
    Country: null,
    PasswordHash: "",
    AgentStatus: "Blacklisted",
  },{
    AgentID: -1,
    Freight_Agent: "Basilur",
    Address: "",
    ContactNumber: "+90000000000",
    Email: "",
    Director1_Name: "",
    Director1_Contact_Number: "+90000000000",
    Director1_Email: "",
    Director2_Name: "",
    Director2_Contact_Number: "+90000000000",
    Director2_Email: "",
    BRNumber: "",
    Country: null,
    PasswordHash: "",
    AgentStatus: "Blacklisted",
  },
  {
    AgentID: 13,
    Freight_Agent: "Hayleys Agro",
    Address: "Sapugaskanda",
    ContactNumber: "+94378999789",
    Email: "hayleysagro@gmail.com",
    Director1_Name: "John Doe",
    Director1_Contact_Number: "+94778899789",
    Director1_Email: "johndoe@gmail.com",
    Director2_Name: "David Guetta",
    Director2_Contact_Number: "+94780002133",
    Director2_Email: "davidguetta@gmail.com",
    BRNumber: "HT00-98/7709-SL",
    Country: "Sri Lanka",
    PasswordHash: "$2a$10$N8A0rij7UfZXE4YmHg4wBu2m7G6tYZGbiDKPkLglW53lK/PbF5KLO",
    AgentStatus: "Non Active",
  },
  {
    AgentID: 11,
    Freight_Agent: "Aroo Ltd",
    Address: "Kandy",
    ContactNumber: "+94778767345",
    Email: "aroo@gmail.com",
    Director1_Name: "Smith Holger",
    Director1_Contact_Number: "+94761122345",
    Director1_Email: "smith@gmail.com",
    Director2_Name: "",
    Director2_Contact_Number: "",
    Director2_Email: "",
    BRNumber: "BL09-7788-DF",
    Country: "Sri Lanka",
    PasswordHash: "$2a$10$JEV/CNitic1Ir6cf.DrT/eGy9XyJXuf8FiM8W5fD7MNfb3384.Msq",
    AgentStatus: "Active",
  },
  {
    AgentID: 11,
    Freight_Agent: "Aroo Ltd",
    Address: "Kandy",
    ContactNumber: "+94778767345",
    Email: "aroo@gmail.com",
    Director1_Name: "Smith Holger",
    Director1_Contact_Number: "+94761122345",
    Director1_Email: "smith@gmail.com",
    Director2_Name: "",
    Director2_Contact_Number: "",
    Director2_Email: "",
    BRNumber: "BL09-7788-DF",
    Country: "Sri Lanka",
    PasswordHash: "$2a$10$JEV/CNitic1Ir6cf.DrT/eGy9XyJXuf8FiM8W5fD7MNfb3384.Msq",
    AgentStatus: "Active",
  },
  {
    AgentID: 11,
    Freight_Agent: "Aroo Ltd",
    Address: "Kandy",
    ContactNumber: "+94778767345",
    Email: "aroo@gmail.com",
    Director1_Name: "Smith Holger",
    Director1_Contact_Number: "+94761122345",
    Director1_Email: "smith@gmail.com",
    Director2_Name: "",
    Director2_Contact_Number: "",
    Director2_Email: "",
    BRNumber: "BL09-7788-DF",
    Country: "Sri Lanka",
    PasswordHash: "$2a$10$JEV/CNitic1Ir6cf.DrT/eGy9XyJXuf8FiM8W5fD7MNfb3384.Msq",
    AgentStatus: "Active",
  },
  
];

const coordinators = [
  {
    CoordinatorID: 6,
    Coordinator_Name: "Tharaka Jayanath",
    ContactNumber: "+94778888908",
    Email: "tharaka@abc.com",
    Freight_Agent: 1,
  },
  {
    CoordinatorID: 8,
    Coordinator_Name: "Jayanath Pankaja",
    ContactNumber: "+94785647232",
    Email: "jayanath@blueshark.com",
    Freight_Agent: 13,
  },
  {
    CoordinatorID: 8,
    Coordinator_Name: "Jayanath Pankaja",
    ContactNumber: "+94785647232",
    Email: "jayanath@blueshark.com",
    Freight_Agent: 13,
  },
  {
    CoordinatorID: 7,
    Coordinator_Name: "Kasun Sampath",
    ContactNumber: "+94781231245",
    Email: "sampath@arro.com",
    Freight_Agent: 11,
  },
];

function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCoordinatorPopup, setShowCoordinatorPopup] = useState(false); // New state for coordinator popup
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(agents);

  const handleRowClick = (agent) => {
    setSelectedAgent(agent);
    setShowPopup(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const handleStatusChange = (status) => {
    if (selectedAgent) {
      setSelectedAgent({ ...selectedAgent, AgentStatus: status });
    }
  };

  const saveChanges = () => {
    if (selectedAgent) {
      setData((prevData) =>
        prevData.map((agent) =>
          agent.AgentID === selectedAgent.AgentID ? selectedAgent : agent
        )
      );
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

  const filteredAgents = data.filter((agent) => {
    const matchesStatus =
      filterStatus === "All" || agent.AgentStatus === filterStatus;
    const matchesSearch =
      agent.Freight_Agent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCoordinatorsForAgent = (agentID) => {
    return coordinators.filter((coord) => coord.Freight_Agent === agentID);
  };

  // Handle View Coordinators button click
  const handleViewCoordinatorsClick = () => {
    setShowCoordinatorPopup(true);
  };
  

  return (
    <Layout>
      <div className="p-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <span className="px-4 py-2 border-2 border-orange-500 text-orange-500 bg-transparent rounded-md">
            View Freight Agents
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

        {/* Filter Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => handleFilterChange("All")}
            className={`px-4 py-2 rounded-full border-2 ${
              filterStatus === "All"
                ? "bg-orange-500 text-white border-orange-500"
                : "border-gray-400 text-gray-500 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            All ({data.length})
          </button>
          <button
            onClick={() => handleFilterChange("Active")}
            disabled={filterStatus === "Active"}
            className={`px-4 py-2 rounded-full border-2 ${filterStatus === "Active" ? "bg-green-500 text-white border-green-500" : "border-gray-400 text-gray-500 hover:border-green-500 hover:text-green-500"}`}
          >
            Active ({data.filter((agent) => agent.AgentStatus === "Active").length})
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
            {data.filter((agent) => agent.AgentStatus === "Non Active").length}
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
            {data.filter((agent) => agent.AgentStatus === "Blacklisted").length}
            )
          </button>
        </div>

        <div className="table-wrapper border border-gray-300 rounded-lg shadow-lg overflow-hidden">
  <table className="min-w-full bg-white">
  <thead className="bg-gradient-to-r from-orange-600 to-orange-500 text-white sticky top-0 z-[1]">

      <tr>
        <th className="px-6 py-3 text-left font-semibold text-sm">Freight Agent Name</th>
        <th className="px-6 py-3 text-left font-semibold text-sm">Email</th>
        <th className="px-6 py-3 text-left font-semibold text-sm">Contact Numbers</th>
        <th className="px-6 py-3 text-left font-semibold text-sm">No. of Coordinators</th>
        <th className="px-6 py-3 text-left font-semibold text-sm">Status</th>
      </tr>
    </thead>
    <tbody
      className="divide-y divide-gray-200 overflow-y-auto h-[400px]" // Added scrollable height
    >
      {filteredAgents.map((agent, index) => (
        <tr
          key={index}
          onClick={() => handleRowClick(agent)}
          className="hover:bg-orange-50 cursor-pointer transition-all duration-300"
        >
          <td className="px-6 py-4 text-sm font-medium text-gray-700">{agent.Freight_Agent}</td>
          <td className="px-6 py-4 text-sm text-gray-500">{agent.Email || "N/A"}</td>
          <td className="px-6 py-4 text-sm text-gray-500">{agent.ContactNumber}</td>
          <td className="px-6 py-4 text-sm text-gray-500">
            {getCoordinatorsForAgent(agent.AgentID).length}
          </td>
          <td className="px-6 py-4 text-sm font-medium text-gray-700">
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
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] transition-opacity duration-300"
    role="dialog"
    aria-labelledby="agentPopupTitle"
    aria-modal="true"
  >
    <div
      className="relative bg-white p-8 rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-auto transform transition-all duration-300"
      style={{ marginTop: '100px' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          id="agentPopupTitle"
          className="text-2xl font-semibold text-gray-800 text-center"
        >
          {selectedAgent.Freight_Agent}
        </h2>
        <span
          className={`px-3 py-1 rounded-full border-2 text-sm font-medium 
            ${selectedAgent.AgentStatus === "Active"
              ? "border-green-700 bg-green-100 text-green-700"
              : selectedAgent.AgentStatus === "Non Active"
              ? "border-yellow-700 bg-yellow-100 text-yellow-700"
              : "border-red-700 bg-red-100 text-red-700"
            }`}
        >
          {selectedAgent.AgentStatus}
        </span>
      </div>

      {/* Change Status Section */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2 text-gray-700">Change Status:</h3>
        <div className="flex gap-4 items-center">
          {["Active", "Non Active", "Blacklisted"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 text-sm font-medium cursor-pointer"
            >
              <input
                type="radio"
                name="status"
                value={status}
                checked={selectedAgent.AgentStatus === status}
                onChange={() => handleStatusChange(status)}
                className="form-radio text-blue-500"
              />
              <span
                className={`${
                  selectedAgent.AgentStatus === status
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact and Details Section */}
      <div className="space-y-6 mt-6 border-t pt-4">
        {/* BR Number */}
        <div className="flex justify-between">
          <p>
            <strong className="font-semibold text-gray-700">BR Number:</strong>{" "}
            {selectedAgent.BRNumber || "N/A"}
          </p>
        </div>

        {/* Company Address and Country */}
        <div className="flex justify-between">
          <p>
            <strong className="font-semibold text-gray-700">Company Address:</strong>{" "}
            {selectedAgent.Address || "N/A"}
          </p>
          <p>
            <strong className="font-semibold text-gray-700">Country:</strong>{" "}
            {selectedAgent.Country || "N/A"}
          </p>
        </div>

        {/* Email and Contact Number */}
        <div className="flex justify-between">
          <p>
            <strong className="font-semibold text-gray-700">Email:</strong>{" "}
            {selectedAgent.Email || "N/A"}
          </p>
          <p>
            <strong className="font-semibold text-gray-700">Contact:</strong>{" "}
            {selectedAgent.ContactNumber || "N/A"}
          </p>
        </div>

        {/* Director Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Director 1</h3>
            <p>
              <strong className="font-semibold">Name:</strong>{" "}
              {selectedAgent.Director1_Name || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Contact:</strong>{" "}
              {selectedAgent.Director1_Contact_Number || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Email:</strong>{" "}
              {selectedAgent.Director1_Email || "N/A"}
            </p>
          </div>
          {selectedAgent.Director2_Name && (
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Director 2</h3>
              <p>
                <strong className="font-semibold">Name:</strong>{" "}
                {selectedAgent.Director2_Name || "N/A"}
              </p>
              <p>
                <strong className="font-semibold">Contact:</strong>{" "}
                {selectedAgent.Director2_Contact_Number || "N/A"}
              </p>
              <p>
                <strong className="font-semibold">Email:</strong>{" "}
                {selectedAgent.Director2_Email || "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={handleViewCoordinatorsClick}
          className="px-6 py-3 bg-transparent border border-blue-500 text-blue-500 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"

        >
          View Coordinators (
          {getCoordinatorsForAgent(selectedAgent.AgentID).length})
        </button>
        <button
          onClick={saveChanges}
          className="px-6 py-3 bg-transparent border border-green-500 text-green-500 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300"
        >
          Save
        </button>
        <button
          onClick={closePopup}
          className="px-6 py-3 bg-transparent border border-red-500 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}





{/* Popup for Coordinators */}
{showCoordinatorPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
    <div className="bg-white p-8 rounded-xl shadow-xl w-[800px] max-h-[80vh] overflow-hidden transform transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Coordinators</h2>
      
      <div className="overflow-y-auto max-h-[400px]">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Coordinator Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Contact Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {getCoordinatorsForAgent(selectedAgent.AgentID).map((coordinator, index) => (
              <tr key={index} className="hover:bg-orange-50 cursor-pointer transition-all duration-300">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{coordinator.Coordinator_Name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{coordinator.Email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{coordinator.ContactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={closeCoordinatorPopup} // Close only the coordinator popup
          className="px-6 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 transform"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}



      </div>
    </Layout>
  );
}

export default Dashboard;
