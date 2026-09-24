import React, { useState } from 'react';
import {
  BookOpen,
  Filter,
  Search,
  Sparkles,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Atom,
  Binary,
  Layers,
  Globe2,
  Shapes,
  PenTool,
  Bookmark,
  Film,
  Plus,
  GraduationCap,
  Play
} from 'lucide-react';
import { CurriculumItem, GradePod, UserRole } from '../types';
import { sound } from '../utils/audio';

interface CurriculumHubProps {
  currentPod: GradePod;
  curriculumList: CurriculumItem[];
  onLaunchModule: (item: CurriculumItem) => void;
  userRole?: UserRole;
  onCreateLesson?: () => void;
  onOpenPricing?: () => void;
}

export const CurriculumHub: React.FC<CurriculumHubProps> = ({
  currentPod,
  curriculumList,
  onLaunchModule,
  userRole = 'student',
  onCreateLesson,
  onOpenPricing,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = curriculumList.filter((item) => {
    let matchesCat = true;
    if (categoryFilter === 'all') {
      matchesCat = true;
    } else if (categoryFilter === 'tutor') {
      matchesCat = !!item.isTutorCreated;
    } else if (categoryFilter === 'video') {
      matchesCat = !!item.video;
    } else {
      matchesCat = item.category === categoryFilter;
    }

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tutorName && item.tutorName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'atom':
        return <Atom className="text-purple-400" size={24} />;
      case 'binary':
        return <Binary className="text-indigo-400" size={24} />;
      case 'globe':
        return <Globe2 className="text-emerald-400" size={24} />;
      case 'shapes':
        return <Shapes className="text-rose-400" size={24} />;
      case 'pen':
        return <PenTool className="text-pink-400" size={24} />;
      default:
        return <BookOpen className="text-indigo-400" size={24} />;
    }
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
            <Sparkles size={12} />
            <span>Interactive Learning Pathways & Video Lectures</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Curriculum Hub & Courseware
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Spatial 3D labs, tutor instructional video demonstrations, and automated real-time assessments for STEM,
            Humanities, Global Languages, and Sensory Early Learning.
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons, tutors..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              sound.playSound('click');
            }}
            className="bg-slate-900 border border-slate-700/80 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Lessons ({curriculumList.length})</option>
            <option value="tutor">👨‍🏫 Tutor Created Lessons</option>
            <option value="video">🎬 With Video Lectures</option>
            <option value="stem">STEM (Math & Physics)</option>
            <option value="humanities">Humanities & History</option>
            <option value="language">Languages & Literature</option>
            <option value="toddler">Toddler Sensory (1-5)</option>
          </select>

          {userRole === 'tutor' && onCreateLesson && (
            <button
              onClick={onCreateLesson}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Create Lesson</span>
            </button>
          )}

          {userRole === 'student' && onOpenPricing && (
            <button
              onClick={() => {
                sound.playSound('click');
                onOpenPricing();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-pink-300" />
              <span>Unlock All Courses</span>
            </button>
          )}
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`glass-panel p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 group shadow-lg ${
              item.isTutorCreated
                ? 'border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/10'
                : 'border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10'
            }`}
          >
            <div className="space-y-3">
              {/* Badges and Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  {getIcon(item.icon)}
                </div>

                <div className="flex items-center space-x-1.5 flex-wrap justify-end gap-1">
                  {item.isTutorCreated && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <span>Tutor Original</span>
                    </span>
                  )}
                  {item.video && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                      <Film size={10} />
                      <span>{item.video.durationMinutes}m Video</span>
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700">
                    {item.grade}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* Tutor Author info if tutor created */}
              {item.isTutorCreated && item.tutorName && (
                <div className="flex items-center space-x-2 pt-1">
                  <img
                    src={item.tutorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop'}
                    alt="Tutor"
                    className="w-5 h-5 rounded-full object-cover border border-amber-500"
                  />
                  <span className="text-[10px] text-amber-300 font-semibold truncate">
                    Taught by {item.tutorName}
                  </span>
                </div>
              )}

              {/* Meta stats: duration & rating */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.durationMinutes} mins</span>
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <span>{item.rating.toFixed(1)}</span>
                </span>
              </div>
            </div>

            {/* Launch Module Button */}
            <button
              onClick={() => {
                sound.playSound('pop');
                onLaunchModule(item);
              }}
              className={`w-full py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md ${
                item.video
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:opacity-95'
                  : 'bg-slate-800 group-hover:bg-indigo-600'
              }`}
            >
              {item.video ? (
                <>
                  <Play size={13} fill="currentColor" />
                  <span>Watch Video & Launch Lab</span>
                </>
              ) : (
                <>
                  <span>{item.completed ? 'Revisit Module' : 'Launch Module Lab'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 text-slate-400 space-y-2">
          <p className="text-sm font-bold text-slate-300">No curriculum modules matched your search.</p>
          <p className="text-xs">Try selecting a different discipline or adjusting your keywords.</p>
        </div>
      )}
    </section>
  );
};
