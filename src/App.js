import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage'; // Import AdminPage
import AddFreightAgent from './components/AddFreightAgent'; // Add this page
import AddFreightCoordinator from './components/AddFreightCoordinator.jsx'; // Add this page
import AddMainUser from './components/AddMainUser'; // Add this page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/add-freight-agent" element={<AddFreightAgent />} />
        <Route path="/add-freight-coordinator" element={<AddFreightCoordinator />} />
        <Route path="/add-main-user" element={<AddMainUser />} />
      </Routes>
    </Router>
  );
};

export default App;
