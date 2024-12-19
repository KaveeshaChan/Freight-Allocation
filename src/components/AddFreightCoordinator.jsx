import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons
import Layout from './Layout';

const AddFreightCoordinator = () => {
  const [freightAgents, setFreightAgents] = useState([]); // State for available freight agents
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    selectedAgent: '',
  });
  const [errors, setErrors] = useState({}); // State for error messages
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for controlling error popup visibility
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for controlling success popup visibility
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    // Simulate fetching data from the "Add Freight Agent" page (mocking a database call)
    setFreightAgents([
      { id: '1', name: 'Agent 1' },
      { id: '2', name: 'Agent 2' },
      { id: '3', name: 'Agent 3' },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact Number is required';
    if (!formData.selectedAgent) newErrors.selectedAgent = 'Freight Agent is required';
    if (!formData.password) newErrors.password = 'Password is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowErrorPopup(true);
    } else {
      // Simulate sending an email notification after submitting the form
      setShowSuccessPopup(true);
  
      // Clear the form data after success
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        password: '',
        selectedAgent: '',
      });
  
      // Clear the error messages after success
      setErrors({});  // Reset errors here
  
    }
  };
  
  

  return (
    <Layout>

      {/* Main Content */}
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
              />
              {errors.contactNumber && <p className="text-red-600 text-sm">{errors.contactNumber}</p>}
            </div>

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

      {/* Error Popup */}
      {showErrorPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
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
