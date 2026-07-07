import { useState, useEffect } from 'react';
import { Upload, Trash2, Users, User, BookOpen, Plus, X, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CustomLesson {
  id: string;
  title: string;
  category: 'numbers' | 'operations';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  signs: Array<{ sign: string; meaning: string; emoji: string }>;
  assignedTo: 'all' | string[]; // 'all' or array of student IDs
  createdBy: string;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface SignInput {
  sign: string;
  meaning: string;
  emoji: string;
}

export function LessonManagement() {
  const [customLessons, setCustomLessons] = useState<CustomLesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CustomLesson | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'numbers' | 'operations'>('numbers');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [signs, setSigns] = useState<SignInput[]>([{ sign: '', meaning: '', emoji: '' }]);
  const [assignmentType, setAssignmentType] = useState<'all' | 'individual'>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    loadCustomLessons();
    loadStudents();
  }, []);

  const loadCustomLessons = () => {
    const stored = localStorage.getItem('customLessons');
    if (stored) {
      setCustomLessons(JSON.parse(stored));
    }
  };

  const loadStudents = () => {
    const stored = localStorage.getItem('students');
    if (stored) {
      setStudents(JSON.parse(stored));
    }
  };

  const saveCustomLessons = (lessons: CustomLesson[]) => {
    localStorage.setItem('customLessons', JSON.stringify(lessons));
    setCustomLessons(lessons);
  };

  const handleAddSign = () => {
    setSigns([...signs, { sign: '', meaning: '', emoji: '' }]);
  };

  const handleRemoveSign = (index: number) => {
    if (signs.length > 1) {
      setSigns(signs.filter((_, i) => i !== index));
    }
  };

  const handleSignChange = (index: number, field: keyof SignInput, value: string) => {
    const newSigns = [...signs];
    newSigns[index][field] = value;
    setSigns(newSigns);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || signs.some(s => !s.sign || !s.meaning)) {
      alert('Please fill in all required fields');
      return;
    }

    const lessonData: CustomLesson = {
      id: editingLesson?.id || `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      signs: signs.filter(s => s.sign && s.meaning),
      assignedTo: assignmentType === 'all' ? 'all' : selectedStudents,
      createdBy: 'teacher',
      createdAt: editingLesson?.createdAt || new Date().toISOString(),
    };

    const updatedLessons = editingLesson
      ? customLessons.map(l => l.id === editingLesson.id ? lessonData : l)
      : [...customLessons, lessonData];

    saveCustomLessons(updatedLessons);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('numbers');
    setDifficulty('beginner');
    setSigns([{ sign: '', meaning: '', emoji: '' }]);
    setAssignmentType('all');
    setSelectedStudents([]);
    setShowUploadForm(false);
    setEditingLesson(null);
  };

  const handleEdit = (lesson: CustomLesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setDescription(lesson.description);
    setCategory(lesson.category);
    setDifficulty(lesson.difficulty);
    setSigns(lesson.signs);
    setAssignmentType(lesson.assignedTo === 'all' ? 'all' : 'individual');
    setSelectedStudents(Array.isArray(lesson.assignedTo) ? lesson.assignedTo : []);
    setShowUploadForm(true);
  };

  const handleDelete = (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      const updatedLessons = customLessons.filter(l => l.id !== lessonId);
      saveCustomLessons(updatedLessons);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAssignmentText = (assignedTo: 'all' | string[]) => {
    if (assignedTo === 'all') return 'All Students';
    return `${assignedTo.length} Student(s)`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Lesson Management</h2>
          <p className="text-gray-600">Upload and manage custom lessons for your students</p>
        </div>
        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {showUploadForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Lesson
            </>
          )}
        </Button>
      </div>

      {showUploadForm && (
        <Card className="mb-8 p-6 border-2 border-blue-200 bg-blue-50/50">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Advanced Fractions"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value: 'numbers' | 'operations') => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numbers">Numbers</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={difficulty} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignment">Assignment *</Label>
                <Select value={assignmentType} onValueChange={(value: 'all' | 'individual') => setAssignmentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="individual">Individual Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this lesson covers..."
                rows={3}
                required
              />
            </div>

            {assignmentType === 'individual' && (
              <div>
                <Label className="mb-2 block">Select Students *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-white rounded-lg border">
                  {students.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-full">No students available. Add students first.</p>
                  ) : (
                    students.map(student => (
                      <label
                        key={student.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{student.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Hand Signs *</Label>
                <Button
                  type="button"
                  onClick={handleAddSign}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Sign
                </Button>
              </div>
              <div className="space-y-3">
                {signs.map((sign, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 bg-white rounded-lg border">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Sign/Symbol *</Label>
                        <Input
                          value={sign.sign}
                          onChange={(e) => handleSignChange(index, 'sign', e.target.value)}
                          placeholder="e.g., ÷"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Meaning *</Label>
                        <Input
                          value={sign.meaning}
                          onChange={(e) => handleSignChange(index, 'meaning', e.target.value)}
                          placeholder="e.g., Divide"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Emoji (Optional)</Label>
                        <Input
                          value={sign.emoji}
                          onChange={(e) => handleSignChange(index, 'emoji', e.target.value)}
                          placeholder="e.g., ➗"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveSign(index)}
                      variant="ghost"
                      size="sm"
                      className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled={signs.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                {editingLesson ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-gray-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Custom Lessons ({customLessons.length})
        </h3>

        {customLessons.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No custom lessons yet</p>
            <p className="text-sm text-gray-400">Create your first lesson to get started</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customLessons.map((lesson) => (
              <Card key={lesson.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{lesson.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {lesson.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {lesson.signs.length} signs
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
                  {lesson.assignedTo === 'all' ? (
                    <>
                      <Users className="h-4 w-4" />
                      <span>All Students</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      <span>{Array.isArray(lesson.assignedTo) ? lesson.assignedTo.length : 0} Student(s)</span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(lesson)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(lesson.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
