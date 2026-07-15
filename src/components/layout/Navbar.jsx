import { Menu, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Navbar - Top navigation bar with user info and logout
 */
export default function Navbar({ onMenuToggle, title }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const userInitial = currentUser?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Left: Menu toggle + Page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-2">
        {/* Notification bell (decorative) */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors hidden sm:flex">
          <Bell className="w-5 h-5" />
        </button>

        {/* User avatar + email */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100 ml-1">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {userInitial}
          </div>
          <span className="text-sm text-gray-600 hidden md:block max-w-[150px] truncate">
            {currentUser?.email}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 ml-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
