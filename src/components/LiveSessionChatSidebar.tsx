import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Pin,
  HelpCircle,
  Sparkles,
  Volume2,
  Smile,
  CheckCircle2,
  Hand,
  ThumbsUp,
  Heart,
  Zap,
  MoreVertical,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Share2,
  Users,
  Shield,
  GraduationCap
} from 'lucide-react';
import { ChatMessage, UserProfile, UserRole } from '../types';
import { sound } from '../utils/audio';

interface LiveSessionChatSidebarProps {
  userProfile: UserProfile;
  userRole: UserRole;
  isOpen: boolean;
  onClose?: () => void;
  isDocked?: boolean;
  className?: string;
  totalAttendeesCount?: number;
  onToast: (msg: string, title?: string) => void;
  onHandRaiseToggle?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'Dr. Aris Thorne',
    senderRole: 'Lead STEM Faculty',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    text: 'Welcome to the live spatial masterclass! Today we analyze atomic quantum orbitals & 3D multivariable surfaces. Feel free to raise questions in this sidebar.',
    timestamp: '10:00 AM',
    isTeacher: true,
    isPinned: true,
    reactions: { '💡': 8, '👏': 12, '🚀': 5 },
  },
  {
    id: 'msg-init-2',
    sender: 'Sophia Chen',
    senderRole: 'Student (Academy)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    text: 'Can we observe the transition between n=2 and n=3 when excitation photons are fired?',
    timestamp: '10:02 AM',
    isQuestion: true,
    reactions: { '👍': 4 },
    tutorReply: 'Yes Sophia! Adjust the excitation slider in the 3D panel to 1.8 eV to trigger the Balmer transition.',
  },
  {
    id: 'msg-init-3',
    sender: 'Liam Vance',
    senderRole: 'Student (Academy)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    text: 'The tangent vector arrow rotates normal to the level curves in real time. Very intuitive!',
    timestamp: '10:04 AM',
    reactions: { '👍': 6, '💡': 3 },
  },
];

const QUICK_REACTION_EMOJIS = ['👍', '💡', '👏', '🚀', '❤️', '🙋'];

const QUICK_RESPONSE_PRESETS = [
  '💡 Got it!',
  '🙋 Have a question',
  '🔄 Can you repeat that?',
  '🎯 Derivation clear!',
  '🚀 Ready for quiz',
];

export const LiveSessionChatSidebar: React.FC<LiveSessionChatSidebarProps> = ({
  userProfile,
  userRole,
  isOpen,
  onClose,
  isDocked = false,
  className = '',
  totalAttendeesCount = 104,
  onToast,
  onHandRaiseToggle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('gitas_live_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_MESSAGES;
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'questions' | 'pinned'>('all');
  const [markAsQuestion, setMarkAsQuestion] = useState<boolean>(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel for real-time cross-tab synchronization
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('gitas_live_classroom_chat');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_MESSAGE') {
          const newMsg: ChatMessage = event.data.message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          if (soundEnabled) {
            sound.playSound('pop');
          }
        } else if (event.data && event.data.type === 'UPDATE_REACTIONS') {
          const { messageId, reactions } = event.data;
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
          );
        } else if (event.data && event.data.type === 'TUTOR_REPLY') {
          const { messageId, reply } = event.data;
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, tutorReply: reply } : m))
          );
        } else if (event.data && event.data.type === 'PIN_TOGGLE') {
          const { messageId, isPinned } = event.data;
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, isPinned } : m))
          );
        }
      };

      return () => {
        channel.close();
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment', e);
    }
  }, [soundEnabled]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gitas_live_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn(e);
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeFilter]);

  // Send new message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender: userProfile.name,
      senderRole:
        userRole === 'tutor'
          ? 'Lead Faculty'
          : `Student (${userProfile.gradeLevel || 'Academy'})`,
      avatar: userProfile.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: userRole === 'tutor',
      isQuestion: markAsQuestion && userRole !== 'tutor',
      reactions: {},
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setMarkAsQuestion(false);

    if (soundEnabled) {
      sound.playSound('pop');
    }

    // Broadcast in real-time
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'NEW_MESSAGE',
        message: newMsg,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  // Add Reaction
  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id === messageId) {
          const currentReactions = { ...(m.reactions || {}) };
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;

          // Broadcast
          try {
            broadcastChannelRef.current?.postMessage({
              type: 'UPDATE_REACTIONS',
              messageId,
              reactions: currentReactions,
            });
          } catch (e) {
            console.warn(e);
          }

          return { ...m, reactions: currentReactions };
        }
        return m;
      });
      return updated;
    });

    if (soundEnabled) {
      sound.playSound('click');
    }
  };

  // Tutor Reply to Student Question
  const handleSendTutorReply = (messageId: string) => {
    if (!replyText.trim()) return;

    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id === messageId) {
          try {
            broadcastChannelRef.current?.postMessage({
              type: 'TUTOR_REPLY',
              messageId,
              reply: replyText.trim(),
            });
          } catch (e) {
            console.warn(e);
          }
          return { ...m, tutorReply: replyText.trim() };
        }
        return m;
      });
      return updated;
    });

    setReplyingToId(null);
    setReplyText('');
    sound.playSound('success');
    onToast('Tutor answer posted to live session chat', 'Answer Broadcasted');
  };

  // Tutor Toggle Pin
  const handleTogglePin = (messageId: string, currentPin?: boolean) => {
    const nextPin = !currentPin;
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isPinned: nextPin } : m))
    );

    try {
      broadcastChannelRef.current?.postMessage({
        type: 'PIN_TOGGLE',
        messageId,
        isPinned: nextPin,
      });
    } catch (e) {
      console.warn(e);
    }

    sound.playSound('click');
    onToast(nextPin ? 'Message pinned to top of live chat' : 'Message unpinned', 'Chat Moderation');
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (activeFilter === 'questions') return !!m.isQuestion;
    if (activeFilter === 'pinned') return !!m.isPinned;
    return true;
  });

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const questionsCount = messages.filter((m) => m.isQuestion).length;

  if (!isOpen && !isDocked) return null;

  return (
    <div
      className={`flex flex-col bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl ${
        isDocked
          ? 'h-full w-full'
          : 'fixed right-4 bottom-4 z-40 w-96 h-[580px] border-slate-700/80 animate-slideUp'
      } ${className}`}
    >
      {/* Header */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <MessageSquare size={16} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-extrabold text-white">Live Session Chat</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span>{totalAttendeesCount} in room</span>
              <span>•</span>
              <span className="text-indigo-400 font-semibold">Real-Time Sync</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Quick Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition ${
              soundEnabled ? 'text-indigo-400' : 'text-slate-600'
            }`}
            title={soundEnabled ? 'Mute chat sounds' : 'Enable chat sounds'}
          >
            <Volume2 size={14} />
          </button>

          {/* Close button if floating modal */}
          {!isDocked && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Pinned Announcement Bar (if any pinned messages) */}
      {pinnedMessages.length > 0 && activeFilter !== 'pinned' && (
        <div className="bg-indigo-950/70 border-b border-indigo-500/30 px-3.5 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 overflow-hidden">
            <Pin size={12} className="text-indigo-400 flex-shrink-0" />
            <p className="text-[11px] text-indigo-200 truncate">
              <span className="font-bold">{pinnedMessages[0].sender}:</span>{' '}
              {pinnedMessages[0].text}
            </p>
          </div>
          <button
            onClick={() => setActiveFilter('pinned')}
            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline flex-shrink-0 ml-2"
          >
            View
          </button>
        </div>
      )}

      {/* Tabs / Filters Bar */}
      <div className="flex border-b border-slate-800 px-3 py-1.5 bg-slate-950/50 space-x-1 text-[11px]">
        <button
          onClick={() => {
            sound.playSound('click');
            setActiveFilter('all');
          }}
          className={`px-2.5 py-1 rounded-lg font-bold transition ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          All ({messages.length})
        </button>

        <button
          onClick={() => {
            sound.playSound('click');
            setActiveFilter('questions');
          }}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
            activeFilter === 'questions'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle size={11} />
          <span>Q&A ({questionsCount})</span>
        </button>

        <button
          onClick={() => {
            sound.playSound('click');
            setActiveFilter('pinned');
          }}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
            activeFilter === 'pinned'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Pin size={11} />
          <span>Pinned ({pinnedMessages.length})</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
            <MessageSquare size={28} className="opacity-30" />
            <p className="text-xs">No messages in this filter.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelf = msg.sender === userProfile.name;
            const isTeacher = msg.isTeacher;

            return (
              <div
                key={msg.id}
                className={`group relative rounded-2xl p-3 text-xs transition duration-200 ${
                  msg.isPinned
                    ? 'bg-indigo-950/40 border border-indigo-500/40 shadow-md shadow-indigo-950/50'
                    : msg.isQuestion
                    ? 'bg-amber-950/30 border border-amber-500/40 shadow-sm'
                    : isTeacher
                    ? 'bg-purple-950/40 border border-purple-500/30'
                    : isSelf
                    ? 'bg-slate-800/90 border border-slate-700 ml-4'
                    : 'bg-slate-900/80 border border-slate-800 mr-4'
                }`}
              >
                {/* Header: Avatar, Name, Badges, Timestamp */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <img
                      src={msg.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop'}
                      alt={msg.sender}
                      className="w-5 h-5 rounded-full object-cover border border-slate-700"
                    />
                    <span
                      className={`font-bold truncate max-w-[120px] ${
                        isTeacher
                          ? 'text-amber-300'
                          : isSelf
                          ? 'text-indigo-300'
                          : 'text-slate-200'
                      }`}
                    >
                      {msg.sender}
                    </span>

                    {/* Role Badges */}
                    {isTeacher && (
                      <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <GraduationCap size={9} />
                        <span>Faculty</span>
                      </span>
                    )}

                    {msg.isQuestion && (
                      <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                        <HelpCircle size={9} />
                        <span>Question</span>
                      </span>
                    )}

                    {msg.isPinned && (
                      <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5">
                        <Pin size={9} />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>

                    {/* Tutor Moderation Actions (Pin/Unpin) */}
                    {userRole === 'tutor' && (
                      <button
                        onClick={() => handleTogglePin(msg.id, msg.isPinned)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-400 transition"
                        title={msg.isPinned ? 'Unpin message' : 'Pin message to top'}
                      >
                        <Pin size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-slate-200 text-[11.5px] leading-relaxed break-words whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Attached Tutor Reply to Student Question */}
                {msg.tutorReply && (
                  <div className="mt-2.5 p-2 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-[11px] space-y-1">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                      <GraduationCap size={12} />
                      <span>Faculty Response:</span>
                    </div>
                    <p className="text-slate-200">{msg.tutorReply}</p>
                  </div>
                )}

                {/* Reply Form for Tutors on Student Questions */}
                {userRole === 'tutor' && msg.isQuestion && !msg.tutorReply && (
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    {replyingToId === msg.id ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendTutorReply(msg.id)}
                          placeholder="Type faculty answer to this question..."
                          className="w-full bg-slate-950 border border-indigo-500/50 rounded-xl px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none"
                          autoFocus
                        />
                        <div className="flex justify-end space-x-1.5">
                          <button
                            onClick={() => setReplyingToId(null)}
                            className="px-2 py-0.5 rounded-lg text-[10px] text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendTutorReply(msg.id)}
                            className="px-2.5 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
                          >
                            Send Answer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingToId(msg.id);
                          setReplyText('');
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                      >
                        <span>Answer this question as Faculty →</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Emoji Reactions Bar */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {msg.reactions &&
                      Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className="px-1.5 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-300 flex items-center gap-1 transition"
                        >
                          <span>{emoji}</span>
                          <span className="text-indigo-300">{count}</span>
                        </button>
                      ))}
                  </div>

                  {/* Add Reaction Button */}
                  <div className="relative group/emoji">
                    <button className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition text-[10px] flex items-center gap-0.5">
                      <Smile size={12} />
                    </button>
                    <div className="absolute right-0 bottom-full mb-1 hidden group-hover/emoji:flex items-center gap-1 bg-slate-950 border border-slate-700 p-1 rounded-xl shadow-xl z-20">
                      {QUICK_REACTION_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className="hover:scale-125 transition p-0.5 text-xs"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Response Chips (Students & Tutors) */}
      <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/70 overflow-x-auto flex space-x-1.5 no-scrollbar">
        {QUICK_RESPONSE_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => handleSendMessage(preset)}
            className="flex-shrink-0 px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 text-[10px] text-slate-300 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 transition"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Chat Input Section */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
        {/* Toggle Question Checkbox for Students */}
        {userRole !== 'tutor' && (
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={markAsQuestion}
                onChange={(e) => setMarkAsQuestion(e.target.checked)}
                className="rounded text-amber-500 focus:ring-0 cursor-pointer bg-slate-950 border-slate-700"
              />
              <span className={markAsQuestion ? 'text-amber-300 font-bold' : ''}>
                Mark as Q&A Question for Dr. Thorne
              </span>
            </label>

            {onHandRaiseToggle && (
              <button
                onClick={onHandRaiseToggle}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
              >
                <Hand size={11} />
                <span>Raise Hand</span>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              markAsQuestion
                ? 'Type your question for the tutor...'
                : userRole === 'tutor'
                ? 'Broadcast note or answer to class...'
                : 'Send message to live session...'
            }
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 disabled:opacity-40 text-white transition shadow-md shadow-indigo-600/30 flex-shrink-0"
            title="Send message"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
