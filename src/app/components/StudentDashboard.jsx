import { motion } from 'motion/react';
import { PlayCircle, Trophy, Sparkles, BookOpen, Hand, BarChart3, ArrowRight } from 'lucide-react';

const lessons = [
  {
    title: 'Numbers 1–20',
    description: 'Learn foundational signs for counting and basic math.',
    difficulty: 'Beginner',
    duration: '10 min',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Addition Basics',
    description: 'Practice adding single-digit numbers with hand signs.',
    difficulty: 'Intermediate',
    duration: '12 min',
    color: 'from-purple-500 to-fuchsia-500',
  },
  {
    title: 'Subtraction Flow',
    description: 'Build confidence with subtracting small quantities.',
    difficulty: 'Intermediate',
    duration: '14 min',
    color: 'from-amber-500 to-orange-500',
  },
];

export function StudentDashboard({ username, onStartLesson }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Welcome back, {username}
            </div>
            <h2 className="text-3xl font-extrabold mb-3">Keep your math sign journey going.</h2>
            <p className="text-blue-100 max-w-2xl">Practice gestures, earn XP, and unlock new lessons with every session.</p>
          </div>
          <button onClick={onStartLesson} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-blue-700 shadow-lg hover:opacity-90">
            Start Lesson <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => (
          <motion.div key={lesson.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lesson.color} flex items-center justify-center mb-4`}>
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">{lesson.title}</h3>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{lesson.difficulty}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{lesson.duration}</span>
              <button className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700">
                Practice <PlayCircle className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-yellow-50 text-yellow-600">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Progress Snapshot</h3>
              <p className="text-sm text-gray-500">You are on a strong streak</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Lessons completed</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-semibold text-gray-900">93%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current streak</span>
              <span className="font-semibold text-gray-900">7 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Hand className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Gesture Focus</h3>
              <p className="text-sm text-gray-500">Try a new sign today</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-gray-900">Plus Sign</p>
              <p className="text-sm text-gray-500">Use your dominant hand to form the sign.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white">
              Try now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
