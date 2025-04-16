import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const NavBar = () => {
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.get('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUserType(response.data.userType)
        }
      } catch (error) {
        console.error('Error checking user type:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUserType()
  }, [])

  if (loading) {
    return <div>Loading...</div>
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
        </div>
      </div>
    </nav>
  )
}

export default NavBar