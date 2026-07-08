import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, PencilLine, Trash2, Search, BookOpen } from 'lucide-react';

const lessons = [
  { id: 1, title: 'Numbers 1-10', category: 'Foundations', status: 'Published' },
  { id: 2, title: 'Addition Practice', category: 'Arithmetic', status: 'Draft' },
  { id: 3, title: 'Multiplication Basics', category: 'Arithmetic', status: 'Published' },
];

export function LessonManagement() {
  const [query, setQuery] = useState('');

  const filtered = lessons.filter((lesson) =>
    `${lesson.title} ${lesson.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Lesson Management</h2>
          <p className="text-gray-500 mt-1">Create and organize educational content.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 font-semibold text-white shadow">
          <Plus className="h-4 w-4" />
          New Lesson
        </button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons"
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((lesson, index) => (
          <motion.div key={lesson.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                  <p className="text-sm text-gray-500">{lesson.category}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${lesson.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {lesson.status}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <PencilLine className="h-4 w-4" />
                Edit
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
