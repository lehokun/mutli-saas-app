'use client';

// Clean Code Helper Component (Dioptimalkan untuk Touch Screen Smartphone)
const FormInput = ({ type, placeholder, value, onChange, required = true, darkMode }) => (
  <input 
    type={type} 
    placeholder={placeholder} 
    required={required}
    className={`w-full rounded-xl border p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-black placeholder-slate-400'}`}
    value={value ?? ''} 
    onChange={(e) => onChange(e.target.value)}
  />
);

export function HomeView(props) {
  const { darkMode, totalOmset, labaBersih, totalPengeluaran, chartData, maxChartOmset, formatRupiah, stocks, branches, filteredStocks } = props;

  // Gaya standar untuk kartu premium
  const cardStyle = `relative overflow-hidden p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${darkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-100 shadow-sm'}`;

  return (
    <div className="space-y-6">
      
      {/* --- ROW 1: METRIK & GRAFIK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Metric Cards (Kiri) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Omset */}
          <div className={cardStyle}>
            <div className="flex items-start justify-between">
              <div className="z-10 relative">
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Omset Terfilter</p>
                <h4 className={`text-2xl sm:text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{formatRupiah(totalOmset)}</h4>
              </div>
              <div className={`p-3 rounded-xl shrink-0 ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Card 2: Laba Bersih */}
          <div className={cardStyle}>
            <div className="flex items-start justify-between">
              <div className="z-10 relative">
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Laba Bersih</p>
                <h4 className={`text-2xl sm:text-3xl font-black tracking-tight ${labaBersih >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{formatRupiah(labaBersih)}</h4>
              </div>
              <div className={`p-3 rounded-xl shrink-0 ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Card 3: Pengeluaran */}
          <div className={cardStyle}>
            <div className="flex items-start justify-between">
              <div className="z-10 relative">
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pengeluaran</p>
                <h4 className={`text-2xl sm:text-3xl font-black tracking-tight text-rose-500`}>{formatRupiah(totalPengeluaran)}</h4>
              </div>
              <div className={`p-3 rounded-xl shrink-0 ${darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* Chart Card (Kanan) */}
        <div className={`lg:col-span-4 p-5 sm:p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-xs uppercase tracking-widest">Tren Omset (7 Hari)</h3>
            <span className="text-xl">📈</span>
          </div>
          <div className="flex items-end justify-between h-24 gap-1 sm:gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group relative h-full justify-end cursor-pointer">
                <div className="absolute -top-10 bg-slate-800 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                  {formatRupiah(data.omset)}
                </div>
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300" style={{ height: `${(data.omset / maxChartOmset) * 100}%`, minHeight: '8px' }}></div>
                <span className="text-[9px] sm:text-[10px] mt-2 font-bold text-slate-400 uppercase">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ROW 2: FORMS (Grid dioptimalkan untuk Tablet & Desktop) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Form 1 */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><span className="text-lg">📦</span></div>
            <h3 className="font-extrabold text-sm tracking-tight">Daftarkan Produk</h3>
          </div>
          <form onSubmit={props.handleAddStock} className="space-y-3">
            <FormInput darkMode={darkMode} type="text" placeholder="Nama Produk Baru" value={props.itemName} onChange={props.setItemName} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput darkMode={darkMode} type="number" placeholder="Stok Awal" value={props.quantity} onChange={props.setQuantity} />
              <FormInput darkMode={darkMode} type="number" placeholder="HPP (Rp)" value={props.hpp} onChange={props.setHpp} />
            </div>
            <FormInput darkMode={darkMode} type="number" placeholder="Harga Jual (Rp)" value={props.hargaJual} onChange={props.setHargaJual} />
            <button className="w-full mt-2 bg-blue-600 text-white p-3 rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">Simpan Produk Baru</button>
          </form>
        </div>

        {/* Form 2 */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"><span className="text-lg">💎</span></div>
            <h3 className="font-extrabold text-sm tracking-tight text-indigo-600 dark:text-indigo-400">Tambah Stok Jadi</h3>
          </div>
          <form onSubmit={props.handleAddExistingStock} className="space-y-3 flex flex-col h-[calc(100%-3rem)] justify-between">
            <div className="space-y-3">
              <select required className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-black'}`} value={props.selectedExistingStockId} onChange={(e) => props.setSelectedExistingStockId(e.target.value)}>
                <option value="">-- Pilih Produk Pusat --</option>
                {stocks.filter(s => s.branch_id === null).map(s => <option key={s.id} value={s.id}>{s.item_name} (Sisa: {s.quantity})</option>)}
              </select>
              <FormInput darkMode={darkMode} type="number" placeholder="Jumlah Tambahan Unit" value={props.additionalStockQty} onChange={props.setAdditionalStockQty} />
            </div>
            <button className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 mt-4">Injeksi Stok</button>
          </form>
        </div>

        {/* Form 3 */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"><span className="text-lg">🚚</span></div>
            <h3 className="font-extrabold text-sm tracking-tight text-purple-600 dark:text-purple-400">Distribusi Cabang</h3>
          </div>
          <form onSubmit={props.handleTransferStock} className="space-y-3">
            <select required className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-black'}`} value={props.selectedStockId} onChange={(e) => props.setSelectedStockId(e.target.value)}>
              <option value="">-- Pilih Produk Pusat --</option>
              {stocks.filter(s => s.branch_id === null).map(s => <option key={s.id} value={s.id}>{s.item_name} ({s.quantity} Pcs)</option>)}
            </select>
            <select required className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-black'}`} value={props.selectedBranchId} onChange={(e) => props.setSelectedBranchId(e.target.value)}>
              <option value="">-- Pilih Cabang Penerima --</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <FormInput darkMode={darkMode} type="number" placeholder="Kuantitas Transfer" value={props.transferQty} onChange={props.setTransferQty} />
            <button className="w-full mt-2 bg-purple-600 text-white p-3 rounded-xl font-bold text-sm hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95">Kirim Ke Cabang</button>
          </form>
        </div>
      </div>

      {/* --- ROW 3: TABLE STREAM --- */}
      <div className={`p-1 rounded-3xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
            <span className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-lg">📋</span> Active Inventory Stream
          </h3>
        </div>
        <div className="overflow-x-auto w-full pb-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400 bg-slate-50/50'}`}>
                <th className="p-4 sm:px-6">Nama Produk</th>
                <th className="p-4 sm:px-6">Lokasi / Cabang</th>
                <th className="p-4 sm:px-6">Harga Jual</th>
                <th className="p-4 sm:px-6 text-right">Sisa Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
              {filteredStocks.map((item) => (
                <tr key={item.id} className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <td className="p-4 sm:px-6 font-bold flex items-center gap-2">
                    {item.item_name}
                    {item.quantity === 0 ? (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider animate-pulse">🚨 Habis</span>
                    ) : item.quantity <= 5 ? (
                      <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider animate-pulse">⚠️ Tipis</span>
                    ) : null}
                  </td>
                  <td className="p-4 sm:px-6">
                    <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${item.branches?.name ? 'bg-indigo-50 border-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400' : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}>
                      {item.branches?.name || '🏢 Gudang Pusat'}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatRupiah(item.harga_jual)}</td>
                  <td className="p-4 sm:px-6 text-right font-black text-blue-600 dark:text-blue-400 text-base">{item.quantity} <span className="text-xs font-semibold text-slate-400">Pcs</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function BranchView(props) {
  const { darkMode, branchName, setBranchName, handleAddBranch, generatedToken, branches, handleDeleteBranch, handleUpdateBranch, handleToggleBranchStatus, handleRegenerateToken, editingBranchId, setEditingBranchId, editingBranchName, setEditingBranchName } = props;
  
  return (
    <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 items-start">
      
      {/* Form Registrasi Cabang Kiri */}
      <div className={`p-6 sm:p-8 rounded-3xl border w-full transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg shadow-blue-900/5 relative overflow-hidden'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="mb-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center text-2xl mb-4">🏢</div>
          <h3 className="font-extrabold text-xl mb-1 tracking-tight">Registrasi Cabang Baru</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Tambahkan otorisasi area baru ke ekosistem multi-cabang Anda.</p>
        </div>
        
        <form onSubmit={handleAddBranch} className="space-y-4 relative z-10">
          <FormInput darkMode={darkMode} type="text" placeholder="Contoh: Cabang Sudirman" value={branchName} onChange={setBranchName} />
          <button className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-500/30">
            Rilis & Buat Token Akses
          </button>
        </form>

        {generatedToken && (
          <div className="mt-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-5 rounded-2xl text-center animate-fade-in">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-2 uppercase tracking-wider">Token Otorisasi Karyawan:</p>
            <p className="text-2xl font-mono font-black tracking-widest bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/30 p-3 rounded-xl text-emerald-700 dark:text-emerald-300 shadow-inner">
              {generatedToken}
            </p>
          </div>
        )}
      </div>

      {/* List Daftar Cabang Kanan */}
      <div className="lg:col-span-2 space-y-4">
         <div className="flex items-center gap-3 px-1 mb-2">
           <span className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 rounded-xl">📍</span>
           <h3 className="font-extrabold text-xl tracking-tight">Daftar Cabang Aktif</h3>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {branches.map(branch => (
             <div key={branch.id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
               <div className="flex justify-between items-start mb-5">
                 {editingBranchId === branch.id ? (
                   <div className="flex flex-col w-full gap-2">
                     <input type="text" value={editingBranchName} onChange={(e) => setEditingBranchName(e.target.value)} className={`w-full rounded-lg border p-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'}`} placeholder="Nama Cabang" />
                     <div className="flex gap-2 mt-1">
                       <button onClick={() => handleUpdateBranch(branch.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold transition-all">Simpan</button>
                       <button onClick={() => setEditingBranchId(null)} className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-xs font-bold transition-all">Batal</button>
                     </div>
                   </div>
                 ) : (
                   <div className="flex-1 min-w-0 pr-2">
                     <h4 className="font-black text-lg truncate flex items-center gap-2 mb-1">
                       {branch.name}
                       <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${branch.is_active !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20'}`}>
                         {branch.is_active !== false ? 'Aktif' : 'Nonaktif'}
                       </span>
                     </h4>
                     <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 inline-block px-2.5 py-1 rounded-lg">Token: {branch.token}</p>
                   </div>
                 )}
               </div>

               {editingBranchId !== branch.id && (
                 <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                   <button onClick={() => { setEditingBranchId(branch.id); setEditingBranchName(branch.name); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>✏️ Edit</button>
                   <button onClick={() => handleToggleBranchStatus(branch.id, branch.is_active !== false)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>{branch.is_active !== false ? '⏸️ Nonaktif' : '▶️ Aktifkan'}</button>
                   <button onClick={() => handleRegenerateToken(branch.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-amber-900/20 hover:bg-amber-900/40 text-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-600'}`}>🔄 Token</button>
                   <button onClick={() => handleDeleteBranch(branch.id)} className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${darkMode ? 'bg-rose-900/20 hover:bg-rose-900/40 text-rose-400' : 'bg-rose-50 hover:bg-rose-100 text-rose-600'}`}>🗑️ Hapus</button>
                 </div>
               )}
             </div>
           ))}
           
           {branches.length === 0 && (
             <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
               <span className="text-3xl block mb-2">🏢</span>
               <p className="text-slate-500 font-medium text-sm">Belum ada cabang yang terdaftar.</p>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}

export function TutupBukuView({ darkMode, stocks, closingStockId, setClosingStockId, closingSoldQty, setClosingSoldQty, handleClosingReport, groupedSalesHistory, groupedExpenses, branches, formatRupiah }) {
  return (
    <div className="space-y-6">
      {/* Form Input Tutup Buku */}
      <div className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-3 mb-6">
          <span className="p-2.5 bg-teal-100 dark:bg-teal-500/20 text-teal-600 rounded-xl">📊</span> 
          Input Rekap Harian Cabang
        </h2>
        <form onSubmit={handleClosingReport} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Pilih Produk</label>
            <select required className={`w-full rounded-xl border p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-black'}`} value={closingStockId} onChange={(e) => setClosingStockId(e.target.value)}>
              <option value="">-- Sentuh untuk memilih --</option>
              {stocks.filter(s => s.branch_id !== null).map(s => <option key={s.id} value={s.id}>{s.item_name} ({s.branches?.name}) - Sisa: {s.quantity}</option>)}
            </select>
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Terjual (Pcs)</label>
            <FormInput darkMode={darkMode} type="number" placeholder="Jumlah unit terjual" value={closingSoldQty} onChange={setClosingSoldQty} />
          </div>
          <div className="md:col-span-3">
            <button className="w-full bg-teal-600 text-white p-3.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md shadow-teal-500/30 active:scale-95">
              Kunci Laporan
            </button>
          </div>
        </form>
      </div>

      {/* Histori Cards */}
      <div className={`p-2 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 mb-2">
          <h3 className="font-extrabold text-base tracking-tight">📜 Histori Penutupan & Setoran</h3>
        </div>
        
        <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
          {Object.keys(groupedSalesHistory).length === 0 ? (
            <p className="text-slate-400 text-sm py-10 italic text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl">Belum ada riwayat transaksi tutup buku.</p>
          ) : (
            Object.keys(groupedSalesHistory).map(dateHeader => {
              const dailyOmset = groupedSalesHistory[dateHeader].reduce((sum, log) => sum + log.total_price, 0);
              const dailyExp = groupedExpenses[dateHeader] ? groupedExpenses[dateHeader].reduce((sum, exp) => sum + exp.amount, 0) : 0;
              const wajibSetor = dailyOmset - dailyExp;
              
              return (
                <div key={dateHeader} className={`p-5 rounded-2xl border transition-all hover:shadow-md ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/70 border-slate-200'}`}>
                  
                  {/* Tanggal & Ringkasan */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-4 border-slate-200 dark:border-slate-700/50">
                    <div className="text-xs sm:text-sm font-black text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-xl inline-flex items-center gap-2">
                      <span>🗓️</span> {dateHeader}
                    </div>
                    
                    <div className="grid grid-cols-3 md:flex md:flex-row gap-2 sm:gap-4 text-xs sm:text-sm font-bold w-full md:w-auto">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center md:items-end justify-center border border-blue-100 dark:border-blue-800/30">
                        <span className="text-[10px] uppercase text-slate-500 mb-1">Omset</span>
                        <span className="text-blue-600 dark:text-blue-400">{formatRupiah(dailyOmset)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex flex-col items-center md:items-end justify-center border border-rose-100 dark:border-rose-800/30">
                        <span className="text-[10px] uppercase text-slate-500 mb-1">Keluar</span>
                        <span className="text-rose-600 dark:text-rose-400">{formatRupiah(dailyExp)}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl flex flex-col items-center md:items-end justify-center border shadow-sm ${wajibSetor >= 0 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-red-500 text-white border-red-600'}`}>
                        <span className="text-[10px] uppercase opacity-80 mb-1 text-center">Wajib Setor</span>
                        <span className="font-black">{formatRupiah(wajibSetor)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid Item Terjual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupedSalesHistory[dateHeader].map(log => (
                      <div key={log.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all hover:-translate-y-0.5 hover:shadow-sm ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-black text-sm truncate">{log.item_name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>
                            {branches.find(b => b.id === log.branch_id)?.name || 'Cabang'}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-emerald-500 font-black text-sm">+{formatRupiah(log.total_price)}</p>
                          <p className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md mt-1 inline-block">{log.quantity_sold} Pcs</p>
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

export function ExpensesView({ darkMode, groupedExpenses, formatRupiah }) {
  return (
    <div className={`p-5 sm:p-8 rounded-3xl border space-y-8 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3">
          <span className="p-3 bg-rose-100 dark:bg-rose-500/20 text-rose-600 rounded-xl">🧾</span> 
          Dedicated Expenses Center
        </h2>
        <p className="text-sm text-slate-500 mt-2">Galeri nota fisik pengeluaran operasional cabang.</p>
      </div>

      {Object.keys(groupedExpenses).length === 0 ? (
        <div className="py-16 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <span className="text-4xl block mb-3">📁</span>
          <p className="text-slate-500 font-medium">Belum ada berkas pengeluaran pada periode ini.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(groupedExpenses).map(dateHeader => (
            <div key={dateHeader} className="space-y-4">
              {/* Sticky Header Tanggal */}
              <div className="sticky top-20 z-10 inline-block">
                <div className="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-800/50 shadow-sm flex items-center gap-2">
                  <span>📌</span> {dateHeader}
                </div>
              </div>

              {/* Grid Nota Modern */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2">
                {groupedExpenses[dateHeader].map(exp => (
                  <div key={exp.id} className={`group flex flex-col rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode ? 'bg-slate-950 border-slate-800 hover:shadow-rose-900/20' : 'bg-white border-slate-200 hover:shadow-rose-500/10 overflow-hidden'}`}>
                    
                    {/* Header Card Nota */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-800/50 truncate max-w-[60%]">
                          {exp.branches?.name || 'Cabang'}
                        </span>
                        <span className="text-rose-600 dark:text-rose-400 text-sm font-black bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                          {formatRupiah(exp.amount)}
                        </span>
                      </div>
                      <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        "{exp.notes || 'Pengeluaran tanpa keterangan'}"
                      </p>
                    </div>

                    {/* Image Area - Object Contain agar tidak terpotong */}
                    <div className="relative p-3 bg-slate-50 dark:bg-slate-900/50 flex-1 flex items-center justify-center min-h-[160px]">
                      <img 
                        src={exp.image_url} 
                        alt="Bukti Nota" 
                        className="w-full h-auto max-h-48 object-contain rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-transform duration-500 group-hover:scale-105" 
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

export function SettingView() {
  return (
    <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-xl text-white">
      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6 backdrop-blur-sm">🚀</div>
      <h3 className="font-black text-2xl tracking-tight mb-2">Sistem Arsitektur Multi-Tenant</h3>
      <p className="text-indigo-100 text-sm max-w-xl leading-relaxed mb-6">
        Platform SaaS berjalan normal dengan arsitektur modular yang terisolasi. Data finansial dan stok Anda dilindungi oleh enkripsi RLS tingkat militer dari Supabase.
      </p>
      <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95">
        Lihat Log Aktivitas Keamanan
      </button>
    </div>
  );
}