'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');
    
    try {
      await authService.sendPasswordResetEmail(email);
      setIsSuccess(true);
      setMessage('Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.');
    } catch (error) {
      setErrorMsg('Gagal mengirim email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-800 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🔐
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lupa Kata Sandi?</h2>
          <p className="text-sm text-slate-500 mt-2">
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {isSuccess ? (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-5 rounded-xl text-sm font-medium text-center">
            <span className="text-2xl block mb-2">✅</span>
            {message}
            <Link href="/login" className="block mt-4 text-emerald-700 font-bold hover:underline">
              Kembali ke Halaman Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Alamat Email
              </label>
              <input 
                type="email" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                placeholder="admin@perusahaan.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:bg-indigo-400 mt-4"
            >
              {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>
        )}

        {!isSuccess && (
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <Link href="/login" className="text-sm text-slate-500 font-bold hover:text-indigo-600 transition-colors">
              ← Kembali ke Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}