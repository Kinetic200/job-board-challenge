import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((res) => {
        setJob(res.data);
        if (user) {
          const hasApplied = res.data.applications?.some(
            (app) => app.applicant?._id === user._id
          );
          setApplied(hasApplied);
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate, user]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { coverLetter });
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this job listing?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!job) return null;

  const isOwner = user && job.postedBy?._id === user._id;
  const isJobseeker = user && user.role === 'jobseeker';

  const formatSalary = (min, max) => {
    const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    if (max) return `Up to ${fmt(max)}`;
    return 'Not specified';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-lg text-gray-500">{job.company}</p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link
                to={`/edit-job/${job._id}`}
                className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="text-sm px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-400 mb-1">Type</p>
            <p className="text-sm font-medium text-gray-700">{job.jobType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Experience</p>
            <p className="text-sm font-medium text-gray-700">{job.experienceLevel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Location</p>
            <p className="text-sm font-medium text-gray-700">{job.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Salary</p>
            <p className="text-sm font-medium text-emerald-600">{formatSalary(job.salaryMin, job.salaryMax)}</p>
          </div>
        </div>

        {job.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
          <span>Posted by {job.postedBy?.name}</span>
          <span>
            {new Date(job.createdAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {isJobseeker && job.status === 'open' && !applied && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Now</h3>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-y mb-4"
            placeholder="Write a brief cover letter (optional)..."
          />
          <button
            onClick={handleApply}
            disabled={applying}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {applying ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      )}

      {applied && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl text-center">
          You have already applied to this position.
        </div>
      )}
    </div>
  );
}
