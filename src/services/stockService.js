// src/services/stockService.js
import { supabase } from '../lib/supabase';

export const stockService = {
  
  // Mengambil data dengan filter admin_id untuk keamanan data (Multi-tenancy)
  async getStocksByAdmin(adminId) {
    if (!adminId) throw new Error("Admin ID diperlukan!");
    
    const { data, error } = await supabase
      .from('stocks')
      .select('*, branches(name)')
      .eq('admin_id', adminId);
      
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Menambah data dengan validasi angka yang ketat
  async addStock(itemName, quantity, hpp, hargaJual, adminId) {
    // 1. Validasi Input: Pastikan semua data ada dan valid
    const qty = parseInt(quantity);
    const cost = parseInt(hpp);
    const price = parseInt(hargaJual);

    if (!itemName || isNaN(qty) || isNaN(cost) || isNaN(price)) {
      throw new Error("Data tidak valid: Pastikan Nama Barang dan Angka diisi dengan benar.");
    }

    // 2. Insert data dengan data yang sudah bersih (tidak mungkin null)
    const { error } = await supabase.from('stocks').insert({
      item_name: itemName.trim(),
      quantity: qty,
      hpp: cost,
      harga_jual: price,
      admin_id: adminId,
      branch_id: null // Ini adalah stok gudang pusat
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message);
    }
    
    return true;
  },

  // Tambahan: Update stok untuk mencegah double data
  async updateStockQuantity(stockId, newQuantity) {
    const { error } = await supabase
      .from('stocks')
      .update({ quantity: parseInt(newQuantity) })
      .eq('id', stockId);

    if (error) throw new Error(error.message);
    return true;
  }
};