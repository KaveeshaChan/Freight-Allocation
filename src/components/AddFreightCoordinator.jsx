import React, { useState, useEffect, useMemo } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import Layout from './Layout';
import axios from 'axios';

const AddFreightCoordinator = () => {
  const [freightAgents, setFreightAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    selectedAgent: '',
    country: '',
    callingCode: '',
  });
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const countryOptions = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    const fetchFreightAgents = async () => {
      try {
        const response = await axios.get('http://localhost:5056/api/freight-agents'); // Replace with your actual API endpoint
        setFreightAgents(response.data);
      } catch (error) {
        console.error('Error fetching freight agents:', error);
      }
    };

    fetchFreightAgents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryChange = (selectedCountry) => {
    const callingCode = `+${getCountryCallingCode(selectedCountry.value)}`;
    setFormData({
      ...formData,
      country: selectedCountry.label,
      callingCode,
      contactNumber: '',
    });
  };

  const closeErrorPopup = () => setShowErrorPopup(false);
  const closeSuccessPopup = () => setShowSuccessPopup(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact Number is required';
    if (!formData.selectedAgent) newErrors.selectedAgent = 'Freight Agent is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.country) newErrors.country = 'Country is required';

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
        const response = await axios.post('http://localhost:5056/api/add-freight-coordinator', formData);

        if (response.status === 200) {
          setShowSuccessPopup(true);
          setFormData({
            name: '',
            email: '',
            contactNumber: '',
            password: '',
            selectedAgent: '',
            country: '',
            callingCode: '',
          });
          setErrors({});
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setShowErrorPopup(true);
      }
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex justify-center items-center mt-8">
        <div
          className="p-6 rounded-lg shadow-lg"
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(25, 25, 25, 0.1)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            width: '700px',
          }}
        >
          <h2 className="text-2xl mb-4 font-semibold" style={{ color: '#191919', textAlign: 'center' }}>
            Add Freight Coordinator
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="country" className="block mb-1 text-sm" style={{ color: '#191919' }}>
                Country:
              </label>
              <Select
                id="country"
                name="country"
                options={countryOptions}
                onChange={handleCountryChange}
                value={countryOptions.find((option) => option.label === formData.country)}
                placeholder="Select a Country"
              />
              {errors.country && <p className="text-red-600 text-sm">{errors.country}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="selectedAgent" className="block mb-1 text-sm" style={{ color: '#191919' }}>
                Freight Agent:
              </label>
              <select
                id="selectedAgent"
                name="selectedAgent"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.selectedAgent}
                onChange={handleInputChange}
              >
                <option value="">Select a Freight Agent</option>
                {freightAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
              {errors.selectedAgent && <p className="text-red-600 text-sm">{errors.selectedAgent}</p>}
            </div>

            {/* Name Input */}
            <div className="mb-3">
              <label htmlFor="name" className="block mb-1 text-sm" style={{ color: '#191919' }}>
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="block mb-1 text-sm" style={{ color: '#191919' }}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            {/* Contact Number Input */}
            <div className="mb-3">
              <label htmlFor="contactNumber" className="block mb-1 text-sm" style={{ color: '#191919' }}>
                Contact Number:
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.contactNumber}
    onChange={handleInputChange}
    placeholder="Please use country code (eg: +94 77xxxxxxx)"  // Added placeholder for example
                
              />
              {errors.contactNumber && <p className="text-red-600 text-sm">{errors.contactNumber}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label htmlFor="password" className="block mb-1 text-sm" style={{ color: '#191919' }}>
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="w-full p-2 border rounded-md text-sm"
                  style={{
                    borderColor: '#191919',
                    backgroundColor: '#FFFFFF',
                    color: '#191919',
                  }}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl"
                  style={{ color: '#191919' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>


            <button
              type="submit"
              className="p-3 rounded-md text-lg cursor-pointer border-2 w-full mt-4"
              style={{
                borderColor: '#FF4D00',
                backgroundColor: '#FF4D00',
                color: '#FFFFFF',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              Add Freight Coordinator
            </button>
          </form>
        </div>
      </main>

      {showErrorPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <button
              onClick={closeErrorPopup}
              className="mt-4 p-2 w-full rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-green-600">Success</h2>
            <p className="text-sm text-gray-700">The Freight Coordinator has been successfully added.</p>
            <button
              onClick={closeSuccessPopup}
              className="mt-4 p-2 w-full rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AddFreightCoordinator;
