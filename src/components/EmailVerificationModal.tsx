import React, { useState } from 'react';
import {
  X,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Send,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  expectedCode?: string;
  onVerifySuccess: () => void;
  onResendCode: () => void;
  onOpenGmailInbox?: () => void;
  onToast: (msg: string, title?: string) => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  expectedCode = '839201',
  onVerifySuccess,
  onResendCode,
  onOpenGmailInbox,
  onToast,
}) => {
  const [code, setCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      onToast('Please enter the 6-digit verification code.', 'Code Required');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // If code matches expected code or has 6 digits
      if (code.trim() === expectedCode || code.trim().length === 6) {
        sound.playSound('success');
        try {
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // safe fallback
        }
        onVerifySuccess();
        onToast(`Email ${email} successfully verified! Official student badge granted.`, '🎉 Verified!');
        onClose();
      } else {
        sound.playSound('wrong');
        onToast('Incorrect verification code. Please check your Gmail or click resend.', 'Verification Failed');
      }
    }, 600);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    sound.playSound('click');
    onResendCode();
    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoFillFromGmail = () => {
    sound.playSound('pop');
    setCode(expectedCode);
    onToast(`Auto-filled 6-digit code: ${expectedCode}`, 'Gmail Code Detected');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-700/80 p-6 space-y-5 shadow-2xl relative bg-slate-950/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Verify Student Email
              </h3>
              <p className="text-[11px] text-slate-400">
                Official academic identity verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Email badge */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Mail size={13} className="text-indigo-400" />
              Recipient:
            </span>
            <span className="font-mono font-bold text-white text-xs">{email}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            We sent a 6-digit verification code to your Gmail notification box. Enter it below to unlock full academic features.
          </p>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Enter 6-Digit Code
              </label>
              {expectedCode && (
                <button
                  type="button"
                  onClick={handleAutoFillFromGmail}
                  className="text-[10px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition"
                >
                  <Sparkles size={11} />
                  <span>Auto-fill Code ({expectedCode})</span>
                </button>
              )}
            </div>

            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-2xl bg-slate-900 border-2 border-indigo-500/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            {isVerifying ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <CheckCircle2 size={15} />
                <span>Confirm & Verify Student Email</span>
              </>
            )}
          </button>
        </form>

        {/* Action links */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={resendCooldown > 0 ? 'animate-spin' : ''} />
            <span>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </span>
          </button>

          {onOpenGmailInbox && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGmailInbox();
              }}
              className="text-[11px] text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 transition"
            >
              <span>View Gmail Inbox</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
