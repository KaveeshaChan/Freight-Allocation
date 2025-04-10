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
    colors: ['#03045E', '#0077B6', '#00B4D8', '#6CD900', '#39B500', '#035E20'],
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
        barThickness: 8
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
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
            },
            {
              label: 'Warning (4-8 days)',
              data: filtered.map(item =>
                item.orderStatus === 'active' && item.daysRemaining > 3 && item.daysRemaining <= 8
                ? item.quotationCount
                : 0
              ),
              backgroundColor: 'rgba(252, 186, 3, 1)',
            },
            {
              label: 'Normal (>8 days)',
              data: filtered.map(item => 
                item.orderStatus === 'active' && item.daysRemaining > 8 
                  ? item.quotationCount 
                  : 0
              ),
              backgroundColor: 'rgba(7, 211, 0, 0.8)',
            },
            {
              label: 'Pending',
              data: filtered.map(item => 
                item.orderStatus === 'pending' 
                  ? item.quotationCount 
                  : 0
              ),
              backgroundColor: 'rgb(163, 163, 197)',
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
            backgroundColor: 'rgba(90, 90, 90, 1)',
          });
        }

        // Handle active status filter
        if (statusFilter === 'active') {
          datasets.push(
            {
              label: 'Urgent (≤3 days)',
              data: filtered.map(item => item.orderStatus === 'active' && item.daysRemaining > 0 && item.daysRemaining <= 3 ? item.quotationCount : 0),
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
            },
            {
              label: 'Warning (4-8 days)',
              data: filtered.map(item => 
                item.orderStatus === 'active' && item.daysRemaining > 3 && item.daysRemaining <= 8 
                  ? item.quotationCount 
                  : 0
              ),
              backgroundColor: 'rgba(252, 186, 3, 1)',
            },
            {
              label: 'Normal (>8 days)',
              data: filtered.map(item => item.orderStatus === 'active' && item.daysRemaining > 8 ? item.quotationCount : 0),
              backgroundColor: 'rgba(7, 211, 0, 0.8)',

            }
          );
        }

        // Handle pending status filter
        if (statusFilter === 'pending') {
          datasets.push(
            {
              label: 'Pending',
              data: filtered.map(item => item.orderStatus === 'pending' ? item.quotationCount : 0),
              backgroundColor: 'rgb(163, 163, 197)',
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
                "http://192.168.100.20:5056/api/select/view-freight-agents/active-agents",
                {
                  method: "GET", // Use GET for fetching data
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
            );
            //fetching order counts
            const orderCounts = await fetch(
                "http://192.168.100.20:5056/api/select/view-orders/order-counts",
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
                `http://192.168.100.20:5056/api/select/view-orders/cancelled-counts?cancelledFilterType=${cancelledFilterType}&cancelledFilterValue=${cancelledFilterValue}`,
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
                "http://192.168.100.20:5056/api/select/view-quotes/quote-counts",
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
            if (error.message.includes("401")) {
              navigate('/login');
              return;
            }
        }

    };

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);

  }, [cancelledFilterType, cancelledFilterValue]);

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="grid grid-cols-1 p-6 mt-[68px]">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-2 mb-2">

            {/* number row */}
            <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-4 px-4 sm:px-6'>
              {/* Open for Quotes Card */}
              <div className="relative p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out group hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <h2 className="text-gray-700 font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 p-1.5 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
                        <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2m0 26a12 12 0 0 1 0-24v12l8.481 8.481A11.96 11.96 0 0 1 16 28"/>
                      </svg>
                    </span>
                      Open for Quotes
                  </h2>
                  <hr className='mb-4 h-0.5 bg-gradient-to-r from-blue-400 to-blue-100 border-none rounded-full' />
                  <div className='flex items-center justify-between'>
                    <p className="text-4xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {stats.allActiveOrders}
                    </p>
                    <div className="p-3 bg-white rounded-lg shadow-inner border border-gray-100">
                      <div className="animate-pulse bg-gradient-to-br from-blue-200 to-blue-100 w-12 h-12 rounded-md flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-600" viewBox="0 0 32 32">
                          <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2m0 26a12 12 0 0 1 0-24v12l8.481 8.481A11.96 11.96 0 0 1 16 28"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
                    <span className="text-blue-500">Current available all open orders</span>
                  </div>
              </div>

              {/* Pending Decision Card */}
              <div className="relative p-6 bg-gradient-to-br from-amber-50 to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out group hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <h2 className="text-gray-700 font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 p-1.5 rounded-lg">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m.5-5.2v-2.3q0-.2-.15-.35T17 14t-.35.15t-.15.35v2.275q0 .2.075.388t.225.337l1.525 1.525q.15.15.35.15t.35-.15t.15-.35t-.15-.35zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v4q0 .425-.288.713T20 10t-.712-.288T19 9V5h-2v2q0 .425-.288.713T16 8H8q-.425 0-.712-.288T7 7V5H5v14h4.5q.425 0 .713.288T10.5 20t-.288.713T9.5 21zm7-16q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"/>
                      </svg>
                    </span>
                      Pending Decision
                  </h2>
                  <hr className='mb-4 h-0.5 bg-gradient-to-r from-amber-400 to-amber-100 border-none rounded-full' />
                  <div className='flex items-center justify-between'>
                    <p className="text-4xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                      {stats.allPendingOrders}
                    </p>
                    <div className="p-3 bg-white rounded-lg shadow-inner border border-gray-100">
                      <div className="animate-pulse bg-gradient-to-br from-amber-200 to-amber-100 w-12 h-12 rounded-md flex items-center justify-center">
                        <svg className="w-7 h-7 text-amber-600" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m.5-5.2v-2.3q0-.2-.15-.35T17 14t-.35.15t-.15.35v2.275q0 .2.075.388t.225.337l1.525 1.525q.15.15.35.15t.35-.15t.15-.35t-.15-.35zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v4q0 .425-.288.713T20 10t-.712-.288T19 9V5h-2v2q0 .425-.288.713T16 8H8q-.425 0-.712-.288T7 7V5H5v14h4.5q.425 0 .713.288T10.5 20t-.288.713T9.5 21zm7-16q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
                    <span className="text-amber-500">Current available all pending orders</span>
                  </div>
              </div>

              {/* Cancelled Orders Card */}
              <div className="relative p-6 bg-gradient-to-br from-red-50 to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out group hover:-translate-y-1 border border-gray-100 md:col-span-1 sm:col-span-3">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <h2 className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                      <span className="bg-red-100 text-red-800 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" viewBox="0 0 512 512">
                          <path fill="currentColor" d="M256 42.667c117.821 0 213.334 95.513 213.334 213.333c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667M85.334 256c0 94.257 76.41 170.667 170.666 170.667c39.44 0 75.754-13.378 104.654-35.843L121.177 151.347C98.71 180.247 85.334 216.56 85.334 256M256 85.334c-39.439 0-75.753 13.377-104.653 35.843l239.477 239.477c22.465-28.9 35.843-65.214 35.843-104.654c0-94.256-76.41-170.666-170.667-170.666"/>
                        </svg>
                      </span>
                        Cancelled Orders
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="relative">
                        <select
                          className="pl-3 pr-8 py-1 text-sm bg-transparent rounded-lg border border-red-200 focus:border-red-100 focus:ring-1 focus:ring-red-100 transition-all hover:bg-red-200 cursor-pointer appearance-none"
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
                        {/* <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            
                        </div> */}
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
    <hr className='mb-4 h-0.5 bg-gradient-to-r from-red-400 to-red-100 border-none rounded-full' />
    <div className='flex items-center justify-between'>
      <p className="text-4xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">
        {cancelledStats?.cancelledCounts?.allCancelledOrders ?? 0}
      </p>
      <div className="p-3 bg-white rounded-lg shadow-inner border border-gray-100">
        <div className="bg-gradient-to-br from-red-200 to-red-100 w-12 h-12 rounded-md flex items-center justify-center">
          <svg className="w-7 h-7 text-red-600" viewBox="0 0 512 512">
          <path fill="currentColor" d="M256 42.667c117.821 0 213.334 95.513 213.334 213.333c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667M85.334 256c0 94.257 76.41 170.667 170.666 170.667c39.44 0 75.754-13.378 104.654-35.843L121.177 151.347C98.71 180.247 85.334 216.56 85.334 256M256 85.334c-39.439 0-75.753 13.377-104.653 35.843l239.477 239.477c22.465-28.9 35.843-65.214 35.843-104.654c0-94.256-76.41-170.666-170.667-170.666"/>
          </svg>
        </div>
      </div>
    </div>
    <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
      <span className="text-red-500">Currently closed orders</span>
    </div>
  </div>
</div>

<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 p-6'>
    {/* Donut Chart Card - Enhanced */}
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-gray-200">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Orders Overview</h2>
            <div className="flex space-x-4">
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-[#030bfc] rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-gray-600">Imports</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-[#00B100] rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-gray-600">Exports</span>
                </div>
            </div>
        </div>
        
        <div className="mb-6">
            <hr className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-0" />
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
            <div className='p-4 bg-gray-50 rounded-xl shadow-sm'>
                <ReactApexChart
                    options={chartOptions}
                    series={chartSeries} 
                    type="donut"
                    height={360}
                />
            </div>
            
            <div className="flex flex-col justify-center space-y-8">
                <div className='p-6 bg-blue-50 rounded-xl shadow-sm transition-transform hover:scale-[1.02]'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-2'>Total Imports</h3>
                    <p className='text-4xl font-bold text-[#030bfc]'>
                        {(stats.allImportAF + stats.allImportFCL + stats.allImportLCL).toLocaleString()}
                    </p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
                    <h3 className='text-lg font-semibold text-gray-700 mb-2'>Total Exports</h3>
                    <p className='text-4xl font-bold text-[#00B100]'>
                        {(stats.allExportAF + stats.allExportFCL + stats.allExportLCL).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    </div>

    {/* Bar Chart Card - Enhanced */}
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-gray-200">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Freight Analytics</h2>
            <div className="flex items-center gap-8">
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                     className='px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400 cursor-pointer appearance-none pr-10 bg-no-repeat bg-right-2'
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236c728b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-chevron-down'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"
                }}
                >
                    <option value="export" className="text-gray-700">Export</option>
                    <option value="import" className="text-gray-700">Import</option>
                </select>
            </div>
        </div>
        
        <div className="mb-6">
            <hr className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-0" />
        </div>

        <div className="relative h-[400px]">
            <FreightChart selectedType={selectedType} />
        </div>
    </div>
</div>
      </div>
      
        {/* graph */}
        <div className="bg-white p-8 mb-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-transparent border border-gray-100 group">

    <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-900 font-bold text-3xl tracking-tight bg-gradient-to-r from-[#0534F0] to-[#98009E] bg-clip-text text-transparent">
            Order Quotation Analysis
        </h2>
        <div className="flex items-center gap-4">
            <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className='px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400 cursor-pointer appearance-none pr-10 bg-no-repeat bg-right-2'
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236c728b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-chevron-down'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"
                }}>
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
        </div>
    </div>

    <hr className="mb-6 h-[2px] border-none bg-gradient-to-r from-[#0534F0] via-[#5533ff] to-[#98009E] opacity-80 rounded-full shadow" />

    {chartData && (
        <div className='h-[600px] bg-white/50 backdrop-blur-sm shadow-inner rounded-xl w-full p-3 overflow-x-auto border border-gray-100'>
            <div style={{ minWidth: `${chartData.labels.length * 30}px`, height: '520px' }} className="relative">
                <Bar 
                    data={{
                        labels: chartData.labels,
                        datasets: chartData.datasets
                    }}
                    options={{
                        ...barChartOptions,
                        scales: {
                            y: {
                                ...barChartOptions.scales.y,
                                beginAtZero: true,
                                grace: '5%',
                                grid: { color: '#f3f4f6' },
                                border: { dash: [4,4] },
                                ticks: { color: '#6b7280', font: { weight: '500' } }
                            },
                            x: {
                                ...barChartOptions.scales.x,
                                grid: { display: false },
                                ticks: {
                                    ...barChartOptions.scales.x.ticks,
                                    color: '#6b7280',
                                    font: { weight: '500' },
                                    minRotation: 45,
                                    autoSkip: false
                                }
                            }
                        },
                        plugins: {
                            ...barChartOptions.plugins,
                            legend: { 
                                labels: { 
                                    boxWidth: 18,
                                    boxHeight: 18,
                                    padding: 20,
                                    font: { size: 14 }
                                } 
                            },
                            tooltip: {
                                backgroundColor: 'white',
                                borderColor: '#e5e7eb',
                                borderWidth: 1,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                titleColor: '#1f2937',
                                bodyColor: '#374151',
                                padding: 12,
                                callbacks: {
                                    label: (context) => {
                                        const item = filteredData[context.dataIndex];
                                        if (!item) return "No Data";
                                        let label = `Quotations: ${item.quotationCount}/${item.emailCount}`;
                                        if (item.daysRemaining > 0) {
                                            label += ` • Due in ${item.daysRemaining} days`;
                                        }
                                        return label;
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
      </div>
    </div>
  );
}

export default AdminDashboard;