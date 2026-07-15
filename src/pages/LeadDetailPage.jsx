import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Globe,
  Tag,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import StatusBadge from '../components/leads/StatusBadge';
import LeadForm from '../components/leads/LeadForm';
import ConfirmModal from '../components/ui/ConfirmModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLeads } from '../hooks/useLeads';
import { getLeadById } from '../firebase/firestore';
import toast from 'react-hot-toast';

const STATUSES = ['New', 'Contacted', 'Converted'];

/**
 * LeadDetailPage - Full lead info with edit, delete, notes, status change
 * Also handles /leads/:id/edit route for edit mode
 */
export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.endsWith('/edit');

  const { editLead, removeLead } = useLeads();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Inline note editing
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  // Status change
  const [statusChanging, setStatusChanging] = useState(false);

  const loadLead = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeadById(id);
      if (!data) {
        toast.error('Lead not found');
        navigate('/leads');
        return;
      }
      setLead(data);
      setNoteText(data.notes || '');
    } catch (err) {
      toast.error('Failed to load lead details');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  // Handle lead update (from edit form)
  const handleEditSubmit = async (formData) => {
    setSaving(true);
    try {
      await editLead(id, formData);
      await loadLead();
      navigate(`/leads/${id}`);
    } catch (err) {
      // Error handled by hook
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeLead(id);
      navigate('/leads');
    } catch (err) {
      setDeleting(false);
    }
  };

  // Save note
  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await editLead(id, { notes: noteText }, true); // silent - we show our own toast
      setLead((prev) => ({ ...prev, notes: noteText }));
      setEditingNote(false);
      toast.success('Notes updated!');
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNote(false);
    }
  };

  // Change status
  const handleStatusChange = async (newStatus) => {
    if (newStatus === lead.status) return;
    setStatusChanging(true);
    try {
      await editLead(id, { status: newStatus }, true); // silent - we show our own toast
      setLead((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setStatusChanging(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lead) return null;

  // ─── EDIT MODE ──────────────────────────────────────────────────────────────
  if (isEditMode) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to={`/leads/${id}`}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Lead</h2>
            <p className="text-sm text-gray-500">Updating: {lead.name}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 lg:p-8">
          <LeadForm
            initialData={lead}
            onSubmit={handleEditSubmit}
            isEditing
            loading={saving}
          />
        </div>
      </div>
    );
  }

  // ─── VIEW MODE ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link to="/leads" className="hover:text-primary-600 transition-colors">All Leads</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{lead.name}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Lead identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold flex-shrink-0">
              {lead.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{lead.name}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{lead.company}</p>
              <div className="mt-2">
                <StatusBadge status={lead.status} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/leads/${id}/edit`}
              id="edit-lead-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              onClick={() => setDeleteModal(true)}
              id="delete-lead-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Lead Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <InfoRow icon={Mail} label="Email" value={
                <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">{lead.email}</a>
              } />
              <InfoRow icon={Phone} label="Phone" value={
                <a href={`tel:${lead.phone}`} className="text-primary-600 hover:underline">{lead.phone}</a>
              } />
              <InfoRow icon={Building2} label="Company" value={lead.company} />
              <InfoRow icon={Globe} label="Lead Source" value={lead.source} />
              <InfoRow icon={Tag} label="Status" value={<StatusBadge status={lead.status} />} />
              <InfoRow icon={Calendar} label="Added" value={formatDate(lead.createdAt)} />
              <InfoRow icon={Calendar} label="Last Updated" value={formatDate(lead.updatedAt)} />
            </div>
          </div>

          {/* Notes section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <h3 className="text-base font-semibold text-gray-800">Notes</h3>
              </div>
              {!editingNote && (
                <button
                  onClick={() => setEditingNote(true)}
                  id="edit-notes-btn"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {lead.notes ? 'Edit Notes' : 'Add Notes'}
                </button>
              )}
            </div>

            {editingNote ? (
              <div className="space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={5}
                  id="notes-textarea"
                  placeholder="Write notes about this lead..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNote}
                    disabled={savingNote}
                    id="save-notes-btn"
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {savingNote ? <LoadingSpinner size="sm" /> : <Save className="w-3.5 h-3.5" />}
                    {savingNote ? 'Saving...' : 'Save Notes'}
                  </button>
                  <button
                    onClick={() => { setEditingNote(false); setNoteText(lead.notes || ''); }}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {lead.notes ? (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No notes added yet. Click "Add Notes" to write something.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status + Quick info */}
        <div className="space-y-5">
          {/* Change Status */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Change Status</h3>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={statusChanging}
                  id={`status-${s.toLowerCase()}-btn`}
                  className={`
                    w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${lead.status === s
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}
                    disabled:opacity-60 disabled:cursor-not-allowed
                  `}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    s === 'New' ? 'bg-blue-400' :
                    s === 'Contacted' ? 'bg-yellow-400' :
                    'bg-green-400'
                  } ${lead.status === s ? 'bg-white' : ''}`} />
                  {s}
                  {lead.status === s && <span className="ml-auto text-xs opacity-75">Current</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quick summary */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-100 p-6">
            <h3 className="text-sm font-semibold text-primary-800 mb-3">Lead Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Source:</span>
                <span className="font-medium text-gray-700">{lead.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status:</span>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Has Notes:</span>
                <span className={`font-medium ${lead.notes ? 'text-green-600' : 'text-gray-400'}`}>
                  {lead.notes ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Lead'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}

/**
 * InfoRow - Display a labeled info field with icon
 */
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <div className="text-sm font-medium text-gray-700 mt-0.5">{value || '—'}</div>
      </div>
    </div>
  );
}
