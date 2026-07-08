import { motion } from 'motion/react';
import { Users, BookOpen, BarChart3, Bell, ArrowRight, Sparkles } from 'lucide-react';

const stats = [
  { title: 'Students Active', value: '124', icon: Users, color: 'from-blue-500 to-blue-600' },
  { title: 'Lessons Posted', value: '18', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
  { title: 'Avg. Accuracy', value: '91%', icon: BarChart3, color: 'from-emerald-500 to-emerald-600' },
];

export function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Teacher overview
            </div>
            <h2 className="text-3xl font-extrabold mb-3">Monitor progress and guide students with confidence.</h2>
            <p className="text-slate-300 max-w-2xl">Track lesson completion, review class performance, and keep engagement high with real-time insights.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 shadow-lg hover:opacity-90">
            View Reports <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Recent Alerts</h3>
              <p className="text-sm text-gray-500">Keep an eye on upcoming milestones</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">3 students are ready for a new lesson assignment.</div>
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">The Friday quiz is scheduled for 3:00 PM.</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Suggested Next Steps</h3>
              <p className="text-sm text-gray-500">Plan your next lesson cycle</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-100 p-3 text-sm text-gray-700">Assign a multiplication practice set to Group B.</div>
            <div className="rounded-xl border border-gray-100 p-3 text-sm text-gray-700">Review gesture accuracy for the new sign module.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
