import React, { useState, useEffect } from 'react'
import axios from 'axios'
import JobFormModal from '../components/JobFormModal'

const MyListings = () => {
  const [jobs, setJobs] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/jobs/employer', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobs(response.data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyJobs()
  }, [])

  const handleSubmitJob = async (jobData) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/api/jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsModalOpen(false)
      fetchMyJobs() // Refresh the job list
    } catch (error) {
      console.error('Error posting job:', error)
      alert('Failed to post job')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Job Listings</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post New Job
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-4">{job.company_name}</p>
            <div className="mb-4">
              <p className="text-gray-700">{job.description}</p>
              <p className="text-gray-600 mt-2">Location: {job.location}</p>
              <p className="text-gray-600">Salary: {job.salary_range}</p>
            </div>
          </div>
        ))}
      </div>

      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitJob}
      />
    </div>
  )
}

export default MyListings