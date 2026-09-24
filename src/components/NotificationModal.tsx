import React from 'react';
import { X, Bell, CheckCircle2, Award, Calendar, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'grade' | 'class' | 'system';
  unread: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'grade':
        return <Award size={16} className="text-emerald-400" />;
      case 'class':
        return <Calendar size={16} className="text-indigo-400" />;
      default:
        return <Bell size={16} className="text-pink-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-700 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bell size={16} className="text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Notifications & Alerts
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                sound.playSound('click');
                onMarkAllRead();
              }}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border transition ${
                n.unread
                  ? 'bg-slate-900/90 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs leading-tight">{n.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.description}</p>
                  </div>
                </div>
                {n.unread && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 mt-1"></span>
                )}
              </div>
              <p className="text-[9px] text-slate-500 mt-2 text-right">{n.timestamp}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
