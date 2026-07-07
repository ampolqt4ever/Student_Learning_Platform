import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import {
  Trophy, Star, Zap, ChevronLeft, ChevronRight,
  Lock, CheckCircle, Play, Target, Flame, Award,
  BookOpen,
} from 'lucide-react';

interface StudentDashboardProps {
  username: string;
  onStartLesson: () => void;
}

const GAME = {
  level: 5,
  xp: 450,
  xpMax: 600,
  points: 2450,
  streak: 7,
  nextLevel: 6,
};

const BADGES = [
  { emoji: '🏆', label: 'First Win', earned: true },
  { emoji: '⭐', label: 'Star Performer', earned: true },
  { emoji: '🔥', label: '7-Day Streak', earned: true },
  { emoji: '🎯', label: 'Sharp Shooter', earned: true },
  { emoji: '💡', label: 'Quick Learner', earned: true },
  { emoji: '🛡️', label: 'Champion', earned: false },
  { emoji: '💎', label: 'Diamond', earned: false },
  { emoji: '🚀', label: 'Rocket', earned: false },
];

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  completion: number;
  xp: number;
  difficulty: Difficulty;
  locked: boolean;
  description: string;
  gradient: string;
  accentColor: string;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Numbers 1–10',
    subtitle: 'Foundation',
    emoji: '1️⃣',
    completion: 100,
    xp: 150,
    difficulty: 'Beginner',
    locked: false,
    description: 'Master the hand signs for numbers 1 through 10. The building blocks of sign language math.',
    gradient: 'from-green-500 to-emerald-600',
    accentColor: '#10b981',
  },
  {
    id: 2,
    title: 'Numbers 11–20',
    subtitle: 'Teen Numbers',
    emoji: '🔢',
    completion: 80,
    xp: 200,
    difficulty: 'Beginner',
    locked: false,
    description: 'Learn the compound signs for teen numbers, building on your foundation from 1–10.',
    gradient: 'from-blue-500 to-blue-600',
    accentColor: '#3b82f6',
  },
  {
    id: 3,
    title: 'Numbers 21–50',
    subtitle: 'Expanding Range',
    emoji: '✌️',
    completion: 45,
    xp: 250,
    difficulty: 'Beginner',
    locked: false,
    description: 'Extend your number vocabulary to fifty with clear, confident sign combinations.',
    gradient: 'from-purple-500 to-violet-600',
    accentColor: '#8b5cf6',
  },
  {
    id: 4,
    title: 'Numbers 51–100',
    subtitle: 'Century Range',
    emoji: '💯',
    completion: 10,
    xp: 300,
    difficulty: 'Intermediate',
    locked: false,
    description: 'Complete your number mastery from 51 all the way to 100 with precision signing.',
    gradient: 'from-pink-500 to-rose-600',
    accentColor: '#ec4899',
  },
  {
    id: 5,
    title: 'Addition',
    subtitle: 'Math Operations',
    emoji: '➕',
    completion: 0,
    xp: 350,
    difficulty: 'Intermediate',
    locked: false,
    description: 'Sign addition expressions and answers. Combine number signs with the plus gesture.',
    gradient: 'from-yellow-500 to-orange-500',
    accentColor: '#f59e0b',
  },
  {
    id: 6,
    title: 'Subtraction',
    subtitle: 'Math Operations',
    emoji: '➖',
    completion: 0,
    xp: 350,
    difficulty: 'Intermediate',
    locked: true,
    description: 'Learn to sign subtraction problems and express the minus sign with confidence.',
    gradient: 'from-orange-500 to-red-500',
    accentColor: '#f97316',
  },
  {
    id: 7,
    title: 'Multiplication',
    subtitle: 'Advanced Math',
    emoji: '✖️',
    completion: 0,
    xp: 450,
    difficulty: 'Advanced',
    locked: true,
    description: 'Sign multiplication tables and expressions — a key milestone in your math journey.',
    gradient: 'from-red-500 to-rose-700',
    accentColor: '#ef4444',
  },
  {
    id: 8,
    title: 'Division',
    subtitle: 'Advanced Math',
    emoji: '➗',
    completion: 0,
    xp: 450,
    difficulty: 'Advanced',
    locked: true,
    description: 'Master division signs to complete your full suite of arithmetic in sign language.',
    gradient: 'from-indigo-500 to-purple-700',
    accentColor: '#6366f1',
  },
];

const DIFF_COLORS: Record<Difficulty, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-red-100 text-red-700',
};

export function StudentDashboard({ username, onStartLesson }: StudentDashboardProps) {
  const CARD_WIDTH = 280;
  const CARD_GAP = 24;
  const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_GAP;

  const [selected, setSelected] = useState(1); // index of center card
  const [isDragging, setIsDragging] = useState(false);
  const hasDragged = useRef(false);

  // Continuous drag scrolling with momentum
  const dragX = useMotionValue(-CARD_TOTAL_WIDTH); // Start at index 1
  const dragStartX = useRef(0);
  const lastMouseX = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef<number>();

  // Smooth spring animation for snapping
  const scrollX = useSpring(dragX, {
    stiffness: 180,
    damping: 30,
    mass: 0.5,
  });

  const carouselRef = useRef<HTMLDivElement>(null);
  const xpPct = Math.round((GAME.xp / GAME.xpMax) * 100);

  // Calculate which card is closest to center based on scroll position
  const getClosestCardIndex = useCallback((scrollPosition: number) => {
    const index = Math.round(-scrollPosition / CARD_TOTAL_WIDTH);
    return Math.max(0, Math.min(LESSONS.length - 1, index));
  }, [CARD_TOTAL_WIDTH]);

  // Snap to the nearest card
  const snapToCard = useCallback((index: number) => {
    const targetX = -index * CARD_TOTAL_WIDTH;
    setSelected(index);

    animate(dragX, targetX, {
      type: 'spring',
      stiffness: 180,
      damping: 30,
      mass: 0.5,
    });
  }, [dragX, CARD_TOTAL_WIDTH]);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(LESSONS.length - 1, idx));
    setSelected(clamped);
    snapToCard(clamped);
  }, [snapToCard]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    lastMouseX.current = e.clientX;
    velocity.current = 0;

    // Cancel any ongoing animations
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const deltaX = Math.abs(currentX - dragStartX.current);

    // Mark as dragged if moved more than 3px
    if (deltaX > 3) {
      hasDragged.current = true;
    }

    // Calculate velocity for momentum
    velocity.current = currentX - lastMouseX.current;
    lastMouseX.current = currentX;

    // Update drag position in real-time with boundaries
    const currentScroll = dragX.get();
    const newScroll = currentScroll + velocity.current;

    // Clamp scroll within boundaries (with some elasticity)
    const minScroll = -(LESSONS.length - 1) * CARD_TOTAL_WIDTH - 100;
    const maxScroll = 100;
    const clampedScroll = Math.max(minScroll, Math.min(maxScroll, newScroll));

    dragX.set(clampedScroll);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Apply momentum/inertia
    const applyMomentum = () => {
      const currentScroll = dragX.get();
      let newScroll = currentScroll + velocity.current;

      // Apply boundary resistance
      const minScroll = -(LESSONS.length - 1) * CARD_TOTAL_WIDTH;
      const maxScroll = 0;

      if (newScroll > maxScroll || newScroll < minScroll) {
        // Strong damping when outside bounds
        velocity.current *= 0.7;
        newScroll = Math.max(minScroll - 50, Math.min(maxScroll + 50, newScroll));
      }

      dragX.set(newScroll);

      // Friction - gradually reduce velocity
      velocity.current *= 0.94;

      // Continue momentum until velocity is small
      if (Math.abs(velocity.current) > 0.3) {
        animationFrame.current = requestAnimationFrame(applyMomentum);
      } else {
        // Snap to nearest card when momentum stops
        const closestIndex = getClosestCardIndex(dragX.get());
        snapToCard(closestIndex);
      }
    };

    // Start momentum animation if there's significant velocity
    if (Math.abs(velocity.current) > 1.5) {
      applyMomentum();
    } else {
      // Snap immediately if released without momentum
      const closestIndex = getClosestCardIndex(dragX.get());
      snapToCard(closestIndex);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragStartX.current = e.touches[0].clientX;
    lastMouseX.current = e.touches[0].clientX;
    velocity.current = 0;

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const deltaX = Math.abs(currentX - dragStartX.current);

    if (deltaX > 3) {
      hasDragged.current = true;
    }

    velocity.current = currentX - lastMouseX.current;
    lastMouseX.current = currentX;

    const currentScroll = dragX.get();
    const newScroll = currentScroll + velocity.current;

    // Clamp scroll within boundaries (with some elasticity)
    const minScroll = -(LESSONS.length - 1) * CARD_TOTAL_WIDTH - 100;
    const maxScroll = 100;
    const clampedScroll = Math.max(minScroll, Math.min(maxScroll, newScroll));

    dragX.set(clampedScroll);
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const applyMomentum = () => {
      const currentScroll = dragX.get();
      let newScroll = currentScroll + velocity.current;

      const minScroll = -(LESSONS.length - 1) * CARD_TOTAL_WIDTH;
      const maxScroll = 0;

      if (newScroll > maxScroll || newScroll < minScroll) {
        velocity.current *= 0.7;
        newScroll = Math.max(minScroll - 50, Math.min(maxScroll + 50, newScroll));
      }

      dragX.set(newScroll);
      velocity.current *= 0.94;

      if (Math.abs(velocity.current) > 0.3) {
        animationFrame.current = requestAnimationFrame(applyMomentum);
      } else {
        const closestIndex = getClosestCardIndex(dragX.get());
        snapToCard(closestIndex);
      }
    };

    if (Math.abs(velocity.current) > 1.5) {
      applyMomentum();
    } else {
      const closestIndex = getClosestCardIndex(dragX.get());
      snapToCard(closestIndex);
    }
  };

  // Update selected card based on scroll position in real-time
  useEffect(() => {
    const unsubscribe = scrollX.on('change', (latest) => {
      const closestIndex = getClosestCardIndex(latest);
      if (closestIndex !== selected) {
        setSelected(closestIndex);
      }
    });

    return () => unsubscribe();
  }, [scrollX, selected, getClosestCardIndex]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const lesson = LESSONS[selected];

  return (
    <div className="max-w-7xl mx-auto space-y-8 select-none">

      {/* ── Welcome bar ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 text-white shadow-2xl"
      >
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-300" />
              <span className="text-orange-200 text-sm font-bold">{GAME.streak}-Day Streak!</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-1">
              Welcome back, <span className="text-yellow-300 capitalize">{username}</span>! 👋
            </h1>
            <p className="text-blue-200">Keep going — you're on fire! Complete today's lesson to keep your streak alive.</p>
          </div>

          {/* XP + level ring */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#facc15" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - xpPct / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold leading-none">Lv.{GAME.level}</span>
                <span className="text-xs text-blue-200">{xpPct}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-200">{GAME.xp} / {GAME.xpMax} XP</p>
              <p className="text-xs text-yellow-300 font-bold">{GAME.points.toLocaleString()} pts</p>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Lessons Done', value: '5/8', icon: BookOpen },
            { label: 'Avg Accuracy', value: '88%', icon: Target },
            { label: 'Total XP', value: `${GAME.points.toLocaleString()}`, icon: Star },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
              <s.icon className="h-5 w-5 text-yellow-300 flex-shrink-0" />
              <div>
                <p className="text-lg font-extrabold leading-none">{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Carousel section ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Your Lessons</h2>
            <p className="text-sm text-gray-500 mt-0.5">Drag or tap to browse · Click a card to select</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goTo(selected - 1)}
              disabled={selected === 0}
              className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-30 transition-all duration-300 ease-out"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => goTo(selected + 1)}
              disabled={selected === LESSONS.length - 1}
              className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-30 transition-all duration-300 ease-out"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={carouselRef}
          className="relative flex items-center overflow-hidden"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', minHeight: 300, userSelect: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            className="flex gap-6 items-center py-4"
            style={{
              perspective: 1200,
              x: scrollX,
              paddingLeft: 'calc(50% - 140px)', // Center first card initially
              willChange: 'transform',
            }}
          >
            {LESSONS.map((l, i) => {
              const offset = i - selected;
              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              const distance = Math.abs(offset);

              // Calculate dynamic scale and opacity based on distance
              const scale = isCenter ? 1 : isAdjacent ? 0.85 : Math.max(0.7, 1 - distance * 0.12);
              const opacity = isCenter ? 1 : isAdjacent ? 0.75 : Math.max(0.35, 1 - distance * 0.2);

              return (
                <motion.div
                  key={l.id}
                  onClick={() => {
                    // Prevent click if user was dragging
                    if (hasDragged.current) return;
                    goTo(i);
                  }}
                  animate={{
                    scale,
                    opacity,
                    zIndex: isCenter ? 30 : isAdjacent ? 20 : 10,
                    rotateY: offset * -5,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 35,
                    mass: 0.8,
                    restDelta: 0.001,
                  }}
                  className="relative flex-shrink-0"
                  style={{ width: 280, cursor: isCenter ? 'default' : 'pointer' }}
                >
                  {/* Card */}
                  <div
                    className={`relative rounded-3xl overflow-hidden shadow-xl transition-all duration-500 ease-out ${
                      isCenter
                        ? 'ring-4 ring-offset-2 shadow-2xl'
                        : ''
                    }`}
                    style={{
                      boxShadow: isCenter ? `0 25px 60px -10px ${l.accentColor}55` : undefined,
                      ringColor: isCenter ? l.accentColor : undefined,
                      border: isCenter ? `2px solid ${l.accentColor}` : '2px solid transparent',
                    }}
                  >
                    {/* Gradient header */}
                    <div className={`bg-gradient-to-br ${l.gradient} p-6 relative overflow-hidden`}>
                      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-black/10 rounded-full" />

                      {/* Badges */}
                      <div className="flex items-start justify-between relative z-10">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${DIFF_COLORS[l.difficulty]}`}>
                          {l.difficulty}
                        </span>
                        <div>
                          {l.locked && <Lock className="h-5 w-5 text-white/70" />}
                          {!l.locked && l.completion === 100 && (
                            <CheckCircle className="h-5 w-5 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Emoji */}
                      <div className="flex items-center justify-center py-4 relative z-10">
                        <span className={`${isCenter ? 'text-7xl' : 'text-5xl'} leading-none drop-shadow-lg transition-all duration-500 ease-out`}>
                          {l.emoji}
                        </span>
                      </div>

                      {/* XP badge */}
                      <div className="flex justify-center relative z-10">
                        <span className="flex items-center gap-1 bg-black/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                          <Zap className="h-3 w-3 text-yellow-300" />
                          +{l.xp} XP
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="bg-white p-4">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{l.subtitle}</p>
                      <h3 className="font-extrabold text-gray-900 mt-0.5 leading-tight">{l.title}</h3>

                      {isCenter && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="text-xs text-gray-500 mt-2 leading-relaxed"
                        >
                          {l.description}
                        </motion.p>
                      )}

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-bold text-gray-700">{l.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${l.completion}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-2 rounded-full bg-gradient-to-r ${l.gradient}`}
                          />
                        </div>
                      </div>

                      {/* CTA — only on selected card */}
                      <AnimatePresence>
                        {isCenter && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                            className="mt-4"
                          >
                            {l.locked ? (
                              <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold">
                                <Lock className="h-4 w-4" />
                                Complete previous lesson
                              </div>
                            ) : (
                              <button
                                onMouseDown={e => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                                onClick={e => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  onStartLesson();
                                }}
                                className={`flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r ${l.gradient} text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out`}
                                style={{ boxShadow: `0 4px 20px -4px ${l.accentColor}88` }}
                              >
                                <Play className="h-4 w-4 fill-white" />
                                {l.completion === 100 ? 'Review Lesson' : l.completion > 0 ? 'Continue' : 'Start Lesson'}
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Dot indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {LESSONS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 ease-out ${
                i === selected
                  ? 'w-6 h-2.5 bg-blue-600'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Gamification section ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Award className="h-5 w-5 text-purple-500" />
            <h3 className="font-bold text-gray-900">Achievement Badges</h3>
            <span className="ml-auto text-xs text-gray-400">
              {BADGES.filter(b => b.earned).length}/{BADGES.length} earned
            </span>
          </div>
          <div className={`grid grid-cols-4 gap-4 ${isDragging ? 'pointer-events-none' : ''}`}>
            {BADGES.map((b, i) => (
              <motion.div
                key={b.label}
                initial={false}
                transition={{ delay: 0.2 + i * 0.06, type: 'spring', stiffness: 300 }}
                title={b.label}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl cursor-default transition-all ${
                  b.earned
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:shadow-md hover:-translate-y-0.5'
                    : 'bg-gray-50 border border-gray-100 opacity-40 grayscale'
                }`}
              >
                <span className="text-3xl leading-none">{b.emoji}</span>
                <span className="text-xs text-center text-gray-600 font-semibold leading-tight">{b.label}</span>
                {b.earned && (
                  <span className="text-[10px] text-yellow-600 font-bold bg-yellow-100 px-1.5 py-0.5 rounded-full">Earned</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Points + level progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5"
        >
          {/* Total points */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 text-center border border-blue-100">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-4xl font-extrabold text-gray-900">{GAME.points.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total Points Earned</p>
          </div>

          {/* Level progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-bold text-gray-700">Level {GAME.level}</span>
              <span className="font-bold text-purple-600">Level {GAME.nextLevel}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 rounded-full" />
              </motion.div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>{GAME.xp} XP</span>
              <span>{GAME.xpMax - GAME.xp} XP to go</span>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">{GAME.streak} days</p>
              <p className="text-xs text-gray-500 mt-0.5">Daily Streak</p>
            </div>
          </div>

          {/* Trophy */}
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900">Level {GAME.level} Knight</p>
              <p className="text-xs text-gray-500">{BADGES.filter(b => b.earned).length} badges earned</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
