'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function RootPage() {
  // Langsung alihkan pengguna ke rute /login
  redirect('/login');
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Supabase otomatis akan mengenali session dari token di URL
    const { error } = await supabase.auth.updateUser({ password: password });
    
    if (error) {
      alert('Gagal memperbarui kata sandi: ' + error.message);
    } else {
      alert('Kata sandi berhasil diperbarui!');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border">
        <h2 className="text-xl font-black mb-6">Masukkan Kata Sandi Baru</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input 
            type="password" 
            required 
            className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm" 
            placeholder="Password baru" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}