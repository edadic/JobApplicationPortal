import React, { useState, useEffect } from 'react'
import axios from 'axios'
import JobFormModal from '../components/JobFormModal'
import Modal from '../components/Modal'

const MyListings = () => {
  const [jobs, setJobs] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [isAppModalOpen, setIsAppModalOpen] = useState(false)
  const [appLoading, setAppLoading] = useState(false)

  const fetchApplications = async (jobId) => {
    setAppLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:3000/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApplications(response.data.applications || [])
    } catch (error) {
      alert('Failed to fetch applications')
    } finally {
      setAppLoading(false)
    }
  }

   const handleViewApplications = (job) => {
    setSelectedJob(job)
    setIsAppModalOpen(true)
    fetchApplications(job.id)
  }

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
      const token = localStorage.getItem('token');
      const profileResponse = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!profileResponse.data.employerProfile) {
          alert('Please complete your employer profile first');
          return;
      }
      
      const jobPayload = {
          ...jobData,
          employer_id: profileResponse.data.employerProfile.id,
          status: 'active',
          closing_date: jobData.closing_date || new Date().toISOString().split('T')[0]
      };
  
      await axios.post('http://localhost:3000/api/jobs', jobPayload, {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Job listing created successfully!');
      setIsModalOpen(false);
      await fetchMyJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      alert(error.response?.data?.message || 'Failed to post job');
    }
  };

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
              <p className="text-gray-600">Type: {job.job_type}</p>
              <p className="text-gray-600">Status: {job.status}</p>
            </div>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => handleViewApplications(job)}
            >
              View Applications
            </button>
          </div>
        ))}
      </div>

        {isAppModalOpen && (
        <Modal isOpen={isAppModalOpen} onClose={() => setIsAppModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">
            Applications for: {selectedJob?.title}
          </h2>
          {appLoading ? (
            <p>Loading...</p>
          ) : applications.length === 0 ? (
            <p>No applications for this job yet.</p>
          ) : (
            <ul>
             {applications.map((app, idx) => (
    <li key={app.application_id} className="mb-4 border-b pb-2">
      <div>
        <strong>{app.first_name} {app.last_name}</strong> ({app.email})
      </div>
      <div>
        Status:{" "}
        <select
          value={app.application_status}
          onChange={async (e) => {
            const newStatus = e.target.value;
            try {
              const token = localStorage.getItem('token');
              await axios.patch(
                `http://localhost:3000/api/applications/${app.application_id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              // Update local state
              setApplications((prev) =>
                prev.map((a, i) =>
                  i === idx ? { ...a, application_status: newStatus } : a
                )
              );
              } catch (err) {
              alert('Failed to update status');
            }
          }}
          className="border rounded px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>
      <div>Applied at: {new Date(app.applied_at).toLocaleString()}</div>
      <div>Cover Letter: {app.cover_letter}</div>
      <div>Skills: {app.skills}</div>
      <div>Experience: {app.experience_years} years</div>
      <div>Education: {app.education_level}</div>
      <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Resume</a>
    </li>
  ))}
            </ul>
          )}
        </Modal>
      )}
      
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitJob}
      />
    </div>
  )
}

export default MyListings