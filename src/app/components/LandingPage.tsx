import { motion } from "motion/react";
import {
  Brain,
  Zap,
  BookOpen,
  BarChart3,
  Star,
  ArrowRight,
  Hand,
  Shield,
  Trophy,
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const features = [
  {
    icon: Brain,
    title: "AI Gesture Recognition",
    desc: "Real-time hand landmark detection powered by machine learning recognizes your signs instantly.",
    color: "#3b82f6",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Zap,
    title: "Real-Time Feedback",
    desc: "Get instant visual feedback on every gesture — know right away if your sign is correct.",
    color: "#8b5cf6",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: BookOpen,
    title: "Math Sign Lessons",
    desc: "Structured lessons covering numbers 1–100, addition, subtraction, multiplication, and division.",
    color: "#eab308",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    desc: "Detailed analytics, progress bars, and reports so teachers can monitor every student.",
    color: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-100",
  },
];

const landmarkDots = [
  { top: "15%", left: "20%", delay: 0 },
  { top: "10%", left: "48%", delay: 0.3 },
  { top: "28%", left: "72%", delay: 0.6 },
  { top: "52%", left: "78%", delay: 0.9 },
  { top: "68%", left: "58%", delay: 0.2 },
  { top: "62%", left: "26%", delay: 0.5 },
  { top: "38%", left: "12%", delay: 0.8 },
  { top: "46%", left: "50%", delay: 0.15 },
];

export function LandingPage({
  onLogin,
  onRegister,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Navbar */}
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
          <div className="flex items-center gap-3"></div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
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
              Learn Math Through{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Sign Language
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              SIGNMATH combines gesture recognition with
              gamified math lessons — making learning
              accessible, engaging, and fun for every student.
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
                ["500+", "SPED Students"],
                ["95%", "Avg. Accuracy"],
                ["50+", "Sign Lessons"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-gray-900">
                    {val}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: webcam illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-[3px] shadow-2xl shadow-purple-200">
              <div className="bg-gray-950 rounded-[22px] overflow-hidden">
                {/* Window chrome */}
                <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2 border-b border-gray-800">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-gray-400 text-xs font-medium">
                    SIGNMATH — Gesture Recognition
                  </span>
                </div>

                {/* Webcam feed */}
                <div className="aspect-[16/10] bg-gray-900 relative flex items-center justify-center overflow-hidden">
                  {/* Grid overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Hand + landmark dots */}
                  <div className="relative flex items-center justify-center w-full h-full">
                    <span className="text-[110px] select-none leading-none">
                      🤟
                    </span>

                    {landmarkDots.map((d, i) => (
                      <motion.span
                        key={i}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: d.delay,
                        }}
                        className="absolute w-3 h-3 rounded-full bg-yellow-400 shadow-md shadow-yellow-400/50"
                        style={{ top: d.top, left: d.left }}
                      />
                    ))}

                    {/* Connecting lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line
                        x1="20%"
                        y1="15%"
                        x2="48%"
                        y2="10%"
                        stroke="#facc15"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      />
                      <line
                        x1="48%"
                        y1="10%"
                        x2="72%"
                        y2="28%"
                        stroke="#facc15"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      />
                      <line
                        x1="72%"
                        y1="28%"
                        x2="78%"
                        y2="52%"
                        stroke="#facc15"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      />
                      <line
                        x1="78%"
                        y1="52%"
                        x2="58%"
                        y2="68%"
                        stroke="#facc15"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      />
                      <line
                        x1="58%"
                        y1="68%"
                        x2="26%"
                        y2="62%"
                        stroke="#facc15"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      />
                      <line
                        x1="26%"
                        y1="62%"
                        x2="12%"
                        y2="38%"
                        stroke="#facc15"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      />
                      <line
                        x1="12%"
                        y1="38%"
                        x2="20%"
                        y2="15%"
                        stroke="#facc15"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      />
                      <line
                        x1="50%"
                        y1="46%"
                        x2="48%"
                        y2="10%"
                        stroke="#facc15"
                        strokeWidth="1"
                        strokeOpacity="0.2"
                      />
                    </svg>
                  </div>

                  {/* AI result overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-semibold">
                        AI Prediction: Three (3)
                      </span>
                      <span className="text-green-400 text-xs font-bold bg-green-400/20 px-2 py-0.5 rounded-full">
                        ✓ Correct
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: "40%" }}
                          animate={{ width: "94%" }}
                          transition={{
                            duration: 1.5,
                            ease: "easeOut",
                            delay: 0.5,
                          }}
                          className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-white text-xs font-bold">
                        94%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="absolute -top-5 -right-5 bg-yellow-400 rounded-2xl px-4 py-2.5 shadow-xl shadow-yellow-200"
            >
              <span className="text-sm font-extrabold text-yellow-900">
                🏆 Level 5 Achieved!
              </span>
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-4 py-2.5 shadow-xl border border-gray-100"
            >
              <span className="text-sm font-bold text-gray-800">
                ⭐ 2,450 XP Earned
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Powerful tools designed specifically for SPED
              students and their educators
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`group bg-white border ${f.border} rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-default`}
              >
                <div
                  className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <f.icon
                    className="h-6 w-6"
                    style={{ color: f.color }}
                  />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              How SIGNMATH Works
            </h2>
            <p className="text-xl text-gray-500">
              Three simple steps to start learning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: Hand,
                title: "Choose a Lesson",
                desc: "Pick from numbers, addition, subtraction, multiplication, or division lessons.",
                bg: "bg-blue-100",
                color: "text-blue-600",
              },
              {
                step: "02",
                icon: Brain,
                title: "Show Your Gesture",
                desc: "Use your webcam to perform the hand sign. Our AI recognizes it in real time.",
                bg: "bg-purple-100",
                color: "text-purple-600",
              },
              {
                step: "03",
                icon: Trophy,
                title: "Earn Rewards",
                desc: "Get points, badges, and level up as you master each sign and complete lessons.",
                bg: "bg-yellow-100",
                color: "text-yellow-600",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}
                >
                  <item.icon
                    className={`h-8 w-8 ${item.color}`}
                  />
                </div>
                <div className="text-xs font-black text-gray-300 tracking-widest mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Shield className="h-4 w-4" />
            Safe &amp; Accessible Platform
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to start learning?
          </h2>
          <p className="text-blue-100 text-xl mb-10 leading-relaxed">
            Join hundreds of SPED students already learning math
            through sign language with SIGNMATH.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm leading-none">🤟</span>
            </div>
            <span className="font-extrabold text-white text-sm">
              SIGN<span className="text-blue-400">MATH</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 SIGNMATH. Empowering SPED students through
            technology.
          </p>
        </div>
      </footer>
    </div>
  );
}