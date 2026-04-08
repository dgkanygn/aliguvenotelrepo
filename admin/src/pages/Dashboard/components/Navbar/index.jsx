import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Navbar = ({ onToggleMobileMenu }) => {
  return (
    <header className="h-20 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-30 px-6 sm:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-white">Yönetim Paneli</h2>
          <p className="text-xs text-slate-500">Ali Güven Otel içeriklerini buradan yönetebilirsiniz.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer relative group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#C5A059] rounded-full border-2 border-[#020617]"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-white/5 mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium text-white">Genel Yönetici</p>
            <p className="text-[11px] text-slate-500">admin@aliguven.com</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C5A059] flex items-center justify-center text-white font-bold shadow-lg shadow-[#C5A059]/10">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
