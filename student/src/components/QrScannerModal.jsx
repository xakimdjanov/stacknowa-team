import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, CheckCircle2, SwitchCamera } from 'lucide-react';

/**
 * QrScannerModal — kamera orqali QR kodni skanerlaydi.
 * onScan(text) → skaner qilingan matnni qaytaradi.
 */
const QrScannerModal = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [camIdx, setCamIdx] = useState(0);
  const html5QrCodeRef = useRef(null);

  const ELEMENT_ID = 'qr-scanner-reader';

  const startScanner = async (cameraId) => {
    const { Html5Qrcode } = await import('html5-qrcode');

    // Eski instansni to'xtatib tozalaymiz
    if (html5QrCodeRef.current) {
      try { await html5QrCodeRef.current.stop(); } catch {}
      try { html5QrCodeRef.current.clear(); } catch {}
      html5QrCodeRef.current = null;
    }

    try {
      const qrCode = new Html5Qrcode(ELEMENT_ID);
      html5QrCodeRef.current = qrCode;
      setScanning(true);
      setError('');

      await qrCode.start(
        cameraId,
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          // Muvaffaqiyatli skanerlandi
          onScan(decodedText);
          stopScanner();
          onClose();
        },
        () => { /* ignore qr mismatches */ }
      );
    } catch (err) {
      setError("Kamerani ochib bo'lmadi. Ruxsat bering yoki boshqa kamerani tanlang.");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try { await html5QrCodeRef.current.stop(); } catch {}
      try { html5QrCodeRef.current.clear(); } catch {}
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    if (!isOpen) { stopScanner(); return; }

    (async () => {
      const { Html5Qrcode } = await import('html5-qrcode');
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          setError("Qurilmangizda kamera topilmadi.");
          return;
        }
        setCameras(devices);
        // Orqa kamerani afzal ko'ramiz
        const backIdx = devices.findIndex(d =>
          d.label?.toLowerCase().includes('back') || d.label?.toLowerCase().includes('environment')
        );
        const idx = backIdx >= 0 ? backIdx : 0;
        setCamIdx(idx);
        await startScanner(devices[idx].id);
      } catch (err) {
        setError("Kameraga ruxsat berilmadi. Brauzer sozlamalarini tekshiring.");
      }
    })();

    return () => { stopScanner(); };
  }, [isOpen]);

  const switchCamera = async () => {
    if (cameras.length < 2) return;
    const nextIdx = (camIdx + 1) % cameras.length;
    setCamIdx(nextIdx);
    await startScanner(cameras[nextIdx].id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">QR Kodni Skanerlash</h3>
              <p className="text-[11px] text-slate-400">O'qituvchi QR kodini kameraga tutish</p>
            </div>
          </div>
          <button
            onClick={() => { stopScanner(); onClose(); }}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Scanner viewport */}
        <div className="relative bg-slate-900 overflow-hidden" style={{ minHeight: 280 }}>
          {/* Scanner div — html5-qrcode renders here */}
          <div id={ELEMENT_ID} className="w-full" />

          {/* Scanning overlay frame */}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Corner brackets */}
              <div className="relative w-52 h-52">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />
                {/* Scan line animation */}
                <div className="absolute left-2 right-2 h-0.5 bg-indigo-400/70 rounded-full scan-line" />
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 px-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7 text-rose-400" />
                </div>
                <p className="text-sm text-slate-300 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {!scanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Kamera yoqilmoqda...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs text-center text-slate-500">
            O'qituvchingizning guruh sahifasidagi <strong>QR kodni</strong> kameraga to'g'rilang
          </p>

          <div className="flex gap-2">
            {cameras.length > 1 && (
              <button
                onClick={switchCamera}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                Kamera almashtirish
              </button>
            )}
            <button
              onClick={() => { stopScanner(); onClose(); }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 8px; opacity: 1; }
          50%  { top: calc(100% - 8px); opacity: 0.7; }
          100% { top: 8px; opacity: 1; }
        }
        .scan-line {
          animation: scanLine 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QrScannerModal;
