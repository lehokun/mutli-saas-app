'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { branchAuthService } from '../../services/branchAuthService';

export default function BranchLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (branchAuthService.getBranchSession()) router.push('/branch/dashboard');
  }, [router]);

  const handleTokenLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg('');
    try {
      const branchData = await branchAuthService.loginWithToken(token);
      branchAuthService.setBranchSession(branchData);
      router.push('/branch/dashboard');
    } catch (err) { setErrorMsg(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans text-slate-200">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-black text-white">Operasional Cabang</h2>
          <p className="text-xs text-slate-400 mt-1">Masukkan 8 digit token akses</p>
        </div>
        {errorMsg && <div className="bg-rose-500/10 text-rose-400 p-3.5 rounded-xl text-xs font-semibold text-center">⚠️ {errorMsg}</div>}
        <form onSubmit={handleTokenLogin} className="space-y-4">
          <input type="text" required maxLength={8} placeholder="X5B2D9A1" className="w-full text-center text-2xl font-mono tracking-widest uppercase rounded-2xl border-2 border-slate-700 bg-slate-950/80 p-3.5 text-white focus:border-blue-500 outline-none" value={token} onChange={(e) => setToken(e.target.value)} disabled={loading} />
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 p-3.5 font-bold text-white text-sm transition-all">{loading ? 'Memverifikasi...' : 'Masuk Sistem Cabang'}</button>
        </form>
        <div className="border-t border-slate-800 pt-4 text-center">
          <button onClick={() => router.push('/login')} className="text-xs font-bold text-slate-400 hover:text-blue-400">← Kembali Ke Login Admin Master</button>
        </div>
      </div>
    </div>
  );
}