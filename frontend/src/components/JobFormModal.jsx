import React, { useState, useEffect } from 'react'

const JobFormModal = ({ isOpen, onClose, onSubmit }) => {
  const initialState = {
    title: '',
    description: '',
    requirements: '',
    salary_range: '',
    location: '',
    job_type: 'full_time',
    experience_level: '',
    closing_date: new Date().toISOString().split('T')[0]
  };

  const [jobData, setJobData] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(jobData);
    setJobData(initialState);
  };

  useEffect(() => {
    if (!isOpen) {
      setJobData(initialState);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
              placeholder='Job Title'
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
              placeholder='Description'
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
              placeholder='Location'
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Job Type</label>
            <select
              value={jobData.job_type}
              onChange={(e) => setJobData({ ...jobData, job_type: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Salary Range</label>
            <input
              type="text"
              value={jobData.salary_range}
              onChange={(e) => setJobData({ ...jobData, salary_range: e.target.value })}
              className="w-full p-2 border rounded"
              required
              placeholder='Salary Range'
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
  );
};

export default JobFormModal