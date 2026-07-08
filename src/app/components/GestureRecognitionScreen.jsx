import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, Hand, ArrowRight, RefreshCw, CircleAlert } from 'lucide-react';
import { fetchGestureConfig, useGestureDetector } from '../lib/useGestureDetector';

const defaultGestureExamples = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'plus'];

const displayGestureLabel = (gesture) => gesture === 'plus' ? '+' : gesture;

export function GestureRecognitionScreen() {
  const videoRef = useRef(null);
  const [gestureExamples, setGestureExamples] = useState(defaultGestureExamples);
  const [activeGesture, setActiveGesture] = useState(defaultGestureExamples[0]);
  const [cameraError, setCameraError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [activeCameraLabel, setActiveCameraLabel] = useState('Default camera');
  const [videoStream, setVideoStream] = useState(null);
  const [displayPrediction, setDisplayPrediction] = useState(null);
  const [displayConfidence, setDisplayConfidence] = useState(0);
  const [displaySeqLen, setDisplaySeqLen] = useState(0);
  const [displayHandDetected, setDisplayHandDetected] = useState(false);

  const { start, stop, reset, status, prediction, confidence, handDetected, seqLen } = useGestureDetector(videoRef);

  useEffect(() => {
    let active = true;

    fetchGestureConfig().then((config) => {
      if (!active || !config) return;
      const examples = config.gestures;
      setGestureExamples(examples);
      setActiveGesture((current) => (examples.includes(current) ? current : examples[0]));
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (prediction && handDetected && confidence >= 0.85 && gestureExamples.includes(prediction)) {
      setActiveGesture(prediction);
      setDisplayPrediction(prediction);
      setDisplayConfidence(confidence);
      setDisplaySeqLen(seqLen);
      setDisplayHandDetected(handDetected);

      const timeoutId = window.setTimeout(() => {
        setDisplayPrediction(null);
        setDisplayConfidence(0);
        setDisplaySeqLen(0);
        setDisplayHandDetected(false);
      }, 1800);

      return () => window.clearTimeout(timeoutId);
    }

    if (!handDetected) {
      clearPredictionDisplay();
    }
  }, [prediction, confidence, seqLen, handDetected, gestureExamples]);

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return;

    const loadDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setCameraDevices(videoDevices);

      if (!selectedCameraId && videoDevices[0]) {
        setSelectedCameraId(videoDevices[0].deviceId);
        setActiveCameraLabel(videoDevices[0].label || 'Default camera');
      }
    };

    loadDevices();
  }, [selectedCameraId]);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      stop();
    };
  }, [stop]);

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play().catch(() => {
        /* ignore autoplay block if browser prevents it */
      });
    }
  }, [videoStream]);

  const handleStartCamera = async () => {
    setCameraError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : { facingMode: 'user' },
        audio: false,
      });

      const track = stream.getVideoTracks()[0];
      const label = track?.label || cameraDevices.find((device) => device.deviceId === selectedCameraId)?.label || 'Default camera';
      setActiveCameraLabel(label);
      setVideoStream(stream);
      setCameraReady(true);
      setIsStreaming(true);
      start();
    } catch {
      setCameraError('Camera access was denied or unavailable. Please allow webcam permissions and try again.');
      setCameraReady(false);
      setIsStreaming(false);
      stop();
    }
  };

  const clearPredictionDisplay = () => {
    setDisplayPrediction(null);
    setDisplayConfidence(0);
    setDisplaySeqLen(0);
    setDisplayHandDetected(false);
  };

  const handleStopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
    setIsStreaming(false);
    clearPredictionDisplay();
    stop();
  };

  const handleGestureSelection = (gesture) => {
    setActiveGesture(gesture);
    clearPredictionDisplay();
    reset();
  };

  const statusLabel = status === 'open' ? 'Live' : status === 'connecting' ? 'Connecting' : status === 'error' ? 'Error' : 'Idle';

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-600 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-sm font-semibold mb-4 w-fit">
          <Sparkles className="h-4 w-4" />
          Gesture recognition demo
        </div>
        <h2 className="text-3xl font-extrabold mb-3">Live sign recognition is now connected to the backend.</h2>
        <p className="text-blue-50 max-w-2xl">Start the camera to stream frames to the SignMath inference server and receive live predictions for your gestures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Live Camera View</h3>
                <p className="text-sm text-gray-500">Preview and test gesture detection.</p>
              </div>
            </div>
            <div className={`rounded-full px-3 py-1 text-sm font-semibold ${status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
              {statusLabel}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white">
                <span className="font-medium">Capturing</span>
                <span className="truncate text-slate-300">{activeCameraLabel}</span>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`h-[320px] w-full object-cover ${cameraReady ? '' : 'opacity-0'}`}
                />
                {!cameraReady ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/60 text-white">
                    <Hand className="h-10 w-10" />
                    <p className="font-semibold">Camera preview ready</p>
                    <p className="text-sm text-center text-slate-200">Enable permissions and start recognizing gestures.</p>
                  </div>
                ) : null}
                <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                  {handDetected ? 'Hand detected' : 'Waiting for a hand'}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {cameraDevices.length > 1 ? (
                <select
                  value={selectedCameraId}
                  onChange={(event) => setSelectedCameraId(event.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700"
                >
                  {cameraDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 6)}`}
                    </option>
                  ))}
                </select>
              ) : null}
              <button
                onClick={isStreaming ? handleStopCamera : handleStartCamera}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Camera className="h-4 w-4" />
                {isStreaming ? 'Stop Camera' : 'Start Camera'}
              </button>
              <button
                onClick={() => {
                  clearPredictionDisplay();
                  reset();
                  setCameraError('');
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700"
              >
                <RefreshCw className="h-4 w-4" />
                Reset buffer
              </button>
            </div>

            {cameraError ? (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                <CircleAlert className="h-4 w-4" />
                {cameraError}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Live recognition status</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-extrabold text-gray-900">{displayPrediction ? displayGestureLabel(displayPrediction) : displayGestureLabel(activeGesture)}</p>
                <p className="text-sm text-gray-500">{displayPrediction ? 'Prediction from the backend model' : 'Gesture recognized. Try another sign.'}</p>
              </div>
              <div className="text-4xl">✋</div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-gray-600">
              <p>Accuracy: {displayPrediction ? `${(displayConfidence * 100).toFixed(0)}%` : '—'}</p>
              <p className="mt-1">Buffer length: {displayPrediction ? displaySeqLen : 0}</p>
              <p className="mt-1">Hand tracking: {displayPrediction ? (displayHandDetected ? 'Visible' : 'Waiting') : 'Waiting'}</p>
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Try a gesture</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gestureExamples.map((gesture) => (
                <button
                  key={gesture}
                  onClick={() => handleGestureSelection(gesture)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${activeGesture === gesture ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-200 bg-white text-gray-900'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{displayGestureLabel(gesture)}</span>
                    <span className="text-xs text-gray-500">{gesture === 'plus' ? 'plus' : ''}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
