import React, { useState } from 'react';
import {
  X,
  Mail,
  Star,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Search,
  Inbox,
  Send,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Filter,
  RefreshCw,
  Award,
  Video,
  AlertCircle
} from 'lucide-react';
import { GmailNotification, UserProfile } from '../types';
import { sound } from '../utils/audio';

interface GmailNotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: UserProfile;
  notifications: GmailNotification[];
  onMarkAsRead: (id: string) => void;
  onToggleStar: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onVerifyEmailDirectly: (code: string) => void;
  onTriggerTestEmail: (type: 'welcome' | 'grade' | 'lecture' | 'honor') => void;
  onNavigateToClassroom?: () => void;
  onNavigateToLms?: () => void;
  onToast: (msg: string, title?: string) => void;
}

export const GmailNotificationCenterModal: React.FC<GmailNotificationCenterModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  notifications,
  onMarkAsRead,
  onToggleStar,
  onDeleteNotification,
  onVerifyEmailDirectly,
  onTriggerTestEmail,
  onNavigateToClassroom,
  onNavigateToLms,
  onToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeEmail = notifications.find((n) => n.id === activeEmailId);

  const filteredNotifications = notifications.filter((item) => {
    if (selectedCategory === 'unread' && !item.unread) return false;
    if (selectedCategory === 'starred' && !item.starred) return false;
    if (selectedCategory === 'verification' && item.category !== 'verification') return false;
    if (selectedCategory === 'grades' && item.category !== 'grades') return false;
    if (selectedCategory === 'classes' && item.category !== 'classes') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.subject.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q) ||
        item.sender.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleOpenEmail = (id: string) => {
    sound.playSound('click');
    setActiveEmailId(id);
    onMarkAsRead(id);
  };

  const handleActionClick = (emailItem: GmailNotification) => {
    if (emailItem.actionType === 'verify_email' && emailItem.verificationCode) {
      sound.playSound('success');
      onVerifyEmailDirectly(emailItem.verificationCode);
      onToast('Student email verified successfully from Gmail notification!', '🎉 Verified');
    } else if (emailItem.actionType === 'open_classroom' && onNavigateToClassroom) {
      sound.playSound('click');
      onClose();
      onNavigateToClassroom();
    } else if (emailItem.actionType === 'open_lms' && onNavigateToLms) {
      sound.playSound('click');
      onClose();
      onNavigateToLms();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-700/80 p-5 sm:p-7 space-y-5 shadow-2xl relative bg-slate-950/95 max-h-[92vh] flex flex-col">
        {/* Gmail Red Accent Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-600/20">
              <Mail size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  Gitas Gmail Notification Hub
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black tracking-wider">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Connected student inbox for{' '}
                <span className="text-indigo-300 font-mono font-bold">
                  {studentProfile.email || 'student@gmail.com'}
                </span>{' '}
                ({studentProfile.name})
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

        {/* Action Controls & Search Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Mail' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'verification', label: 'Security & Verification' },
              { id: 'grades', label: 'Grades' },
              { id: 'classes', label: 'Classes & Labs' },
              { id: 'starred', label: 'Starred' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playSound('click');
                  setSelectedCategory(cat.id);
                  setActiveEmailId(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Simulation Trigger Buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Test Alert:
            </span>
            <button
              onClick={() => onTriggerTestEmail('welcome')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition"
              title="Simulate verification code email"
            >
              + Code
            </button>
            <button
              onClick={() => onTriggerTestEmail('grade')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition"
              title="Simulate graded assignment notification"
            >
              + Grade
            </button>
            <button
              onClick={() => onTriggerTestEmail('lecture')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition"
              title="Simulate upcoming 3D lecture alert"
            >
              + Lecture
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student Gmail notifications..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-500/50"
          />
        </div>

        {/* Content Area: Split List or Detail View */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px]">
          {activeEmail ? (
            /* DETAILED EMAIL VIEW */
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <button
                  onClick={() => setActiveEmailId(null)}
                  className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white font-semibold transition"
                >
                  <ArrowLeft size={15} />
                  <span>Back to Inbox</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleStar(activeEmail.id)}
                    className={`p-1.5 rounded-lg border transition ${
                      activeEmail.starred
                        ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                        : 'text-slate-500 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Star size={15} fill={activeEmail.starred ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => {
                      onDeleteNotification(activeEmail.id);
                      setActiveEmailId(null);
                      onToast('Notification removed from inbox', 'Deleted');
                    }}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-400/30 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Email Headers */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-white font-heading">
                    {activeEmail.subject}
                  </h4>
                  <span className="text-[11px] text-slate-500">{activeEmail.timestamp}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold text-slate-200">{activeEmail.sender}</span>
                  <span className="font-mono text-slate-500">&lt;{activeEmail.senderEmail}&gt;</span>
                  <span>to:</span>
                  <span className="font-mono text-indigo-300 font-semibold">
                    {activeEmail.recipientEmail}
                  </span>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {activeEmail.body}
              </div>

              {/* Verification Code Box (if applicable) */}
              {activeEmail.verificationCode && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-300">
                      Your One-Time 6-Digit Verification Code
                    </span>
                    <div className="font-mono text-2xl font-black tracking-widest text-white">
                      {activeEmail.verificationCode}
                    </div>
                  </div>

                  <button
                    onClick={() => handleActionClick(activeEmail)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg transition flex items-center space-x-2"
                  >
                    <ShieldCheck size={16} />
                    <span>Verify Student Email Now</span>
                  </button>
                </div>
              )}

              {/* Other interactive action button */}
              {activeEmail.actionLabel && !activeEmail.verificationCode && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleActionClick(activeEmail)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2"
                  >
                    <span>{activeEmail.actionLabel}</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : filteredNotifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Inbox size={24} />
              </div>
              <p className="text-sm font-bold text-slate-300">No notifications in this folder</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All system notifications, email verifications, and academic grades will appear here in real-time.
              </p>
              <button
                onClick={() => onTriggerTestEmail('welcome')}
                className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition"
              >
                Send Sample Welcome & Code Email
              </button>
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-2">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenEmail(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer hover:border-slate-600 ${
                    item.unread
                      ? 'bg-slate-900/95 border-red-500/30 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {/* Star Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStar(item.id);
                        }}
                        className={`mt-0.5 transition ${
                          item.starred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <Star size={15} fill={item.starred ? 'currentColor' : 'none'} />
                      </button>

                      {/* Main Summary */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs truncate ${
                              item.unread ? 'font-bold text-white' : 'font-medium text-slate-300'
                            }`}
                          >
                            {item.sender}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-mono text-slate-400">
                            {item.category}
                          </span>
                          {item.verificationCode && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-black uppercase">
                              Verification Code
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs truncate leading-snug ${
                            item.unread ? 'font-bold text-slate-100' : 'text-slate-400'
                          }`}
                        >
                          {item.subject}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate leading-tight">
                          {item.snippet}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp & Unread Dot */}
                    <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                      {item.unread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Status */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Gmail Notification Gateway Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition text-xs"
          >
            Close Inbox
          </button>
        </div>
      </div>
    </div>
  );
};
