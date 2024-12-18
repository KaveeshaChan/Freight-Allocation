import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assests/basilurlogo.png'; // Import the logo

const AddFreightAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    director1ContactNumber: '',
    director1Email: '',
    director1Name: '',
    director2ContactNumber: '',
    director2Email: '',
    director2Name: '',
    password: '',
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.director1ContactNumber) newErrors.director1ContactNumber = 'Director 01 Contact Number is required';
    if (!formData.director1Email) newErrors.director1Email = 'Director 01 Email is required';
    if (!formData.director1Name) newErrors.director1Name = 'Director 01 Name is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    // If there are no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted with:', formData);

      // Simulate sending email (You would replace this with actual email sending logic)
      setTimeout(() => {
        setShowSuccessPopup(true);
        setFormData({
          name: '',
          address: '',
          contactNumber: '',
          email: '',
          director1ContactNumber: '',
          director1Email: '',
          director1Name: '',
          director2ContactNumber: '',
          director2Email: '',
          director2Name: '',
          password: '',
          country: ''
        });
      }, 1000);
    } else {
      setShowErrorPopup(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div
      className="font-sans min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
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
            <p className="text-sm text-gray-700">
              Username and Password sent to {formData.name} successfully.
            </p>
            <button
              onClick={closeSuccessPopup}
              className="mt-4 p-2 w-full rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="flex items-center justify-center p-2 mx-auto"
        style={{
          backgroundColor: '#191919',
          color: '#FFFFFF',
          borderRadius: '30px',
          height: '50px',
          width: '85%',
          marginTop: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={logo}
          alt="Logo"
          className="mr-4"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
          }}
        />
        <h1
          className="text-lg font-bold flex-1 text-center"
          style={{
            color: '#FFFFFF',
          }}
        >
          Freight Allocation
        </h1>
      </header>

      {/* Navigation Buttons */}
      <nav className="mt-4 mb-8 w-85%">
        <ul className="flex space-x-4 justify-center items-center">
          <li>
            <Link to="/Home"
              className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
              style={{
                transition: 'all 0.3s ease',
              }}
            >
              Home
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link
              to="/add-freight-agent"
              className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
              style={{
                transition: 'all 0.3s ease',
              }}
            >
              Add Freight Agent
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link
              to="/add-freight-coordinator"
              className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
              style={{
                transition: 'all 0.3s ease',
              }}
            >
              Add Freight Coordinator
            </Link>
          </li>
          <span className="text-orange-500">|</span>
          <li>
            <Link
              to="/add-main-user"
              className="text-lg font-medium text-black hover:text-orange-500 hover:underline"
              style={{
                transition: 'all 0.3s ease',
              }}
            >
              Add Main User
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex justify-center items-center mt-8">
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
            Add Freight Agent
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Country */}
            <div className="mb-3">
              <label
                htmlFor="country"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
                Country:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.country}
                onChange={handleChange}
              />
              {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
            </div>
            {/* Name */}
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
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            {/* Address */}
            <div className="mb-3">
              <label
                htmlFor="address"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>

            {/* Contact Number & Email */}
            <div className="mb-3 flex space-x-4">
              <div className="w-1/2">
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
                  onChange={handleChange}
                />
                {errors.contactNumber && <p className="text-red-500 text-xs">{errors.contactNumber}</p>}
              </div>
              <div className="w-1/2">
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
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
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
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="w-full p-2 border rounded-md text-sm"
                  style={{
                    borderColor: '#191919',
                    backgroundColor: '#FFFFFF',
                    color: '#191919',
                  }}
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 cursor-pointer"
                  style={{ fontSize: '18px' }}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            {/* Director 01 */}
<div className="mb-3">
  <h3 className="text-lg font-semibold" style={{ color: '#191919' }}>Director 01</h3>
  
  <label
    htmlFor="director1Name"
    className="block mb-1 text-sm"
    style={{ color: '#191919' }}
  >
    Director 01 Name:
  </label>
  <input
    type="text"
    id="director1Name"
    name="director1Name"
    className="w-full p-2 border rounded-md text-sm"
    value={formData.director1Name}
    onChange={handleChange}
  />
  {errors.director1Name && <p className="text-red-500 text-xs">{errors.director1Name}</p>}

  {/* Director 01 Contact and Email in the same line */}
  <div className="flex space-x-4">
    <div className="flex-1">
      <label
        htmlFor="director1ContactNumber"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 01 Contact Number:
      </label>
      <input
        type="text"
        id="director1ContactNumber"
        name="director1ContactNumber"
        className="w-full p-2 border rounded-md text-sm"
        value={formData.director1ContactNumber}
        onChange={handleChange}
      />
      {errors.director1ContactNumber && <p className="text-red-500 text-xs">{errors.director1ContactNumber}</p>}
    </div>

    <div className="flex-1">
      <label
        htmlFor="director1Email"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 01 Email:
      </label>
      <input
        type="email"
        id="director1Email"
        name="director1Email"
        className="w-full p-2 border rounded-md text-sm"
        value={formData.director1Email}
        onChange={handleChange}
      />
      {errors.director1Email && <p className="text-red-500 text-xs">{errors.director1Email}</p>}
    </div>
  </div>
</div>

{/* Director 02 */}
<div className="mb-3">
  <h3 className="text-lg font-semibold" style={{ color: '#191919' }}>Director 02</h3>
  
  <label
    htmlFor="director2Name"
    className="block mb-1 text-sm"
    style={{ color: '#191919' }}
  >
    Director 02 Name:
  </label>
  <input
    type="text"
    id="director2Name"
    name="director2Name"
    className="w-full p-2 border rounded-md text-sm"
    value={formData.director2Name}
    onChange={handleChange}
  />
  {errors.director2Name && <p className="text-red-500 text-xs">{errors.director2Name}</p>}

  {/* Director 02 Contact and Email in the same line */}
  <div className="flex space-x-4">
    <div className="flex-1">
      <label
        htmlFor="director2ContactNumber"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 02 Contact Number:
      </label>
      <input
        type="text"
        id="director2ContactNumber"
        name="director2ContactNumber"
        className="w-full p-2 border rounded-md text-sm"
        value={formData.director2ContactNumber}
        onChange={handleChange}
      />
      {errors.director2ContactNumber && <p className="text-red-500 text-xs">{errors.director2ContactNumber}</p>}
    </div>

    <div className="flex-1">
      <label
        htmlFor="director2Email"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 02 Email:
      </label>
      <input
        type="email"
        id="director2Email"
        name="director2Email"
        className="w-full p-2 border rounded-md text-sm"
        value={formData.director2Email}
        onChange={handleChange}
      />
      {errors.director2Email && <p className="text-red-500 text-xs">{errors.director2Email}</p>}
    </div>
  </div>
</div>



            {/* Submit */}
            <div className="mb-3">
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
              Add Freight Agent
            </button>
            </div>
          </form>
        </div>
      </main>
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

export default AddFreightAgent;
