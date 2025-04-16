import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/jobs/active')
        console.log('Jobs:', response.data)
        // Add index as fallback key if id is not available
        const jobsWithKeys = (response.data.jobs || []).map((job, index) => ({
          ...job,
          uniqueKey: job.id || `job-${index}`
        }))
        setJobs(jobsWithKeys)
      } catch (error) {
        console.error('Error:', error)
      }
      setLoading(false)
    }

    fetchJobs()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.uniqueKey} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-4">{job.company_name}</p>
              <div className="mb-4">
                <p className="text-gray-700">{job.description}</p>
                <p className="text-gray-600 mt-2">Location: {job.location}</p>
                <p className="text-gray-600">Salary: {job.salary_range}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No jobs available</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard