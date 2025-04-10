import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaKey, FaBuilding } from 'react-icons/fa';
import Select from 'react-select';
import { getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import Header from '../../Layouts/Main_Layout';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AddFreightCoordinator = () => {
  const [freightAgents, setFreightAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    freightAgent: '',
    userID: ''
  });
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [userID, setUserID] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreightAgents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
        }
    
        const response = await axios.get(
          'http://192.168.100.20:5056/api/addFreightAgentCoordinator/freight-agents-list',
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
    
        console.log(response.data.freightAgentsList);
        setFreightAgents(response.data.freightAgentsList || []);
      } catch (error) {
        console.error('Error fetching freight agents:', error.message);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized. Redirecting to login.');
          // Handle unauthorized error (e.g., redirect to login page)
        }
      }
    };

    fetchFreightAgents();
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token'); // Get token from storage
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      const decodedToken = jwtDecode(token);
      if (decodedToken.roleName !== 'admin' && decodedToken.roleName !== 'mainUser') {
        navigate('/unauthorized'); // Redirect if not an admin or mainUser
      }
      setUserID(decodedToken.userId)
      setFormData(prev => ({
        ...prev,
        userID: userID
      }));
    } catch (error) {
      console.error('Error decoding token or navigating:', error);
      navigate('/login'); // Handle invalid or malformed token
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const closeErrorPopup = () => setShowErrorPopup(false);
  const closeSuccessPopup = () => setShowSuccessPopup(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact Number is required';
    if (!formData.freightAgent) newErrors.freightAgent = 'Freight Agent is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (formData.contactNumber && !isValidPhoneNumber(formData.contactNumber, formData.country)) {
      newErrors.contactNumber = 'Invalid phone number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowErrorPopup(true);
    } else {
      try {
        console.log(formData);
        const token = localStorage.getItem('token');
        const response = await fetch('http://192.168.100.20:5056/api/addFreightAgentCoordinator/add-freight-coordinator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setShowSuccessPopup(true);
          setFormData({
            name: '',
            email: '',
            contactNumber: '',
            password: '',
            freightAgent: '',
            country: '',
            callingCode: '',
          });
          setErrors({});
          setServerErrorMessage('');
        } else {
          const errorData = await response.json();
          console.error('Server Error:', errorData);
          setServerErrorMessage(errorData.message || 'An error occurred');
          setShowErrorPopup(true);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setServerErrorMessage('An error occurred while submitting the form');
        setShowErrorPopup(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Error Popup */}
        {showErrorPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                Validation Errors
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {Object.values(errors).map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
                {serverErrorMessage && <li className="text-sm">{serverErrorMessage}</li>}
              </ul>
              <button
                onClick={closeErrorPopup}
                className="mt-6 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Success!
              </h2>
              <p className="text-gray-700 mb-4">
                Coordinator account created successfully.
              </p>
              <button
                onClick={closeSuccessPopup}
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FaUser className="text-[#0534F0]" />
            Add New Freight Coordinator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Freight Agent Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex-items-center gap-2">
                <FaBuilding className="text-[#98009E]" />
                Freight Agent
              </label>
              <select
                name="freightAgent"
                value={formData.freightAgent}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
              >
                <option value="">Select a Freight Agent</option>
                {freightAgents.map((agent) => (
                  <option key={agent.AgentID} value={agent.AgentID}>
                    {agent.Freight_Agent}
                  </option>
                ))}
              </select>
              {errors.freightAgent && <p className="text-red-500 text-sm mt-1">{errors.freightAgent}</p>}
            </div>

            {/* Coordinator Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 flex items-center gap-2">
                <FaUser className="text-[#98009E]" />
                Coordinator Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                    placeholder="Coordinator's full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex-items-center gap-2">
                    <FaEnvelope className="text-[#0534F0]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                    placeholder="coordinator@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex-items-center gap-2">
                    <FaPhone className="text-[#98009E]" />
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                    placeholder="+94 77xxxxxxx"
                  />
                  {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex-items-center gap-2">
                    <FaKey className="text-[#0534F0]" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-500 hover:text-[#0534F0]"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#0534F0] to-[#98009E] hover:from-[#0429C7] hover:to-[#7A0080] text-white rounded-xl font-semibold text-lg transition-all shadow-lg"
            >
              Create Coordinator Account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddFreightCoordinator;
