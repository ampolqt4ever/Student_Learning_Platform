import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  GraduationCap,
  BookOpen,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { motion } from "motion/react";

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginPageProps {
  onLogin: (
    username: string,
    role: "admin" | "student",
  ) => void;
  onBack: () => void;
}

type RoleKey = "student" | "teacher";

const roleCards: Array<{
  key: RoleKey;
  label: string;
  icon: React.ElementType;
  desc: string;
  gradient: string;
  ring: string;
  iconBg: string;
  iconColor: string;
}> = [
  {
    key: "student",
    label: "Student",
    icon: GraduationCap,
    desc: "Access lessons & track progress",
    gradient: "from-blue-500 to-blue-600",
    ring: "ring-blue-400/40",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "teacher",
    label: "Teacher / Admin",
    icon: BookOpen,
    desc: "Manage students, lessons & system",
    gradient: "from-purple-500 to-purple-600",
    ring: "ring-purple-400/40",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const roleMap: Record<RoleKey, "admin" | "student"> = {
  student: "student",
  teacher: "admin",
};

const demoAccounts = [
  {
    username: "admin",
    password: "admin123",
    role: "admin" as const,
    display: "Admin",
  },
  {
    username: "teacher",
    password: "teacher123",
    role: "admin" as const,
    display: "Teacher",
  },
  {
    username: "student1",
    password: "student123",
    role: "student" as const,
    display: "Student",
  },
  {
    username: "john",
    password: "john123",
    role: "student" as const,
    display: "Student",
  },
];

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [selectedRole, setSelectedRole] =
    useState<RoleKey | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    setError("");
    const user = demoAccounts.find(
      (u) =>
        u.username === data.username &&
        u.password === data.password,
    );
    if (!user) {
      setError("Invalid username or password.");
      return;
    }
    // If a role card is selected, validate it matches
    if (selectedRole) {
      const expected = roleMap[selectedRole];
      if (user.role !== expected) {
        setError(
          `This account is not registered as a ${selectedRole}.`,
        );
        return;
      }
    }
    onLogin(data.username, user.role);
  };

  const active = roleCards.find((c) => c.key === selectedRole);

  return (
    <div className="min-h-screen flex">
      {/* ── Left branded panel ── */}
      <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm w-full text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30">
            <span className="text-4xl leading-none">🤟</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            SIGN<span className="text-yellow-300">MATH</span>
          </h1>
          <p className="text-blue-100 text-base mb-12 leading-relaxed">
            Gamified mathematical sign language learning for
            SPED students
          </p>

          {/* Feature list */}
          <div className="space-y-3 text-left">
            {[
              { icon: "🤖", text: "gesture recognition" },
              {
                icon: "⚡",
                text: "Real-time feedback on every sign",
              },
              {
                icon: "🏆",
                text: "Points, badges & level progression",
              },
              {
                icon: "📊",
                text: "Detailed analytics & reports",
              },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + i * 0.5,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/90 text-sm font-medium">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Floating CTA */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: "easeInOut",
            }}
            className="mt-10 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold px-5 py-2.5 rounded-2xl shadow-lg"
          >
            ✋ Start Learning Today!
          </motion.div>
        </div>
      </div>

      {/* ── Right form panel ── */}
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
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Select your role, then sign in to continue.
            </p>
          </div>

          {/* Role cards */}
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
                      : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md text-gray-700"
                  }`}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)",
                      }}
                    />
                  )}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${isActive ? "bg-white/25" : card.iconBg}`}
                  >
                    <card.icon
                      className={`h-6 w-6 ${isActive ? "text-white" : card.iconColor}`}
                    />
                  </div>
                  <div className="text-center">
                    <span
                      className={`block text-sm font-extrabold tracking-tight ${isActive ? "text-white" : "text-gray-900"}`}
                    >
                      {card.label}
                    </span>
                    <span
                      className={`block text-xs mt-0.5 leading-snug ${isActive ? "text-white/75" : "text-gray-400"}`}
                    >
                      {card.desc}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:opacity-90 bg-gradient-to-r ${
                active
                  ? active.gradient
                  : "from-blue-500 to-purple-600"
              }`}
            >
              {active
                ? `Sign in as ${active.label}`
                : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="space-y-1">
              {demoAccounts.map((u) => (
                <div
                  key={u.username}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-gray-600">
                    {u.display}
                  </span>
                  <span className="font-mono text-gray-400">
                    {u.username} / {u.password}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}