import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, UserRound, Mail, ShieldCheck } from 'lucide-react';

const students = [
  { id: 1, name: 'Mina Patel', level: 'Level 4', progress: '82%', status: 'Active' },
  { id: 2, name: 'Leo Brooks', level: 'Level 3', progress: '67%', status: 'Needs Support' },
  { id: 3, name: 'Ava Nguyen', level: 'Level 5', progress: '91%', status: 'Active' },
];

export function StudentManagement() {
  const [query, setQuery] = useState('');

  const filtered = students.filter((student) =>
    `${student.name} ${student.level}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Student Management</h2>
          <p className="text-gray-500 mt-1">View progress and manage student support.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 font-semibold text-white shadow">
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search students"
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((student, index) => (
          <motion.div key={student.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.level}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-gray-900">{student.progress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {student.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>student@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ShieldCheck className="h-4 w-4" />
                <span>Support plan enabled</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
