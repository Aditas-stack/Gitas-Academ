import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Film, AlertCircle } from 'lucide-react';
import { LessonVideo } from '../types';

interface VideoPlayerProps {
  video: LessonVideo;
  className?: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, className = '', autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Helper to detect and format embed URLs
  const getEmbedInfo = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();

    // YouTube matches: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
    const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return {
        type: 'youtube',
        src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=${autoPlay ? 1 : 0}&rel=0`,
      };
    }

    // Vimeo matches: vimeo.com/ID
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: 'vimeo',
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoPlay ? 1 : 0}`,
      };
    }

    // Direct MP4 / WebM
    if (cleanUrl.match(/\.(mp4|webm|ogg)$/i) || cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:video')) {
      return {
        type: 'video',
        src: cleanUrl,
      };
    }

    return {
      type: 'generic_iframe',
      src: cleanUrl,
    };
  };

  const embedInfo = getEmbedInfo(video.url);

  return (
    <div className={`rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex flex-col ${className}`}>
      {/* Video Display Area */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
        {embedInfo?.type === 'youtube' || embedInfo?.type === 'vimeo' ? (
          <iframe
            src={embedInfo.src}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : embedInfo?.type === 'video' ? (
          <video
            src={embedInfo.src}
            controls
            autoPlay={autoPlay}
            poster={video.thumbnailUrl}
            className="w-full h-full object-contain"
            onError={() => setHasError(true)}
          />
        ) : hasError || !video.url ? (
          /* Fallback UI if video link unavailable or offline */
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3">
            <Film size={40} className="text-indigo-400 opacity-60" />
            <p className="text-xs font-semibold text-slate-300">Video Demonstration Preview</p>
            <p className="text-[11px] max-w-xs text-slate-500">
              Interactive video simulation ready. You can replace this with any live YouTube or MP4 link in the Lesson Studio.
            </p>
          </div>
        ) : (
          /* Generic Iframe / Embedded player */
          <iframe
            src={embedInfo?.src}
            title={video.title}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        )}
      </div>

      {/* Video Meta Info Bar */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Film size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
            <p className="text-[10px] text-slate-400 flex items-center gap-2">
              <span>{video.durationMinutes} min runtime</span>
              {video.description && <span>• {video.description}</span>}
            </p>
          </div>
        </div>

        {video.url && (
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition text-[11px] flex items-center gap-1 flex-shrink-0"
            title="Open video in new tab"
          >
            <span className="hidden sm:inline">Source</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Topic Markers if present */}
      {video.topicMarkers && video.topicMarkers.length > 0 && (
        <div className="px-3.5 pb-3 bg-slate-900/90 flex flex-wrap gap-1.5 border-t border-slate-800/50 pt-2">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mr-1 py-0.5">
            Key Chapters:
          </span>
          {video.topicMarkers.map((marker, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 border border-slate-700/60"
            >
              <span className="text-indigo-400">{marker.time}</span>
              <span className="text-slate-300 font-sans">{marker.title}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
