import React from 'react'
import JobListings from './JobListings'

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Portal Dashboard</h1>
      <JobListings />
    </div>
  )
}

export default Dashboard