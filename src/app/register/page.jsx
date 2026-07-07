'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../services/authService';

export default function RegisterPage() {
  const router = useRouter();
  
  // State untuk form
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State untuk visibilitas password & loading
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setErrorMsg('Kata sandi tidak cocok.');
    
    // Validasi Keamanan Kata Sandi
    if (password.length < 6) return setErrorMsg('Minimal kata sandi 6 karakter.');
    if (!/[A-Z]/.test(password)) return setErrorMsg('Kata sandi harus mengandung minimal 1 huruf kapital.');
    if (!/[^a-zA-Z0-9\s]/.test(password)) return setErrorMsg('Kata sandi harus mengandung minimal 1 simbol (contoh: !@#$%^&*).');

    if (!businessName.trim()) return setErrorMsg('Nama usaha tidak boleh kosong.');
    
    setLoading(true); setErrorMsg('');
    try {
      // Menyimpan data ekstra (business_name) ke metadata Supabase
      await authService.registerUser(email, password, {
        business_name: businessName
      });
      router.push('/admin/dashboard');
    } catch (error) { 
      setErrorMsg('Gagal: ' + error.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setErrorMsg('');
      await authService.loginWithOAuth(provider);
    } catch (error) {
      setErrorMsg(`Gagal mendaftar dengan ${provider}: ` + error.message);
    }
  };

  // Ikon Mata SVG Reusable
  const EyeIcon = ({ isVisible }) => (
    isVisible ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
    )
  );

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative shadow-2xl z-20 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 relative z-10 py-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Buat Akun Baru</h2>
            <p className="text-sm text-slate-500 mt-2">Daftarkan bisnis Anda dan mulai kelola cabang</p>
          </div>
          
          {errorMsg && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm font-medium">{errorMsg}</div>}
          
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Input Nama Usaha */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nama Usaha / Bisnis</label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:border-blue-500 transition-all" placeholder="Contoh: Kopi Kenangan" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Alamat Email</label>
              <input type="email" required className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:border-blue-500 transition-all" placeholder="admin@perusahaan.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Kata Sandi Baru</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required className="w-full pl-4 pr-12 py-3 rounded-xl border bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:border-blue-500 transition-all" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                  <EyeIcon isVisible={showPassword} />
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} required className="w-full pl-4 pr-12 py-3 rounded-xl border bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:border-blue-500 transition-all" placeholder="Ulangi kata sandi" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                  <EyeIcon isVisible={showConfirmPassword} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:bg-blue-400 mt-8">
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="relative flex py-2 items-center text-slate-300">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Atau Daftar Dengan</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button onClick={() => handleOAuthLogin('google')} type="button" className="flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-[0.98] text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Daftar dengan Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">Sudah memiliki akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Masuk di sini</Link></p>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/20 to-emerald-600/20 mix-blend-overlay"></div>
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="relative z-10 text-white mt-auto mb-auto">
          <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">Arsitektur Multi-Tenant Terisolasi</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Setiap data bisnis, stok, dan laporan finansial yang Anda masukkan dienkripsi dengan standar tinggi dan dipisahkan secara eksklusif (Row Level Security) sehingga tidak akan tertukar antar pengguna.</p>
        </div>
      </div>
    </div>
  );
}