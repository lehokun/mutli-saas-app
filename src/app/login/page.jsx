'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk ikon mata
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.checkActiveSession();
        if (session) router.push('/admin/dashboard');
      } catch (err) { console.error(err); }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg('');
    try {
      await authService.loginUser(email, password);
      router.push('/admin/dashboard');
    } catch (error) {
      setErrorMsg('Email atau password salah. Silakan coba lagi.');
    } finally { setLoading(false); }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setErrorMsg('');
      await authService.loginWithOAuth(provider);
    } catch (error) {
      setErrorMsg(`Gagal masuk dengan ${provider}: ` + error.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="relative z-10 text-white mt-auto mb-auto">
          <h1 className="text-5xl font-black tracking-tight leading-tight mb-6">Kelola Multi-Cabang<br/>Lebih Pintar.</h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">Sistem manajemen logistik dan finansial terpusat.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang</h2>
            <p className="text-sm text-slate-500 mt-2">Masuk ke console administrator Anda</p>
          </div>
          
          {errorMsg && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm font-medium">{errorMsg}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="admin@perusahaan.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                )}
              </button>
            </div>
            
            <div className="flex justify-end mt-1 mb-4">
              <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                Lupa Kata Sandi?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:bg-indigo-400 mt-2">
              {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="relative flex py-2 items-center text-slate-300">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Atau Masuk Dengan</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button onClick={() => handleOAuthLogin('google')} type="button" className="flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-[0.98] text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">Belum memiliki akun? <Link href="/register" className="text-indigo-600 font-bold hover:underline">Daftar sekarang</Link></p>
          <div className="relative flex py-2 items-center text-slate-300 my-2"><div className="flex-grow border-t border-slate-100"></div></div>
          
          <button type="button" onClick={() => router.push('/branch-login')} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-[0.98] text-xs">
            📸 Masuk Sebagai Staff Operasional Cabang
          </button>
        </div>
      </div>
    </div>
  );
}