import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Award,
  Upload,
  Download,
  AlertCircle,
  X,
  FileCheck,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment } from '../types';
import { sound } from '../utils/audio';

interface LMSLockerProps {
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
  onSubmitAssignment: (id: string, text: string, fileName?: string) => void;
  onToast: (msg: string, title?: string) => void;
}

export const LMSLocker: React.FC<LMSLockerProps> = ({
  assignments,
  onAddAssignment,
  onSubmitAssignment,
  onToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [submissionText, setSubmissionText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [viewDetailItem, setViewDetailItem] = useState<Assignment | null>(null);

  // Compute live statistics
  const completedCount = assignments.filter((a) => a.status === 'Submitted').length;
  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;

  const scoredAssignments = assignments.filter((a) => a.score && a.score.includes('/'));
  const averageGrade = scoredAssignments.length
    ? Math.round(
        scoredAssignments.reduce((acc, curr) => {
          const num = parseInt(curr.score!.split('/')[0]) || 0;
          return acc + num;
        }, 0) / scoredAssignments.length
      )
    : 95;

  const filtered = assignments.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const handleOpenSubmit = (assignmentId?: string) => {
    sound.playSound('click');
    setSelectedAssignmentId(assignmentId || assignments.find((a) => a.status === 'Pending')?.id || assignments[0]?.id || '');
    setSubmissionText('');
    setUploadedFileName('');
    setSubmitModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      sound.playSound('pop');
      onToast(`Attached ${file.name} successfully`, 'File Attached');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId) return;

    sound.playSound('success');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    onSubmitAssignment(
      selectedAssignmentId,
      submissionText || 'Completed assignment problem set and model proofs.',
      uploadedFileName || 'homework_solution.pdf'
    );

    setSubmitModalOpen(false);
    onToast('Assignment submitted & automated rubric grading completed!', 'LMS Gradebook');
  };

  const handleDownloadTranscript = () => {
    sound.playSound('click');
    const content = `GITAS ACADEMY - OFFICIAL ACADEMIC TRANSCRIPT
Generated: ${new Date().toLocaleDateString()}
Student: Alex Morgan (Grade 8 / Explorer & Academy)
Average Cumulative GPA: ${(averageGrade / 25).toFixed(2)} / 4.0 (${averageGrade}%)

ASSIGNMENT RECORD:
--------------------------------------------------
${assignments
  .map(
    (a) =>
      `• [${a.status.toUpperCase()}] ${a.title} | Subject: ${a.subject} | Score: ${a.score || 'N/A'}\n  Feedback: ${a.feedback || 'In Review'}`
  )
  .join('\n\n')}
--------------------------------------------------
End of Official Record. Verified by Gitas Academy 3D Learning OS.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Gitas_Academy_Transcript_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Official transcript downloaded to device', 'LMS Locker');
  };

  return (
    <section className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800 shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
            <Award size={12} />
            <span>Digital Locker & Rubric Scoring</span>
          </span>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Real-Time Assignments & Digital Locker
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Submit coursework, inspect automated multi-tier rubrics, review Dr. Thorne&apos;s pedagogical
            feedback, and download academic transcripts.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleDownloadTranscript}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center space-x-2"
          >
            <Download size={14} />
            <span>Download Transcript</span>
          </button>
          <button
            onClick={() => handleOpenSubmit()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            <Plus size={15} />
            <span>Submit Assignment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-slate-400 font-medium">Completed Assignments</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {completedCount} / {assignments.length}
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {Math.round((completedCount / assignments.length) * 100)}% on track
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-slate-400 font-medium">Average Cumulative Grade</p>
            <h3 className="text-2xl font-extrabold text-indigo-400 mt-1">{averageGrade}%</h3>
            <span className="text-[10px] text-indigo-300 font-semibold">
              Dean&apos;s Honor Roll Standing
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold">
            <Award size={24} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Review / Due</p>
            <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{pendingCount} Tasks</h3>
            <span className="text-[10px] text-amber-300 font-semibold">Next due in 24 hours</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Assigned Tasks & Projects
            </h3>
            <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
              Live Synced
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-slate-900 border border-slate-700/80 rounded-xl p-1 space-x-1 text-xs">
            {['all', 'Pending', 'Submitted'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setFilterStatus(st);
                  sound.playSound('click');
                }}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Task Name</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-semibold text-white">
                    <div className="flex items-center space-x-2.5">
                      <FileText size={16} className="text-indigo-400 flex-shrink-0" />
                      <div>
                        <span>{a.title}</span>
                        <p className="text-[10px] text-slate-400 font-normal line-clamp-1">
                          {a.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{a.subject}</td>
                  <td className="p-4 text-slate-400">{a.dueDate}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        a.status === 'Submitted'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-indigo-400">
                    {a.score || <span className="text-slate-500 font-normal">Pending</span>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setViewDetailItem(a);
                          sound.playSound('click');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
                      >
                        Details
                      </button>
                      {a.status === 'Pending' && (
                        <button
                          onClick={() => handleOpenSubmit(a.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition shadow-sm"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <FileCheck size={14} />
                <span>Submit Task & Automated Grading</span>
              </span>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Task Select */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Select Assignment</label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.subject} - Due {a.dueDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Solution Text */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  Written Solution & Explanation
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Provide your solution steps, mathematical derivations, or essay paragraph here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* File Attachment */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Attach Document / Code File</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer transition relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload size={20} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-slate-300 font-medium">
                    {uploadedFileName || 'Drop files here or click to browse'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF, DOCX, TXT, PY, TEX</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Grade & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Detail & Feedback Modal */}
      {viewDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Coursework Evaluation
              </span>
              <button
                onClick={() => setViewDetailItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="text-lg font-bold text-white leading-tight">
                {viewDetailItem.title}
              </h3>
              <p className="text-slate-400">{viewDetailItem.description}</p>

              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subject:</span>
                  <strong className="text-white">{viewDetailItem.subject}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Due Date:</span>
                  <strong className="text-white">{viewDetailItem.dueDate}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Score:</span>
                  <strong className="text-emerald-400 font-bold">
                    {viewDetailItem.score || 'In Review'}
                  </strong>
                </div>
              </div>

              {viewDetailItem.feedback && (
                <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-1">
                  <p className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    <span>Dr. Aris Thorne Feedback:</span>
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {viewDetailItem.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewDetailItem(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
