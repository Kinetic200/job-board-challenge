import { useState, useEffect } from 'react';
import api from '../api';
import JobCard from '../components/JobCard';

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const levels = ['All', 'Entry', 'Mid', 'Senior', 'Lead', 'Executive'];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ jobType: 'All', experienceLevel: 'All', location: '' });

  useEffect(() => {
    const params = {};
    if (filters.jobType !== 'All') params.jobType = filters.jobType;
    if (filters.experienceLevel !== 'All') params.experienceLevel = filters.experienceLevel;
    if (filters.location.trim()) params.location = filters.location.trim();

    api.get('/jobs', { params })
      .then((res) => setJobs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-500">Browse open positions from top companies.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="e.g. San Francisco, Remote"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Experience</label>
          <select
            value={filters.experienceLevel}
            onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No jobs found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
