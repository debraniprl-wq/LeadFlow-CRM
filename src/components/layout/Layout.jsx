import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

// Map routes to page titles
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'All Leads',
  '/leads/add': 'Add New Lead',
};

/**
 * Layout - Main app layout wrapper with sidebar + navbar + content area
 */
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine page title (handles dynamic routes like /leads/:id)
  const getTitle = () => {
    if (location.pathname.startsWith('/leads/') && location.pathname !== '/leads/add') {
      return 'Lead Details';
    }
    return pageTitles[location.pathname] || 'LeadFlow CRM';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          title={getTitle()}
        />

        {/* Page content with scrollable area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
