import { supabase } from '../lib/supabase';

export const branchAuthService = {
  async loginWithToken(token) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('token', token.trim().toUpperCase())
      .single();

    if (error || !data) throw new Error('Token akses salah atau cabang tidak terdaftar!');
    
    // 🔥 PERBAIKAN: Tolak akses jika cabang sedang dinonaktifkan Admin
    if (data.is_active === false) throw new Error('Akses ditolak! Cabang ini sedang dinonaktifkan oleh pusat.');
    
    return data;
  },

  setBranchSession(branchData) {
    if (typeof window !== 'undefined') {
      // 🔥 PERBAIKAN: Sekarang kita menyimpan "token" juga di memori gawai
      // agar bisa kita bandingkan dengan database nantinya.
      localStorage.setItem('branch_session', JSON.stringify({ 
        id: branchData.id, 
        name: branchData.name,
        token: branchData.token 
      }));
    }
  },

  getBranchSession() {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('branch_session');
      return session ? JSON.parse(session) : null;
    }
    return null;
  },

  // 🔥 FUNGSI BARU: Penjaga Keamanan Sesi Cabang (Guard)
  async verifyActiveSession() {
    const session = this.getBranchSession();
    if (!session) return null;

    try {
      // Tarik data terbaru cabang ini langsung dari Supabase Database
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', session.id)
        .single();

      // KICK-OUT (LOGOUT PAKSA) APABILA:
      // 1. Cabang dihapus dari database
      // 2. Token di memori HP BERBEDA dengan token di database (telah di-reset Admin)
      // 3. Status cabang dinonaktifkan (Paused) oleh Admin
      if (error || !data || data.token !== session.token || data.is_active === false) {
        this.logoutBranch();
        return null; 
      }

      // Jika masih aman, update memori HP dengan data terbaru 
      // (Bermanfaat jika tiba-tiba Admin mengubah Nama Cabang)
      this.setBranchSession(data);
      return data;
      
    } catch (err) {
      console.error("Gagal memverifikasi sesi cabang:", err);
      return null;
    }
  },

  logoutBranch() {
    if (typeof window !== 'undefined') localStorage.removeItem('branch_session');
  }
};