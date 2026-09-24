import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  HelpCircle,
  Layers,
  Clock,
  Eye,
  Save,
  BookOpen,
  Atom,
  Binary,
  Globe2,
  Shapes,
  Palette,
  Bot,
  ExternalLink,
  Film,
  PlayCircle,
  X
} from 'lucide-react';
import { CurriculumItem, GradePod, LessonVideo, QuizQuestion } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TutorLessonCreatorProps {
  onSaveLesson: (lesson: CurriculumItem) => void;
  editingLesson?: CurriculumItem | null;
  onCancel?: () => void;
  onToast: (msg: string, title?: string) => void;
}

// Preset educational videos for quick tutor selection
const PRESET_VIDEOS = [
  {
    name: 'Quantum Physics: Atomic Orbitals & Photons',
    url: 'https://www.youtube.com/watch?v=accyUD282-M',
    title: 'Atomic Orbitals & Quantum Mechanical Wavepackets',
    duration: 35,
    category: 'stem',
    pod: 'academy' as GradePod,
  },
  {
    name: 'Multivariable Calculus: 3D Gradient Fields',
    url: 'https://www.youtube.com/watch?v=pHMzNW8Agq4',
    title: 'Visualizing 3D Surfaces, Tangent Planes & Gradients',
    duration: 30,
    category: 'stem',
    pod: 'academy' as GradePod,
  },
  {
    name: 'Roman Engineering: Pantheon Dome Architecture',
    url: 'https://www.youtube.com/watch?v=nO3_x_GZJmE',
    title: 'Ancient Roman Concrete Arches & Pantheon Oculus',
    duration: 25,
    category: 'humanities',
    pod: 'explorer' as GradePod,
  },
  {
    name: 'Toddler Phonics: ABC Sounds & Interactive Words',
    url: 'https://www.youtube.com/watch?v=BELlZKpi1Zs',
    title: 'Alphabet Phonics, Letter Sounds & Tactile Recognition',
    duration: 15,
    category: 'toddler',
    pod: 'toddler' as GradePod,
  },
];

export const TutorLessonCreator: React.FC<TutorLessonCreatorProps> = ({
  onSaveLesson,
  editingLesson,
  onCancel,
  onToast,
}) => {
  // Form States
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<'stem' | 'humanities' | 'language' | 'toddler' | 'arts' | 'robotics'>('stem');
  const [pod, setPod] = useState<GradePod>('academy');
  const [gradeLevelText, setGradeLevelText] = useState<string>('Grades 10-15');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [desc, setDesc] = useState<string>('');

  // Objectives
  const [objectives, setObjectives] = useState<string[]>([
    'Analyze core spatial relationships and fundamental mathematical models.',
    'Formulate hypothesis and test via real-time interactive parameters.',
    'Synthesize conclusions and complete post-lesson knowledge check.',
  ]);
  const [newObjective, setNewObjective] = useState<string>('');

  // Video Section
  const [hasVideo, setHasVideo] = useState<boolean>(true);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=accyUD282-M');
  const [videoDuration, setVideoDuration] = useState<number>(30);
  const [videoDesc, setVideoDesc] = useState<string>('Comprehensive masterclass visual breakdown and demonstration.');
  const [showVideoPreview, setShowVideoPreview] = useState<boolean>(true);

  // Interactive Lab Choice
  const [interactiveType, setInteractiveType] = useState<'calculus' | 'quantum' | 'ecosystem' | 'literature' | 'video_reflection'>('quantum');

  // Custom Quiz Questions
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([
    {
      id: 'q-1',
      q: 'What is the principal observation when energy excitation occurs in this lesson?',
      options: [
        'Photon emission with distinct wavelength',
        'Direct static loss of mass',
        'Total collapse of all orbital paths',
        'Immediate temperature drop to absolute zero',
      ],
      correct: 0,
      explanation: 'Conservation of energy dictates that electron drops release energy in discrete photon packets (E = h·ν).',
    },
    {
      id: 'q-2',
      q: 'How does adjusting the parameters in the 3D simulation reinforce theoretical mastery?',
      options: [
        'By avoiding empirical measurements',
        'By revealing nonlinear feedback loops instantaneously',
        'By replacing all mathematical proofs with guesses',
        'It produces purely decorative visuals',
      ],
      correct: 1,
      explanation: 'Direct spatial feedback connects algebraic equations to physical intuition.',
    },
  ]);

  // Load editingLesson if provided
  useEffect(() => {
    if (editingLesson) {
      setTitle(editingLesson.title);
      setCategory(editingLesson.category);
      setPod(editingLesson.pod);
      setGradeLevelText(editingLesson.grade);
      setDurationMinutes(editingLesson.durationMinutes);
      setDesc(editingLesson.desc);
      if (editingLesson.objectives) setObjectives(editingLesson.objectives);
      if (editingLesson.video) {
        setHasVideo(true);
        setVideoTitle(editingLesson.video.title);
        setVideoUrl(editingLesson.video.url);
        setVideoDuration(editingLesson.video.durationMinutes);
        setVideoDesc(editingLesson.video.description || '');
      }
      if (editingLesson.interactiveType) setInteractiveType(editingLesson.interactiveType);
      if (editingLesson.customQuizzes && editingLesson.customQuizzes.length > 0) {
        setQuizzes(editingLesson.customQuizzes);
      }
    }
  }, [editingLesson]);

  // Adjust grade text default when pod changes
  const handlePodChange = (newPod: GradePod) => {
    setPod(newPod);
    if (newPod === 'toddler') {
      setGradeLevelText('Ages 1-5');
      setCategory('toddler');
      setDurationMinutes(15);
    } else if (newPod === 'explorer') {
      setGradeLevelText('Grades 6-9');
      if (category === 'toddler') setCategory('stem');
      setDurationMinutes(30);
    } else {
      setGradeLevelText('Grades 10-15');
      if (category === 'toddler') setCategory('stem');
      setDurationMinutes(45);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_VIDEOS[0]) => {
    setVideoTitle(preset.title);
    setVideoUrl(preset.url);
    setVideoDuration(preset.duration);
    setTitle(preset.name);
    setCategory(preset.category as any);
    handlePodChange(preset.pod);
    sound.playSound('click');
    onToast(`Applied video preset: "${preset.name}"`, 'Preset Loaded');
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective('');
    sound.playSound('click');
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
    sound.playSound('pop');
  };

  const handleAddQuizQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      q: `Key Concept Question #${quizzes.length + 1}`,
      options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      explanation: 'Explanation for why Option A is the mathematically accurate choice.',
    };
    setQuizzes([...quizzes, newQ]);
    sound.playSound('pop');
  };

  const handleUpdateQuiz = (index: number, updated: Partial<QuizQuestion>) => {
    setQuizzes(
      quizzes.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  const handleRemoveQuiz = (index: number) => {
    setQuizzes(quizzes.filter((_, i) => i !== index));
    sound.playSound('pop');
  };

  const handleSubmitLesson = (publishStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      sound.playSound('alert');
      onToast('Please enter a lesson title', 'Validation Error');
      return;
    }

    const videoObj: LessonVideo | undefined = hasVideo && videoUrl.trim()
      ? {
          id: `v-${Date.now()}`,
          title: videoTitle.trim() || `${title} - Masterclass Video`,
          url: videoUrl.trim(),
          durationMinutes: videoDuration || 20,
          description: videoDesc.trim(),
          topicMarkers: [
            { time: '00:00', title: 'Introduction & Core Foundations' },
            { time: '05:30', title: 'Spatial Demonstration' },
            { time: '18:45', title: 'Analytical Proofs & Synthesis' },
          ],
        }
      : undefined;

    const iconMap: Record<string, string> = {
      stem: 'atom',
      humanities: 'globe',
      language: 'book',
      toddler: 'shapes',
      arts: 'pen',
      robotics: 'binary',
    };

    const colorMap: Record<string, CurriculumItem['color']> = {
      stem: 'indigo',
      humanities: 'amber',
      language: 'pink',
      toddler: 'rose',
      arts: 'purple',
      robotics: 'emerald',
    };

    const lessonItem: CurriculumItem = {
      id: editingLesson?.id || `tutor-c-${Date.now()}`,
      title: title.trim(),
      category,
      grade: gradeLevelText,
      pod,
      desc: desc.trim() || 'Comprehensive tutor-designed interactive lesson featuring high-definition video lecture, dynamic simulation, and knowledge check.',
      icon: iconMap[category] || 'atom',
      color: colorMap[category] || 'indigo',
      modulesCount: 4,
      durationMinutes,
      completed: false,
      rating: 5.0,
      isTutorCreated: true,
      tutorName: 'Dr. Aris Thorne',
      tutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      status: publishStatus,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      video: videoObj,
      videos: videoObj ? [videoObj] : [],
      objectives,
      interactiveType,
      customQuizzes: quizzes,
      resources: [
        { name: `${title} - Lecture Slides & Notes.pdf`, type: 'PDF Document', size: '2.4 MB' },
        { name: `${title} - Practice Problem Set.pdf`, type: 'Problem Set', size: '1.1 MB' },
      ],
      viewsCount: 0,
      studentsCompletedCount: 0,
    };

    onSaveLesson(lessonItem);
    sound.playSound('success');
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });

    onToast(
      publishStatus === 'published'
        ? `Lesson "${title}" published live to Student Curriculum Hub! 🎉`
        : `Lesson "${title}" saved as draft.`,
      publishStatus === 'published' ? 'Lesson Published' : 'Draft Saved'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              <span>Tutor Studio & Lesson Architect</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {editingLesson ? `Edit Lesson: ${editingLesson.title}` : 'Design & Publish New Lesson'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Craft interactive 3D STEM, Humanities, and Early Learning modules. Attach high-definition instructional video lectures, configure live simulation labs, and build automated knowledge quizzes for your students.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => handleSubmitLesson('draft')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center space-x-2 shadow-sm"
            >
              <Save size={15} />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSubmitLesson('published')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 size={16} />
              <span>Publish Lesson Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Metadata & Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Core Details */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-amber-400" />
              <span>1. Lesson Basics & Academic Pod</span>
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Lesson Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Quantum Wavepackets & Atomic Superposition"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Target Pod & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Target Grade Pod</label>
                <select
                  value={pod}
                  onChange={(e) => handlePodChange(e.target.value as GradePod)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="academy">Academy Core (Ages 10-15 / Advanced)</option>
                  <option value="explorer">Explorer Hub (Ages 6-9 / Intermediate)</option>
                  <option value="toddler">Discovery Pod (Ages 1-5 / Early Sensory)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Discipline / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="stem">STEM (Physics & Math)</option>
                  <option value="humanities">Humanities & World History</option>
                  <option value="language">Literature & Languages</option>
                  <option value="robotics">Computer Science & Robotics</option>
                  <option value="arts">Arts & Spatial Design</option>
                  <option value="toddler">Toddler Phonics & Early Learning</option>
                </select>
              </div>
            </div>

            {/* Grade level and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Grade Level Label</label>
                <input
                  type="text"
                  value={gradeLevelText}
                  onChange={(e) => setGradeLevelText(e.target.value)}
                  placeholder="e.g. Grades 10-15 or Grade 8"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Estimated Duration</span>
                  <span className="text-amber-400 font-mono">{durationMinutes} mins</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Lesson Overview & Syllabus</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="Explain the central intuition, guiding questions, and what students will accomplish in this lesson..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Learning Objectives */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Key Learning Objectives ({objectives.length})</span>
                <span className="text-[10px] text-slate-400">What students will master</span>
              </label>

              <div className="space-y-2">
                {objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 flex-1">{obj}</p>
                    <button
                      onClick={() => handleRemoveObjective(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
                    placeholder="Add an objective (e.g. Derive Planck relation E=h*nu)..."
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleAddObjective}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Simulation Lab Attachment */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Atom size={16} className="text-indigo-400" />
                <span>2. Interactive Spatial Lab Attachment</span>
              </h3>
              <span className="text-[11px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30">
                Spatial 3D Engine
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Select which real-time interactive simulation environment students will explore alongside your instructional video.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'quantum', title: 'Quantum Atom & Energy Levels', icon: Atom, desc: 'Bohr model n=1..4 orbital jumps & photon emission spectrum' },
                { id: 'calculus', title: 'Calculus Function & Gradient Plotter', icon: Binary, desc: 'Real-time quadratic curve and derivative vector plotter' },
                { id: 'ecosystem', title: 'Ecosystem Predator-Prey Balance', icon: Globe2, desc: 'Multi-trophic population dynamics & carrying capacity' },
                { id: 'literature', title: 'Shakespeare Dialogue Studio', icon: BookOpen, desc: 'AI speech cadence, soliloquies & iambic pentameter' },
              ].map((lab) => {
                const Icon = lab.icon;
                const isSelected = interactiveType === lab.id;
                return (
                  <button
                    key={lab.id}
                    type="button"
                    onClick={() => {
                      setInteractiveType(lab.id as any);
                      sound.playSound('click');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                        <Icon size={16} />
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-indigo-400" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{lab.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{lab.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Quiz Assessment Builder */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle size={16} className="text-pink-400" />
                <span>3. Automated Knowledge Quiz Builder</span>
              </h3>
              <button
                type="button"
                onClick={handleAddQuizQuestion}
                className="px-3 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Question</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Students will take this assessment directly after completing your video and 3D simulation.
            </p>

            <div className="space-y-4">
              {quizzes.map((quiz, qIdx) => (
                <div key={quiz.id} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                      Question #{qIdx + 1}
                    </span>
                    {quizzes.length > 1 && (
                      <button
                        onClick={() => handleRemoveQuiz(qIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Question Prompt */}
                  <input
                    type="text"
                    value={quiz.q}
                    onChange={(e) => handleUpdateQuiz(qIdx, { q: e.target.value })}
                    placeholder="Enter question text..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />

                  {/* 4 Choices */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Options (Click circle to set correct answer):
                    </p>
                    {quiz.options.map((opt, oIdx) => {
                      const isCorrect = quiz.correct === oIdx;
                      return (
                        <div key={oIdx} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateQuiz(qIdx, { correct: oIdx });
                              sound.playSound('click');
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition flex-shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title="Set as correct answer"
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...quiz.options];
                              newOpts[oIdx] = e.target.value;
                              handleUpdateQuiz(qIdx, { options: newOpts });
                            }}
                            className={`flex-1 bg-slate-950 border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none ${
                              isCorrect ? 'border-emerald-500/80 text-emerald-200' : 'border-slate-800'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={quiz.explanation}
                      onChange={(e) => handleUpdateQuiz(qIdx, { explanation: e.target.value })}
                      placeholder="Explanation feedback displayed to student after answering..."
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-slate-400 italic focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Video Integration & Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Video Lecture Attachment */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Video size={16} className="text-pink-400" />
                <span>Instructional Video Resource</span>
              </h3>
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={hasVideo}
                  onChange={(e) => setHasVideo(e.target.checked)}
                  className="rounded accent-pink-500"
                />
                <span className="text-xs text-slate-300 font-semibold">Include Video</span>
              </label>
            </div>

            {hasVideo && (
              <div className="space-y-4">
                {/* Presets Row */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Preset Lectures:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {PRESET_VIDEOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between group"
                      >
                        <span className="truncate flex-1 font-medium">{preset.name}</span>
                        <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/20 ml-2">
                          {preset.duration}m
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video URL Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Video URL (YouTube, Vimeo, or direct MP4)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                    />
                    <Video size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                {/* Video Title & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Video Header Title</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Title on player..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Duration (Minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>

                {/* Video Preview Player */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <PlayCircle size={14} className="text-pink-400" />
                      <span>Live Student Video Preview</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowVideoPreview(!showVideoPreview)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300"
                    >
                      {showVideoPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>

                  {showVideoPreview && (
                    <VideoPlayer
                      video={{
                        id: 'preview-video',
                        title: videoTitle || title || 'Lesson Video Preview',
                        url: videoUrl,
                        durationMinutes: videoDuration,
                        description: videoDesc,
                        topicMarkers: [
                          { time: '00:00', title: 'Foundations' },
                          { time: '04:15', title: 'Interactive Lab Sync' },
                        ],
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Publishing Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Publishing & Access Controls
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Author:</span>
                <span className="font-bold text-white">Dr. Aris Thorne (Tutor)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Student Visibility:</span>
                <span className="text-emerald-400 font-bold">Immediate in Curriculum Hub</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Interactive Quiz:</span>
                <span className="text-indigo-400 font-bold">{quizzes.length} Questions Configured</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleSubmitLesson('published')}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 size={16} />
                <span>Publish Lesson for Students</span>
              </button>
              <button
                type="button"
                onClick={() => handleSubmitLesson('draft')}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center justify-center space-x-2"
              >
                <Save size={15} />
                <span>Save to Drafts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
