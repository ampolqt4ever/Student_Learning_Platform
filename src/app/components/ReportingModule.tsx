import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Target, Calendar, Download, FileText } from 'lucide-react';

interface ReportingModuleProps {
  username: string;
  role: 'admin' | 'student';
}

interface LessonProgress {
  username: string;
  lessonId: string;
  lessonTitle: string;
  accuracy: number;
  completedAt: string;
  totalSigns: number;
}

export function ReportingModule({ username, role }: ReportingModuleProps) {
  const [progressData, setProgressData] = useState<LessonProgress[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadProgressData();
  }, [username, role]);

  const loadProgressData = () => {
    const stored = localStorage.getItem('lessonProgress');
    if (stored) {
      const allProgress: LessonProgress[] = JSON.parse(stored);
      const filtered = role === 'student'
        ? allProgress.filter(p => p.username === username)
        : allProgress;
      setProgressData(filtered);
    }
  };

  const getFilteredData = () => {
    if (selectedTimeframe === 'all') return progressData;

    const now = new Date();
    const cutoffDate = new Date();

    if (selectedTimeframe === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (selectedTimeframe === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }

    return progressData.filter(p => new Date(p.completedAt) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  const totalLessons = filteredData.length;
  const averageAccuracy = totalLessons > 0
    ? Math.round(filteredData.reduce((sum, p) => sum + p.accuracy, 0) / totalLessons)
    : 0;

  const accuracyTrend = filteredData.map(p => ({
    date: new Date(p.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    accuracy: p.accuracy,
    lesson: p.lessonTitle,
  }));

  const lessonDistribution = filteredData.reduce((acc, p) => {
    const category = p.lessonTitle.toLowerCase().includes('number') ? 'Numbers' : 'Operations';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(lessonDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const accuracyDistribution = [
    { range: '90-100%', count: filteredData.filter(p => p.accuracy >= 90).length },
    { range: '80-89%', count: filteredData.filter(p => p.accuracy >= 80 && p.accuracy < 90).length },
    { range: '70-79%', count: filteredData.filter(p => p.accuracy >= 70 && p.accuracy < 80).length },
    { range: '0-69%', count: filteredData.filter(p => p.accuracy < 70).length },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  const generateReport = () => {
    const reportContent = `
Sign Language Mathematics Learning System - Progress Report
Generated: ${new Date().toLocaleDateString()}
${role === 'student' ? `Student: ${username}` : 'All Students'}
Timeframe: ${selectedTimeframe === 'all' ? 'All Time' : selectedTimeframe === 'week' ? 'Last 7 Days' : 'Last 30 Days'}

SUMMARY STATISTICS
==================
Total Lessons Completed: ${totalLessons}
Average Accuracy: ${averageAccuracy}%

LESSON BREAKDOWN
================
${filteredData.map(p => `
- ${p.lessonTitle}
  Date: ${new Date(p.completedAt).toLocaleDateString()}
  Accuracy: ${p.accuracy}%
  Signs Practiced: ${p.totalSigns}
`).join('\n')}

This is an automated report. For detailed analysis, please review the dashboard.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${username}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Reports & Analytics</h2>
          <p className="text-gray-600">
            {role === 'student'
              ? 'Track your learning progress and performance'
              : 'Monitor student performance and lesson completion'}
          </p>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          Export Report
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setSelectedTimeframe('week')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedTimeframe === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setSelectedTimeframe('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedTimeframe === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setSelectedTimeframe('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedTimeframe === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Lessons Completed</p>
          <p className="text-4xl">{totalLessons}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Average Accuracy</p>
          <p className="text-4xl">{averageAccuracy}%</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Signs Learned</p>
          <p className="text-4xl">{filteredData.reduce((sum, p) => sum + p.totalSigns, 0)}</p>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-900 mb-4">Accuracy Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={accuracyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-900 mb-4">Lesson Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-gray-900 mb-4">Accuracy Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accuracyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Number of Lessons" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-gray-900">Recent Lesson History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Lesson</th>
                    {role === 'admin' && (
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Student</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Signs</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Accuracy</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.slice().reverse().map((progress, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(progress.completedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{progress.lessonTitle}</td>
                      {role === 'admin' && (
                        <td className="px-6 py-4 text-gray-600">{progress.username}</td>
                      )}
                      <td className="px-6 py-4 text-gray-600">{progress.totalSigns}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                            <div
                              className={`h-2 rounded-full ${
                                progress.accuracy >= 90
                                  ? 'bg-green-500'
                                  : progress.accuracy >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${progress.accuracy}%` }}
                            />
                          </div>
                          <span className="text-gray-900">{progress.accuracy}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                            progress.accuracy >= 90
                              ? 'bg-green-100 text-green-800'
                              : progress.accuracy >= 70
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {progress.accuracy >= 90 ? 'Excellent' : progress.accuracy >= 70 ? 'Good' : 'Needs Practice'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            Complete some lessons to see your progress and analytics here.
          </p>
        </div>
      )}
    </div>
  );
}
