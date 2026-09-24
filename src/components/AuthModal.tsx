import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  User,
  KeyRound,
  Building,
  Star,
  Zap,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { UserRole, GradePod, UserProfile } from '../types';
import { sound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onLoginSuccess: (role: UserRole, profile: Partial<UserProfile>) => void;
  onOpenPricing?: () => void;
  onOpenOnboarding?: () => void;
  hasFakeDemoStudent?: boolean;
  onDeleteFakeStudent?: () => void;
  onToast: (msg: string, title?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onLoginSuccess,
  onOpenPricing,
  onOpenOnboarding,
  hasFakeDemoStudent = false,
  onDeleteFakeStudent,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>(currentRole);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Student Form State
  const [studentEmail, setStudentEmail] = useState<string>('alex.morgan@gitas.edu');
  const [studentPassword, setStudentPassword] = useState<string>('••••••••••••');
  const [studentPod, setStudentPod] = useState<GradePod>('academy');

  // Tutor Form State
  const [tutorEmail, setTutorEmail] = useState<string>('dr.thorne@faculty.gitas.edu');
  const [tutorPassword, setTutorPassword] = useState<string>('••••••••••••');
  const [facultyPin, setFacultyPin] = useState<string>('FAC-8492');
  const [department, setDepartment] = useState<string>('STEM & Quantum Physics');

  if (!isOpen) return null;

  // Student Demo Login
  const handleStudentDemoLogin = () => {
    sound.playSound('success');
    onLoginSuccess('student', {
      name: 'Alex Morgan',
      email: 'alex.morgan@gitas.edu',
      role: 'student',
      pod: studentPod,
      gradeLevel:
        studentPod === 'toddler'
          ? 'Discovery Pod (Ages 1-5)'
          : studentPod === 'explorer'
          ? 'Explorer Hub (Grades 6-9)'
          : 'Academy Core (Grade 8)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    });
    onToast('Welcome back, Alex Morgan! Student Campus Session active.', '🎓 Student Portal');
    onClose();
  };

  // Tutor Demo Login
  const handleTutorDemoLogin = () => {
    sound.playSound('success');
    onLoginSuccess('tutor', {
      name: 'Dr. Aris Thorne',
      email: 'dr.thorne@faculty.gitas.edu',
      role: 'tutor',
      pod: 'academy',
      gradeLevel: 'Lead STEM & Spatial Physics Faculty',
      tutorTitle: 'Professor of Theoretical Physics & Interactive Pedagogy',
      department: department,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
    });
    onToast('Welcome back, Dr. Thorne. Faculty Studio Session authenticated.', '👨‍🏫 Faculty Portal');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'student') {
      handleStudentDemoLogin();
    } else {
      handleTutorDemoLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden bg-slate-950/95">
        {/* Glow ambient background based on active role */}
        <div
          className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
            activeTab === 'student' ? 'bg-indigo-600/15 -mr-20 -mt-20' : 'bg-amber-500/15 -mr-20 -mt-20'
          }`}
        ></div>

        {/* Modal Header & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                activeTab === 'student' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {activeTab === 'student' ? <GraduationCap size={20} /> : <Briefcase size={20} />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-heading">
                Gitas Academy Access Gateway
              </h3>
              <p className="text-[11px] text-slate-400">
                {activeTab === 'student'
                  ? 'Learner Campus & Spatial 3D Lab Entrance'
                  : 'Faculty Courseware & Studio Portal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Portal Role Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl relative z-10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              sound.playSound('click');
            }}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
              activeTab === 'student'
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap size={16} />
            <span>Student Campus</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('tutor');
              sound.playSound('click');
            }}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
              activeTab === 'tutor'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-lg shadow-amber-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase size={16} />
            <span>Tutor & Faculty</span>
          </button>
        </div>

        {/* TAB 1: STUDENT PORTAL LOGIN */}
        {activeTab === 'student' && (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Quick Demo Credentials Pill for prospective buyers / reviewers */}
            {hasFakeDemoStudent ? (
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                  <div>
                    <p className="text-xs font-bold text-indigo-300">Demo Account: Alex Morgan</p>
                    <p className="text-[10px] text-slate-400">Placeholder student profile</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={handleStudentDemoLogin}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center space-x-1"
                  >
                    <span>Sign In</span>
                    <ArrowRight size={13} />
                  </button>
                  {onDeleteFakeStudent && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSound('pop');
                        onDeleteFakeStudent();
                        onToast('Fake demo student account deleted.', 'Account Purged');
                      }}
                      className="p-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 hover:text-white transition"
                      title="Delete fake demo student"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">Real Registered Student Mode Active</span>
                </div>
                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOnboarding();
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    + Add Another
                  </button>
                )}
              </div>
            )}

            {/* Onboard New Student Direct CTA */}
            {onOpenOnboarding && (
              <button
                type="button"
                onClick={() => {
                  sound.playSound('click');
                  onClose();
                  onOpenOnboarding();
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-indigo-600/30 via-pink-600/30 to-purple-600/30 hover:from-indigo-600/40 hover:to-pink-600/40 border border-indigo-500/40 text-white text-xs font-extrabold transition flex items-center justify-center space-x-2"
              >
                <Sparkles size={14} className="text-pink-300" />
                <span>+ Onboard New Student (Upload Photo & Verify Email)</span>
              </button>
            )}

            <div className="space-y-3">
              {/* Email / Student ID */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Student Email or ID Number
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="student.id@gitas.edu"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      onToast('Reset instructions sent to registered parent/student email', 'Recovery');
                    }}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Grade Pod Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Enrolled Grade Pod
                </label>
                <select
                  value={studentPod}
                  onChange={(e) => setStudentPod(e.target.value as GradePod)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="academy">Academy Core (Grades 10-15 STEM & Physics)</option>
                  <option value="explorer">Explorer Hub (Grades 6-9 Humanities & Science)</option>
                  <option value="toddler">Toddler Discovery Pod (Ages 1-5 Sensory Phonics)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
            >
              <span>Sign In to Student Campus</span>
              <ArrowRight size={14} />
            </button>

            {/* Sales Trigger / Pricing Link */}
            <div className="pt-2 text-center border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Don't have an active academic membership?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPricing) onOpenPricing();
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold underline ml-1"
                >
                  View Student Tuition & Pricing Plans
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: TUTOR & FACULTY STUDIO LOGIN */}
        {activeTab === 'tutor' && (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Quick Demo Credentials Pill for prospective buyers / reviewers */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <div>
                  <p className="text-xs font-bold text-amber-300">
                    Faculty Demo: Dr. Aris Thorne (Lead STEM)
                  </p>
                  <p className="text-[10px] text-slate-400">Full Instructor Studio & Lesson Authoring privileges</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTutorDemoLogin}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition shadow-sm flex items-center space-x-1"
              >
                <span>Instant Sign In</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Faculty Email */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Faculty Institutional Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={tutorEmail}
                    onChange={(e) => setTutorEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    placeholder="faculty.name@gitas.edu"
                  />
                </div>
              </div>

              {/* Password & Security Token Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Faculty Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={tutorPassword}
                      onChange={(e) => setTutorPassword(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Staff Key / 2FA Token
                  </label>
                  <div className="relative">
                    <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={facultyPin}
                      onChange={(e) => setFacultyPin(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      placeholder="FAC-XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Academic Department
                </label>
                <div className="relative">
                  <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="STEM & Quantum Physics">Department of STEM & Quantum Physics</option>
                    <option value="Humanities & Classical History">Department of Humanities & Classical History</option>
                    <option value="Early Childhood Cognitive Science">Early Childhood Sensory & Phonics Division</option>
                    <option value="Global Languages & Literature">Department of Literature & Dialectics</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition flex items-center justify-center space-x-2"
            >
              <span>Access Faculty Studio & Grading Desk</span>
              <ArrowRight size={14} />
            </button>

            {/* Institutional Security Notice */}
            <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-slate-400 border-t border-slate-800/80">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Gitas Academy Accredited Faculty Access Protocol</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
