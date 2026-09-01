import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Heart,
  Clock,
  Music,
  Wind
} from 'lucide-react';
import { GuidedMeditation } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { speechEngine } from '../utils/speechEngine';

interface MeditationModalProps {
  meditation: GuidedMeditation | null;
  onClose: () => void;
  onComplete?: (id: string) => void;
}

export const MeditationModal: React.FC<MeditationModalProps> = ({
  meditation,
  onClose,
  onComplete,
}) => {
  if (!meditation) return null;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(
    meditation.stages[0]?.durationSeconds || 60
  );
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStage = meditation.stages[currentStageIndex];
  const totalStages = meditation.stages.length;

  const playStageVoice = (stageIdx: number) => {
    const stage = meditation.stages[stageIdx];
    if (!stage || isVoiceMuted) return;
    const textToSpeak = `${stage.title}。${stage.instruction}。${stage.voiceGuidance || ''}`;
    speechEngine.speak(textToSpeak, {
      rate: 0.9,
      pitch: 1.0,
    });
  };

  // Start soundscape and speech on open
  useEffect(() => {
    soundEngine.initContext();
    if (isPlaying && !isAudioMuted) {
      soundEngine.playSoundscape(meditation.soundType, `med-${meditation.id}`);
    } else {
      soundEngine.stopSoundscape();
    }

    if (isPlaying && !isVoiceMuted && currentStage) {
      playStageVoice(currentStageIndex);
    } else {
      speechEngine.cancel();
    }

    return () => {
      soundEngine.stopSoundscape();
      speechEngine.cancel();
    };
  }, [meditation.id, meditation.soundType, currentStageIndex, isVoiceMuted]);

  // Stage timer countdown
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (currentStageIndex + 1 < totalStages) {
            const nextIdx = currentStageIndex + 1;
            setCurrentStageIndex(nextIdx);
            soundEngine.playChime(528, 1.5);
            return meditation.stages[nextIdx].durationSeconds;
          } else {
            // All stages complete
            setIsCompleted(true);
            setIsPlaying(false);
            speechEngine.cancel();
            soundEngine.playChime(660, 2.5);
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.5 },
            });
            if (onComplete) onComplete(meditation.id);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentStageIndex, totalStages, isCompleted, meditation, onComplete]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      soundEngine.stopSoundscape();
      speechEngine.pause();
    } else {
      setIsPlaying(true);
      soundEngine.initContext();
      if (!isAudioMuted) {
        soundEngine.playSoundscape(meditation.soundType, `med-${meditation.id}`);
      }
      if (!isVoiceMuted) {
        if (speechEngine.isSpeaking()) {
          speechEngine.resume();
        } else {
          playStageVoice(currentStageIndex);
        }
      }
    }
  };

  const handleToggleMute = () => {
    if (isAudioMuted) {
      setIsAudioMuted(false);
      if (isPlaying) {
        soundEngine.playSoundscape(meditation.soundType, `med-${meditation.id}`);
      }
    } else {
      setIsAudioMuted(true);
      soundEngine.stopSoundscape();
    }
  };

  const handleToggleVoice = () => {
    if (isVoiceMuted) {
      setIsVoiceMuted(false);
      if (isPlaying) {
        playStageVoice(currentStageIndex);
      }
    } else {
      setIsVoiceMuted(true);
      speechEngine.cancel();
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex + 1 < totalStages) {
      const nextIdx = currentStageIndex + 1;
      speechEngine.cancel();
      setCurrentStageIndex(nextIdx);
      setSecondsRemaining(meditation.stages[nextIdx].durationSeconds);
      soundEngine.playChime(528, 1.2);
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      const prevIdx = currentStageIndex - 1;
      speechEngine.cancel();
      setCurrentStageIndex(prevIdx);
      setSecondsRemaining(meditation.stages[prevIdx].durationSeconds);
      soundEngine.playChime(432, 1.2);
    }
  };

  const handleRestart = () => {
    speechEngine.cancel();
    setCurrentStageIndex(0);
    setSecondsRemaining(meditation.stages[0].durationSeconds);
    setIsCompleted(false);
    setIsPlaying(true);
    if (!isAudioMuted) {
      soundEngine.playSoundscape(meditation.soundType, `med-${meditation.id}`);
    }
    if (!isVoiceMuted) {
      playStageVoice(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2216]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#2C3324] text-[#FDFCF8] border border-[#8BA888]/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3D4734] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#8BA888]/30 text-[#E9F0E8] border border-[#8BA888]/40">
              {meditation.categoryLabel} · {meditation.categoryEn}
            </span>
            <span className="text-xs text-[#C9D6C8] hidden sm:inline">
              約 {meditation.durationMinutes} 分鐘
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                !isVoiceMuted
                  ? 'bg-[#8BA888]/20 text-[#8BA888] border border-[#8BA888]/40 hover:bg-[#8BA888]/30'
                  : 'text-[#A0A398] hover:text-white hover:bg-[#3D4734] border border-[#3D4734]'
              }`}
              title={isVoiceMuted ? '開啟冥想語音引導' : '關閉語音引導'}
            >
              <Volume2 className={`w-4 h-4 ${!isVoiceMuted ? 'text-[#8BA888]' : 'text-[#7A7D73]'}`} />
              <span className="hidden sm:inline">{!isVoiceMuted ? '語音引導' : '語音靜音'}</span>
            </button>
            <button
              onClick={handleToggleMute}
              className="p-2 text-[#C9D6C8] hover:text-white rounded-xl hover:bg-[#3D4734] transition-colors cursor-pointer"
              title={isAudioMuted ? '開啟聲學背景音' : '靜音背景音'}
            >
              {isAudioMuted ? <VolumeX className="w-5 h-5 text-[#D48C80]" /> : <Music className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                soundEngine.stopSoundscape();
                speechEngine.cancel();
                onClose();
              }}
              className="p-2 text-[#C9D6C8] hover:text-white rounded-xl hover:bg-[#3D4734] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
          {/* Titles */}
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {meditation.title}
            </h2>
            <p className="text-xs text-[#8BA888] font-medium tracking-wide">
              {meditation.titleEn}
            </p>
            <p className="text-xs text-[#C9D6C8] pt-1 max-w-lg mx-auto leading-relaxed">
              {meditation.subtitle}
            </p>
          </div>

          {/* Center Visualizer & Stage Card */}
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Breathing Orb Animation */}
              <div className="relative flex items-center justify-center my-4">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center">
                  {/* Glowing rings */}
                  <div
                    className={`absolute inset-0 rounded-full bg-[#8BA888]/20 transition-transform duration-4000 ease-in-out ${
                      isPlaying ? 'animate-ping opacity-30' : 'opacity-10'
                    }`}
                  />
                  <div
                    className={`absolute inset-3 rounded-full border-2 border-[#8BA888]/40 transition-transform duration-3000 ease-in-out ${
                      isPlaying ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#3D4734] to-[#8BA888]/50 flex flex-col items-center justify-center text-center p-3 shadow-inner shadow-black/30 border border-[#8BA888]/50">
                    <span className="text-[10px] text-[#C9D6C8] font-semibold uppercase tracking-wider">
                      階段 {currentStageIndex + 1} / {totalStages}
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white my-0.5">
                      {formatTime(secondsRemaining)}
                    </span>
                    <span className="text-[10px] text-[#E9F0E8]/80 line-clamp-1">
                      {currentStage?.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage Instruction & Voice Transcript */}
              <div className="bg-[#242A1E] border border-[#3D4734] p-5 sm:p-6 rounded-2xl space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs text-[#8BA888] font-bold">
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-[#8BA888]" />
                    <span>正念導引指引：{currentStage?.title}</span>
                  </div>
                  <span className="text-[11px] text-[#C9D6C8]">
                    {currentStage?.durationSeconds} 秒
                  </span>
                </div>

                <p className="text-sm font-medium text-white leading-relaxed">
                  {currentStage?.instruction}
                </p>

                <div className="pt-2 border-t border-[#3D4734]/80 text-xs text-[#C9D6C8] leading-relaxed italic bg-[#1C2216]/50 p-3 rounded-xl">
                  「{currentStage?.voiceGuidance}」
                </div>
              </div>
            </div>
          ) : (
            /* Completed Screen */
            <div className="text-center py-8 space-y-5 bg-[#242A1E] rounded-3xl border border-[#8BA888]/40 p-6 sm:p-8 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#8BA888]/20 border border-[#8BA888] flex items-center justify-center mx-auto text-[#8BA888]">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white">
                  冥想練習圓滿完成
                </h3>
                <p className="text-xs text-[#8BA888] font-semibold">
                  Meditation Session Complete · Inner Peace Restored
                </p>
                <p className="text-xs text-[#C9D6C8] max-w-md mx-auto pt-2 leading-relaxed">
                  感謝你為自己留下了這段平靜的專屬時光。將這份內在的寧靜與篤定，溫柔地帶回生活中的每一個當下。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C2216] border border-[#3D4734] text-xs text-[#E9F0E8] flex items-center justify-center gap-3">
                <Heart className="w-4 h-4 text-[#D48C80]" />
                <span>身心神經系統已完成深層調諧與平復</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 rounded-2xl bg-[#3D4734] hover:bg-[#4D5A42] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重新練習此冥想</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.stopSoundscape();
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>重返主頁面</span>
                </button>
              </div>
            </div>
          )}

          {/* Stage Step Indicators */}
          {!isCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-medium text-[#C9D6C8]">
                <span>進度 ({Math.round(((currentStageIndex + 1) / totalStages) * 100)}%)</span>
                <span>階段 {currentStageIndex + 1} / {totalStages}</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                {meditation.stages.map((stg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentStageIndex(idx);
                      setSecondsRemaining(stg.durationSeconds);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx < currentStageIndex
                        ? 'bg-[#8BA888]'
                        : idx === currentStageIndex
                        ? 'bg-white ring-2 ring-[#8BA888]/50'
                        : 'bg-[#3D4734]'
                    }`}
                    title={stg.title}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Play Controls */}
        {!isCompleted && (
          <div className="px-6 py-4 bg-[#242A1E] border-t border-[#3D4734] flex items-center justify-between">
            <button
              onClick={handlePrevStage}
              disabled={currentStageIndex === 0}
              className={`p-2.5 rounded-xl border border-[#3D4734] transition-all flex items-center gap-1 text-xs font-semibold ${
                currentStageIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-[#7A7D73]'
                  : 'text-white hover:bg-[#3D4734] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">上一階段</span>
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-6 py-3 rounded-2xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>暫停冥想</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>繼續導引</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextStage}
              disabled={currentStageIndex + 1 >= totalStages}
              className={`p-2.5 rounded-xl border border-[#3D4734] transition-all flex items-center gap-1 text-xs font-semibold ${
                currentStageIndex + 1 >= totalStages
                  ? 'opacity-40 cursor-not-allowed text-[#7A7D73]'
                  : 'text-white hover:bg-[#3D4734] cursor-pointer'
              }`}
            >
              <span className="hidden sm:inline">下一階段</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
