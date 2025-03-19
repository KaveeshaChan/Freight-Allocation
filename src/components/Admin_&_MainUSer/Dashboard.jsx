import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layouts/Main_Layout';
import ReactApexChart from 'react-apexcharts';
import FreightChart from './Charts/FreightChart';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();
  const [quotesData, setQuotesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [chartData, setChartData] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(15);
  const [cancelledFilterType, setCancelledFilterType] = useState('all');
  const [cancelledFilterValue, setCancelledFilterValue] = useState('');
  const [cancelledStats, setCancelledStats] = useState({ allCancelledOrders: 0, totalOrders: 0 });
  const [selectedType, setSelectedType] = useState("export");
  const [stats, setStats] = useState({
    totalActiveAgents: 0,
    allAgents: 0,
    totalOrders: 0,
    totalInProgressOrders: 0,
    allImportAF: 0,
    allImportLCL: 0,
    allImportFCL: 0,
    allExportAF: 0,
    allExportLCL: 0,
    allExportFCL: 0,
    totalPendingOrders: 0,
    revenue: 0,
  });

  // Chart configuration
  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      height: 300,
    },
    colors: ['#1C64F2', '#3B82F6', '#60A5FA', '#10B981', '#059669', '#047857'],
    labels: [
      'Import Air Freight',
      'Import FCL',
      'Import LCL',
      'Export Air Freight',
      'Export FCL',
      'Export LCL',
    ],
    dataLabels: {
        enabled: true,
        style: {
            fontSize: "14px",
            fontWeight: "bold",
            colors: ["#fff"],
        },
        dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.6,
          },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
            size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Orders',
              fontSize: "16px",
              fontWeight: 600,
              color: "#444",
              formatter: () => stats.totalOrders
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
        position: "bottom",
        fontSize: "14px",
        labels: { colors: "#333" },
        markers: { width: 12, height: 12, radius: 6 },
      },
    tooltip: {
        enabled: true,
        theme: "dark",
        style: { fontSize: "14px" },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' }
      }
    }]
  };

  const chartSeries = [
    stats.allImportAF,
    stats.allImportFCL,
    stats.allImportLCL,
    stats.allExportAF,
    stats.allExportFCL,
    stats.allExportLCL,
  ];

  // Chart options configuration
  const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            position: 'top',
           },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = filteredData[context.dataIndex];
                if (!item) return "No Data";
                return `Quotations: ${item.quotationCount}/${item.emailCount} • Due in ${item.daysRemaining} days`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Quotation Count' },
            grid: { color: 'rgba(200, 200, 200, 0.3)' },
            ticks: { 
              color: '#666',
              stepSize: 1,
            },
          },
          x: {
            title: { display: true, text: 'Order Numbers' },
            grid: { display: false },
            ticks: { 
              color: '#666',
              maxRotation: 45
            }
          }
        },
        barThickness: 5
  };

  useEffect(() => {
    if (quotesData?.quoteCounts?.length > 0) {
        const filtered = quotesData.quoteCounts.filter(item => 
            statusFilter === 'all' ? true : item.orderStatus === statusFilter
        );
        setFilteredData(filtered);

        if (filtered.length === 0) {
          console.warn("No matching data found for selected filter!");
          setChartData(null);
          return;
        }

        // Calculate maxEmailCount
        const maxEmailCount = Math.max(...filtered.map(item => item.emailCount), 0);
        const datasets = [];

        // Always show these categories when viewing all statuses
        if (statusFilter === 'all') {
          datasets.push(
            {
              label: 'Urgent (≤3 days)',
              data: filtered.map(item =>
                item.orderStatus === 'active' && item.daysRemaining <=3 && item.daysRemaining > 0
                ? item.quotationCount
                :0
              ),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Warning (4-8 days)',
              data: filtered.map(item =>
                item.orderStatus === 'active' && item.daysRemaining > 3 && item.daysRemaining <= 8
                ? item.quotationCount
                : 0
              ),
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
            {
              label: 'Normal (>8 days)',
              data: filtered.map(item => 
                item.orderStatus === 'active' && item.daysRemaining > 8 
                  ? item.quotationCount 
                  : 0
              ),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Pending',
              data: filtered.map(item => 
                item.orderStatus === 'pending' 
                  ? item.quotationCount 
                  : 0
              ),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            }
          );
        }

        // Status-specific datasets
        if (statusFilter === 'all' || statusFilter === 'completed') {
          datasets.push({
            label: 'Completed',
            data: filtered.map(item => 
              item.orderStatus === 'completed' 
                ? item.quotationCount 
                : 0
            ),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          });
        }

        // Handle active status filter
        if (statusFilter === 'active') {
          datasets.push(
            {
              label: 'Urgent (≤3 days)',
              data: filtered.map(item => item.orderStatus === 'active' && item.daysRemaining > 0 && item.daysRemaining <= 3 ? item.quotationCount : 0),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Warning (4-8 days)',
              data: filtered.map(item => 
                item.orderStatus === 'active' && item.daysRemaining > 3 && item.daysRemaining <= 8 
                  ? item.quotationCount 
                  : 0
              ),
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
            {
              label: 'Normal (>8 days)',
              data: filtered.map(item => item.orderStatus === 'active' && item.daysRemaining > 8 ? item.quotationCount : 0),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,

            }
          );
        }

        // Handle pending status filter
        if (statusFilter === 'pending') {
          datasets.push(
            {
              label: 'Pending',
              data: filtered.map(item => item.orderStatus === 'pending' ? item.quotationCount : 0),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          )
        }

        // Update Chart Data
        setChartData({
          labels: filtered.map(item => item.orderNumber),
          datasets: datasets,
          maxEmailCount,
          fullDataLength: filtered.length,
          visibleCount: visibleOrdersCount
      });
      
    }
}, [quotesData, statusFilter, visibleOrdersCount]); 

  useEffect(() => {
    const fetchDashboardData = async () => {

        try{
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/login'); // Navigate to login page
                return;
            }

            //fetching agents
            const agentCounts = await fetch(
                "http://localhost:5056/api/select/view-freight-agents/active-agents",
                {
                  method: "GET", // Use GET for fetching data
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Attach token
                  },
                }
            );
            //fetching order counts
            const orderCounts = await fetch(
                "http://localhost:5056/api/select/view-orders/order-counts",
                {
                  method: "GET", // Use GET for fetching data
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Attach token
                  },
                }
            )
            //fetching cancelled counts
            const cancelledCounts = await fetch(
                `http://localhost:5056/api/select/view-orders/cancelled-counts?cancelledFilterType=${cancelledFilterType}&cancelledFilterValue=${cancelledFilterValue}`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      },
                    }
            )
            //fetching order quotes
            const orderQuotes = await fetch(
                "http://localhost:5056/api/select/view-quotes/quote-counts",
                    {
                        method: "GET", // Use GET for fetching data
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`, // Attach token
                        },
                    }
            )

            if (!agentCounts.ok || !orderCounts.ok || !orderQuotes.ok) {
                throw new Error(`HTTP error! Status: ${agentCounts.status || orderCounts.status || orderQuotes.status}`);
            }
            
            const agents = await agentCounts.json();
            const cancelled = await cancelledCounts.json();
            const orders = await orderCounts.json();
            const quotes = await orderQuotes.json();
            setQuotesData(quotes);
            setCancelledStats(cancelled)
            
            setStats(prevStats => ({
                ...prevStats,
                totalActiveAgents: agents.agents.activeCount,
                allAgents: agents.agents.allAgents,
                totalOrders: orders.orderCounts.allOrders,
                allActiveOrders: orders.orderCounts.allActiveOrders,
                allPendingOrders: orders.orderCounts.allPendingOrders,
                allCompletedOrders: orders.orderCounts.allCompletedOrders,
                allImportAF: orders.orderCounts.allImportAF,
                allImportLCL: orders.orderCounts.allImportLCL,
                allImportFCL: orders.orderCounts.allImportFCL,
                allExportAF: orders.orderCounts.allExportAF,
                allExportLCL: orders.orderCounts.allExportLCL,
                allExportFCL: orders.orderCounts.allExportFCL,
            }));

        } catch (error) {
            console.error("Error fetching total freight agents count:", error.message);
            if (error.message.includes("401")) {
              console.error("Unauthorized. Redirecting to login.");
              navigate('/login'); // Navigate to login page
              return;
            }
        }

    };

    fetchDashboardData();
  }, [cancelledFilterType, cancelledFilterValue]);

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="grid grid-cols-1 p-6 mt-[52px]">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-2 mb-8">

            {/* number row */}
            <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-2'>
                <div className="p-6 bg-blue-100 rounded-lg shadow .hover:shadow-lg shadow-none transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-400 group">
                  <h2 className="text-gray-900 font-bold md:text-xl sm:text-lg transition-all duration-300 ease-in-out transform">Open for Quotes</h2>
                    <hr className='mb-5 h-1 border-none bg-gradient-to-r from-[#030bfc] to-[#98009E] opacity-90 rounded-full shadow-lg mt-1'></hr>
                    <div className='grid grid-cols-2'>
                        <div className='justify-items-end mr-6'>
                            <svg className="transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:fill-blue" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 32 32"><path fill="currentColor" fillRule="evenodd" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2m0 26a12 12 0 0 1 0-24v12l8.481 8.481A11.96 11.96 0 0 1 16 28"/></svg>
                        </div>
                        <p className="transition-transform duration-300 ease-in-out group-hover:scale-110 mb-1 text-5xl font-bold">{stats.allActiveOrders}</p>
                    </div>
                </div>

                <div className="bg-yellow-100 p-6 rounded-lg shadow .hover:shadow-lg shadow-none transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-400 group">
                  <h2 className="text-gray-900 font-bold md:text-xl sm:text-lg transition-all duration-300 ease-in-out transform">Pending Decision</h2>
                    <hr className='mb-5 h-1 border-none bg-gradient-to-r from-[#fcba03] to-[#98009E] opacity-90 rounded-full shadow-lg mt-1'></hr>
                    <div className='grid grid-cols-2'>
                        <div className='justify-items-end mr-6'>
                            <svg className="transition-transform duration-300 ease-in-out group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24">
	                            <path fill="currentColor" d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m.5-5.2v-2.3q0-.2-.15-.35T17 14t-.35.15t-.15.35v2.275q0 .2.075.388t.225.337l1.525 1.525q.15.15.35.15t.35-.15t.15-.35t-.15-.35zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v4q0 .425-.288.713T20 10t-.712-.288T19 9V5h-2v2q0 .425-.288.713T16 8H8q-.425 0-.712-.288T7 7V5H5v14h4.5q.425 0 .713.288T10.5 20t-.288.713T9.5 21zm7-16q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5" />
                            </svg>
                        </div>
                        <p className="transition-transform duration-300 ease-in-out group-hover:scale-110 mb-1 text-5xl font-bold">{stats.allPendingOrders}</p>
                    </div>
                </div>

                <div className="bg-red-100 p-6 px-4 rounded-lg shadow .hover:shadow-lg shadow-none transition-shadow duration-300 hover:shadow-gray-400 hover:shadow-lg group md:col-span-1 sm:col-span-3">
                  <div className="flex flex-row justify-between items-start md:items-center gap-1">
                  <h2 className="text-gray-900 font-bold md:text-xl sm:text-lg transition-all duration-300 ease-in-out transform">Cancelled Orders</h2>
                    <div className="flex flex-wrap gap-1 items-center">
                      {/* Filter Type Dropdown */}
                      <div className="relative w-[95px]">
                        <select
                          className="w-full pl-1 py-1 pr-1 text-sm bg-transparent rounded-lg border border-red-200 focus:border-red-100 focus:ring-1 focus:ring-red-100 transition-all hover:bg-red-200 cursor-pointer"
                          value={cancelledFilterType}
                          onChange={(e) => {
                            setCancelledFilterType(e.target.value);
                            setCancelledFilterValue('');
                            setSelectedYear('');
                            setSelectedMonth('');
                          }}
                        >
                          <option value="all">All Time</option>
                          <option value="year">By Year</option>
                          <option value="month">By Month</option>
                        </select>
                      </div>

                      {/* Year Selector */}
                      {cancelledFilterType === 'year' && (
                      <div className="relative w-[70px]">
                        <select
                          className="w-full pl-1 py-1 pr-1 text-sm bg-transparent rounded-lg border border-red-200 focus:border-red-100 focus:ring-1 focus:ring-red-100 transition-all hover:bg-red-200 cursor-pointer"
                          value={selectedYear}
                          onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setCancelledFilterValue(e.target.value);
                          }}
                        >
                          <option value="" disabled>-Year-</option>
                          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      )}

                      {/* Month Selector */}
                      {cancelledFilterType === 'month' && (
                        <div className="flex flex-1 gap-1 w-[130px]">
                          {/* Year Dropdown */}
                          <div className="relative w-[70px]">
                            <select
                              className="w-full px-1 py-1 text-sm bg-transparent rounded-lg border border-red-200 focus:border-red-100 focus:ring-1 focus:ring-red-100 transition-all hover:bg-red-200 cursor-pointer"
                              value={selectedYear}
                              onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setCancelledFilterValue(`${e.target.value}-${selectedMonth.toString().padStart(2, '0')}`);
                              }}
                            >
                              <option value="" disabled>-Year-</option>
                              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Month Dropdown */}
                          <div className="relative w-[60px]">
                            <select
                              className="w-full pl-1 py-1 pr-1 text-sm bg-transparent rounded-lg border border-red-200 focus:border-red-100 focus:ring-1 focus:ring-red-100 transition-all hover:bg-red-200 cursor-pointer"
                              value={selectedMonth}
                              onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setCancelledFilterValue(`${selectedYear}-${e.target.value.toString().padStart(2, '0')}`);
                              }}
                            >
                              <option value="" disabled>-M-</option>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <option key={month} value={month}>
                                  {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'short' })}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="mb-5 h-1 border-none bg-gradient-to-r from-[#fc0303] to-[#98009E] opacity-90 rounded-full shadow-lg mt-1" />

                  {/* Stats Section */}
                  <div className="grid grid-cols-2">
                    <div className='justify-items-end mr-6'>
                      <svg
                        className="transition-transform duration-300 ease-in-out group-hover:scale-120 group-hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                        width="45"
                        height="45"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M256 42.667c117.821 0 213.334 95.513 213.334 213.333c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667M85.334 256c0 94.257 76.41 170.667 170.666 170.667c39.44 0 75.754-13.378 104.654-35.843L121.177 151.347C98.71 180.247 85.334 216.56 85.334 256M256 85.334c-39.439 0-75.753 13.377-104.653 35.843l239.477 239.477c22.465-28.9 35.843-65.214 35.843-104.654c0-94.256-76.41-170.666-170.667-170.666"
                        />
                      </svg>
                    </div>
                    <p className="transition-transform duration-300 ease-in-out group-hover:scale-110 mb-1 text-5xl font-bold">
                      {cancelledStats?.cancelledCounts?.allCancelledOrders ?? 0}
                    </p>
                  </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                {/* donut chart */}
                <div className="bg-white p-6 rounded-lg shadow .hover:shadow-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
                    <div className="flex items-center">
                        <h2 className="text-gray-900 font-bold text-2xl">Orders</h2>
                    </div>
                    <hr className="mb-5 h-1 border-none bg-gradient-to-r from-[#0534F0] to-[#98009E] opacity-90 my-2 rounded-full shadow-lg"></hr>

                    <div className='grid grid-cols-2 grid-cols-1'>
                        <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries} 
                                type="donut"
                                height={300}
                            />
                        </div>
                        <div>
                            <div className="flex-wrap mt-6 text-center">
                                <div className='flex-col p-4 py-8'>
                                    <h3 className='text-xl font-semibold text-gray-700'>Total Imports</h3>
                                    <p className='text-5xl font-bold text-blue-600'>
                                        {stats.allImportAF + stats.allImportFCL + stats.allImportLCL}
                                    </p>
                                </div>
                                <div className="flex-col p-4 py-8">
                                    <h3 className='text-xl font-semibold text-gray-700'>Total Exports</h3>
                                    <p className='text-5xl font-bold text-green-600'>
                                        {stats.allExportAF + stats.allExportFCL + stats.allExportLCL}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* bar chart */}
                <div className="bg-white p-6 rounded-lg shadow .hover:shadow-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
                    <div className="flex items-center justify-between">
                        <h2 className="text-gray-900 font-bold text-2xl">Freight Forwarder Shipments</h2>
                        <div className="flex items-center gap-4">
                          <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className='px-1 pr-8 py-1 text-sm border rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-gray-100 transition-all hover:bg-gray-100 cursor-pointer'
                          >
                            <option value="export">Export</option>
                            <option value="import">Import</option>
                          </select>

                      </div>
                    </div>
                    <hr className="mb-5 h-1 border-none bg-gradient-to-r from-[#0534F0] to-[#98009E] opacity-90 my-2 rounded-full shadow-lg"></hr>
                    <FreightChart selectedType={selectedType} />
                </div>
            </div>
      </div>
      
        {/* graph */}
        <div className="bg-white p-6 mb-2 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:shadow-gray-400 w-full h-auto">

              <div className="flex justify-between items-center">
                <h2 className="text-gray-900 font-bold text-2xl">Order Quotation Analysis</h2>
                <div className="flex items-center gap-4">
                  <select
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    className='px-4 pr-8 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                  </select>

                </div>
              </div>
              <hr className="mb-6 h-1 border-none bg-gradient-to-r from-[#0534F0] to-[#98009E] opacity-90 my-2 rounded-full shadow-lg"></hr>
              {chartData && (
              <div className='h-[550px] w-full pb-3 overflow-x-auto'>
                <div style={{ minWidth: `${chartData.labels.length * 20}px`, height: '500px' }}>
                  <Bar data={{
                    labels: chartData.labels,
                    datasets: chartData.datasets
                  }}
                  options={{
                    ...barChartOptions,
                    scales: {
                      y: {
                        ...barChartOptions.scales.y,
                        beginAtZero: true,
                        grace: '1%'
                      },
                      x: {
                        ...barChartOptions.scales.x,
                        ticks: {
                          ...barChartOptions.scales.x.ticks,
                          minRotation: 45,
                          autoSkip: false
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const item = filteredData[context.dataIndex];
                            if (!item) return "No Data";
                            return `Quotations: ${item.quotationCount}/${item.emailCount} • Due in ${item.daysRemaining} days`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
              )}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add your recent activity items here */}
            <p className="text-gray-600">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;