import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

export default function MyJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    api.get('/jobs', { params: { postedBy: user._id } })
      .then((res) => setJobs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Job Listings</h1>
          <p className="text-gray-500 mt-1">{jobs.length} listing{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => navigate('/post-job')}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">You haven't posted any jobs yet</p>
          <p className="text-sm mt-1">Click "Post New Job" to create your first listing</p>
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
