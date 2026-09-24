import React, { useState, useCallback, useRef } from 'react';
import {
  GradePod,
  NavTab,
  Peer,
  CurriculumItem,
  Assignment,
  UserProfile,
  UserRole
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Classroom3D } from './components/Classroom3D';
import { CurriculumHub } from './components/CurriculumHub';
import { LMSLocker } from './components/LMSLocker';
import { ToddlerPod } from './components/ToddlerPod';
import { Leaderboard } from './components/Leaderboard';
import { InteractiveModuleModal } from './components/InteractiveModuleModal';
import { NotificationModal, NotificationItem } from './components/NotificationModal';
import { ProfileModal } from './components/ProfileModal';
import { TutorLessonCreator } from './components/TutorLessonCreator';
import { TutorLessonsManager } from './components/TutorLessonsManager';
import { TutorGradingDesk } from './components/TutorGradingDesk';
import { TutorStudentsRoster } from './components/TutorStudentsRoster';
import { TutorAnalyticsDashboard } from './components/TutorAnalyticsDashboard';
import { AuthModal } from './components/AuthModal';
import { StudentPricingModal } from './components/StudentPricingModal';
import { StudentOnboardingModal } from './components/StudentOnboardingModal';
import { EmailVerificationModal } from './components/EmailVerificationModal';
import { GmailNotificationCenterModal } from './components/GmailNotificationCenterModal';
import { SubscriptionPlan, GmailNotification } from './types';
import { sound } from './utils/audio';
import { Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Active Persona / Role: 'student' | 'tutor'
  const [userRole, setUserRole] = useState<UserRole>('student');

  // Navigation & Grade Pod States
  const [currentPod, setCurrentPod] = useState<GradePod>('academy');
  const [currentTab, setCurrentTab] = useState<NavTab>('classroom');

  // Active module preview or execution
  const [activeModuleItem, setActiveModuleItem] = useState<CurriculumItem | null>(null);

  // Lesson being edited in Tutor Studio
  const [editingLesson, setEditingLesson] = useState<CurriculumItem | null>(null);

  // Notifications Modal
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Calculus Problem Set #4 Graded',
      description: 'Dr. Aris Thorne evaluated your derivation proofs: 98/100 A+',
      timestamp: '10 mins ago',
      type: 'grade',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'New Video Lecture Available',
      description: 'Dr. Thorne published "Quantum Wavepackets & Atomic Superposition" with 3D simulation.',
      timestamp: '25 mins ago',
      type: 'class',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Honor Roll Recognition',
      description: 'You earned the "Quantum Pioneer" academic achievement badge!',
      timestamp: '1 hour ago',
      type: 'system',
      unread: false,
    },
  ]);

  // Profile Modal
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  // Auth Gateway Modal (Differentiated Student vs Faculty Login Interface)
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Student Pricing & Subscription Modal
  const [pricingModalOpen, setPricingModalOpen] = useState<boolean>(false);

  // Student Onboarding Modal Wizard
  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);

  // Student Email Verification Modal
  const [verificationModalOpen, setVerificationOpen] = useState<boolean>(false);

  // Gmail Notification Center Hub Modal
  const [gmailCenterModalOpen, setGmailCenterModalOpen] = useState<boolean>(false);

  // Profiles for Student and Tutor
  const [studentProfile, setStudentProfile] = useState<UserProfile>({
    name: 'Alex Morgan',
    email: 'alex.morgan@gitas.edu',
    emailVerified: false,
    verificationCode: '748291',
    isFakeDemo: true,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    pod: 'academy',
    gradeLevel: 'Academy Core (Grade 8)',
    points: 1420,
    streakDays: 14,
    planTier: 'scholar',
    planRenewalDate: 'Renews Nov 1, 2026',
    gmailNotificationsEnabled: true,
    badges: [
      { id: 'b-1', title: 'Quantum Pioneer', icon: 'atom', earned: true, date: 'Oct 2026' },
      { id: 'b-2', title: 'Calculus Whiz', icon: 'binary', earned: true, date: 'Sep 2026' },
      { id: 'b-3', title: 'ABC Phonics Master', icon: 'shapes', earned: true, date: 'Sep 2026' },
      { id: 'b-4', title: "Dean's Honor Roll", icon: 'award', earned: true, date: 'Oct 2026' },
      { id: 'b-5', title: 'Cosmic Voyager', icon: 'globe', earned: false },
    ],
  });

  // Gmail Notifications Hub State
  const [gmailNotifications, setGmailNotifications] = useState<GmailNotification[]>([
    {
      id: 'gm-1',
      sender: 'Office of Academic Admissions',
      senderEmail: 'admissions@gitas-academy.edu',
      recipientEmail: 'alex.morgan@gitas.edu',
      subject: '[Verification Code: 748291] Welcome to Gitas Academy - Verify Student Email',
      snippet: 'Welcome to Gitas 3D Virtual Academy! Please verify your official student credentials using code 748291...',
      body: `Dear Alex Morgan,\n\nWelcome to Gitas Academy! Your campus identity has been created with access to our 3D spatial simulation labs, interactive masterclasses, and quantum physics curriculum.\n\nTo unlock your complete academic transcript, grading desk, and honor roll recognition, please verify your email.\n\nYour 6-digit confirmation code is:\n748291\n\nEnter this code in the app or click the verification button below.\n\nWarm regards,\nOffice of Academic Admissions\nGitas Virtual Academy`,
      timestamp: 'Just now',
      date: 'Sep 23, 2026',
      category: 'verification',
      unread: true,
      starred: true,
      actionLabel: 'Verify Student Email Now',
      actionType: 'verify_email',
      verificationCode: '748291',
    },
    {
      id: 'gm-2',
      sender: 'Dr. Aris Thorne (Lead STEM Faculty)',
      senderEmail: 'dr.thorne@faculty.gitas.edu',
      recipientEmail: 'alex.morgan@gitas.edu',
      subject: '[Grades Posted] Problem Set #4: Calculus Derivation Proofs - Score: 98/100 A+',
      snippet: 'Dr. Thorne has finalized evaluations for your calculus problem set with extensive feedback.',
      body: `Hello Alex Morgan,\n\nYour submission for Calculus Problem Set #4 (Multivariable Derivation Proofs) has been reviewed.\n\nScore: 98 / 100 (Grade: A+)\nFeedback: "Outstanding rigor on the integration-by-parts proof for the damped quantum harmonic oscillator. Keep up the high caliber work!"\n\nYou have also received +75 Academic XP toward your honor roll ranking.\n\nSincerely,\nDr. Aris Thorne\nLead STEM & Spatial Physics Faculty`,
      timestamp: '25 mins ago',
      date: 'Sep 23, 2026',
      category: 'grades',
      unread: true,
      starred: false,
      actionLabel: 'View Graded Problem Set',
      actionType: 'open_lms',
    },
    {
      id: 'gm-3',
      sender: 'Gitas Live Masterclass Desk',
      senderEmail: 'lectures@gitas-academy.edu',
      recipientEmail: 'alex.morgan@gitas.edu',
      subject: '[Upcoming Lecture] 3D Spatial Quantum Wavepackets with Dr. Thorne at 10:00 AM',
      snippet: 'Live classroom session begins soon. Spatial simulation tools will be active.',
      body: `Dear Alex Morgan,\n\nA live 3D spatial masterclass is scheduled to begin in your virtual classroom.\n\nTopic: Quantum Wavepackets & Atomic Superposition\nInstructor: Dr. Aris Thorne\nPlatform: 3D Spatial Virtual Classroom\n\nPlease enter the virtual classroom desk to take your front-row seat.\n\nAcademic Operations\nGitas Academy`,
      timestamp: '1 hour ago',
      date: 'Sep 23, 2026',
      category: 'classes',
      unread: false,
      starred: false,
      actionLabel: 'Join 3D Spatial Classroom',
      actionType: 'open_classroom',
    },
  ]);

  const [tutorProfile, setTutorProfile] = useState<UserProfile>({
    name: 'Dr. Aris Thorne',
    email: 'dr.thorne@faculty.gitas.edu',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
    pod: 'academy',
    gradeLevel: 'Lead STEM & Spatial Physics Faculty',
    tutorTitle: 'Professor of Theoretical Physics & Interactive Pedagogy',
    department: 'Department of STEM & Quantum Physics',
    points: 4890,
    streakDays: 62,
    badges: [
      { id: 'tb-1', title: 'Senior Faculty Lead', icon: 'award', earned: true, date: '2024 - Present' },
      { id: 'tb-2', title: 'Masterclass Video Director', icon: 'atom', earned: true, date: '2025' },
      { id: 'tb-3', title: '3D Spatial Curriculum Pioneer', icon: 'binary', earned: true, date: '2026' },
    ],
  });

  const activeProfile = userRole === 'tutor' ? tutorProfile : studentProfile;

  // Peer Roster
  const [peers, setPeers] = useState<Peer[]>([
    {
      id: 'p-1',
      name: 'Dr. Aris Thorne',
      role: 'Instructor (Host)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      status: 'Host',
      cameraOn: true,
      audioOn: true,
    },
    {
      id: 'p-2',
      name: 'Liam Vance',
      role: 'Student (Grade 8)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: true,
      audioOn: true,
    },
    {
      id: 'p-3',
      name: 'Sophia Chen',
      role: 'Student (Grade 8)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: true,
      audioOn: true,
    },
    {
      id: 'p-4',
      name: 'Marcus Brody',
      role: 'Student (Grade 7)',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: true,
      audioOn: false,
    },
    {
      id: 'p-5',
      name: 'Elena Rostova',
      role: 'Student (Grade 8)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: false,
      audioOn: false,
    },
  ]);

  // Curriculum Data with Pre-Populated Tutor Lessons & Videos
  const [curriculumList, setCurriculumList] = useState<CurriculumItem[]>([
    {
      id: 'c-tutor-1',
      title: 'Quantum Wavepackets & Atomic Superposition',
      category: 'stem',
      grade: 'Grades 10-15',
      pod: 'academy',
      desc: 'Masterclass video lecture and real-time Bohr model orbital excitation simulation. Analyze discrete photon emission spectra and Planck-Einstein derivations.',
      icon: 'atom',
      color: 'purple',
      modulesCount: 5,
      durationMinutes: 40,
      completed: true,
      rating: 5.0,
      isTutorCreated: true,
      tutorName: 'Dr. Aris Thorne',
      tutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      status: 'published',
      createdAt: 'Oct 2026',
      video: {
        id: 'v-101',
        title: 'Quantum Mechanics: Wavepackets & Orbitals Masterclass',
        url: 'https://www.youtube.com/watch?v=accyUD282-M',
        durationMinutes: 35,
        description: 'Comprehensive instructional breakdown of electron probability density distributions and Bohr orbital transitions.',
        topicMarkers: [
          { time: '00:00', title: 'Classical Physics Breakdown & Blackbody Spectrum' },
          { time: '08:20', title: 'Bohr Hydrogen Orbital Jumps (n=1 to n=4)' },
          { time: '21:10', title: 'Planck Relation E = h*nu & Photon Frequencies' },
          { time: '30:00', title: 'Interactive 3D Lab Walkthrough' },
        ],
      },
      interactiveType: 'quantum',
      objectives: [
        'Derive the Planck-Einstein relation E = h·ν for orbital transitions.',
        'Calculate discrete emission spectrum wavelengths for Balmer and Lyman series.',
        'Simulate Bohr atom energy jumps n=1..4 in real-time spatial simulation.',
      ],
      customQuizzes: [
        {
          id: 'q-t1',
          q: 'When an electron drops from energy level n=3 to n=1, what occurs?',
          options: [
            'Photon emission with discrete wavelength',
            'Total destruction of atomic nucleus',
            'Permanent orbital collapse to center',
            'Zero energetic exchange',
          ],
          correct: 0,
          explanation: 'Conservation of energy dictates that the excess energy difference ΔE is released as a photon (E = h·ν).',
        },
        {
          id: 'q-t2',
          q: 'Why are orbitals modeled as wavepackets instead of simple circular tracks?',
          options: [
            'Heisenberg uncertainty & de Broglie matter waves give spatial probability clouds',
            'Only because circular tracks are too easy to calculate',
            'Electrons are identical to microscopic billiard balls',
            'It is purely an aesthetic choice with no physical meaning',
          ],
          correct: 0,
          explanation: 'Quantum wave-particle duality dictates that electrons exist in probabilistic orbital wavefunctions.',
        },
      ],
      resources: [
        { name: 'Quantum_Mechanics_Lecture_Slides.pdf', type: 'PDF Document', size: '3.1 MB' },
        { name: 'Hydrogen_Emission_Wavelengths_Chart.pdf', type: 'Formula Sheet', size: '1.2 MB' },
      ],
      viewsCount: 218,
      studentsCompletedCount: 42,
    },
    {
      id: 'c-tutor-2',
      title: 'Multivariable Calculus: 3D Gradients & Tangent Planes',
      category: 'stem',
      grade: 'Grades 10-15',
      pod: 'academy',
      desc: 'High-definition video lecture on 3D multivariable surfaces, partial derivatives, and dynamic tangent vectors with interactive curve plotter.',
      icon: 'binary',
      color: 'indigo',
      modulesCount: 6,
      durationMinutes: 45,
      completed: true,
      rating: 4.9,
      isTutorCreated: true,
      tutorName: 'Dr. Aris Thorne',
      tutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      status: 'published',
      createdAt: 'Oct 2026',
      video: {
        id: 'v-102',
        title: 'Visualizing Multivariable Calculus & Gradient Vectors',
        url: 'https://www.youtube.com/watch?v=pHMzNW8Agq4',
        durationMinutes: 30,
        description: 'Intuitive geometric demonstration of directional derivatives, tangent planes, and vector gradient fields.',
        topicMarkers: [
          { time: '00:00', title: 'From 2D Derivatives to 3D Surfaces' },
          { time: '07:45', title: 'Constructing Tangent Planes via Partial Derivatives' },
          { time: '19:30', title: 'Gradient Vector Normalcy to Level Curves' },
        ],
      },
      interactiveType: 'calculus',
      objectives: [
        'Compute partial derivatives ∂f/∂x and ∂f/∂y for parabolic surfaces.',
        'Visualize normal vector gradient perpendicular to level curves.',
        'Locate critical points and extrema using the Hessian determinant test.',
      ],
      customQuizzes: [
        {
          id: 'q-c1',
          q: "Given surface f(x, y) = a*x^2 + b*y^2, what is the gradient vector ∇f?",
          options: [
            '[2ax, 2by]',
            '[ax, by]',
            '[2a + 2b, 0]',
            '[x^2, y^2]',
          ],
          correct: 0,
          explanation: 'The gradient ∇f consists of the vector of partial derivatives: [∂f/∂x, ∂f/∂y] = [2ax, 2by].',
        },
      ],
      resources: [
        { name: 'Multivariable_Calculus_Proofs.pdf', type: 'PDF Document', size: '2.8 MB' },
      ],
      viewsCount: 184,
      studentsCompletedCount: 38,
    },
    {
      id: 'c-tutor-3',
      title: 'Ancient Rome: Concrete Arches & Pantheon Oculus',
      category: 'humanities',
      grade: 'Grades 6-9',
      pod: 'explorer',
      desc: 'Explore Roman pozzolanic volcanic concrete, structural arch load distribution, and the architectural wonder of the Pantheon.',
      icon: 'globe',
      color: 'amber',
      modulesCount: 4,
      durationMinutes: 35,
      completed: false,
      rating: 4.8,
      isTutorCreated: true,
      tutorName: 'Dr. Aris Thorne',
      tutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      status: 'published',
      createdAt: 'Oct 2026',
      video: {
        id: 'v-103',
        title: 'Roman Engineering: Secrets of the Pantheon Dome',
        url: 'https://www.youtube.com/watch?v=nO3_x_GZJmE',
        durationMinutes: 25,
        description: 'Architectural analysis of Roman volcanic ash concrete, relieving arches, and the world’s largest unreinforced concrete dome.',
      },
      interactiveType: 'literature',
      objectives: [
        'Analyze pozzolana volcanic ash chemical bonding in underwater concrete.',
        'Understand compressive arch mechanics and thrust line vectors.',
        'Evaluate the structural necessity of coffered ceilings and the central oculus.',
      ],
      viewsCount: 142,
      studentsCompletedCount: 29,
    },
    {
      id: 'c-3',
      title: 'World Literature & Shakespeare',
      category: 'language',
      grade: 'Grades 6-9',
      pod: 'explorer',
      desc: 'Classic dramatic dialogue recitation, poetic iambic pentameter, and textual analysis.',
      icon: 'book',
      color: 'pink',
      modulesCount: 4,
      durationMinutes: 30,
      completed: false,
      rating: 4.7,
      interactiveType: 'literature',
    },
    {
      id: 'c-5',
      title: 'General Science & Ecosystem Food Webs',
      category: 'stem',
      grade: 'Grades 6-9',
      pod: 'explorer',
      desc: 'Simulate predator-prey dynamics, trophic cascades, and ecological equilibrium.',
      icon: 'globe',
      color: 'emerald',
      modulesCount: 4,
      durationMinutes: 25,
      completed: false,
      rating: 4.6,
      interactiveType: 'ecosystem',
    },
    {
      id: 'c-6',
      title: 'ABC Phonics & Sight Words',
      category: 'toddler',
      grade: 'Ages 1-5',
      pod: 'toddler',
      desc: 'Interactive touch & hear alphabet phonics, vibrant vocabulary, and speech synthesis.',
      icon: 'shapes',
      color: 'rose',
      modulesCount: 8,
      durationMinutes: 15,
      completed: true,
      rating: 5.0,
      video: {
        id: 'v-104',
        title: 'Toddler Phonics & Alphabet Songs',
        url: 'https://www.youtube.com/watch?v=BELlZKpi1Zs',
        durationMinutes: 15,
        description: 'Vibrant early learning alphabet phonics and tactile pronunciation guidance.',
      },
    },
    {
      id: 'c-8',
      title: 'Planetary Astronomy & Gravitational Physics',
      category: 'stem',
      grade: 'Grades 10-15',
      pod: 'academy',
      desc: 'N-body Keplerian orbits, solar corona dynamics, and orbital velocity calculations.',
      icon: 'atom',
      color: 'teal',
      modulesCount: 5,
      durationMinutes: 50,
      completed: false,
      rating: 4.9,
    },
  ]);

  // Assignments Data
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'a-1',
      title: 'Calculus Problem Set #4: Gradient Fields',
      subject: 'Mathematics',
      dueDate: 'Tomorrow, 5:00 PM',
      status: 'Submitted',
      score: '98/100',
      description: 'Solve multivariable tangent planes and gradient vector derivations for z = sin(r)*cos(x).',
      feedback: 'Exceptional mathematical derivation and rigorous analytical proof. Your conceptual reasoning on the gradient vector is exemplary!',
      studentName: 'Alex Morgan',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      submittedFile: 'Calculus_ProblemSet4_AlexMorgan.pdf',
    },
    {
      id: 'a-2',
      title: 'Quantum Wavepacket Spatial Emission Report',
      subject: 'Physics',
      dueDate: 'Oct 15, 2026',
      status: 'Submitted',
      score: '95/100',
      description: 'Simulate photon excitation emissions and compute emission wavelengths for n=3 to n=1.',
      feedback: 'Accurate Planck-Einstein relation derivations. Very thorough laboratory write-up with interactive parameters.',
      studentName: 'Liam Vance',
      studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      submittedFile: 'Quantum_Emission_Report_Liam.pdf',
    },
    {
      id: 'a-3',
      title: 'Shakespeare Macbeth Soliloquy Analysis',
      subject: 'Literature',
      dueDate: 'Oct 18, 2026',
      status: 'Pending',
      description: 'Analyze thematic motifs of time and existential despair in Macbeth Act V soliloquy.',
      studentName: 'Sophia Chen',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      submittedFile: 'Macbeth_Thematic_Essay_Sophia.pdf',
    },
    {
      id: 'a-4',
      title: 'Ancient Rome Architectural Concrete Report',
      subject: 'History',
      dueDate: 'Oct 20, 2026',
      status: 'Pending',
      description: 'Detail concrete arch engineering principles used in the Roman Pantheon and Colosseum.',
      studentName: 'Marcus Brody',
      studentAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      submittedFile: 'Pantheon_Dome_Structural_Proof.pdf',
    },
  ]);

  // Toast Notification System
  const [toast, setToast] = useState<{ visible: boolean; title: string; desc: string }>({
    visible: false,
    title: '',
    desc: '',
  });
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((desc: string, title: string = 'Gitas Academy System') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ visible: true, title, desc });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, title: '', desc: '' });
    }, 3800);
  }, []);

  // Role Switch Handler
  const handleSwitchRole = (newRole: UserRole) => {
    setUserRole(newRole);

    if (newRole === 'tutor') {
      // If current tab was student-only, transition to tutor analytics dashboard
      if (['lms', 'leaderboard', 'toddlersafe', 'pricing'].includes(currentTab)) {
        setCurrentTab('tutor_analytics');
      }
      showToast(
        'Switched to Tutor Portal (Dr. Aris Thorne). You can create lessons, track analytics, and grade students.',
        '👨‍🏫 Tutor Portal Active'
      );
    } else {
      // If current tab was tutor-only, transition to student view
      if (['tutor_studio', 'tutor_lessons', 'tutor_grading', 'tutor_students', 'tutor_analytics'].includes(currentTab)) {
        setCurrentTab('curriculum');
      }
      showToast(
        'Switched to Student Workspace (Alex Morgan). Explore lessons and attend live 3D classes.',
        '🎓 Student Mode Active'
      );
    }
  };

  // Auth Gateway Login Handler (Differentiated Student vs Tutor)
  const handleLoginSuccess = (role: UserRole, profileUpdate: Partial<UserProfile>) => {
    setUserRole(role);
    if (role === 'student') {
      setStudentProfile((prev) => ({ ...prev, ...profileUpdate }));
      if (profileUpdate.pod) setCurrentPod(profileUpdate.pod);
      if (['tutor_studio', 'tutor_lessons', 'tutor_grading', 'tutor_students', 'tutor_analytics'].includes(currentTab)) {
        setCurrentTab('classroom');
      }
    } else {
      setTutorProfile((prev) => ({ ...prev, ...profileUpdate }));
      if (['lms', 'leaderboard', 'toddlersafe', 'pricing'].includes(currentTab)) {
        setCurrentTab('tutor_analytics');
      }
    }
  };

  // Student Membership Upgrade Handler
  const handleUpgradePlan = (plan: SubscriptionPlan) => {
    setStudentProfile((prev) => ({
      ...prev,
      planTier: plan,
      planRenewalDate: 'Active • 1-Year Membership',
    }));
  };

  // Onboard New Student Completion Handler
  const handleCompleteOnboarding = (newStudent: UserProfile, shouldDeleteFakeDemo: boolean) => {
    sound.playSound('success');
    setStudentProfile(newStudent);
    setCurrentPod(newStudent.pod);
    setUserRole('student');

    // Update peer list to reflect newly onboarded student
    setPeers((prev) => {
      const filtered = shouldDeleteFakeDemo ? prev.filter((p) => p.name !== 'Alex Morgan') : prev;
      return [
        ...filtered,
        {
          id: `peer-${Date.now()}`,
          name: newStudent.name,
          role: `Student (${newStudent.gradeLevel})`,
          avatar: newStudent.avatar,
          status: 'Active',
          cameraOn: true,
          audioOn: true,
        },
      ];
    });

    // Create Welcome & Verification Gmail notification
    const verificationEmail: GmailNotification = {
      id: `gm-${Date.now()}`,
      sender: 'Office of Academic Admissions',
      senderEmail: 'admissions@gitas-academy.edu',
      recipientEmail: newStudent.email || 'student@gmail.com',
      subject: `[Verification Code: ${newStudent.verificationCode}] Welcome to Gitas Academy - Verify Student Email`,
      snippet: `Welcome to Gitas Academy, ${newStudent.name}! Your official verification code is ${newStudent.verificationCode}...`,
      body: `Dear ${newStudent.name},\n\nWelcome to Gitas 3D Virtual Academy!\n\nYour student profile has been registered for the ${newStudent.gradeLevel}.\n\nYour 6-digit email confirmation code is:\n${newStudent.verificationCode}\n\nPlease enter this code to finalize your academic verification and activate official grade transcripts.\n\nBest regards,\nOffice of Academic Admissions\nGitas Virtual Academy`,
      timestamp: 'Just now',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: 'verification',
      unread: true,
      starred: true,
      actionLabel: 'Verify Student Email Now',
      actionType: 'verify_email',
      verificationCode: newStudent.verificationCode,
    };

    setGmailNotifications((prev) => [verificationEmail, ...prev]);

    confetti({ particleCount: 70, spread: 75 });
    showToast(
      `Welcome to Gitas Academy, ${newStudent.name}! 6-digit code sent to ${newStudent.email}.`,
      '🎉 Student Onboarded'
    );

    // Open verification prompt right away
    setTimeout(() => {
      setVerificationOpen(true);
    }, 600);
  };

  // Delete Fake Demo Student Handler
  const handleDeleteFakeDemoStudent = () => {
    sound.playSound('pop');
    if (studentProfile.isFakeDemo) {
      setStudentProfile({
        name: 'New Student Scholar',
        email: 'scholar@gitas.edu',
        emailVerified: false,
        verificationCode: '839201',
        isFakeDemo: false,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
        role: 'student',
        pod: 'academy',
        gradeLevel: 'Academy Core (Grade 8)',
        points: 200,
        streakDays: 1,
        planTier: 'scholar',
        planRenewalDate: 'Active • 1-Year Membership',
        gmailNotificationsEnabled: true,
        badges: [
          { id: 'b-v', title: 'Honor Candidate', icon: 'award', earned: true, date: 'Active' },
        ],
      });
      setPeers((prev) => prev.filter((p) => p.name !== 'Alex Morgan'));
      showToast('Fake demo student Alex Morgan has been purged.', 'Demo Account Deleted');
    } else {
      showToast('Active student profile is not a demo account.', 'Student Account');
    }
  };

  // Verify Student Email Handler
  const handleVerifyEmail = () => {
    sound.playSound('success');
    setStudentProfile((prev) => ({
      ...prev,
      emailVerified: true,
      badges: [
        ...prev.badges,
        {
          id: `b-ver-${Date.now()}`,
          title: 'Verified Scholar Credentials',
          icon: 'shield',
          earned: true,
          date: 'Verified',
        },
      ],
    }));

    // Generate verified confirmation email in Gmail hub
    const confirmationEmail: GmailNotification = {
      id: `gm-${Date.now()}`,
      sender: 'Gitas Security & Credentials Bureau',
      senderEmail: 'registrar@gitas-academy.edu',
      recipientEmail: studentProfile.email || 'student@gmail.com',
      subject: `[Email Confirmed] ${studentProfile.name} is Officially Verified ✓`,
      snippet: 'Your student email and digital academic credentials have been verified with cryptographic validation.',
      body: `Dear ${studentProfile.name},\n\nCongratulations! Your student email address (${studentProfile.email}) has been verified.\n\nAll academic privileges, 3D spatial simulation laboratories, faculty office hours, and official transcripts are now fully unlocked.\n\nRegistrar & Student Affairs\nGitas Virtual Academy`,
      timestamp: 'Just now',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: 'verification',
      unread: true,
      starred: false,
    };

    setGmailNotifications((prev) => [confirmationEmail, ...prev]);
    confetti({ particleCount: 60, spread: 60 });
    showToast(`Student email ${studentProfile.email} verified successfully!`, '🎉 Credentials Verified');
  };

  // Trigger sample/test Gmail notification
  const handleTriggerTestEmail = (type: 'welcome' | 'grade' | 'lecture' | 'honor') => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    let newEmail: GmailNotification;

    if (type === 'welcome') {
      setStudentProfile((prev) => ({ ...prev, verificationCode: code }));
      newEmail = {
        id: `gm-${Date.now()}`,
        sender: 'Office of Academic Admissions',
        senderEmail: 'admissions@gitas-academy.edu',
        recipientEmail: studentProfile.email || 'student@gmail.com',
        subject: `[Verification Code: ${code}] Student Email Verification`,
        snippet: `Your new 6-digit confirmation code is ${code}. Verify to unlock transcripts.`,
        body: `Dear ${studentProfile.name},\n\nHere is your 6-digit email confirmation code:\n\n${code}\n\nEnter this code in the app or click the button below to confirm.\n\nOffice of Academic Admissions\nGitas Virtual Academy`,
        timestamp: 'Just now',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: 'verification',
        unread: true,
        starred: true,
        actionLabel: 'Verify Student Email Now',
        actionType: 'verify_email',
        verificationCode: code,
      };
    } else if (type === 'grade') {
      newEmail = {
        id: `gm-${Date.now()}`,
        sender: 'Faculty Grading Desk (Dr. Thorne)',
        senderEmail: 'dr.thorne@faculty.gitas.edu',
        recipientEmail: studentProfile.email || 'student@gmail.com',
        subject: '[Grades Posted] Problem Set #5: Quantum Wavepacket Superposition - Score: 100/100 A+',
        snippet: 'Dr. Thorne posted a perfect score for your spatial simulation proofs.',
        body: `Dear ${studentProfile.name},\n\nCongratulations on scoring 100 / 100 on your quantum wavepacket proof!\n\nFaculty Evaluation: "Exceptional mathematical clarity. Recommended for Dean's Scholar Honors."\n\nDr. Aris Thorne\nLead STEM Faculty`,
        timestamp: 'Just now',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: 'grades',
        unread: true,
        starred: true,
        actionLabel: 'Open LMS Locker',
        actionType: 'open_lms',
      };
    } else if (type === 'lecture') {
      newEmail = {
        id: `gm-${Date.now()}`,
        sender: 'Live Spatial Classroom Dispatch',
        senderEmail: 'lectures@gitas-academy.edu',
        recipientEmail: studentProfile.email || 'student@gmail.com',
        subject: '[Live Lecture Alert] Quantum Wavepacket Masterclass Starting in 5 Minutes',
        snippet: 'Dr. Thorne is broadcasting from the 3D spatial studio. Join the live lab.',
        body: `Dear ${studentProfile.name},\n\nThe live interactive lecture on Atomic Superposition is commencing now.\n\nPlease take your front-row seat in the 3D Classroom.\n\nGitas Academy Dispatch`,
        timestamp: 'Just now',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: 'classes',
        unread: true,
        starred: false,
        actionLabel: 'Join 3D Spatial Classroom',
        actionType: 'open_classroom',
      };
    } else {
      newEmail = {
        id: `gm-${Date.now()}`,
        sender: "Office of the Dean",
        senderEmail: 'dean@gitas-academy.edu',
        recipientEmail: studentProfile.email || 'student@gmail.com',
        subject: "[Academic Honors] You've Been Nominated to the Dean's Honor Roll!",
        snippet: "Based on top 1% performance across STEM simulations and calculus modules.",
        body: `Dear ${studentProfile.name},\n\nIn recognition of outstanding academic diligence, you have been selected for the Dean's Honor Roll.\n\nAcademic Excellence Committee\nGitas Virtual Academy`,
        timestamp: 'Just now',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: 'grades',
        unread: true,
        starred: true,
        actionLabel: 'View Graded Honors',
        actionType: 'open_lms',
      };
    }

    setGmailNotifications((prev) => [newEmail, ...prev]);
    sound.playSound('alert');
    showToast(`New Gmail notification delivered: ${newEmail.subject}`, '📬 Gmail Alert');
  };

  // Grade Pod Switch Handler
  const handleSelectPod = (pod: GradePod) => {
    setCurrentPod(pod);
    let levelName = 'Academy Core (Grade 8)';
    if (pod === 'toddler') {
      levelName = 'Discovery Pod (Ages 1-5)';
      if (userRole === 'student') setCurrentTab('toddlersafe');
      showToast('Switched to Toddler Discovery Pod (Ages 1-5)', 'Grade Pod Activated');
    } else if (pod === 'explorer') {
      levelName = 'Explorer Hub (Ages 6-9)';
      if (userRole === 'student') setCurrentTab('curriculum');
      showToast('Switched to Explorer Hub (Ages 6-9)', 'Grade Pod Activated');
    } else {
      levelName = 'Academy Core (Ages 10-15)';
      if (userRole === 'student') setCurrentTab('classroom');
      showToast('Switched to Academy Core (Ages 10-15)', 'Grade Pod Activated');
    }

    if (userRole === 'student') {
      setStudentProfile((prev) => ({
        ...prev,
        pod,
        gradeLevel: levelName,
      }));
    }
  };

  // Peer Star Kudos or Tutor spotlight
  const handlePeerClick = (peer: Peer) => {
    sound.playSound('pop');
    confetti({ particleCount: 35, spread: 50 });
    if (userRole === 'tutor') {
      showToast(`Commended ${peer.name} with instructor honor star! ⭐`, 'Tutor Commendation');
    } else {
      showToast(`Sent star recognition & academic kudos to ${peer.name}! ⭐`, 'Peer Community');
    }
  };

  // Student Assignment Submission Handler
  const handleSubmitAssignment = (id: string, text: string, fileName?: string) => {
    const scores = ['96/100', '98/100', '100/100', '95/100'];
    const randomScore = scores[Math.floor(Math.random() * scores.length)];

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'Submitted',
            score: randomScore,
            submittedFile: fileName || 'Assignment_Submission.pdf',
            feedback: `Evaluated by Dr. Thorne: Excellent problem-solving, structured derivations, and cohesive arguments. Score: ${randomScore}.`,
          };
        }
        return a;
      })
    );

    // Give student XP
    setStudentProfile((prev) => ({ ...prev, points: prev.points + 150 }));
    showToast('Assignment submitted to Tutor Grading Desk! 150 XP awarded.', 'Submission Recorded');
  };

  // Tutor Lesson Actions
  const handleSaveLesson = (lesson: CurriculumItem) => {
    setCurriculumList((prev) => {
      const exists = prev.some((l) => l.id === lesson.id);
      if (exists) {
        return prev.map((l) => (l.id === lesson.id ? lesson : l));
      }
      return [lesson, ...prev];
    });

    setEditingLesson(null);
    setCurrentTab('tutor_lessons');

    // Add a notification to student drawer
    setNotifications((prev) => [
      {
        id: 'n-' + Date.now(),
        title: `New Lesson Published: ${lesson.title}`,
        description: `Dr. Thorne added a new lesson with video lectures and interactive labs!`,
        timestamp: 'Just now',
        type: 'class',
        unread: true,
      },
      ...prev,
    ]);
  };

  const handleEditLesson = (lesson: CurriculumItem) => {
    setEditingLesson(lesson);
    setCurrentTab('tutor_studio');
    sound.playSound('click');
  };

  const handleDeleteLesson = (id: string) => {
    setCurriculumList((prev) => prev.filter((l) => l.id !== id));
    sound.playSound('pop');
    showToast('Lesson removed from courseware catalog', 'Lesson Deleted');
  };

  const handleTogglePublish = (id: string) => {
    setCurriculumList((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const newStatus = l.status === 'draft' ? 'published' : 'draft';
          showToast(
            `Lesson is now ${newStatus === 'published' ? 'Live to all students' : 'saved as Draft'}`,
            'Status Updated'
          );
          return { ...l, status: newStatus };
        }
        return l;
      })
    );
    sound.playSound('click');
  };

  const handlePreviewLesson = (lesson: CurriculumItem) => {
    setActiveModuleItem(lesson);
    sound.playSound('pop');
  };

  const handleGradeAssignment = (id: string, score: string, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'Submitted',
            score,
            feedback,
          };
        }
        return a;
      })
    );

    // Add student notification
    setNotifications((prev) => [
      {
        id: 'n-' + Date.now(),
        title: 'Assignment Evaluation Returned',
        description: `Dr. Thorne gave you ${score}: "${feedback.slice(0, 50)}..."`,
        timestamp: 'Just now',
        type: 'grade',
        unread: true,
      },
      ...prev,
    ]);
  };

  // Module Completion Handler
  const handleCompleteModule = (title: string, score: number) => {
    setCurriculumList((prev) =>
      prev.map((c) => (c.title === title ? { ...c, completed: true } : c))
    );

    showToast(`Mastered ${title}! Scored ${score}%. 100 XP awarded!`, 'Academic Achievement');
    setStudentProfile((prev) => ({ ...prev, points: prev.points + 100 }));
  };

  const handleAwardPoints = (points: number) => {
    setStudentProfile((prev) => ({ ...prev, points: prev.points + points }));
  };

  // Compute stats for badges
  const pendingGradingCount = assignments.filter((a) => !a.score || a.status !== 'Submitted').length;
  const tutorLessonCount = curriculumList.filter((l) => l.isTutorCreated).length;

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white bg-[#0B0F19]">
      {/* Top Header with Prominent Role Demarcator */}
      <Header
        currentPod={currentPod}
        onSelectPod={handleSelectPod}
        userProfile={activeProfile}
        userRole={userRole}
        onSwitchRole={handleSwitchRole}
        onCreateLesson={() => {
          setEditingLesson(null);
          setCurrentTab('tutor_studio');
        }}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenOnboarding={() => setOnboardingModalOpen(true)}
        onOpenVerification={() => setVerificationOpen(true)}
        onOpenGmailInbox={() => setGmailCenterModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        unreadCount={notifications.filter((n) => n.unread).length}
        gmailUnreadCount={gmailNotifications.filter((n) => n.unread).length}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Sidebar with Role Demarcation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          peers={peers}
          onPeerClick={handlePeerClick}
          userRole={userRole}
          pendingGradingCount={pendingGradingCount}
          tutorLessonCount={tutorLessonCount}
        />

        {/* Dynamic Main Workspace Demarcated Per Role */}
        <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto max-w-[1700px] mx-auto w-full">
          {/* TUTOR-ONLY WORKSPACES */}
          {userRole === 'tutor' && currentTab === 'tutor_analytics' && (
            <TutorAnalyticsDashboard
              curriculumList={curriculumList}
              onEditLesson={handleEditLesson}
              onPreviewLesson={handlePreviewLesson}
              onToast={showToast}
            />
          )}

          {userRole === 'tutor' && currentTab === 'tutor_studio' && (
            <TutorLessonCreator
              onSaveLesson={handleSaveLesson}
              editingLesson={editingLesson}
              onCancel={() => {
                setEditingLesson(null);
                setCurrentTab('tutor_lessons');
              }}
              onToast={showToast}
            />
          )}

          {userRole === 'tutor' && currentTab === 'tutor_lessons' && (
            <TutorLessonsManager
              lessons={curriculumList}
              onCreateNew={() => {
                setEditingLesson(null);
                setCurrentTab('tutor_studio');
              }}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onTogglePublish={handleTogglePublish}
              onPreviewLesson={handlePreviewLesson}
              onOpenAnalytics={() => setCurrentTab('tutor_analytics')}
              onToast={showToast}
            />
          )}

          {userRole === 'tutor' && currentTab === 'tutor_grading' && (
            <TutorGradingDesk
              assignments={assignments}
              onGradeAssignment={handleGradeAssignment}
              onToast={showToast}
            />
          )}

          {userRole === 'tutor' && currentTab === 'tutor_students' && (
            <TutorStudentsRoster
              onToast={showToast}
              customStudents={[
                {
                  id: 'st-active',
                  name: studentProfile.name,
                  avatar: studentProfile.avatar,
                  pod: studentProfile.pod,
                  gradeLevel: studentProfile.gradeLevel,
                  completedLessons: studentProfile.isFakeDemo ? 6 : 2,
                  videosWatched: studentProfile.isFakeDemo ? 8 : 3,
                  averageScore: studentProfile.isFakeDemo ? 98 : 95,
                  streakDays: studentProfile.streakDays,
                  status: 'Online',
                  notes: studentProfile.bio || (studentProfile.isFakeDemo
                    ? 'Exceptional in multivariable calculus & quantum lab proofs.'
                    : `Active enrolled student. ${studentProfile.emailVerified ? 'Credentials Verified ✓' : 'Email Verification Pending'}`),
                },
                {
                  id: 'st-2',
                  name: 'Liam Vance',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
                  pod: 'academy',
                  gradeLevel: 'Academy Core (Grade 8)',
                  completedLessons: 5,
                  videosWatched: 6,
                  averageScore: 94,
                  streakDays: 9,
                  status: 'In Lab',
                  notes: 'Active participant in 3D spatial simulation questions.',
                },
                {
                  id: 'st-3',
                  name: 'Sophia Chen',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                  pod: 'academy',
                  gradeLevel: 'Academy Core (Grade 8)',
                  completedLessons: 5,
                  videosWatched: 7,
                  averageScore: 96,
                  streakDays: 18,
                  status: 'Online',
                  notes: 'Brilliant essay interpretations of Shakespeare and literature.',
                },
                {
                  id: 'st-4',
                  name: 'Marcus Brody',
                  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
                  pod: 'explorer',
                  gradeLevel: 'Explorer Hub (Grade 7)',
                  completedLessons: 4,
                  videosWatched: 5,
                  averageScore: 91,
                  streakDays: 7,
                  status: 'In Lab',
                  notes: 'Working on ancient Rome architectural structural simulations.',
                },
              ]}
              onDeleteStudent={(id) => {
                if (id === 'st-active') {
                  handleDeleteFakeDemoStudent();
                }
              }}
            />
          )}

          {/* COMMON WORKSPACES (With Tutor/Student Mode Aware Behaviors) */}
          {currentTab === 'classroom' && (
            <Classroom3D
              currentPod={currentPod}
              onToast={showToast}
              peers={peers}
              onUpdatePeers={setPeers}
              userRole={userRole}
            />
          )}

          {currentTab === 'curriculum' && (
            <CurriculumHub
              currentPod={currentPod}
              curriculumList={curriculumList}
              onLaunchModule={(item) => setActiveModuleItem(item)}
              userRole={userRole}
              onCreateLesson={() => {
                setEditingLesson(null);
                setCurrentTab('tutor_studio');
              }}
              onOpenPricing={() => setPricingModalOpen(true)}
            />
          )}

          {/* STUDENT-SPECIFIC WORKSPACES */}
          {userRole === 'student' && currentTab === 'lms' && (
            <LMSLocker
              assignments={assignments}
              onAddAssignment={(a) => setAssignments((prev) => [a, ...prev])}
              onSubmitAssignment={handleSubmitAssignment}
              onToast={showToast}
            />
          )}

          {userRole === 'student' && currentTab === 'leaderboard' && (
            <Leaderboard
              userProfile={studentProfile}
              onAwardPoints={handleAwardPoints}
              onToast={showToast}
              currentPod={currentPod}
              onSelectPod={handleSelectPod}
            />
          )}

          {userRole === 'student' && currentTab === 'pricing' && (
            <StudentPricingModal
              inline={true}
              currentPlan={studentProfile.planTier}
              onUpgradePlan={handleUpgradePlan}
              onToast={showToast}
            />
          )}

          {currentTab === 'toddlersafe' && <ToddlerPod onToast={showToast} />}
        </main>
      </div>

      {/* Interactive Curriculum Module Modal (With Video Player & Custom Quizzes) */}
      <InteractiveModuleModal
        item={activeModuleItem}
        onClose={() => setActiveModuleItem(null)}
        onCompleteModule={handleCompleteModule}
      />

      {/* Notifications Drawer Modal */}
      <NotificationModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
          showToast('All notifications marked as read', 'Notifications');
        }}
      />

      {/* User Profile & Badges Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        userProfile={activeProfile}
        onUpdateProfile={(updated) => {
          if (userRole === 'tutor') {
            setTutorProfile((prev) => ({ ...prev, ...updated }));
          } else {
            setStudentProfile((prev) => ({ ...prev, ...updated }));
          }
        }}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenOnboarding={() => setOnboardingModalOpen(true)}
        onOpenVerification={() => setVerificationOpen(true)}
        onOpenGmailInbox={() => setGmailCenterModalOpen(true)}
        onDeleteCurrentStudent={handleDeleteFakeDemoStudent}
        hasMultipleStudents={true}
        onToast={showToast}
      />

      {/* Student Pricing & Enrollment Modal */}
      <StudentPricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        currentPlan={studentProfile.planTier}
        onUpgradePlan={handleUpgradePlan}
        onToast={showToast}
      />

      {/* Differentiated Student vs Faculty Auth Gateway Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentRole={userRole}
        onLoginSuccess={handleLoginSuccess}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenOnboarding={() => setOnboardingModalOpen(true)}
        hasFakeDemoStudent={studentProfile.isFakeDemo}
        onDeleteFakeStudent={handleDeleteFakeDemoStudent}
        onToast={showToast}
      />

      {/* Student Onboarding Wizard Modal */}
      <StudentOnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onCompleteOnboarding={handleCompleteOnboarding}
        hasFakeDemoStudent={!!studentProfile.isFakeDemo}
        onToast={showToast}
      />

      {/* Student Email Verification Modal */}
      <EmailVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationOpen(false)}
        email={studentProfile.email || 'student@gitas.edu'}
        expectedCode={studentProfile.verificationCode || '748291'}
        onVerifySuccess={handleVerifyEmail}
        onResendCode={() => {
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setStudentProfile((prev) => ({ ...prev, verificationCode: newCode }));
          handleTriggerTestEmail('welcome');
          showToast(`New verification code sent to ${studentProfile.email}`, 'Code Dispatched');
        }}
        onOpenGmailInbox={() => {
          setVerificationOpen(false);
          setGmailCenterModalOpen(true);
        }}
        onToast={showToast}
      />

      {/* Gmail Notification Hub Modal */}
      <GmailNotificationCenterModal
        isOpen={gmailCenterModalOpen}
        onClose={() => setGmailCenterModalOpen(false)}
        studentProfile={studentProfile}
        notifications={gmailNotifications}
        onMarkAsRead={(id) => {
          setGmailNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
          );
        }}
        onToggleStar={(id) => {
          setGmailNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n))
          );
        }}
        onDeleteNotification={(id) => {
          setGmailNotifications((prev) => prev.filter((n) => n.id !== id));
        }}
        onVerifyEmailDirectly={(code) => {
          handleVerifyEmail();
        }}
        onTriggerTestEmail={handleTriggerTestEmail}
        onNavigateToClassroom={() => setCurrentTab('classroom')}
        onNavigateToLms={() => setCurrentTab('lms')}
        onToast={showToast}
      />

      {/* Toast Notification Banner */}
      <div
        className={`fixed bottom-6 right-6 z-50 glass-panel bg-slate-900/95 border border-indigo-500/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 transform transition-all duration-300 pointer-events-none ${
          toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
          <Bell size={16} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">{toast.title}</h4>
          <p className="text-[11px] text-slate-300">{toast.desc}</p>
        </div>
      </div>
    </div>
  );
}
