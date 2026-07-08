import { motion } from 'motion/react';
import { FileText, Download, Sparkles } from 'lucide-react';

const reports = [
  { title: 'Weekly Summary', type: 'PDF', updated: '2 hours ago' },
  { title: 'Student Progress', type: 'CSV', updated: 'Yesterday' },
  { title: 'Lesson Completion', type: 'PDF', updated: '3 days ago' },
];

export function ReportingModule({ username, role }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-sm font-semibold mb-4 w-fit">
          <Sparkles className="h-4 w-4" />
          Reporting for {role}
        </div>
        <h2 className="text-3xl font-extrabold mb-3">Generate and share updates quickly.</h2>
        <p className="text-slate-300 max-w-2xl">Choose from recent reports and download the data you need for review.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <motion.div key={report.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index }} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{report.type}</span>
            </div>
            <h3 className="font-bold text-gray-900">{report.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Updated {report.updated}</p>
            <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white">
              <Download className="h-4 w-4" />
              Download
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
