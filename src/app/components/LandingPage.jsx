import { motion } from 'motion/react';
import {
  Brain,
  Zap,
  BookOpen,
  BarChart3,
  Star,
  ArrowRight,
  Shield,
  Trophy,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Gesture Recognition',
    desc: 'Real-time hand landmark detection powered by machine learning recognizes your signs instantly.',
    color: '#3b82f6',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Zap,
    title: 'Real-Time Feedback',
    desc: 'Get instant visual feedback on every gesture — know right away if your sign is correct.',
    color: '#8b5cf6',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: BookOpen,
    title: 'Math Sign Lessons',
    desc: 'Structured lessons covering numbers 1–100, addition, subtraction, multiplication, and division.',
    color: '#eab308',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
  },
  {
    icon: BarChart3,
    title: 'Performance Tracking',
    desc: 'Detailed analytics, progress bars, and reports so teachers can monitor every student.',
    color: '#22c55e',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
];

const landmarkDots = [
  { top: '15%', left: '20%', delay: 0 },
  { top: '10%', left: '48%', delay: 0.3 },
  { top: '28%', left: '72%', delay: 0.6 },
  { top: '52%', left: '78%', delay: 0.9 },
  { top: '68%', left: '58%', delay: 0.2 },
  { top: '62%', left: '26%', delay: 0.5 },
  { top: '38%', left: '12%', delay: 0.8 },
  { top: '46%', left: '50%', delay: 0.15 },
];

export function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-lg leading-none">🤟</span>
            </div>
            <span className="font-extrabold text-gray-900 text-xl tracking-tight">
              SIGN<span className="text-blue-600">MATH</span>
            </span>
          </div>
        </div>
      </nav>

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
              Designed for SPED Students
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              Learn Math Through{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Sign Language
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              SIGNMATH combines gesture recognition with gamified math lessons — making learning accessible, engaging, and fun for every student.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-200 hover:shadow-xl"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-10">
              {[
                ['500+', 'SPED Students'],
                ['95%', 'Avg. Accuracy'],
                ['50+', 'Sign Lessons'],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-gray-900">{val}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-[3px] shadow-2xl shadow-purple-200">
              <div className="bg-gray-950 rounded-[22px] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2 border-b border-gray-800">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-gray-400 text-xs font-medium">SIGNMATH — Gesture Recognition</span>
                </div>

                <div className="aspect-[16/10] bg-gray-900 relative flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />

                  <div className="relative flex items-center justify-center w-full h-full">
                    <span className="text-[110px] select-none leading-none">🤟</span>

                    {landmarkDots.map((d, i) => (
                      <motion.span
                        key={i}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{ repeat: Infinity, duration: 2, delay: d.delay }}
                        className="absolute w-3 h-3 rounded-full bg-yellow-400 shadow-md shadow-yellow-400/50"
                        style={{ top: d.top, left: d.left }}
                      />
                    ))}

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="20%" y1="15%" x2="48%" y2="10%" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.35" />
                      <line x1="48%" y1="10%" x2="72%" y2="28%" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.35" />
                      <line x1="72%" y1="28%" x2="78%" y2="52%" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.35" />
                      <line x1="78%" y1="52%" x2="58%" y2="68%" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.35" />
                      <line x1="58%" y1="68%" x2="26%" y2="62%" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.35" />
                      <line x1="26%" y1="62%" x2="12%" y2="38%" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.35" />
                      <line x1="12%" y1="38%" x2="20%" y2="15%" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.35" />
                      <line x1="50%" y1="50%" x2="50%" y2="50%" stroke="transparent" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`rounded-2xl border p-6 ${feature.bg} ${feature.border}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm">
                    <Icon className="h-6 w-6" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">Built for accessible learning</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-purple-700 p-10 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-sm font-semibold mb-4">
                <Shield className="h-4 w-4" />
                Safe, guided, interactive
              </div>
              <h2 className="text-3xl font-extrabold mb-3">Ready to learn with your hands?</h2>
              <p className="text-blue-100 max-w-2xl">Start the journey with guided lessons, live feedback, and progress tracking in one place.</p>
            </div>
            <button
              onClick={onLogin}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-blue-700 shadow-lg hover:opacity-90"
            >
              Begin Learning <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
