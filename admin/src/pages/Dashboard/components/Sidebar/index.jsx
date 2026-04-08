import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Bed, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  Menu,
  Image as ImageIcon,
  Layout,
  Timer,
  Info,
  Star,
  Utensils,
  Heart,
  Mail,
  Flag,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed, isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showLabels = !isCollapsed || isOpen;
  const sidebarWidth = (isCollapsed && !isOpen) ? 'w-20' : 'w-72';

  const categories = [
    {
      label: 'Ana Menü',
      items: [
        { title: 'Genel Bakış', icon: <Home size={20} />, id: 'dashboard', path: '/dashboard' },
      ]
    },
    {
      label: 'Ana Sayfa İçerikleri',
      items: [
        { title: 'Hero Yönetimi', icon: <Layout size={20} />, id: 'hero', path: '/hero' },
        { title: 'Sayaç', icon: <Timer size={20} />, id: 'counter', path: '/counter' },
        { title: 'Kurucu Bilgisi', icon: <Info size={20} />, id: 'founder', path: '/founder' },
        { title: 'Özellikler', icon: <Star size={20} />, id: 'features', path: '/features' },
      ]
    },
    {
      label: 'İçerik Yönetimi',
      items: [
        { title: 'Odalar', icon: <Bed size={20} />, id: 'rooms', path: '/rooms' },
        { title: 'Restoran', icon: <Utensils size={20} />, id: 'restaurant', path: '/restaurant' },
        { title: 'Düğün & Organizasyon', icon: <Heart size={20} />, id: 'wedding', path: '/wedding' },
        { title: 'İletişim', icon: <Mail size={20} />, id: 'contact', path: '/contact' },
        { title: 'Sayfa Banner\'ları', icon: <Flag size={20} />, id: 'banners', path: '/banners' },
      ]
    },
    {
      label: 'Sistem',
      items: [
        { title: 'Admin Yönetimi', icon: <ShieldCheck size={20} />, id: 'admins', path: '/admins' },
        { title: 'Ayarlar', icon: <Settings size={20} />, id: 'settings', path: '/settings' },
      ]
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (isOpen) setIsOpen(false); // Close mobile menu after navigation
  };

  const Item = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <button
        key={item.id}
        onClick={() => handleNavigate(item.path)}
        className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all group cursor-pointer relative
          ${isActive 
            ? 'text-white bg-[#C5A059]/10 border border-[#C5A059]/10' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
          ${!showLabels ? 'justify-center' : ''}
        `}
      >
        <div className={`${isActive ? 'text-[#C5A059]' : 'group-hover:text-[#C5A059]'} transition-colors shrink-0`}>
          {item.icon}
        </div>
        {showLabels && (
          <span className={`text-sm font-medium whitespace-nowrap ${isActive ? 'text-white' : ''}`}>
            {item.title}
          </span>
        )}
        {!showLabels && (
          <div className="fixed left-20 ml-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] border border-white/10 shadow-xl">
            {item.title}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`bg-[#0F172A] border-r border-white/5 h-screen transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0
          ${sidebarWidth}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className={`p-6 flex items-center ${!showLabels ? 'justify-center' : 'justify-between'}`}>
          {showLabels && (
            <span 
              onClick={() => handleNavigate('/dashboard')}
              className="text-[#C5A059] font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap cursor-pointer"
            >
              ALİ GÜVEN
            </span>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/5 text-slate-400 cursor-pointer"
          >
            {!showLabels ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {categories.map((category, idx) => (
            <div key={idx} className="space-y-1">
              {showLabels && (
                <h4 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-2">
                  {category.label}
                </h4>
              )}
              {!showLabels && (
                <div className="mx-auto w-8 h-[1px] bg-white/5 my-4" />
              )}
              {category.items.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </div>
          ))}
        </div>

        {/* Profile summary */}
        {showLabels && (
          <div className="px-6 py-6 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold border border-[#C5A059]/20 shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-[13px] font-medium truncate">{user?.name}</p>
                <p className="text-slate-500 text-[11px] truncate">Admin Sorumlu</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer
              ${!showLabels ? 'justify-center' : ''}
            `}
          >
            <LogOut size={18} />
            {showLabels && <span className="text-sm font-medium">Çıkış Yap</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
