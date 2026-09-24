import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  MessageSquare,
  RotateCcw,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Atom,
  Dna,
  Binary,
  Globe2,
  Send,
  UserCheck,
  CheckCircle2,
  Play,
  Pause,
  Award,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  LayoutGrid
} from 'lucide-react';
import { SimulationMode, Peer, ChatMessage, GradePod, UserRole, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { WhiteboardOverlay } from './WhiteboardOverlay';
import { LiveSessionChatSidebar } from './LiveSessionChatSidebar';

interface Classroom3DProps {
  currentPod: GradePod;
  onToast: (msg: string, title?: string) => void;
  peers: Peer[];
  onUpdatePeers: (peers: Peer[]) => void;
  userRole?: UserRole;
  userProfile?: UserProfile;
}

export const Classroom3D: React.FC<Classroom3DProps> = ({
  currentPod,
  onToast,
  peers,
  onUpdatePeers,
  userRole = 'student',
  userProfile = {
    name: 'Alex Morgan',
    role: 'student',
    pod: 'academy',
    gradeLevel: 'Grade 8',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    points: 1420,
    streakDays: 14,
    badges: [],
  },
}) => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const activeGroupRef = useRef<THREE.Group | null>(null);

  // Classroom Call States
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCamActive, setIsCamActive] = useState<boolean>(true);
  const [useRealWebcam, setUseRealWebcam] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);
  const [whiteboardOpen, setWhiteboardOpen] = useState<boolean>(false);

  // High-Capacity 100+ Auditorium & Roster States
  const [classViewMode, setClassViewMode] = useState<'grid' | 'auditorium'>('grid');
  const [attendeeSearch, setAttendeeSearch] = useState<string>('');
  const [podFilter, setPodFilter] = useState<string>('all');
  const [attendeePage, setAttendeePage] = useState<number>(1);
  const [bandwidthSaver, setBandwidthSaver] = useState<boolean>(true);
  const [showHandQueue, setShowHandQueue] = useState<boolean>(false);

  // 3D Simulation Controls
  const [simMode, setSimMode] = useState<SimulationMode>('atom');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [zeroGActive, setZeroGActive] = useState<boolean>(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'Dr. Aris Thorne',
      senderRole: 'Instructor',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      text: 'Welcome everyone! Today we are examining atomic quantum shells and multivariable vectors. Please manipulate the 3D model on your spatial view.',
      timestamp: '10:02 AM',
      isTeacher: true,
    },
    {
      id: 'm-2',
      sender: 'Liam Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      text: 'The electron orbital radius expands when we simulate photon excitation!',
      timestamp: '10:04 AM',
    },
  ]);
  const [inputChat, setInputChat] = useState<string>('');

  // ---------------------------------------------------------------------------
  // Initialize Three.js Scene and 3D Simulation Models
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.8, 6.5);
    cameraRef.current = camera;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient and Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2.5, 40);
    pointLight1.position.set(6, 6, 6);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2.5, 40);
    pointLight2.position.set(-6, -4, 4);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x10b981, 1.8, 30);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

    // Build Simulation Model for current simMode
    buildSimulation(simMode);

    // Render Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (activeGroupRef.current) {
        if (isAutoRotating) {
          activeGroupRef.current.rotation.y += 0.008 * simSpeed;
          activeGroupRef.current.rotation.x += 0.003 * simSpeed;
        }

        // Specific sub-animations
        if (simMode === 'atom') {
          const electrons = activeGroupRef.current.getObjectByName('electrons');
          if (electrons) {
            electrons.rotation.z += 0.02 * simSpeed;
            electrons.rotation.y += 0.015 * simSpeed;
          }
        } else if (simMode === 'gravity') {
          const planets = activeGroupRef.current.getObjectByName('planets');
          if (planets) {
            planets.children.forEach((planet, idx) => {
              const speed = (0.02 / (idx + 1)) * simSpeed;
              planet.rotation.y += speed;
              const angle = Date.now() * 0.001 * speed * (idx + 1);
              const radius = 2 + idx * 1.3;
              planet.position.x = Math.cos(angle) * radius;
              planet.position.z = Math.sin(angle) * radius;
            });
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [simMode, isAutoRotating, simSpeed, isWireframe, zeroGActive]);

  // ---------------------------------------------------------------------------
  // Build Specific 3D Models
  // ---------------------------------------------------------------------------
  const buildSimulation = (mode: SimulationMode) => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous group
    if (activeGroupRef.current) {
      scene.remove(activeGroupRef.current);
    }

    const group = new THREE.Group();
    activeGroupRef.current = group;

    if (mode === 'atom') {
      // 1. Quantum Atom Model
      // Nucleus: Clusters of protons & neutrons
      const nucleusGroup = new THREE.Group();
      const nucMat1 = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.2,
        metalness: 0.7,
        wireframe: isWireframe,
      });
      const nucMat2 = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        roughness: 0.2,
        metalness: 0.7,
        wireframe: isWireframe,
      });

      for (let i = 0; i < 16; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.24, 16, 16);
        const sphere = new THREE.Mesh(sphereGeo, i % 2 === 0 ? nucMat1 : nucMat2);
        sphere.position.set(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7
        );
        nucleusGroup.add(sphere);
      }
      group.add(nucleusGroup);

      // Orbital Rings & Electrons
      const ringGroup = new THREE.Group();
      ringGroup.name = 'electrons';

      const ringConfigs = [
        { radius: 1.8, color: 0x38bdf8, rotX: 0.8, rotY: 0.4 },
        { radius: 2.6, color: 0x10b981, rotX: -0.9, rotY: 1.2 },
        { radius: 3.4, color: 0xf59e0b, rotX: 1.4, rotY: -0.6 },
      ];

      ringConfigs.forEach((cfg) => {
        const ringGeo = new THREE.TorusGeometry(cfg.radius, 0.03, 16, 100);
        const ringMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.3,
          wireframe: isWireframe,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(cfg.rotX, cfg.rotY, 0);
        ringGroup.add(ring);

        // Electron Sphere on ring
        const electronGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const electronMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          emissive: cfg.color,
          emissiveIntensity: 0.8,
        });
        const electron = new THREE.Mesh(electronGeo, electronMat);
        electron.position.set(cfg.radius, 0, 0);
        ring.add(electron);
      });

      group.add(ringGroup);
    } else if (mode === 'dna') {
      // 2. DNA Double Helix
      const numRungs = 24;
      const helixRadius = 1.2;
      const heightStep = 0.25;

      const baseColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b]; // A, T, G, C

      for (let i = 0; i < numRungs; i++) {
        const angle = i * 0.35;
        const y = (i - numRungs / 2) * heightStep;

        const x1 = Math.cos(angle) * helixRadius;
        const z1 = Math.sin(angle) * helixRadius;
        const x2 = Math.cos(angle + Math.PI) * helixRadius;
        const z2 = Math.sin(angle + Math.PI) * helixRadius;

        // Strand backbone spheres
        const bbGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const bbMat = new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          metalness: 0.6,
          wireframe: isWireframe,
        });
        const node1 = new THREE.Mesh(bbGeo, bbMat);
        node1.position.set(x1, y, z1);
        group.add(node1);

        const node2 = new THREE.Mesh(bbGeo, bbMat);
        node2.position.set(x2, y, z2);
        group.add(node2);

        // Connecting Rung (Hydrogen bond)
        const cylinderGeo = new THREE.CylinderGeometry(0.04, 0.04, helixRadius * 2, 8);
        const rungMat = new THREE.MeshStandardMaterial({
          color: baseColors[i % 4],
          metalness: 0.4,
          wireframe: isWireframe,
        });
        const rung = new THREE.Mesh(cylinderGeo, rungMat);
        rung.position.set(0, y, 0);
        rung.rotation.z = Math.PI / 2;
        rung.rotation.y = -angle;
        group.add(rung);
      }
    } else if (mode === 'calculus') {
      // 3. Calculus 3D Vector Surface Grid
      const size = 30;
      const geometry = new THREE.PlaneGeometry(5, 5, size, size);
      geometry.rotateX(-Math.PI / 2);

      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        // Multivariable ripple surface: z = sin(r)*1.2
        const r = Math.sqrt(x * x + z * z);
        const y = Math.sin(r * 2.5) * 0.8 * Math.cos(x * 1.2);
        pos.setY(i, y);
      }
      geometry.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.3,
        metalness: 0.5,
        wireframe: isWireframe,
        side: THREE.DoubleSide,
      });
      const surface = new THREE.Mesh(geometry, mat);
      group.add(surface);

      // Add normal gradient arrow vectors
      for (let x = -1.8; x <= 1.8; x += 1.2) {
        for (let z = -1.8; z <= 1.8; z += 1.2) {
          const r = Math.sqrt(x * x + z * z);
          const y = Math.sin(r * 2.5) * 0.8 * Math.cos(x * 1.2);
          const dir = new THREE.Vector3(x * 0.2, 1, z * 0.2).normalize();
          const origin = new THREE.Vector3(x, y, z);
          const arrowHelper = new THREE.ArrowHelper(dir, origin, 0.7, 0xec4899, 0.2, 0.1);
          group.add(arrowHelper);
        }
      }
    } else if (mode === 'gravity') {
      // 4. Planetary Gravity Lab
      // Central Sun
      const sunGeo = new THREE.SphereGeometry(1.0, 32, 32);
      const sunMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.9,
        wireframe: isWireframe,
      });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      group.add(sun);

      const planetsGroup = new THREE.Group();
      planetsGroup.name = 'planets';

      const planetConfigs = [
        { radius: 0.25, color: 0x3b82f6, dist: 2.2 }, // Earth
        { radius: 0.18, color: 0xef4444, dist: 3.3 }, // Mars
        { radius: 0.45, color: 0xd97706, dist: 4.6 }, // Jupiter
      ];

      planetConfigs.forEach((p) => {
        // Orbit line
        const orbitGeo = new THREE.RingGeometry(p.dist - 0.01, p.dist + 0.01, 64);
        orbitGeo.rotateX(Math.PI / 2);
        const orbitMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.15,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
        group.add(orbitRing);

        // Planet
        const pGeo = new THREE.SphereGeometry(p.radius, 24, 24);
        const pMat = new THREE.MeshStandardMaterial({
          color: p.color,
          roughness: 0.5,
          wireframe: isWireframe,
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.x = p.dist;
        planetsGroup.add(pMesh);
      });

      group.add(planetsGroup);
    }

    scene.add(group);
  };

  // ---------------------------------------------------------------------------
  // Camera & Video Controls
  // ---------------------------------------------------------------------------
  const toggleCam = async () => {
    sound.playSound('click');
    if (isCamActive) {
      // Turn off
      setIsCamActive(false);
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }
      setUseRealWebcam(false);
      onToast('Camera video stream stopped', 'Video Feed');
    } else {
      // Turn on - attempt real webcam first
      setIsCamActive(true);
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            setUseRealWebcam(true);
            onToast('Connected to device webcam!', 'Live Camera Active');
            return;
          }
        }
      } catch {
        // Permissions not granted or no webcam; fallback to live avatar
      }
      setUseRealWebcam(false);
      onToast('Camera active (HD avatar stream)', 'Video Feed');
    }
  };

  const toggleMic = () => {
    sound.playSound('click');
    const next = !isMicMuted;
    setIsMicMuted(next);
    onToast(next ? 'Microphone muted' : 'Microphone active', 'Audio Status');
  };

  const toggleScreenShare = async () => {
    sound.playSound('click');
    if (isScreenSharing) {
      setIsScreenSharing(false);
      onToast('Screen broadcast stopped', 'Presentation');
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setIsScreenSharing(true);
          onToast('Screen sharing live to classroom', 'Broadcast Active');
          // Listen for user stopping via native browser bar
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
          return;
        }
      } catch {
        // User cancelled native prompt or in iframe; switch to interactive whiteboard
      }
      // Fallback or explicit collaborative whiteboard
      setWhiteboardOpen(true);
      setIsScreenSharing(true);
      onToast('Interactive Whiteboard launched for class broadcast', 'Screen Broadcast');
    }
  };

  const handleRaiseHand = () => {
    sound.playSound('hand_raise');
    const next = !isHandRaised;
    setIsHandRaised(next);
    if (next) {
      onToast('Hand raised! Dr. Aris Thorne notified.', 'Classroom Queue');
      // Simulated teacher response after 1.5 seconds
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          {
            id: 'm-' + Date.now(),
            sender: 'Dr. Aris Thorne',
            senderRole: 'Instructor',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
            text: 'Alex, you have the floor! Feel free to unmute and ask your question regarding the 3D model.',
            timestamp: 'Just now',
            isTeacher: true,
          },
        ]);
        sound.playSound('alert');
      }, 1400);
    } else {
      onToast('Hand lowered.', 'Classroom Queue');
    }
  };

  // ---------------------------------------------------------------------------
  // Peer Mute & Hand Raise Controls
  // ---------------------------------------------------------------------------
  const handleTogglePeerMute = (peerId: string) => {
    sound.playSound('click');
    const targetPeer = peers.find((p) => p.id === peerId);
    if (!targetPeer) return;

    const isCurrentlyMuted = targetPeer.audioOn === false || targetPeer.status === 'Muted';
    const newAudioOn = isCurrentlyMuted; // Toggle: if muted -> unmute, if active -> mute
    const newStatus: Peer['status'] = newAudioOn
      ? (targetPeer.role.includes('Host') ? 'Host' : 'Active')
      : 'Muted';

    const updated = peers.map((p) =>
      p.id === peerId ? { ...p, audioOn: newAudioOn, status: newStatus } : p
    );
    onUpdatePeers(updated);
    onToast(
      newAudioOn ? `Unmuted ${targetPeer.name}` : `Muted ${targetPeer.name}`,
      'Peer Audio'
    );
  };

  const handleTogglePeerHand = (peerId: string) => {
    sound.playSound('hand_raise');
    const targetPeer = peers.find((p) => p.id === peerId);
    if (!targetPeer) return;

    const newHandRaised = !targetPeer.handRaised;
    const updated = peers.map((p) =>
      p.id === peerId ? { ...p, handRaised: newHandRaised } : p
    );
    onUpdatePeers(updated);

    if (newHandRaised) {
      onToast(`${targetPeer.name} raised hand in classroom!`, 'Peer Raised Hand');
      // Post interactive peer notification in room chat
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          {
            id: 'm-' + Date.now(),
            sender: targetPeer.name,
            senderRole: targetPeer.role,
            avatar: targetPeer.avatar,
            text: `✋ Raised hand to participate in the active simulation!`,
            timestamp: 'Just now',
          },
        ]);
        sound.playSound('alert');
      }, 1000);
    } else {
      onToast(`${targetPeer.name} lowered hand`, 'Peer Hand Lowered');
    }
  };

  const allPeersMuted = peers.every((p) => p.audioOn === false || p.status === 'Muted');
  const handleToggleAllPeersMute = () => {
    sound.playSound('click');
    const targetAudio = allPeersMuted;
    const updated = peers.map((p) => ({
      ...p,
      audioOn: targetAudio,
      status: (targetAudio ? (p.role.includes('Host') ? 'Host' : 'Active') : 'Muted') as Peer['status'],
    }));
    onUpdatePeers(updated);
    onToast(
      targetAudio ? 'Unmuted all peers in the room' : 'Muted all peers in the room',
      'Classroom Moderation'
    );
  };

  // ---------------------------------------------------------------------------
  // 3D Scene Manipulation Buttons
  // ---------------------------------------------------------------------------
  const rotate3D = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!activeGroupRef.current) return;
    sound.playSound('click');
    if (direction === 'left') activeGroupRef.current.rotation.y -= 0.5;
    if (direction === 'right') activeGroupRef.current.rotation.y += 0.5;
    if (direction === 'up') activeGroupRef.current.rotation.x -= 0.5;
    if (direction === 'down') activeGroupRef.current.rotation.x += 0.5;
  };

  const zoomCamera = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    sound.playSound('click');
    const step = direction === 'in' ? -1 : 1;
    cameraRef.current.position.z = Math.max(3, Math.min(12, cameraRef.current.position.z + step));
  };

  const reset3D = () => {
    sound.playSound('click');
    if (cameraRef.current) cameraRef.current.position.set(0, 1.8, 6.5);
    if (activeGroupRef.current) activeGroupRef.current.rotation.set(0, 0, 0);
    onToast('3D Camera view reset', 'Spatial Engine');
  };

  const triggerAction = (action: string) => {
    sound.playSound('pop');
    if (action === 'photon') {
      onToast('Simulating photon emission! Electron jumped energy orbital.', 'Quantum Simulation');
      if (activeGroupRef.current) {
        activeGroupRef.current.scale.set(1.2, 1.2, 1.2);
        setTimeout(() => {
          if (activeGroupRef.current) activeGroupRef.current.scale.set(1, 1, 1);
        }, 600);
      }
    } else if (action === 'gravity') {
      const next = !zeroGActive;
      setZeroGActive(next);
      onToast(next ? 'Zero-G physics field activated!' : 'Standard gravitational orbit restored.', 'Physics Lab');
    } else if (action === 'dna') {
      onToast('DNA unwinding & replication sequence initiated.', 'Biotech Lab');
      if (activeGroupRef.current) {
        activeGroupRef.current.rotation.y += 1.5;
      }
    } else if (action === 'gradient') {
      onToast('Calculated multivariable gradient vector: ∇f = [∂f/∂x, ∂f/∂y]', 'Calculus 3D Plot');
    }
  };

  // ---------------------------------------------------------------------------
  // Send Live Chat Message & Smart Bot Responses
  // ---------------------------------------------------------------------------
  const handleSendMessage = () => {
    if (!inputChat.trim()) return;
    sound.playSound('pop');
    const userMsgText = inputChat.trim();
    const isTutorUser = userRole === 'tutor';

    const newMsg: ChatMessage = isTutorUser
      ? {
          id: 'm-' + Date.now(),
          sender: 'Dr. Aris Thorne (Instructor Host)',
          senderRole: 'Instructor',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
          text: userMsgText,
          timestamp: 'Just now',
          isTeacher: true,
        }
      : {
          id: 'm-' + Date.now(),
          sender: 'Alex Morgan (You)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          text: userMsgText,
          timestamp: 'Just now',
        };

    setMessages((prev) => [...prev, newMsg]);
    setInputChat('');

    // Responsive instructor / classmate reply
    setTimeout(() => {
      if (isTutorUser) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'm-' + Date.now() + '-reply',
            sender: 'Liam Vance (Grade 8)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
            text: 'Thank you Dr. Thorne! We are rotating the 3D model and observing the excitation wavelength now.',
            timestamp: 'Just now',
          },
        ]);
        sound.playSound('alert');
      } else {
        let replyText = `Great question regarding that topic, Alex! Notice how the field vectors align with the gradient steepness.`;
        if (userMsgText.toLowerCase().includes('electron') || userMsgText.toLowerCase().includes('quantum')) {
          replyText = `Exactly right! In quantum mechanics, electrons exist in probabilistic orbital clouds rather than fixed planar rings.`;
        } else if (userMsgText.toLowerCase().includes('orbit') || userMsgText.toLowerCase().includes('gravity')) {
          replyText = `Kepler's Second Law shows that planets sweep equal areas in equal times, moving fastest at perihelion!`;
        } else if (userMsgText.toLowerCase().includes('homework') || userMsgText.toLowerCase().includes('quiz')) {
          replyText = `You can submit your solutions in the Assignments & Locker tab for immediate automated grading and feedback.`;
        }
        setMessages((prev) => [
          ...prev,
          {
            id: 'm-' + Date.now() + '-reply',
            sender: 'Dr. Aris Thorne',
            senderRole: 'Instructor',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
            text: replyText,
            timestamp: 'Just now',
            isTeacher: true,
          },
        ]);
        sound.playSound('alert');
      }
    }, 1200);
  };

  const handleMuteAll = () => {
    sound.playSound('click');
    onUpdatePeers(
      peers.map((p) => (p.status !== 'Host' ? { ...p, audioOn: false, status: 'Muted' as const } : p))
    );
    onToast('Muted audio microphone for all student participants', 'Host Action');
  };

  const handleLowerAllHands = () => {
    sound.playSound('click');
    onUpdatePeers(peers.map((p) => ({ ...p, handRaised: false })));
    onToast('Lowered all student hand raise queues', 'Host Action');
  };

  return (
    <section className="space-y-6">
      {/* Tutor Host Command Bar */}
      {userRole === 'tutor' && (
        <div className="glass-panel p-3.5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>👑 Instructor Host Controls:</span>
            </span>
            <span className="text-xs text-slate-300 hidden md:inline">
              You are actively directing this 3D spatial room for all students.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleMuteAll}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center gap-1"
            >
              <MicOff size={13} />
              <span>Mute All Students</span>
            </button>

            <button
              onClick={handleLowerAllHands}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center gap-1"
            >
              <Hand size={13} />
              <span>Lower All Hands</span>
            </button>

            <button
              onClick={() => {
                setWhiteboardOpen(true);
                sound.playSound('pop');
                onToast('Broadcasting live whiteboard canvas to all student feeds', 'Whiteboard Broadcast');
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-indigo-600/30"
            >
              <span>Broadcast Whiteboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Control Bar for Room & Call */}
      <div className="glass-panel p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live Spatial Room:</span>
            <span className="text-white font-heading font-semibold">
              {currentPod === 'toddler'
                ? 'Toddler Discovery & Sensory Lab'
                : currentPod === 'explorer'
                ? 'Grade 4 Science Exploration Pod'
                : 'Grade 8 Advanced Physics & Mathematics'}
            </span>
          </span>
          <span className="text-xs text-slate-400 hidden md:inline">
            Host: <strong className="text-slate-200">Dr. Aris Thorne</strong>
          </span>
        </div>

        {/* Live Call Control Actions */}
        <div className="flex items-center space-x-2">
          {/* Mic Toggle */}
          <button
            onClick={toggleMic}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition border ${
              isMicMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            {isMicMuted ? (
              <MicOff size={15} className="text-rose-400" />
            ) : (
              <Mic size={15} className="text-emerald-400" />
            )}
            <span className="hidden sm:inline">{isMicMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Cam Toggle */}
          <button
            onClick={toggleCam}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition border ${
              !isCamActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            {!isCamActive ? (
              <VideoOff size={15} className="text-rose-400" />
            ) : (
              <Video size={15} className="text-emerald-400" />
            )}
            <span className="hidden sm:inline">{isCamActive ? 'Stop Cam' : 'Start Cam'}</span>
          </button>

          {/* Screen Share / Whiteboard */}
          <button
            onClick={toggleScreenShare}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-lg ${
              isScreenSharing
                ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-indigo-600 text-white border border-slate-700'
            }`}
          >
            <Monitor size={15} />
            <span className="hidden sm:inline">{isScreenSharing ? 'Sharing' : 'Share Screen'}</span>
          </button>

          {/* Raise Hand */}
          <button
            onClick={handleRaiseHand}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition border ${
              isHandRaised
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
            }`}
          >
            <Hand size={15} />
            <span className="hidden sm:inline">{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition border ${
              isChatOpen
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <MessageSquare size={15} />
            <span className="hidden sm:inline">Chat ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Spatial Canvas + Video Grid & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Center Column: 3D Simulation & Interactive Tools (7 or 8 Cols) */}
        <div className={isChatOpen ? 'lg:col-span-8 space-y-4' : 'lg:col-span-9 space-y-4'}>
          {/* Spatial 3D Canvas Box */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl">
            {/* Simulation Picker Tabs */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => {
                  setSimMode('atom');
                  sound.playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  simMode === 'atom' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Atom size={14} />
                <span>Quantum Atom</span>
              </button>
              <button
                onClick={() => {
                  setSimMode('dna');
                  sound.playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  simMode === 'dna' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dna size={14} />
                <span>DNA Helix</span>
              </button>
              <button
                onClick={() => {
                  setSimMode('calculus');
                  sound.playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  simMode === 'calculus' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Binary size={14} />
                <span>Calculus 3D</span>
              </button>
              <button
                onClick={() => {
                  setSimMode('gravity');
                  sound.playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  simMode === 'gravity' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe2 size={14} />
                <span>Gravity Lab</span>
              </button>
            </div>

            {/* Canvas Mount Container */}
            <div
              ref={canvasContainerRef}
              className="w-full h-[460px] bg-slate-950 relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            />

            {/* Embedded Whiteboard when active */}
            <WhiteboardOverlay
              isOpen={whiteboardOpen}
              onClose={() => setWhiteboardOpen(false)}
              broadcasterName="Alex Morgan (You)"
            />

            {/* Floating 3D Navigation Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => rotate3D('left')}
                className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
                title="Rotate Left"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => rotate3D('right')}
                className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
                title="Rotate Right"
              >
                <RotateCw size={15} />
              </button>
              <button
                onClick={() => zoomCamera('in')}
                className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => zoomCamera('out')}
                className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`p-2 rounded-xl transition ${
                  isAutoRotating ? 'text-indigo-400 bg-indigo-950/60' : 'text-slate-400 hover:text-white'
                }`}
                title={isAutoRotating ? 'Pause Rotation' : 'Auto Rotate'}
              >
                {isAutoRotating ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                onClick={() => setIsWireframe(!isWireframe)}
                className={`px-2 py-1 text-[11px] rounded-xl font-bold transition ${
                  isWireframe ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Wireframe Mode"
              >
                Mesh
              </button>
              <button
                onClick={reset3D}
                className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
                title="Reset Camera"
              >
                <Maximize2 size={15} />
              </button>
            </div>

            {/* Current Simulation Info Badge */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center space-x-2 text-[11px] bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {simMode === 'atom' && 'Quantum Energy Level n=3 | 16 Nucleons'}
                {simMode === 'dna' && 'Double Helix B-DNA | 24 Base Pairs'}
                {simMode === 'calculus' && 'f(x,y) = sin(r)*cos(x) Surface'}
                {simMode === 'gravity' && 'N-Body Gravitational Dynamics'}
              </span>
            </div>
          </div>

          {/* Interactive Lab Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              onClick={() => triggerAction('photon')}
              className="glass-panel p-3.5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition flex items-center space-x-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Photon Emission</h4>
                <p className="text-[10px] text-slate-400">Excitation transition</p>
              </div>
            </button>

            <button
              onClick={() => triggerAction('gravity')}
              className="glass-panel p-3.5 rounded-2xl border border-slate-800 hover:border-pink-500/50 transition flex items-center space-x-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <Globe2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Toggle Zero-G</h4>
                <p className="text-[10px] text-slate-400">Orbital kinematics</p>
              </div>
            </button>

            <button
              onClick={() => triggerAction('dna')}
              className="glass-panel p-3.5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition flex items-center space-x-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <Dna size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">DNA Unwind</h4>
                <p className="text-[10px] text-slate-400">Helicase enzyme</p>
              </div>
            </button>

            <button
              onClick={() => triggerAction('gradient')}
              className="glass-panel p-3.5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition flex items-center space-x-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <Binary size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Vector ∇f Gradient</h4>
                <p className="text-[10px] text-slate-400">Tangent planes</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Live Video Streams & Classroom Chat (4 or 5 Cols) */}
        <div className={isChatOpen ? 'lg:col-span-4 space-y-4' : 'lg:col-span-3 space-y-4'}>
          {/* Active Call Streams Header & Controls */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Video size={15} className="text-indigo-400" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <span>Virtual Hall</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {peers.length + 1} Active
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">100+ High Capacity Mesh</p>
                </div>
              </div>

              {/* View Switcher: Grid vs Auditorium */}
              <div className="flex items-center space-x-1.5">
                <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-0.5 flex text-[10px] font-semibold">
                  <button
                    onClick={() => {
                      setClassViewMode('grid');
                      sound.playSound('click');
                    }}
                    className={`px-2 py-1 rounded-lg transition ${
                      classViewMode === 'grid'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grid View
                  </button>
                  <button
                    onClick={() => {
                      setClassViewMode('auditorium');
                      sound.playSound('click');
                    }}
                    className={`px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                      classViewMode === 'auditorium'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users size={11} />
                    <span>Auditorium (100+)</span>
                  </button>
                </div>

                <button
                  onClick={handleToggleAllPeersMute}
                  className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition flex items-center space-x-1 border border-slate-700"
                  title={allPeersMuted ? 'Unmute all peers' : 'Mute all attendees'}
                >
                  {allPeersMuted ? <Mic size={11} className="text-emerald-400" /> : <MicOff size={11} className="text-rose-400" />}
                  <span className="hidden sm:inline">{allPeersMuted ? 'Unmute' : 'Mute All'}</span>
                </button>
              </div>
            </div>

            {/* Filter, Search & Hand Queue Bar */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={attendeeSearch}
                  onChange={(e) => {
                    setAttendeeSearch(e.target.value);
                    setAttendeePage(1);
                  }}
                  placeholder="Search 100+ students..."
                  className="w-full bg-slate-900 border border-slate-700/70 rounded-xl pl-7 pr-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={podFilter}
                onChange={(e) => {
                  setPodFilter(e.target.value);
                  setAttendeePage(1);
                }}
                className="bg-slate-900 border border-slate-700/70 text-[10px] text-white rounded-xl px-2 py-1 focus:outline-none"
              >
                <option value="all">All Pods</option>
                <option value="academy">Academy (10-15)</option>
                <option value="explorer">Explorer (6-9)</option>
                <option value="toddler">Toddler (1-5)</option>
                <option value="hands">Raised Hands</option>
              </select>

              {peers.filter(p => p.handRaised).length > 0 && (
                <button
                  onClick={() => setShowHandQueue(!showHandQueue)}
                  className="px-2 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition flex items-center gap-1 animate-pulse"
                >
                  <Hand size={10} />
                  <span>{peers.filter(p => p.handRaised).length}</span>
                </button>
              )}
            </div>

            {/* Hand Raised Queue Popover */}
            {showHandQueue && (
              <div className="p-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                  <span className="flex items-center gap-1">
                    <Hand size={11} />
                    <span>Raised Hand Priority Queue</span>
                  </span>
                  <button
                    onClick={() => {
                      const updated = peers.map(p => ({ ...p, handRaised: false }));
                      onUpdatePeers(updated);
                      setIsHandRaised(false);
                      onToast('All student hands lowered', 'Classroom Moderation');
                    }}
                    className="text-[9px] text-slate-400 hover:text-white underline"
                  >
                    Lower All
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                  {peers.filter(p => p.handRaised).map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-[10px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-amber-400 font-bold">#{idx + 1}</span>
                        <span className="text-slate-200 font-semibold truncate max-w-[90px]">{p.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleTogglePeerHand(p.id);
                          onToast(`Called on ${p.name} to speak`, 'Classroom Turn');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px]"
                      >
                        Invite to Speak
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 1: GRID MODE (PAGINATED FOR 100+ STUDENTS) */}
            {classViewMode === 'grid' && (
              <div className="space-y-2">
                {/* Feeds Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {/* Self Tile (Alex) */}
                  <div
                    className={`relative bg-slate-900 rounded-2xl overflow-hidden border transition duration-300 group h-24 ${
                      isHandRaised
                        ? 'border-amber-400 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20'
                        : 'border-slate-800'
                    }`}
                  >
                    {isCamActive ? (
                      useRealWebcam ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform -scale-x-100"
                        />
                      ) : (
                        <img
                          src={userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop'}
                          alt="Self avatar"
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500">
                        <VideoOff size={18} />
                        <span className="text-[9px] mt-0.5">Cam Off</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

                    {isHandRaised && (
                      <div className="absolute top-1.5 left-1.5 z-20 bg-amber-500 text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Hand size={8} />
                        <span>HAND</span>
                      </div>
                    )}

                    <div className="absolute top-1.5 right-1.5 flex items-center space-x-1 z-20">
                      <button
                        onClick={toggleMic}
                        className={`p-1 rounded-lg backdrop-blur-md transition ${
                          isMicMuted ? 'bg-rose-500 text-white' : 'bg-black/60 text-emerald-400'
                        }`}
                        title={isMicMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMicMuted ? <MicOff size={10} /> : <Mic size={10} />}
                      </button>
                      <button
                        onClick={handleRaiseHand}
                        className={`p-1 rounded-lg backdrop-blur-md transition ${
                          isHandRaised ? 'bg-amber-500 text-slate-950' : 'bg-black/60 text-slate-300'
                        }`}
                        title={isHandRaised ? 'Lower hand' : 'Raise hand'}
                      >
                        <Hand size={10} />
                      </button>
                    </div>

                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white">
                      <span className="font-semibold truncate">You ({userProfile.name.split(' ')[0]})</span>
                      <span className={`w-2 h-2 rounded-full ${isMicMuted ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                    </div>
                  </div>

                  {/* Filtered & Paginated Peer Tiles */}
                  {(() => {
                    const filtered = peers.filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(attendeeSearch.toLowerCase());
                      const matchesPod =
                        podFilter === 'all'
                          ? true
                          : podFilter === 'hands'
                          ? !!p.handRaised
                          : p.gradePod === podFilter;
                      return matchesSearch && matchesPod;
                    });

                    const pageSize = 5;
                    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
                    const startIndex = (attendeePage - 1) * pageSize;
                    const displayed = filtered.slice(startIndex, startIndex + pageSize);

                    return (
                      <>
                        {displayed.map((peer) => {
                          const isMuted = peer.audioOn === false || peer.status === 'Muted';
                          return (
                            <div
                              key={peer.id}
                              className={`relative bg-slate-900 rounded-2xl overflow-hidden border transition duration-300 group h-24 ${
                                peer.handRaised
                                  ? 'border-amber-400 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20'
                                  : 'border-slate-800'
                              }`}
                            >
                              <img
                                src={peer.avatar}
                                alt={peer.name}
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

                              {peer.handRaised && (
                                <div className="absolute top-1.5 left-1.5 z-20 bg-amber-500 text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <Hand size={8} />
                                  <span>HAND</span>
                                </div>
                              )}

                              <div className="absolute top-1.5 right-1.5 flex items-center space-x-1 z-20">
                                <button
                                  onClick={() => handleTogglePeerMute(peer.id)}
                                  className={`p-1 rounded-lg backdrop-blur-md transition ${
                                    isMuted ? 'bg-rose-500 text-white' : 'bg-black/60 text-emerald-400'
                                  }`}
                                  title={isMuted ? `Unmute ${peer.name}` : `Mute ${peer.name}`}
                                >
                                  {isMuted ? <MicOff size={10} /> : <Mic size={10} />}
                                </button>
                                <button
                                  onClick={() => handleTogglePeerHand(peer.id)}
                                  className={`p-1 rounded-lg backdrop-blur-md transition ${
                                    peer.handRaised ? 'bg-amber-500 text-slate-950' : 'bg-black/60 text-slate-300'
                                  }`}
                                  title={peer.handRaised ? 'Lower hand' : 'Raise hand'}
                                >
                                  <Hand size={10} />
                                </button>
                              </div>

                              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white">
                                <span className="font-semibold truncate flex items-center gap-1 max-w-[85px]">
                                  {peer.name.split(' ')[0]}
                                  {peer.status === 'Host' && (
                                    <span className="text-[7px] bg-indigo-600 px-1 rounded font-bold">Host</span>
                                  )}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${isMuted ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>

                {/* Pagination Controls */}
                {(() => {
                  const filtered = peers.filter(p => {
                    const matchesSearch = p.name.toLowerCase().includes(attendeeSearch.toLowerCase());
                    const matchesPod =
                      podFilter === 'all'
                        ? true
                        : podFilter === 'hands'
                        ? !!p.handRaised
                        : p.gradePod === podFilter;
                    return matchesSearch && matchesPod;
                  });
                  const pageSize = 5;
                  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

                  return (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                      <span>Showing {Math.min(filtered.length, 6)} of {filtered.length + 1} attendees</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          disabled={attendeePage <= 1}
                          onClick={() => setAttendeePage(p => Math.max(1, p - 1))}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                        >
                          <ChevronLeft size={12} />
                        </button>
                        <span className="font-mono text-slate-300 font-bold">{attendeePage} / {totalPages}</span>
                        <button
                          disabled={attendeePage >= totalPages}
                          onClick={() => setAttendeePage(p => Math.min(totalPages, p + 1))}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                        >
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* VIEW 2: HIGH-CAPACITY AUDITORIUM AMPHITHEATER (100+ SEATS) */}
            {classViewMode === 'auditorium' && (
              <div className="space-y-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Users size={12} className="text-indigo-400" />
                    <span>Tiered Amphitheater Seating</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Mesh Synced</span>
                </div>

                {/* Stage Podium Visual */}
                <div className="w-full py-1.5 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/60 rounded-xl border border-indigo-500/40 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                    🏛️ Main Lecture Stage • Dr. Aris Thorne
                  </span>
                </div>

                {/* 100+ Visual Seats Cloud */}
                <div className="flex flex-wrap gap-1 justify-center max-h-[220px] overflow-y-auto p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  {/* Alex (You) */}
                  <div
                    title="You (Alex Morgan) - Active"
                    className="w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-bold text-slate-950 cursor-pointer shadow-md"
                  >
                    You
                  </div>

                  {peers.map((peer, idx) => {
                    const isMuted = peer.audioOn === false || peer.status === 'Muted';
                    return (
                      <div
                        key={peer.id}
                        title={`${peer.name} (${peer.role}) - ${peer.status}${peer.handRaised ? ' [Hand Raised]' : ''}`}
                        onClick={() => {
                          sound.playSound('click');
                          onToast(`${peer.name} (${peer.role}) • Status: ${peer.status}`, 'Auditorium Peer');
                        }}
                        className={`w-4 h-4 rounded-full cursor-pointer transition transform hover:scale-150 relative ${
                          peer.handRaised
                            ? 'bg-amber-400 ring-2 ring-amber-500 animate-pulse'
                            : peer.status === 'Host'
                            ? 'bg-indigo-500 ring-2 ring-indigo-400'
                            : !isMuted
                            ? 'bg-emerald-400'
                            : 'bg-slate-700 opacity-60'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Speaking</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Hand Raised</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700"></span> Muted</span>
                  </div>
                  <span className="font-mono text-indigo-300 font-bold">{peers.length + 1} Seats Filled</span>
                </div>
              </div>
            )}
          </div>

          {/* Integrated Real-Time Live Session Chat Sidebar */}
          {isChatOpen && (
            <div className="h-[380px]">
              <LiveSessionChatSidebar
                userProfile={userProfile}
                userRole={userRole}
                isOpen={isChatOpen}
                isDocked={true}
                totalAttendeesCount={peers.length + 1}
                onToast={onToast}
                onHandRaiseToggle={handleRaiseHand}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

