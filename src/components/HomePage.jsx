import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for named export
import Layout from './Layout'; // Ensure this path is correct

const HomePage = () => {
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

  return (
    <Layout>
      <h1>Welcome, Admin!</h1>
    </Layout>
  );
};

export default HomePage;
