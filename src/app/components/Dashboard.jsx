import { useState } from 'react';
import { motion } from 'motion/react';
import { StudentManagement } from './StudentManagement';
import { MathLessonInterface } from './MathLessonInterface';
import { ReportingModule } from './ReportingModule';
import { LessonManagement } from './LessonManagement';
import { TeacherDashboard } from './TeacherDashboard';
import { AdminDashboard } from './AdminDashboard.jsx';
import { GestureRecognitionScreen } from './GestureRecognitionScreen';
import { ReportsAnalytics } from './ReportsAnalytics';
import { StudentDashboard } from './StudentDashboard';
import {
  BookOpen, Users, BarChart3, LogOut, Menu, X,
  Upload, ChevronRight, Star, Zap, Trophy, Hand,
  LayoutDashboard, Settings, Home,
} from 'lucide-react';

const GAME = { level: 5, xp: 450, xpMax: 600, points: 2450, streak: 7, badges: ['🏆', '⭐', '🔥', '🎯', '💡'] };

function GamificationStrip() {
  const pct = Math.round((GAME.xp / GAME.xpMax) * 100);
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-1">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-yellow-300 flex-shrink-0" />
          <span className="text-sm font-bold">Lv. {GAME.level}</span>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
          <span className="text-xs text-blue-200 whitespace-nowrap">{GAME.xp}/{GAME.xpMax} XP</span>
          <div className="flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
              className="h-1.5 bg-yellow-400 rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-yellow-300 flex-shrink-0" />
          <span className="text-sm font-bold">{GAME.points.toLocaleString()} pts</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-orange-300 flex-shrink-0" />
          <span className="text-sm font-bold">{GAME.streak}-day streak</span>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {GAME.badges.map((b, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 300 }}
              className="text-lg leading-none"
              title="Badge"
            >
              {b}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ username, role, onLogout }) {
  const [activeView, setActiveView] = useState(role === 'admin' ? 'teacher-dashboard' : 'student-home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { id: 'student-home', label: 'Dashboard', icon: Home, roles: ['student'] },
    { id: 'teacher-dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Settings, roles: ['admin'] },
    { id: 'lessons', label: 'Math Lessons', icon: BookOpen, roles: ['admin', 'student'] },
    { id: 'gesture-recognition', label: 'Gesture Recognition', icon: Hand, roles: ['admin', 'student'] },
    { id: 'lesson-management', label: 'Manage Lessons', icon: Upload, roles: ['admin'] },
    { id: 'students', label: 'Student Management', icon: Users, roles: ['admin'] },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3, roles: ['admin', 'student'] },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(role));

  const navigate = (id) => {
    setActiveView(id);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: drawerOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-lg leading-none">🤟</span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 tracking-tight">
                SIGN<span className="text-blue-600">MATH</span>
              </p>
              <p className="text-xs text-gray-500 capitalize">{username}</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {role === 'student' && (
          <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-gray-700">Level {GAME.level}</span>
              <span className="text-gray-500">{GAME.xp}/{GAME.xpMax} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                style={{ width: `${Math.round((GAME.xp / GAME.xpMax) * 100)}%` }}
              />
            </div>
            <div className="flex gap-1 mt-2">
              {GAME.badges.map((b, i) => <span key={i} className="text-base">{b}</span>)}
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item, i) => {
            const active = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: drawerOpen ? 1 : 0, x: drawerOpen ? 0 : -16 }}
                transition={{ delay: drawerOpen ? i * 0.06 : 0, duration: 0.2 }}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left text-sm font-semibold">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 opacity-60" />}
              </motion.button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </motion.aside>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow">
                  <span className="text-base leading-none">🤟</span>
                </div>
                <span className="font-extrabold text-gray-900 tracking-tight">
                  SIGN<span className="text-blue-600">MATH</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {role === 'student' && (
                <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">Lv. {GAME.level} · {GAME.points.toLocaleString()} pts</span>
                </div>
              )}
              <span className={`hidden sm:inline-flex text-xs font-bold px-3 py-1 rounded-full ${
                role === 'admin' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {role === 'admin' ? 'Admin' : 'Student'}
              </span>
              <p className="text-sm text-gray-500 hidden sm:block">
                Welcome, <span className="font-semibold text-gray-700 capitalize">{username}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {role === 'student' && <GamificationStrip />}

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'student-home' && role === 'student' && (
          <StudentDashboard username={username} onStartLesson={() => setActiveView('lessons')} />
        )}
        {activeView === 'teacher-dashboard' && role === 'admin' && <TeacherDashboard />}
        {activeView === 'admin-dashboard' && role === 'admin' && <AdminDashboard />}
        {activeView === 'lessons' && <MathLessonInterface username={username} role={role} />}
        {activeView === 'gesture-recognition' && <GestureRecognitionScreen />}
        {activeView === 'lesson-management' && role === 'admin' && <LessonManagement />}
        {activeView === 'students' && role === 'admin' && <StudentManagement />}
        {activeView === 'analytics' && <ReportsAnalytics username={username} role={role} />}
        {activeView === 'reports' && <ReportingModule username={username} role={role} />}
      </main>
    </div>
  );
}
