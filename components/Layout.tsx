
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CloudSun, History, LayoutDashboard, LogOut, User } from 'lucide-react';
import { api } from '../api/client';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'History', icon: History, path: '/history' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CloudSun className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800">SkyWatch</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 w-full px-4 py-3 text-blue-600 bg-blue-50 rounded-xl font-medium"
            >
              <User size={20} />
              Login
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-6 py-4 flex justify-around border-t border-slate-200">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              location.pathname === item.path ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
        {isAuthenticated && (
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-slate-400">
            <LogOut size={24} />
            <span className="text-xs">Logout</span>
          </button>
        )}
      </nav>

      <main className="flex-1 overflow-auto pb-24 md:pb-0">
        <header className="md:hidden flex items-center justify-between p-6 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <CloudSun className="text-blue-600" size={28} />
            <span className="text-xl font-bold">SkyWatch</span>
          </div>
        </header>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
