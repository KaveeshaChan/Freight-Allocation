import React, { useState } from 'react'; 
import logo from '../assests/basilurlogo.png'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

const AddMainUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({}); // State for error messages
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for controlling error popup visibility
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for controlling success popup visibility
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

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
      // Clear errors and show success popup
      setErrors({});  // Reset errors state
      setShowSuccessPopup(true);

      console.log("Sending email to: " + formData.email);

      // Clear form data after success
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        password: '',
      });
    }
  };

  return (
    <div
      className="font-sans min-h-screen flex flex-col justify-between"
      style={{
        backgroundColor: '#FFFFFF', // White background for the body
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-center p-2 mx-auto"
        style={{
          backgroundColor: '#191919', // Black header background
          color: '#FFFFFF', // White font color
          borderRadius: '30px', // Rounded corners
          height: '50px', // Smaller header height
          width: '85%', // Narrower width
          marginTop: '20px', // Space from top
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
        }}
      >
        {/* Logo inside the header */}
        <img
          src={logo}
          alt="Logo"
          className="mr-4"
          style={{
            width: '40px', // Reduced logo size
            height: '40px',
            objectFit: 'contain',
          }}
        />

        {/* Title centered in the header */}
        <h1
          className="text-lg font-bold flex-1 text-center"
          style={{
            color: '#FFFFFF', // White text color
          }}
        >
          Freight Allocation
        </h1>
      </header>

      {/* Navigation Buttons */}
      <nav className="mt-4 mb-8 w-85%">
        <ul className="flex space-x-4 justify-center items-center">
          <li>
            <Link to="/Home">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Home
              </button>
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link to="/add-freight-agent">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Add Freight Agent
              </button>
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link to="/add-freight-coordinator">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Add Freight Coordinator
              </button>
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link to="/add-main-user">
              <button
                className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                Add Main User
              </button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center mt-8">
        <div
          className="p-6 rounded-lg shadow-lg"
          style={{
            background: '#FFFFFF', // Solid white background
            borderRadius: '16px', // Rounded corners
            border: '1px solid rgba(25, 25, 25, 0.1)', // Subtle border
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
            width: '700px', // Custom width for the box
          }}
        >
          <h2
            className="text-2xl mb-4 font-semibold"
            style={{
              color: '#191919', // Black text for the title
              textAlign: 'center',
            }}
          >
            Add Main User
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
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
              <label
                htmlFor="email"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
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
              <label
                htmlFor="contactNumber"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
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
              <label
                htmlFor="password"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
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
              Add Main User
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
              className="mt-4 p-2 w-full bg-red-600 text-white rounded-md"
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
            <p className="text-sm text-gray-700">
              The main user was successfully added and username/password have been sent!
            </p>
            <button
              onClick={closeSuccessPopup}
              className="mt-4 p-2 w-full bg-green-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="p-4 text-center"
        style={{
          backgroundColor: 'transparent',
          color: '#191919',
          fontSize: '14px',
          marginTop: '20px',
        }}
      >
        © {new Date().getFullYear()} Freight Allocation. All Rights Reserved.
      </footer>
    </div>
  );
};

export default AddMainUser;
