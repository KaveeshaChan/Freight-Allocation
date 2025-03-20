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
    if (!data || !Array.isArray(data)) {
      setFilteredData([]);
      return;
    }
  
    const filtered = data.filter((item) => item.orderType === selectedType);
    setFilteredData(filtered);
  }, [selectedType, data]);

  return (
    <div className="mx-auto bg-gray-100 shadow shadow-md rounded-xl transition-all duration-300">
        {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height={335} className="fade-in">
                <BarChart
                    key={selectedType}
                    layout="vertical"
                    data={filteredData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                    <defs>
                    <linearGradient id="airGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#03045E" />
                        <stop offset="100%" stopColor="#63B3ED" />
                    </linearGradient>
                    <linearGradient id="lclGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6CD900" />
                        <stop offset="100%" stopColor="#68D391" />
                    </linearGradient>
                    <linearGradient id="fclGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ff0000" />
                        <stop offset="100%" stopColor="#FC8181" />
                    </linearGradient>
                    </defs>

                    <XAxis 
                        type="number" 
                        tick={{ fill: '#4A5568' }}
                        axisLine={{ stroke: '#CBD5E0' }}
                        tickLine={{ stroke: '#CBD5E0' }}
                    />
                    <YAxis 
                        dataKey="Freight_Agent" 
                        type="category" 
                        width={150} 
                        tick={{ fill: '#2D3748', fontWeight: 500 }}
                        axisLine={{ stroke: '#CBD5E0' }}
                        tickLine={{ stroke: '#CBD5E0' }}
                    />
        
                    <Tooltip 
                    cursor={false}
                    contentStyle={{
                        background: '#1A202C',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                    }}
                    itemStyle={{ color: 'white' }}
                />
        
                <Legend 
                    wrapperStyle={{ paddingTop: '5px' }}
                    formatter={(value) => (
                        <span className="text-gray-700 font-medium">{value}</span>
                    )}
                />
        
                <Bar 
                    dataKey="AirFreight_Count" 
                    fill="url(#airGradient)" 
                    name="Air Freight" 
                    animationDuration={800}
                    animationEasing="ease-in-out"
                    radius={[0, 4, 4, 0]}
                    animationBegin={100}
                />
                <Bar 
                    dataKey="LCL_Count" 
                    fill="url(#lclGradient)" 
                    name="LCL" 
                    animationDuration={800}
                    animationEasing="ease-in-out"
                    radius={[0, 4, 4, 0]}
                    animationBegin={200}
                />
                <Bar 
                    dataKey="FCL_Count" 
                    fill="url(#fclGradient)" 
                    name="FCL" 
                    animationDuration={800}
                    animationEasing="ease-in-out"
                    radius={[0, 4, 4, 0]}
                    animationBegin={300}
                />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500 animate-pulse">
                    <span className="inline-block animate-bounce mr-2">⏳</span>
                    Loading chart data...
                </p>
            )}
        </div>
    );
  
};

export default FreightChart;
