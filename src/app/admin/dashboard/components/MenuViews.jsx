'use client';

import { useState } from 'react';

// Reusable Form Input (Dioptimalkan kontrasnya untuk mode terang)
const FormInput = ({ type, placeholder, value, onChange, required = true, darkMode }) => (
  <input 
    type={type} 
    placeholder={placeholder} 
    required={required}
    className={`w-full rounded-xl border p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
      darkMode 
        ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' 
        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-600 shadow-sm font-medium'
    }`}
    value={value ?? ''} 
    onChange={(e) => onChange(e.target.value)}
  />
);

// --- 1. HOME VIEW (DASHBOARD UTAMA DENGAN WARNA KONTRAS TINGGI & FITUR EXPIRED) ---
export function HomeView(props) {
  const { darkMode, totalOmset, labaBersih, totalPengeluaran, chartData, maxChartOmset, formatRupiah, stocks, branches, filteredStocks } = props;

  // Hitung akumulasi kerugian barang expired dari data yang terfilter saat ini
  const hariIni = new Date();
  const totalKerugianExpired = filteredStocks.reduce((acc, item) => {
    if (item.expired_at && new Date(item.expired_at) < hariIni && item.quantity > 0) {
      return acc + (item.quantity * item.hpp);
    }
    return acc;
  }, 0);

  // Sesuaikan nilai laba bersih setelah dikurangi kerugian produk expired
  const labaDisesuaikan = labaBersih - totalKerugianExpired;

  const cardStyle = `relative overflow-hidden p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
    darkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-200 shadow-sm'
  }`;

  return (
    <div className="space-y-6">
      {/* Grid Kartu Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card: Omset */}
        <div className={cardStyle}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Omset Terfilter</p>
              <h4 className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formatRupiah(totalOmset)}</h4>
            </div>
            <div className={`p-2.5 rounded-xl shrink-0 ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Card: Laba Bersih */}
        <div className={cardStyle}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Laba Bersih Efektif</p>
              <h4 className={`text-xl sm:text-2xl font-black tracking-tight ${labaDisesuaikan >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{formatRupiah(labaDisesuaikan)}</h4>
            </div>
            <div className={`p-2.5 rounded-xl shrink-0 ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Card: Pengeluaran Ops */}
        <div className={cardStyle}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Pengeluaran Ops</p>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight text-rose-700">{formatRupiah(totalPengeluaran)}</h4>
            </div>
            <div className={`p-2.5 rounded-xl shrink-0 ${darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Card Baru: Kerugian Barang Expired */}
        <div className={`${cardStyle} ${totalKerugianExpired > 0 ? 'border-red-300 bg-red-50/30' : ''}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${totalKerugianExpired > 0 ? 'text-red-800' : 'text-slate-700'}`}>Kerugian Expired</p>
              <h4 className={`text-xl sm:text-2xl font-black tracking-tight ${totalKerugianExpired > 0 ? 'text-red-700 animate-pulse' : 'text-slate-900'}`}>{formatRupiah(totalKerugianExpired)}</h4>
            </div>
            <span className="text-xl">⚠️</span>
          </div>
        </div>
      </div>

      {/* Kontrol Manajemen Tambah Produk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Form Registrasi Produk Baru */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-lg">📦</span>
            <h3 className={`font-extrabold text-sm tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Daftarkan Produk & Expired</h3>
          </div>
          <form onSubmit={props.handleAddStock} className="space-y-3">
            <FormInput darkMode={darkMode} type="text" placeholder="Nama Produk Baru" value={props.itemName} onChange={props.setItemName} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput darkMode={darkMode} type="number" placeholder="Stok" value={props.quantity} onChange={props.setQuantity} />
              <FormInput darkMode={darkMode} type="number" placeholder="HPP (Rp)" value={props.hpp} onChange={props.setHpp} />
            </div>
            <FormInput darkMode={darkMode} type="number" placeholder="Harga Jual (Rp)" value={props.hargaJual} onChange={props.setHargaJual} />
            
            {/* Input Tanggal Expired */}
            <div>
              <label className={`block text-[10px] font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Batas Tanggal Kedaluwarsa</label>
              <input 
                type="date" 
                className={`w-full rounded-xl border p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                }`}
                value={props.expiredDate || ''} 
                onChange={(e) => props.setExpiredDate(e.target.value)} 
              />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">Simpan Produk</button>
          </form>
        </div>

        {/* Form Tambah Stok Pusat */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-lg">💎</span>
            <h3 className={`font-extrabold text-sm tracking-tight ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Tambah Stok Jadi</h3>
          </div>
          <form onSubmit={props.handleAddExistingStock} className="space-y-3 flex flex-col h-[calc(100%-3rem)] justify-between">
            <div className="space-y-3">
              <select required className={`w-full rounded-xl border p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'}`} value={props.selectedExistingStockId} onChange={(e) => props.setSelectedExistingStockId(e.target.value)}>
                <option value="">-- Pilih Produk Pusat --</option>
                {stocks.filter(s => s.branch_id === null).map(s => <option key={s.id} value={s.id}>{s.item_name} (Sisa: {s.quantity})</option>)}
              </select>
              <FormInput darkMode={darkMode} type="number" placeholder="Jumlah Tambahan Unit" value={props.additionalStockQty} onChange={props.setAdditionalStockQty} />
            </div>
            <button className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 mt-4">Injeksi Stok</button>
          </form>
        </div>

        {/* Form Distribusi Cabang */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-lg">🚚</span>
            <h3 className={`font-extrabold text-sm tracking-tight ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Distribusi Cabang</h3>
          </div>
          <form onSubmit={props.handleTransferStock} className="space-y-3">
            <select required className={`w-full rounded-xl border p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'}`} value={props.selectedStockId} onChange={(e) => props.setSelectedStockId(e.target.value)}>
              <option value="">-- Pilih Produk Pusat --</option>
              {stocks.filter(s => s.branch_id === null).map(s => <option key={s.id} value={s.id}>{s.item_name} ({s.quantity} Pcs)</option>)}
            </select>
            <select required className={`w-full rounded-xl border p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'}`} value={props.selectedBranchId} onChange={(e) => props.setSelectedBranchId(e.target.value)}>
              <option value="">-- Pilih Cabang Penerima --</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <FormInput darkMode={darkMode} type="number" placeholder="Kuantitas Transfer" value={props.transferQty} onChange={props.setTransferQty} />
            <button className="w-full mt-2 bg-purple-600 text-white p-3 rounded-xl font-bold text-sm hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95">Kirim Ke Cabang</button>
          </form>
        </div>
      </div>

      {/* Tabel Aliran Inventori dengan Deteksi Real-time Expired */}
      <div className={`p-1 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className={`font-extrabold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>📋 Active Inventory Stream</h3>
        </div>
        <div className="overflow-x-auto w-full pb-4">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-400 border-b border-slate-800' : 'text-slate-800 bg-slate-100/50 border-b border-slate-300'}`}>
                <th className="p-4">Nama Produk</th>
                <th className="p-4">Lokasi</th>
                <th className="p-4">Masa Expired</th>
                <th className="p-4">Status Kelayakan</th>
                <th className="p-4 text-right">Sisa Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 text-sm">
              {filteredStocks.map((item) => {
                let statusBadge = <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-300">Aman / Layak</span>;
                
                if (item.expired_at) {
                  const sisaHari = Math.ceil((new Date(item.expired_at) - hariIni) / (1000 * 60 * 60 * 24));
                  
                  if (sisaHari <= 0) {
                    statusBadge = <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border border-red-300">💀 Kedaluwarsa (Rugi)</span>;
                  } else if (sisaHari <= 7) {
                    // MEMPERBAIKI ESCAPING KARAKTER < UNTUK REACT COMPILATION
                    statusBadge = <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[11px] font-bold border border-amber-300">⚠️ &lt; 7 Hari Lagi</span>;
                  }
                }

                return (
                  <tr key={item.id} className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                    <td className={`p-4 font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.item_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>{item.branches?.name || '🏢 Pusat'}</span>
                    </td>
                    <td className="p-4 font-mono font-bold">{item.expired_at ? new Date(item.expired_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : 'Tanpa Expired'}</td>
                    <td className="p-4">{statusBadge}</td>
                    <td className={`p-4 text-right font-black text-base ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{item.quantity} <span className="text-xs font-semibold text-slate-500">Pcs</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- 2. KELOLA CABANG VIEW ---
export function BranchView(props) {
  const { darkMode, branchName, setBranchName, handleAddBranch, generatedToken, branches, handleDeleteBranch, handleUpdateBranch, handleToggleBranchStatus, handleRegenerateToken, editingBranchId, setEditingBranchId, editingBranchName, setEditingBranchName } = props;
  
  return (
    <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 items-start">
      
      {/* Form Registrasi Kiri */}
      <div className={`p-6 sm:p-8 rounded-3xl border w-full transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg shadow-blue-900/5 relative overflow-hidden'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="mb-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/20 text-blue-750 border border-blue-200 dark:border-transparent flex items-center justify-center text-2xl mb-4">🏢</div>
          <h3 className={`font-extrabold text-xl mb-1 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Registrasi Cabang</h3>
          <p className={`text-sm leading-relaxed font-medium ${darkMode ? 'text-slate-400' : 'text-slate-750'}`}>Tambahkan otorisasi area baru ke ekosistem multi-cabang Anda.</p>
        </div>
        
        <form onSubmit={handleAddBranch} className="space-y-4 relative z-10">
          <FormInput darkMode={darkMode} type="text" placeholder="Contoh: Cabang Sudirman" value={branchName} onChange={setBranchName} />
          <button className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-500/30">
            Rilis & Buat Token Akses
          </button>
        </form>

        {generatedToken && (
          <div className="mt-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 p-5 rounded-2xl text-center">
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>Token Otorisasi Karyawan:</p>
            <p className="text-2xl font-mono font-black tracking-widest bg-white dark:bg-slate-900 border border-emerald-400 dark:border-emerald-500/30 p-3 rounded-xl text-emerald-800 dark:text-emerald-300 shadow-inner">
              {generatedToken}
            </p>
          </div>
        )}
      </div>

      {/* Grid List Daftar Cabang Kanan */}
      <div className="lg:col-span-2 space-y-4">
         <div className="flex items-center gap-3 px-1 mb-2">
           <span className="p-2.5 bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-transparent text-indigo-700 rounded-xl">📍</span>
           <h3 className={`font-extrabold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Daftar Cabang Terdaftar</h3>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {branches.map(branch => (
             <div key={branch.id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
               <div className="flex justify-between items-start mb-5">
                 {editingBranchId === branch.id ? (
                   <div className="flex flex-col w-full gap-2">
                     <input type="text" value={editingBranchName} onChange={(e) => setEditingBranchName(e.target.value)} className={`w-full rounded-lg border p-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-400 text-slate-900 shadow-sm'}`} placeholder="Nama Cabang" />
                     <div className="flex gap-2 mt-1">
                       <button onClick={() => handleUpdateBranch(branch.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all">Simpan</button>
                       <button onClick={() => setEditingBranchId(null)} className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-300 py-2 rounded-lg text-xs font-bold transition-all">Batal</button>
                     </div>
                   </div>
                 ) : (
                   <div className="flex-1 min-w-0 pr-2">
                     <h4 className={`font-black text-lg truncate flex items-center gap-2 mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                       {branch.name}
                       <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${branch.is_active !== false ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'}`}>
                         {branch.is_active !== false ? 'Aktif' : 'Nonaktif'}
                       </span>
                     </h4>
                     <p className="font-mono text-[11px] text-blue-850 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800/50 inline-block px-2.5 py-1 rounded-lg">Token: {branch.token}</p>
                   </div>
                 )}
               </div>

               {editingBranchId !== branch.id && (
                 <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                   <button onClick={() => { setEditingBranchId(branch.id); setEditingBranchName(branch.name); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-850 border border-slate-300'}`}>✏️ Edit</button>
                   <button onClick={() => handleToggleBranchStatus(branch.id, branch.is_active !== false)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-850 border border-slate-300'}`}>{branch.is_active !== false ? '⏸️ Nonaktif' : '▶️ Aktifkan'}</button>
                   <button onClick={() => handleRegenerateToken(branch.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-amber-900/20 hover:bg-amber-900/40 text-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'}`}>🔄 Token</button>
                   <button onClick={() => handleDeleteBranch(branch.id)} className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-rose-900/20 hover:bg-rose-900/40 text-rose-400' : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300'}`}>🗑️ Hapus</button>
                 </div>
               )}
             </div>
           ))}
           
           {branches.length === 0 && (
             <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-400 dark:border-slate-700">
               <span className="text-3xl block mb-2">🏢</span>
               <p className={`font-bold text-sm ${darkMode ? 'text-slate-500' : 'text-slate-750'}`}>Belum ada cabang yang terdaftar.</p>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}

// --- 3. REKAP TUTUP BUKU VIEW ---
export function TutupBukuView({ darkMode, stocks, closingStockId, setClosingStockId, closingSoldQty, setClosingSoldQty, handleClosingReport, groupedSalesHistory, groupedExpenses, branches, formatRupiah }) {
  const cardStyle = `p-5 sm:p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`;

  return (
    <div className="space-y-6">
      {/* Form Input Rekap */}
      <div className={cardStyle}>
        <h2 className={`text-lg sm:text-xl font-black tracking-tight flex items-center gap-3 mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <span className="p-2.5 bg-teal-50 border border-teal-200 dark:bg-teal-500/20 text-teal-700 rounded-xl">📊</span> 
          Input Rekap Harian Cabang
        </h2>
        <form onSubmit={handleClosingReport} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-800'}`}>Pilih Produk</label>
            <select required className={`w-full rounded-xl border p-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'}`} value={closingStockId} onChange={(e) => setClosingStockId(e.target.value)}>
              <option value="">-- Sentuh untuk memilih --</option>
              {stocks.filter(s => s.branch_id !== null).map(s => <option key={s.id} value={s.id}>{s.item_name} ({s.branches?.name}) - Sisa: {s.quantity}</option>)}
            </select>
          </div>
          <div className="md:col-span-4">
            <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-800'}`}>Terjual (Pcs)</label>
            <FormInput darkMode={darkMode} type="number" placeholder="Jumlah unit terjual" value={closingSoldQty} onChange={setClosingSoldQty} />
          </div>
          <div className="md:col-span-3">
            <button className="w-full bg-teal-600 text-white p-3.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md shadow-teal-500/30 active:scale-95">
              Kunci Laporan
            </button>
          </div>
        </form>
      </div>

      {/* Histori Tutup Buku */}
      <div className={`p-2 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 mb-2">
          <h3 className={`font-extrabold text-base tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>📜 Histori Penutupan & Setoran</h3>
        </div>
        
        <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
          {Object.keys(groupedSalesHistory).length === 0 ? (
            <p className={`text-sm py-10 italic font-medium text-center rounded-2xl ${darkMode ? 'text-slate-400 bg-slate-800/50' : 'text-slate-750 bg-slate-50 border border-dashed border-slate-400'}`}>Belum ada riwayat transaksi tutup buku.</p>
          ) : (
            Object.keys(groupedSalesHistory).map(dateHeader => {
              const dailyOmset = groupedSalesHistory[dateHeader].reduce((sum, log) => sum + log.total_price, 0);
              const dailyExp = groupedExpenses[dateHeader] ? groupedExpenses[dateHeader].reduce((sum, exp) => sum + exp.amount, 0) : 0;
              const wajibSetor = dailyOmset - dailyExp;
              
              return (
                <div key={dateHeader} className={`p-5 rounded-2xl border transition-all hover:shadow-md ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
                  
                  {/* Tanggal & Ringkasan */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-4 border-slate-300 dark:border-slate-700/50">
                    <div className="text-xs sm:text-sm font-black text-indigo-800 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-xl border border-indigo-300 dark:border-transparent inline-flex items-center gap-2">
                      <span>🗓️</span> {dateHeader}
                    </div>
                    
                    <div className="grid grid-cols-3 md:flex md:flex-row gap-2 sm:gap-4 text-xs sm:text-sm font-bold w-full md:w-auto">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center md:items-end justify-center border border-blue-200 dark:border-blue-800/30">
                        <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-500 mb-1">Omset</span>
                        <span className="text-blue-800 dark:text-blue-400">{formatRupiah(dailyOmset)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex flex-col items-center md:items-end justify-center border border-rose-200 dark:border-rose-800/30">
                        <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-500 mb-1">Keluar</span>
                        <span className="text-rose-800 dark:text-rose-400">{formatRupiah(dailyExp)}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl flex flex-col items-center md:items-end justify-center border shadow-sm ${wajibSetor >= 0 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-red-600 text-white border-red-700'}`}>
                        <span className="text-[10px] uppercase opacity-90 mb-1 text-center font-bold">Wajib Setor</span>
                        <span className="font-black">{formatRupiah(wajibSetor)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid Item Terjual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupedSalesHistory[dateHeader].map(log => (
                      <div key={log.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all hover:-translate-y-0.5 hover:shadow-sm ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300 shadow-sm'}`}>
                        <div className="min-w-0 flex-1 pr-2">
                          <p className={`font-black text-sm truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{log.item_name}</p>
                          <p className="text-[11px] font-semibold text-slate-650 dark:text-slate-500 mt-0.5 truncate flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-1.5"></span>
                            {branches.find(b => b.id === log.branch_id)?.name || 'Cabang'}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-emerald-700 dark:text-emerald-500 font-black text-sm">+{formatRupiah(log.total_price)}</p>
                          <p className={`text-[11px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${darkMode ? 'text-slate-400 bg-slate-800' : 'text-slate-800 bg-slate-200 border border-slate-300'}`}>{log.quantity_sold} Pcs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// --- 4. EXPENSES CENTER VIEW (GALERI NOTA OPERASIONAL) ---
export function ExpensesView({ darkMode, groupedExpenses, formatRupiah }) {
  return (
    <div className={`p-5 sm:p-8 rounded-3xl border space-y-8 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <span className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-500/20 text-rose-700 rounded-xl">🧾</span> 
          Dedicated Expenses Center
        </h2>
        <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-slate-500' : 'text-slate-700'}`}>Galeri bukti fisik nota pengeluaran operasional seluruh cabang.</p>
      </div>

      {Object.keys(groupedExpenses).length === 0 ? (
        <div className="py-16 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-400 dark:border-slate-700">
          <span className="text-4xl block mb-3">📁</span>
          <p className={`font-bold ${darkMode ? 'text-slate-500' : 'text-slate-750'}`}>Belum ada berkas operasional pada periode ini.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(groupedExpenses).map(dateHeader => (
            <div key={dateHeader} className="space-y-4">
              <div className="sticky top-20 z-10 inline-block">
                <div className="text-xs sm:text-sm font-black text-rose-800 dark:text-rose-400 bg-rose-100/90 dark:bg-rose-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800/50 shadow-sm flex items-center gap-2">
                  <span>📌</span> {dateHeader}
                </div>
              </div>

              {/* Grid Bukti Nota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2">
                {groupedExpenses[dateHeader].map(exp => (
                  <div key={exp.id} className={`group flex flex-col rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode ? 'bg-slate-950 border-slate-800 hover:shadow-rose-900/20' : 'bg-white border-slate-300 hover:shadow-rose-500/10 overflow-hidden shadow-sm'}`}>
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-300 dark:border-blue-800/50 truncate max-w-[60%]">
                          {exp.branches?.name || 'Gudang Pusat'}
                        </span>
                        <span className="text-rose-800 dark:text-rose-400 text-sm font-black bg-rose-100 border border-rose-200 dark:border-transparent dark:bg-rose-900/20 px-2 py-1 rounded-md">
                          {formatRupiah(exp.amount)}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold leading-relaxed line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                        "{exp.notes || 'Pengeluaran tanpa keterangan'}"
                      </p>
                    </div>

                    {/* Nota Contain Layout Anti Gunting */}
                    <div className="relative p-3 bg-slate-100 dark:bg-slate-900/50 flex-1 flex items-center justify-center min-h-[160px]">
                      <img 
                        src={exp.image_url} 
                        alt="Bukti Nota" 
                        className="w-full h-auto max-h-48 object-contain rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 5. SETTING VIEW (PROFIL & STATISTIK AKUMULASI AKUN) ---
export function SettingView({ darkMode, admin, branches, totalOmset, labaBersih, formatRupiah, profileName, setProfileName, profileAddress, setProfileAddress, newPassword, setNewPassword, handleUpdateProfile, handleChangePassword }) {
  const cardStyle = `p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`;
  const inputStyle = `w-full rounded-xl border p-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-600 shadow-sm'}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cards Ringkasan Akumulasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-2xl border flex flex-col justify-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
          <div className="text-slate-700 dark:text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><span>🏢</span> Total Cabang Aktif</div>
          <div className={`text-3xl font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{branches?.length || 0} <span className="text-base font-bold text-slate-600">Lokasi</span></div>
        </div>
        <div className={`p-6 rounded-2xl border flex flex-col justify-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
          <div className="text-slate-700 dark:text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><span>💰</span> Akumulasi Omset</div>
          <div className={`text-3xl font-black ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{formatRupiah(totalOmset || 0)}</div>
        </div>
        <div className={`p-6 rounded-2xl border flex flex-col justify-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
          <div className="text-slate-700 dark:text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><span>📈</span> Akumulasi Keuntungan</div>
          <div className={`text-3xl font-black ${labaBersih >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{formatRupiah(labaBersih || 0)}</div>
        </div>
      </div>

      {/* Grid Panel Manajemen Informasi Profil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Profil Utama */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 dark:border-transparent dark:bg-blue-900/30 text-blue-700 flex items-center justify-center text-2xl">👤</div>
            <div>
              <h3 className={`font-extrabold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Informasi Profil</h3>
              <p className={`text-xs font-medium ${darkMode ? 'text-slate-500' : 'text-slate-700'}`}>Sesuaikan identitas operasional bisnis multi-cabang Anda.</p>
            </div>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase ${darkMode ? 'text-slate-500' : 'text-slate-800'}`}>Email Akun (Terkunci)</label>
              <input type="email" disabled value={admin?.email || ''} className={`${inputStyle} opacity-60 cursor-not-allowed`} />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase ${darkMode ? 'text-slate-500' : 'text-slate-800'}`}>Nama Bisnis / Usaha</label>
              <input type="text" required value={profileName || ''} onChange={(e) => setProfileName(e.target.value)} className={inputStyle} placeholder="Nama Bisnis" />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase ${darkMode ? 'text-slate-500' : 'text-slate-800'}`}>Alamat Pusat</label>
              <textarea rows="3" value={profileAddress || ''} onChange={(e) => setProfileAddress(e.target.value)} className={inputStyle} placeholder="Alamat lengkap pusat operasional..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95">Simpan Perubahan Profil</button>
          </form>
        </div>

        {/* Form Keamanan Sandi */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 dark:border-transparent dark:bg-amber-900/30 text-amber-700 flex items-center justify-center text-2xl">🔐</div>
            <div>
              <h3 className={`font-extrabold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Keamanan Akun</h3>
              <p className={`text-xs font-medium ${darkMode ? 'text-slate-500' : 'text-slate-700'}`}>Perbarui kata sandi konsol admin Anda secara berkala.</p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase ${darkMode ? 'text-slate-500' : 'text-slate-800'}`}>Kata Sandi Baru</label>
              <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputStyle} placeholder="Masukkan kata sandi baru..." />
              <p className={`text-[11px] mt-2 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Pastikan kata sandi baru Anda rumit dan tidak mudah ditebak orang lain.</p>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 active:scale-95">Perbarui Kata Sandi</button>
          </form>
        </div>
      </div>
    </div>
  );
}