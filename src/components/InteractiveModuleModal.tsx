import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Volume2,
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  Film,
  BookOpen,
  Download,
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurriculumItem, QuizQuestion } from '../types';
import { sound } from '../utils/audio';
import { VideoPlayer } from './VideoPlayer';

interface InteractiveModuleModalProps {
  item: CurriculumItem | null;
  onClose: () => void;
  onCompleteModule: (title: string, score: number) => void;
}

export const InteractiveModuleModal: React.FC<InteractiveModuleModalProps> = ({
  item,
  onClose,
  onCompleteModule,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'lab' | 'quiz' | 'objectives'>('lab');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Mathematics Lab state
  const [sliderA, setSliderA] = useState<number>(1);
  const [sliderB, setSliderB] = useState<number>(0);
  const mathCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quantum Lab state
  const [energyLevel, setEnergyLevel] = useState<number>(2);

  // Ecosystem Simulator state
  const [herbivores, setHerbivores] = useState<number>(50);
  const [predators, setPredators] = useState<number>(15);
  const [flora, setFlora] = useState<number>(80);

  // Shakespeare audio speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    // If item has video, open on video tab, otherwise lab
    if (item?.video) {
      setActiveTab('video');
    } else {
      setActiveTab('lab');
    }
  }, [item]);

  // Draw dynamic function graph for Calculus
  useEffect(() => {
    if (!item) return;
    const isCalc =
      item.interactiveType === 'calculus' ||
      item.title.includes('Calculus') ||
      item.title.includes('Mathematics');
    if (!isCalc) return;

    const canvas = mathCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Plot quadratic function f(x) = a*x^2 + b*x
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < width; px += 2) {
      const x = (px - width / 2) / 30;
      const y = sliderA * Math.pow(x, 2) + sliderB * x;
      const py = height / 2 - y * 15;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Plot derivative f'(x) = 2*a*x + b
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let px = 0; px < width; px += 2) {
      const x = (px - width / 2) / 30;
      const yPrime = 2 * sliderA * x + sliderB;
      const py = height / 2 - yPrime * 15;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }, [item, sliderA, sliderB]);

  if (!item) return null;

  // Baseline standard quizzes
  const defaultQuizzes: Record<
    string,
    Array<{ q: string; options: string[]; correct: number; explanation: string }>
  > = {
    default: [
      {
        q: 'What is the primary objective of this fundamental learning module?',
        options: [
          'Spatial visualization of core concepts',
          'Memorization without reasoning',
          'Single trial execution',
          'Passive observation',
        ],
        correct: 0,
        explanation: 'Gitas Academy emphasizes spatial reasoning and real-time interactive exploration.',
      },
      {
        q: 'How does real-time parameter tweaking deepen cognitive retention?',
        options: [
          'It isolates unrelated variables',
          'It provides instant visual & mathematical feedback',
          'It skips empirical laws',
          'It limits experimentation',
        ],
        correct: 1,
        explanation: 'Instant feedback loops allow students to directly test hypotheses.',
      },
    ],
    calculus: [
      {
        q: "Given f(x) = a·x² + b·x, what is the first derivative f'(x)?",
        options: ["f'(x) = 2ax + b", "f'(x) = ax + b²", "f'(x) = 2ax²", "f'(x) = a + b"],
        correct: 0,
        explanation: 'By the power rule, d/dx(ax²) = 2ax, and d/dx(bx) = b.',
      },
      {
        q: "At what x-coordinate does the vertex (extremum) occur when f'(x) = 0?",
        options: ['x = b / (2a)', 'x = -b / (2a)', 'x = -2a / b', 'x = 0'],
        correct: 1,
        explanation: 'Setting 2ax + b = 0 yields x = -b / (2a).',
      },
    ],
    quantum: [
      {
        q: 'When an electron drops from energy level n=3 to n=1, what is released?',
        options: ['A neutron', 'A photon of light', 'A positron', 'Gravity waves'],
        correct: 1,
        explanation: 'Energy conservation dictates that the difference ΔE is emitted as a photon.',
      },
      {
        q: 'Which formula relates photon energy to frequency?',
        options: ['E = mc²', 'E = h · ν', 'F = ma', 'P = IV'],
        correct: 1,
        explanation: "Planck-Einstein relation: E = h · ν where h is Planck's constant.",
      },
    ],
  };

  const getQuizData = (): Array<{ q: string; options: string[]; correct: number; explanation: string }> => {
    if (item.customQuizzes && item.customQuizzes.length > 0) {
      return item.customQuizzes;
    }
    if (item.interactiveType === 'calculus' || item.title.includes('Calculus') || item.title.includes('Mathematics')) {
      return defaultQuizzes.calculus;
    }
    if (item.interactiveType === 'quantum' || item.title.includes('Physics') || item.title.includes('Quantum')) {
      return defaultQuizzes.quantum;
    }
    return defaultQuizzes.default;
  };

  const currentQuiz = getQuizData();

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    sound.playSound('click');
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleGradeQuiz = () => {
    let scoreCount = 0;
    currentQuiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        scoreCount++;
      }
    });

    const percent = Math.round((scoreCount / currentQuiz.length) * 100);
    setQuizScore(percent);
    setQuizSubmitted(true);

    if (percent >= 70) {
      sound.playSound('success');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleteModule(item.title, percent);
    } else {
      sound.playSound('wrong');
    }
  };

  const speakShakespeare = () => {
    const text =
      "Tomorrow, and tomorrow, and tomorrow, creeps in this petty pace from day to day to the last syllable of recorded time. And all our yesterdays have lighted fools the way to dusty death.";
    setIsSpeaking(true);
    sound.speak(text, 0.85, 0.95);
    setTimeout(() => setIsSpeaking(false), 8000);
  };

  const isCalculus =
    item.interactiveType === 'calculus' ||
    item.title.includes('Calculus') ||
    item.title.includes('Mathematics');
  const isQuantum =
    item.interactiveType === 'quantum' ||
    item.title.includes('Physics') ||
    item.title.includes('Quantum') ||
    item.title.includes('Astronomy');
  const isShakespeare =
    item.interactiveType === 'literature' ||
    item.title.includes('Shakespeare') ||
    item.title.includes('Literature') ||
    item.title.includes('Writing');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg font-bold flex-shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                  {item.isTutorCreated ? 'Tutor Interactive Module' : 'Academy Module'}
                </span>
                {item.isTutorCreated && item.tutorName && (
                  <span className="text-[10px] text-amber-300 font-semibold hidden sm:inline">
                    • by {item.tutorName}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white font-heading leading-tight truncate">
                {item.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Tab Switcher */}
            <div className="flex bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
              {item.video && (
                <button
                  onClick={() => {
                    setActiveTab('video');
                    sound.playSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    activeTab === 'video'
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film size={13} />
                  <span>Video</span>
                </button>
              )}

              <button
                onClick={() => {
                  setActiveTab('lab');
                  sound.playSound('click');
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'lab'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>3D Lab</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('quiz');
                  sound.playSound('click');
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Quiz</span>
              </button>

              {item.objectives && item.objectives.length > 0 && (
                <button
                  onClick={() => {
                    setActiveTab('objectives');
                    sound.playSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition hidden md:flex items-center gap-1.5 ${
                    activeTab === 'objectives'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Syllabus</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* VIDEO TAB */}
          {activeTab === 'video' && item.video && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Film size={16} className="text-pink-400" />
                    <span>Instructional Video Demonstration</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Presented by {item.tutorName || 'Academy Faculty'}. Watch the lecture before conducting the spatial experiment.
                  </p>
                </div>
                <span className="text-xs text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-lg border border-pink-500/30 flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.video.durationMinutes} mins</span>
                </span>
              </div>

              {/* Video Player */}
              <VideoPlayer video={item.video} autoPlay={false} />

              {/* Synopsis & Key Timestamps */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Lesson Synopsis</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>

                {item.objectives && item.objectives.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Key Concepts Explored in this Video:
                    </p>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {item.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('lab');
                    sound.playSound('click');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
                >
                  <span>Proceed to Interactive 3D Lab</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* OBJECTIVES / SYLLABUS TAB */}
          {activeTab === 'objectives' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-400" />
                  <span>Courseware Syllabus & Target Competencies</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>

                {item.objectives && (
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Mastery Goals:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.objectives.map((obj, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800"
                        >
                          <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-200">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.resources && item.resources.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Downloadable Study Materials:
                    </h5>
                    <div className="space-y-2">
                      {item.resources.map((res, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText size={16} className="text-indigo-400" />
                            <div>
                              <p className="text-xs font-bold text-white">{res.name}</p>
                              <p className="text-[10px] text-slate-400">{res.type} • {res.size || '1.8 MB'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => sound.playSound('pop')}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INTERACTIVE LAB TAB */}
          {activeTab === 'lab' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {isCalculus ? (
                /* Mathematics & Calculus Dynamic Grapher */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Dynamic Function & Derivative Plotter</h4>
                      <p className="text-xs text-slate-400">
                        Blue: f(x) = {sliderA}x² + {sliderB}x | Pink dashed: f&apos;(x) = {2 * sliderA}x + {sliderB}
                      </p>
                    </div>
                    <span className="text-xs text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/30 font-mono">
                      Vertex: x = {(-sliderB / (2 * (sliderA || 1))).toFixed(2)}
                    </span>
                  </div>

                  <div className="h-56 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
                    <canvas
                      ref={mathCanvasRef}
                      width={600}
                      height={210}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/70 p-4 rounded-2xl border border-slate-800 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-slate-300">
                        <span>Curvature Parameter a: <strong>{sliderA}</strong></span>
                      </div>
                      <input
                        type="range"
                        min="-3"
                        max="3"
                        step="0.5"
                        value={sliderA}
                        onChange={(e) => setSliderA(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-slate-300">
                        <span>Linear Slope b: <strong>{sliderB}</strong></span>
                      </div>
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="1"
                        value={sliderB}
                        onChange={(e) => setSliderB(parseFloat(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ) : isQuantum ? (
                /* Quantum Physics & Atom Interactive */
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white">Quantum Energy Transition Simulator</h4>
                  <p className="text-xs text-slate-400">
                    Bohr model orbital transitions. Changing energy level (n) calculates emission wavelength and photon frequency.
                  </p>

                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center space-y-4 relative">
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          onClick={() => {
                            setEnergyLevel(n);
                            sound.playSound('pop');
                          }}
                          className={`w-12 h-12 rounded-2xl font-bold text-sm transition flex flex-col items-center justify-center ${
                            energyLevel === n
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-110'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>n={n}</span>
                          <span className="text-[9px] opacity-70">
                            {-(13.6 / (n * n)).toFixed(1)} eV
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center w-full max-w-md space-y-1">
                      <p className="text-xs text-indigo-300 font-semibold">
                        Excitation Energy: <strong className="text-white">{(13.6 * (1 - 1 / (energyLevel * energyLevel))).toFixed(2)} eV</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Photon Wavelength λ = <strong className="text-emerald-400">{Math.round(1240 / (13.6 * (1 - 1 / (energyLevel * energyLevel)) || 1))} nm</strong> (UV / Visible Spectrum)
                      </p>
                    </div>
                  </div>
                </div>
              ) : isShakespeare ? (
                /* Literature Audio Studio */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Shakespeare Dramatic Dialogue Studio</h4>
                      <p className="text-xs text-slate-400">Listen to AI synthesized dramatic cadence and poetic rhythm.</p>
                    </div>
                    <button
                      onClick={speakShakespeare}
                      className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-pink-600/30"
                    >
                      <Volume2 size={15} />
                      <span>{isSpeaking ? 'Narrating...' : 'Recite Soliloquy'}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 font-serif italic text-slate-200 text-sm leading-relaxed space-y-2">
                    <p>&ldquo;Tomorrow, and tomorrow, and tomorrow,</p>
                    <p>Creeps in this petty pace from day to day,</p>
                    <p>To the last syllable of recorded time;&rdquo;</p>
                  </div>
                </div>
              ) : (
                /* General Science & Ecosystem Simulator */
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white">Ecosystem Multi-Species Balance Simulator</h4>
                  <p className="text-xs text-slate-400">
                    Adjust trophic level populations to study predator-prey dynamics and ecological carrying capacity.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                        <span>Flora / Plants</span>
                        <span>{flora}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={flora}
                        onChange={(e) => setFlora(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-indigo-400 font-semibold">
                        <span>Herbivores (Rabbits)</span>
                        <span>{herbivores}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={herbivores}
                        onChange={(e) => setHerbivores(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-rose-400 font-semibold">
                        <span>Predators (Wolves)</span>
                        <span>{predators}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={predators}
                        onChange={(e) => setPredators(parseInt(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                    Status:{' '}
                    {flora > herbivores * 1.2 && predators < herbivores
                      ? '🌿 Thriving Ecosystem: Sustainable equilibrium achieved!'
                      : '⚠️ Trophic Imbalance: Overgrazing or predator depletion detected!'}
                  </div>
                </div>
              )}

              {/* Action row */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                {item.video && (
                  <button
                    onClick={() => {
                      setActiveTab('video');
                      sound.playSound('click');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Back to Video
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveTab('quiz');
                    sound.playSound('click');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-indigo-600/30 ml-auto"
                >
                  <span>Proceed to Quiz Assessment</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ASSESSMENT TAB */}
          {activeTab === 'quiz' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award size={16} className="text-indigo-400" />
                  <span>Module Assessment ({currentQuiz.length} Questions)</span>
                </h4>
                {quizSubmitted && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      quizScore >= 70
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    Final Score: {quizScore}%
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {currentQuiz.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <p className="text-xs font-bold text-white">
                      {qIdx + 1}. {q.q}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[qIdx] === oIdx;
                        let btnStyle = 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border-slate-700';

                        if (quizSubmitted) {
                          if (oIdx === q.correct) {
                            btnStyle = 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 font-bold';
                          } else if (isSelected && oIdx !== q.correct) {
                            btnStyle = 'bg-rose-600/30 text-rose-300 border-rose-500/50';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-indigo-600 text-white border-indigo-400 shadow-md font-semibold';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && oIdx === q.correct && (
                              <CheckCircle2 size={14} className="text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit / Reset row */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setActiveTab('lab');
                    sound.playSound('click');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Back to Lab
                </button>

                {!quizSubmitted ? (
                  <button
                    onClick={handleGradeQuiz}
                    disabled={Object.keys(quizAnswers).length < currentQuiz.length}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-bold disabled:opacity-50 transition shadow-lg shadow-indigo-600/30 hover:opacity-95"
                  >
                    Submit & Grade Assessment
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30"
                  >
                    Done & Return to Hub
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
