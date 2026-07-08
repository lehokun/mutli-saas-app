'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) return alert('Kata sandi minimal 6 karakter');

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      alert('Gagal memperbarui kata sandi: ' + error.message);
    } else {
      alert('Kata sandi berhasil diperbarui! Silakan login kembali.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🔑
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kata Sandi Baru</h2>
          <p className="text-sm text-slate-500 mt-2">
            Silakan masukkan kata sandi baru untuk mengamankan akun administrator Anda.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Kata Sandi Baru
            </label>
            <input 
              type="password" 
              required 
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
              placeholder="Minimal 6 karakter..." 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:bg-indigo-400"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}