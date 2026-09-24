import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Award,
  Download,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Send,
  User,
  FileText,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { Assignment, GradePod } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TutorGradingDeskProps {
  assignments: Assignment[];
  onGradeAssignment: (id: string, score: string, feedback: string) => void;
  onToast: (msg: string, title?: string) => void;
}

export const TutorGradingDesk: React.FC<TutorGradingDeskProps> = ({
  assignments,
  onGradeAssignment,
  onToast,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(assignments[0] || null);
  const [gradeInput, setGradeInput] = useState<string>('98');
  const [feedbackInput, setFeedbackInput] = useState<string>(
    'Exceptional mathematical derivation and rigorous analytical proof. Your conceptual reasoning on the gradient vector is exemplary!'
  );
  const [accuracyScore, setAccuracyScore] = useState<number>(48); // max 50
  const [derivationScore, setDerivationScore] = useState<number>(30); // max 30
  const [clarityScore, setClarityScore] = useState<number>(20); // max 20
  const [filter, setFilter] = useState<'all' | 'needs_grading' | 'graded'>('all');

  // Quick feedback template presets for the tutor
  const FEEDBACK_PRESETS = [
    'Flawless proof! Your dimensional analysis and physical reasoning are completely sound.',
    'Great structure and clarity. Consider double-checking the boundary conditions in step 3.',
    'Exemplary conceptual visualization! Keep up the brilliant momentum.',
    'Thorough exploration of the 3D spatial simulation. Well-documented lab report.',
  ];

  const handleSelect = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    if (assignment.score) {
      const parsed = parseInt(assignment.score.split('/')[0]) || 95;
      setGradeInput(parsed.toString());
    } else {
      setGradeInput('95');
    }
    if (assignment.feedback) {
      setFeedbackInput(assignment.feedback);
    }
    sound.playSound('click');
  };

  const handleUpdateRubric = (accuracy: number, derivation: number, clarity: number) => {
    setAccuracyScore(accuracy);
    setDerivationScore(derivation);
    setClarityScore(clarity);
    const total = accuracy + derivation + clarity;
    setGradeInput(total.toString());
  };

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const formattedScore = `${gradeInput}/100`;
    onGradeAssignment(selectedAssignment.id, formattedScore, feedbackInput);

    sound.playSound('success');
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
    });

    onToast(
      `Grade of ${formattedScore} and detailed tutor feedback returned to ${selectedAssignment.studentName || 'student'}!`,
      'Submission Graded'
    );
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'needs_grading') return !a.score || a.status !== 'Submitted';
    if (filter === 'graded') return !!a.score && a.status === 'Submitted';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Tutor Academic Assessment Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Student Submissions & Rubric Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Review student lab reports, mathematical derivations, and project proofs. Assign weighted rubric scores and personalized academic feedback directly back to student lockers.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex bg-slate-900 border border-slate-700/80 rounded-2xl p-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Submissions ({assignments.length})
          </button>
          <button
            onClick={() => setFilter('needs_grading')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === 'needs_grading' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setFilter('graded')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === 'graded' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Graded
          </button>
        </div>
      </div>

      {/* Main Grid: Left List (4 cols) & Right Grading Form (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Submissions Roster */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Submissions Queue ({filteredAssignments.length})
          </p>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredAssignments.map((a) => {
              const isSelected = selectedAssignment?.id === a.id;
              const hasScore = !!a.score;

              return (
                <div
                  key={a.id}
                  onClick={() => handleSelect(a)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2.5 shadow-md ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/80 shadow-amber-500/10'
                      : 'glass-panel border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={a.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces'}
                        alt="Student"
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">
                          {a.studentName || 'Alex Morgan'}
                        </p>
                        <p className="text-[10px] text-indigo-400 font-medium">{a.subject}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        hasScore
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {hasScore ? a.score : 'Needs Grade'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{a.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{a.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>Due: {a.dueDate}</span>
                    </span>
                    {a.submittedFile && (
                      <span className="text-indigo-400 flex items-center gap-1 truncate max-w-[130px]">
                        <FileText size={11} />
                        <span className="truncate">{a.submittedFile}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Grading Panel */}
        <div className="lg:col-span-7">
          {selectedAssignment ? (
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              {/* Header of selected assignment */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      {selectedAssignment.subject}
                    </span>
                    <span className="text-xs text-slate-400">Student: <strong>{selectedAssignment.studentName || 'Alex Morgan'}</strong></span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white font-heading">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    {selectedAssignment.description}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Current Status</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    {selectedAssignment.score || 'Ungraded'}
                  </span>
                </div>
              </div>

              {/* Submitted Student Artifact preview */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCheck size={14} className="text-indigo-400" />
                  <span>Submitted Work & Artifacts</span>
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      PDF
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {selectedAssignment.submittedFile || 'Calculus_ProblemSet_Proofs.pdf'}
                      </p>
                      <p className="text-[10px] text-slate-400">Verified WebGL spatial solution attached • 1.4 MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToast('Downloaded submitted assignment artifact', 'File Download')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Download artifact"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Rubric Evaluator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Weighted Rubric Scoring</span>
                  </h4>
                  <span className="text-xs font-extrabold text-amber-400 font-mono bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    Calculated Total: {gradeInput}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                  {/* Accuracy */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-300">
                      <span>Theory & Accuracy</span>
                      <strong className="text-amber-400">{accuracyScore}/50</strong>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      value={accuracyScore}
                      onChange={(e) => handleUpdateRubric(parseInt(e.target.value), derivationScore, clarityScore)}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Mathematical Derivations */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-300">
                      <span>Proofs & Derivations</span>
                      <strong className="text-indigo-400">{derivationScore}/30</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      value={derivationScore}
                      onChange={(e) => handleUpdateRubric(accuracyScore, parseInt(e.target.value), clarityScore)}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Formatting & Cohesion */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-300">
                      <span>Presentation & Rigor</span>
                      <strong className="text-pink-400">{clarityScore}/20</strong>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={clarityScore}
                      onChange={(e) => handleUpdateRubric(accuracyScore, derivationScore, parseInt(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Tutor Personalized Feedback Box */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-indigo-400" />
                    <span>Personalized Tutor Feedback</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Visible directly in student portal</span>
                </div>

                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  rows={3}
                  placeholder="Write constructive guidance, commendations, or areas for proof revision..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />

                {/* Feedback Presets */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Quick Commendation Suggestions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {FEEDBACK_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFeedbackInput(preset);
                          sound.playSound('click');
                        }}
                        className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 transition text-left"
                      >
                        {preset.slice(0, 45)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Grade Button */}
              <div className="pt-2">
                <button
                  onClick={handleSubmitGrade}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
                >
                  <Send size={15} />
                  <span>Return Grade & Notify Student</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 text-slate-400 space-y-2">
              <FileCheck size={36} className="mx-auto text-amber-400/60" />
              <p className="text-sm font-bold text-white">Select a student submission to evaluate</p>
              <p className="text-xs">Select any submission from the queue on the left to begin grading.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
