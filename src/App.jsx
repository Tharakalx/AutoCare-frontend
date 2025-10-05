
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import SignIn from './pages/SignIn'
import RegisterPage from './pages/Register'
import HomePage from './pages/HomePage';
import OurServices from './pages/OurServices'
import Appointments from './pages/Appointments'
import AdminDashboard  from './pages/AdminDashboard'
import ProfilePage from './pages/ProfilePage';
// import VehiclePage from './pages/VehiclePage';  



function App() {

  return (
    
    
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/services" element={<OurServices />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      {/* <Route path="/vehiclepage" element={<VehiclePage />} /> */}
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
    

  );
}

export default App
    
    
  
   
     
 
