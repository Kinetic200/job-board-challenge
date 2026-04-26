import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-emerald-600">
            JobBoard
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Browse Jobs
            </Link>

            {user ? (
              <>
                {user.role === 'employer' && (
                  <>
                    <Link to="/post-job" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Post Job
                    </Link>
                    <Link to="/my-jobs" className="text-gray-600 hover:text-gray-900 transition-colors">
                      My Listings
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {user.name}
                    {user.company && <span className="text-gray-400"> @ {user.company}</span>}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
