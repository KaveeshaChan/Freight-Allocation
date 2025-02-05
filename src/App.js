import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage'; // Import AdminPage
import AddFreightAgent from './components/Add_Users/AddFreightAgent.jsx'; // Add this page
import AddFreightCoordinator from './components/Add_Users/AddFreightCoordinator.jsx'; // Add this page
import AddMainUser from './components/Add_Users/AddMainUser.jsx'; // Add this page
import Layout from './components/Layouts/Main_Layout.jsx';
import Layout2 from './components/Layouts/Layout-Common_User.jsx';
import InProgress from './components/InProgress.jsx';
import Completed from './components/Completed.jsx';
import AddNewOrder from './components/Add_New_Order/AddNewOrder.jsx';
import ViewFreightAgents from './components/ViewFreightAgents.jsx';
import Header from './components/Freight_Forwarders/Header.jsx';
import AddQuote from './components/Freight_Forwarders/Add_Quote.jsx'; 
import Dashboard from './components/Freight_Forwarders/Dashboard.jsx';
import Members from './components/Freight_Forwarders/Members.jsx';


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
        <Route path="/add-new-order" element={<AddNewOrder />} />
        <Route path="/view-freight-agents" element={<ViewFreightAgents />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/Add_Quote" element={<AddQuote />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />

      

        
      </Routes>
    </Router>
  );
};

export default App;
