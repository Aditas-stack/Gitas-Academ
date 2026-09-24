import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Film,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Share2,
  BarChart3
} from 'lucide-react';
import { CurriculumItem } from '../types';
import { sound } from '../utils/audio';

interface TutorLessonsManagerProps {
  lessons: CurriculumItem[];
  onCreateNew: () => void;
  onEditLesson: (lesson: CurriculumItem) => void;
  onDeleteLesson: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onPreviewLesson: (lesson: CurriculumItem) => void;
  onOpenAnalytics?: () => void;
  onToast: (msg: string, title?: string) => void;
}

export const TutorLessonsManager: React.FC<TutorLessonsManagerProps> = ({
  lessons,
  onCreateNew,
  onEditLesson,
  onDeleteLesson,
  onTogglePublish,
  onPreviewLesson,
  onOpenAnalytics,
  onToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tutorLessons = lessons.filter((l) => l.isTutorCreated || l.video);

  const filtered = tutorLessons.filter((l) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && l.status !== 'draft') ||
      (filterStatus === 'draft' && l.status === 'draft') ||
      (filterStatus === 'has_video' && !!l.video);
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Analytics
  const totalVideoMinutes = tutorLessons.reduce(
    (acc, curr) => acc + (curr.video?.durationMinutes || 0),
    0
  );
  const totalPublished = tutorLessons.filter((l) => l.status !== 'draft').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Tutor Courseware & Video Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            My Created Lessons & Video Lectures
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Manage your bespoke curriculum lessons, stream educational video demonstrations, review interactive lab bindings, and monitor student completion progress.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs shadow-md transition flex items-center space-x-2"
            >
              <BarChart3 size={16} />
              <span>Analytics & Metrics</span>
            </button>
          )}

          <button
            onClick={onCreateNew}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Create New Lesson</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Lessons</span>
          <p className="text-2xl font-extrabold text-white font-heading">{tutorLessons.length}</p>
          <p className="text-[10px] text-emerald-400 font-semibold">{totalPublished} Published Live</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Video Content</span>
          <p className="text-2xl font-extrabold text-amber-400 font-heading">{totalVideoMinutes} mins</p>
          <p className="text-[10px] text-slate-400">High-Definition Demonstrations</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Student Enrolled</span>
          <p className="text-2xl font-extrabold text-indigo-400 font-heading">148</p>
          <p className="text-[10px] text-slate-400">Across 3 Grade Pods</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Quiz Mastery</span>
          <p className="text-2xl font-extrabold text-pink-400 font-heading">94.6%</p>
          <p className="text-[10px] text-emerald-400 font-semibold">+4.2% this quarter</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your lessons, topics, tags..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Filter size={13} />
            <span className="hidden sm:inline">Status:</span>
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Lessons ({tutorLessons.length})</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts</option>
            <option value="has_video">Includes Video</option>
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between overflow-hidden group shadow-xl"
          >
            {/* Card Media Preview Header */}
            <div className="relative bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    item.status === 'draft'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {item.status === 'draft' ? 'Draft' : 'Published'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {item.grade}
                </span>
              </div>

              {item.video && (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded-md border border-pink-500/30">
                  <Film size={11} />
                  <span>{item.video.durationMinutes}m Video</span>
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.desc}
                </p>

                {item.objectives && item.objectives.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">
                      Target Objectives:
                    </p>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      {item.objectives.slice(0, 2).map((obj, i) => (
                        <li key={i} className="truncate">{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Meta Stats */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-500" />
                  <span>{item.durationMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <HelpCircle size={12} className="text-pink-400" />
                  <span>{item.customQuizzes?.length || 2} Quizzes</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <span>5.0</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-3.5 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onPreviewLesson(item)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Eye size={13} className="text-indigo-400" />
                <span>Student Preview</span>
              </button>

              <button
                onClick={() => onEditLesson(item)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white transition"
                title="Edit Lesson"
              >
                <Edit3 size={15} />
              </button>

              <button
                onClick={() => onTogglePublish(item.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white transition"
                title={item.status === 'draft' ? 'Publish Now' : 'Unpublish to Draft'}
              >
                <CheckCircle2 size={15} />
              </button>

              <button
                onClick={() => onDeleteLesson(item.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 transition"
                title="Delete Lesson"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 text-slate-400 space-y-3">
          <BookOpen size={36} className="mx-auto text-amber-400/60" />
          <h4 className="text-base font-bold text-white">No lessons found in this view</h4>
          <p className="text-xs max-w-sm mx-auto">
            You can create a new bespoke interactive lesson with videos, 3D labs, and quizzes using the Studio.
          </p>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition inline-flex items-center space-x-1.5 shadow-lg"
          >
            <Plus size={14} />
            <span>Create First Lesson</span>
          </button>
        </div>
      )}
    </div>
  );
};
