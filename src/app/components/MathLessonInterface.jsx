import { useState } from 'react';
import { motion } from 'motion/react';
import { PlayCircle, Sparkles, CheckCircle2, ArrowRight, Calculator } from 'lucide-react';

const prompts = [
  { topic: 'Addition', question: 'What is 24 + 18?', answer: '42', hint: 'Add the tens first, then the ones.' },
  { topic: 'Subtraction', question: 'What is 87 - 29?', answer: '58', hint: 'Subtract the ones, then the tens.' },
  { topic: 'Multiplication', question: 'What is 7 × 8?', answer: '56', hint: 'Think of 7 groups of 8.' },
  { topic: 'Division', question: 'What is 72 ÷ 8?', answer: '9', hint: 'How many groups of 8 make 72?' },
  { topic: 'Sequences', question: 'Complete the sequence: 2, 4, 6, 8, __', answer: '10', hint: 'This pattern adds 2 each time.' },
  { topic: 'Addition', question: 'What is 46 + 37?', answer: '83', hint: 'Add 40 and 30, then the rest.' },
];

export function MathLessonInterface({ username, role }) {
  const [step, setStep] = useState(0);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const currentPrompt = prompts[step];

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!response.trim()) {
      setFeedback('Please enter an answer first.');
      return;
    }

    if (response.trim() === currentPrompt.answer) {
      setFeedback('Correct! Great job.');
      return;
    }

    setFeedback(`Not quite. ${currentPrompt.hint}`);
  };

  const handleNext = () => {
    if (step < prompts.length - 1) {
      setStep(step + 1);
      setResponse('');
      setFeedback('');
    } else {
      setIsComplete(true);
      setFeedback('Lesson complete! You covered addition, subtraction, multiplication, division, and sequences.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-sm font-semibold mb-4 w-fit">
          <Sparkles className="h-4 w-4" />
          Math lesson for {username}
        </div>
        <h2 className="text-3xl font-extrabold mb-3">Practice numbers from 1 to 100.</h2>
        <p className="text-blue-50 max-w-2xl">Work through addition, subtraction, multiplication, division, and number sequences in one guided lesson.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Interactive Math Practice</h3>
            <p className="text-sm text-gray-500">{role === 'admin' ? 'Teacher view' : 'Student view'}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-500">Prompt {step + 1}/{prompts.length}</p>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{currentPrompt.topic}</span>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-gray-900">{currentPrompt.question}</p>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Type your answer and check it.</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              type="text"
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              placeholder="Enter your answer"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none ring-0 focus:border-blue-500"
            />
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white">
                Check Answer
              </button>
              <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700">
                {step < prompts.length - 1 ? 'Next Prompt' : 'Finish'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {feedback && <p className={`mt-4 text-sm font-semibold ${feedback.includes('Correct') ? 'text-green-600' : 'text-amber-600'}`}>{feedback}</p>}
        </div>
      </motion.div>
    </div>
  );
}
