import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, FolderOpen, LogOut, User, Sparkles } from 'lucide-react';
import PerformanceBar from './PerformanceBar';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: Home, end: true },
    { to: '/search', label: 'Search & Filter', icon: Search },
    { to: '/curriculums', label: 'Step-by-Step Curriculums', icon: BookOpen },
    { to: '/folders', label: 'My Folders & AI Planner', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col font-body text-text">
      {/* 1. Real-Time Developer Performance Metrics Bar */}
      <PerformanceBar />

      {/* 2. Main Desktop / Tablet Header */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-2.5 text-text hover:text-primary transition-colors">
            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
              SLP
            </span>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight block leading-tight">
                The SLP Curriculum
              </span>
              <span className="text-[10px] text-stone-400 font-mono tracking-wider block">
                Headless Integration
              </span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation Tabs (Centered) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  h-full px-3.5 flex items-center gap-2 text-xs font-semibold transition-all relative border-b-2 cursor-pointer
                  ${
                    isActive
                      ? 'text-primary border-primary bg-warm-bg/40 font-bold'
                      : 'text-stone-600 border-transparent hover:text-primary hover:bg-stone-50/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Account / Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-text truncate max-w-[160px]">
              {user?.display_name || 'Sarah Johnson, CCC-SLP'}
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              Active Member
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-secondary/30 text-amber-950 border border-secondary flex items-center justify-center font-bold text-xs">
            SJ
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of portal"
            className="p-2 rounded-lg text-stone-500 hover:text-primary hover:bg-warm-bg transition-colors cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Main Outlet Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* 4. Mobile Bottom Navigation Bar (iPad / Touch Screen optimized) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border z-40 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-full h-full text-[10px] font-semibold transition-colors
                ${isActive ? 'text-primary font-bold' : 'text-stone-500 hover:text-stone-800'}
              `}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[68px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
