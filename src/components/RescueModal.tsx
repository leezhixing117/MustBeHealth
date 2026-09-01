import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Wind, 
  Compass, 
  Moon, 
  Flame,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { RescueSession } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { speechEngine } from '../utils/speechEngine';

interface RescueModalProps {
  session: RescueSession | null;
  onClose: () => void;
  onCompleteSession: (sessionId: string) => void;
}

export const RescueModal: React.FC<RescueModalProps> = ({
  session,
  onClose,
  onCompleteSession,
}) => {
  if (!session) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepTimer, setStepTimer] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Breathing sub-phase for 4-7-8: 'inhale' (4s), 'hold' (7s), 'exhale' (8s)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);

  // 5-4-3-2-1 sensory inputs
  const [checkedSensoryItems, setCheckedSensoryItems] = useState<{ [key: number]: boolean }>({});

  const currentStep = session.steps[currentStepIndex];
  const totalSteps = session.steps.length;

  const playStepVoice = (stepIdx: number) => {
    const step = session.steps[stepIdx];
    if (!step || isVoiceMuted) return;
    const text = `${step.title}。${step.instruction}`;
    speechEngine.speak(text, {
      rate: 0.95,
      pitch: 1.0,
    });
  };

  // Trigger step voice guidance and init audio
  useEffect(() => {
    soundEngine.initContext();
    if (isPlaying && !isVoiceMuted && currentStep) {
      playStepVoice(currentStepIndex);
    } else {
      speechEngine.cancel();
    }
    return () => {
      speechEngine.cancel();
    };
  }, [currentStepIndex, isVoiceMuted, isPlaying]);

  // Step countdown
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const interval = setInterval(() => {
      setStepTimer((prev) => {
        if (prev + 1 >= currentStep.durationSec) {
          // Next step
          if (currentStepIndex + 1 < totalSteps) {
            setCurrentStepIndex((idx) => idx + 1);
            return 0;
          } else {
            // Completed
            setIsCompleted(true);
            setIsPlaying(false);
            soundEngine.playChime(660, 2.0);
            confetti({
              particleCount: 70,
              spread: 70,
              origin: { y: 0.5 },
            });
            onCompleteSession(session.id);
            return currentStep.durationSec;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, totalSteps, currentStep, isCompleted, session.id, onCompleteSession]);

  // Breathing 4-7-8 rhythm loop
  useEffect(() => {
    if (!isPlaying || isCompleted || currentStep.actionType !== 'breathe-478') return;

    let bTimer: any;
    let secondsLeft = breathCount;

    const runBreathCycle = () => {
      bTimer = setInterval(() => {
        setBreathCount((c) => {
          if (c <= 1) {
            setBreathPhase((prev) => {
              if (prev === 'inhale') {
                if (!isAudioMuted) soundEngine.playBreathCue('hold');
                return 'hold';
              } else if (prev === 'hold') {
                if (!isAudioMuted) soundEngine.playBreathCue('exhale');
                return 'exhale';
              } else {
                if (!isAudioMuted) soundEngine.playBreathCue('inhale');
                return 'inhale';
              }
            });
            return 1; // will be updated by next phase
          }
          return c - 1;
        });
      }, 1000);
    };

    runBreathCycle();
    return () => clearInterval(bTimer);
  }, [isPlaying, isCompleted, currentStep.actionType, isAudioMuted]);

  useEffect(() => {
    if (breathPhase === 'inhale') setBreathCount(4);
    if (breathPhase === 'hold') setBreathCount(7);
    if (breathPhase === 'exhale') setBreathCount(8);
  }, [breathPhase]);

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setStepTimer(0);
    setIsCompleted(false);
    setIsPlaying(true);
    setBreathPhase('inhale');
    setBreathCount(4);
  };

  const getCategoryIcon = () => {
    switch (session.category) {
      case 'anxiety':
        return <Wind className="w-5 h-5 text-emerald-400" />;
      case 'overwhelm':
        return <Compass className="w-5 h-5 text-teal-400" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-purple-400" />;
      case 'anger':
        return <Flame className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center">
              {getCategoryIcon()}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{session.title}</h3>
              <p className="text-xs text-slate-400">{session.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className={`p-2 rounded-xl transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 ${
                !isVoiceMuted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isVoiceMuted ? '開啟語音朗讀' : '靜音語音'}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{!isVoiceMuted ? '語音導讀' : '語音靜音'}</span>
            </button>
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isAudioMuted ? '開啟提示音' : '靜音提示音'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                speechEngine.cancel();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
            style={{
              width: isCompleted
                ? '100%'
                : `${((currentStepIndex * 100) / totalSteps) + ((stepTimer / (currentStep.durationSec || 1)) * (100 / totalSteps))}%`,
            }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col items-center justify-center text-center">
          {!isCompleted ? (
            <div className="w-full max-w-md space-y-6">
              {/* Step indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
                <span>步驟 {currentStepIndex + 1} / {totalSteps}</span>
                <span>·</span>
                <span>{currentStep.phase}</span>
              </div>

              {/* Dynamic Interactive Visual Container */}
              {currentStep.actionType === 'breathe-478' ? (
                <div className="py-6 flex flex-col items-center justify-center relative">
                  {/* Outer Breathing Animation Rings */}
                  <div
                    className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out relative ${
                      breathPhase === 'inhale'
                        ? 'scale-115 bg-emerald-500/20 border-4 border-emerald-400 shadow-2xl shadow-emerald-500/30'
                        : breathPhase === 'hold'
                        ? 'scale-110 bg-teal-500/20 border-4 border-teal-300 animate-pulse'
                        : 'scale-90 bg-indigo-500/15 border-4 border-indigo-400/80'
                    }`}
                  >
                    {/* Ripple aura */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 blur-xl animate-spin-slow" />
                    
                    <div className="flex flex-col items-center z-10">
                      <span className="text-sm font-bold tracking-wider text-emerald-300 uppercase">
                        {breathPhase === 'inhale' ? '吸氣 (Inhale)' : breathPhase === 'hold' ? '屏住呼吸 (Hold)' : '緩慢吐氣 (Exhale)'}
                      </span>
                      <span className="text-4xl font-extrabold text-white mt-1">
                        {breathCount}s
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        {breathPhase === 'inhale' ? '鼻子慢慢吸滿' : breathPhase === 'hold' ? '放鬆雙肩' : '嘴巴長長呼出'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : currentStep.actionType === 'grounding-54321' ? (
                <div className="py-4 space-y-4 text-left bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
                  <div className="flex items-center gap-2 text-teal-300 font-semibold text-sm">
                    <Compass className="w-4 h-4" />
                    <span>感官錨定練習</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {currentStep.instruction}
                  </p>
                  <p className="text-xs text-slate-400 italic">
                    {currentStep.subInstruction}
                  </p>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs text-teal-200">
                    <input
                      type="checkbox"
                      checked={!!checkedSensoryItems[currentStepIndex]}
                      onChange={(e) => {
                        setCheckedSensoryItems({
                          ...checkedSensoryItems,
                          [currentStepIndex]: e.target.checked,
                        });
                        soundEngine.playChime(580, 0.4);
                      }}
                      className="w-4 h-4 rounded-md accent-teal-500"
                    />
                    <span>我已經在心中找到並感受到了</span>
                  </label>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-9 h-9 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-bold text-white max-w-md mx-auto leading-relaxed">
                    {currentStep.instruction}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
                    {currentStep.subInstruction}
                  </p>
                </div>
              )}

              {/* Sub textual guide */}
              {currentStep.actionType === 'breathe-478' && (
                <p className="text-xs text-slate-300 font-medium">
                  {currentStep.instruction}
                </p>
              )}
            </div>
          ) : (
            /* Completed Celebration Screen */
            <div className="space-y-6 py-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">太棒了，完成練習！</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  你剛剛成功給了大腦一段平靜的時間。深呼吸，感謝自己願意停下腳步照顧內心。
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 max-w-sm mx-auto">
                🌿 <span className="font-semibold text-emerald-300">臨床心理學小錦囊：</span>
                當感到情緒再度緊繃時，隨時可以重溫這個練習，讓身心回到安全的基準線。
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新開始</span>
          </button>

          {!isCompleted ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
                <span>{isPlaying ? '暫停' : '繼續'}</span>
              </button>

              <button
                onClick={() => {
                  if (currentStepIndex + 1 < totalSteps) {
                    setCurrentStepIndex((idx) => idx + 1);
                    setStepTimer(0);
                  } else {
                    setIsCompleted(true);
                    onCompleteSession(session.id);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                {currentStepIndex + 1 < totalSteps ? '下一步' : '完成練習'}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              返回首頁
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
