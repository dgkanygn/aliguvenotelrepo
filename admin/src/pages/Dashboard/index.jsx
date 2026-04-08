import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ImageUploader from '../../components/ImageUploader';
import { useDashboard } from './hooks/useDashboard';
import {
  Users,
  TrendingUp,
  Clock,
  BedDouble,
  Calendar,
  MousePointerClick,
  ImageIcon
} from 'lucide-react';

const StatCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-[#1E293B]/50 hover:bg-[#1E293B] border border-white/5 p-6 rounded-3xl shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3.5 bg-white/5 rounded-2xl text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      {trend && (
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-white mt-2 tabular-nums">{value}</p>
  </div>
);

const DashboardPage = () => {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu
  } = useDashboard();

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

        <main className="flex-1 overflow-x-hidden p-6 sm:p-10">
          <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Genel Özet</p>
              <h1 className="text-4xl font-bold text-white tracking-tight italic">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-sm font-medium border border-white/5">
              <Calendar size={16} className="text-[#C5A059]" />
              <span>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Aktif Misafirler"
              value="42"
              icon={<Users size={24} />}
              trend="+12%"
              trendUp={true}
            />
            <StatCard
              title="Doluluk"
              value="%84"
              icon={<BedDouble size={24} />}
              trend="+5%"
              trendUp={true}
            />
            <StatCard
              title="Tıklanma"
              value="1.2k"
              icon={<MousePointerClick size={24} />}
              trend="-2"
              trendUp={false}
            />
            <StatCard
              title="Bekleyen İşlemler"
              value="8"
              icon={<Clock size={24} />}
            />
          </div>

          {/* Temporary Image Uploader Section */}
          <section className="mb-12 space-y-8">
            <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-8">
              <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon className="text-[#C5A059]" size={24} />
                Fotoğraf Yükleme Test Alanı
              </h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm italic"># Tekli Yükleme (1920x1080 / 1MB)</p>
                  <ImageUploader
                    multiple={false}
                    maxFileSize={1}
                    idealResolution={{ width: 1920, height: 1080 }}
                    label="Kapak Fotoğrafı"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-slate-400 text-sm italic"># Çoklu Yükleme (800x600 / 0.5MB)</p>
                  <ImageUploader
                    multiple={true}
                    maxFileSize={0.5}
                    idealResolution={{ width: 800, height: 600 }}
                    label="Galeri Fotoğrafları"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Placeholder Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-10 h-[450px] flex flex-col items-center justify-center text-center group">
              <div className="w-20 h-20 bg-[#C5A059]/10 rounded-3xl flex items-center justify-center text-[#C5A059] mb-6 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp size={40} />
              </div>
              <h3 className="text-white text-2xl font-bold mb-3 tracking-tight">Performans Analizi</h3>
              <p className="text-slate-500 max-w-sm leading-relaxed text-sm">Burada yakında detaylı rezervasyon grafikleri ve gelir analizleri interaktif şemalarla yer alacak.</p>
              <button className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-white/5">Raporu Gör</button>
            </div>

            <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-10 h-[450px] flex flex-col items-center justify-center text-center group">
              <div className="w-20 h-20 bg-[#C5A059]/10 rounded-3xl flex items-center justify-center text-[#C5A059] mb-6 group-hover:scale-110 transition-transform duration-500">
                <Calendar size={40} />
              </div>
              <h3 className="text-white text-2xl font-bold mb-3 tracking-tight">Takvim Özeti</h3>
              <p className="text-slate-500 max-w-sm leading-relaxed text-sm">Yaklaşan düğün, organizasyon ve özel etkinliklerin takvimini buradan takip edebileceksiniz.</p>
              <button className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-white/5">Etkinlikleri Yönet</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
