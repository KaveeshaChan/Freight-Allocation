import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage'; // Import AdminPage
import AddFreightAgent from './components/AddFreightAgent'; // Add this page
import AddFreightCoordinator from './components/AddFreightCoordinator.jsx'; // Add this page
import AddMainUser from './components/AddMainUser'; // Add this page
import Layout from './components/Main_Layout.jsx';
import Layout2 from './components/Layout-Common_User.jsx';
import InProgress from './components/InProgress.jsx';
import Completed from './components/Completed.jsx';
import AddDocument from './components/AddDocumnet.jsx';
import ViewFreightAgents from './components/ViewFreightAgents.jsx';


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
        <Route path="/Layout" element={<Layout />} />
        <Route path="/Layout2" element={<Layout2 />} />
        <Route path="/In-Progress" element={<InProgress />} />
        <Route path="/Completed" element={<Completed />} />
        <Route path="/add-document" element={<AddDocument />} />
        <Route path="/view-freight-agents" element={<ViewFreightAgents />} />
      </Routes>
    </Router>
  );
};

export default App;
