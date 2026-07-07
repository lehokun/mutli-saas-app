'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function BranchDashboard() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Form Laporan
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('branch_session');
    if (!session) {
      router.push('/branch-login');
    } else {
      setBranch(JSON.parse(session));
      startCamera();
    }
    setLoading(false);
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      setCameraError("Gagal mengakses kamera. Pastikan izin diizinkan.");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
  };

  const handleCaptureAndUpload = async () => {
    if (!notes || !amount) {
      alert("Wajib mengisi catatan pengeluaran dan nominal harga terlebih dahulu!");
      return;
    }
    if (!videoRef.current || !canvasRef.current) return;

    setUploading(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const fileName = `${branch.id}/${Date.now()}.jpg`;

        // 1. Upload ke Storage
        const { error: storageError } = await supabase.storage
          .from('expense-images')
          .upload(fileName, blob, { contentType: 'image/jpeg' });

        if (storageError) throw storageError;

        // 2. Ambil URL Publik
        const { data: urlData } = supabase.storage.from('expense-images').getPublicUrl(fileName);

        // 3. Simpan ke Database bersama catatan & nominal uang
        const { error: dbError } = await supabase.from('expenses').insert({
          branch_id: branch.id,
          image_url: urlData.publicUrl,
          notes: notes,
          amount: parseInt(amount)
        });

        if (dbError) throw dbError;

        alert('Laporan pengeluaran berhasil dikirim!');
        setNotes('');
        setAmount('');
      }, 'image/jpeg', 0.8);

    } catch (error) {
      alert('Gagal: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-black">Memuat Halaman...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div>
          <p className="text-xs text-gray-400">Cabang:</p>
          <h1 className="text-base font-bold text-blue-400">{branch?.name}</h1>
        </div>
        <button onClick={() => { stopCamera(); localStorage.removeItem('branch_session'); router.push('/branch-login'); }} className="text-xs bg-gray-700 px-3 py-1.5 rounded text-gray-300">
          Keluar
        </button>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 gap-6 max-w-4xl mx-auto w-full">
        {/* INPUT DATA */}
        <div className="w-full max-w-sm bg-gray-800 p-5 rounded-xl border border-gray-700 space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Detail Pengeluaran</h3>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Beli Apa / Keperluan</label>
            <input type="text" placeholder="Contoh: Beli Token Listrik / Sapu" className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Total Harga (Rp)</label>
            <input type="number" placeholder="Contoh: 50000" className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        {/* KAMERA */}
        <div className="w-full max-w-sm aspect-[3/4] bg-black rounded-xl overflow-hidden relative border border-gray-700 shadow-2xl">
          {cameraError ? (
            <p className="p-4 text-center text-xs text-red-400">{cameraError}</p>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />

          {uploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-300">Mengunggah Laporan Berkas...</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 p-6 flex flex-col items-center border-t border-gray-700">
        <button onClick={handleCaptureAndUpload} disabled={uploading} className="w-16 h-16 rounded-full border-4 bg-red-600 border-white hover:bg-red-700 active:scale-90 flex items-center justify-center shadow-lg disabled:bg-gray-600" />
        <p className="text-[10px] text-gray-400 mt-2">Isi form di atas terlebih dahulu lalu tekan tombol merah untuk memotret</p>
      </footer>
    </div>
  );
}