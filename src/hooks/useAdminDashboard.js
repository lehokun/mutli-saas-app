'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { adminService } from '../services/adminService';

export function useAdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI & Theme States
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [currentMenu, setCurrentMenu] = useState('home'); 

  // Master Data States
  const [branches, setBranches] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]); 

  // Form Inputs States
  const [branchName, setBranchName] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [hpp, setHpp] = useState('');
  const [hargaJual, setHargaJual] = useState('');

  const [selectedExistingStockId, setSelectedExistingStockId] = useState('');
  const [additionalStockQty, setAdditionalStockQty] = useState('');

  const [selectedStockId, setSelectedStockId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [transferQty, setTransferQty] = useState('');

  const [closingStockId, setClosingStockId] = useState('');
  const [closingSoldQty, setClosingSoldQty] = useState('');

  // States untuk Edit Cabang
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [editingBranchName, setEditingBranchName] = useState('');

  // Filter States
  const [filterBranchId, setFilterBranchId] = useState('ALL');
  const [filterTimeframe, setFilterTimeframe] = useState('ALL'); 

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await adminService.getAdminUser();
      if (!user) return router.push('/login');
      
      setAdmin(user);
      const [branchesData, stocksData, expensesData, salesData] = await Promise.all([
        adminService.fetchBranches(user.id),
        adminService.fetchStocks(user.id),
        adminService.fetchExpenses(user.id),
        adminService.fetchSalesHistory(user.id)
      ]);

      setBranches(branchesData);
      setStocks(stocksData);
      setExpenses(expensesData);
      setSalesHistory(salesData);
    } catch (err) {
      console.error("Gagal memuat data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers Cabang (Branch Management) ---
  const handleAddBranch = async (e) => {
    e.preventDefault();
    const tokenBaru = crypto.randomUUID().substring(0, 8).toUpperCase();
    try {
      await adminService.addBranch(branchName, admin.id, tokenBaru);
      setGeneratedToken(tokenBaru);
      setBranchName('');
      const updatedBranches = await adminService.fetchBranches(admin.id);
      setBranches(updatedBranches);
    } catch (err) { alert("Gagal: " + err.message); }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!window.confirm("Yakin ingin menghapus cabang ini? Pastikan tidak ada stok atau transaksi yang tertaut jika ingin menghapus sepenuhnya.")) return;
    try {
      await adminService.deleteBranch(branchId);
      setBranches(branches.filter(b => b.id !== branchId));
      alert("Cabang berhasil dihapus!");
    } catch (err) { alert("Gagal menghapus cabang: " + err.message); }
  };

  const handleUpdateBranch = async (branchId) => {
    if (!editingBranchName.trim()) return alert("Nama cabang tidak boleh kosong");
    try {
      await adminService.updateBranch(branchId, { name: editingBranchName });
      setBranches(branches.map(b => b.id === branchId ? { ...b, name: editingBranchName } : b));
      setEditingBranchId(null);
      setEditingBranchName('');
      alert("Nama cabang berhasil diperbarui!");
    } catch (err) { alert("Gagal memperbarui cabang: " + err.message); }
  };

  const handleToggleBranchStatus = async (branchId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminService.updateBranch(branchId, { is_active: newStatus });
      setBranches(branches.map(b => b.id === branchId ? { ...b, is_active: newStatus } : b));
    } catch (err) { alert("Gagal mengubah status cabang: " + err.message); }
  };

  const handleRegenerateToken = async (branchId) => {
    if (!window.confirm("Yakin ingin membuat token baru? Token lama tidak akan bisa digunakan lagi oleh staf cabang.")) return;
    const tokenBaru = crypto.randomUUID().substring(0, 8).toUpperCase();
    try {
      await adminService.updateBranch(branchId, { token: tokenBaru });
      setBranches(branches.map(b => b.id === branchId ? { ...b, token: tokenBaru } : b));
      alert("Token baru berhasil dibuat: " + tokenBaru);
    } catch (err) { alert("Gagal membuat token baru: " + err.message); }
  };

  // --- Handlers Stok & Penjualan ---
  const handleAddStock = async (e) => {
    e.preventDefault();
    const numericQty = Number(quantity);
    const numericHpp = Number(hpp);
    const numericHargaJual = Number(hargaJual);
    const cleanName = itemName.trim();

    if (!cleanName || isNaN(numericQty) || isNaN(numericHpp) || isNaN(numericHargaJual)) {
      alert("Semua kolom angka harus diisi dengan valid!");
      return;
    }

    // 🔥 VALIDASI FRONTEND: Cek apakah nama produk sudah eksis di Gudang Pusat
    const isDuplicate = stocks.some(
      s => s.branch_id === null && s.item_name.toLowerCase() === cleanName.toLowerCase()
    );

    if (isDuplicate) {
      alert(`Peringatan: Produk "${cleanName}" sudah terdaftar di Gudang Pusat! Silakan gunakan fitur 'Tambah Stok Barang Jadi' di sebelahnya untuk menambah unit.`);
      return;
    }

    try {
      await adminService.addStock(cleanName, numericQty, numericHpp, numericHargaJual, admin.id);
      setItemName(''); setQuantity(''); setHpp(''); setHargaJual('');
      const updatedStocks = await adminService.fetchStocks(admin.id);
      setStocks(updatedStocks);
      alert("Produk sukses disimpan!");
    } catch (err) { alert("Gagal: " + err.message); }
  };

  const handleAddExistingStock = async (e) => {
    e.preventDefault();
    if (!selectedExistingStockId || !additionalStockQty) return;
    const target = stocks.find(s => s.id === parseInt(selectedExistingStockId));
    if (!target) return;

    try {
      await adminService.addExistingStockQty(target.id, target.quantity, additionalStockQty);
      setSelectedExistingStockId(''); setAdditionalStockQty('');
      const updatedStocks = await adminService.fetchStocks(admin.id);
      setStocks(updatedStocks);
      alert(`Stok produk berhasil ditambah!`);
    } catch (err) { alert("Gagal menambah stok: " + err.message); }
  };

  const handleTransferStock = async (e) => {
    e.preventDefault();
    const qty = parseInt(transferQty);
    const target = stocks.find(s => s.id === parseInt(selectedStockId));
    if (!target || target.quantity < qty || qty <= 0) return alert('Stok Pusat tidak mencukupi!');
    const exist = stocks.find(s => s.item_name.toLowerCase() === target.item_name.toLowerCase() && s.branch_id === selectedBranchId);

    try {
      await adminService.executeStockTransfer(target, selectedBranchId, qty, exist, admin.id);
      setTransferQty(''); setSelectedStockId(''); setSelectedBranchId('');
      const updatedStocks = await adminService.fetchStocks(admin.id);
      setStocks(updatedStocks);
      alert('Stok sukses didistribusikan ke cabang!');
    } catch (err) { alert("Gagal: " + err.message); }
  };

  const handleClosingReport = async (e) => {
    e.preventDefault();
    const target = stocks.find(s => s.id === parseInt(closingStockId));
    const soldQty = parseInt(closingSoldQty);

    if (!target || target.quantity < soldQty || soldQty <= 0) {
      return alert('Jumlah tidak valid atau melebihi sisa stok cabang!');
    }

    try {
      const result = await adminService.executeClosingReport(target, soldQty);
      setStocks(prev => prev.map(item => 
        item.id === target.id ? { ...item, quantity: result.calculatedRemainingQty, sold_quantity: result.calculatedSoldQty } : item
      ));
      setClosingStockId(''); setClosingSoldQty('');
      const [updatedStocks, updatedHistory] = await Promise.all([adminService.fetchStocks(admin.id), adminService.fetchSalesHistory(admin.id)]);
      setStocks(updatedStocks);
      setSalesHistory(updatedHistory);
      alert('Tutup buku harian sukses!');
    } catch (err) { alert("Gagal: " + err.message); }
  };

  const handleLogout = async () => {
    if (window.confirm("Apakah anda yakin ingin keluar dari sistem?")) {
      await supabase.auth.signOut();
      router.push('/login');
    }
  };

  // --- Utilities & Computations ---
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const getUserInitials = () => admin?.email ? admin.email.split('@')[0].substring(0, 2).toUpperCase() : 'US';
  const getUserDisplayName = () => admin?.email ? admin.email.split('@')[0] : 'User Account';

  const isWithinTimeframe = (dateString) => {
    if (filterTimeframe === 'ALL') return true;
    const itemDate = new Date(dateString);
    const now = new Date();
    if (filterTimeframe === 'TODAY') return itemDate.toDateString() === now.toDateString();
    if (filterTimeframe === 'WEEK') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      return itemDate >= sevenDaysAgo;
    }
    if (filterTimeframe === 'MONTH') return itemDate.getMonth() === new Date().getMonth() && itemDate.getFullYear() === new Date().getFullYear();
    return true;
  };

  const filteredStocks = filterBranchId === 'ALL' ? stocks : stocks.filter(s => s.branch_id === filterBranchId);
  const filteredSalesHistory = salesHistory.filter(log => (filterBranchId === 'ALL' || log.branch_id === filterBranchId) && isWithinTimeframe(log.created_at));
  const filteredExpenses = expenses.filter(exp => (filterBranchId === 'ALL' || exp.branch_id === filterBranchId) && isWithinTimeframe(exp.created_at));

  const totalOmset = filteredSalesHistory.reduce((sum, log) => sum + log.total_price, 0);
  const totalHpp = filteredSalesHistory.reduce((sum, log) => sum + log.total_hpp, 0);
  const totalPengeluaran = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const labaBersih = totalOmset - totalHpp - totalPengeluaran;

  const chartData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const daySales = salesHistory.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate.getDate() === d.getDate() && logDate.getMonth() === d.getMonth() && (filterBranchId === 'ALL' || log.branch_id === filterBranchId);
    });
    return {
      day: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      omset: daySales.reduce((sum, log) => sum + log.total_price, 0)
    };
  });
  const maxChartOmset = Math.max(...chartData.map(d => d.omset), 1000);

  const groupDataByDate = (dataArray) => {
    const groups = {};
    dataArray.forEach(item => {
      const dateLabel = new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(item);
    });
    return groups;
  };

  const groupedExpenses = groupDataByDate(filteredExpenses);
  const groupedSalesHistory = groupDataByDate(filteredSalesHistory);

  return {
    darkMode, setDarkMode, isSidebarOpen, setIsSidebarOpen, currentMenu, setCurrentMenu, loading,
    branches, stocks, filterBranchId, setFilterBranchId, filterTimeframe, setFilterTimeframe,
    filteredStocks, totalOmset, totalPengeluaran, labaBersih, chartData, maxChartOmset, router,
    groupedExpenses, groupedSalesHistory, formatRupiah, getUserInitials, getUserDisplayName,
    branchName, setBranchName, generatedToken, itemName, setItemName, quantity, setQuantity,
    hpp, setHpp, hargaJual, setHargaJual, selectedExistingStockId, setSelectedExistingStockId,
    additionalStockQty, setAdditionalStockQty, selectedStockId, setSelectedStockId,
    selectedBranchId, setSelectedBranchId, transferQty, setTransferQty, closingStockId,
    setClosingStockId, closingSoldQty, setClosingSoldQty, filteredExpenses,
    editingBranchId, setEditingBranchId, editingBranchName, setEditingBranchName,
    handleAddBranch, handleDeleteBranch, handleUpdateBranch, handleToggleBranchStatus, handleRegenerateToken,
    handleAddStock, handleAddExistingStock, handleTransferStock, handleClosingReport, handleLogout
  };
}