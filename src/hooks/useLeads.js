import { useState, useEffect, useCallback } from 'react';
import { getLeads, addLead, updateLead, deleteLead, getLeadById } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * useLeads - custom hook for all lead CRUD operations
 */
export function useLeads() {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all leads for the current user
  const fetchLeads = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getLeads(currentUser.uid);
      setLeads(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Create a new lead
  const createLead = async (leadData) => {
    try {
      const id = await addLead(leadData, currentUser.uid);
      toast.success('Lead added successfully!');
      await fetchLeads();
      return id;
    } catch (err) {
      toast.error('Failed to add lead. Please try again.');
      throw err;
    }
  };

  // Update an existing lead
  // Pass silent=true to suppress the success toast (e.g. when caller shows its own)
  const editLead = async (leadId, leadData, silent = false) => {
    try {
      await updateLead(leadId, leadData);
      if (!silent) toast.success('Lead updated successfully!');
      await fetchLeads();
    } catch (err) {
      toast.error('Failed to update lead. Please try again.');
      throw err;
    }
  };

  // Delete a lead
  const removeLead = async (leadId) => {
    try {
      await deleteLead(leadId);
      toast.success('Lead deleted successfully!');
      await fetchLeads();
    } catch (err) {
      toast.error('Failed to delete lead. Please try again.');
      throw err;
    }
  };

  // Get a single lead by ID (from cache first, then Firestore)
  const fetchLeadById = async (leadId) => {
    const cached = leads.find((l) => l.id === leadId);
    if (cached) return cached;
    try {
      return await getLeadById(leadId);
    } catch (err) {
      toast.error('Failed to load lead details.');
      throw err;
    }
  };

  // Computed stats
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    converted: leads.filter((l) => l.status === 'Converted').length,
  };

  return {
    leads,
    loading,
    error,
    stats,
    fetchLeads,
    createLead,
    editLead,
    removeLead,
    fetchLeadById,
  };
}
