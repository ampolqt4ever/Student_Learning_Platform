import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Talks to the SignMath backend (see /signmath-backend in the project root).
 * Streams webcam frames over a WebSocket and exposes the live prediction.
 *
 * All gesture-index logic lives on the server — this hook only ever sees
 * resolved label strings (e.g. "seven"), never indices, by design.
 */

export interface GestureResult {
  prediction: string | null;
  confidence: number;
  handDetected: boolean;
  seqLen: number;
  landmarks: [number, number][] | null;
}

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

const WS_URL = (import.meta.env.VITE_BACKEND_WS_URL as string | undefined) || 'ws://localhost:8000/ws/predict';
const HTTP_BASE_URL = (import.meta.env.VITE_BACKEND_HTTP_URL as string | undefined) || 'http://localhost:8000';
export const CAPTURE_INTERVAL_MS = 100; // ~10fps — raise/lower to trade responsiveness for bandwidth/CPU

const EMPTY_RESULT: GestureResult = {
  prediction: null,
  confidence: 0,
  handDetected: false,
  seqLen: 0,
  landmarks: null,
};

export interface GestureConfig {
  gestures: string[];
  gesture_to_num: Record<string, number | null>;
  sequence_length: number;
  confidence_threshold: number;
}

/** Fetches the gesture vocabulary from the backend instead of hardcoding it in the UI. */
export async function fetchGestureConfig(): Promise<GestureConfig | null> {
  try {
    const res = await fetch(`${HTTP_BASE_URL}/api/gestures`);
    if (!res.ok) return null;
    return (await res.json()) as GestureConfig;
  } catch {
    return null;
  }
}

export function useGestureDetector(videoRef: React.RefObject<HTMLVideoElement>) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [result, setResult] = useState<GestureResult>(EMPTY_RESULT);

  const wsRef = useRef<WebSocket | null>(null);
  const captureTimerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stop = useCallback(() => {
    if (captureTimerRef.current !== null) {
      window.clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('idle');
  }, []);

  /** Clears the server-side frame buffer — call this whenever moving to a new sign/phase. */
  const reset = useCallback(() => {
    setResult(EMPTY_RESULT);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'reset' }));
    }
  }, []);

  const start = useCallback(() => {
    if (wsRef.current) return; // already running

    setStatus('connecting');
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('open');
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      captureTimerRef.current = window.setInterval(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2 /* HAVE_CURRENT_DATA */) return;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Mirror horizontally to match V1.py's cv2.flip(frame, 1) — both the
        // training pipeline and the desktop app analyze a mirrored frame so
        // gestures feel natural to perform in front of a webcam. Display the
        // <video> with `transform: scaleX(-1)` so what's on screen lines up
        // with the landmark coordinates the backend returns.
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'frame', data: dataUrl }));
        }
      }, CAPTURE_INTERVAL_MS);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'prediction') {
          setResult({
            prediction: msg.prediction ?? null,
            confidence: msg.confidence ?? 0,
            handDetected: !!msg.hand_detected,
            seqLen: msg.seq_len ?? 0,
            landmarks: msg.landmarks ?? null,
          });
        }
      } catch {
        // ignore malformed/partial message
      }
    };

    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus('closed');
  }, [videoRef]);

  // Always tear down the socket + capture loop on unmount.
  useEffect(() => stop, [stop]);

  return { start, stop, reset, status, ...result };
}
