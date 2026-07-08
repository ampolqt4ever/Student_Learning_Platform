import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  GraduationCap,
  BookOpen,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'motion/react';

const roleCards = [
  {
    key: 'student',
    label: 'Student',
    icon: GraduationCap,
    desc: 'Access lessons & track progress',
    gradient: 'from-blue-500 to-blue-600',
    ring: 'ring-blue-400/40',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    key: 'teacher',
    label: 'Teacher / Admin',
    icon: BookOpen,
    desc: 'Manage students, lessons & system',
    gradient: 'from-purple-500 to-purple-600',
    ring: 'ring-purple-400/40',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const roleMap = {
  student: 'student',
  teacher: 'admin',
};

const demoAccounts = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    display: 'Admin',
  },
  {
    username: 'teacher',
    password: 'teacher123',
    role: 'admin',
    display: 'Teacher',
  },
  {
    username: 'student1',
    password: 'student123',
    role: 'student',
    display: 'Student',
  },
  {
    username: 'john',
    password: 'john123',
    role: 'student',
    display: 'Student',
  },
];

export function LoginPage({ onLogin, onBack }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setError('');
    const user = demoAccounts.find(
      (u) => u.username === data.username && u.password === data.password,
    );
    if (!user) {
      setError('Invalid username or password.');
      return;
    }

    if (selectedRole) {
      const expected = roleMap[selectedRole];
      if (user.role !== expected) {
        setError(`This account is not registered as a ${selectedRole}.`);
        return;
      }
    }

    onLogin(data.username, user.role);
  };

  const active = roleCards.find((c) => c.key === selectedRole);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30">
            <span className="text-4xl leading-none">🤟</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            SIGN<span className="text-yellow-300">MATH</span>
          </h1>
          <p className="text-blue-100 text-base mb-12 leading-relaxed">
            Gamified mathematical sign language learning for SPED students
          </p>

          <div className="space-y-3 text-left">
            {[
              { icon: '🤖', text: 'gesture recognition' },
              { icon: '⚡', text: 'Real-time feedback on every sign' },
              { icon: '🏆', text: 'Points, badges & level progression' },
              { icon: '📊', text: 'Detailed analytics & reports' },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut', delay: i * 0.3 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/90 text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold px-5 py-2.5 rounded-2xl shadow-lg"
          >
            ✋ Start Learning Today!
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm">Select your role, then sign in to continue.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {roleCards.map((card) => {
              const isActive = selectedRole === card.key;
              return (
                <motion.button
                  key={card.key}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedRole(card.key)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isActive
                      ? `border-transparent bg-gradient-to-br ${card.gradient} text-white shadow-xl ring-4 ${card.ring}`
                      : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md text-gray-700'
                  }`}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }}
                    />
                  )}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${isActive ? 'bg-white/25' : card.iconBg}`}>
                    <card.icon className={`h-6 w-6 ${isActive ? 'text-white' : card.iconColor}`} />
                  </div>
                  <div className="text-center">
                    <span className={`block text-sm font-extrabold tracking-tight ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {card.label}
                    </span>
                    <span className={`block text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {card.desc}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Shield className="h-4 w-4 text-blue-600" />
                {active ? `Signing in as ${active.label}` : 'Select a role'}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('username', { required: 'Username is required' })}
                      type="text"
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('password', { required: 'Password is required' })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            Demo accounts: admin / admin123, teacher / teacher123, student1 / student123
          </div>
        </div>
      </div>
    </div>
  );
}
