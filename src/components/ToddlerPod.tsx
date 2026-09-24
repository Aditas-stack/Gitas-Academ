import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Music,
  Shapes,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Star,
  Tv,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToddlerLetter, NurserySong } from '../types';
import { sound } from '../utils/audio';

interface ToddlerPodProps {
  onToast: (msg: string, title?: string) => void;
}

const ALPHABET: ToddlerLetter[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎', phonetic: '/æ/ apple', color: 'from-rose-500 to-red-600' },
  { letter: 'B', word: 'Bear', emoji: '🐻', phonetic: '/b/ bear', color: 'from-amber-500 to-yellow-600' },
  { letter: 'C', word: 'Cat', emoji: '🐱', phonetic: '/k/ cat', color: 'from-emerald-500 to-teal-600' },
  { letter: 'D', word: 'Dolphin', emoji: '🐬', phonetic: '/d/ dolphin', color: 'from-sky-500 to-blue-600' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', phonetic: '/e/ elephant', color: 'from-indigo-500 to-purple-600' },
  { letter: 'F', word: 'Frog', emoji: '🐸', phonetic: '/f/ frog', color: 'from-emerald-500 to-green-600' },
  { letter: 'G', word: 'Giraffe', emoji: '🦒', phonetic: '/dʒ/ giraffe', color: 'from-amber-400 to-orange-500' },
  { letter: 'H', word: 'Horse', emoji: '🐴', phonetic: '/h/ horse', color: 'from-orange-500 to-rose-600' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', phonetic: '/aɪ/ ice cream', color: 'from-pink-400 to-rose-500' },
  { letter: 'J', word: 'Jellyfish', emoji: '🪼', phonetic: '/dʒ/ jellyfish', color: 'from-purple-500 to-indigo-600' },
  { letter: 'K', word: 'Koala', emoji: '🐨', phonetic: '/k/ koala', color: 'from-slate-400 to-slate-600' },
  { letter: 'L', word: 'Lion', emoji: '🦁', phonetic: '/l/ lion', color: 'from-amber-500 to-yellow-600' },
  { letter: 'M', word: 'Monkey', emoji: '🐵', phonetic: '/m/ monkey', color: 'from-orange-400 to-amber-600' },
  { letter: 'N', word: 'Nest', emoji: '🪹', phonetic: '/n/ nest', color: 'from-teal-500 to-emerald-600' },
  { letter: 'O', word: 'Owl', emoji: '🦉', phonetic: '/aʊ/ owl', color: 'from-amber-600 to-orange-700' },
  { letter: 'P', word: 'Penguin', emoji: '🐧', phonetic: '/p/ penguin', color: 'from-sky-500 to-indigo-600' },
  { letter: 'Q', word: 'Queen', emoji: '👑', phonetic: '/kw/ queen', color: 'from-purple-500 to-pink-600' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰', phonetic: '/r/ rabbit', color: 'from-pink-400 to-rose-500' },
  { letter: 'S', word: 'Sun', emoji: '☀️', phonetic: '/s/ sun', color: 'from-yellow-400 to-amber-500' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', phonetic: '/t/ tiger', color: 'from-orange-500 to-amber-600' },
  { letter: 'U', word: 'Unicorn', emoji: '🦄', phonetic: '/juː/ unicorn', color: 'from-fuchsia-500 to-purple-600' },
  { letter: 'V', word: 'Violin', emoji: '🎻', phonetic: '/v/ violin', color: 'from-violet-500 to-purple-600' },
  { letter: 'W', word: 'Whale', emoji: '🐳', phonetic: '/w/ whale', color: 'from-blue-400 to-cyan-600' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', phonetic: '/z/ xylophone', color: 'from-emerald-400 to-teal-500' },
  { letter: 'Y', word: 'Yacht', emoji: '⛵', phonetic: '/j/ yacht', color: 'from-sky-400 to-blue-600' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', phonetic: '/z/ zebra', color: 'from-slate-500 to-slate-700' },
];

const NURSERY_SONGS: NurserySong[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    duration: '0:35',
    bpm: 100,
    themeColor: 'from-indigo-600 to-purple-600',
    iconEmoji: '⭐',
    youtubeUrl: 'https://www.youtube.com/watch?v=yCjJyiqpAuU',
    description: 'Classic bedtime celestial melody exploring night skies and glowing stars.',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'C4', duration: 2 },
    ],
    lyrics: [
      'Twin-kle, twin-kle, lit-tle star,',
      'How I won-der what you are!',
      'Up a-bove the world so high,',
      'Like a dia-mond in the sky!',
    ],
  },
  {
    id: 'wheels-bus',
    title: 'The Wheels on the Bus',
    duration: '0:40',
    bpm: 120,
    themeColor: 'from-amber-500 to-yellow-600',
    iconEmoji: '🚌',
    youtubeUrl: 'https://www.youtube.com/watch?v=e_04ZrNroTo',
    description: 'Upbeat rhythmic journey with horn beeps, swishing wipers, and rolling wheels.',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'C5', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'F4', duration: 2 },
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'G4', duration: 2 },
      { note: 'A4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'F4', duration: 2 },
    ],
    lyrics: [
      'The wheels on the bus go round and round,',
      'Round and round, round and round!',
      'The wheels on the bus go round and round,',
      'All through the town!',
    ],
  },
  {
    id: 'macdonald',
    title: 'Old MacDonald Had a Farm',
    duration: '0:45',
    bpm: 115,
    themeColor: 'from-emerald-500 to-teal-600',
    iconEmoji: '🐮',
    youtubeUrl: 'https://www.youtube.com/watch?v=_6HzoUcx3eo',
    description: 'Barnyard chorus learning farm animals and cheerful animal sounds.',
    notes: [
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'D4', duration: 2 },
      { note: 'B4', duration: 1 }, { note: 'B4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'G4', duration: 2 },
    ],
    lyrics: [
      'Old Mac-Don-ald had a farm, E-I-E-I-O!',
      'And on that farm he had a cow, E-I-E-I-O!',
      'With a moo-moo here, and a moo-moo there,',
      'Here a moo, there a moo, ev-ery-where a moo-moo!',
    ],
  },
  {
    id: 'baa-sheep',
    title: 'Baa Baa Black Sheep',
    duration: '0:35',
    bpm: 105,
    themeColor: 'from-sky-500 to-blue-600',
    iconEmoji: '🐑',
    youtubeUrl: 'https://www.youtube.com/watch?v=MR5XSOdjKMA',
    description: 'Gentle wool-sharing pastoral nursery rhyme with rhythmic clapping.',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'C4', duration: 2 },
    ],
    lyrics: [
      'Baa, baa, black sheep, have you an-y wool?',
      'Yes, sir, yes, sir, three bags full!',
      'One for the mas-ter, and one for the dame,',
      'And one for the lit-tle boy who lives down the lane!',
    ],
  },
  {
    id: 'itsy-spider',
    title: 'The Itsy Bitsy Spider',
    duration: '0:38',
    bpm: 110,
    themeColor: 'from-purple-500 to-indigo-600',
    iconEmoji: '🕷️',
    youtubeUrl: 'https://www.youtube.com/watch?v=w_lCi8U49mY',
    description: 'Determination and resilience with finger movements, raindrops, and sunshine.',
    notes: [
      { note: 'G4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 }, { note: 'E4', duration: 2 }, { note: 'E4', duration: 2 },
      { note: 'E4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'E4', duration: 2 }, { note: 'C4', duration: 2 },
    ],
    lyrics: [
      'The it-sy bit-sy spi-der climbed up the wa-ter spout,',
      'Down came the rain and washed the spi-der out!',
      'Out came the sun and dried up all the rain,',
      'And the it-sy bit-sy spi-der climbed up the spout a-gain!',
    ],
  },
  {
    id: 'row-boat',
    title: 'Row, Row, Row Your Boat',
    duration: '0:32',
    bpm: 115,
    themeColor: 'from-cyan-500 to-blue-600',
    iconEmoji: '🚣',
    youtubeUrl: 'https://www.youtube.com/watch?v=7otAJa3jui8',
    description: 'Peaceful river exploration teaching rhythmic harmony and joyful singing.',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'E4', duration: 2 }, { note: 'E4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'G4', duration: 3 },
    ],
    lyrics: [
      'Row, row, row your boat, gent-ly down the stream,',
      'Mer-ri-ly, mer-ri-ly, mer-ri-ly, mer-ri-ly,',
      'Life is but a dream!',
      'Row, row, row your boat, smil-ing all the way!',
    ],
  },
  {
    id: 'five-ducks',
    title: 'Five Little Ducks',
    duration: '0:40',
    bpm: 112,
    themeColor: 'from-yellow-400 to-amber-500',
    iconEmoji: '🦆',
    youtubeUrl: 'https://www.youtube.com/watch?v=pZw9veQ76fo',
    description: 'Early countdown math rhyme with mother duck and quacking ducklings.',
    notes: [
      { note: 'G4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'G4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
    ],
    lyrics: [
      'Five lit-tle ducks went out one day,',
      'O-ver the hill and far a-way,',
      'Mo-ther duck said, "Quack, quack, quack, quack!"',
      'And all the lit-tle ducks came back! Hooray!',
    ],
  },
  {
    id: 'hickory-dock',
    title: 'Hickory Dickory Dock',
    duration: '0:30',
    bpm: 120,
    themeColor: 'from-orange-500 to-rose-600',
    iconEmoji: '🕰️',
    youtubeUrl: 'https://www.youtube.com/watch?v=HGgsklW-mtg',
    description: 'Pendulum rhythm clock rhyme teaching time-telling and clock numbers.',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'G4', duration: 2 }, { note: 'G4', duration: 2 },
      { note: 'C5', duration: 1 }, { note: 'B4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'C4', duration: 2 },
    ],
    lyrics: [
      'Hick-o-ry dick-o-ry dock, the mouse ran up the clock!',
      'The clock struck one, the mouse ran down,',
      'Hick-o-ry dick-o-ry dock!',
      'Tick-tock, tick-tock, tick-tock!',
    ],
  },
  {
    id: 'head-shoulders',
    title: 'Head, Shoulders, Knees and Toes',
    duration: '0:35',
    bpm: 125,
    themeColor: 'from-teal-500 to-emerald-600',
    iconEmoji: '🤸',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZanHgPprl-0',
    description: 'Active physical movement anatomy song touching eyes, ears, knees, and toes.',
    notes: [
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'C5', duration: 1 }, { note: 'C5', duration: 1 },
      { note: 'B4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 2 },
      { note: 'A4', duration: 1 }, { note: 'B4', duration: 1 }, { note: 'C5', duration: 2 },
    ],
    lyrics: [
      'Head, shoul-ders, knees and toes, knees and toes!',
      'Head, shoul-ders, knees and toes, knees and toes!',
      'And eyes and ears and mouth and nose,',
      'Head, shoul-ders, knees and toes, knees and toes!',
    ],
  },
  {
    id: 'abc-song',
    title: 'The Alphabet Song (ABC)',
    duration: '0:30',
    bpm: 110,
    themeColor: 'from-pink-600 to-rose-600',
    iconEmoji: '🔤',
    youtubeUrl: 'https://www.youtube.com/watch?v=75p-N9YKqNo',
    description: 'Foundational English phonics alphabet chant with full A-to-Z progression.',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'C4', duration: 2 },
    ],
    lyrics: [
      'A - B - C - D - E - F - G,',
      'H - I - J - K - L - M - N - O - P,',
      'Q - R - S, and T - U - V,',
      'W - X, and Y and Z!',
    ],
  },
];

export const ToddlerPod: React.FC<ToddlerPodProps> = ({ onToast }) => {
  const [activeSection, setActiveSection] = useState<'abc' | 'numbers' | 'shapes' | 'songs'>('abc');
  const [poppedNumbers, setPoppedNumbers] = useState<number[]>([]);
  const [targetShape, setTargetShape] = useState<string>('Star');
  const [targetShapeColor, setTargetShapeColor] = useState<string>('text-amber-400');
  const [shapeStreak, setShapeStreak] = useState<number>(0);

  // Animated Song Player State
  const [currentSong, setCurrentSong] = useState<NurserySong>(NURSERY_SONGS[0]);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number>(0);
  const stopSongRef = useRef<(() => void) | null>(null);
  const animationCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ---------------------------------------------------------------------------
  // ABC Phonics Play
  // ---------------------------------------------------------------------------
  const handleLetterClick = (item: ToddlerLetter) => {
    sound.playSound('pop');
    sound.speak(`${item.letter}! ${item.word}! ${item.letter} is for ${item.word}`, 0.9, 1.2);
    onToast(`Letter ${item.letter}: ${item.word} ${item.emoji}`, 'Phonics Audio');
  };

  // ---------------------------------------------------------------------------
  // Number Bubble Pop
  // ---------------------------------------------------------------------------
  const handleNumberClick = (num: number) => {
    sound.playSound('pop');
    sound.speak(num.toString(), 0.95, 1.3);

    if (!poppedNumbers.includes(num)) {
      setPoppedNumbers((prev) => [...prev, num]);
    }

    if (poppedNumbers.length + 1 === 20) {
      sound.playSound('success');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      sound.speak('Hooray! You counted all 20 numbers!', 0.9, 1.2);
    }
  };

  const resetNumbers = () => {
    sound.playSound('click');
    setPoppedNumbers([]);
    onToast('Reset numbers! Ready to count again.', 'Counting Lab');
  };

  // ---------------------------------------------------------------------------
  // Shapes & Colors Matcher
  // ---------------------------------------------------------------------------
  const shapesList = [
    { name: 'Star', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/20' },
    { name: 'Heart', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/20' },
    { name: 'Circle', icon: Sparkles, color: 'text-sky-400', bg: 'bg-sky-400/20' },
    { name: 'Shapes', icon: Shapes, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  ];

  const handleShapeSelect = (name: string) => {
    if (name === targetShape) {
      sound.playSound('correct');
      confetti({ particleCount: 50, spread: 50 });
      sound.speak(`Awesome! That is the ${targetShape}!`, 0.9, 1.2);
      setShapeStreak((prev) => prev + 1);

      // Pick new target
      const otherShapes = shapesList.filter((s) => s.name !== targetShape);
      const nextShape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
      setTargetShape(nextShape.name);
      setTargetShapeColor(nextShape.color);
    } else {
      sound.playSound('wrong');
      sound.speak(`Try again! Find the ${targetShape}!`, 0.85, 1.1);
    }
  };

  // ---------------------------------------------------------------------------
  // Nursery Song & Animated Canvas
  // ---------------------------------------------------------------------------
  const playCurrentSong = () => {
    if (isPlayingSong) {
      if (stopSongRef.current) stopSongRef.current();
      setIsPlayingSong(false);
      return;
    }

    setIsPlayingSong(true);
    setActiveNoteIdx(0);

    const stop = sound.playMelody(currentSong.notes, currentSong.bpm, (noteIndex) => {
      setActiveNoteIdx(noteIndex);
    });
    stopSongRef.current = stop;

    // Automatically stop when finished
    const totalDuration =
      currentSong.notes.reduce((acc, curr) => acc + curr.duration * (60 / currentSong.bpm), 0) *
      1000;
    setTimeout(() => {
      setIsPlayingSong(false);
      confetti({ particleCount: 60, spread: 60 });
    }, totalDuration + 200);
  };

  // Animated background for song player
  useEffect(() => {
    if (!isPlayingSong) return;
    const canvas = animationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let angle = 0;

    const render = () => {
      angle += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw floating musical notes and stars
      for (let i = 0; i < 8; i++) {
        const x = (canvas.width / 8) * i + Math.sin(angle + i) * 20;
        const y = canvas.height / 2 + Math.cos(angle + i * 1.5) * 40;
        ctx.fillStyle = i % 2 === 0 ? '#ec4899' : '#6366f1';
        ctx.font = '24px sans-serif';
        ctx.fillText(i % 2 === 0 ? '⭐' : '🎵', x, y);
      }

      frameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(frameId);
  }, [isPlayingSong]);

  return (
    <section className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-indigo-950/40 border border-pink-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30 inline-flex items-center gap-1.5 mb-2">
            <Sparkles size={12} />
            <span>Toddler Discovery Pod (Ages 1-5)</span>
          </span>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Sensory ABCs, Phonics & Animated Video Streams
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Gentle voice prompts, musical sound synthesis, touch-and-speak phonics, and safe
            interactive sing-along cartoon modules.
          </p>
        </div>

        {/* Quick Nav Pills */}
        <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 space-x-1 text-xs">
          <button
            onClick={() => {
              setActiveSection('abc');
              sound.playSound('click');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              activeSection === 'abc' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alphabet A-Z
          </button>
          <button
            onClick={() => {
              setActiveSection('numbers');
              sound.playSound('click');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              activeSection === 'numbers' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Counting 1-20
          </button>
          <button
            onClick={() => {
              setActiveSection('shapes');
              sound.playSound('click');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              activeSection === 'shapes' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shape Match
          </button>
          <button
            onClick={() => {
              setActiveSection('songs');
              sound.playSound('click');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              activeSection === 'songs' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Nursery Rhymes
          </button>
        </div>
      </div>

      {/* SECTION 1: ALPHABET A-Z */}
      {activeSection === 'abc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">
              Tap any letter to hear cheerful pronunciation & vocabulary!
            </span>
            <span className="text-xs bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full font-bold border border-pink-500/30">
              Web Speech Synthesizer Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3.5">
            {ALPHABET.map((item) => (
              <button
                key={item.letter}
                onClick={() => handleLetterClick(item)}
                className="glass-panel p-4 rounded-3xl border border-slate-800 hover:border-pink-500/60 transition duration-300 transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center space-y-2 group shadow-lg"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-3xl font-extrabold text-white shadow-md group-hover:rotate-6 transition`}
                >
                  {item.letter}
                </div>
                <div className="text-2xl">{item.emoji}</div>
                <p className="text-xs font-bold text-white group-hover:text-pink-400 transition">
                  {item.word}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">{item.phonetic}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: NUMBERS 1-20 BUBBLE POP */}
      {activeSection === 'numbers' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Interactive Bubble Counting (1 to 20)</h3>
              <p className="text-xs text-slate-400">
                Click to pop bubbles in order! Popped: {poppedNumbers.length} / 20
              </p>
            </div>
            <button
              onClick={resetNumbers}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition"
            >
              <RotateCcw size={14} />
              <span>Reset Bubbles</span>
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
              const isPopped = poppedNumbers.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className={`h-16 rounded-2xl font-bold text-lg transition duration-300 flex items-center justify-center transform active:scale-90 ${
                    isPopped
                      ? 'bg-slate-900/60 border border-slate-800 text-slate-600 scale-90'
                      : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:scale-105 border border-indigo-400/40'
                  }`}
                >
                  {isPopped ? '✓' : num}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: SHAPE & COLOR MATCH */}
      {activeSection === 'shapes' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Toddler Sensory Game
            </span>
            <h3 className="text-xl font-bold text-white">Can you tap the {targetShape}?</h3>
            <p className="text-xs text-slate-400">Current Streak: ⭐ {shapeStreak}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            {shapesList.map((shape) => {
              const IconComp = shape.icon;
              return (
                <button
                  key={shape.name}
                  onClick={() => handleShapeSelect(shape.name)}
                  className={`p-6 rounded-3xl border border-slate-800 hover:border-pink-500/60 transition flex flex-col items-center justify-center space-y-3 transform hover:scale-105 active:scale-95 ${shape.bg}`}
                >
                  <IconComp size={48} className={shape.color} />
                  <span className="text-sm font-bold text-white">{shape.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: ANIMATED NURSERY RHYMES */}
      {activeSection === 'songs' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <Music size={14} />
                <span>Musical Nursery Studio (10 Classic Rhymes)</span>
              </span>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>{currentSong.iconEmoji}</span>
                <span>{currentSong.title}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentSong.description || 'Safe real-time musical synthesizer with animated lyrics playback and video.'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={playCurrentSong}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-pink-600/30"
              >
                {isPlayingSong ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlayingSong ? 'Pause Melody' : 'Play Synthesizer'}</span>
              </button>
            </div>
          </div>

          {/* Song Selection Grid Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-300">Select Nursery Rhyme:</span>
              <span>{NURSERY_SONGS.length} Interactive Songs Available</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {NURSERY_SONGS.map((song) => {
                const isSelected = song.id === currentSong.id;
                return (
                  <button
                    key={song.id}
                    onClick={() => {
                      if (isPlayingSong && stopSongRef.current) {
                        stopSongRef.current();
                        setIsPlayingSong(false);
                      }
                      setCurrentSong(song);
                      sound.playSound('pop');
                      sound.speak(song.title, 0.9, 1.2);
                      onToast(`Playing "${song.title}"`, 'Nursery Studio');
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-24 relative overflow-hidden group ${
                      isSelected
                        ? 'border-pink-500 ring-2 ring-pink-500/40 bg-pink-950/40 shadow-lg shadow-pink-950/40'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl transform group-hover:scale-125 transition duration-300">
                        {song.iconEmoji || '🎵'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{song.duration}</span>
                    </div>

                    <div>
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-pink-300' : 'text-slate-200'}`}>
                        {song.title}
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold">{song.bpm} BPM</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage Area: Synthesizer or Video Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Musical Visualizer Stage (7 cols) */}
            <div className="lg:col-span-7 aspect-video w-full bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center p-6 text-center shadow-inner">
              <canvas
                ref={animationCanvasRef}
                width={600}
                height={300}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
              />

              <div className="relative z-10 space-y-4 max-w-lg">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white text-3xl shadow-xl shadow-pink-500/30 animate-bounce">
                  {currentSong.iconEmoji || '🎵'}
                </div>

                {/* Lyrics with highlight */}
                <div className="space-y-2">
                  {currentSong.lyrics.map((line, idx) => (
                    <p
                      key={idx}
                      className={`text-sm sm:text-base font-bold transition-all duration-300 ${
                        isPlayingSong && Math.floor(activeNoteIdx / 3) === idx
                          ? 'text-pink-400 scale-105 drop-shadow-md'
                          : 'text-slate-300'
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-center space-x-2">
                  <span className="text-[10px] bg-slate-900/90 text-pink-300 px-3 py-1 rounded-full border border-slate-700/80">
                    {isPlayingSong ? '🔊 Note Synthesizer Active' : 'Tap Play Synthesizer to sing along'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Embedded Educational Cartoon Video (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-xl">
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tv size={14} className="text-pink-400" />
                  <span className="text-xs font-bold text-white">Sing-Along Cartoon Video</span>
                </div>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold">
                  YouTube Kids Safe
                </span>
              </div>

              <div className="relative aspect-video w-full bg-black">
                {currentSong.youtubeUrl ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${
                      currentSong.youtubeUrl.match(/(?:watch\?v=)([\w-]{11})/)?.[1] || 'yCjJyiqpAuU'
                    }?rel=0`}
                    title={currentSong.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-500">
                    <Tv size={32} className="opacity-40" />
                    <p className="text-xs mt-2">Video player loading...</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-900/60 text-[11px] text-slate-400">
                <p className="font-semibold text-slate-300">{currentSong.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Kid-friendly animated musical stream with lyrics subtitles and phonics guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
