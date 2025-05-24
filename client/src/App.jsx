// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoPage from './pages/TodoPage';
import OldTasksPage from './pages/OldTasksPage';
import ListsPage from './pages/ListsPage';
import ProfilePage from './pages/ProfilePage';
import { getToken } from './services/auth';

function AuthRoute({ children }) { return getToken()?children:<Navigate to="/login" replace/>; }

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/" element={<AuthRoute><TodoPage/></AuthRoute>}/>
        <Route path="/old" element={<AuthRoute><OldTasksPage/></AuthRoute>}/>
        <Route path="/lists" element={<AuthRoute><ListsPage/></AuthRoute>}/>
        <Route path="/profile" element={<AuthRoute><ProfilePage/></AuthRoute>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}