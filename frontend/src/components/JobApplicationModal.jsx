import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobApplicationModal = ({ isOpen, onClose, jobId }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobSeekerProfile, setJobSeekerProfile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setJobSeekerProfile(res.data.jobSeekerProfile);
        } catch (err) {
          setJobSeekerProfile(null);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!jobId) {
      setError('Job ID is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      let resume_url = jobSeekerProfile?.resume_url || null;
      if (!resume_url && resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        const uploadRes = await axios.post('http://localhost:3000/api/job-seekers/upload-resume', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        resume_url = uploadRes.data.resumeUrl || null;
      }

      // Make sure jobId is being sent as a string
      const requestData = {
        job_id: jobId, // Verify this matches backend expectations
        cover_letter: coverLetter.trim(),
        resume_url: resume_url
      };


      const response = await axios.post('http://localhost:3000/api/applications/apply', 
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        onClose();
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Application error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        setError('Please log in to apply for this position');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Please ensure all required fields are filled correctly.');
      } else {
        setError('Failed to submit application. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const hasResume = !!jobSeekerProfile?.resume_url;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Apply for Position</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-2 border rounded"
              rows="6"
              required
              placeholder="Tell us why you're interested in this position..."
            />
          </div>
          {!hasResume && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              required
            />
          </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;