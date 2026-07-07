import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Hand, CheckCircle, XCircle, RotateCcw, Home, Loader, Info } from 'lucide-react';
import { useGestureDetector, fetchGestureConfig, type GestureConfig } from '../lib/useGestureDetector';

/**
 * Maps a lesson's display sign ("1", "+", "0", "-", ...) to the gesture
 * label the model actually predicts ("one", "plus", ...). Returns null for
 * signs the model wasn't trained on (e.g. "0", "-", "=", "×", "÷") so the
 * UI can fall back to a clearly-labeled demo mode instead of pretending
 * those signs are really being recognized.
 */
function signToGesture(sign: string, config: GestureConfig | null): string | null {
  if (!config) return null;
  if (sign === '+') {
    return config.gestures.includes('plus') ? 'plus' : null;
  }
  const asNumber = Number(sign);
  if (!Number.isNaN(asNumber) && Number.isInteger(asNumber)) {
    const match = config.gestures.find((g) => config.gesture_to_num[g] === asNumber);
    return match ?? null;
  }
  return null;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  signs: Array<{ sign: string; meaning: string; emoji: string }>;
}

interface GestureDetectionProps {
  lesson: Lesson;
  onComplete: () => void;
  username: string;
}

interface GestureAttempt {
  sign: string;
  correct: boolean;
  timestamp: number;
}

export function GestureDetection({ lesson, onComplete, username }: GestureDetectionProps) {
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [attempts, setAttempts] = useState<GestureAttempt[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [gestureConfig, setGestureConfig] = useState<GestureConfig | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const detector = useGestureDetector(videoRef);

  const currentSign = lesson.signs[currentSignIndex];
  const progress = ((currentSignIndex + 1) / lesson.signs.length) * 100;
  const modelGesture = signToGesture(currentSign.sign, gestureConfig);
  const isModelSupported = modelGesture !== null;

  useEffect(() => {
    fetchGestureConfig().then((config) => {
      if (config) {
        setGestureConfig(config);
      } else {
        setBackendUnavailable(true);
      }
    });
  }, []);

  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [showCamera]);

  // Resolve a live detection attempt: watch the streamed prediction and
  // compare it against the gesture this sign maps to.
  useEffect(() => {
    if (!isDetecting || !isModelSupported) return;
    if (!detector.prediction) return;

    const isCorrect = detector.prediction === modelGesture;
    detector.stop();
    setIsDetecting(false);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    const attempt: GestureAttempt = {
      sign: currentSign.sign,
      correct: isCorrect,
      timestamp: Date.now(),
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      setTimeout(() => {
        if (currentSignIndex < lesson.signs.length - 1) {
          setCurrentSignIndex(currentSignIndex + 1);
          setFeedback(null);
        } else {
          setSessionComplete(true);
          saveProgress();
        }
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detector.prediction]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      const err = error as DOMException;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Allow camera permission in your browser, or use gesture detection without a live feed.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Could not access camera. Please check your device settings.');
      }
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Starts a real detection attempt against the backend. Only used when the
  // current sign is one the model was actually trained on.
  const startRealDetection = () => {
    setIsDetecting(true);
    setFeedback(null);
    detector.reset();
    detector.start();
  };

  // Used as a fallback for signs the model doesn't know (e.g. "0", "-", "=")
  // or when no camera is available. Clearly surfaced to the user as demo
  // mode rather than silently pretending the model recognized something.
  const demoGestureDetection = () => {
    setIsDetecting(true);
    setFeedback(null);

    setTimeout(() => {
      const isCorrect = Math.random() > 0.3;
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setIsDetecting(false);

      const attempt: GestureAttempt = {
        sign: currentSign.sign,
        correct: isCorrect,
        timestamp: Date.now(),
      };
      setAttempts([...attempts, attempt]);

      if (isCorrect) {
        setTimeout(() => {
          if (currentSignIndex < lesson.signs.length - 1) {
            setCurrentSignIndex(currentSignIndex + 1);
            setFeedback(null);
          } else {
            setSessionComplete(true);
            saveProgress();
          }
        }, 1500);
      }
    }, 2000);
  };

  const saveProgress = () => {
    const correctAttempts = attempts.filter(a => a.correct).length + 1;
    const totalAttempts = attempts.length + 1;
    const accuracy = Math.round((correctAttempts / totalAttempts) * 100);

    const progressData = {
      username,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      accuracy,
      completedAt: new Date().toISOString(),
      totalSigns: lesson.signs.length,
    };

    const existingData = localStorage.getItem('lessonProgress');
    const progressHistory = existingData ? JSON.parse(existingData) : [];
    progressHistory.push(progressData);
    localStorage.setItem('lessonProgress', JSON.stringify(progressHistory));
  };

  const retryCurrentSign = () => {
    setFeedback(null);
  };

  const nextSign = () => {
    if (currentSignIndex < lesson.signs.length - 1) {
      setCurrentSignIndex(currentSignIndex + 1);
      setFeedback(null);
    }
  };

  if (sessionComplete) {
    const correctAttempts = attempts.filter(a => a.correct).length + 1;
    const totalAttempts = attempts.length + 1;
    const accuracy = Math.round((correctAttempts / totalAttempts) * 100);

    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12 text-white" />
          </motion.div>

          <h2 className="text-gray-900 mb-2">Lesson Complete!</h2>
          <p className="text-gray-600 mb-8">
            Great job completing <span className="font-semibold">{lesson.title}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <p className="text-sm text-blue-600 mb-1">Signs Learned</p>
              <p className="text-3xl text-blue-900">{lesson.signs.length}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-sm text-green-600 mb-1">Accuracy</p>
              <p className="text-3xl text-green-900">{accuracy}%</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <p className="text-sm text-purple-600 mb-1">Total Attempts</p>
              <p className="text-3xl text-purple-900">{totalAttempts}</p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Back to Lessons
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">{lesson.title}</h2>
          <p className="text-gray-600">
            Sign {currentSignIndex + 1} of {lesson.signs.length}
          </p>
        </div>
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home className="h-5 w-5" />
          Exit
        </button>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
              <span className="text-7xl">{currentSign.emoji}</span>
            </div>
            <h3 className="text-gray-900 mb-2">{currentSign.meaning}</h3>
            <p className="text-gray-600">Sign: {currentSign.sign}</p>
            {gestureConfig && (
              isModelSupported ? (
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3" /> Recognized by the live model
                </p>
              ) : (
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                  <Info className="h-3 w-3" /> Demo mode — model isn't trained on this sign yet
                </p>
              )
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Instructions:</span> Perform the hand gesture shown above.
              The system will detect your gesture and provide real-time feedback.
            </p>
          </div>

          {backendUnavailable && (
            <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              Couldn't reach the detection backend — running in demo mode for all signs. Make sure the
              SignMath backend server is running.
            </div>
          )}

          {cameraError && (
            <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              {cameraError}
            </div>
          )}

          {!showCamera ? (
            <div className="space-y-3">
              <button
                onClick={() => setShowCamera(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                <Camera className="h-5 w-5" />
                Start Camera
              </button>
              {cameraError && (
                <button
                  onClick={demoGestureDetection}
                  disabled={isDetecting || feedback === 'correct'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDetecting ? (
                    <><Loader className="h-5 w-5 animate-spin" />Detecting Gesture...</>
                  ) : (
                    <><Hand className="h-5 w-5" />Detect Gesture (Demo, No Camera)</>
                  )}
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={isModelSupported && !backendUnavailable ? startRealDetection : demoGestureDetection}
              disabled={isDetecting || feedback === 'correct'}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDetecting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  {isModelSupported && !backendUnavailable ? 'Detecting Gesture...' : 'Detecting (Demo)...'}
                </>
              ) : (
                <>
                  <Hand className="h-5 w-5" />
                  {isModelSupported && !backendUnavailable ? 'Detect Gesture' : 'Detect Gesture (Demo)'}
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400">Camera Feed</span>
            </div>
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
              {showCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Camera not started</p>
                </div>
              )}

              {isDetecting && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-48 h-48 border-4 border-blue-500 rounded-full"
                  />
                </div>
              )}

              {isDetecting && isModelSupported && !backendUnavailable && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/50 rounded-lg px-3 py-1.5">
                  <span>{detector.handDetected ? 'Hand detected' : 'Show your hand...'}</span>
                  <span>{detector.seqLen} / {gestureConfig?.sequence_length ?? 30} frames</span>
                </div>
              )}
            </div>
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-6 ${
                feedback === 'correct'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {feedback === 'correct' ? (
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className={feedback === 'correct' ? 'text-green-900' : 'text-red-900'}>
                    {feedback === 'correct' ? 'Correct!' : 'Try Again'}
                  </h4>
                  <p className={`text-sm ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                    {feedback === 'correct'
                      ? 'Great job! Your gesture was recognized correctly.'
                      : 'The gesture was not recognized. Please try again.'}
                  </p>
                  {feedback === 'incorrect' && (
                    <button
                      onClick={retryCurrentSign}
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-white text-red-700 rounded-lg hover:bg-red-50 transition-colors border border-red-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-gray-900 mb-4">Progress in this lesson</h4>
            <div className="space-y-2">
              {lesson.signs.map((sign, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index < currentSignIndex
                      ? 'bg-green-50'
                      : index === currentSignIndex
                      ? 'bg-blue-50 ring-2 ring-blue-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{sign.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{sign.meaning}</p>
                  </div>
                  {index < currentSignIndex && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
