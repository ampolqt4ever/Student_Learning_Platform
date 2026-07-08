import { motion } from 'motion/react';
import { TrendingUp, Users, BookOpen, Sparkles } from 'lucide-react';

const metrics = [
  { label: 'Completion Rate', value: '87%', detail: '+8% this month' },
  { label: 'Active Students', value: '124', detail: 'Across 6 classes' },
  { label: 'Avg. Lesson Time', value: '15m', detail: 'Per session' },
];

export function ReportsAnalytics({ username, role }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-cyan-700 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-sm font-semibold mb-4 w-fit">
          <Sparkles className="h-4 w-4" />
          Analytics for {username}
        </div>
        <h2 className="text-3xl font-extrabold mb-3">See how learning is progressing.</h2>
        <p className="text-emerald-50 max-w-2xl">Track outcomes, student engagement, and lesson performance in one simple overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div key={metric.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Student Engagement</h3>
              <p className="text-sm text-gray-500">Weekly participation summary</p>
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">Students are engaging most with gesture-based practice and daily review lessons.</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Popular Lessons</h3>
              <p className="text-sm text-gray-500">Most attempted content</p>
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">Addition Basics and Numbers 1–20 remain the most frequently revisited lessons.</div>
        </div>
      </div>
    </div>
  );
}
