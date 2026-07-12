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
  
  // 🔥 STATE BARU UNTUK NOTIFIKASI & MODAL KONFIRMASI (Mencegah Focus Stealing dari alert bawaan)
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const notify = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const requestConfirm = (message) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        onConfirm: () => { setConfirmDialog(null); resolve(true); },
        onCancel: () => { setConfirmDialog(null); resolve(false); }
      });
    });
  };

  // Data States
  const [admin, setAdmin] = useState(null);
  const [branches, setBranches] = useState([]);
  const [stocks, setStocks] = useState([]);
  
  const [groupedExpensesRaw, setGroupedExpensesRaw] = useState({});
  const [groupedSalesHistoryRaw, setGroupedSalesHistoryRaw] = useState({});
  
  // Filter States
  const [filterBranchId, setFilterBranchId] = useState('ALL');
  const [filterTimeframe, setFilterTimeframe] = useState('ALL');
  const [chartDays, setChartDays] = useState(7);

  // Forms States - Branch
  const [branchName, setBranchName] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [editingBranchName, setEditingBranchName] = useState('');

  // Forms States - Stock (Create)
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [hpp, setHpp] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [expiredDate, setExpiredDate] = useState('');

  // Forms States - Stock (Update/Edit)
  const [editingStockId, setEditingStockId] = useState(null);
  const [editStockName, setEditStockName] = useState('');
  const [editStockQty, setEditStockQty] = useState('');
  const [editStockHpp, setEditStockHpp] = useState('');
  const [editStockHargaJual, setEditStockHargaJual] = useState('');
  const [editStockExpiredDate, setEditStockExpiredDate] = useState('');

  // Forms States - Stock Actions
  const [selectedExistingStockId, setSelectedExistingStockId] = useState('');
  const [additionalStockQty, setAdditionalStockQty] = useState('');
  const [selectedStockId, setSelectedStockId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [transferQty, setTransferQty] = useState('');
  const [closingStockId, setClosingStockId] = useState('');
  const [closingSoldQty, setClosingSoldQty] = useState('');

  // Forms States - Profile
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

      const expGrouped = expensesData.reduce((acc, exp) => {
        const date = new Date(exp.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(exp);
        return acc;
      }, {});
      setGroupedExpensesRaw(expGrouped);

      const salesGrouped = salesData.reduce((acc, log) => {
        const date = new Date(log.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(log);
        return acc;
      }, {});
      setGroupedSalesHistoryRaw(salesGrouped);

    } catch (error) {
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

  const isBranchMatch = (itemBranchId, filterId) => {
    return !filterId || filterId === 'ALL' || itemBranchId === filterId;
  };

  const isWithinTimeframe = (dateString, timeframe) => {
    if (!timeframe) return true;
    const tf = timeframe.toUpperCase();
    if (tf === 'ALL') return true;
    const date = new Date(dateString);
    const now = new Date();
    if (tf === 'TODAY') return date.toDateString() === now.toDateString();
    if (tf === 'WEEK') {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= lastWeek;
    }
    if (tf === 'MONTH') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    return true;
  };

  const filteredStocks = useMemo(() => stocks.filter(s => isBranchMatch(s.branch_id, filterBranchId)), [stocks, filterBranchId]);
  
  const filteredSalesHistoryFlat = useMemo(() => {
    const flatSales = Object.values(groupedSalesHistoryRaw).flat();
    return flatSales.filter(s => isBranchMatch(s.branch_id, filterBranchId) && isWithinTimeframe(s.created_at, filterTimeframe));
  }, [groupedSalesHistoryRaw, filterBranchId, filterTimeframe]);

  const filteredExpensesFlat = useMemo(() => {
    const flatExp = Object.values(groupedExpensesRaw).flat();
    return flatExp.filter(e => isBranchMatch(e.branch_id, filterBranchId) && isWithinTimeframe(e.created_at, filterTimeframe));
  }, [groupedExpensesRaw, filterBranchId, filterTimeframe]);

  const groupedSalesHistory = useMemo(() => {
    return filteredSalesHistoryFlat.reduce((acc, log) => {
      const date = new Date(log.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    }, {});
  }, [filteredSalesHistoryFlat]);

  const groupedExpenses = useMemo(() => {
    return filteredExpensesFlat.reduce((acc, exp) => {
      const date = new Date(exp.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(exp);
      return acc;
    }, {});
  }, [filteredExpensesFlat]);

  const totalOmset = filteredSalesHistoryFlat.reduce((sum, log) => sum + log.total_price, 0);
  const totalPengeluaran = filteredExpensesFlat.reduce((sum, exp) => sum + exp.amount, 0);
  
  const hariIni = new Date();
  const totalKerugianExpired = filteredStocks.reduce((acc, item) => {
    if (item.expired_at && new Date(item.expired_at) < hariIni && item.quantity > 0) {
      return acc + (item.quantity * item.hpp);
    }
    return acc;
  }, 0);

  const labaBersih = totalOmset - filteredSalesHistoryFlat.reduce((sum, log) => sum + log.total_hpp, 0) - totalPengeluaran - totalKerugianExpired;

  const chartData = useMemo(() => {
    const data = [];
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const shortDay = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      
      let dailyOmset = 0;
      if (groupedSalesHistoryRaw[dateStr]) {
        dailyOmset = groupedSalesHistoryRaw[dateStr].reduce((sum, log) => {
          if (isBranchMatch(log.branch_id, filterBranchId)) return sum + log.total_price;
          return sum;
        }, 0);
      }

      let dailyPengeluaran = 0;
      if (groupedExpensesRaw[dateStr]) {
        dailyPengeluaran = groupedExpensesRaw[dateStr].reduce((sum, exp) => {
          if (isBranchMatch(exp.branch_id, filterBranchId)) return sum + exp.amount;
          return sum;
        }, 0);
      }
      data.push({ day: shortDay, dateStr, omset: dailyOmset, pengeluaran: dailyPengeluaran });
    }
    return data;
  }, [groupedSalesHistoryRaw, groupedExpensesRaw, filterBranchId, chartDays]);

  // --- Handlers: Branch Management ---
  const isBranchNameExist = (nameToCheck, excludeId = null) => {
    const cleanName = nameToCheck.trim().toLowerCase();
    return branches.some(branch => {
      if (excludeId && branch.id === excludeId) return false;
      return branch.name.trim().toLowerCase() === cleanName;
    });
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!branchName.trim()) return notify("Nama cabang tidak boleh kosong!", "error");
    if (isBranchNameExist(branchName)) return notify(`Gagal! Nama cabang "${branchName}" sudah terdaftar.`, "error");

    const tokenBaru = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      const newBranch = await adminService.addBranch(branchName, admin.id, tokenBaru);
      setGeneratedToken(tokenBaru);
      setBranchName('');
      
      // 🔥 PERBAIKAN BUG CABANG: Parsing return dari Supabase dengan benar agar langsung tampil
      const branchData = newBranch?.data ? newBranch.data[0] : (Array.isArray(newBranch) ? newBranch[0] : newBranch);
      
      if (branchData && branchData.id) {
        setBranches(prev => [...prev, branchData]);
        notify("Cabang berhasil didaftarkan!", "success");
      } else {
        // Fallback panggil ulang data jika data branchData gagal diparsing
        loadDashboardData();
        notify("Cabang berhasil didaftarkan!", "success");
      }
    } catch (error) { notify("Gagal menambah cabang: " + error.message, "error"); }
  };

  const handleUpdateBranch = async (id) => {
    if (!editingBranchName.trim()) return notify("Nama tidak boleh kosong!", "error");
    if (isBranchNameExist(editingBranchName, id)) return notify(`Gagal! Nama cabang "${editingBranchName}" sudah dipakai.`, "error");

    try {
      const { error } = await supabase.from('branches').update({ name: editingBranchName }).eq('id', id).eq('admin_id', admin.id);
      if (error) throw error;
      setBranches(prev => prev.map(b => b.id === id ? { ...b, name: editingBranchName } : b));
      setEditingBranchId(null);
      notify("Nama cabang berhasil diupdate!", "success");
    } catch (error) { notify("Gagal mengupdate nama cabang: " + error.message, "error"); }
  };

  const handleDeleteBranch = async (id) => {
    const confirmed = await requestConfirm("PENGHAPUSAN PERMANEN!\n\nYakin ingin menghapus cabang ini? Seluruh data laporan, stok, dan nota cabang ini akan hilang selamanya.");
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('branches').delete().eq('id', id).eq('admin_id', admin.id);
      if (error) {
        if (error.message.includes('foreign key')) throw new Error('Cabang tidak dapat dihapus karena masih memiliki riwayat transaksi atau sisa stok.');
        throw error;
      }
      setBranches(prev => prev.filter(b => b.id !== id));
      notify("Cabang berhasil dihapus secara permanen.", "success");
      loadDashboardData();
    } catch (error) { notify("Gagal menghapus cabang: " + error.message, "error"); }
  };

  const handleToggleBranchStatus = async (id, currentStatus) => {
    try {
      await adminService.updateBranch(id, { is_active: !currentStatus });
      setBranches(prev => prev.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b));
      notify(`Cabang ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}.`, "success");
    } catch (error) { notify("Gagal merubah status cabang: " + error.message, "error"); }
  };

  const handleRegenerateToken = async (id) => {
    const confirmed = await requestConfirm("Yakin ingin mengganti token?\nStaf cabang akan langsung ter-logout (keluar otomatis).");
    if (!confirmed) return;

    const tokenBaru = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      await adminService.updateBranch(id, { token: tokenBaru });
      setBranches(prev => prev.map(b => b.id === id ? { ...b, token: tokenBaru } : b));
      notify(`Token Baru dibuat: ${tokenBaru}`, "success");
    } catch (error) { notify("Gagal membuat token baru: " + error.message, "error"); }
  };

  // --- Handlers: Stock & Report ---
  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const cleanName = itemName.trim();
      const qty = parseInt(quantity);
      const cost = parseInt(hpp);
      const price = parseInt(hargaJual);

      if (!cleanName || isNaN(qty) || isNaN(cost) || isNaN(price)) throw new Error("Mohon periksa form. Pastikan nilai angka benar.");

      const { data: existingProduct, error: checkError } = await supabase.from('stocks').select('id').ilike('item_name', cleanName).is('branch_id', null).eq('admin_id', admin.id).maybeSingle();
      if (checkError) throw checkError;
      if (existingProduct) throw new Error("Produk sudah ada di Gudang Pusat! Gunakan menu 'Tambah Stok Barang Jadi'.");

      const { error } = await supabase.from('stocks').insert({
        item_name: cleanName, quantity: qty, hpp: cost, harga_jual: price, admin_id: admin.id, branch_id: null, expired_at: expiredDate || null
      });
      if (error) throw error;
      
      notify("Produk berhasil didaftarkan!", "success");
      setItemName(''); setQuantity(''); setHpp(''); setHargaJual(''); setExpiredDate('');
      loadDashboardData();
    } catch (error) { notify("Gagal: " + error.message, "error"); }
  };

  const handleUpdateStock = async (id) => {
    try {
      const cleanName = editStockName.trim();
      const qty = parseInt(editStockQty);
      const cost = parseInt(editStockHpp);
      const price = parseInt(editStockHargaJual);

      if (!cleanName || isNaN(qty) || isNaN(cost) || isNaN(price)) {
        throw new Error("Mohon periksa kembali form, pastikan angka valid!");
      }

      const { error } = await supabase
        .from('stocks')
        .update({
          item_name: cleanName,
          quantity: qty,
          hpp: cost,
          harga_jual: price,
          expired_at: editStockExpiredDate || null
        })
        .eq('id', id)
        .eq('admin_id', admin.id);

      if (error) throw error;

      setStocks(prev => prev.map(s => s.id === id ? {
        ...s,
        item_name: cleanName,
        quantity: qty,
        hpp: cost,
        harga_jual: price,
        expired_at: editStockExpiredDate || null
      } : s));

      setEditingStockId(null);
      notify("Data produk berhasil diperbarui!", "success");
    } catch (error) {
      notify("Gagal mengupdate produk: " + error.message, "error");
    }
  };

  const handleDeleteStock = async (id) => {
    const confirmed = await requestConfirm("Yakin ingin menghapus produk ini? \n\nProduk yang sudah memiliki riwayat tidak bisa dihapus untuk menjaga integritas laporan.");
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('stocks')
        .delete()
        .eq('id', id)
        .eq('admin_id', admin.id);

      if (error) {
        if (error.message.includes('foreign key') || error.message.includes('violates foreign key constraint')) {
          throw new Error('Produk masih terhubung dengan riwayat transaksi.');
        }
        throw error;
      }
      setStocks(prev => prev.filter(s => s.id !== id));
      notify("Produk berhasil dihapus dari inventaris.", "success");
    } catch (error) {
      notify("Gagal menghapus produk: " + error.message, "error");
    }
  };

  const handleAddExistingStock = async (e) => {
    e.preventDefault();
    if (!selectedExistingStockId || !additionalStockQty) return notify("Pilih produk dan isi jumlah!", "error");
    try {
      const stock = stocks.find(s => s.id.toString() === selectedExistingStockId);
      await adminService.addExistingStockQty(selectedExistingStockId, stock.quantity, additionalStockQty);
      notify("Stok berhasil ditambahkan!", "success");
      setSelectedExistingStockId(''); setAdditionalStockQty('');
      loadDashboardData();
    } catch (error) { notify("Gagal: " + error.message, "error"); }
  };

  const handleTransferStock = async (e) => {
    e.preventDefault();
    const qty = parseInt(transferQty);
    if (!selectedStockId || !selectedBranchId || isNaN(qty) || qty <= 0) return notify("Isi form dengan benar!", "error");
    const targetStock = stocks.find(s => s.id.toString() === selectedStockId);
    if (qty > targetStock.quantity) return notify("Sisa stok pusat tidak cukup!", "error");
    
    try {
      const existStock = stocks.find(s => s.branch_id === selectedBranchId && s.item_name === targetStock.item_name);
      
      // 🔥 PERBAIKAN BUG: Eksekusi transfer langsung dengan Supabase untuk memastikan expired_at terbawa
      
      // 1. Kurangi stok di Gudang Pusat
      const { error: errPusat } = await supabase
        .from('stocks')
        .update({ quantity: targetStock.quantity - qty })
        .eq('id', targetStock.id);
      
      if (errPusat) throw errPusat;

      // 2. Tambah/Buat stok di Cabang Penerima
      if (existStock) {
        // Jika produk sudah ada di cabang, tambah qty & perbarui masa kedaluwarsa
        const { error: errCabang } = await supabase
          .from('stocks')
          .update({ 
            quantity: existStock.quantity + qty,
            expired_at: targetStock.expired_at || existStock.expired_at // Bawa expired_at pusat
          })
          .eq('id', existStock.id);
        if (errCabang) throw errCabang;
      } else {
        // Jika produk belum ada di cabang, buat produk baru dengan expired_at yang sama
        const { error: errNew } = await supabase
          .from('stocks')
          .insert({
            item_name: targetStock.item_name,
            quantity: qty,
            hpp: targetStock.hpp,
            harga_jual: targetStock.harga_jual,
            admin_id: admin.id,
            branch_id: selectedBranchId,
            expired_at: targetStock.expired_at // 🔥 MEMASTIKAN MASA EXPIRED IKUT PINDAH LOKASI
          });
        if (errNew) throw errNew;
      }

      notify("Distribusi stok berhasil dipindahkan!", "success");
      setSelectedStockId(''); setSelectedBranchId(''); setTransferQty('');
      loadDashboardData();
    } catch (error) { notify("Gagal transfer: " + error.message, "error"); }
  };

  const handleClosingReport = async (e) => {
    e.preventDefault();
    const soldQty = parseInt(closingSoldQty);
    if (!closingStockId || isNaN(soldQty) || soldQty <= 0) return notify("Isi jumlah terjual dengan benar!", "error");
    
    const targetStock = stocks.find(s => s.id.toString() === closingStockId);
    if (soldQty > targetStock.quantity) return notify("Penjualan melebihi sisa stok!", "error");

    try {
      const { calculatedRemainingQty, calculatedSoldQty } = await adminService.executeClosingReport(targetStock, soldQty);
      const updatedStocks = stocks.map(s => s.id.toString() === closingStockId ? { ...s, quantity: calculatedRemainingQty, sold_quantity: calculatedSoldQty } : s);
      setStocks(updatedStocks);
      
      const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const newLog = {
        id: Date.now(), branch_id: targetStock.branch_id, item_name: targetStock.item_name,
        quantity_sold: soldQty, total_price: soldQty * targetStock.harga_jual, created_at: new Date().toISOString()
      };
      
      const updatedHistory = { ...groupedSalesHistoryRaw };
      if (!updatedHistory[todayStr]) updatedHistory[todayStr] = [];
      updatedHistory[todayStr] = [newLog, ...updatedHistory[todayStr]];
      
      setClosingStockId(''); setClosingSoldQty('');
      setGroupedSalesHistoryRaw(updatedHistory);
      notify('Tutup buku harian sukses!', "success");
    } catch (err) { notify("Gagal: " + err.message, "error"); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({ data: { business_name: profileName, address: profileAddress } });
      if (error) throw error;
      notify('Profil berhasil diperbarui!', "success");
    } catch (err) { notify('Gagal memperbarui profil: ' + err.message, "error"); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return notify('Kata sandi minimal 6 karakter', "error");
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      notify('Kata sandi berhasil diubah!', "success");
      setNewPassword('');
    } catch (err) { notify('Gagal mengubah sandi: ' + err.message, "error"); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    router, // 🔥 PERBAIKAN: Export router dikembalikan agar tombol Portal Cabang tidak crash
    darkMode, setDarkMode, isSidebarOpen, setIsSidebarOpen, currentMenu, setCurrentMenu, loading,
    admin, branches, stocks, filterBranchId, setFilterBranchId, filterTimeframe, setFilterTimeframe,
    filteredStocks, totalOmset, totalPengeluaran, labaBersih, 
    chartData, chartDays, setChartDays,
    groupedExpenses, groupedSalesHistory, filteredExpenses: filteredExpensesFlat,
    formatRupiah, getUserInitials, getUserDisplayName,
    branchName, setBranchName, generatedToken, itemName, setItemName, quantity, setQuantity,
    hpp, setHpp, hargaJual, setHargaJual, selectedExistingStockId, setSelectedExistingStockId,
    additionalStockQty, setAdditionalStockQty, selectedStockId, setSelectedStockId,
    selectedBranchId, setSelectedBranchId, transferQty, setTransferQty, closingStockId,
    setClosingStockId, closingSoldQty, setClosingSoldQty, editingBranchId, setEditingBranchId, 
    editingBranchName, setEditingBranchName, profileName, setProfileName, profileAddress, setProfileAddress, 
    newPassword, setNewPassword, expiredDate, setExpiredDate, totalKerugianExpired,
    
    editingStockId, setEditingStockId,
    editStockName, setEditStockName,
    editStockQty, setEditStockQty,
    editStockHpp, setEditStockHpp,
    editStockHargaJual, setEditStockHargaJual,
    editStockExpiredDate, setEditStockExpiredDate,
    handleUpdateStock, handleDeleteStock,

    handleAddBranch, handleDeleteBranch, handleUpdateBranch, handleToggleBranchStatus, handleRegenerateToken,
    handleAddStock, handleAddExistingStock, handleTransferStock, handleClosingReport, handleLogout,
    handleUpdateProfile, handleChangePassword,
    
    // 🔥 Export State UI tambahan untuk dirender di page.jsx
    notification, confirmDialog
  };
}