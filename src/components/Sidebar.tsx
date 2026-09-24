import React from 'react';
import {
  Glasses,
  BookOpen,
  Briefcase,
  Shapes,
  Sparkles,
  Award,
  Zap,
  Radio,
  Hand,
  MicOff,
  Mic,
  Trophy,
  PlusCircle,
  Film,
  FileCheck,
  Users,
  ShieldCheck,
  GraduationCap,
  BarChart3
} from 'lucide-react';
import { NavTab, Peer, UserRole } from '../types';
import { sound } from '../utils/audio';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  peers: Peer[];
  onPeerClick: (peer: Peer) => void;
  userRole: UserRole;
  pendingGradingCount?: number;
  tutorLessonCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  peers,
  onPeerClick,
  userRole,
  pendingGradingCount = 2,
  tutorLessonCount = 4,
}) => {
  const isTutor = userRole === 'tutor';

  // Navigation Items demarcated per role
  const tutorNavItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    color?: string;
  }> = [
    { id: 'tutor_analytics', label: 'Tutor Analytics', icon: BarChart3, badge: 'Insights', color: 'text-amber-400' },
    { id: 'tutor_studio', label: 'Lesson & Video Studio', icon: PlusCircle, badge: 'Create', color: 'text-indigo-400' },
    { id: 'tutor_lessons', label: 'My Lessons & Videos', icon: Film, badge: `${tutorLessonCount}`, color: 'text-pink-400' },
    { id: 'classroom', label: '3D Classroom (Host)', icon: Glasses, badge: 'Live', color: 'text-cyan-400' },
    { id: 'tutor_grading', label: 'Grading Desk & Rubrics', icon: FileCheck, badge: `${pendingGradingCount} due`, color: 'text-emerald-400' },
    { id: 'curriculum', label: 'Curriculum Library', icon: BookOpen },
    { id: 'tutor_students', label: 'Student Cohort & Roster', icon: Users, color: 'text-sky-400' },
  ];

  const studentNavItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    color?: string;
  }> = [
    { id: 'classroom', label: '3D Virtual Classroom', icon: Glasses, badge: 'Live' },
    { id: 'curriculum', label: 'Curriculum Hub & Labs', icon: BookOpen, badge: 'New videos' },
    { id: 'lms', label: 'Assignments & Locker', icon: Briefcase },
    { id: 'leaderboard', label: 'Honor Roll & Leaderboard', icon: Trophy, color: 'text-amber-400' },
    { id: 'toddlersafe', label: 'Discovery Pod (Ages 1-5)', icon: Shapes, color: 'text-pink-400' },
    { id: 'pricing', label: 'Tuition & Pricing Plans', icon: Sparkles, badge: 'Save 30%', color: 'text-pink-400' },
  ];

  const activeNavItems = isTutor ? tutorNavItems : studentNavItems;

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between space-y-6 shadow-xl transition-all">
      <div className="space-y-6">
        {/* Workspace Label with Role Demarcation Badge */}
        <div className="flex items-center justify-between px-3">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            {isTutor ? 'Tutor Instruction Portal' : 'Student Workspace'}
          </p>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
              isTutor
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {isTutor ? 'Instructor' : 'Enrolled'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-1.5">
          {activeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playSound('click');
                  onSelectTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 text-left ${
                  isActive
                    ? isTutor
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    size={17}
                    className={`w-5 text-center flex-shrink-0 ${
                      isActive ? 'text-white' : item.color || 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ml-1.5 flex-shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Classroom Peers Roster */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {isTutor ? 'Classroom Attendees' : 'Live Room Peers'} ({peers.length})
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {peers.map((peer) => (
              <div
                key={peer.id}
                onClick={() => onPeerClick(peer)}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-700 group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-slate-900 ${
                        peer.status === 'Host' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    ></span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight group-hover:text-indigo-400 transition truncate max-w-[105px]">
                      {peer.name}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate max-w-[105px]">{peer.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {peer.handRaised && (
                    <span
                      title="Hand Raised"
                      className="p-1 rounded bg-amber-500/20 text-amber-400 animate-bounce"
                    >
                      <Hand size={11} />
                    </span>
                  )}
                  {peer.status === 'Host' ? (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                      Host
                    </span>
                  ) : isTutor ? (
                    <span
                      title="Tutor Control: Tap to manage or praise"
                      className="p-1 rounded bg-slate-800 text-slate-400 group-hover:text-amber-400 transition"
                    >
                      <Award size={12} />
                    </span>
                  ) : (
                    <span title="Send Star Kudos">
                      <Award
                        size={12}
                        className="text-slate-500 group-hover:text-amber-400 transition"
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Pro Plan Upgrade Promotion */}
      {!isTutor && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/30 text-xs space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 flex items-center gap-1">
              <Sparkles size={11} className="text-pink-400 animate-pulse" />
              <span>Pro Scholar Access</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[9px] font-black">
              50% OFF
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Unlock 4K video masterclasses, 3D atomic labs & live tutor office hours.
          </p>
          <button
            onClick={() => onSelectTab('pricing')}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-[11px] transition shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-1.5"
          >
            <span>View Student Plans</span>
            <Sparkles size={12} />
          </button>
        </div>
      )}

      {/* System Diagnostic Badge */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-xs space-y-2 shadow-md">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            <span>WebRTC Engine</span>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Zap size={11} /> 12ms Low-Lag
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">3D Spatial Physics</span>
          <span className="text-indigo-400 font-bold">120 FPS Active</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
          <div className="bg-gradient-to-r from-amber-500 via-indigo-500 to-pink-500 h-full w-[96%] transition-all duration-500"></div>
        </div>
      </div>
    </aside>
  );
};
