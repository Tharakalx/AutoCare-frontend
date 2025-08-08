
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import SignIn from './pages/SignIn'
import RegisterPage from './pages/Register'
import HomePage from './pages/HomePage';

function App() {

  return (
    <>
    <HomePage />
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    </>

  );
}

export default App
    
    
  
   
     
 
