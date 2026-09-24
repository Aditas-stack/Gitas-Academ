import { Peer, GradePod } from '../types';

const FIRST_NAMES = [
  'Liam', 'Sophia', 'Marcus', 'Elena', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Isabella',
  'Lucas', 'Mia', 'Mateo', 'Harper', 'Benjamin', 'Evelyn', 'Aiden', 'Abigail', 'James', 'Emily',
  'Leo', 'Ella', 'Kai', 'Chloe', 'Daniel', 'Grace', 'Ethan', 'Aria', 'Henry', 'Zoe',
  'Sebastian', 'Lily', 'Jack', 'Layla', 'Alexander', 'Nora', 'Owen', 'Riley', 'Samuel', 'Scarlett',
  'Julian', 'Hannah', 'Levi', 'Mila', 'David', 'Leah', 'John', 'Aurora', 'Wyatt', 'Savannah',
  'Caleb', 'Stella', 'Nathan', 'Maya', 'Isaac', 'Elena', 'Ryan', 'Penelope', 'Isaiah', 'Victoria'
];

const LAST_NAMES = [
  'Vance', 'Chen', 'Brody', 'Rostova', 'Patel', 'Kim', 'O\'Connor', 'Santos', 'Tanaka', 'Müller',
  'Dubois', 'Silva', 'Ahmed', 'Johansson', 'Kowalski', 'Gupta', 'Rossi', 'Larsson', 'Nakamura', 'Moreau',
  'Davies', 'Fischer', 'Al-Mansoor', 'Becker', 'Novak', 'Suzuki', 'Schneider', 'Costa', 'Sato', 'Walsh'
];

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop'
];

export function generate100PlusAuditoriumPeers(): Peer[] {
  const peers: Peer[] = [
    {
      id: 'p-host-dr-thorne',
      name: 'Dr. Aris Thorne',
      role: 'Lead STEM Faculty (Host)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      status: 'Host',
      cameraOn: true,
      audioOn: true,
      gradePod: 'academy',
    },
    {
      id: 'p-ta-maya',
      name: 'Maya Lin, M.Sc.',
      role: 'Teaching Assistant (Co-Host)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      status: 'Speaking',
      cameraOn: true,
      audioOn: true,
      gradePod: 'academy',
    },
    {
      id: 'p-student-liam',
      name: 'Liam Vance',
      role: 'Student (Grade 8)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: true,
      audioOn: true,
      gradePod: 'academy',
      handRaised: true,
    },
    {
      id: 'p-student-sophia',
      name: 'Sophia Chen',
      role: 'Student (Grade 8)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: true,
      audioOn: true,
      gradePod: 'academy',
      handRaised: true,
    },
    {
      id: 'p-student-marcus',
      name: 'Marcus Brody',
      role: 'Student (Grade 7)',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: true,
      audioOn: false,
      gradePod: 'explorer',
    },
    {
      id: 'p-student-elena',
      name: 'Elena Rostova',
      role: 'Student (Grade 8)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      status: 'Active',
      cameraOn: false,
      audioOn: false,
      gradePod: 'academy',
    },
  ];

  // Generate 112 additional high-capacity classroom students (total 118 attendees)
  for (let i = 7; i <= 118; i++) {
    const fName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 11) % LAST_NAMES.length];
    const avatar = AVATAR_URLS[i % AVATAR_URLS.length];
    const pod: GradePod = i % 3 === 0 ? 'explorer' : i % 7 === 0 ? 'toddler' : 'academy';
    const isHandRaised = i === 12 || i === 23 || i === 47 || i === 81;
    const isMuted = i % 4 !== 0;

    peers.push({
      id: `p-auditorium-${i}`,
      name: `${fName} ${lName}`,
      role: i % 15 === 0 ? 'Honor Scholar' : `Student (${pod === 'academy' ? 'Grade 8' : 'Grade 6'})`,
      avatar,
      status: isMuted ? 'Muted' : 'Active',
      cameraOn: i % 2 === 0,
      audioOn: !isMuted,
      handRaised: isHandRaised,
      gradePod: pod,
    });
  }

  return peers;
}
