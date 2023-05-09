import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, RouteProps, Navigate,HashRouter } from 'react-router-dom';
import Login from './components/Login';
import AuthUser from './components/AuthUser';


function App() {
  return (
    
        <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/AuthUser/:email" element={<AuthUser />} />
      </Routes>
   
      
      
  );
}

export default App;
