import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { adminService } from '../services/adminService';

export function useAdminDashboard() {
  const router = useRouter();
  
  // Layout & UI States
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('home');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [admin, setAdmin] = useState(null);
  const [branches, setBranches] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [groupedSalesHistory, setGroupedSalesHistory] = useState({});
  
  // Filter States
  const [filterBranchId, setFilterBranchId] = useState('');
  const [filterTimeframe, setFilterTimeframe] = useState('all');

  // Forms States - Kelola Cabang
  const [branchName, setBranchName] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [editingBranchName, setEditingBranchName] = useState('');

  // Forms States - Tambah Produk Baru
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [hpp, setHpp] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [expiredDate, setExpiredDate] = useState(''); // 🔥 PERBAIKAN: State ini yang kurang sebelumnya

  // Forms States - Tambah Stok Pusat
  const [selectedExistingStockId, setSelectedExistingStockId] = useState('');
  const [additionalStockQty, setAdditionalStockQty] = useState('');

  // Forms States - Distribusi Cabang
  const [selectedStockId, setSelectedStockId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [transferQty, setTransferQty] = useState('');

  // Forms States - Rekap Tutup Buku
  const [closingStockId, setClosingStockId] = useState('');
  const [closingSoldQty, setClosingSoldQty] = useState('');

  // Profile & Settings States
  const [profileName, setProfileName] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Load Data Initial
  const loadDashboardData = useCallback(async () => {
    try {
      const user = await adminService.getAdminUser();
      if (!user) return router.push('/login');
      
      setAdmin(user);
      setProfileName(user?.user_metadata?.business_name || user?.user_metadata?.name || '');
      setProfileAddress(user?.user_metadata?.address || '');

      const [branchesData, stocksData, expensesData, salesData] = await Promise.all([
        adminService.fetchBranches(user.id),
        adminService.fetchStocks(user.id),
        adminService.fetchExpenses(user.id),
        adminService.fetchSalesHistory(user.id)
      ]);

      setBranches(branchesData);
      setStocks(stocksData);

      // Group Expenses by Date
      const expGrouped = expensesData.reduce((acc, exp) => {
        const date = new Date(exp.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(exp);
        return acc;
      }, {});
      setGroupedExpenses(expGrouped);

      // Group Sales History by Date
      const salesGrouped = salesData.reduce((acc, log) => {
        const date = new Date(log.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(log);
        return acc;
      }, {});
      setGroupedSalesHistory(salesGrouped);

    } catch (error) {
      console.error("Gagal memuat data:", error);
      if (error.message.includes('JWT')) router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

  // Utility Functions
  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  const getUserInitials = () => {
    const name = admin?.user_metadata?.business_name || admin?.user_metadata?.name || admin?.email || "A";
    return name.substring(0, 2).toUpperCase();
  };
  const getUserDisplayName = () => admin?.user_metadata?.business_name || admin?.user_metadata?.name || admin?.email || "Administrator";

  // Data Filtering (Memoized for performance)
  const isWithinTimeframe = (dateString, timeframe) => {
    if (timeframe === 'all') return true;
    const date = new Date(dateString);
    const now = new Date();
    if (timeframe === 'today') return date.toDateString() === now.toDateString();
    if (timeframe === 'week') {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= lastWeek;
    }
    if (timeframe === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    return true;
  };

  const filteredStocks = useMemo(() => stocks.filter(s => filterBranchId ? s.branch_id === filterBranchId : true), [stocks, filterBranchId]);
  
  const filteredSalesHistoryFlat = useMemo(() => {
    const flatSales = Object.values(groupedSalesHistory).flat();
    return flatSales.filter(s => {
      const matchBranch = filterBranchId ? s.branch_id === filterBranchId : true;
      const matchTime = isWithinTimeframe(s.created_at, filterTimeframe);
      return matchBranch && matchTime;
    });
  }, [groupedSalesHistory, filterBranchId, filterTimeframe]);

  const filteredExpenses = useMemo(() => {
    const flatExp = Object.values(groupedExpenses).flat();
    return flatExp.filter(e => {
      const matchBranch = filterBranchId ? e.branch_id === filterBranchId : true;
      const matchTime = isWithinTimeframe(e.created_at, filterTimeframe);
      return matchBranch && matchTime;
    });
  }, [groupedExpenses, filterBranchId, filterTimeframe]);

  // Calculations
  const totalOmset = filteredSalesHistoryFlat.reduce((sum, log) => sum + log.total_price, 0);
  const totalPengeluaran = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // 🔥 PERBAIKAN: Hitung Kerugian Expired di dalam Hook
  const hariIni = new Date();
  const totalKerugianExpired = filteredStocks.reduce((acc, item) => {
    if (item.expired_at && new Date(item.expired_at) < hariIni && item.quantity > 0) {
      return acc + (item.quantity * item.hpp);
    }
    return acc;
  }, 0);

  // Kurangi laba bersih dengan total pengeluaran dan kerugian expired
  const labaBersih = totalOmset - filteredSalesHistoryFlat.reduce((sum, log) => sum + log.total_hpp, 0) - totalPengeluaran - totalKerugianExpired;

  // Chart Data Preparation (7 Days)
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      
      let dailyOmset = 0;
      if (groupedSalesHistory[dateStr]) {
        dailyOmset = groupedSalesHistory[dateStr].reduce((sum, log) => {
          if (!filterBranchId || log.branch_id === filterBranchId) return sum + log.total_price;
          return sum;
        }, 0);
      }
      data.push({ day: dayName, dateStr, omset: dailyOmset });
    }
    return data;
  }, [groupedSalesHistory, filterBranchId]);
  
  const maxChartOmset = Math.max(...chartData.map(d => d.omset), 100000);

  // --- Handlers: Branch Management ---
  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!branchName.trim()) return alert("Nama cabang tidak boleh kosong!");
    const tokenBaru = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      await adminService.addBranch(branchName, admin.id, tokenBaru);
      setGeneratedToken(tokenBaru);
      setBranchName('');
      loadDashboardData();
    } catch (error) { alert("Gagal menambah cabang: " + error.message); }
  };

  const handleUpdateBranch = async (id) => {
    if (!editingBranchName.trim()) return alert("Nama tidak boleh kosong!");
    try {
      await adminService.updateBranch(id, { name: editingBranchName });
      setEditingBranchId(null);
      loadDashboardData();
    } catch (error) { alert("Gagal mengupdate cabang: " + error.message); }
  };

  const handleDeleteBranch = async (id) => {
    if (!window.confirm("Yakin hapus cabang ini? Seluruh data yang terkait akan terhapus secara permanen.")) return;
    try {
      await adminService.deleteBranch(id);
      loadDashboardData();
    } catch (error) { alert("Gagal menghapus cabang: " + error.message); }
  };

  const handleToggleBranchStatus = async (id, currentStatus) => {
    try {
      await adminService.updateBranch(id, { is_active: !currentStatus });
      loadDashboardData();
    } catch (error) { alert("Gagal merubah status cabang: " + error.message); }
  };

  const handleRegenerateToken = async (id) => {
    if (!window.confirm("Yakin ingin mengganti token? Token lama tidak bisa dipakai lagi oleh karyawan cabang.")) return;
    const tokenBaru = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      await adminService.updateBranch(id, { token: tokenBaru });
      alert(`Token Baru: ${tokenBaru}\n\nSilakan berikan ke karyawan Anda.`);
      loadDashboardData();
    } catch (error) { alert("Gagal membuat token baru: " + error.message); }
  };

  // --- Handlers: Stock Management ---
  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      // 🔥 PERBAIKAN: Menyertakan parameter expiredDate ke fungsi adminService (jika adminService mensupportnya, kita modifikasi manual query-nya disini sementara untuk amannya)
      const cleanName = itemName.trim();
      const qty = parseInt(quantity);
      const cost = parseInt(hpp);
      const price = parseInt(hargaJual);

      if (!cleanName || isNaN(qty) || isNaN(cost) || isNaN(price)) {
        throw new Error("Data tidak valid: Pastikan nama dan angka diisi benar.");
      }

      const { data: existingProduct, error: checkError } = await supabase
        .from('stocks')
        .select('id')
        .ilike('item_name', cleanName) 
        .is('branch_id', null)
        .eq('admin_id', admin.id)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingProduct) {
        throw new Error("Produk sudah ada di Gudang Pusat! Gunakan menu 'Tambah Stok Barang Jadi'.");
      }

      const { error } = await supabase.from('stocks').insert({
        item_name: cleanName,
        quantity: qty,
        hpp: cost,
        harga_jual: price,
        admin_id: admin.id,
        branch_id: null,
        expired_at: expiredDate || null // Menambahkan tanggal expired ke DB
      });
      
      if (error) throw error;
      
      alert("Produk berhasil didaftarkan!");
      setItemName(''); setQuantity(''); setHpp(''); setHargaJual(''); setExpiredDate('');
      loadDashboardData();
    } catch (error) { alert("Gagal: " + error.message); }
  };

  const handleAddExistingStock = async (e) => {
    e.preventDefault();
    if (!selectedExistingStockId || !additionalStockQty) return alert("Pilih produk dan isi jumlah!");
    try {
      const stock = stocks.find(s => s.id.toString() === selectedExistingStockId);
      await adminService.addExistingStockQty(selectedExistingStockId, stock.quantity, additionalStockQty);
      alert("Stok berhasil ditambahkan!");
      setSelectedExistingStockId(''); setAdditionalStockQty('');
      loadDashboardData();
    } catch (error) { alert("Gagal: " + error.message); }
  };

  const handleTransferStock = async (e) => {
    e.preventDefault();
    const qty = parseInt(transferQty);
    if (!selectedStockId || !selectedBranchId || isNaN(qty) || qty <= 0) return alert("Isi form dengan benar!");
    
    const targetStock = stocks.find(s => s.id.toString() === selectedStockId);
    if (qty > targetStock.quantity) return alert("Sisa stok pusat tidak cukup!");
    
    try {
      const existStock = stocks.find(s => s.branch_id === selectedBranchId && s.item_name === targetStock.item_name);
      await adminService.executeStockTransfer(targetStock, selectedBranchId, qty, existStock, admin.id);
      alert("Distribusi berhasil!");
      setSelectedStockId(''); setSelectedBranchId(''); setTransferQty('');
      loadDashboardData();
    } catch (error) { alert("Gagal: " + error.message); }
  };

  const handleClosingReport = async (e) => {
    e.preventDefault();
    const soldQty = parseInt(closingSoldQty);
    if (!closingStockId || isNaN(soldQty) || soldQty <= 0) return alert("Isi jumlah terjual dengan benar!");
    
    const targetStock = stocks.find(s => s.id.toString() === closingStockId);
    if (soldQty > targetStock.quantity) return alert("Penjualan melebihi sisa stok!");

    try {
      const { calculatedRemainingQty, calculatedSoldQty } = await adminService.executeClosingReport(targetStock, soldQty);
      
      const updatedStocks = stocks.map(s => s.id.toString() === closingStockId ? { ...s, quantity: calculatedRemainingQty, sold_quantity: calculatedSoldQty } : s);
      setStocks(updatedStocks);
      
      const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const newLog = {
        id: Date.now(), branch_id: targetStock.branch_id, item_name: targetStock.item_name,
        quantity_sold: soldQty, total_price: soldQty * targetStock.harga_jual,
        created_at: new Date().toISOString()
      };
      
      const updatedHistory = { ...groupedSalesHistory };
      if (!updatedHistory[todayStr]) updatedHistory[todayStr] = [];
      updatedHistory[todayStr] = [newLog, ...updatedHistory[todayStr]];
      
      setClosingStockId(''); setClosingSoldQty('');
      setGroupedSalesHistory(updatedHistory);
      alert('Tutup buku harian sukses!');
    } catch (err) { alert("Gagal: " + err.message); }
  };

  // --- Handlers: Settings & Auth ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({
        data: { business_name: profileName, address: profileAddress }
      });
      if (error) throw error;
      alert('Profil berhasil diperbarui!');
    } catch (err) { alert('Gagal memperbarui profil: ' + err.message); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert('Kata sandi minimal 6 karakter');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert('Kata sandi berhasil diubah! Silakan gunakan sandi baru untuk sesi berikutnya.');
      setNewPassword('');
    } catch (err) { alert('Gagal mengubah sandi: ' + err.message); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    darkMode, setDarkMode, isSidebarOpen, setIsSidebarOpen, currentMenu, setCurrentMenu, loading,
    admin, branches, stocks, filterBranchId, setFilterBranchId, filterTimeframe, setFilterTimeframe,
    filteredStocks, totalOmset, totalPengeluaran, labaBersih, chartData, maxChartOmset, router,
    groupedExpenses, groupedSalesHistory, formatRupiah, getUserInitials, getUserDisplayName,
    branchName, setBranchName, generatedToken, itemName, setItemName, quantity, setQuantity,
    hpp, setHpp, hargaJual, setHargaJual, selectedExistingStockId, setSelectedExistingStockId,
    additionalStockQty, setAdditionalStockQty, selectedStockId, setSelectedStockId,
    selectedBranchId, setSelectedBranchId, transferQty, setTransferQty, closingStockId,
    setClosingStockId, closingSoldQty, setClosingSoldQty, filteredExpenses,
    editingBranchId, setEditingBranchId, editingBranchName, setEditingBranchName,
    profileName, setProfileName, profileAddress, setProfileAddress, newPassword, setNewPassword,
    handleAddBranch, handleDeleteBranch, handleUpdateBranch, handleToggleBranchStatus, handleRegenerateToken,
    handleAddStock, handleAddExistingStock, handleTransferStock, handleClosingReport, handleLogout,
    handleUpdateProfile, handleChangePassword,
    
    // 🔥 State Expired Date telah ditambahkan agar dapat dikenali oleh form di MenuViews.jsx
    expiredDate, 
    setExpiredDate,
    totalKerugianExpired
  };
}