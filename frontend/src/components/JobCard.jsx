import React, { useState, useEffect } from 'react';
import JobApplicationModal from './JobApplicationModal';

const JobCard = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user type from the backend
      fetch('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUserType(data.userType);
      })
      .catch(err => {
        console.error('Error fetching user type:', err);
      });
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4" key={`job-card-${job.id}`}>
      <h2 className="text-xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-2">{job.company_name}</p>
      <div className="mb-4">
        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          {job.job_type}
        </span>
        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
          {job.location}
        </span>
      </div>
      <p className="text-gray-700 mb-4">{job.description}</p>
      {job.salary_range && (
        <p className="text-gray-600 mb-4">Salary Range: {job.salary_range}</p>
      )}
      {job.requirements && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Requirements:</h3>
          <p className="text-gray-700">{job.requirements}</p>
        </div>
      )}
      {userType === 'job_seeker' && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Now
        </button>
      )}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={job.id}
      />
    </div>
  );
};

export default JobCard;