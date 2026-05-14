import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Keyboard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr';
import { cn } from '../../lib/utils';

interface ScanResult {
  session: string;
  room: string;
  unit: string;
}

interface Props {
  onResult: (result: ScanResult) => void;
  onError?: (msg: string) => void;
}

type Mode = 'camera' | 'manual';
type CamState = 'idle' | 'requesting' | 'active' | 'denied' | 'error';

function parseQRValue(raw: string): ScanResult | null {
  try {
    const url = new URL(raw);
    const session = url.searchParams.get('session');
    const room = url.searchParams.get('room');
    const unit = url.searchParams.get('unit');
    if (session && room) return { session, room, unit: unit || '' };
  } catch {
    const trimmed = raw.trim().toUpperCase();
    if (trimmed.startsWith('SESS-') && trimmed.length > 6) {
      return { session: trimmed, room: 'Unknown', unit: '' };
    }
  }
  return null;
}

export default function QRScanner({ onResult, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const scannedRef = useRef(false); // use ref to avoid stale closure in RAF loop

  const [mode, setMode] = useState<Mode>('camera');
  const [camState, setCamState] = useState<CamState>('idle');
  const [manualInput, setManualInput] = useState('');
  const [manualError, setManualError] = useState('');
  const [scanned, setScanned] = useState(false);

  function stopCamera() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  function scan() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || scannedRef.current) return;

    if (video.readyState >= video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          const result = parseQRValue(code.data);
          if (result) {
            scannedRef.current = true;
            setScanned(true);
            stopCamera();
            onResult(result);
            return;
          }
        }
      }
    }
    rafRef.current = requestAnimationFrame(scan);
  }

  async function startCamera() {
    setCamState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamState('active');
      scan();
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCamState('denied');
      } else {
        setCamState('error');
        onError?.(`Camera error: ${err.message}`);
      }
    }
  }

  useEffect(() => {
    scannedRef.current = false;
    if (mode === 'camera') startCamera();
    return () => stopCamera();
  }, [mode]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setManualError('');
    const result = parseQRValue(manualInput.trim());
    if (!result) {
      setManualError('Invalid code. Enter a SESS-XXXX code or paste the full check-in URL.');
      return;
    }
    onResult(result);
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => { setMode('camera'); setManualError(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            mode === 'camera'
              ? "bg-white dark:bg-slate-700 text-brand-indigo dark:text-indigo-400 shadow-sm"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <Camera className="w-4 h-4" /> Scan QR
        </button>
        <button
          type="button"
          onClick={() => { setMode('manual'); stopCamera(); setCamState('idle'); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            mode === 'manual'
              ? "bg-white dark:bg-slate-700 text-brand-indigo dark:text-indigo-400 shadow-sm"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <Keyboard className="w-4 h-4" /> Enter Code
        </button>
      </div>

      {/* Camera view */}
      {mode === 'camera' && (
        <div className="relative w-full aspect-square bg-slate-950 rounded-[2rem] overflow-hidden flex items-center justify-center">
          {camState === 'requesting' && (
            <div className="flex flex-col items-center gap-3 text-white/60">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest">Requesting camera…</p>
            </div>
          )}

          {camState === 'denied' && (
            <div className="flex flex-col items-center gap-4 text-white/60 px-8 text-center">
              <CameraOff className="w-10 h-10 text-rose-400" />
              <div>
                <p className="text-sm font-black text-white mb-1">Camera Access Denied</p>
                <p className="text-xs font-bold leading-relaxed">Allow camera access in your browser settings, then reload. Or enter the code manually.</p>
              </div>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Enter Code Manually
              </button>
            </div>
          )}

          {camState === 'error' && (
            <div className="flex flex-col items-center gap-4 text-white/60 px-8 text-center">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <div>
                <p className="text-sm font-black text-white mb-1">Camera Unavailable</p>
                <p className="text-xs font-bold leading-relaxed">Could not access your camera. Try refreshing or use manual entry.</p>
              </div>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Enter Code Manually
              </button>
            </div>
          )}

          {(camState === 'active' || camState === 'idle') && (
            <>
              <video
                ref={videoRef}
                muted
                playsInline
                className={cn("w-full h-full object-cover", camState !== 'active' && "hidden")}
              />
              {camState === 'active' && !scanned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-52 h-52">
                    {[
                      'top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl',
                      'top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl',
                      'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl',
                      'bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl',
                    ].map((cls, i) => (
                      <div key={i} className={cn("absolute w-8 h-8 border-white", cls)} />
                    ))}
                    <div className="absolute inset-x-0 h-0.5 bg-brand-indigo animate-[scan_2s_ease-in-out_infinite]" style={{ top: '50%' }} />
                  </div>
                  <p className="absolute bottom-6 text-[10px] font-black uppercase tracking-widest text-white/60">
                    Point at the lecturer's QR code
                  </p>
                </div>
              )}
            </>
          )}

          {scanned && (
            <div className="absolute inset-0 bg-emerald-900/80 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Manual entry */}
      {mode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Session Code or Check-in URL
            </label>
            <input
              value={manualInput}
              onChange={e => { setManualInput(e.target.value); setManualError(''); }}
              placeholder="e.g. SESS-ABC123"
              autoFocus
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-indigo/40 dark:focus:border-indigo-500/40 transition-all"
            />
            {manualError && (
              <p className="mt-2 text-xs text-rose-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {manualError}
              </p>
            )}
            <p className="mt-2 text-[10px] text-slate-400 font-bold">
              Ask your lecturer for the session code on their screen.
            </p>
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="w-full py-4 bg-brand-indigo text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-40 transition-all"
          >
            Verify &amp; Check In
          </button>
        </form>
      )}
    </div>
  );
}
