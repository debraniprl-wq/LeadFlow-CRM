import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import LeadForm from '../components/leads/LeadForm';
import { useLeads } from '../hooks/useLeads';

/**
 * AddLeadPage - Form page for creating a new lead
 */
export default function AddLeadPage() {
  const { createLead } = useLeads();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const newId = await createLead(formData);
      navigate(`/leads/${newId}`);
    } catch (err) {
      // Error is already handled by useLeads with a toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
          <p className="text-sm text-gray-500">Fill in the details to create a new lead</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 lg:p-8">
        <LeadForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
