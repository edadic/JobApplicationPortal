import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data)
        // Set form state for editing
        if (res.data.userType === 'employer' && res.data.employerProfile) {
          setForm(res.data.employerProfile)
        } else if (res.data.userType === 'job_seeker' && res.data.jobSeekerProfile) {
          setForm(res.data.jobSeekerProfile)
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      if (user.userType === 'employer') {
        await axios.put('http://localhost:3000/api/employers/profile', form, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser({ ...user, employerProfile: form })
      } else if (user.userType === 'job_seeker') {
        await axios.put('http://localhost:3000/api/job-seekers/profile', form, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser({ ...user, jobSeekerProfile: form })
      }
      setIsEditing(false)
    } catch (err) {
      alert('Failed to update profile')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Could not load profile.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="mb-4">
          <strong>Account Type:</strong> {user.userType === 'employer' ? 'Employer' : 'Job Seeker'}
        </div>
        {user.userType === 'employer' && user.employerProfile && (
          <div>
            {isEditing ? (
              <>
                <input className="border p-2 w-full mb-2" name="company_name" value={form.company_name || ''} onChange={handleChange} placeholder="Company Name" />
                <input className="border p-2 w-full mb-2" name="industry" value={form.industry || ''} onChange={handleChange} placeholder="Industry" />
                <input className="border p-2 w-full mb-2" name="company_size" value={form.company_size || ''} onChange={handleChange} placeholder="Company Size" />
                <input className="border p-2 w-full mb-2" name="website_url" value={form.website_url || ''} onChange={handleChange} placeholder="Website" />
                <input className="border p-2 w-full mb-2" name="location" value={form.location || ''} onChange={handleChange} placeholder="Location" />
                <textarea className="border p-2 w-full mb-2" name="company_description" value={form.company_description || ''} onChange={handleChange} placeholder="Description" />
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
                  <button className="bg-gray-300 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2"><strong>Company Name:</strong> {user.employerProfile.company_name}</div>
                <div className="mb-2"><strong>Industry:</strong> {user.employerProfile.industry}</div>
                <div className="mb-2"><strong>Company Size:</strong> {user.employerProfile.company_size}</div>
                <div className="mb-2"><strong>Website:</strong> {user.employerProfile.website_url}</div>
                <div className="mb-2"><strong>Location:</strong> {user.employerProfile.location}</div>
                <div className="mb-2"><strong>Description:</strong> {user.employerProfile.company_description}</div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 mt-4"
                  onClick={() => navigate('/my-listings')}
                >
                  See My Job Listings
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  onClick={handleEdit}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}
        {user.userType === 'job_seeker' && user.jobSeekerProfile && (
          <div>
            {isEditing ? (
              <>
                <input className="border p-2 w-full mb-2" name="skills" value={form.skills || ''} onChange={handleChange} placeholder="Skills" />
                <input className="border p-2 w-full mb-2" name="experience_years" value={form.experience_years || ''} onChange={handleChange} placeholder="Experience Years" />
                <input className="border p-2 w-full mb-2" name="education_level" value={form.education_level || ''} onChange={handleChange} placeholder="Education Level" />
                <input className="border p-2 w-full mb-2" name="preferred_job_type" value={form.preferred_job_type || ''} onChange={handleChange} placeholder="Preferred Job Type" />
                <input className="border p-2 w-full mb-2" name="preferred_location" value={form.preferred_location || ''} onChange={handleChange} placeholder="Preferred Location" />
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
                  <button className="bg-gray-300 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2"><strong>Skills:</strong> {user.jobSeekerProfile.skills}</div>
                <div className="mb-2"><strong>Experience:</strong> {user.jobSeekerProfile.experience_years} years</div>
                <div className="mb-2"><strong>Education:</strong> {user.jobSeekerProfile.education_level}</div>
                <div className="mb-2"><strong>Preferred Job Type:</strong> {user.jobSeekerProfile.preferred_job_type}</div>
                <div className="mb-2"><strong>Preferred Location:</strong> {user.jobSeekerProfile.preferred_location}</div>
                <div className="mb-2"><strong>Resume:</strong> {user.jobSeekerProfile.resume_url ? <a href={user.jobSeekerProfile.resume_url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Resume</a> : 'Not uploaded'}</div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 mt-4"
                  onClick={() => navigate('/my-applications')}
                >
                  See My Applications
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  onClick={handleEdit}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
                  disabled
                >
                  Upload Resume (Coming Soon)
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile