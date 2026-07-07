import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Hand, Home, Loader, Sword, Shield, Heart, Star, Trophy } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  signs: Array<{ sign: string; meaning: string; emoji: string }>;
}

interface Student {
  id: string;
  name: string;
  email: string;
  lessonsCompleted: number;
  averageAccuracy: number;
  totalPoints: number;
}

interface RPGBattleGameProps {
  lesson: Lesson;
  student: Student;
  onComplete: (earnedPoints: number, accuracy: number) => void;
  onExit: () => void;
}

interface Monster {
  name: string;
  emoji: string;
  maxHealth: number;
  attackPower: number;
  pointsReward: number;
}

const MONSTERS: Record<string, Monster> = {
  beginner: {
    name: 'Slime',
    emoji: '🟢',
    maxHealth: 6,
    attackPower: 10,
    pointsReward: 100,
  },
  intermediate: {
    name: 'Goblin Warrior',
    emoji: '👹',
    maxHealth: 10,
    attackPower: 15,
    pointsReward: 200,
  },
  advanced: {
    name: 'Dragon Lord',
    emoji: '🐉',
    maxHealth: 15,
    attackPower: 20,
    pointsReward: 350,
  },
};

const KNIGHT_MAX_HEALTH = 100;

export function RPGBattleGame({ lesson, student, onComplete, onExit }: RPGBattleGameProps) {
  const monster = MONSTERS[lesson.difficulty];

  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [knightHealth, setKnightHealth] = useState(KNIGHT_MAX_HEALTH);
  const [monsterHealth, setMonsterHealth] = useState(monster.maxHealth);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [knightAttacking, setKnightAttacking] = useState(false);
  const [monsterAttacking, setMonsterAttacking] = useState(false);
  const [gameOver, setGameOver] = useState<'victory' | 'defeat' | null>(null);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const battleLogRef = useRef<HTMLDivElement>(null);

  const currentSign = lesson.signs[currentSignIndex];

  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [showCamera]);

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [battleLog]);

  useEffect(() => {
    if (monsterHealth <= 0) {
      setGameOver('victory');
      const points = monster.pointsReward;
      setEarnedPoints(points);
      saveProgress(points);
    } else if (knightHealth <= 0) {
      setGameOver('defeat');
      saveProgress(0);
    }
  }, [monsterHealth, knightHealth]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      addBattleLog('⚠️ Camera access denied. Using simulation mode.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const addBattleLog = (message: string) => {
    setBattleLog(prev => [...prev, message]);
  };

  const knightAttack = () => {
    setKnightAttacking(true);
    const damage = 1;
    const newMonsterHealth = Math.max(0, monsterHealth - damage);
    setMonsterHealth(newMonsterHealth);
    addBattleLog(`⚔️ ${student.name}'s Knight attacks ${monster.name} for ${damage} damage!`);

    setTimeout(() => {
      setKnightAttacking(false);
      if (newMonsterHealth > 0 && currentSignIndex < lesson.signs.length - 1) {
        setCurrentSignIndex(currentSignIndex + 1);
        addBattleLog(`📚 Next sign: ${lesson.signs[currentSignIndex + 1].meaning}`);
      }
    }, 800);
  };

  const monsterAttack = () => {
    setMonsterAttacking(true);
    const damage = monster.attackPower;
    const newKnightHealth = Math.max(0, knightHealth - damage);
    setKnightHealth(newKnightHealth);
    addBattleLog(`💥 ${monster.name} strikes back! ${student.name} takes ${damage} damage!`);

    setTimeout(() => {
      setMonsterAttacking(false);
    }, 800);
  };

  const simulateGestureDetection = () => {
    if (gameOver || isDetecting) return;

    setIsDetecting(true);
    addBattleLog(`🤚 Detecting gesture for "${currentSign.meaning}"...`);

    setTimeout(() => {
      const isCorrect = Math.random() > 0.3;
      setTotalAttempts(totalAttempts + 1);

      if (isCorrect) {
        setCorrectAttempts(correctAttempts + 1);
        addBattleLog(`✅ Correct! You signed "${currentSign.meaning}" perfectly!`);
        setTimeout(() => knightAttack(), 500);
      } else {
        addBattleLog(`❌ Incorrect gesture detected. Try again!`);
        setTimeout(() => monsterAttack(), 500);
      }

      setIsDetecting(false);
    }, 2000);
  };

  const saveProgress = (points: number) => {
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    const progressData = {
      username: student.name,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      accuracy,
      completedAt: new Date().toISOString(),
      totalSigns: lesson.signs.length,
      pointsEarned: points,
    };

    const existingData = localStorage.getItem('lessonProgress');
    const progressHistory = existingData ? JSON.parse(existingData) : [];
    progressHistory.push(progressData);
    localStorage.setItem('lessonProgress', JSON.stringify(progressHistory));

    setTimeout(() => {
      onComplete(points, accuracy);
    }, 3000);
  };

  if (gameOver) {
    const finalAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center"
        >
          {gameOver === 'victory' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl"
              >
                👑
              </motion.div>

              <h2 className="text-gray-900 mb-2">Victory!</h2>
              <p className="text-gray-600 mb-8">
                {student.name} has defeated the {monster.name}!
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 mb-1">Points Earned</p>
                  <p className="text-3xl text-blue-900">{earnedPoints}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-600 mb-1">Accuracy</p>
                  <p className="text-3xl text-green-900">{finalAccuracy}%</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <Sword className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-600 mb-1">Attacks</p>
                  <p className="text-3xl text-purple-900">{correctAttempts}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">Returning to lesson selection...</p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl"
              >
                💔
              </motion.div>

              <h2 className="text-gray-900 mb-2">Defeat</h2>
              <p className="text-gray-600 mb-8">
                The {monster.name} was too strong this time. Keep practicing!
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-orange-600 mb-1">Accuracy</p>
                  <p className="text-3xl text-orange-900">{finalAccuracy}%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <Sword className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 mb-1">Correct Signs</p>
                  <p className="text-3xl text-blue-900">{correctAttempts}/{totalAttempts}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">Returning to lesson selection...</p>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">⚔️ Battle: {lesson.title}</h2>
          <p className="text-gray-600">Student: {student.name}</p>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home className="h-5 w-5" />
          Exit Battle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                ⚔️
              </div>
              <div>
                <p className="text-sm opacity-90">Knight</p>
                <p className="font-semibold">{student.name}</p>
              </div>
            </div>
            <Shield className="h-6 w-6 opacity-80" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">Health</span>
              <span>{knightHealth}/{KNIGHT_MAX_HEALTH}</span>
            </div>
            <div className="w-full bg-blue-900/40 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${(knightHealth / KNIGHT_MAX_HEALTH) * 100}%` }}
                className="h-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center"
                transition={{ duration: 0.3 }}
              >
                <Heart className="h-3 w-3 text-white" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-2">Current Sign</p>
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-5xl">{currentSign.emoji}</span>
            </div>
            <p className="font-semibold mb-1">{currentSign.meaning}</p>
            <p className="text-sm opacity-90">Sign: {currentSign.sign}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {monster.emoji}
              </div>
              <div>
                <p className="text-sm opacity-90">Enemy</p>
                <p className="font-semibold">{monster.name}</p>
              </div>
            </div>
            <Sword className="h-6 w-6 opacity-80" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">Health</span>
              <span>{monsterHealth}/{monster.maxHealth}</span>
            </div>
            <div className="w-full bg-red-900/40 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${(monsterHealth / monster.maxHealth) * 100}%` }}
                className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Camera not started</p>
                </div>
              )}

              {isDetecting && (
                <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-32 h-32 border-4 border-purple-400 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            {!showCamera ? (
              <button
                onClick={() => setShowCamera(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                <Camera className="h-5 w-5" />
                Start Camera
              </button>
            ) : (
              <button
                onClick={simulateGestureDetection}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDetecting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Hand className="h-5 w-5" />
                    Perform Gesture
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 h-[400px] flex flex-col">
            <h3 className="text-gray-900 mb-4">⚔️ Battle Arena</h3>
            <div className="flex-1 relative bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-between px-12">
                <motion.div
                  animate={{
                    x: knightAttacking ? 40 : 0,
                    scale: knightAttacking ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-7xl mb-2">⚔️</div>
                  <div className="w-24 h-2 bg-blue-500 rounded-full mx-auto"></div>
                </motion.div>

                <motion.div
                  animate={{
                    x: monsterAttacking ? -40 : 0,
                    scale: monsterAttacking ? 1.2 : 1,
                    rotate: monsterAttacking ? -10 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-7xl mb-2">{monster.emoji}</div>
                  <div className="w-24 h-2 bg-red-500 rounded-full mx-auto"></div>
                </motion.div>
              </div>

              <AnimatePresence>
                {knightAttacking && (
                  <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.5 }}
                    animate={{ opacity: 1, x: 300, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-1/4 top-1/2 -translate-y-1/2 text-4xl"
                  >
                    💥
                  </motion.div>
                )}
                {monsterAttacking && (
                  <motion.div
                    initial={{ opacity: 0, x: -100, scale: 0.5 }}
                    animate={{ opacity: 1, x: -300, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute right-1/4 top-1/2 -translate-y-1/2 text-4xl"
                  >
                    🔥
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-gray-900 mb-3">📜 Battle Log</h4>
            <div
              ref={battleLogRef}
              className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3"
            >
              {battleLog.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Battle log will appear here...</p>
              ) : (
                battleLog.map((log, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-gray-700 border-l-2 border-blue-400 pl-2"
                  >
                    {log}
                  </motion.p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
