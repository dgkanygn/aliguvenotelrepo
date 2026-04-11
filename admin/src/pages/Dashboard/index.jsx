import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useDashboard } from './hooks/useDashboard';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User } from 'lucide-react';

const DashboardPage = () => {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu
  } = useDashboard();

  const { user } = useAuth();

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-inter">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleMobileMenu={toggleMobileMenu} />

        <main className="flex-1 overflow-x-hidden p-6 sm:p-10 flex flex-col items-center justify-center -mt-20">
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="inline-flex p-4 bg-[#C5A059]/10 rounded-3xl text-[#C5A059] mb-4 border border-[#C5A059]/20 shadow-2xl shadow-[#C5A059]/5">
              <User size={48} strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h2 className="text-[#C5A059] font-bold text-sm uppercase tracking-[4px]">Yönetim Paneli</h2>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Hoş geldiniz, <span className="text-[#C5A059]">{user?.username || 'Admin'}</span>
              </h1>
            </div>

            <div className="flex items-center justify-center gap-3 text-slate-500 font-medium pt-4">
              <Calendar size={18} className="text-[#C5A059]" />
              <span className="tracking-wide uppercase text-xs">{today}</span>
            </div>

            <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed italic">
              Otel içeriklerini yönetmek için soldaki menüyü kullanabilirsiniz.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
