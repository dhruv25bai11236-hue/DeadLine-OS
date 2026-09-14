import { Outlet } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center">
            {/* Mobile menu button (would ideally control sidebar state) */}
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-800 md:hidden">DeadlineOS</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" className="text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border border-white"></span>
            </Button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[150px] truncate">
                {user?.email || 'User'}
              </span>
              <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-slate-100 hover:ring-slate-200 transition-all" onClick={() => signOut()}>
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
