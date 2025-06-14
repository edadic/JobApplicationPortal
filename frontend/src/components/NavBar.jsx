import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const NavBar = ({ userType }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
    window.location.reload() // Force refresh to clear states
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Job Portal</div>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">All Jobs</Link>
          <Link to="/profile" className="hover:text-gray-300">Profile</Link>
          {userType === 'employer' ? (
            <Link to="/my-listings" className="hover:text-gray-300">My Job Listings</Link>
          ) : (
            <Link to="/my-applications" className="hover:text-gray-300">My Applications</Link>
          )}
          <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar