import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  Filter,
  Heart,
  Share2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Zap,
  Users,
  Star,
  Info,
  Calendar,
  X
} from 'lucide-react';
import { GradePod, UserProfile, LeaderboardUser } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LeaderboardProps {
  userProfile: UserProfile;
  onAwardPoints: (points: number, reason: string) => void;
  onToast: (desc: string, title?: string) => void;
  currentPod: GradePod;
  onSelectPod: (pod: GradePod) => void;
}

// Baseline mock student performers across all 3 grade pods
const BASE_PEERS: Omit<LeaderboardUser, 'rank' | 'previousRank'>[] = [
  {
    id: 'lead-1',
    name: 'Maya Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
    pod: 'academy',
    gradeLevel: 'Academy Core (Grade 8)',
    points: 1840,
    weeklyPoints: 340,
    streakDays: 24,
    badgesCount: 15,
    topSubject: 'Quantum Electrodynamics',
    recentAchievement: 'Solved 12 consecutive multivariable Hamiltonian proofs',
    kudosCount: 42,
  },
  {
    id: 'lead-2',
    name: 'Ethan Brooks',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces',
    pod: 'explorer',
    gradeLevel: 'Explorer Hub (Grade 4)',
    points: 1690,
    weeklyPoints: 290,
    streakDays: 19,
    badgesCount: 12,
    topSubject: 'Solar Astrophysics & Mars Rovers',
    recentAchievement: 'Built interactive 3D model of Olympus Mons',
    kudosCount: 38,
  },
  {
    id: 'lead-3',
    name: 'Chloe & Leo Kim',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&h=120&fit=crop&crop=faces',
    pod: 'toddler',
    gradeLevel: 'Discovery Pod (Ages 3-5)',
    points: 1530,
    weeklyPoints: 260,
    streakDays: 18,
    badgesCount: 10,
    topSubject: 'Bilingual Phonics & Nursery Melodies',
    recentAchievement: 'Mastered all 26 uppercase & lowercase acoustic sounds',
    kudosCount: 51,
  },
  {
    id: 'lead-5',
    name: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces',
    pod: 'academy',
    gradeLevel: 'Academy Core (Grade 8)',
    points: 1390,
    weeklyPoints: 210,
    streakDays: 16,
    badgesCount: 11,
    topSubject: 'Three-Body Orbital Mechanics',
    recentAchievement: 'Derived Keplerian orbital velocity in Zero-G lab',
    kudosCount: 29,
  },
  {
    id: 'lead-6',
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
    pod: 'academy',
    gradeLevel: 'Academy Core (Grade 8)',
    points: 1310,
    weeklyPoints: 190,
    streakDays: 15,
    badgesCount: 9,
    topSubject: 'CRISPR Cas-9 Gene Editing',
    recentAchievement: 'Engineered synthetic base-pair codon sequence',
    kudosCount: 31,
  },
  {
    id: 'lead-7',
    name: 'Oliver Torres',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    pod: 'explorer',
    gradeLevel: 'Explorer Hub (Grade 3)',
    points: 1180,
    weeklyPoints: 175,
    streakDays: 12,
    badgesCount: 8,
    topSubject: 'Ocean Biomes & Coral Reefs',
    recentAchievement: 'Simulated ocean currents and thermocline depth charts',
    kudosCount: 23,
  },
  {
    id: 'lead-8',
    name: 'Emma Watson-Reid',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=faces',
    pod: 'explorer',
    gradeLevel: 'Explorer Hub (Grade 4)',
    points: 1040,
    weeklyPoints: 150,
    streakDays: 11,
    badgesCount: 7,
    topSubject: 'Creative Algorithmic Robotics',
    recentAchievement: 'Programmed autonomous maze routing algorithm',
    kudosCount: 26,
  },
  {
    id: 'lead-9',
    name: 'Noah Sterling',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces',
    pod: 'toddler',
    gradeLevel: 'Discovery Pod (Ages 1-3)',
    points: 960,
    weeklyPoints: 130,
    streakDays: 9,
    badgesCount: 6,
    topSubject: 'Color Spectrum Harmonies',
    recentAchievement: 'Classified 50 spectral pigment shades with zero misses',
    kudosCount: 34,
  },
  {
    id: 'lead-10',
    name: 'Zara Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
    pod: 'academy',
    gradeLevel: 'Academy Core (Grade 7)',
    points: 910,
    weeklyPoints: 120,
    streakDays: 8,
    badgesCount: 6,
    topSubject: 'Theoretical Particle Physics',
    recentAchievement: 'Submitted standard model quark mass comparison paper',
    kudosCount: 19,
  },
  {
    id: 'lead-11',
    name: 'Lucas Ramirez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    pod: 'explorer',
    gradeLevel: 'Explorer Hub (Grade 2)',
    points: 840,
    weeklyPoints: 110,
    streakDays: 7,
    badgesCount: 5,
    topSubject: 'Ancient Civilizations & Architecture',
    recentAchievement: 'Constructed Mesopotamian ziggurat geometric model',
    kudosCount: 17,
  },
  {
    id: 'lead-12',
    name: 'Harper Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop&crop=faces',
    pod: 'toddler',
    gradeLevel: 'Discovery Pod (Ages 3-5)',
    points: 780,
    weeklyPoints: 95,
    streakDays: 6,
    badgesCount: 4,
    topSubject: 'Early Animal Sound Exploration',
    recentAchievement: 'Identified 30 safari and farm animals by sound profile',
    kudosCount: 22,
  },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  userProfile,
  onAwardPoints,
  onToast,
  currentPod,
  onSelectPod,
}) => {
  // Pod Filter State
  const [selectedPodFilter, setSelectedPodFilter] = useState<'all' | GradePod>('all');
  // Metric Sorting State
  const [timeframe, setTimeframe] = useState<'all-time' | 'weekly' | 'streak'>('all-time');
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  // Student detail modal
  const [inspectUser, setInspectUser] = useState<LeaderboardUser | null>(null);
  // Kudos given tracking
  const [cheeredUserIds, setCheeredUserIds] = useState<Record<string, number>>({});
  // Claimed daily quest bonus state
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);

  // Synthesize dynamic list including current user
  const allUsersWithCurrentUser = useMemo(() => {
    const currentUserItem: Omit<LeaderboardUser, 'rank' | 'previousRank'> = {
      id: 'lead-user-self',
      name: `${userProfile.name} (You)`,
      avatar: userProfile.avatar,
      pod: userProfile.pod,
      gradeLevel: userProfile.gradeLevel,
      points: userProfile.points,
      weeklyPoints: 240, // Estimated weekly progress
      streakDays: userProfile.streakDays,
      badgesCount: userProfile.badges.filter((b) => b.earned).length,
      topSubject: 'Quantum Mechanics & Vector Calculus',
      recentAchievement: 'Completed 3D Atom Orbital Simulation and derivations',
      kudosCount: 47,
      isCurrentUser: true,
    };

    const combined = [...BASE_PEERS, currentUserItem];

    // Sort according to selected timeframe/metric
    combined.sort((a, b) => {
      if (timeframe === 'weekly') {
        return b.weeklyPoints - a.weeklyPoints;
      }
      if (timeframe === 'streak') {
        return b.streakDays - a.streakDays;
      }
      return b.points - a.points;
    });

    // Assign ranks
    return combined.map((item, index) => {
      // Synthetic previous rank for trend calculation
      let prevRank = index + 1;
      if (item.id === 'lead-1') prevRank = 2; // Gained 1 spot
      else if (item.id === 'lead-2') prevRank = 1; // Dropped 1 spot
      else if (item.isCurrentUser) prevRank = index + 2; // Jumped up
      else if (index % 2 === 0) prevRank = index + 2;
      else prevRank = Math.max(1, index);

      return {
        ...item,
        rank: index + 1,
        previousRank: prevRank,
        kudosCount: item.kudosCount + (cheeredUserIds[item.id] || 0),
      } as LeaderboardUser;
    });
  }, [userProfile, timeframe, cheeredUserIds]);

  // Filtered by selected Grade Pod & Search query
  const filteredUsers = useMemo(() => {
    return allUsersWithCurrentUser.filter((user) => {
      const matchesPod = selectedPodFilter === 'all' || user.pod === selectedPodFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.topSubject.toLowerCase().includes(query) ||
        user.gradeLevel.toLowerCase().includes(query);
      return matchesPod && matchesSearch;
    });
  }, [allUsersWithCurrentUser, selectedPodFilter, searchQuery]);

  // Find Current User's global rank & stats
  const currentUserStats = useMemo(() => {
    return allUsersWithCurrentUser.find((u) => u.isCurrentUser) || null;
  }, [allUsersWithCurrentUser]);

  // Compute point difference to next rank above user
  const pointsToNextRank = useMemo(() => {
    if (!currentUserStats) return 0;
    const currentRank = currentUserStats.rank;
    if (currentRank <= 1) return 0; // Already #1
    const userAbove = allUsersWithCurrentUser.find((u) => u.rank === currentRank - 1);
    if (!userAbove) return 0;
    return Math.max(0, userAbove.points - currentUserStats.points + 1);
  }, [currentUserStats, allUsersWithCurrentUser]);

  // Top 3 Podium for active filtered view
  const topThree = useMemo(() => {
    return filteredUsers.slice(0, 3);
  }, [filteredUsers]);

  // Ranks 4 and beyond
  const remainingRanks = useMemo(() => {
    return filteredUsers.slice(3);
  }, [filteredUsers]);

  // Cross-pod statistics
  const podStats = useMemo(() => {
    const toddlerPoints = allUsersWithCurrentUser
      .filter((u) => u.pod === 'toddler')
      .reduce((acc, u) => acc + u.points, 0);
    const explorerPoints = allUsersWithCurrentUser
      .filter((u) => u.pod === 'explorer')
      .reduce((acc, u) => acc + u.points, 0);
    const academyPoints = allUsersWithCurrentUser
      .filter((u) => u.pod === 'academy')
      .reduce((acc, u) => acc + u.points, 0);

    const totalXP = toddlerPoints + explorerPoints + academyPoints;
    return {
      toddler: toddlerPoints,
      explorer: explorerPoints,
      academy: academyPoints,
      totalXP,
    };
  }, [allUsersWithCurrentUser]);

  // Handler: Give Kudos/Cheer
  const handleCheerUser = (user: LeaderboardUser, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSound('success');
    setCheeredUserIds((prev) => ({
      ...prev,
      [user.id]: (prev[user.id] || 0) + 1,
    }));

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#f59e0b', '#ec4899', '#10b981'],
    });

    onToast(`Sent kudos & cheer to ${user.name.replace(' (You)', '')}!`, 'Scholastic Encouragement');
  };

  // Handler: Claim Daily Scholastic Bounty
  const handleClaimDailyBonus = () => {
    if (dailyBonusClaimed) return;
    sound.playSound('pod_switch');
    setDailyBonusClaimed(true);
    const bonusXP = 75;
    onAwardPoints(bonusXP, 'Daily Scholastic Honor Bounty');
    onToast(`+${bonusXP} XP claimed! Your rank is updating.`, 'Daily Bounty Claimed');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#6366f1', '#3b82f6'],
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* --------------------------------------------------------------------- */}
      {/* Top Banner & Header Information                                       */}
      {/* --------------------------------------------------------------------- */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Trophy size={16} className="text-amber-400" />
              <span>Gitas Academy Global Honor Roll</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Scholastic Leaderboard & Pod Rankings
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Real-time academic standing across all three grade pods. Complete 3D spatial simulations,
              submit problem sets, and maintain study streaks to advance your rank.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Your Global Standing</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-black text-amber-400">#{currentUserStats?.rank || 4}</span>
                <span className="text-xs text-slate-400">of {allUsersWithCurrentUser.length}</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Earned XP</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-black text-indigo-400">{userProfile.points.toLocaleString()}</span>
                <span className="text-xs text-indigo-300/80">XP</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl col-span-2 sm:col-span-1 flex flex-col">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Streak</span>
              <div className="flex items-center space-x-1.5 mt-1">
                <Flame size={20} className="text-orange-500 fill-orange-500/20" />
                <span className="text-2xl font-black text-orange-400">{userProfile.streakDays}</span>
                <span className="text-xs text-slate-400">Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Personal Advancement Highlight */}
        {currentUserStats && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40 -mx-6 -mb-6 p-6 rounded-b-3xl">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Rank #{currentUserStats.rank}: {userProfile.name}</span>
                  <span className="text-[10px] text-indigo-300 font-normal">
                    · {userProfile.gradeLevel}
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {pointsToNextRank > 0 ? (
                    <>
                      Need <span className="font-bold text-amber-400">{pointsToNextRank} XP</span> to overtake{' '}
                      <span className="text-slate-100 font-semibold">
                        Rank #{currentUserStats.rank - 1}
                      </span>{' '}
                      on the global board!
                    </>
                  ) : (
                    <span className="text-emerald-400 font-semibold">
                      🏆 Outstanding! You are currently leading the global scholastic ranks!
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleClaimDailyBonus}
              disabled={dailyBonusClaimed}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 flex items-center justify-center space-x-2 shadow-lg ${
                dailyBonusClaimed
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Zap size={14} className={dailyBonusClaimed ? 'text-slate-500' : 'fill-slate-950'} />
              <span>{dailyBonusClaimed ? 'Daily Bounty Claimed (+75 XP)' : 'Claim Daily Bounty (+75 XP)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Filters & Search Controls                                             */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Grade Pod Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              sound.playSound('click');
              setSelectedPodFilter('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-200 ${
              selectedPodFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            All Grade Pods ({allUsersWithCurrentUser.length})
          </button>

          <button
            onClick={() => {
              sound.playSound('click');
              setSelectedPodFilter('academy');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-200 ${
              selectedPodFilter === 'academy'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Academy Core (Ages 10-15)
          </button>

          <button
            onClick={() => {
              sound.playSound('click');
              setSelectedPodFilter('explorer');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-200 ${
              selectedPodFilter === 'explorer'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Explorer Hub (Ages 6-9)
          </button>

          <button
            onClick={() => {
              sound.playSound('click');
              setSelectedPodFilter('toddler');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-200 ${
              selectedPodFilter === 'toddler'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Discovery Pod (Ages 1-5)
          </button>
        </div>

        {/* Right side: Timeframe toggle + Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playSound('click');
                setTimeframe('all-time');
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeframe === 'all-time'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => {
                sound.playSound('click');
                setTimeframe('weekly');
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeframe === 'weekly'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly Sprint
            </button>
            <button
              onClick={() => {
                sound.playSound('click');
                setTimeframe('streak');
              }}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeframe === 'streak'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Streak
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search student or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Top 3 Podium for Current Filter                                       */}
      {/* --------------------------------------------------------------------- */}
      {topThree.length >= 3 && !searchQuery && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Medal size={14} className="text-amber-400" />
              <span>Podium Top Performers · {selectedPodFilter === 'all' ? 'Cross-Pod Master' : selectedPodFilter.toUpperCase()}</span>
            </h2>
            <span className="text-[11px] text-slate-400">Updated in real-time</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Rank 2 - Silver (Left on desktop) */}
            <div
              onClick={() => setInspectUser(topThree[1])}
              className="order-2 md:order-1 glass-panel p-5 rounded-3xl border border-slate-700/60 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-800/40 relative cursor-pointer hover:border-slate-500 transition duration-300 group shadow-lg"
            >
              <div className="absolute top-3 right-3 text-slate-400 font-mono text-xs font-bold">
                RANK #2
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-slate-400/40 shadow-xl group-hover:scale-105 transition duration-300">
                    <img
                      src={topThree[1].avatar}
                      alt={topThree[1].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-xl bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                    2
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                  {topThree[1].name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{topThree[1].gradeLevel}</p>
                <p className="text-[11px] text-indigo-400 font-medium truncate max-w-[200px] mt-1">
                  {topThree[1].topSubject}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 font-semibold">
                    <Flame size={13} className="text-orange-500" />
                    {topThree[1].streakDays}d Streak
                  </span>
                  <span className="font-black text-slate-200">
                    {timeframe === 'weekly'
                      ? `+${topThree[1].weeklyPoints} XP`
                      : `${topThree[1].points.toLocaleString()} XP`}
                  </span>
                </div>

                <button
                  onClick={(e) => handleCheerUser(topThree[1], e)}
                  className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <Heart size={13} className="text-rose-400" />
                  <span>Cheer ({topThree[1].kudosCount})</span>
                </button>
              </div>
            </div>

            {/* Rank 1 - Gold (Center, Elevated) */}
            <div
              onClick={() => setInspectUser(topThree[0])}
              className="order-1 md:order-2 glass-panel p-6 rounded-3xl border-2 border-amber-500/70 bg-gradient-to-t from-slate-900 via-amber-950/20 to-slate-900 relative cursor-pointer hover:border-amber-400 transition duration-300 group shadow-2xl shadow-amber-500/10 md:-translate-y-2"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Crown size={12} className="fill-slate-950" />
                <span>Global Scholar #1</span>
              </div>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-amber-400 shadow-2xl group-hover:scale-105 transition duration-300">
                    <img
                      src={topThree[0].avatar}
                      alt={topThree[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                    1
                  </div>
                </div>

                <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition">
                  {topThree[0].name}
                </h3>
                <p className="text-xs text-amber-200/80 mt-0.5">{topThree[0].gradeLevel}</p>
                <p className="text-xs text-indigo-300 font-semibold truncate max-w-[220px] mt-1">
                  {topThree[0].topSubject}
                </p>

                <div className="mt-4 pt-3 border-t border-amber-500/20 w-full flex items-center justify-between text-xs">
                  <span className="text-amber-200/80 flex items-center gap-1 font-semibold">
                    <Flame size={14} className="text-orange-500 fill-orange-500/30" />
                    {topThree[0].streakDays}d Streak
                  </span>
                  <span className="font-black text-amber-300 text-sm">
                    {timeframe === 'weekly'
                      ? `+${topThree[0].weeklyPoints} XP`
                      : `${topThree[0].points.toLocaleString()} XP`}
                  </span>
                </div>

                <button
                  onClick={(e) => handleCheerUser(topThree[0], e)}
                  className="mt-3.5 w-full py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm"
                >
                  <Heart size={14} className="text-amber-400 fill-amber-400/20" />
                  <span>Send Kudos ({topThree[0].kudosCount})</span>
                </button>
              </div>
            </div>

            {/* Rank 3 - Bronze (Right on desktop) */}
            <div
              onClick={() => setInspectUser(topThree[2])}
              className="order-3 glass-panel p-5 rounded-3xl border border-amber-800/50 bg-gradient-to-t from-slate-900 via-slate-900/90 to-amber-950/10 relative cursor-pointer hover:border-amber-700 transition duration-300 group shadow-lg"
            >
              <div className="absolute top-3 right-3 text-amber-600 font-mono text-xs font-bold">
                RANK #3
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-amber-700/50 shadow-xl group-hover:scale-105 transition duration-300">
                    <img
                      src={topThree[2].avatar}
                      alt={topThree[2].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-xl bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-md">
                    3
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                  {topThree[2].name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{topThree[2].gradeLevel}</p>
                <p className="text-[11px] text-indigo-400 font-medium truncate max-w-[200px] mt-1">
                  {topThree[2].topSubject}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 font-semibold">
                    <Flame size={13} className="text-orange-500" />
                    {topThree[2].streakDays}d Streak
                  </span>
                  <span className="font-black text-slate-200">
                    {timeframe === 'weekly'
                      ? `+${topThree[2].weeklyPoints} XP`
                      : `${topThree[2].points.toLocaleString()} XP`}
                  </span>
                </div>

                <button
                  onClick={(e) => handleCheerUser(topThree[2], e)}
                  className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <Heart size={13} className="text-rose-400" />
                  <span>Cheer ({topThree[2].kudosCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* Complete Rankings Table                                               */}
      {/* --------------------------------------------------------------------- */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award size={16} className="text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Complete Scholastic Standings ({filteredUsers.length} Students)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Click any student to view dossier</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Search size={32} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No students found matching your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting your pod filter or search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/50">
                  <th className="py-3.5 pl-5 pr-2 w-16">Rank</th>
                  <th className="py-3.5 px-3">Student & Grade Pod</th>
                  <th className="py-3.5 px-3 hidden md:table-cell">Specialty Subject</th>
                  <th className="py-3.5 px-3 hidden sm:table-cell text-center">Streak</th>
                  <th className="py-3.5 px-3 hidden lg:table-cell text-center">Badges</th>
                  <th className="py-3.5 px-3 text-right">
                    {timeframe === 'weekly' ? 'Weekly XP' : timeframe === 'streak' ? 'Streak' : 'Total XP'}
                  </th>
                  <th className="py-3.5 pl-3 pr-5 text-right w-24">Cheer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredUsers.map((user) => {
                  const isTop3 = user.rank <= 3;
                  const rankDelta = user.previousRank - user.rank;

                  return (
                    <tr
                      key={user.id}
                      onClick={() => setInspectUser(user)}
                      className={`cursor-pointer transition duration-150 hover:bg-slate-800/50 ${
                        user.isCurrentUser
                          ? 'bg-indigo-950/30 border-l-4 border-indigo-500'
                          : ''
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 pl-5 pr-2 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`font-black text-sm ${
                              user.rank === 1
                                ? 'text-amber-400'
                                : user.rank === 2
                                ? 'text-slate-300'
                                : user.rank === 3
                                ? 'text-amber-600'
                                : 'text-slate-400'
                            }`}
                          >
                            #{user.rank}
                          </span>
                          {/* Rank trend indicator */}
                          {rankDelta > 0 ? (
                            <span className="text-[10px] text-emerald-400 flex items-center font-bold" title={`Gained ${rankDelta} spots`}>
                              <TrendingUp size={11} />
                            </span>
                          ) : rankDelta < 0 ? (
                            <span className="text-[10px] text-rose-400 flex items-center font-bold" title={`Dropped ${Math.abs(rankDelta)} spots`}>
                              <TrendingDown size={11} />
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              <Minus size={10} />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className={`w-9 h-9 rounded-xl object-cover ${
                                user.isCurrentUser
                                  ? 'ring-2 ring-indigo-500'
                                  : isTop3
                                  ? 'ring-1 ring-amber-400/50'
                                  : 'ring-1 ring-slate-700'
                              }`}
                            />
                            {user.isCurrentUser && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`font-bold ${user.isCurrentUser ? 'text-indigo-300' : 'text-white'}`}>
                                {user.name}
                              </span>
                              {user.isCurrentUser && (
                                <span className="text-[9px] bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-1.5 py-0.2 rounded font-black">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                              <span>
                                {user.pod === 'toddler'
                                  ? 'Discovery Pod (1-5)'
                                  : user.pod === 'explorer'
                                  ? 'Explorer Hub (6-9)'
                                  : 'Academy Core (10-15)'}
                              </span>
                              <span>·</span>
                              <span className="text-slate-400">{user.gradeLevel.split('(')[1]?.replace(')', '') || user.gradeLevel}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialty Subject */}
                      <td className="py-3.5 px-3 hidden md:table-cell">
                        <span className="text-slate-300 font-medium block truncate max-w-[200px]">
                          {user.topSubject}
                        </span>
                      </td>

                      {/* Streak Days */}
                      <td className="py-3.5 px-3 hidden sm:table-cell text-center">
                        <span className="inline-flex items-center space-x-1 font-semibold text-slate-300">
                          <Flame size={13} className="text-orange-500" />
                          <span>{user.streakDays}d</span>
                        </span>
                      </td>

                      {/* Badges Count */}
                      <td className="py-3.5 px-3 hidden lg:table-cell text-center">
                        <span className="inline-flex items-center space-x-1 font-semibold text-slate-300">
                          <Award size={13} className="text-indigo-400" />
                          <span>{user.badgesCount}</span>
                        </span>
                      </td>

                      {/* XP Points */}
                      <td className="py-3.5 px-3 text-right">
                        <span className="font-extrabold text-white text-sm">
                          {timeframe === 'weekly'
                            ? `+${user.weeklyPoints.toLocaleString()} XP`
                            : timeframe === 'streak'
                            ? `${user.streakDays} Days`
                            : `${user.points.toLocaleString()} XP`}
                        </span>
                      </td>

                      {/* Cheer / Kudos Button */}
                      <td className="py-3.5 pl-3 pr-5 text-right">
                        <button
                          onClick={(e) => handleCheerUser(user, e)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1 text-[11px] ml-auto"
                          title="Give Kudos"
                        >
                          <Heart size={11} className="text-rose-400" />
                          <span>{user.kudosCount}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Cross-Pod Cumulative XP Breakdown                                     */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Academy Core Card */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider text-indigo-400">Academy Core (10-15)</span>
              <BookOpen size={14} className="text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">{podStats.academy.toLocaleString()} XP</div>
            <p className="text-xs text-slate-400 mt-1">Leading in Multivariable Calculus, Quantum Labs & Biotech</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>5 Active Scholars</span>
            <button
              onClick={() => onSelectPod('academy')}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
            >
              Enter Pod <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Explorer Hub Card */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider text-amber-400">Explorer Hub (6-9)</span>
              <Sparkles size={14} className="text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">{podStats.explorer.toLocaleString()} XP</div>
            <p className="text-xs text-slate-400 mt-1">Specializing in Space Astronomy, Coding & Marine Habitats</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>4 Active Scholars</span>
            <button
              onClick={() => onSelectPod('explorer')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5"
            >
              Enter Pod <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Discovery Pod Card */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider text-pink-400">Discovery Pod (1-5)</span>
              <Award size={14} className="text-pink-400" />
            </div>
            <div className="text-xl font-black text-white">{podStats.toddler.toLocaleString()} XP</div>
            <p className="text-xs text-slate-400 mt-1">Excelling in Phonetic Sounds, Rhymes & Color Matching</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>3 Active Young Explorers</span>
            <button
              onClick={() => onSelectPod('toddler')}
              className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-0.5"
            >
              Enter Pod <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Student Dossier Modal / Drawer                                        */}
      {/* --------------------------------------------------------------------- */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setInspectUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              <X size={18} />
            </button>

            {/* Student Header */}
            <div className="flex items-center space-x-4">
              <img
                src={inspectUser.avatar}
                alt={inspectUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">{inspectUser.name}</h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                    Rank #{inspectUser.rank}
                  </span>
                </div>
                <p className="text-xs text-indigo-400 mt-0.5">{inspectUser.gradeLevel}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pod:{' '}
                  {inspectUser.pod === 'toddler'
                    ? 'Discovery Pod (Ages 1-5)'
                    : inspectUser.pod === 'explorer'
                    ? 'Explorer Hub (Ages 6-9)'
                    : 'Academy Core (Ages 10-15)'}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
                <p className="text-lg font-black text-indigo-400 mt-1">{inspectUser.points.toLocaleString()}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Streak</span>
                <p className="text-lg font-black text-orange-400 mt-1 flex items-center justify-center gap-1">
                  <Flame size={15} />
                  {inspectUser.streakDays}d
                </p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Badges</span>
                <p className="text-lg font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
                  <Award size={15} />
                  {inspectUser.badgesCount}
                </p>
              </div>
            </div>

            {/* Scholastic Achievements & Focus */}
            <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Primary Domain of Mastery</span>
                <p className="text-xs font-semibold text-white mt-1">{inspectUser.topSubject}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Latest Completed Milestone</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{inspectUser.recentAchievement}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={(e) => {
                  handleCheerUser(inspectUser, e);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/30"
              >
                <Heart size={14} className="text-rose-300 fill-rose-300/40" />
                <span>Cheer {inspectUser.name.split(' ')[0]} ({inspectUser.kudosCount})</span>
              </button>

              <button
                onClick={() => setInspectUser(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
