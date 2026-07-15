import { Link } from 'react-router-dom';
import { Users, UserPlus, PhoneCall, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/leads/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLeads } from '../hooks/useLeads';

/**
 * DashboardPage - Shows summary stats and recent leads
 */
export default function DashboardPage() {
  const { leads, stats, loading } = useLeads();

  // Show last 5 leads as "Recent"
  const recentLeads = leads.slice(0, 5);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your lead pipeline</p>
        </div>
        <Link
          to="/leads/add"
          id="dashboard-add-lead-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add New Lead
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Users}
          color="text-primary-600"
          bgColor="bg-primary-50"
          borderColor="border-primary-100"
        />
        <StatCard
          title="New Leads"
          value={stats.new}
          icon={UserPlus}
          color="text-blue-500"
          bgColor="bg-blue-50"
          borderColor="border-blue-100"
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={PhoneCall}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          borderColor="border-yellow-100"
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          icon={TrendingUp}
          color="text-green-600"
          bgColor="bg-green-50"
          borderColor="border-green-100"
        />
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="text-base font-semibold text-gray-800">Recent Leads</h3>
          </div>
          <Link
            to="/leads"
            id="view-all-leads-btn"
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No leads yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first lead to get started</p>
            <Link
              to="/leads/add"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add First Lead
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Added</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{lead.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{lead.company}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-400">{formatDate(lead.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conversion rate card */}
      {stats.total > 0 && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-200 text-sm font-medium">Conversion Rate</p>
              <p className="text-4xl font-bold mt-1">
                {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%
              </p>
              <p className="text-primary-300 text-sm mt-1">
                {stats.converted} of {stats.total} leads converted
              </p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
