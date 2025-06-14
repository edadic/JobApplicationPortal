import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3000/api/applications/my-applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data.applications);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Applications</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Applications</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {applications.length === 0 ? (
          <p>You have not submitted any job applications yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.application_id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">{app.job_title}</h2>
                <p className="text-gray-600">{app.company_name} - {app.location}</p>
                <p className="text-gray-700 mt-2">Status: <span className="font-medium text-blue-600">{app.application_status}</span></p>
                <p className="text-sm text-gray-500">Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 mt-2">Salary: {app.salary}</p>
                <p className="text-sm text-gray-700 mt-2">Description: {app.description.substring(0, 100)}...</p>
                {app.cover_letter && (
                  <p className="text-sm text-gray-700 mt-2">Cover Letter: {app.cover_letter.substring(0, 100)}...</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;v