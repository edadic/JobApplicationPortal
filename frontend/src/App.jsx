import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Dashboard from './pages/Dashboard'
import NavBar from './components/NavBar'
import Profile from './pages/Profile'
import MyListings from './pages/MyListings'
import MyApplications from './pages/MyApplications'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'

const App = () => {
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.get('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUserType(response.data.userType)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    checkUser()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar userType={userType} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        {userType === 'employer' ? (
          <Route path="/my-listings" element={<MyListings />} />
        ) : (
          <Route path="/my-applications" element={<MyApplications />} />
        )}
      </Routes>
    </div>
  )
}

export default App