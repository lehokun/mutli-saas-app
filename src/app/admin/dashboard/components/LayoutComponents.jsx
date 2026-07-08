'use client';
import { useState } from 'react';

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, currentMenu, setCurrentMenu, darkMode, handleLogout }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Dashboard' },
    { id: 'branch', icon: '🏢', label: 'Kelola Cabang' },
    { id: 'tutup-buku', icon: '📊', label: 'Tutup Buku' },
    { id: 'expenses', icon: '🧾', label: 'Pengeluaran' },
    { id: 'setting', icon: '⚙️', label: 'Pengaturan' },
  ];

  return (
    <>
      {/* Overlay Gelap Khusus Mobile */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all"/>
      )}

      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed top-0 left-0 h-[100dvh] z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r flex flex-col justify-between py-6
          w-64 lg:w-20 ${isExpanded ? 'lg:w-64' : ''}
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'}
          ${!isSidebarOpen ? 'pointer-events-none lg:pointer-events-auto' : 'pointer-events-auto'}
          ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        `}
      >
        <div className="flex flex-col items-center w-full">
          {/* Header Logo */}
          <div className="flex items-center gap-3 px-6 mb-10 w-full overflow-hidden cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shrink-0">
               <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/></svg>
            </div>
            <span className={`font-black tracking-tight truncate transition-opacity duration-300 opacity-100 lg:opacity-0 ${isExpanded ? 'lg:opacity-100' : ''} ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              AnimalCare
            </span>
            {/* Tombol Silang (X) Khusus Mobile */}
            {isSidebarOpen && (
              <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }} className="lg:hidden ml-auto text-rose-500 hover:bg-rose-50 p-1 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>

          <nav className="flex flex-col w-full px-4 gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentMenu(item.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentMenu === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : `${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`
                }`}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className={`font-bold whitespace-nowrap text-sm transition-opacity duration-300 opacity-100 lg:opacity-0 ${isExpanded ? 'lg:opacity-100' : ''}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <span className="text-xl shrink-0">🚪</span>
            <span className={`font-bold text-sm transition-opacity duration-300 opacity-100 lg:opacity-0 ${isExpanded ? 'lg:opacity-100' : ''}`}>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Spacer Penyeimbang Desktop (Mencegah Overlap) */}
      <div className="hidden lg:block w-20 shrink-0 transition-all duration-500"></div>
    </>
  );
}

export function Topbar({ darkMode, setDarkMode, isSidebarOpen, setIsSidebarOpen, filterTimeframe, setFilterTimeframe, filterBranchId, setFilterBranchId, branches, router }) {
  return (
    <header className={`sticky top-0 z-40 pb-4 mb-6 backdrop-blur-xl transition-colors duration-300 border-b 
      -mt-4 pt-4 -mx-4 px-4 
      sm:-mt-6 sm:pt-6 sm:-mx-6 sm:px-6 
      lg:-mt-8 lg:pt-8 lg:-mx-8 lg:px-8 
      ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'} 
      ${isSidebarOpen ? 'hidden lg:block' : 'block'}`}
    >
      <div className="flex flex-col gap-4">
        
        {}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 lg:hidden shadow-sm shrink-0 flex items-center justify-center ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="19" y2="18"></line>
            </svg>
          </button>
          <div className="flex flex-col min-w-0">
            <span className={`text-[10px] font-bold tracking-wider uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Console Control</span>
            <h1 className={`text-lg sm:text-xl font-black tracking-tight mt-0.5 truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>Manager Workspace</h1>
          </div>
        </div>

        {}
        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-2">
          <button onClick={() => router.push('/branch-login')} className={`col-span-1 px-3 py-2.5 md:py-2 rounded-xl border text-[11px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${darkMode ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-white border-slate-200 text-blue-600'}`}>
             📲 Portal <span className="hidden md:inline">Cabang</span>
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className={`col-span-1 px-3 py-2.5 md:py-2 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-700'}`}>
             {darkMode ? '☀️ Terang' : '🌙 Gelap'}
          </button>
          
          <select className={`col-span-2 md:col-span-1 border-2 rounded-xl px-3 py-2.5 md:py-2 font-bold text-[11px] focus:outline-none transition-all flex-1 min-w-[140px] ${darkMode ? 'bg-slate-800 border-indigo-500 text-indigo-400' : 'bg-indigo-50 border-indigo-600 text-indigo-900'}`} value={filterTimeframe} onChange={(e) => setFilterTimeframe(e.target.value)}>
            <option value="ALL">🗓️ Semua Periode</option>
            <option value="TODAY">📅 Hari Ini</option>
            <option value="WEEK">📆 7 Hari</option>
            <option value="MONTH">🗂️ Bulan Ini</option>
          </select>
          
          <select className={`col-span-2 md:col-span-1 border-2 rounded-xl px-3 py-2.5 md:py-2 font-bold text-[11px] focus:outline-none transition-all flex-1 min-w-[140px] ${darkMode ? 'bg-slate-800 border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-600 text-blue-900'}`} value={filterBranchId} onChange={(e) => setFilterBranchId(e.target.value)}>
            <option value="ALL">🌐 Semua Cabang</option>
            {branches.map(b => <option key={b.id} value={b.id}>📍 {b.name}</option>)}
          </select>
        </div>
        
      </div>
    </header>
  );
}

export function RightSidebar({ darkMode, getUserInitials, getUserDisplayName, handleLogout, setCurrentMenu, branches, filteredExpenses, formatRupiah }) {
  return (
    <aside className={`w-full xl:w-80 border-t xl:border-t-0 xl:border-l p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300 ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className={`flex items-center justify-between border-b pb-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-md shrink-0">{getUserInitials()}</div>
          <div className="min-w-0">
            <h4 className={`font-black text-xs tracking-tight truncate max-w-[140px] uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>{getUserDisplayName()}</h4>
            <p className={`text-[10px] font-semibold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Owner Administrator</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Menu Akses Kilat</h4>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setCurrentMenu('tutup-buku')} className="p-3 rounded-xl border font-bold text-xs text-center bg-teal-500/10 text-teal-600 border-teal-200 hover:bg-teal-500 hover:text-white transition-all">📊 Tutup Buku</button>
          <button onClick={() => setCurrentMenu('expenses')} className="p-3 rounded-xl border font-bold text-xs text-center bg-rose-500/10 text-rose-600 border-rose-200 hover:bg-rose-500 hover:text-white transition-all">🧾 Lihat Nota</button>
        </div>
      </div>
      <div>
        <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Authorized Outlet Credentials</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {branches.map(b => (
            <div key={b.id} className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{b.name}</span>
              <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-md text-blue-600 font-extrabold text-[10px] shadow-sm">{b.token}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Histori Pengeluaran Foto</h4>
          <button onClick={() => setCurrentMenu('expenses')} className="text-[11px] text-blue-500 font-bold hover:underline cursor-pointer bg-transparent border-none">View All</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[300px]">
          {filteredExpenses.slice(0, 5).map(exp => (
            <div key={exp.id} className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-100'}`}>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 shrink-0 font-bold">🧾</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h5 className={`font-bold text-xs truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{exp.branches?.name}</h5>
                  <span className="text-rose-600 font-black text-xs shrink-0">{formatRupiah(exp.amount)}</span>
                </div>
                <p className={`text-[11px] font-medium leading-relaxed truncate mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>📝 {exp.notes || 'Tanpa Catatan'}</p>
                {/* PERBAIKAN GAMBAR FEED: object-contain dan max-h-32 */}
                <img src={exp.image_url} alt="Nota" className={`w-full h-auto max-h-40 object-contain rounded-lg border border-slate-200/80 mt-2 shadow-sm p-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200/50'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}