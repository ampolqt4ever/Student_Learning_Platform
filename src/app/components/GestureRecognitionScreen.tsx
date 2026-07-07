import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera, Hand, Brain, Target, CheckCircle,
  XCircle, Activity, BarChart3, RefreshCw
} from 'lucide-react';
import {
  useGestureDetector,
  fetchGestureConfig,
  CAPTURE_INTERVAL_MS,
  type GestureConfig,
} from '../lib/useGestureDetector';

interface HandLandmark {
  x: number;
  y: number;
  id: number;
}

// Display labels/emoji for the model's actual vocabulary. If the backend
// adds gestures later, unmapped ones just fall back to a generic display
// rather than breaking.
const GESTURE_EMOJI: Record<string, string> = {
  one: '☝️', two: '✌️', three: '🤟', four: '🖖', five: '🖐️',
  six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟', plus: '➕',
};

function gestureLabel(gesture: string): string {
  return gesture.charAt(0).toUpperCase() + gesture.slice(1);
}

export function GestureRecognitionScreen() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gestureConfig, setGestureConfig] = useState<GestureConfig | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const [successCount, setSuccessCount] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [handVisibleCount, setHandVisibleCount] = useState(0);
  const [confidenceSum, setConfidenceSum] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const detector = useGestureDetector(videoRef);

  const [showSuccess, setShowSuccess] = useState(false);
  const wasPredictingRef = useRef(false);

  useEffect(() => {
    fetchGestureConfig().then((config) => {
      if (config) setGestureConfig(config);
      else setBackendUnavailable(true);
    });
  }, []);

  // Tally real telemetry from the streamed predictions instead of faking it.
  useEffect(() => {
    if (!isDetecting) return;
    setFrameCount((c) => c + 1);
    if (detector.handDetected) setHandVisibleCount((c) => c + 1);

    const justPredicted = detector.prediction !== null;
    if (justPredicted && !wasPredictingRef.current) {
      setSuccessCount((c) => c + 1);
      setConfidenceSum((s) => s + detector.confidence);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
    wasPredictingRef.current = justPredicted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detector.prediction, detector.handDetected]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      const err = error as DOMException;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Allow camera permission in your browser to use live detection.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Could not access camera. Please check your device settings.');
      }
      return false;
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | undefined;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleToggleDetection = async () => {
    if (isDetecting) {
      detector.stop();
      stopCamera();
      setIsDetecting(false);
      return;
    }

    const ok = await startCamera();
    if (!ok) return;
    detector.reset();
    detector.start();
    setIsDetecting(true);
  };

  const handleReset = () => {
    setSuccessCount(0);
    setFrameCount(0);
    setHandVisibleCount(0);
    setConfidenceSum(0);
    detector.reset();
  };

  // Stop the camera if the component unmounts mid-session.
  useEffect(() => () => stopCamera(), []);

  const avgConfidencePct = successCount > 0 ? Math.round((confidenceSum / successCount) * 100) : 0;
  const handVisibilityPct = frameCount > 0 ? Math.round((handVisibleCount / frameCount) * 100) : 0;

  const landmarks: HandLandmark[] = (detector.landmarks ?? []).map(([x, y], id) => ({
    x: x * 100,
    y: y * 100,
    id,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Gesture Recognition
          </h1>
          <p className="text-gray-500 mt-2">AI-powered hand gesture detection system</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleToggleDetection}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isDetecting
                ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }`}
          >
            {isDetecting ? (
              <>
                <XCircle className="h-5 w-5" />
                Stop Detection
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                Start Detection
              </>
            )}
          </button>
        </div>
      </div>

      {backendUnavailable && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          Couldn't reach the detection backend at startup. Make sure the SignMath backend server is
          running, then refresh.
        </div>
      )}
      {cameraError && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          {cameraError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main webcam frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-gray-900 rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl relative"
        >
          <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black relative overflow-hidden">
            {/* Grid overlay (decorative HUD) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                {[...Array(96)].map((_, i) => (
                  <div key={i} className="border border-blue-400" />
                ))}
              </div>
            </div>

            {isDetecting ? (
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />

                {/* Hand landmark visualization, drawn from real backend coordinates */}
                {landmarks.length > 0 && (
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <g className="opacity-60">
                      <line x1={landmarks[0].x} y1={landmarks[0].y} x2={landmarks[1].x} y2={landmarks[1].y} stroke="#3B82F6" strokeWidth="0.3" />
                      {[1, 2, 3].map(i => (
                        <line key={`thumb-${i}`} x1={landmarks[i].x} y1={landmarks[i].y} x2={landmarks[i + 1].x} y2={landmarks[i + 1].y} stroke="#3B82F6" strokeWidth="0.3" />
                      ))}
                      {[5, 9, 13, 17].map(base => (
                        <g key={`finger-${base}`}>
                          <line x1={landmarks[0].x} y1={landmarks[0].y} x2={landmarks[base].x} y2={landmarks[base].y} stroke="#8B5CF6" strokeWidth="0.3" />
                          {[0, 1, 2].map(i => (
                            <line key={`${base}-${i}`} x1={landmarks[base + i].x} y1={landmarks[base + i].y} x2={landmarks[base + i + 1].x} y2={landmarks[base + i + 1].y} stroke="#8B5CF6" strokeWidth="0.3" />
                          ))}
                        </g>
                      ))}
                    </g>
                    {landmarks.map(point => (
                      <motion.circle
                        key={point.id}
                        cx={point.x}
                        cy={point.y}
                        r="0.8"
                        fill={point.id === 0 ? '#10B981' : point.id % 4 === 0 ? '#F59E0B' : '#3B82F6'}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: point.id * 0.02 }}
                      />
                    ))}
                  </svg>
                )}

                {/* Buffer fill indicator */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/50 rounded-lg px-3 py-1.5">
                  <span>{detector.handDetected ? 'Hand detected' : 'Show your hand...'}</span>
                  <span>{detector.seqLen} / {gestureConfig?.sequence_length ?? 30} frames</span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Camera is off</p>
                  <p className="text-gray-500 text-sm mt-2">Click "Start Detection" to begin</p>
                </div>
              </div>
            )}

            {/* Status indicators */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isDetecting ? 'bg-red-500/90' : 'bg-gray-700/90'
              } backdrop-blur-sm`}>
                <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-white text-xs font-bold">
                  {isDetecting ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              {isDetecting && detector.handDetected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-full"
                >
                  <Hand className="h-3.5 w-3.5 text-white" />
                  <span className="text-white text-xs font-bold">HAND DETECTED</span>
                </motion.div>
              )}
            </div>

            {/* Corners frame overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-500" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-500" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-500" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-500" />
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-300">Capture rate: <span className="font-bold text-white">{Math.round(1000 / CAPTURE_INTERVAL_MS)} fps</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-300">Sequence: <span className="font-bold text-white">{gestureConfig?.sequence_length ?? 30} frames</span></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-300">
                Backend: <span className={`font-bold ${backendUnavailable ? 'text-red-400' : 'text-white'}`}>
                  {backendUnavailable ? 'Disconnected' : 'Connected'}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right panel - AI prediction & metrics */}
        <div className="space-y-6">
          {/* AI Prediction result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">AI Prediction</h3>
            </div>

            <AnimatePresence mode="wait">
              {detector.prediction ? (
                <motion.div
                  key={detector.prediction}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-4"
                >
                  <div className="text-6xl mb-3">
                    {GESTURE_EMOJI[detector.prediction] ?? '🤚'}
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 mb-1">
                    {gestureLabel(detector.prediction)}
                  </p>
                  <p className="text-sm text-gray-500">Detected gesture</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Hand className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No gesture detected</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confidence meter */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 font-semibold">Confidence</span>
                <span className="font-bold text-gray-900">{(detector.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${detector.confidence * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-3 rounded-full ${
                    detector.confidence > 0.85 ? 'bg-green-500' : detector.confidence > 0.6 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Session stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Session Stats</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Avg. Confidence</span>
                  <span className="text-2xl font-extrabold text-gray-900">{avgConfidencePct}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: `${avgConfidencePct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">Gestures Detected</span>
                </div>
                <span className="text-xl font-extrabold text-green-600">{successCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div className="flex items-center gap-3">
                  <Hand className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Hand Visibility</span>
                </div>
                <span className="text-xl font-extrabold text-blue-600">{handVisibilityPct}%</span>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3"
          >
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </motion.div>
        </div>
      </div>

      {/* Success animation overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-green-500 text-white rounded-full p-8 shadow-2xl">
              <CheckCircle className="h-24 w-24" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
