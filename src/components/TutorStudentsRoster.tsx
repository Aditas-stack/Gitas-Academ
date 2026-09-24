import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Star,
  Flame,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { GradePod, Peer } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StudentRecord {
  id: string;
  name: string;
  avatar: string;
  pod: GradePod;
  gradeLevel: string;
  completedLessons: number;
  videosWatched: number;
  averageScore: number;
  streakDays: number;
  status: 'Online' | 'Offline' | 'In Lab';
  notes: string;
}

interface TutorStudentsRosterProps {
  onToast: (msg: string, title?: string) => void;
  onSelectStudent?: (student: StudentRecord) => void;
  customStudents?: StudentRecord[];
  onDeleteStudent?: (id: string) => void;
}

export const TutorStudentsRoster: React.FC<TutorStudentsRosterProps> = ({
  onToast,
  onSelectStudent,
  customStudents,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPod, setSelectedPod] = useState<string>('all');

  const [initialStudents, setInitialStudents] = useState<StudentRecord[]>([
    {
      id: 'st-1',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      pod: 'academy',
      gradeLevel: 'Academy Core (Grade 8)',
      completedLessons: 6,
      videosWatched: 8,
      averageScore: 98,
      streakDays: 14,
      status: 'Online',
      notes: 'Exceptional in multivariable calculus & quantum lab proofs.',
    },
    {
      id: 'st-2',
      name: 'Liam Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      pod: 'academy',
      gradeLevel: 'Academy Core (Grade 8)',
      completedLessons: 5,
      videosWatched: 6,
      averageScore: 94,
      streakDays: 9,
      status: 'In Lab',
      notes: 'Active participant in 3D spatial simulation questions.',
    },
    {
      id: 'st-3',
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      pod: 'academy',
      gradeLevel: 'Academy Core (Grade 8)',
      completedLessons: 5,
      videosWatched: 7,
      averageScore: 96,
      streakDays: 18,
      status: 'Online',
      notes: 'Brilliant essay interpretations of Shakespeare and literature.',
    },
    {
      id: 'st-4',
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      pod: 'explorer',
      gradeLevel: 'Explorer Hub (Grade 7)',
      completedLessons: 4,
      videosWatched: 5,
      averageScore: 91,
      streakDays: 7,
      status: 'In Lab',
      notes: 'Working on ancient Rome architectural structural simulations.',
    },
    {
      id: 'st-5',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      pod: 'explorer',
      gradeLevel: 'Explorer Hub (Grade 8)',
      completedLessons: 4,
      videosWatched: 4,
      averageScore: 93,
      streakDays: 11,
      status: 'Offline',
      notes: 'Completed Ecosystem multi-species balance model.',
    },
    {
      id: 'st-6',
      name: 'Leo & Maya (Toddler Discovery)',
      avatar: 'https://images.unsplash.com/photo-1595454223600-91fbdd7ee784?w=100&h=100&fit=crop',
      pod: 'toddler',
      gradeLevel: 'Discovery Pod (Ages 1-5)',
      completedLessons: 8,
      videosWatched: 12,
      averageScore: 100,
      streakDays: 20,
      status: 'Online',
      notes: 'Mastered ABC phonics, tactile animal sounds, and nursery melodies.',
    },
  ]);

  const students = customStudents && customStudents.length > 0 ? customStudents : initialStudents;

  const handleDeleteStudentRecord = (id: string, name: string) => {
    sound.playSound('pop');
    if (onDeleteStudent) {
      onDeleteStudent(id);
    } else {
      setInitialStudents((prev) => prev.filter((s) => s.id !== id));
    }
    onToast(`Student record for ${name} removed from roster.`, 'Student Deleted');
  };

  const handleSendKudos = (student: StudentRecord) => {
    sound.playSound('success');
    confetti({ particleCount: 40, spread: 50 });
    onToast(`Sent Academic Honors & Gold Star Kudos to ${student.name}! ⭐`, 'Tutor Commendation');
  };

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPod = selectedPod === 'all' || s.pod === selectedPod;
    return matchesSearch && matchesPod;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Tutor Classroom Roster & Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Student Performance & Pod Cohort
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Monitor real-time student engagement, lesson completion rates, video watch duration, and assessment scores across all 3 grade pods.
          </p>
        </div>

        {/* Pod Selector */}
        <div className="flex bg-slate-900 border border-slate-700/80 rounded-2xl p-1 text-xs">
          <button
            onClick={() => setSelectedPod('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedPod === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cohorts ({students.length})
          </button>
          <button
            onClick={() => setSelectedPod('academy')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedPod === 'academy' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Academy Core
          </button>
          <button
            onClick={() => setSelectedPod('explorer')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedPod === 'explorer' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Explorer Hub
          </button>
          <button
            onClick={() => setSelectedPod('toddler')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              selectedPod === 'toddler' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Discovery Pod
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, subject, notes..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <p className="text-xs text-slate-400">
          Showing <strong className="text-white">{filtered.length}</strong> active student records
        </p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="glass-panel p-5 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              {/* Header with avatar & status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:border-amber-500 transition"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        s.status === 'Online'
                          ? 'bg-emerald-500'
                          : s.status === 'In Lab'
                          ? 'bg-indigo-500'
                          : 'bg-slate-500'
                      }`}
                    ></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition">
                      {s.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">{s.gradeLevel}</p>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        s.status === 'Online'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : s.status === 'In Lab'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">GPA Score</span>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono">
                    {s.averageScore}%
                  </span>
                </div>
              </div>

              {/* Stats metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80 text-[11px] text-center">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Lessons</span>
                  <span className="font-extrabold text-white">{s.completedLessons}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Videos</span>
                  <span className="font-extrabold text-indigo-400">{s.videosWatched}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Streak</span>
                  <span className="font-extrabold text-amber-400 flex items-center justify-center gap-0.5">
                    <Flame size={11} fill="currentColor" /> {s.streakDays}d
                  </span>
                </div>
              </div>

              {/* Notes */}
              <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                &ldquo;{s.notes}&rdquo;
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => handleSendKudos(s)}
                className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Award size={13} />
                <span>Award Kudos</span>
              </button>

              <button
                onClick={() => {
                  sound.playSound('click');
                  onToast(`Sent feedback message to ${s.name}`, 'Message Sent');
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Direct Message"
              >
                <MessageSquare size={14} />
              </button>

              <button
                onClick={() => handleDeleteStudentRecord(s.id, s.name)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/30 transition"
                title="Delete Student Record"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
