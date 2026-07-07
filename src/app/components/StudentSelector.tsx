import { useState } from 'react';
import { Search, User, Award, TrendingUp, X } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  lessonsCompleted: number;
  averageAccuracy: number;
  totalPoints: number;
}

interface StudentSelectorProps {
  onSelectStudent: (student: Student) => void;
  onCancel: () => void;
}

export function StudentSelector({ onSelectStudent, onCancel }: StudentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock student data - in production, this would come from a database
  const students: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      lessonsCompleted: 12,
      averageAccuracy: 87,
      totalPoints: 1250,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      lessonsCompleted: 8,
      averageAccuracy: 92,
      totalPoints: 980,
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael@example.com',
      lessonsCompleted: 15,
      averageAccuracy: 78,
      totalPoints: 1450,
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      lessonsCompleted: 10,
      averageAccuracy: 85,
      totalPoints: 1100,
    },
    {
      id: '5',
      name: 'James Brown',
      email: 'james@example.com',
      lessonsCompleted: 6,
      averageAccuracy: 90,
      totalPoints: 750,
    },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">Select a Student</h2>
            <p className="text-sm text-blue-100">Choose a student to begin the lesson</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">{student.name.charAt(0).toUpperCase()}</span>
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-gray-900 mb-1">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-500">Lessons</span>
                      </div>
                      <p className="text-gray-900">{student.lessonsCompleted}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-500">Accuracy</span>
                      </div>
                      <p className="text-gray-900">{student.averageAccuracy}%</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-500">Points</span>
                      </div>
                      <p className="text-gray-900">{student.totalPoints}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No students found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
