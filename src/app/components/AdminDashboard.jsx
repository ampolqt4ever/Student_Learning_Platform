import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Database, Activity, Shield, Settings, Server,
  UserPlus, Trash2, Edit, Key, AlertTriangle, CheckCircle,
  HardDrive, Cpu, Network, Lock, Eye, TrendingUp, Clock, X,
  Mail, Phone, Save,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const users = [
  { id: 1, name: 'John Admin', role: 'Admin', email: 'john@signmath.edu', status: 'active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Sarah Teacher', role: 'Teacher', email: 'sarah@signmath.edu', status: 'active', lastLogin: '5 hours ago' },
  { id: 3, name: 'Mike Student', role: 'Student', email: 'mike@signmath.edu', status: 'active', lastLogin: '1 day ago' },
  { id: 4, name: 'Lisa Student', role: 'Student', email: 'lisa@signmath.edu', status: 'inactive', lastLogin: '7 days ago' },
];

const systemData = [
  { time: '00:00', cpu: 45, memory: 62, requests: 120 },
  { time: '04:00', cpu: 38, memory: 58, requests: 95 },
  { time: '08:00', cpu: 72, memory: 75, requests: 340 },
  { time: '12:00', cpu: 85, memory: 82, requests: 580 },
  { time: '16:00', cpu: 68, memory: 71, requests: 420 },
  { time: '20:00', cpu: 52, memory: 65, requests: 210 },
];

function MetricCard({ icon: Icon, title, value, subtitle, status, color }) {
  const statusColors = {
    good: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700',
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[status]}`}>
          {status === 'good' ? 'Healthy' : status === 'warning' ? 'Warning' : 'Critical'}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const totalStorage = 2.4;
  const usedStorage = 1.8;

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student',
    password: '',
  });

  const handleBackupDatabase = () => {
    console.log('Starting database backup...');
    alert('Database backup initiated. You will be notified when complete.');
  };

  const handleViewLogs = (type) => {
    console.log(`Opening ${type} logs...`);
    setShowLogsModal(true);
  };

  const handleSecurityScan = () => {
    console.log('Running security scan...');
    alert('Security scan in progress. This may take a few minutes...');
  };

  const handleAddUser = () => {
    console.log('Adding new user:', newUser);
    alert(`User "${newUser.name}" added successfully!`);
    setNewUser({ name: '', email: '', role: 'Student', password: '' });
    setShowAddUserModal(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleSaveUserEdit = () => {
    console.log('Saving user edits:', selectedUser);
    alert(`User "${selectedUser?.name}" updated successfully!`);
    setShowEditUserModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (user) => {
    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      console.log('Deleting user:', user);
      alert(`User "${user.name}" has been deleted.`);
    }
  };

  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">System management and security overview</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenSettings}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Users} title="Total Users" value={users.length.toString()} subtitle={`${activeUsers} active users`} status="good" color="from-blue-500 to-blue-600" />
        <MetricCard icon={Database} title="Database Load" value="68%" subtitle="2.4 TB total capacity" status="warning" color="from-purple-500 to-purple-600" />
        <MetricCard icon={Server} title="Server Uptime" value="99.8%" subtitle="Last 30 days" status="good" color="from-green-500 to-green-600" />
        <MetricCard icon={Shield} title="Security Status" value="Secure" subtitle="No threats detected" status="good" color="from-orange-500 to-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">System Resources</h3>
              <p className="text-xs text-gray-500 mt-1">CPU & Memory usage (24h)</p>
            </div>
            <Cpu className="h-5 w-5 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                CPU Usage
              </p>
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full inline-block" />
                Memory Usage
              </p>
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Request Traffic</h3>
              <p className="text-xs text-gray-500 mt-1">API requests per hour</p>
            </div>
            <Network className="h-5 w-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={systemData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Database Management</h3>
              <p className="text-xs text-gray-500">Storage and backup status</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-bold text-gray-900">{usedStorage} TB / {totalStorage} TB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${(usedStorage / totalStorage) * 100}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <HardDrive className="h-4 w-4" />
                  <span className="text-xs">Collections</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">8</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Queries/sec</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">142</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={handleBackupDatabase} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
                Backup Now
              </button>
              <button onClick={() => handleViewLogs('database')} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold">
                View Logs
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Security Panel</h3>
              <p className="text-xs text-gray-600">Threats and authentication</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">SSL Certificate</p>
                  <p className="text-xs text-gray-500">Valid until Dec 2026</p>
                </div>
              </div>
              <Lock className="h-4 w-4 text-green-500" />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Firewall</p>
                  <p className="text-xs text-gray-500">Active, 0 threats blocked</p>
                </div>
              </div>
              <Eye className="h-4 w-4 text-green-500" />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">2FA Enforcement</p>
                  <p className="text-xs text-gray-500">2 users without 2FA</p>
                </div>
              </div>
              <Key className="h-4 w-4 text-yellow-500" />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={handleSecurityScan} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
                Security Scan
              </button>
              <button onClick={() => handleViewLogs('security')} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700">
                Logs
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
