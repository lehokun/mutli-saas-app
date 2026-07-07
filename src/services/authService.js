import { supabase } from '../lib/supabase';

export const authService = {
  // Tambahkan parameter metaData untuk menyimpan Nama Usaha dll
  async registerUser(email, password, metaData = {}) {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metaData // Menyimpan data ekstra ke raw_user_meta_data di Supabase
      }
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  },

  async loginWithOAuth(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin/dashboard` : undefined
      }
    });
    if (error) throw new Error(error.message);
    return data;
  },

  // Fungsi baru untuk mengirim email reset password
async sendPasswordResetEmail(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // Ubah dari /login menjadi /reset-password
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async checkActiveSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return session;
  }
};