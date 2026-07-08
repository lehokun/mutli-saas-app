'use client';

import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import { Sidebar, Topbar, RightSidebar } from './components/LayoutComponents';
import { HomeView, BranchView, TutupBukuView, ExpensesView, SettingView } from './components/MenuViews';

export default function AdminDashboard() {
  const adminState = useAdminDashboard(); // Mengambil seluruh state dari custom hook

  if (adminState.loading) return <div className="p-8 text-center font-bold">Memuat Workspace Dashboard...</div>;

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

          {adminState.currentMenu === 'home' && <HomeView {...adminState} />}
          {adminState.currentMenu === 'branch' && <BranchView {...adminState} />}
          {adminState.currentMenu === 'tutup-buku' && <TutupBukuView {...adminState} />}
          {adminState.currentMenu === 'expenses' && <ExpensesView {...adminState} />}
          {adminState.currentMenu === 'setting' && <SettingView {...adminState} />}
          
        </div>
      </div>
    </div>
  );
}