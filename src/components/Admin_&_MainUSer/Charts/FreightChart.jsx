import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FreightChart = ({ selectedType }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:5056/api/select/view-freight-agents/shipments",
        {
            method: "GET", // Use GET for fetching data
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach token
            },
        });
        const result = await response.json();
        setData(result.shipments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedType]);

  // Filter data based on selected order type (Import / Export)
  useEffect(() => {
    const filtered = data.filter((item) => item.orderType === selectedType);
    setFilteredData(filtered);
  }, [selectedType, data]);

  return (
    <div className="mx-auto bg-white">
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            key={selectedType}
            layout="vertical"
            data={filteredData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="Freight_Agent" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="AirFreight_Count" fill="#3182CE" name="Air Freight" animationDuration={800} />
            <Bar dataKey="LCL_Count" fill="#38A169" name="LCL" animationDuration={800} />
            <Bar dataKey="FCL_Count" fill="#E53E3E" name="FCL" animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">Loading chart data...</p>
      )}
    </div>
  );
  
};

export default FreightChart;
