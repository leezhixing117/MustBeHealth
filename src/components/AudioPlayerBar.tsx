import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Waves, 
  Bell, 
  Trees, 
  Music,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { SoundscapeItem } from '../types';
import { SOUNDSCAPES } from '../data/mockData';
import { soundEngine } from '../utils/soundEngine';

interface AudioPlayerBarProps {
  activeSound: SoundscapeItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onSelectSound: (sound: SoundscapeItem) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  activeSound,
  isPlaying,
  onTogglePlay,
  onStop,
  onSelectSound,
}) => {
  if (!activeSound) return null;

  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);

  const getSoundIcon = (id: string) => {
    switch (id) {
      case 'sound-rain':
        return <CloudRain className="w-4 h-4 text-emerald-400" />;
      case 'sound-ocean':
        return <Waves className="w-4 h-4 text-teal-400" />;
      case 'sound-bowl':
        return <Bell className="w-4 h-4 text-amber-400" />;
      case 'sound-forest':
        return <Trees className="w-4 h-4 text-emerald-300" />;
      default:
        return <Music className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full sm:w-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl rounded-2xl p-3.5 space-y-2.5">
        {/* Top active track info & main control */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
              {getSoundIcon(activeSound.id)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{activeSound.name}</p>
              <p className="text-[10px] text-slate-400 truncate">正念白噪音放鬆中</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onTogglePlay}
              className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title={isPlaying ? '暫停' : '播放'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={onStop}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="停止並關閉"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable volume & quick switcher */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
            {/* Volume slider */}
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 w-7 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Quick sound switch pill buttons */}
            <div className="flex flex-wrap gap-1.5">
              {SOUNDSCAPES.map((snd) => {
                const isCur = snd.id === activeSound.id;
                return (
                  <button
                    key={snd.id}
                    onClick={() => onSelectSound(snd)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                      isCur
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {snd.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
