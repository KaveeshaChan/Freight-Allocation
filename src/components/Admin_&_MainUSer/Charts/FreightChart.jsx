import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FreightChart = ({ selectedType }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://192.168.100.20:5056/api/select/view-freight-agents/shipments",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setData(result.shipments);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    const filtered = data
      .filter((item) => item.orderType === selectedType)
      .sort((a, b) => {
        const totalA = a.AirFreight_Count + a.LCL_Count + a.FCL_Count;
        const totalB = b.AirFreight_Count + b.LCL_Count + b.FCL_Count;
        return totalB - totalA;
      });

    setFilteredData(filtered);
  }, [selectedType, data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 font-medium">{entry.name}:</span>
                <span className="text-gray-800 font-semibold">
                  {new Intl.NumberFormat('en').format(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto">
      

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium text-sm">
            Loading shipment data...
          </p>
        </div>
      ) : filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400} className="mt-2">
          <BarChart
            layout="vertical"
            data={filteredData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <XAxis
              type="number"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}
              label={{ 
                value: 'Number of Shipments',
                position: 'bottom',
                offset: 0,
                fontSize: 12,
                fill: '#374151'
              }}
            />

            <YAxis
              dataKey="Freight_Agent"
              type="category"
              width={140}
              tick={{
                fill: '#1F2937',
                fontSize: 12,
                fontWeight: 500,
              }}
              axisLine={{ stroke: 'transparent' }}
              tickLine={{ stroke: 'transparent' }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#F3F4F6' }}
            />

            <Legend
              wrapperStyle={{ 
                paddingTop: '20px',
                paddingBottom: '10px'
              }}
              iconSize={12}
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => (
                <span className="text-gray-600 text-sm font-medium">
                  {value}
                </span>
              )}
            />

            <Bar
              dataKey="AirFreight_Count"
              fill="#3B82F6"
              name="Air Freight"
              radius={[0, 4, 4, 0]}
              animationDuration={400}
            />
            <Bar
              dataKey="LCL_Count"
              fill="#10B981"
              name="LCL"
              radius={[0, 4, 4, 0]}
              animationDuration={400}
            />
            <Bar
              dataKey="FCL_Count"
              fill="#F59E0B"
              name="FCL"
              radius={[0, 4, 4, 0]}
              animationDuration={400}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500 font-medium">
            No shipments found for {selectedType}
          </p>
        </div>
      )}
    </div>
  );
};

export default FreightChart;