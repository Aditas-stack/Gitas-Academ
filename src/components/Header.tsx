import React, { useState } from 'react';
import {
  Box,
  Bell,
  Sparkles,
  ChevronDown,
  User,
  GraduationCap,
  Briefcase,
  Plus,
  Flame,
  Zap,
  Check,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { GradePod, UserProfile, UserRole } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentPod: GradePod;
  onSelectPod: (pod: GradePod) => void;
  userProfile: UserProfile;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onCreateLesson?: () => void;
  onOpenPricing?: () => void;
  onOpenAuthModal?: () => void;
  onOpenOnboarding?: () => void;
  onOpenVerification?: () => void;
  onOpenGmailInbox?: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount: number;
  gmailUnreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPod,
  onSelectPod,
  userProfile,
  userRole,
  onSwitchRole,
  onCreateLesson,
  onOpenPricing,
  onOpenAuthModal,
  onOpenOnboarding,
  onOpenVerification,
  onOpenGmailInbox,
  onOpenNotifications,
  onOpenProfile,
  unreadCount,
  gmailUnreadCount = 0,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  const isTutor = userRole === 'tutor';

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between shadow-2xl transition-colors duration-300">
      {/* Brand logo & tagline */}
      <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all ${
          isTutor
            ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-indigo-600 shadow-amber-600/30'
            : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-600 shadow-indigo-600/30'
        }`}>
          <Box size={22} className="animate-spin" style={{ animationDuration: '14s' }} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-pink-400 bg-clip-text text-transparent font-heading">
              GITAS ACADEMY
            </span>
            <span className={`hidden sm:inline text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
              isTutor
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
            }`}>
              {isTutor ? '👨‍🏫 Tutor Portal' : '🎓 Student Mode'}
            </span>
          </div>
          <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
            3D Immersive Real-Time OS
          </span>
        </div>
      </div>

      {/* Center: Grade Pod Switcher */}
      <div className="hidden xl:flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 space-x-1 shadow-inner">
        <button
          onClick={() => {
            sound.playSound('pod_switch');
            onSelectPod('toddler');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center space-x-1.5 ${
            currentPod === 'toddler'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles size={13} />
          <span>Discovery Pod (1-5)</span>
        </button>

        <button
          onClick={() => {
            sound.playSound('pod_switch');
            onSelectPod('explorer');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center space-x-1.5 ${
            currentPod === 'explorer'
              ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles size={13} />
          <span>Explorer Hub (6-9)</span>
        </button>

        <button
          onClick={() => {
            sound.playSound('pod_switch');
            onSelectPod('academy');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center space-x-1.5 ${
            currentPod === 'academy'
              ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles size={13} />
          <span>Academy Core (10-15)</span>
        </button>
      </div>

      {/* Right: Role Demarcator Switcher & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Tutor Quick "+ Create Lesson" Button */}
        {isTutor && onCreateLesson && (
          <button
            onClick={() => {
              sound.playSound('click');
              onCreateLesson();
            }}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition"
          >
            <Plus size={15} />
            <span>Create Lesson</span>
          </button>
        )}

        {/* Student Pricing & Plans Button */}
        {!isTutor && onOpenPricing && (
          <button
            onClick={() => {
              sound.playSound('click');
              onOpenPricing();
            }}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 text-pink-300 border border-pink-500/40 hover:border-pink-300 hover:bg-pink-500/30 font-extrabold text-xs shadow-md transition"
          >
            <Sparkles size={13} className="text-pink-400 animate-pulse" />
            <span>Tuition & Plans</span>
            <span className="px-1.5 py-0.2 rounded-md bg-pink-500 text-white text-[9px] font-black uppercase tracking-wider">
              30% OFF
            </span>
          </button>
        )}

        {/* Dynamic Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              sound.playSound('click');
              setRoleDropdownOpen(!roleDropdownOpen);
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition shadow-sm ${
              isTutor
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 hover:bg-amber-900/50'
                : 'bg-indigo-950/40 border-indigo-500/60 text-indigo-300 hover:bg-indigo-900/50'
            }`}
          >
            {isTutor ? <Briefcase size={14} className="text-amber-400" /> : <GraduationCap size={14} className="text-indigo-400" />}
            <span className="hidden sm:inline font-heading tracking-wide">
              {isTutor ? 'Tutor View' : 'Student View'}
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {/* Role selection popover */}
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
              <p className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 tracking-wider">
                Switch Active Persona
              </p>

              {/* Student Role Option */}
              <button
                onClick={() => {
                  sound.playSound('pod_switch');
                  onSwitchRole('student');
                  setRoleDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition mb-1 ${
                  !isTutor
                    ? 'bg-indigo-600/30 text-white font-bold border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <GraduationCap size={15} />
                  </div>
                  <div>
                    <p className="leading-tight">Student Access</p>
                    <p className="text-[10px] text-slate-400 font-normal">Alex Morgan (Grade 8)</p>
                  </div>
                </div>
                {!isTutor && <Check size={14} className="text-indigo-400" />}
              </button>

              {/* Tutor Role Option */}
              <button
                onClick={() => {
                  sound.playSound('pod_switch');
                  onSwitchRole('tutor');
                  setRoleDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition mb-2 ${
                  isTutor
                    ? 'bg-amber-500/20 text-white font-bold border border-amber-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Briefcase size={15} />
                  </div>
                  <div>
                    <p className="leading-tight">Tutor / Host Portal</p>
                    <p className="text-[10px] text-amber-400 font-normal">Dr. Aris Thorne (Instructor)</p>
                  </div>
                </div>
                {isTutor && <Check size={14} className="text-amber-400" />}
              </button>

              {/* Onboard New Student Direct Link */}
              {!isTutor && onOpenOnboarding && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sound.playSound('click');
                      setRoleDropdownOpen(false);
                      onOpenOnboarding();
                    }}
                    className="w-full flex items-center justify-center space-x-2 p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold transition border border-indigo-500/30"
                  >
                    <GraduationCap size={14} className="text-indigo-400" />
                    <span>+ Onboard New Student</span>
                  </button>
                </div>
              )}

              {/* Auth Portal Gateway Link */}
              {onOpenAuthModal && (
                <div className="pt-1.5">
                  <button
                    onClick={() => {
                      sound.playSound('click');
                      setRoleDropdownOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full flex items-center justify-center space-x-2 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    <ShieldCheck size={14} className="text-indigo-400" />
                    <span>Open Login Gateway Portal...</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Email Verification Banner Pill (if student email is unverified) */}
        {!isTutor && !userProfile.emailVerified && onOpenVerification && (
          <button
            onClick={() => {
              sound.playSound('click');
              onOpenVerification();
            }}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-300 font-bold text-xs transition animate-pulse"
            title="Click to verify your student email with 6-digit code"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Verify Email</span>
          </button>
        )}

        {/* Gmail Notification Hub Button */}
        {onOpenGmailInbox && (
          <button
            onClick={() => {
              sound.playSound('click');
              onOpenGmailInbox();
            }}
            className="relative p-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-red-400 transition border border-slate-700/60 shadow-sm"
            title="Gmail Notification Hub"
          >
            <Mail size={17} />
            {gmailUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black shadow-sm">
                {gmailUnreadCount}
              </span>
            )}
          </button>
        )}

        {/* General Notifications */}
        <button
          onClick={() => {
            sound.playSound('click');
            onOpenNotifications();
          }}
          className="relative p-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 transition border border-slate-700/60 shadow-sm"
          title="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping"></span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
            </>
          )}
        </button>

        {/* Profile Pill */}
        <button
          onClick={() => {
            sound.playSound('click');
            onOpenProfile();
          }}
          className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800/90 px-2.5 py-1.5 rounded-2xl border border-slate-700/60 transition shadow-sm"
        >
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt="Avatar"
              className={`w-7 h-7 rounded-full object-cover border-2 shadow-sm ${
                isTutor ? 'border-amber-500' : 'border-indigo-500'
              }`}
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900"></span>
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center space-x-1.5">
              <p className="text-xs font-bold text-white leading-tight">{userProfile.name}</p>
              {!isTutor && (
                <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {userProfile.planTier === 'scholar'
                    ? 'Scholar'
                    : userProfile.planTier === 'genius'
                    ? 'Genius'
                    : userProfile.planTier === 'starter'
                    ? 'Starter'
                    : 'Trial'}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {isTutor ? 'Lead STEM Instructor' : userProfile.gradeLevel}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
