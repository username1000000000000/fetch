import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, RouteProps, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AuthUser from './components/AuthUser';


function App() {
  return (
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/AuthUser/:email" element={<AuthUser />} />
    </Routes>
  );
}

export default App;
