// ============================================================
// FIRESTORE DATABASE OPERATIONS (WITH DEMO FALLBACK)
// All CRUD operations for leads collection
// ============================================================

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isDemoMode } from './config';

const LEADS_COLLECTION = 'leads';
const LOCAL_STORAGE_KEY = 'demo_leads_data';

// --- Helper for Demo Mode ---
const getLocalLeads = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  
  // Seed initial dummy data if empty
  const initialData = [
    {
      id: 'demo_1',
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc',
      source: 'Website',
      status: 'New',
      notes: 'Interested in our enterprise plan.',
      userId: 'demo-user-123', // Matches the fake user ID in AuthContext
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'demo_2',
      name: 'Bob Smith',
      email: 'bob.smith@startup.io',
      phone: '+1 (555) 987-6543',
      company: 'Startup IO',
      source: 'Referral',
      status: 'Contacted',
      notes: 'Had a quick call, setting up a demo next week.',
      userId: 'demo-user-123',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    },
    {
      id: 'demo_3',
      name: 'Carol White',
      email: 'c.white@globalcorp.com',
      phone: '+44 20 7946 0958',
      company: 'Global Corp',
      source: 'Trade Show',
      status: 'Converted',
      notes: 'Signed the contract yesterday!',
      userId: 'demo-user-123',
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
      updatedAt: new Date().toISOString(),
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};
const saveLocalLeads = (leads) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
};
// ----------------------------

/**
 * Add a new lead
 * @param {Object} leadData - Lead data object
 * @param {string} userId - Current user's UID
 * @returns {Promise<string>} - New document ID
 */
export const addLead = async (leadData, userId) => {
  if (isDemoMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leads = getLocalLeads();
        const newId = `demo_lead_${Date.now()}`;
        const newLead = {
          id: newId,
          ...leadData,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        leads.push(newLead);
        saveLocalLeads(leads);
        resolve(newId);
      }, 500);
    });
  }

  const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
    ...leadData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Update an existing lead
 * @param {string} leadId - Lead document ID
 * @param {Object} leadData - Updated lead data
 */
export const updateLead = async (leadId, leadData) => {
  if (isDemoMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leads = getLocalLeads();
        const index = leads.findIndex((l) => l.id === leadId);
        if (index !== -1) {
          leads[index] = { ...leads[index], ...leadData, updatedAt: new Date().toISOString() };
          saveLocalLeads(leads);
        }
        resolve();
      }, 500);
    });
  }

  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, {
    ...leadData,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a lead
 * @param {string} leadId - Lead document ID
 */
export const deleteLead = async (leadId) => {
  if (isDemoMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let leads = getLocalLeads();
        leads = leads.filter((l) => l.id !== leadId);
        saveLocalLeads(leads);
        resolve();
      }, 500);
    });
  }

  await deleteDoc(doc(db, LEADS_COLLECTION, leadId));
};

/**
 * Get all leads for the current user
 * @param {string} userId - Current user's UID
 * @returns {Promise<Array>} - Array of lead objects
 */
export const getLeads = async (userId) => {
  if (isDemoMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leads = getLocalLeads();
        const userLeads = leads
          .filter((l) => l.userId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve(userLeads);
      }, 500);
    });
  }

  const q = query(
    collection(db, LEADS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  }));
};

/**
 * Get a single lead by ID
 * @param {string} leadId - Lead document ID
 * @returns {Promise<Object>} - Lead object
 */
export const getLeadById = async (leadId) => {
  if (isDemoMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leads = getLocalLeads();
        const lead = leads.find((l) => l.id === leadId);
        resolve(lead || null);
      }, 300);
    });
  }

  const docRef = doc(db, LEADS_COLLECTION, leadId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
  return null;
};
