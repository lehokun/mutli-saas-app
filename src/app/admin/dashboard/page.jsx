'use client';

import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import { Sidebar, Topbar, RightSidebar } from './components/LayoutComponents';
import { HomeView, BranchView, TutupBukuView, ExpensesView, SettingView } from './components/MenuViews';

export default function AdminDashboard() {
  const adminState = useAdminDashboard();

  if (adminState.loading) return <div className="p-8 text-center font-bold">Memuat Workspace Dashboard...</div>;

  const renderCurrentView = () => {
    switch (adminState.currentMenu) {
      case 'home': return <HomeView {...adminState} />;
      case 'branch': return <BranchView {...adminState} />;
      case 'tutup-buku': return <TutupBukuView {...adminState} />;
      case 'expenses': return <ExpensesView {...adminState} />;
      case 'setting': return <SettingView {...adminState} />;
      default: return <HomeView {...adminState} />;
    }
  };

  return (
    <div className={`min-h-screen flex text-sm transition-colors duration-300 relative ${adminState.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      <Sidebar 
        isSidebarOpen={adminState.isSidebarOpen} setIsSidebarOpen={adminState.setIsSidebarOpen} 
        currentMenu={adminState.currentMenu} setCurrentMenu={adminState.setCurrentMenu} 
        darkMode={adminState.darkMode} handleLogout={adminState.handleLogout} 
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
          
          <Topbar 
            darkMode={adminState.darkMode} setDarkMode={adminState.setDarkMode} 
            isSidebarOpen={adminState.isSidebarOpen} setIsSidebarOpen={adminState.setIsSidebarOpen} 
            filterTimeframe={adminState.filterTimeframe} setFilterTimeframe={adminState.setFilterTimeframe} 
            filterBranchId={adminState.filterBranchId} setFilterBranchId={adminState.setFilterBranchId} 
            branches={adminState.branches} router={adminState.router} 
          />

          {renderCurrentView()}
          
        </div>
      </div>

      {/* 🔥 KOMPONEN TOAST NOTIFICATION (Bebas Focus-Stealing) */}
      {adminState.notification && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100 ${
          adminState.notification.type === 'error' 
            ? 'bg-rose-600 text-white shadow-rose-900/30' 
            : 'bg-emerald-600 text-white shadow-emerald-900/30'
        }`}>
          <span className="text-xl">{adminState.notification.type === 'error' ? '⚠️' : '✅'}</span>
          {adminState.notification.msg}
        </div>
      )}

      {/* 🔥 KOMPONEN MODAL CONFIRM (Pengganti window.confirm) */}
      {adminState.confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl border transform scale-100 transition-all ${adminState.darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shrink-0">⚠️</div>
              <h3 className="text-lg font-black tracking-tight">Konfirmasi Tindakan</h3>
            </div>
            <p className={`text-sm mb-8 whitespace-pre-wrap leading-relaxed ${adminState.darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {adminState.confirmDialog.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={adminState.confirmDialog.onCancel} 
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${adminState.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                Batal
              </button>
              <button 
                onClick={adminState.confirmDialog.onConfirm} 
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}