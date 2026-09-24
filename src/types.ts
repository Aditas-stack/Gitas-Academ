export type UserRole = 'student' | 'tutor';

export type SubscriptionPlan = 'trial' | 'starter' | 'scholar' | 'genius';

export type GradePod = 'toddler' | 'explorer' | 'academy';

export type NavTab =
  | 'classroom'
  | 'curriculum'
  | 'lms'
  | 'toddlersafe'
  | 'leaderboard'
  | 'pricing'
  | 'tutor_studio'
  | 'tutor_lessons'
  | 'tutor_grading'
  | 'tutor_students'
  | 'tutor_analytics';

export type SimulationMode = 'atom' | 'dna' | 'calculus' | 'gravity';

export interface LessonVideo {
  id: string;
  title: string;
  url: string;
  durationMinutes: number;
  description?: string;
  thumbnailUrl?: string;
  topicMarkers?: Array<{ time: string; title: string }>;
}

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  avatar: string;
  pod: GradePod;
  gradeLevel: string;
  points: number;
  weeklyPoints: number;
  streakDays: number;
  badgesCount: number;
  topSubject: string;
  recentAchievement: string;
  kudosCount: number;
  isCurrentUser?: boolean;
}

export interface Peer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Host' | 'Active' | 'Speaking' | 'Muted';
  handRaised?: boolean;
  gradePod?: GradePod;
  cameraOn?: boolean;
  audioOn?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole?: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isTeacher?: boolean;
  isSystem?: boolean;
  isPinned?: boolean;
  isQuestion?: boolean;
  reactions?: Record<string, number>;
  tutorReply?: string;
}

export interface BackgroundTheme {
  id: string;
  name: string;
  hex: string;
  secondaryHex: string;
  ambientGlow: string;
  borderAccent: string;
  isDark: boolean;
}

export interface NurserySong {
  id: string;
  title: string;
  duration: string;
  bpm: number;
  notes: Array<{ note: string; duration: number }>;
  lyrics: string[];
  themeColor: string;
  iconEmoji?: string;
  youtubeUrl?: string;
  characterAnim?: string;
  description?: string;
}

export interface CurriculumItem {
  id: string;
  title: string;
  category: 'stem' | 'humanities' | 'language' | 'toddler' | 'arts' | 'robotics';
  grade: string;
  pod: GradePod;
  desc: string;
  icon: string;
  color: 'indigo' | 'pink' | 'emerald' | 'purple' | 'amber' | 'blue' | 'rose' | 'teal';
  modulesCount: number;
  durationMinutes: number;
  completed?: boolean;
  rating: number;
  // Tutor Lesson Extensions
  isTutorCreated?: boolean;
  tutorName?: string;
  tutorAvatar?: string;
  status?: 'published' | 'draft';
  createdAt?: string;
  video?: LessonVideo;
  videos?: LessonVideo[];
  objectives?: string[];
  interactiveType?: 'calculus' | 'quantum' | 'ecosystem' | 'literature' | 'video_reflection';
  customQuizzes?: QuizQuestion[];
  resources?: Array<{ name: string; type: string; size?: string }>;
  viewsCount?: number;
  studentsCompletedCount?: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Submitted' | 'Pending' | 'In Progress';
  score?: string;
  maxScore?: number;
  description: string;
  feedback?: string;
  submittedFile?: string;
  submittedDate?: string;
  studentName?: string;
  studentAvatar?: string;
  gradePod?: GradePod;
  rubricCriteria?: Array<{ name: string; maxPts: number; awardedPts: number }>;
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  emailVerified?: boolean;
  verificationCode?: string;
  isFakeDemo?: boolean;
  avatar: string;
  role: UserRole;
  pod: GradePod;
  gradeLevel: string;
  bio?: string;
  academicInterests?: string[];
  points: number;
  streakDays: number;
  planTier?: SubscriptionPlan;
  planRenewalDate?: string;
  badges: Array<{
    id: string;
    title: string;
    icon: string;
    earned: boolean;
    date?: string;
  }>;
  tutorTitle?: string;
  department?: string;
  publishedLessonsCount?: number;
  gmailNotificationsEnabled?: boolean;
}

export interface GmailNotification {
  id: string;
  sender: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  snippet: string;
  body: string;
  timestamp: string;
  date: string;
  category: 'verification' | 'grades' | 'classes' | 'system' | 'billing';
  unread: boolean;
  starred: boolean;
  actionLabel?: string;
  actionType?: 'verify_email' | 'open_classroom' | 'open_lms' | 'open_pricing';
  verificationCode?: string;
}

export interface ToddlerLetter {
  letter: string;
  word: string;
  emoji: string;
  phonetic: string;
  color: string;
}
