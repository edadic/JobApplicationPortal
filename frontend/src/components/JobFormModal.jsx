import React, { useState } from 'react'

const JobFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [jobData, setJobData] = useState({
    title: '',
    company_name: '',
    description: '',
    location: '',
    salary_range: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(jobData)
    setJobData({
      title: '',
      company_name: '',
      description: '',
      location: '',
      salary_range: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Post New Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={jobData.company_name}
              onChange={(e) => setJobData({ ...jobData, company_name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Salary Range</label>
            <input
              type="text"
              value={jobData.salary_range}
              onChange={(e) => setJobData({ ...jobData, salary_range: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobFormModal