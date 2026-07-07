import { useState, useEffect } from 'react';
import { GestureDetection } from './GestureDetection';
import { StudentSelector } from './StudentSelector';
import { RPGBattleGame } from './RPGBattleGame';
import { Play, CheckCircle, XCircle, ArrowRight, Award, Clock, Swords } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  category: 'numbers' | 'operations';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  signs: Array<{ sign: string; meaning: string; emoji: string }>;
  assignedTo?: 'all' | string[]; // Optional for default lessons
  isCustom?: boolean;
}

interface Student {
  id: string;
  name: string;
  email: string;
  lessonsCompleted: number;
  averageAccuracy: number;
  totalPoints: number;
}

interface MathLessonInterfaceProps {
  username: string;
  role: 'admin' | 'student';
}

const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Numbers 0-9',
    category: 'numbers',
    difficulty: 'beginner',
    description: 'Learn hand signs for basic numbers from 0 to 9',
    signs: [
      { sign: '0', meaning: 'Zero', emoji: '✊' },
      { sign: '1', meaning: 'One', emoji: '☝️' },
      { sign: '2', meaning: 'Two', emoji: '✌️' },
      { sign: '3', meaning: 'Three', emoji: '🤟' },
      { sign: '4', meaning: 'Four', emoji: '🖖' },
      { sign: '5', meaning: 'Five', emoji: '🖐️' },
    ],
  },
  {
    id: '2',
    title: 'Addition Signs',
    category: 'operations',
    difficulty: 'beginner',
    description: 'Master the hand signs for addition operations',
    signs: [
      { sign: '+', meaning: 'Plus/Add', emoji: '➕' },
      { sign: '=', meaning: 'Equals', emoji: '🟰' },
    ],
  },
  {
    id: '3',
    title: 'Subtraction Signs',
    category: 'operations',
    difficulty: 'beginner',
    description: 'Learn subtraction operation hand signs',
    signs: [
      { sign: '-', meaning: 'Minus/Subtract', emoji: '➖' },
      { sign: '=', meaning: 'Equals', emoji: '🟰' },
    ],
  },
  {
    id: '4',
    title: 'Numbers 10-20',
    category: 'numbers',
    difficulty: 'intermediate',
    description: 'Advanced number signs from 10 to 20',
    signs: [
      { sign: '10', meaning: 'Ten', emoji: '🔟' },
      { sign: '15', meaning: 'Fifteen', emoji: '1️⃣5️⃣' },
      { sign: '20', meaning: 'Twenty', emoji: '2️⃣0️⃣' },
    ],
  },
  {
    id: '5',
    title: 'Multiplication Signs',
    category: 'operations',
    difficulty: 'intermediate',
    description: 'Learn multiplication operation signs',
    signs: [
      { sign: '×', meaning: 'Multiply', emoji: '✖️' },
      { sign: '=', meaning: 'Equals', emoji: '🟰' },
    ],
  },
  {
    id: '6',
    title: 'Division Signs',
    category: 'operations',
    difficulty: 'advanced',
    description: 'Master division operation hand signs',
    signs: [
      { sign: '÷', meaning: 'Divide', emoji: '➗' },
      { sign: '=', meaning: 'Equals', emoji: '🟰' },
    ],
  },
];

export function MathLessonInterface({ username, role }: MathLessonInterfaceProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'numbers' | 'operations'>('all');
  const [gameMode, setGameMode] = useState<'rpg' | 'normal'>('normal');
  const [allLessons, setAllLessons] = useState<Lesson[]>(lessons);
  const [currentStudentId, setCurrentStudentId] = useState<string>('');

  useEffect(() => {
    loadAllLessons();
    if (role === 'student') {
      loadCurrentStudentId();
    }
  }, [role, username]);

  // Reload lessons when component is active (catches updates from LessonManagement)
  useEffect(() => {
    const handleFocus = () => {
      loadAllLessons();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Also check for updates periodically
    const interval = setInterval(() => {
      loadAllLessons();
    }, 2000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const loadCurrentStudentId = () => {
    // Try to find student by username
    const studentsData = localStorage.getItem('students');
    if (studentsData) {
      const students = JSON.parse(studentsData);
      const student = students.find((s: Student) => s.name === username || s.email === username);
      if (student) {
        setCurrentStudentId(student.id);
      }
    }
  };

  const loadAllLessons = () => {
    const customLessonsData = localStorage.getItem('customLessons');
    if (customLessonsData) {
      const customLessons = JSON.parse(customLessonsData);
      const customLessonsWithFlag = customLessons.map((lesson: Lesson) => ({
        ...lesson,
        isCustom: true,
      }));
      setAllLessons([...lessons, ...customLessonsWithFlag]);
    } else {
      setAllLessons(lessons);
    }
  };

  const getFilteredLessons = () => {
    let filtered = allLessons.filter(
      lesson => filterCategory === 'all' || lesson.category === filterCategory
    );

    // For students, filter by assignments
    if (role === 'student' && currentStudentId) {
      filtered = filtered.filter(lesson => {
        // Default lessons are available to all
        if (!lesson.isCustom) return true;
        
        // Custom lessons check assignment
        if (lesson.assignedTo === 'all') return true;
        if (Array.isArray(lesson.assignedTo)) {
          return lesson.assignedTo.includes(currentStudentId);
        }
        return false;
      });
    }

    return filtered;
  };

  const filteredLessons = getFilteredLessons();

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);

    if (role === 'admin') {
      setShowStudentSelector(true);
    } else {
      const currentStudent: Student = {
        id: 'self',
        name: username,
        email: '',
        lessonsCompleted: 0,
        averageAccuracy: 0,
        totalPoints: 0,
      };
      setSelectedStudent(currentStudent);
      setLessonStarted(true);
    }
  };

  const handleStudentSelected = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentSelector(false);
    setLessonStarted(true);
  };

  const handleBattleComplete = (points: number, accuracy: number) => {
    endLesson();
  };

  const endLesson = () => {
    setLessonStarted(false);
    setSelectedLesson(null);
    setSelectedStudent(null);
    setShowStudentSelector(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (showStudentSelector && selectedLesson) {
    return (
      <StudentSelector
        onSelectStudent={handleStudentSelected}
        onCancel={endLesson}
      />
    );
  }

  if (lessonStarted && selectedLesson && selectedStudent) {
    if (gameMode === 'rpg') {
      return (
        <RPGBattleGame
          lesson={selectedLesson}
          student={selectedStudent}
          onComplete={handleBattleComplete}
          onExit={endLesson}
        />
      );
    } else {
      return <GestureDetection lesson={selectedLesson} onComplete={endLesson} username={username} />;
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Mathematics Sign Language Lessons</h2>
        <p className="text-gray-600">
          {role === 'admin'
            ? 'Select a lesson and choose a student to begin the interactive learning experience'
            : 'Select a lesson to practice hand gesture recognition for mathematical concepts'}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex gap-3">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Lessons
          </button>
          <button
            onClick={() => setFilterCategory('numbers')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterCategory === 'numbers'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Numbers
          </button>
          <button
            onClick={() => setFilterCategory('operations')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterCategory === 'operations'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Operations
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Mode:</span>
          <button
            onClick={() => setGameMode('normal')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              gameMode === 'normal'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setGameMode('rpg')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              gameMode === 'rpg'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Swords className="h-4 w-4" />
            RPG Battle
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {lesson.signs.length} signs
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {lesson.signs.slice(0, 6).map((sign, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center text-xl"
                    title={sign.meaning}
                  >
                    {sign.emoji}
                  </div>
                ))}
              </div>

              <button
                onClick={() => startLesson(lesson)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {gameMode === 'rpg' && role === 'admin' ? (
                  <>
                    <Swords className="h-5 w-5" />
                    Start Battle
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start Lesson
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No lessons found in this category</p>
        </div>
      )}
    </div>
  );
}