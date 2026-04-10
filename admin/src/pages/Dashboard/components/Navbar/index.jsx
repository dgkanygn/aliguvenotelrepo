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
    </header>
  );
};

export default Navbar;
