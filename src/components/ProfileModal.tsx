import React, { useState, useRef } from 'react';
import {
  X,
  Award,
  Flame,
  Star,
  CheckCircle,
  ShieldCheck,
  Edit3,
  Briefcase,
  GraduationCap,
  BookOpen,
  Video,
  Sparkles,
  LogOut,
  ArrowRight,
  CreditCard,
  Camera,
  Upload,
  Mail,
  Trash2,
  UserPlus,
  AlertTriangle,
  Inbox
} from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenPricing?: () => void;
  onOpenAuthModal?: () => void;
  onOpenOnboarding?: () => void;
  onOpenVerification?: () => void;
  onOpenGmailInbox?: () => void;
  onDeleteCurrentStudent?: () => void;
  hasMultipleStudents?: boolean;
  onToast: (msg: string, title?: string) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onOpenPricing,
  onOpenAuthModal,
  onOpenOnboarding,
  onOpenVerification,
  onOpenGmailInbox,
  onDeleteCurrentStudent,
  hasMultipleStudents = false,
  onToast,
}) => {
  const [nameInput, setNameInput] = useState<string>(userProfile.name);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isTutor = userProfile.role === 'tutor';

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    onUpdateProfile({ name: nameInput.trim() });
    setIsEditingName(false);
    sound.playSound('success');
    onToast('Display name updated successfully', 'Profile');
  };

  const handleSelectAvatar = (url: string) => {
    onUpdateProfile({ avatar: url });
    sound.playSound('pop');
    onToast('Avatar updated', 'Profile');
  };

  // Image Upload File Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast('Please select a valid image file (PNG, JPG, WebP).', 'File Error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onToast('Image size exceeds 5MB limit.', 'File Size');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const resultUrl = event.target.result as string;
        onUpdateProfile({ avatar: resultUrl });
        sound.playSound('pop');
        onToast('Profile photo updated from device!', 'Photo Uploaded');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700/80 p-6 space-y-5 shadow-2xl relative bg-slate-950/95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            {isTutor ? (
              <Briefcase size={18} className="text-amber-400" />
            ) : (
              <ShieldCheck size={18} className="text-indigo-400" />
            )}
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {isTutor ? 'Tutor Faculty Profile & Credentials' : 'Student Academic Profile'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Profile Header Card */}
        <div
          className={`flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-2xl border relative ${
            isTutor
              ? 'bg-amber-950/20 border-amber-500/30'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          {/* Avatar with Camera upload button */}
          <div className="relative group">
            <img
              src={userProfile.avatar}
              alt="Avatar"
              className={`w-16 h-16 rounded-2xl object-cover border-2 shadow-md ${
                isTutor ? 'border-amber-500' : 'border-indigo-500'
              }`}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload your photo"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md transition"
            >
              <Camera size={13} />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSaveName}
                  className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h4 className="text-base font-bold text-white">{userProfile.name}</h4>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-white"
                >
                  <Edit3 size={13} />
                </button>
              </div>
            )}
            <p className={`text-xs font-semibold ${isTutor ? 'text-amber-400' : 'text-indigo-400'}`}>
              {isTutor ? 'Lead STEM & Physics Faculty' : userProfile.gradeLevel}
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-3 text-[11px] text-slate-400 pt-1">
              {isTutor ? (
                <>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <BookOpen size={13} />
                    <span>8 Course Modules</span>
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400 font-bold">
                    <Video size={13} />
                    <span>14 Video Masterclasses</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Flame size={13} fill="currentColor" />
                    <span>{userProfile.streakDays} Day Streak</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Star size={13} fill="currentColor" />
                    <span>{userProfile.points} Academic XP</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Email & Verification Status Section */}
        {!isTutor && (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail size={15} className="text-slate-400" />
                <span className="text-xs font-mono text-white font-bold">
                  {userProfile.email || 'student@gitas.edu'}
                </span>
              </div>

              {userProfile.emailVerified ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle size={11} />
                  <span>Email Verified</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                  <AlertTriangle size={11} />
                  <span>Verification Pending</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <p className="text-[11px] text-slate-400">
                {userProfile.emailVerified
                  ? 'Official verified student email on file.'
                  : 'Verify your Gmail to unlock grading and honors.'}
              </p>

              <div className="flex items-center space-x-2">
                {!userProfile.emailVerified && onOpenVerification && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVerification();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition flex items-center space-x-1"
                  >
                    <ShieldCheck size={12} />
                    <span>Verify Email</span>
                  </button>
                )}

                {onOpenGmailInbox && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenGmailInbox();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] transition flex items-center space-x-1"
                  >
                    <Inbox size={12} />
                    <span>Gmail Alerts</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Avatar Upload & Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Choose or Upload Photo</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Upload size={12} />
              <span>Upload Custom Image</span>
            </button>
          </div>
          <div className="flex items-center space-x-3 overflow-x-auto py-1">
            {AVATAR_OPTIONS.map((url, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAvatar(url)}
                className={`relative rounded-full p-0.5 border-2 transition ${
                  userProfile.avatar === url
                    ? 'border-indigo-500 scale-110 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={url}
                  alt={`Option ${idx}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Fake Demo Student Deletion Banner (if profile is the fake demo account) */}
        {!isTutor && userProfile.isFakeDemo && (
          <div className="p-3.5 rounded-2xl bg-pink-950/20 border border-pink-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <Trash2 size={13} />
                Fake Demo Account (Alex Morgan)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Placeholder</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              This is the initial fake demo student account. You can purge/delete it and onboard your real student identity.
            </p>
            {onDeleteCurrentStudent && (
              <button
                onClick={() => setConfirmDeleteModal(true)}
                className="w-full py-2 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/50 text-pink-200 font-bold text-xs transition flex items-center justify-center space-x-1.5"
              >
                <Trash2 size={13} />
                <span>Delete Fake Student & Switch</span>
              </button>
            )}
          </div>
        )}

        {/* Badges / Certifications */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-300">
            {isTutor ? 'Faculty Certifications & Honors' : 'Earned Honors & Badges'}
          </label>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {userProfile.badges.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-2xl border flex items-center space-x-2.5 ${
                  b.earned
                    ? 'bg-slate-900/80 border-indigo-500/40 text-white'
                    : 'bg-slate-900/30 border-slate-800 text-slate-600 opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    b.earned
                      ? isTutor
                        ? 'bg-amber-600/30 text-amber-400'
                        : 'bg-indigo-600/30 text-indigo-400'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Award size={16} />
                </div>
                <div>
                  <p className="font-bold leading-tight">{b.title}</p>
                  <p className="text-[10px] text-slate-400">
                    {b.earned ? b.date || 'Active' : 'Locked'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Membership Tier Card */}
        {!isTutor && (
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {userProfile.planTier ? `${userProfile.planTier.toUpperCase()} PLAN` : 'FREE TRIAL'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {userProfile.planRenewalDate || 'Renews next month • All 3D labs unlocked'}
                </p>
              </div>
            </div>

            {onOpenPricing && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center space-x-1"
              >
                <Sparkles size={12} />
                <span>Plans</span>
              </button>
            )}
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {!isTutor && onOpenOnboarding && (
              <button
                onClick={() => {
                  onClose();
                  onOpenOnboarding();
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 py-1.5 px-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition"
              >
                <UserPlus size={13} />
                <span>Onboard New Student</span>
              </button>
            )}

            {onOpenAuthModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 py-1.5 px-2.5 rounded-xl hover:bg-slate-800 transition"
              >
                <LogOut size={13} />
                <span>Switch Portal</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
              isTutor
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            Close
          </button>
        </div>

        {/* Confirmation Modal for Deleting Fake Student */}
        {confirmDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-panel w-full max-w-sm rounded-3xl border border-pink-500/40 p-5 space-y-4 bg-slate-950 shadow-2xl">
              <div className="flex items-center space-x-2 text-pink-400">
                <Trash2 size={20} />
                <h4 className="text-sm font-bold text-white">Delete Fake Demo Student?</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-white">Alex Morgan</span>? This will permanently purge the placeholder account.
              </p>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setConfirmDeleteModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmDeleteModal(false);
                    if (onDeleteCurrentStudent) onDeleteCurrentStudent();
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-600/25"
                >
                  Yes, Delete Fake Student
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
