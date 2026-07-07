import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3, TrendingUp, Award, FileText, Download, Calendar,
  CheckCircle, Target, Clock, Zap, Shield, Settings, Users,
  Activity, Gauge, Network, Lock, Package, ChevronDown, X
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ReportsAnalyticsProps {
  username: string;
  role: 'admin' | 'student';
}

const accuracyDataByRange: Record<string, { name: string; accuracy: number; target: number }[]> = {
  'Today': [
    { name: '8am', accuracy: 70, target: 80 },
    { name: '10am', accuracy: 76, target: 80 },
    { name: '12pm', accuracy: 84, target: 80 },
    { name: '2pm', accuracy: 79, target: 80 },
    { name: '4pm', accuracy: 88, target: 80 },
    { name: '6pm', accuracy: 91, target: 80 },
  ],
  'This Week': [
    { name: 'Mon', accuracy: 75, target: 80 },
    { name: 'Tue', accuracy: 82, target: 80 },
    { name: 'Wed', accuracy: 78, target: 80 },
    { name: 'Thu', accuracy: 88, target: 80 },
    { name: 'Fri', accuracy: 92, target: 80 },
    { name: 'Sat', accuracy: 85, target: 80 },
    { name: 'Sun', accuracy: 89, target: 80 },
  ],
  'This Month': [
    { name: 'Week 1', accuracy: 72, target: 80 },
    { name: 'Week 2', accuracy: 79, target: 80 },
    { name: 'Week 3', accuracy: 85, target: 80 },
    { name: 'Week 4', accuracy: 90, target: 80 },
  ],
  'Last 7 Days': [
    { name: 'Day 1', accuracy: 68, target: 80 },
    { name: 'Day 2', accuracy: 74, target: 80 },
    { name: 'Day 3', accuracy: 80, target: 80 },
    { name: 'Day 4', accuracy: 77, target: 80 },
    { name: 'Day 5', accuracy: 83, target: 80 },
    { name: 'Day 6', accuracy: 87, target: 80 },
    { name: 'Day 7', accuracy: 91, target: 80 },
  ],
  'Last 30 Days': [
    { name: 'Week 1', accuracy: 65, target: 80 },
    { name: 'Week 2', accuracy: 71, target: 80 },
    { name: 'Week 3', accuracy: 78, target: 80 },
    { name: 'Week 4', accuracy: 84, target: 80 },
    { name: 'Week 5', accuracy: 88, target: 80 },
  ],
  'Custom Range': [
    { name: 'Period A', accuracy: 73, target: 80 },
    { name: 'Period B', accuracy: 81, target: 80 },
    { name: 'Period C', accuracy: 86, target: 80 },
  ],
};

const completionDataByRange: Record<string, { topic: string; rate: number; completed: number; total: number }[]> = {
  'Today': [
    { topic: 'Addition', rate: 80, completed: 4, total: 5 },
    { topic: 'Subtraction', rate: 60, completed: 3, total: 5 },
    { topic: 'Multiplication', rate: 50, completed: 2, total: 4 },
    { topic: 'Division', rate: 33, completed: 1, total: 3 },
    { topic: 'Fractions', rate: 50, completed: 1, total: 2 },
  ],
  'This Week': [
    { topic: 'Addition', rate: 80, completed: 24, total: 30 },
    { topic: 'Subtraction', rate: 72, completed: 18, total: 25 },
    { topic: 'Multiplication', rate: 75, completed: 15, total: 20 },
    { topic: 'Division', rate: 67, completed: 12, total: 18 },
    { topic: 'Fractions', rate: 53, completed: 8, total: 15 },
  ],
  'This Month': [
    { topic: 'Addition', rate: 82, completed: 90, total: 110 },
    { topic: 'Subtraction', rate: 74, completed: 70, total: 95 },
    { topic: 'Multiplication', rate: 69, completed: 55, total: 80 },
    { topic: 'Division', rate: 64, completed: 45, total: 70 },
    { topic: 'Fractions', rate: 55, completed: 30, total: 55 },
  ],
  'Last 7 Days': [
    { topic: 'Addition', rate: 80, completed: 28, total: 35 },
    { topic: 'Subtraction', rate: 71, completed: 20, total: 28 },
    { topic: 'Multiplication', rate: 77, completed: 17, total: 22 },
    { topic: 'Division', rate: 70, completed: 14, total: 20 },
    { topic: 'Fractions', rate: 53, completed: 9, total: 17 },
  ],
  'Last 30 Days': [
    { topic: 'Addition', rate: 79, completed: 95, total: 120 },
    { topic: 'Subtraction', rate: 75, completed: 75, total: 100 },
    { topic: 'Multiplication', rate: 71, completed: 60, total: 85 },
    { topic: 'Division', rate: 67, completed: 50, total: 75 },
    { topic: 'Fractions', rate: 58, completed: 35, total: 60 },
  ],
  'Custom Range': [
    { topic: 'Addition', rate: 80, completed: 40, total: 50 },
    { topic: 'Subtraction', rate: 71, completed: 30, total: 42 },
    { topic: 'Multiplication', rate: 71, completed: 25, total: 35 },
    { topic: 'Division', rate: 67, completed: 20, total: 30 },
    { topic: 'Fractions', rate: 55, completed: 12, total: 22 },
  ],
};

// Performance distribution
const performanceDistribution = [
  { name: 'Excellent', value: 45, color: '#10B981' },
  { name: 'Good', value: 30, color: '#3B82F6' },
  { name: 'Average', value: 20, color: '#F59E0B' },
  { name: 'Needs Work', value: 5, color: '#EF4444' },
];

// ISO 25010 evaluation data
const iso25010Data = [
  { metric: 'Functional Suitability', score: 92 },
  { metric: 'Performance Efficiency', score: 88 },
  { metric: 'Compatibility', score: 85 },
  { metric: 'Usability', score: 94 },
  { metric: 'Reliability', score: 90 },
  { metric: 'Security', score: 87 },
  { metric: 'Portability', score: 83 },
];

const iso25010Cards = [
  {
    title: 'Functional Suitability',
    icon: CheckCircle,
    score: 92,
    description: 'System meets all functional requirements',
    color: 'from-green-500 to-green-600',
    status: 'Excellent',
  },
  {
    title: 'Performance Efficiency',
    icon: Zap,
    score: 88,
    description: 'Fast response times and resource optimization',
    color: 'from-blue-500 to-blue-600',
    status: 'Very Good',
  },
  {
    title: 'Compatibility',
    icon: Network,
    score: 85,
    description: 'Works across devices and browsers',
    color: 'from-purple-500 to-purple-600',
    status: 'Very Good',
  },
  {
    title: 'Usability',
    icon: Users,
    score: 94,
    description: 'Intuitive and accessible interface',
    color: 'from-pink-500 to-pink-600',
    status: 'Excellent',
  },
  {
    title: 'Reliability',
    icon: Activity,
    score: 90,
    description: 'Stable and fault-tolerant operation',
    color: 'from-orange-500 to-orange-600',
    status: 'Excellent',
  },
  {
    title: 'Security',
    icon: Shield,
    score: 87,
    description: 'Strong authentication and data protection',
    color: 'from-red-500 to-red-600',
    status: 'Very Good',
  },
  {
    title: 'Portability',
    icon: Package,
    score: 83,
    description: 'Easy deployment and maintenance',
    color: 'from-indigo-500 to-indigo-600',
    status: 'Good',
  },
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

function ISO25010Card({ item, index }: { item: typeof iso25010Cards[0]; index: number }) {
  const Icon = item.icon;
  const statusColor =
    item.status === 'Excellent'
      ? 'bg-green-100 text-green-700'
      : item.status === 'Very Good'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-yellow-100 text-yellow-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
          {item.status}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{item.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.score}%` }}
            transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
            className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
          />
        </div>
        <span className="text-2xl font-extrabold text-gray-900">{item.score}%</span>
      </div>
    </motion.div>
  );
}

export function ReportsAnalytics({ username, role }: ReportsAnalyticsProps) {
  const [showDateRangeMenu, setShowDateRangeMenu] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('This Week');
  const [showReportPreview, setShowReportPreview] = useState(false);

  const accuracyData = accuracyDataByRange[selectedDateRange] ?? accuracyDataByRange['This Week'];
  const completionData = completionDataByRange[selectedDateRange] ?? completionDataByRange['This Week'];

  const totalLessons = completionData.reduce((sum, item) => sum + item.completed, 0);
  const avgAccuracy = Math.round(accuracyData.reduce((sum, item) => sum + item.accuracy, 0) / accuracyData.length);
  const completionRate = Math.round(
    (completionData.reduce((sum, item) => sum + item.completed, 0) /
      completionData.reduce((sum, item) => sum + item.total, 0)) *
      100
  );

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    setShowDateRangeMenu(false);
  };

  const handleExportPDF = () => {
    console.log('Exporting analytics to PDF...');
    alert('Generating PDF report with current data and charts...');
  };

  const handleDownloadFullReport = () => {
    console.log('Downloading comprehensive report...');
    alert('Generating comprehensive report. This includes all analytics, ISO 25010 evaluation, and insights.');
  };

  const handlePreviewReport = () => {
    setShowReportPreview(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.date-range-dropdown')) {
        setShowDateRangeMenu(false);
      }
    };

    if (showDateRangeMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDateRangeMenu]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-gray-500 mt-2">
            {role === 'admin' ? 'Comprehensive system analytics and ISO 25010 evaluation' : 'Your learning progress and achievements'}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative date-range-dropdown">
            <button
              onClick={() => setShowDateRangeMenu(!showDateRangeMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
            >
              <Calendar className="h-4 w-4" />
              {selectedDateRange}
              <ChevronDown className="h-4 w-4" />
            </button>
            {showDateRangeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
              >
                {['Today', 'This Week', 'This Month', 'Last 7 Days', 'Last 30 Days', 'Custom Range'].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleDateRangeChange(range)}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                      selectedDateRange === range ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={BarChart3}
          title="Avg. Accuracy"
          value={`${avgAccuracy}%`}
          subtitle="This week"
          trend="+7%"
          color="from-blue-500 to-blue-600"
        />
        <StatsCard
          icon={Award}
          title="Lessons Completed"
          value={totalLessons.toString()}
          subtitle="Across all topics"
          trend="+12"
          color="from-purple-500 to-purple-600"
        />
        <StatsCard
          icon={Target}
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle="Of assigned lessons"
          trend="+5%"
          color="from-green-500 to-green-600"
        />
        <StatsCard
          icon={Clock}
          title="Study Time"
          value="12.5h"
          subtitle="Total this week"
          trend="+2.3h"
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Accuracy Trend</h3>
              <p className="text-xs text-gray-500 mt-1">Daily performance over the week</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-center gap-4 mb-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-blue-500 rounded" /> Accuracy</span>
            <span className="flex items-center gap-1"><span className="inline-block w-6 border-t-2 border-dashed border-green-500" /> Target (80%)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" domain={[0, 100]} />
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
                dot={{ fill: '#3B82F6', r: 5 }}
                name="Accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lesson completion progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Lesson Completion</h3>
              <p className="text-xs text-gray-500 mt-1">Progress by topic</p>
            </div>
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={completionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="topic" tick={{ fontSize: 12 }} stroke="#9CA3AF" width={110} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}%`, 'Completion Rate']}
              />
              <Bar dataKey="rate" fill="#8B5CF6" radius={[0, 8, 8, 0]} name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance distribution & ISO Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="mb-4">
            <h3 className="font-bold text-gray-900">Performance Distribution</h3>
            <p className="text-xs text-gray-500 mt-1">Breakdown by quality level</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={performanceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ISO 25010 Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="mb-4">
            <h3 className="font-bold text-gray-900">ISO 25010 Quality Model</h3>
            <p className="text-xs text-gray-500 mt-1">System quality attributes radar</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={iso25010Data}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ISO 25010 evaluation cards */}
      {role === 'admin' && (
        <>
          <div className="flex items-center gap-3">
            <Gauge className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-extrabold text-gray-900">ISO 25010 Quality Evaluation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {iso25010Cards.map((item, index) => (
              <ISO25010Card key={item.title} item={item} index={index} />
            ))}
          </div>
        </>
      )}

      {/* PDF Report preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
      >
        <div className="flex items-start gap-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Generate Comprehensive Report</h3>
            <p className="text-gray-600 mb-4">
              Create a detailed PDF report with all analytics, charts, and insights for {role === 'admin' ? 'the entire system' : 'your learning journey'}.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadFullReport}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download Full Report
              </button>
              <button
                onClick={handlePreviewReport}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                Preview Report
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {showReportPreview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportPreview(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Report Preview</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {role === 'admin' ? 'System Analytics Report' : `${username}'s Learning Progress Report`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReportPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-8 bg-gray-50 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Report Header */}
                <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {role === 'admin' ? 'SIGNMATH System Analytics' : 'Learning Progress Report'}
                      </h1>
                      <p className="text-gray-600">
                        Report Period: {selectedDateRange} • Generated on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Report ID</p>
                      <p className="font-mono text-xs text-gray-900">#RPT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Executive Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Avg. Accuracy</p>
                      <p className="text-2xl font-extrabold text-blue-900">{avgAccuracy}%</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 mb-1">Lessons Done</p>
                      <p className="text-2xl font-extrabold text-purple-900">{totalLessons}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Completion</p>
                      <p className="text-2xl font-extrabold text-green-900">{completionRate}%</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600 mb-1">Study Time</p>
                      <p className="text-2xl font-extrabold text-orange-900">12.5h</p>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Key Insights</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900">Strong Performance Trend</p>
                        <p className="text-sm text-green-700">Accuracy improved by 7% compared to last period</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900">Consistent Engagement</p>
                        <p className="text-sm text-blue-700">Study time increased by 2.3 hours this week</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <Target className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-purple-900">Goal Achievement</p>
                        <p className="text-sm text-purple-700">Exceeded target accuracy in 5 out of 7 days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts placeholder */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Detailed Analytics</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    This section includes all charts and visualizations from the dashboard, including accuracy trends, completion progress, and performance distribution.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Accuracy Trend Chart</p>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Lesson Completion Chart</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowReportPreview(false)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadFullReport();
                    setShowReportPreview(false);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
