# LeadFlow CRM

A fully functional **Client Lead Management System (Mini CRM)** built with:
- **React 18 + Vite** — Frontend framework
- **Tailwind CSS v3** — Styling
- **Firebase Authentication** — Email/Password login
- **Cloud Firestore** — NoSQL database for leads

---

## 🔥 Firebase Setup (Required First)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. **Enable Authentication:**
   - Authentication → Sign-in method → Email/Password → Enable
4. **Enable Firestore:**
   - Firestore Database → Create database → Start in **test mode**
5. **Get your config:**
   - Project Settings → Your apps → Web App → SDK setup
6. **Update `src/firebase/config.js`** with your actual credentials:

```js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

7. **Create a user** in Firebase Console:
   - Authentication → Users → Add User → Enter email + password

---

## 🚀 Running the Project

```bash
npm install
npm run dev
```

Open: http://localhost:5173

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Navbar, Sidebar, Layout
│   ├── leads/        # LeadForm, StatusBadge
│   └── ui/           # StatCard, ConfirmModal, LoadingSpinner
├── context/          # AuthContext (Firebase auth state)
├── firebase/         # config.js + firestore.js (CRUD)
├── hooks/            # useLeads.js
└── pages/            # Login, Dashboard, Leads, AddLead, LeadDetail
```

---

## 📋 Features

| Feature | Status |
|---|---|
| Firebase Login / Logout | ✅ |
| Add Lead (Firestore) | ✅ |
| Edit Lead | ✅ |
| Delete Lead (with confirm) | ✅ |
| View Lead Details | ✅ |
| Search Leads | ✅ |
| Filter by Status | ✅ |
| Change Status Instantly | ✅ |
| Add / Edit Notes | ✅ |
| Dashboard Stats | ✅ |
| Responsive Design | ✅ |
| Sortable Table | ✅ |

---

## 🔒 Firestore Security Rules

Apply the rules from `firestore.rules` in your Firebase Console for production security.
