import { supabase } from '../lib/supabase';

export const branchAuthService = {
  async loginWithToken(token) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('token', token.trim().toUpperCase())
      .single();

    if (error || !data) throw new Error('Token akses salah atau cabang tidak terdaftar!');
    return data;
  },

  setBranchSession(branchData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('branch_session', JSON.stringify({ id: branchData.id, name: branchData.name }));
    }
  },

  getBranchSession() {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('branch_session');
      return session ? JSON.parse(session) : null;
    }
    return null;
  },

  logoutBranch() {
    if (typeof window !== 'undefined') localStorage.removeItem('branch_session');
  }
};