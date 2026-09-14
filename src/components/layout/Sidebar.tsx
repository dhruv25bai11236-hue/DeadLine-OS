import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, ClipboardList, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Timeline', path: '/timeline', icon: CalendarDays },
  { name: 'Assignments', path: '/assignments', icon: ClipboardList },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings/availability', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col hidden md:flex shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">DeadlineOS</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                isActive 
                  ? 'bg-slate-100 text-primary' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
        © 2026 DeadlineOS AI
      </div>
    </aside>
  );
}
