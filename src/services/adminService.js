import { supabase } from '../lib/supabase';

export const adminService = {
  async getAdminUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async fetchBranches(adminId) {
    const { data, error } = await supabase.from('branches').select('*').eq('admin_id', adminId);
    if (error) throw error;
    return data || [];
  },

  async fetchStocks(adminId) {
    const { data, error } = await supabase.from('stocks').select('*, branches(name)').eq('admin_id', adminId);
    if (error) throw error;
    return data || [];
  },

  async fetchExpenses(adminId) {
    const { data, error } = await supabase
      .from('expenses')
      .select('id, image_url, notes, amount, branch_id, created_at, branches!inner(name, admin_id)')
      .eq('branches.admin_id', adminId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchSalesHistory(adminId) {
    const { data, error } = await supabase
      .from('sales_history')
      .select('*, branches!inner(name, admin_id)')
      .eq('branches.admin_id', adminId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addBranch(branchName, adminId, tokenBaru) {
    const { error } = await supabase.from('branches').insert({ name: branchName, token: tokenBaru, admin_id: adminId });
    if (error) throw error;
    return true;
  },

  // 🔥 TAMBAHKAN 2 FUNGSI BARU INI DI BAWAH addBranch:
  async updateBranch(branchId, updateData) {
    // Tambahkan .select() untuk memaksa Supabase mengembalikan baris yang berhasil diupdate
    const { data, error } = await supabase.from('branches').update(updateData).eq('id', branchId).select();
    
    if (error) throw new Error(error.message);
    
    // Jika data kosong, berarti database MENOLAK update (Biasanya karena RLS Update belum diatur)
    if (!data || data.length === 0) {
      throw new Error("Tertolak oleh database. Pastikan Policy RLS untuk fitur UPDATE sudah Anda izinkan di Supabase!");
    }
    
    return true;
  },

  async deleteBranch(branchId) {
    const { error } = await supabase.from('branches').delete().eq('id', branchId);
    if (error) throw new Error(error.message);
    return true;
  },

  async addStock(itemName, quantity, hpp, hargaJual, adminId) {
    const qty = parseInt(quantity);
    const cost = parseInt(hpp);
    const price = parseInt(hargaJual);
    const cleanName = itemName.trim();

    if (!cleanName || isNaN(qty) || isNaN(cost) || isNaN(price)) {
      throw new Error("Data tidak valid: Pastikan nama dan angka diisi benar.");
    }

    // 🔥 CEK DUPLIKASI DATA DI DATABASE PUSAT (Case-Insensitive)
    const { data: existingProduct, error: checkError } = await supabase
      .from('stocks')
      .select('id')
      .ilike('item_name', cleanName) // 'ilike' mengabaikan huruf besar/kecil
      .is('branch_id', null)
      .eq('admin_id', adminId)
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
      admin_id: adminId,
      branch_id: null
    });
    if (error) throw error;
    return true;
  },

  async addExistingStockQty(stockId, currentQty, additionalQty) {
    const { error } = await supabase.from('stocks').update({ quantity: currentQty + parseInt(additionalQty) }).eq('id', stockId);
    if (error) throw error;
    return true;
  },

  async executeStockTransfer(targetStock, selectedBranchId, qtyToTransfer, existStock, adminId) {
    const { error: deductError } = await supabase.from('stocks').update({ quantity: targetStock.quantity - qtyToTransfer }).eq('id', targetStock.id);
    if (deductError) throw deductError;

    if (existStock) {
      const { error: updateError } = await supabase.from('stocks').update({ quantity: existStock.quantity + qtyToTransfer }).eq('id', existStock.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from('stocks').insert({ 
        item_name: targetStock.item_name, quantity: qtyToTransfer, hpp: targetStock.hpp, harga_jual: targetStock.harga_jual, admin_id: adminId, branch_id: selectedBranchId 
      });
      if (insertError) throw insertError;
    }
    return true;
  },

  async executeClosingReport(targetStock, soldQty) {
    const calculatedSoldQty = Number(targetStock.sold_quantity || 0) + soldQty;
    const calculatedRemainingQty = targetStock.quantity - soldQty;

    const { error: stockError } = await supabase.from('stocks').update({ quantity: calculatedRemainingQty, sold_quantity: calculatedSoldQty }).eq('id', targetStock.id);
    if (stockError) throw stockError;

    const { error: logError } = await supabase.from('sales_history').insert({
      branch_id: targetStock.branch_id, item_name: targetStock.item_name, quantity_sold: soldQty, total_price: soldQty * (targetStock.harga_jual || 0), total_hpp: soldQty * (targetStock.hpp || 0)
    });
    if (logError) throw logError;

    return { calculatedRemainingQty, calculatedSoldQty };
  }
};