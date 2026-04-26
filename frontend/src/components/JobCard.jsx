import { Link } from 'react-router-dom';

const typeColors = {
  'Full-time': 'bg-blue-100 text-blue-800',
  'Part-time': 'bg-amber-100 text-amber-800',
  'Contract': 'bg-purple-100 text-purple-800',
  'Remote': 'bg-green-100 text-green-800',
  'Internship': 'bg-pink-100 text-pink-800'
};

const levelColors = {
  Entry: 'bg-gray-100 text-gray-700',
  Mid: 'bg-sky-100 text-sky-700',
  Senior: 'bg-orange-100 text-orange-700',
  Lead: 'bg-red-100 text-red-700',
  Executive: 'bg-violet-100 text-violet-700'
};

function formatSalary(min, max) {
  const fmt = (n) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
    return `$${n}`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return null;
}

export default function JobCard({ job }) {
  const typeColor = typeColors[job.jobType] || 'bg-gray-100 text-gray-800';
  const levelColor = levelColors[job.experienceLevel] || 'bg-gray-100 text-gray-700';
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Link to={`/jobs/${job._id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
        </div>
        {job.status === 'closed' && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
            Closed
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColor}`}>
          {job.jobType}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColor}`}>
          {job.experienceLevel}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
      </div>

      {salary && (
        <p className="text-sm font-medium text-emerald-600 mb-3">{salary}</p>
      )}

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-xs text-gray-400">+{job.skills.length - 5} more</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-xs text-gray-400">
          {job.applications?.length || 0} applicant{(job.applications?.length || 0) !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
