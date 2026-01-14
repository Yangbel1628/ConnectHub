import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { Shield, Users, FileText, TrendingUp } from 'lucide-react';

export function AdminPage() {
  const { user } = useAuth();

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

    setReports(reportsData);

    setStats({
      totalUsers: usersData.length,
      totalPosts: postsData.length,
      totalEvents: eventsData.length,
      pendingReports: reportsData.filter(r => r.status === 'pending').length,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    const init = () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }
      fetchAdminData();
    };

    init();
  }, [isAdmin, fetchAdminData]);

  const handleResolveReport = (reportId) => {
    const reportsData = JSON.parse(localStorage.getItem('reports') || '[]');

    const updatedReports = reportsData.map(r =>
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
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={32} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and moderate the app</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat label="Total Users" value={stats.totalUsers} color="blue" Icon={Users} />
          <Stat label="Total Posts" value={stats.totalPosts} color="green" Icon={FileText} />
          <Stat label="Total Events" value={stats.totalEvents} color="yellow" Icon={TrendingUp} />
          <Stat label="Pending Reports" value={stats.pendingReports} color="red" Icon={Shield} />
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h2>

        {reports.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reports found</p>
        ) : (
          reports.map(report => (
            <div key={report.id} className="border rounded-lg p-4 mb-3">
              <p className="font-semibold">Reason: {report.reason}</p>
              <p className="text-sm text-gray-600">Status: {report.status}</p>

              {report.status === 'pending' && (
                <button
                  onClick={() => handleResolveReport(report.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Resolve
                </button>
              )}
            </div>
          ))
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
    <div className={`${colors[color].bg} p-4 rounded-lg flex justify-between`}>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-2xl font-bold ${colors[color].text}`}>{value}</p>
      </div>
      <StatIcon size={32} className={colors[color].text} />
    </div>
  );
}
export default AdminPage
