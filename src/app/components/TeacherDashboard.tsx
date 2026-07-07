import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, TrendingUp, Award, Activity, Upload, FileText,
  BookOpen, Target, Clock, CheckCircle2, AlertCircle,
  BarChart3, Calendar, Download, Filter, Search, X, Plus,
  ImageIcon, Video, File, Check
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Mock student performance data
const students = [
  { id: 1, name: 'Emma Wilson', accuracy: 92, lessons: 24, streak: 12, lastActive: '2 hours ago', status: 'active' },
  { id: 2, name: 'Liam Chen', accuracy: 88, lessons: 20, streak: 8, lastActive: '1 day ago', status: 'active' },
  { id: 3, name: 'Sophia Garcia', accuracy: 95, lessons: 28, streak: 15, lastActive: '30 min ago', status: 'active' },
  { id: 4, name: 'Noah Patel', accuracy: 78, lessons: 15, streak: 5, lastActive: '3 days ago', status: 'inactive' },
  { id: 5, name: 'Olivia Johnson', accuracy: 85, lessons: 22, streak: 9, lastActive: '5 hours ago', status: 'active' },
  { id: 6, name: 'Ava Martinez', accuracy: 91, lessons: 26, streak: 11, lastActive: '1 hour ago', status: 'active' },
];

// Accuracy trend data
const accuracyData = [
  { week: 'Week 1', accuracy: 75 },
  { week: 'Week 2', accuracy: 78 },
  { week: 'Week 3', accuracy: 82 },
  { week: 'Week 4', accuracy: 85 },
  { week: 'Week 5', accuracy: 88 },
  { week: 'Week 6', accuracy: 89 },
];

// Completion rate by difficulty
const completionData = [
  { difficulty: 'Beginner', rate: 87 },
  { difficulty: 'Intermediate', rate: 70 },
  { difficulty: 'Advanced', rate: 53 },
];

// Lesson distribution
const lessonDistribution = [
  { name: 'Addition', value: 28, color: '#3B82F6' },
  { name: 'Subtraction', value: 24, color: '#8B5CF6' },
  { name: 'Multiplication', value: 22, color: '#10B981' },
  { name: 'Division', value: 18, color: '#F59E0B' },
  { name: 'Fractions', value: 8, color: '#EF4444' },
];

function StatsCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color,
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export function TeacherDashboard() {
  const avgAccuracy = Math.round(students.reduce((sum, s) => sum + s.accuracy, 0) / students.length);
  const totalLessons = students.reduce((sum, s) => sum + s.lessons, 0);
  const activeStudents = students.filter(s => s.status === 'active').length;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    category: 'Numbers',
    assignTo: 'all',
    selectedStudents: [] as number[],
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
    alert(`Exporting student performance data as ${format.toUpperCase()}...`);
    setShowExportMenu(false);
  };

  const handleGenerateReport = (type: 'weekly' | 'monthly') => {
    console.log(`Generating ${type} report...`);
    alert(`Generating ${type} report with charts and analytics...`);
  };

  const handleExportPDF = () => {
    console.log('Exporting comprehensive PDF report...');
    alert('Generating comprehensive PDF report with all analytics...');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showExportMenu]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmitLesson = () => {
    // Mock submission
    console.log('Submitting lesson:', {
      ...uploadForm,
      file: uploadedFile?.name,
    });

    // Reset form
    setUploadForm({
      title: '',
      description: '',
      difficulty: 'Beginner',
      category: 'Numbers',
      assignTo: 'all',
      selectedStudents: [],
    });
    setUploadedFile(null);
    setIsUploadModalOpen(false);

    // Show success feedback (you could add a toast notification here)
    alert('Lesson uploaded successfully!');
  };

  const toggleStudentSelection = (studentId: number) => {
    setUploadForm(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Monitor student progress and classroom analytics</p>
        </div>
        <div className="flex gap-3">
          <div className="relative export-dropdown">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
              >
                <button
                  onClick={() => handleExportData('csv')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportData('excel')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExportData('pdf')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  Export as PDF
                </button>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
          >
            <Upload className="h-4 w-4" />
            Upload Lesson
          </button>
        </div>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          title="Active Students"
          value={`${activeStudents}/${students.length}`}
          subtitle="Currently learning"
          trend="+12%"
          color="from-blue-500 to-blue-600"
        />
        <StatsCard
          icon={Target}
          title="Avg. Accuracy"
          value={`${avgAccuracy}%`}
          subtitle="Across all students"
          trend="+5.2%"
          color="from-purple-500 to-purple-600"
        />
        <StatsCard
          icon={BookOpen}
          title="Lessons Completed"
          value={totalLessons.toString()}
          subtitle="This month"
          trend="+18%"
          color="from-green-500 to-green-600"
        />
        <StatsCard
          icon={Award}
          title="Avg. Streak"
          value={`${Math.round(students.reduce((sum, s) => sum + s.streak, 0) / students.length)} days`}
          subtitle="Engagement metric"
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy trend chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Accuracy Trend</h3>
              <p className="text-xs text-gray-500 mt-1">Class performance over time</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" domain={[70, 95]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Completion rate by difficulty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Completion by Difficulty</h3>
              <p className="text-xs text-gray-500 mt-1">Lesson completion rates</p>
            </div>
            <BarChart3 className="h-5 w-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="difficulty" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="rate" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Lesson distribution & Generate report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson distribution pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-1"
        >
          <div className="mb-4">
            <h3 className="font-bold text-gray-900">Lesson Distribution</h3>
            <p className="text-xs text-gray-500 mt-1">Topics covered</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={lessonDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {lessonDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {lessonDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Generate report section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 lg:col-span-2"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Generate Reports</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create comprehensive performance reports for students, parents, or administrators
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleGenerateReport('weekly')}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Weekly Report
                  </button>
                  <button
                    onClick={() => handleGenerateReport('monthly')}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Monthly Summary
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Student performance table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Student Performance</h3>
              <p className="text-xs text-gray-500 mt-1">Individual progress tracking</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => alert('Filter options: Active/Inactive, Accuracy range, Lesson progress')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Lessons
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">ID: {student.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            student.accuracy >= 90
                              ? 'bg-green-500'
                              : student.accuracy >= 80
                              ? 'bg-blue-500'
                              : 'bg-orange-500'
                          }`}
                          style={{ width: `${student.accuracy}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {student.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-900">{student.lessons}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                      🔥 {student.streak}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {student.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Inactive
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Upload Lesson Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Upload New Lesson</h2>
                    <p className="text-sm text-gray-500 mt-1">Create and assign custom lessons to your students</p>
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-6">
                {/* Lesson title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="e.g., Advanced Multiplication Signs"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Describe what students will learn in this lesson..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>

                {/* Difficulty and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      value={uploadForm.difficulty}
                      onChange={(e) => setUploadForm({ ...uploadForm, difficulty: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Numbers">Numbers</option>
                      <option value="Addition">Addition</option>
                      <option value="Subtraction">Subtraction</option>
                      <option value="Multiplication">Multiplication</option>
                      <option value="Division">Division</option>
                      <option value="Fractions">Fractions</option>
                    </select>
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Lesson Content
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileUpload}
                      accept=".pdf,.pptx,.mp4,.jpg,.png"
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      {uploadedFile ? (
                        <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                          <File className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900">{uploadedFile.name}</p>
                            <p className="text-xs text-blue-600">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setUploadedFile(null);
                            }}
                            className="ml-auto p-1 hover:bg-blue-100 rounded"
                          >
                            <X className="h-4 w-4 text-blue-600" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-3" />
                          <p className="text-sm font-semibold text-gray-700">Click to upload lesson files</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, PowerPoint, Video, or Images</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Assign to students */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Assign To *
                  </label>
                  <div className="space-y-3">
                    {/* All students option */}
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="assignTo"
                        value="all"
                        checked={uploadForm.assignTo === 'all'}
                        onChange={(e) => setUploadForm({ ...uploadForm, assignTo: e.target.value, selectedStudents: [] })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">All Students</p>
                        <p className="text-xs text-gray-500">Assign this lesson to everyone in your class</p>
                      </div>
                    </label>

                    {/* Specific students option */}
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="assignTo"
                        value="specific"
                        checked={uploadForm.assignTo === 'specific'}
                        onChange={(e) => setUploadForm({ ...uploadForm, assignTo: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Specific Students</p>
                        <p className="text-xs text-gray-500">Choose individual students below</p>
                      </div>
                    </label>

                    {/* Student selection grid */}
                    {uploadForm.assignTo === 'specific' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 pt-2 space-y-2"
                      >
                        <p className="text-xs font-semibold text-gray-600 mb-2">Select Students:</p>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2">
                          {students.map((student) => (
                            <label
                              key={student.id}
                              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                                uploadForm.selectedStudents.includes(student.id)
                                  ? 'bg-blue-50 border-blue-300'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={uploadForm.selectedStudents.includes(student.id)}
                                  onChange={() => toggleStudentSelection(student.id)}
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                              </div>
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm font-medium text-gray-900 truncate">{student.name}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6 rounded-b-2xl flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitLesson}
                  disabled={!uploadForm.title || (uploadForm.assignTo === 'specific' && uploadForm.selectedStudents.length === 0)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Upload Lesson
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
