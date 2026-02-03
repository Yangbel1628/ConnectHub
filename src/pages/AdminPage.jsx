import { useState, useEffect, useCallback, useContext } from 'react';
import { Shield, Users, FileText, TrendingUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useContext(AuthContext);

  const isAdmin = user && user.email === 'demo@test.com';

  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = useCallback(() => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const postsData = JSON.parse(localStorage.getItem('posts') || '[]');
    const eventsData = JSON.parse(localStorage.getItem('events') || '[]');
    const reportsData = JSON.parse(localStorage.getItem('reports') || '[]');

    reportsData.sort(
      (a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
    );

    // Wrap in setTimeout to avoid calling setState synchronously in effect
    setTimeout(() => {
      setReports(reportsData);
      setStats({
        totalUsers: usersData.length,
        totalPosts: postsData.length,
        totalEvents: eventsData.length,
        pendingReports: reportsData.filter((r) => r.status === 'pending').length,
      });
      setLoading(false);
    }, 0);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    fetchAdminData();
  }, [isAdmin, fetchAdminData]);

  const handleResolveReport = (reportId) => {
    if (!window.confirm('Mark this report as resolved?')) return;

    const reportsData = JSON.parse(localStorage.getItem('reports') || '[]');

    const updatedReports = reportsData.map((r) =>
      r.id === reportId
        ? { ...r, status: 'resolved', resolved_at: new Date().toISOString() }
        : r
    );

    localStorage.setItem('reports', JSON.stringify(updatedReports));
    fetchAdminData();
  };

  if (!isAdmin) {
    return (
      <div className="text-center text-gray-600 py-20">
        Access denied. Admins only.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={32} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and moderate the app</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Users" value={stats.totalUsers} color="blue" Icon={Users} />
          <Stat label="Total Posts" value={stats.totalPosts} color="green" Icon={FileText} />
          <Stat label="Total Events" value={stats.totalEvents} color="yellow" Icon={TrendingUp} />
          <Stat label="Pending Reports" value={stats.pendingReports} color="red" Icon={Shield} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h2>

        {reports.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reports found</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center transition hover:shadow-sm ${
                  report.status === 'pending' ? 'border-red-400' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex-1 mb-2 md:mb-0">
                  <p className="font-semibold text-gray-800">Reason: {report.reason}</p>
                  <p className="text-sm text-gray-600">
                    Status:{' '}
                    <span
                      className={`font-medium ${
                        report.status === 'pending' ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {report.status}
                    </span>
                  </p>
                </div>

                {report.status === 'pending' && (
                  <button
                    onClick={() => handleResolveReport(report.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, Icon: StatIcon, color }) {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
  };

  return (
    <div
      className={`${colors[color].bg} p-4 rounded-lg flex justify-between items-center hover:shadow-sm transition`}
    >
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-2xl font-bold ${colors[color].text}`}>{value}</p>
      </div>
      <StatIcon size={32} className={colors[color].text} />
    </div>
  );
}
