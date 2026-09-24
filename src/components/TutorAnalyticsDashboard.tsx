import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Film,
  HelpCircle,
  Layers,
  Filter,
  Download,
  Calendar,
  Eye,
  Edit3,
  Lightbulb,
  Check,
  ChevronRight,
  Users,
  Percent,
  PlayCircle
} from 'lucide-react';
import { CurriculumItem, GradePod } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TutorAnalyticsDashboardProps {
  curriculumList: CurriculumItem[];
  onEditLesson: (lesson: CurriculumItem) => void;
  onPreviewLesson: (lesson: CurriculumItem) => void;
  onToast: (msg: string, title?: string) => void;
}

interface LessonAnalyticsRow {
  lessonId: string;
  title: string;
  category: string;
  pod: GradePod;
  hasVideo: boolean;
  videoDuration: number;
  studentsEnrolled: number;
  completionRate: number; // percentage (e.g. 88)
  avgQuizScore: number; // percentage (e.g. 96)
  videoRetention: number; // percentage of video watched (e.g. 84)
  avgTimeSpentMin: number;
  optimizationStatus: 'optimized' | 'needs_marker' | 'quiz_review' | 'high_dropoff';
  optimizationInsight: string;
  actionRecommendation: string;
}

export const TutorAnalyticsDashboard: React.FC<TutorAnalyticsDashboardProps> = ({
  curriculumList,
  onEditLesson,
  onPreviewLesson,
  onToast,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'term' | 'all'>('30d');
  const [podFilter, setPodFilter] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'quiz' | 'completion' | 'engagement'>('quiz');
  const [activeDayHover, setActiveDayHover] = useState<number | null>(null);

  // Weekly Trend Data for Chart
  const weeklyTrendData = [
    { day: 'Mon', completions: 42, avgScore: 92, watchHours: 38 },
    { day: 'Tue', completions: 58, avgScore: 94, watchHours: 49 },
    { day: 'Wed', completions: 64, avgScore: 96, watchHours: 57 },
    { day: 'Thu', completions: 53, avgScore: 93, watchHours: 46 },
    { day: 'Fri', completions: 71, avgScore: 97, watchHours: 64 },
    { day: 'Sat', completions: 85, avgScore: 95, watchHours: 72 },
    { day: 'Sun', completions: 69, avgScore: 94, watchHours: 59 },
  ];

  // Map each lesson to performance & content optimization metrics
  const lessonAnalyticsData: LessonAnalyticsRow[] = curriculumList.map((item, idx) => {
    // Generate realistic analytics seeded by lesson characteristics
    const hasVideo = !!item.video;
    const isTutor = !!item.isTutorCreated;

    let completionRate = 88;
    let avgQuizScore = 95;
    let videoRetention = 86;
    let optimizationStatus: LessonAnalyticsRow['optimizationStatus'] = 'optimized';
    let optimizationInsight = 'High engagement: interactive lab parameters are thoroughly explored.';
    let actionRecommendation = 'Course content is performing exceptionally. Maintain active format.';

    if (item.title.includes('Quantum')) {
      completionRate = 92;
      avgQuizScore = 94;
      videoRetention = 89;
      optimizationStatus = 'needs_marker';
      optimizationInsight = 'Quiz question #2 (de Broglie wavepackets) has a 26% retry rate.';
      actionRecommendation = 'Add an interactive chapter bookmark at 14:20 explaining matter wave duality.';
    } else if (item.title.includes('Calculus')) {
      completionRate = 89;
      avgQuizScore = 96;
      videoRetention = 84;
      optimizationStatus = 'optimized';
      optimizationInsight = 'Students who spend >3 mins with the 3D tangent curve scored 98% on the assessment.';
      actionRecommendation = 'Highlight the 3D gradient vector visualizer early in the video lecture.';
    } else if (item.title.includes('Rome') || item.title.includes('History')) {
      completionRate = 84;
      avgQuizScore = 91;
      videoRetention = 78;
      optimizationStatus = 'high_dropoff';
      optimizationInsight = 'Video viewer drop-off noticed between minutes 18-22 on pozzolanic chemistry.';
      actionRecommendation = 'Consider breaking this module into two shorter 15-minute chapters.';
    } else if (item.title.includes('Shakespeare') || item.title.includes('Literature')) {
      completionRate = 86;
      avgQuizScore = 89;
      videoRetention = 82;
      optimizationStatus = 'quiz_review';
      optimizationInsight = 'Soliloquy iambic pentameter quiz has lower first-attempt accuracy (74%).';
      actionRecommendation = 'Add an audio playback prompt before the final question.';
    } else if (item.title.includes('Phonics') || item.pod === 'toddler') {
      completionRate = 98;
      avgQuizScore = 99;
      videoRetention = 95;
      optimizationStatus = 'optimized';
      optimizationInsight = 'Sensory phonics retains 95% of early learners with high touch interaction.';
      actionRecommendation = 'Add 3 more phonics animal sound flashcards to capitalize on high retention.';
    }

    return {
      lessonId: item.id,
      title: item.title,
      category: item.category,
      pod: item.pod,
      hasVideo,
      videoDuration: item.video?.durationMinutes || item.durationMinutes || 30,
      studentsEnrolled: 120 + ((idx * 17) % 40),
      completionRate,
      avgQuizScore,
      videoRetention,
      avgTimeSpentMin: Math.round((item.durationMinutes || 35) * 0.9),
      optimizationStatus,
      optimizationInsight,
      actionRecommendation,
    };
  });

  // Filtered by pod
  const filteredLessons = lessonAnalyticsData.filter(
    (l) => podFilter === 'all' || l.pod === podFilter
  );

  // Overall aggregate calculations
  const totalStudents = 148;
  const avgOverallQuizScore = (
    filteredLessons.reduce((acc, curr) => acc + curr.avgQuizScore, 0) /
    (filteredLessons.length || 1)
  ).toFixed(1);
  const avgOverallCompletionRate = (
    filteredLessons.reduce((acc, curr) => acc + curr.completionRate, 0) /
    (filteredLessons.length || 1)
  ).toFixed(1);
  const totalWatchHours = 385;

  const handleExportReport = () => {
    sound.playSound('success');
    confetti({ particleCount: 60, spread: 60 });
    onToast(
      'Exported comprehensive Course Performance & Content Optimization Report (PDF/CSV)',
      'Analytics Exported'
    );
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              <span>Tutor Intelligence & Content Optimization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Tutor Analytics Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time student engagement metrics, automated quiz mastery analytics, and video retention curves to help you optimize your instructional lessons and courseware.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            {/* Timeframe Selector */}
            <div className="flex bg-slate-900 border border-slate-700/80 rounded-2xl p-1 text-xs">
              {[
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: 'term', label: 'Term' },
                { id: 'all', label: 'All' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTimeframe(t.id as any);
                    sound.playSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    timeframe === t.id
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportReport}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center space-x-2 shadow-sm"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Average Quiz Mastery */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Avg Quiz Mastery
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white font-heading">{avgOverallQuizScore}%</h3>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-1">
              <ArrowUpRight size={14} />
              <span className="font-semibold">+3.8% vs last month</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Target benchmark: ≥ 85.0% across all pods</p>
        </div>

        {/* Metric 2: Lesson Completion Rate */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Lesson Completion
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-indigo-400 font-heading">
              {avgOverallCompletionRate}%
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-1">
              <ArrowUpRight size={14} />
              <span className="font-semibold">+5.2% completion speed</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">442 modules fully completed this term</p>
        </div>

        {/* Metric 3: Video Watch & Engagement */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-pink-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Video Stream Time
            </span>
            <div className="w-9 h-9 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Film size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-pink-400 font-heading">{totalWatchHours} hrs</h3>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-1">
              <ArrowUpRight size={14} />
              <span className="font-semibold">+18.4% engagement hours</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Avg 86% video lecture completion</p>
        </div>

        {/* Metric 4: Active Cohort Learners */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Active Cohort Learners
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-emerald-400 font-heading">{totalStudents}</h3>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-1">
              <ArrowUpRight size={14} />
              <span className="font-semibold">97.3% weekly active rate</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Enrolled across 3 grade pods</p>
        </div>
      </div>

      {/* Interactive Trend Chart & Grade Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Chart (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 size={16} className="text-amber-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Weekly Student Engagement & Performance
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic daily completion count, average quiz scores, and streaming lecture hours.
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
              <button
                onClick={() => {
                  setSelectedMetric('quiz');
                  sound.playSound('click');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedMetric === 'quiz' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Quiz Score (%)
              </button>
              <button
                onClick={() => {
                  setSelectedMetric('completion');
                  sound.playSound('click');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedMetric === 'completion' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Completions
              </button>
              <button
                onClick={() => {
                  setSelectedMetric('engagement');
                  sound.playSound('click');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedMetric === 'engagement' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Watch Hours
              </button>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="relative pt-4">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-8 pb-4 bg-slate-950/70 rounded-2xl border border-slate-800/80">
              {weeklyTrendData.map((d, idx) => {
                let val = d.avgScore;
                let maxVal = 100;
                let colorClass = 'bg-gradient-to-t from-amber-600 to-amber-400';
                let label = `${d.avgScore}%`;

                if (selectedMetric === 'completion') {
                  val = d.completions;
                  maxVal = 90;
                  colorClass = 'bg-gradient-to-t from-indigo-600 to-indigo-400';
                  label = `${d.completions}`;
                } else if (selectedMetric === 'engagement') {
                  val = d.watchHours;
                  maxVal = 80;
                  colorClass = 'bg-gradient-to-t from-pink-600 to-pink-400';
                  label = `${d.watchHours}h`;
                }

                const heightPct = Math.round((val / maxVal) * 100);
                const isHovered = activeDayHover === idx;

                return (
                  <div
                    key={d.day}
                    onMouseEnter={() => setActiveDayHover(idx)}
                    onMouseLeave={() => setActiveDayHover(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div
                      className={`text-[10px] font-bold text-white mb-2 transition-all duration-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 shadow-md ${
                        isHovered ? 'opacity-100 scale-105' : 'opacity-70'
                      }`}
                    >
                      {label}
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-slate-900 rounded-t-xl overflow-hidden flex items-end h-full">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-xl ${colorClass} transition-all duration-500 group-hover:brightness-125 shadow-lg`}
                      ></div>
                    </div>

                    {/* Day label */}
                    <span className="text-xs font-semibold text-slate-400 mt-2.5 group-hover:text-white transition">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Footnote */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Peak activity observed on Saturday and Friday evening labs</span>
            </span>
            <span className="text-emerald-400 font-semibold">
              98.2% on-time submission rate
            </span>
          </div>
        </div>

        {/* Grade Distribution & Pod Breakdown (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Award size={16} className="text-indigo-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Cohort Grade Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Grade outcomes calculated from custom tutor quizzes and laboratory assessments.
            </p>

            {/* Distribution Bars */}
            <div className="space-y-3 pt-1">
              {[
                { grade: 'A+ (97 - 100%)', count: 68, pct: 46, color: 'bg-emerald-500' },
                { grade: 'A  (90 - 96%)', count: 52, pct: 35, color: 'bg-indigo-500' },
                { grade: 'B+ (85 - 89%)', count: 21, pct: 14, color: 'bg-amber-500' },
                { grade: 'Review (<85%)', count: 7, pct: 5, color: 'bg-rose-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.grade}</span>
                    <span className="text-slate-400 font-mono font-semibold">
                      {item.count} students ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.pct}%` }}
                      className={`h-full ${item.color} rounded-full`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pod Demographics */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Learners by Pod
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Academy Core</span>
                <span className="font-extrabold text-white">76</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Explorer Hub</span>
                <span className="font-extrabold text-indigo-400">48</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Discovery Pod</span>
                <span className="font-extrabold text-pink-400">24</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutor Content Optimization & Actionable Intelligence Section */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Lightbulb size={18} className="text-amber-400" />
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-heading">
                Course Content Optimization Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical metrics and actionable recommendations to tune videos, chapter markers, 3D simulations, and quiz difficulty.
            </p>
          </div>

          {/* Filter by Grade Pod */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Filter size={13} />
              <span>Pod:</span>
            </span>
            <select
              value={podFilter}
              onChange={(e) => {
                setPodFilter(e.target.value);
                sound.playSound('click');
              }}
              className="bg-slate-900 border border-slate-700/80 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Grade Pods ({lessonAnalyticsData.length})</option>
              <option value="academy">Academy Core (10-15)</option>
              <option value="explorer">Explorer Hub (6-9)</option>
              <option value="toddler">Discovery Pod (1-5)</option>
            </select>
          </div>
        </div>

        {/* Actionable Course Content Optimization Cards */}
        <div className="space-y-4">
          {filteredLessons.map((item) => {
            const isOptimized = item.optimizationStatus === 'optimized';
            const isNeedsMarker = item.optimizationStatus === 'needs_marker';
            const isQuizReview = item.optimizationStatus === 'quiz_review';
            const isHighDropoff = item.optimizationStatus === 'high_dropoff';

            const originalLesson = curriculumList.find((c) => c.id === item.lessonId);

            return (
              <div
                key={item.lessonId}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-lg group"
              >
                {/* Left: Lesson Info & Video Indicator */}
                <div className="space-y-2 lg:max-w-md">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isOptimized
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : isNeedsMarker
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : isQuizReview
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {isOptimized
                        ? 'Optimal Engagement'
                        : isNeedsMarker
                        ? 'Suggested Marker'
                        : isQuizReview
                        ? 'Quiz Calibration'
                        : 'Review Drop-off'}
                    </span>

                    {item.hasVideo && (
                      <span className="text-[10px] text-pink-400 font-semibold flex items-center gap-1 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-500/20">
                        <Film size={11} />
                        <span>{item.videoDuration}m Video</span>
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.pod === 'academy' ? 'Grades 10-15' : item.pod === 'explorer' ? 'Grades 6-9' : 'Ages 1-5'}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    💡 <strong className="text-slate-200">Insight:</strong> {item.optimizationInsight}
                  </p>

                  <p className="text-xs text-amber-300/90 font-medium">
                    ⚡ <strong className="text-amber-400">Tutor Action:</strong> {item.actionRecommendation}
                  </p>
                </div>

                {/* Center: Live Performance Numbers */}
                <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center lg:w-80">
                  {/* Completion Rate */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Completion</span>
                    <span className="text-lg font-extrabold text-white font-heading">
                      {item.completionRate}%
                    </span>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.completionRate}%` }}
                        className="bg-emerald-500 h-full rounded-full"
                      ></div>
                    </div>
                  </div>

                  {/* Avg Quiz Score */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Avg Quiz</span>
                    <span className="text-lg font-extrabold text-amber-400 font-heading">
                      {item.avgQuizScore}%
                    </span>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.avgQuizScore}%` }}
                        className="bg-amber-500 h-full rounded-full"
                      ></div>
                    </div>
                  </div>

                  {/* Video Retention */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Video Retention</span>
                    <span className="text-lg font-extrabold text-pink-400 font-heading">
                      {item.videoRetention}%
                    </span>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.videoRetention}%` }}
                        className="bg-pink-500 h-full rounded-full"
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2 flex-shrink-0">
                  {originalLesson && (
                    <button
                      onClick={() => onPreviewLesson(originalLesson)}
                      className="flex-1 lg:w-36 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <Eye size={13} className="text-indigo-400" />
                      <span>Preview</span>
                    </button>
                  )}

                  {originalLesson && (
                    <button
                      onClick={() => onEditLesson(originalLesson)}
                      className="flex-1 lg:w-36 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                    >
                      <Edit3 size={13} />
                      <span>Optimize Lesson</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Pedagogical Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2.5 shadow-xl">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Film size={18} />
          </div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Video Duration Sweet-Spot
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            STEM video masterclasses between <strong>25 - 35 minutes</strong> yield a <strong>91.4%</strong> completion rate, compared to 64.2% for lectures exceeding 45 minutes.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2.5 shadow-xl">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Layers size={18} />
          </div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Spatial Simulation Synergy
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pairing dynamic 3D labs with video lectures increased first-attempt quiz accuracy by <strong>+22.8%</strong> compared to traditional text worksheets.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2.5 shadow-xl">
          <div className="w-9 h-9 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
            <HelpCircle size={18} />
          </div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Automated Knowledge Checks
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Placing a 2-question knowledge check immediately following video conclusion reduced assignment revision cycles by <strong>34%</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
