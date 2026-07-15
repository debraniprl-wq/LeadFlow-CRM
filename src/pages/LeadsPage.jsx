import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Filter,
  Users,
} from 'lucide-react';
import StatusBadge from '../components/leads/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLeads } from '../hooks/useLeads';

const STATUSES = ['All', 'New', 'Contacted', 'Converted'];

/**
 * LeadsPage - Full leads table with search, filter, and CRUD actions
 */
export default function LeadsPage() {
  const { leads, loading, removeLead } = useLeads();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [deleteModal, setDeleteModal] = useState({ open: false, leadId: null, leadName: '' });
  const [deleting, setDeleting] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.company?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, search, statusFilter, sortField, sortDir]);

  const handleDeleteClick = (lead) => {
    setDeleteModal({ open: true, leadId: lead.id, leadName: lead.name });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await removeLead(deleteModal.leadId);
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, leadId: null, leadName: '' });
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary-500" />
      : <ChevronDown className="w-3 h-3 text-primary-500" />;
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Leads</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
        <Link
          to="/leads/add"
          id="leads-page-add-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Lead
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="leads-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 transition-colors bg-white"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {leads.length === 0 ? 'No leads yet' : 'No leads match your search'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {leads.length === 0
                ? 'Click "Add Lead" to add your first lead'
                : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    { field: 'name', label: 'Name' },
                    { field: 'email', label: 'Email', cls: 'hidden md:table-cell' },
                    { field: 'phone', label: 'Phone', cls: 'hidden lg:table-cell' },
                    { field: 'company', label: 'Company', cls: 'hidden md:table-cell' },
                    { field: 'source', label: 'Source', cls: 'hidden xl:table-cell' },
                    { field: 'status', label: 'Status' },
                    { field: 'createdAt', label: 'Added', cls: 'hidden sm:table-cell' },
                  ].map(({ field, label, cls }) => (
                    <th
                      key={field}
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 transition-colors ${cls || ''}`}
                      onClick={() => handleSort(field)}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        <SortIcon field={field} />
                      </span>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{lead.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{lead.email}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{lead.phone}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{lead.company}</span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <span className="text-sm text-gray-600">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-400">{formatDate(lead.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}
                        <Link
                          to={`/leads/${lead.id}`}
                          title="View Details"
                          className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {/* Edit */}
                        <Link
                          to={`/leads/${lead.id}/edit`}
                          title="Edit Lead"
                          className="p-2 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteClick(lead)}
                          title="Delete Lead"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteModal.leadName}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Lead'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, leadId: null, leadName: '' })}
      />
    </div>
  );
}
