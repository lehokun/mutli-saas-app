'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { branchAuthService } from '../../services/branchAuthService';

export default function BranchLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Jika terdeteksi sudah memiliki sesi aktif, langsung bypass ke dashboard operasional
  useEffect(() => {
    const activeSession = branchAuthService.getBranchSession();
    if (activeSession) {
      router.push('/branch/dashboard');
    }
  }, [router]);

  const handleTokenLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Panggil gerbang logika data backend service
      const branchData = await branchAuthService.loginWithToken(token);
      branchAuthService.setBranchSession(branchData);
      
      router.push('/branch/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans text-slate-200 relative overflow-hidden">
      {/* Ornamen Estetika Background Lingkaran Glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-3xl opacity-60 animate-pulse delay-75"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative z-10 animate-fade-in">
        
        {/* Identitas Brand Logo Platform */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path opacity="0.4" d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">Operasional Cabang</h2>
            <p className="text-xs text-slate-400 mt-1">Masukkan token akses dari pemilik untuk menyalakan sistem</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs font-semibold text-center tracking-wide">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleTokenLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">8-Digit Token Akses</label>
            <input
              type="text"
              required
              maxLength={8}
              placeholder="X5B2D9A1"
              className="w-full text-center text-2xl font-mono tracking-widest uppercase rounded-2xl border-2 border-slate-700 bg-slate-950/80 p-3.5 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-700 font-black"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 p-3.5 font-bold text-white text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                {/* STRUKTUR SVG YANG SUDAH DIPERBAIKI */}
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Verifikasi Kode...</span>
              </>
            ) : (
              'Masuk Aplikasi Kasir'
            )}
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 text-center">
          <button 
            onClick={() => router.push('/login')} 
            className="text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors"
          >
            ← Kembali Ke Login Utama Admin Workspace
          </button>
        </div>
      </div>
    </div>
  );
}