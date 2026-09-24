import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  Sliders,
  X
} from 'lucide-react';
import { BackgroundTheme } from '../types';
import { sound } from '../utils/audio';

interface ThemeColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BackgroundTheme;
  onSelectTheme: (theme: BackgroundTheme) => void;
  onToast: (msg: string, title?: string) => void;
}

export const THEME_PRESETS: BackgroundTheme[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Deep Space',
    hex: '#090D16',
    secondaryHex: '#111827',
    ambientGlow: 'rgba(99, 102, 241, 0.18)',
    borderAccent: 'rgba(99, 102, 241, 0.3)',
    isDark: true,
  },
  {
    id: 'midnight',
    name: 'Cosmic Royal Navy',
    hex: '#050A24',
    secondaryHex: '#0B133A',
    ambientGlow: 'rgba(59, 130, 246, 0.22)',
    borderAccent: 'rgba(59, 130, 246, 0.35)',
    isDark: true,
  },
  {
    id: 'emerald',
    name: 'Cyberpunk Emerald',
    hex: '#021811',
    secondaryHex: '#042A1E',
    ambientGlow: 'rgba(16, 185, 129, 0.22)',
    borderAccent: 'rgba(16, 185, 129, 0.35)',
    isDark: true,
  },
  {
    id: 'amethyst',
    name: 'Amethyst Nebula',
    hex: '#130722',
    secondaryHex: '#210C38',
    ambientGlow: 'rgba(168, 85, 247, 0.22)',
    borderAccent: 'rgba(168, 85, 247, 0.35)',
    isDark: true,
  },
  {
    id: 'amber',
    name: 'Sunset Amber Glow',
    hex: '#180B05',
    secondaryHex: '#2A1308',
    ambientGlow: 'rgba(245, 158, 11, 0.20)',
    borderAccent: 'rgba(245, 158, 11, 0.35)',
    isDark: true,
  },
  {
    id: 'ocean',
    name: 'Oceanic Sapphire',
    hex: '#031427',
    secondaryHex: '#072443',
    ambientGlow: 'rgba(6, 182, 212, 0.22)',
    borderAccent: 'rgba(6, 182, 212, 0.35)',
    isDark: true,
  },
  {
    id: 'crimson',
    name: 'Velvet Crimson',
    hex: '#19060F',
    secondaryHex: '#2B0A1A',
    ambientGlow: 'rgba(244, 63, 94, 0.20)',
    borderAccent: 'rgba(244, 63, 94, 0.35)',
    isDark: true,
  },
  {
    id: 'slate',
    name: 'Modern Carbon Slate',
    hex: '#0B1120',
    secondaryHex: '#1E293B',
    ambientGlow: 'rgba(148, 163, 184, 0.16)',
    borderAccent: 'rgba(148, 163, 184, 0.30)',
    isDark: true,
  },
];

export const ThemeColorModal: React.FC<ThemeColorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  onToast,
}) => {
  const [customHex, setCustomHex] = useState<string>(currentTheme.hex);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: BackgroundTheme) => {
    sound.playSound('click');
    onSelectTheme(preset);
    onToast(`Applied theme: ${preset.name}`, 'Background Updated');
  };

  const handleApplyCustom = () => {
    sound.playSound('success');
    const customTheme: BackgroundTheme = {
      id: `custom-${Date.now()}`,
      name: 'Custom Palette',
      hex: customHex,
      secondaryHex: '#141E33',
      ambientGlow: 'rgba(99, 102, 241, 0.20)',
      borderAccent: 'rgba(255, 255, 255, 0.15)',
      isDark: true,
    };
    onSelectTheme(customTheme);
    onToast(`Custom background color applied (${customHex})`, 'Custom Theme');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Background Color & Atmosphere</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-500/30">
                  Live Atmosphere
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Customize the ambient spatial background and viewport canvas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 px-6 pt-3 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'presets'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} />
            <span>Curated Atmosphere Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'custom'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders size={14} />
            <span>Custom Hex Picker</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[420px] overflow-y-auto space-y-4">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-2 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isSelected = currentTheme.hex === preset.hex;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3.5 rounded-2xl border transition text-left flex flex-col justify-between h-28 relative overflow-hidden group ${
                      isSelected
                        ? 'border-indigo-400 ring-2 ring-indigo-500/40 shadow-xl'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                  >
                    {/* Visual Ambient Glow Orb */}
                    <div
                      className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition duration-700"
                      style={{ backgroundColor: preset.ambientGlow }}
                    />

                    <div className="flex items-center justify-between relative z-10">
                      <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: preset.secondaryHex }}></span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs shadow-md">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 mt-auto">
                      <p className="text-xs font-bold text-white">{preset.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{preset.hex}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  Select Hex Background Color:
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-slate-700 bg-transparent p-1"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase"
                    placeholder="#0B0F19"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div
                className="p-6 rounded-2xl border border-slate-700/80 text-center space-y-2 relative overflow-hidden"
                style={{ backgroundColor: customHex }}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center text-white text-xs">
                  ✨
                </div>
                <h4 className="text-sm font-bold text-white">Live Background Color Preview</h4>
                <p className="text-xs text-slate-300">
                  All cards, 3D spatial models, and texts will render with contrast-adjusted glass layers.
                </p>
              </div>

              <button
                onClick={handleApplyCustom}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Check size={14} />
                <span>Apply Custom Color</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              handleApplyPreset(THEME_PRESETS[0]);
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <RotateCcw size={13} />
            <span>Reset to Default Obsidian</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
