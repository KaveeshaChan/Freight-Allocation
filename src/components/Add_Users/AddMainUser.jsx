import React, { useState, useEffect } from 'react';  
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Layout from '../Layouts/Main_Layout';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AddMainUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '+94',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for controlling error popup visibility
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for controlling success popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token'); // Get token from storage
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      if (decodedToken.roleName !== 'admin' && decodedToken.roleName !== 'mainUser') {
        navigate('/unauthorized'); // Redirect if not an admin or mainUser
      }
    } catch (error) {
      console.error('Error decoding token or navigating:', error);
      navigate('/login'); // Handle invalid or malformed token
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      // console.log("Updated FormData:", updatedFormData); // Comment or remove this line
      return updatedFormData;
    });
  };

  const cleanPhoneNumber = (number) => {
    return number.replace(/\s+/g, ''); // Remove all whitespace characters
  };

  const submitFormData = async (formData) => {
    const cleanedFormData = {
      ...formData,
      contactNumber: cleanPhoneNumber(formData.contactNumber),
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5056/api/add-main-user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedFormData),
      });
  
      const responseData = await response.json(); // Wait for the response to be parsed
  
      if (response.status === 201) {
        console.log(response.status);
        console.log(responseData.message);
        setShowSuccessPopup(true);
        setFormData({
          name: '',
          email: '',
          contactNumber: '+94',
          password: '',
        });
      } else {
        // Handle cases where the response status is not 201 (error case)
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowErrorPopup(true);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact Number is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      submitFormData(formData);
    } else {
      setShowErrorPopup(true);
    }
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <Layout>
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
        The main user was successfully added!
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

    </Layout>
  );
};

export default AddMainUser;
