import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  User,
  Mail,
  Lock,
  GraduationCap,
  Sparkles,
  Camera,
  Trash2,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Atom,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { GradePod, UserProfile } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (newStudent: UserProfile, shouldDeleteFakeDemo: boolean) => void;
  hasFakeDemoStudent: boolean;
  onToast: (msg: string, title?: string) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=faces',
];

const INTEREST_OPTIONS = [
  'Theoretical & Quantum Physics',
  'Multivariable Calculus & Geometry',
  'Astrophysics & Space Systems',
  'Biomolecular Engineering',
  'AI & Computer Systems',
  'Classical & Renaissance Literature',
  'Ancient World History',
  'Toddler Sensory & Phonics'
];

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
  hasFakeDemoStudent,
  onToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [avatar, setAvatar] = useState<string>(AVATAR_PRESETS[1]);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState<boolean>(false);
  const [pod, setPod] = useState<GradePod>('academy');
  const [gradeLevel, setGradeLevel] = useState<string>('Academy Core (Grade 8)');
  const [bio, setBio] = useState<string>('Passionate STEM student eager to explore 3D spatial simulations.');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Theoretical & Quantum Physics',
    'Multivariable Calculus & Geometry'
  ]);
  const [deleteFakeDemo, setDeleteFakeDemo] = useState<boolean>(hasFakeDemoStudent);
  const [enableGmailNotifications, setEnableGmailNotifications] = useState<boolean>(true);

  if (!isOpen) return null;

  // Handle local image upload via FileReader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast('Please select a valid image file (PNG, JPG, WebP).', 'File Error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onToast('Image size exceeds 5MB limit. Please choose a smaller photo.', 'Size Limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const resultUrl = event.target.result as string;
        setAvatar(resultUrl);
        setCustomAvatarUploaded(true);
        sound.playSound('pop');
        onToast('Student photo uploaded successfully!', 'Image Ready');
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (interest: string) => {
    sound.playSound('click');
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName.trim()) {
        onToast('Please enter the student full name.', 'Name Required');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        onToast('Please enter a valid student email address.', 'Email Required');
        return;
      }
      if (password && password !== confirmPassword) {
        onToast('Passwords do not match. Please verify.', 'Security Error');
        return;
      }
      sound.playSound('click');
      setStep(2);
    } else if (step === 2) {
      sound.playSound('click');
      setStep(3);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    // Generate 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newStudent: UserProfile = {
      id: `st-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim(),
      emailVerified: false,
      verificationCode: generatedCode,
      isFakeDemo: false,
      avatar: avatar,
      role: 'student',
      pod: pod,
      gradeLevel: gradeLevel,
      bio: bio.trim(),
      academicInterests: selectedInterests,
      points: 250, // Welcome bonus points!
      streakDays: 1,
      planTier: 'scholar', // Give new student 1-month Scholar trial
      planRenewalDate: 'Active Scholar Access',
      gmailNotificationsEnabled: enableGmailNotifications,
      badges: [
        { id: 'b-welcome', title: 'Campus Pioneer', icon: 'award', earned: true, date: 'Today' }
      ]
    };

    sound.playSound('success');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    onCompleteOnboarding(newStudent, deleteFakeDemo);
    onToast(
      `Welcome to Gitas Academy, ${newStudent.name}! Verification code sent to ${newStudent.email}.`,
      '🎉 Student Onboarded'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-2xl relative bg-slate-950/95 max-h-[92vh] overflow-y-auto">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  Student Onboarding Wizard
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider text-indigo-300">
                  Step {step} of 3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enroll a new student, upload real photo, verify email & purge demo account.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-800'
            }`}
          />
          <div
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-800'
            }`}
          />
          <div
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              step >= 3 ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-800'
            }`}
          />
        </div>

        {/* STEP 1: IDENTITY & PHOTO UPLOAD */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-5 relative z-10">
            {/* Student Photo Upload Section */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Student Profile Photo / Avatar (Upload Your Image)
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt="Student Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/60 shadow-lg group-hover:opacity-80 transition"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition text-white text-[10px] font-bold"
                  >
                    <Camera size={18} className="mb-0.5" />
                    <span>Change</span>
                  </button>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
                    >
                      <Upload size={14} />
                      <span>Upload Student Photo</span>
                    </button>
                    {customAvatarUploaded && (
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Custom Photo Loaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports PNG, JPG, or WebP up to 5MB. Or pick a preset below:
                  </p>

                  {/* Preset Avatars */}
                  <div className="flex items-center justify-center sm:justify-start space-x-2 pt-1">
                    {AVATAR_PRESETS.map((pUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatar(pUrl);
                          setCustomAvatarUploaded(false);
                          sound.playSound('pop');
                        }}
                        className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition ${
                          avatar === pUrl
                            ? 'border-pink-500 scale-110 shadow-md'
                            : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={pUrl} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name & Student Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Student Full Name <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Lin or Lucas Patel"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Gmail / Student Email <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Create Campus Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Delete Fake Demo Student Checkbox */}
            {hasFakeDemoStudent && (
              <div className="p-3.5 rounded-2xl bg-pink-950/20 border border-pink-500/30 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="deleteFake"
                  checked={deleteFakeDemo}
                  onChange={(e) => setDeleteFakeDemo(e.target.checked)}
                  className="mt-0.5 rounded text-pink-500 focus:ring-pink-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="deleteFake" className="text-xs text-slate-300 leading-snug cursor-pointer">
                  <span className="font-bold text-pink-300 flex items-center gap-1.5">
                    <Trash2 size={13} />
                    Delete fake/mock demo student (Alex Morgan)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Removes the placeholder student profile and sets this newly onboarded student as the primary account.
                  </p>
                </label>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md flex items-center space-x-2 transition"
              >
                <span>Continue to Grade & Pod</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: GRADE POD & ACADEMIC LEVEL */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-5 relative z-10">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Academic Learning Pod
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Academy Core */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSound('click');
                    setPod('academy');
                    setGradeLevel('Academy Core (Grade 8)');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
                    pod === 'academy'
                      ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">Academy Core</span>
                    {pod === 'academy' && <CheckCircle2 size={14} className="text-indigo-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Grades 6-12 • Advanced STEM, 3D spatial physics & calculus
                  </p>
                </button>

                {/* Explorer Hub */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSound('click');
                    setPod('explorer');
                    setGradeLevel('Explorer Hub (Grades 6-9)');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
                    pod === 'explorer'
                      ? 'bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">Explorer Hub</span>
                    {pod === 'explorer' && <CheckCircle2 size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Middle school • Hands-on experiments, biology & history
                  </p>
                </button>

                {/* Discovery Pod */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSound('click');
                    setPod('toddler');
                    setGradeLevel('Discovery Pod (Ages 1-5)');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
                    pod === 'toddler'
                      ? 'bg-pink-600/20 border-pink-500 ring-2 ring-pink-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">Discovery Pod</span>
                    {pod === 'toddler' && <CheckCircle2 size={14} className="text-pink-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Ages 1-5 • Interactive nursery rhymes, ABC phonics & animal sounds
                  </p>
                </button>
              </div>
            </div>

            {/* Custom Grade Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Grade / Placement Label
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                placeholder="e.g. Grade 9 - Quantum Scholar Track"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Student Bio & Goals */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Student Motto / Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us what excites you about learning at Gitas Academy..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Academic Interest Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Subjects of Interest (Select 1 or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 size={12} /> : <Atom size={12} />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md flex items-center space-x-2 transition"
              >
                <span>Continue to Verification</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: EMAIL VERIFICATION & GMAIL ALERTS SETUP */}
        {step === 3 && (
          <div className="space-y-5 relative z-10">
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Student Email Verification Notice
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    A secure 6-digit confirmation code will be dispatched to:
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold text-white">{email}</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold uppercase">
                  Pending Verification
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                You can verify your email anytime using the in-app Gmail Notification Center or entering the 6-digit code.
              </p>
            </div>

            {/* Gmail Notification Checkbox */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
              <input
                type="checkbox"
                id="enableGmail"
                checked={enableGmailNotifications}
                onChange={(e) => setEnableGmailNotifications(e.target.checked)}
                className="mt-0.5 rounded text-indigo-500 focus:ring-indigo-500 h-4 w-4 bg-slate-900 border-slate-700"
              />
              <label htmlFor="enableGmail" className="text-xs text-slate-300 leading-snug cursor-pointer">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-pink-400" />
                  Receive Gitas Academy Gmail Notifications
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Receive instant Gmail notifications for graded problem sets, 3D lecture invitations, and Dean's Honor Roll awards.
                </p>
              </label>
            </div>

            {/* Summary Review Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-white">{fullName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Academic Pod:</span>
                <span className="font-bold text-indigo-300 capitalize">{pod} Core</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Photo Avatar:</span>
                <span className="font-bold text-emerald-400">
                  {customAvatarUploaded ? 'Custom Photo Uploaded ✓' : 'Campus Preset'}
                </span>
              </div>
              {deleteFakeDemo && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-pink-400 font-semibold">Demo Profile:</span>
                  <span className="font-bold text-pink-400">Will be Deleted & Purged</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition"
              >
                <CheckCircle2 size={15} />
                <span>Complete Onboarding & Launch Campus</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
