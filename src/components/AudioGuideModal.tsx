import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Heart,
  Music,
  Wind,
  CheckSquare,
  Square,
  Edit3,
  BookOpen,
  Award,
  UserCheck,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { AudioGuide } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { speechEngine, VoiceLang, convertToCantoneseSpoken } from '../utils/speechEngine';

interface AudioGuideModalProps {
  guide: AudioGuide | null;
  onClose: () => void;
  onComplete?: (id: string) => void;
}

export const AudioGuideModal: React.FC<AudioGuideModalProps> = ({
  guide,
  onClose,
  onComplete,
}) => {
  if (!guide) return null;

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [voiceLang, setVoiceLang] = useState<VoiceLang>(() => speechEngine.getVoiceLang());
  const [secondsRemaining, setSecondsRemaining] = useState(
    guide.chapters[0]?.durationSeconds || 120
  );
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Interactive "Act On" checked items & notes
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});
  const [userNote, setUserNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'script' | 'action' | 'notes'>('script');

  const currentChapter = guide.chapters[currentChapterIndex];
  const totalChapters = guide.chapters.length;

  // Spoken voice narration function with English support
  const playChapterVoice = (chapterIdx: number, speed: number, vLang: VoiceLang = voiceLang) => {
    const chapter = guide.chapters[chapterIdx];
    if (!chapter || isVoiceMuted) return;

    let textToSpeak = '';
    if (vLang === 'english') {
      const chapterTitle = chapter.titleEn || chapter.title;
      const script = chapter.narrationScriptEn || chapter.narrationScript;
      textToSpeak = `${chapterTitle}. ${script}`;
    } else if (vLang === 'cantonese') {
      const chapterTitle = chapter.titleCantonese || chapter.title;
      const script = chapter.narrationScriptCantonese || convertToCantoneseSpoken(chapter.narrationScript);
      textToSpeak = `${chapterTitle}。${script}`;
    } else {
      const chapterTitle = chapter.title;
      const script = chapter.narrationScript;
      textToSpeak = `${chapterTitle}。${script}`;
    }

    speechEngine.speak(textToSpeak, {
      voiceLang: vLang,
      rate: speed,
      pitch: 1.0,
      onStart: () => setIsVoiceSpeaking(true),
      onEnd: () => setIsVoiceSpeaking(false),
      onError: () => setIsVoiceSpeaking(false),
    });
  };

  const handleVoiceLangChange = (newLang: VoiceLang) => {
    setVoiceLang(newLang);
    speechEngine.setVoiceLang(newLang);
    if (isPlaying && !isVoiceMuted) {
      playChapterVoice(currentChapterIndex, playbackSpeed, newLang);
    }
  };

  // Soundscape audio background and speech on open / chapter change
  useEffect(() => {
    soundEngine.initContext();
    if (isPlaying && !isAudioMuted) {
      soundEngine.playSoundscape(guide.soundType, `guide-${guide.id}`);
    } else {
      soundEngine.stopSoundscape();
    }

    if (isPlaying && !isVoiceMuted && currentChapter) {
      playChapterVoice(currentChapterIndex, playbackSpeed, voiceLang);
    } else {
      speechEngine.cancel();
      setIsVoiceSpeaking(false);
    }

    return () => {
      soundEngine.stopSoundscape();
      speechEngine.cancel();
    };
  }, [guide.id, guide.soundType, currentChapterIndex, isVoiceMuted, voiceLang]);

  // Chapter timer countdown
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const intervalTime = 1000 / playbackSpeed;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (currentChapterIndex + 1 < totalChapters) {
            const nextIdx = currentChapterIndex + 1;
            setCurrentChapterIndex(nextIdx);
            soundEngine.playChime(528, 1.2);
            return guide.chapters[nextIdx].durationSeconds;
          } else {
            // Completed all chapters
            setIsCompleted(true);
            setIsPlaying(false);
            speechEngine.cancel();
            setIsVoiceSpeaking(false);
            soundEngine.playChime(660, 2.5);
            confetti({
              particleCount: 100,
              spread: 90,
              origin: { y: 0.5 },
            });
            if (onComplete) onComplete(guide.id);
            return 0;
          }
        }
        return prev - 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentChapterIndex, totalChapters, isCompleted, guide, playbackSpeed, onComplete]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      soundEngine.stopSoundscape();
      speechEngine.pause();
      setIsVoiceSpeaking(false);
    } else {
      setIsPlaying(true);
      soundEngine.initContext();
      if (!isAudioMuted) {
        soundEngine.playSoundscape(guide.soundType, `guide-${guide.id}`);
      }
      if (!isVoiceMuted) {
        if (speechEngine.isSpeaking()) {
          speechEngine.resume();
          setIsVoiceSpeaking(true);
        } else {
          playChapterVoice(currentChapterIndex, playbackSpeed);
        }
      }
    }
  };

  const handleToggleBackgroundSound = () => {
    if (isAudioMuted) {
      setIsAudioMuted(false);
      if (isPlaying) {
        soundEngine.playSoundscape(guide.soundType, `guide-${guide.id}`);
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
        playChapterVoice(currentChapterIndex, playbackSpeed);
      }
    } else {
      setIsVoiceMuted(true);
      speechEngine.cancel();
      setIsVoiceSpeaking(false);
    }
  };

  const handleReplayVoice = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (!isAudioMuted) {
        soundEngine.playSoundscape(guide.soundType, `guide-${guide.id}`);
      }
    }
    setIsVoiceMuted(false);
    playChapterVoice(currentChapterIndex, playbackSpeed);
  };

  const handleNextChapter = () => {
    if (currentChapterIndex + 1 < totalChapters) {
      const nextIdx = currentChapterIndex + 1;
      speechEngine.cancel();
      setCurrentChapterIndex(nextIdx);
      setSecondsRemaining(guide.chapters[nextIdx].durationSeconds);
      soundEngine.playChime(528, 1.0);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIdx = currentChapterIndex - 1;
      speechEngine.cancel();
      setCurrentChapterIndex(prevIdx);
      setSecondsRemaining(guide.chapters[prevIdx].durationSeconds);
      soundEngine.playChime(432, 1.0);
    }
  };

  const handleRestart = () => {
    speechEngine.cancel();
    setCurrentChapterIndex(0);
    setSecondsRemaining(guide.chapters[0].durationSeconds);
    setIsCompleted(false);
    setIsPlaying(true);
    if (!isAudioMuted) {
      soundEngine.playSoundscape(guide.soundType, `guide-${guide.id}`);
    }
    if (!isVoiceMuted) {
      playChapterVoice(0, playbackSpeed);
    }
  };

  const toggleActionItem = (idx: number) => {
    setCheckedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
    soundEngine.playChime(600, 0.2);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.8];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    if (isPlaying && !isVoiceMuted) {
      playChapterVoice(currentChapterIndex, newSpeed);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isEnglish = voiceLang === 'english';
  const isCantonese = voiceLang === 'cantonese';

  const displayedTitle = isEnglish 
    ? guide.titleEn 
    : (isCantonese && guide.titleCantonese ? guide.titleCantonese : guide.title);

  const displayedSub = isEnglish 
    ? (guide.subtitleEn || guide.subtitle) 
    : (isCantonese && guide.subtitleCantonese ? guide.subtitleCantonese : guide.subtitle);

  const displayedChapterTitle = isEnglish 
    ? (currentChapter?.titleEn || currentChapter?.title) 
    : (isCantonese && currentChapter?.titleCantonese ? currentChapter?.titleCantonese : currentChapter?.title);

  const displayedFramework = isEnglish 
    ? (guide.clinicalFrameworkEn || guide.clinicalFramework) 
    : (isCantonese && guide.clinicalFrameworkCantonese ? guide.clinicalFrameworkCantonese : guide.clinicalFramework);

  const displayedGuideRole = isEnglish 
    ? (guide.guideRoleEn || guide.guideRole) 
    : (isCantonese && guide.guideRoleCantonese ? guide.guideRoleCantonese : guide.guideRole);

  const actionItemsList = isEnglish && guide.actionItemsEn 
    ? guide.actionItemsEn 
    : (isCantonese && guide.actionItemsCantonese ? guide.actionItemsCantonese : guide.actionItems);

  const keyTakeawayText = isEnglish && guide.keyTakeawayEn 
    ? guide.keyTakeawayEn 
    : (isCantonese && guide.keyTakeawayCantonese ? guide.keyTakeawayCantonese : guide.keyTakeaway);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C2216]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#242A1E] text-[#FDFCF8] border border-[#8BA888]/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#3D4734] flex items-center justify-between bg-[#1C2216]/70">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#8BA888]/25 text-[#E9F0E8] border border-[#8BA888]/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#8BA888]" />
              音訊導引 · Audio Guide
            </span>
            <span className="text-xs text-[#C9D6C8] font-medium hidden sm:inline">
              {isEnglish ? guide.categoryEn : guide.categoryLabel} ({guide.durationMinutes} min)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Voice Language Selector */}
            <div className="flex items-center bg-[#1C2216] border border-[#8BA888]/40 rounded-xl px-2 py-1 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-[#8BA888] mr-1.5 shrink-0" />
              <span className="text-[11px] text-[#C9D6C8] mr-1 hidden sm:inline">語音:</span>
              <select
                value={voiceLang}
                onChange={(e) => handleVoiceLangChange(e.target.value as VoiceLang)}
                className="bg-transparent text-white text-xs font-bold focus:outline-hidden cursor-pointer"
                title="選擇音訊導引語音旁白語言 (廣東話 / 普通話 / 英語)"
              >
                <option value="cantonese" className="bg-[#1C2216] text-white">🇭🇰 廣東話 (粵語)</option>
                <option value="mandarin" className="bg-[#1C2216] text-white">🇹🇼 普通話 (國語)</option>
                <option value="english" className="bg-[#1C2216] text-white">🇬🇧 英語 (English)</option>
              </select>
            </div>

            <button
              onClick={cycleSpeed}
              className="px-2.5 py-1 text-xs font-bold text-[#C9D6C8] hover:text-white rounded-xl hover:bg-[#3D4734] transition-colors cursor-pointer border border-[#3D4734]"
              title="切換導引語速"
            >
              {playbackSpeed}x
            </button>
            <button
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                !isVoiceMuted
                  ? 'bg-[#8BA888]/20 text-[#8BA888] border border-[#8BA888]/40 hover:bg-[#8BA888]/30'
                  : 'text-[#A0A398] hover:text-white hover:bg-[#3D4734] border border-[#3D4734]'
              }`}
              title={isVoiceMuted ? '開啟教練語音旁白' : '關閉教練語音旁白'}
            >
              <Volume2 className={`w-4 h-4 ${!isVoiceMuted ? 'text-[#8BA888]' : 'text-[#7A7D73]'}`} />
              <span className="hidden md:inline">{!isVoiceMuted ? '語音' : '靜音'}</span>
            </button>
            <button
              onClick={handleToggleBackgroundSound}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                !isAudioMuted
                  ? 'bg-[#3D4734] text-white border border-[#8BA888]/30'
                  : 'text-[#A0A398] hover:text-white hover:bg-[#3D4734] border border-[#3D4734]'
              }`}
              title={isAudioMuted ? '開啟聲學背景音' : '靜音背景音'}
            >
              <Music className={`w-4 h-4 ${!isAudioMuted ? 'text-teal-400' : 'text-[#7A7D73]'}`} />
              <span className="hidden md:inline">{!isAudioMuted ? '聲景' : '無聲'}</span>
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
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
          {/* Guide Title & Guide Specialist Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D4734]">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {displayedTitle}
              </h2>
              {!isEnglish && (
                <p className="text-xs text-[#8BA888] font-medium">
                  {guide.titleEn}
                </p>
              )}
              <p className="text-xs text-[#C9D6C8] pt-0.5 max-w-xl">
                {displayedSub}
              </p>
            </div>

            {/* Guide Speaker Badge */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#1C2216] border border-[#3D4734] shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#8BA888]/20 border border-[#8BA888]/40 flex items-center justify-center text-[#8BA888]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">{guide.guideName}</div>
                <div className="text-[10px] text-[#A0A398]">{displayedGuideRole}</div>
              </div>
            </div>
          </div>

          {!isCompleted ? (
            <div className="space-y-5">
              {/* Visual Track Player Bar */}
              <div className="bg-[#1C2216] border border-[#3D4734] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-10 h-10 rounded-full bg-[#8BA888]/20 border border-[#8BA888] flex items-center justify-center text-[#8BA888] ${
                        isPlaying ? 'animate-pulse' : ''
                      }`}
                    >
                      <Wind className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                      <span>{displayedChapterTitle}</span>
                      {isVoiceSpeaking && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {isEnglish ? 'Speaking (EN)' : voiceLang === 'cantonese' ? '粵語朗讀中' : '國語朗讀中'}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8BA888]">
                      {isEnglish ? 'Framework: ' : '理論架構：'}{displayedFramework}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <button
                    onClick={handleReplayVoice}
                    className="px-2.5 py-1.5 rounded-xl bg-[#242A1E] hover:bg-[#3D4734] border border-[#3D4734] text-[11px] text-[#C9D6C8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    title="重新朗讀本章節語音"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#8BA888]" />
                    <span>{isEnglish ? 'Replay Voice' : '重播語音'}</span>
                  </button>

                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white font-mono">
                      {formatTime(secondsRemaining)}
                    </span>
                    <div className="text-[10px] text-[#A0A398]">
                      {isEnglish ? `Chapter ${currentChapterIndex + 1} of ${totalChapters}` : `章節 ${currentChapterIndex + 1} / ${totalChapters}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs (Script / Act On / Notes) */}
              <div className="flex p-1 bg-[#1C2216] rounded-xl border border-[#3D4734] max-w-sm">
                <button
                  onClick={() => setActiveTab('script')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'script'
                      ? 'bg-[#3D4734] text-white shadow-xs'
                      : 'text-[#C9D6C8] hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEnglish ? 'Transcript' : '語音文稿'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('action')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'action'
                      ? 'bg-[#8BA888] text-white shadow-xs'
                      : 'text-[#C9D6C8] hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{isEnglish ? 'Act On' : '即時行動'} ({Object.values(checkedActions).filter(Boolean).length}/{actionItemsList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'notes'
                      ? 'bg-[#3D4734] text-white shadow-xs'
                      : 'text-[#C9D6C8] hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEnglish ? 'Notes' : '反思筆記'}</span>
                </button>
              </div>

              {/* Tab 1: Script & Narration */}
              {activeTab === 'script' && (
                <div className="bg-[#1C2216] border border-[#3D4734] p-5 sm:p-6 rounded-2xl space-y-4 shadow-inner">
                  {/* Language switch pills inside transcript tab */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#3D4734]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-[#8BA888] font-bold">
                        {isEnglish ? 'Spoken Guidance Script' : '專業導引講稿'}
                      </span>
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          onClick={() => handleVoiceLangChange('english')}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            voiceLang === 'english'
                              ? 'bg-[#8BA888] text-white'
                              : 'bg-[#242A1E] text-[#A0A398] hover:text-white'
                          }`}
                        >
                          🇬🇧 English
                        </button>
                        <button
                          onClick={() => handleVoiceLangChange('cantonese')}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            voiceLang === 'cantonese'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#242A1E] text-[#A0A398] hover:text-white'
                          }`}
                        >
                          🇭🇰 廣東話白話
                        </button>
                        <button
                          onClick={() => handleVoiceLangChange('mandarin')}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            voiceLang === 'mandarin'
                              ? 'bg-sky-600 text-white'
                              : 'bg-[#242A1E] text-[#A0A398] hover:text-white'
                          }`}
                        >
                          🇹🇼 普通話
                        </button>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#C9D6C8]">
                      {isEnglish 
                        ? `Acoustic: ${guide.soundType}` 
                        : `伴隨 ${guide.soundType === 'ocean' ? '海浪' : guide.soundType === 'rain' ? '細雨' : guide.soundType === 'singingBowl' ? '頌缽' : '森林微風'} 背景音`}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-white leading-relaxed tracking-wide">
                    {voiceLang === 'english'
                      ? (currentChapter?.narrationScriptEn || currentChapter?.narrationScript)
                      : voiceLang === 'cantonese'
                      ? (currentChapter?.narrationScriptCantonese || convertToCantoneseSpoken(currentChapter?.narrationScript || ''))
                      : currentChapter?.narrationScript}
                  </p>

                  {(currentChapter?.actionPrompt || currentChapter?.actionPromptEn || currentChapter?.actionPromptCantonese) && (
                    <div className="p-3.5 rounded-xl bg-[#2C3324] border border-[#8BA888]/30 text-xs text-[#E9F0E8] flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#8BA888] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#8BA888]">
                          {isEnglish ? 'Immediate Action Cue:' : '本段即時行動指引：'}
                        </span>
                        <p className="mt-0.5">
                          {isEnglish 
                            ? (currentChapter.actionPromptEn || currentChapter.actionPrompt) 
                            : (isCantonese && currentChapter.actionPromptCantonese ? currentChapter.actionPromptCantonese : currentChapter.actionPrompt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {(currentChapter?.reflectionPrompt || currentChapter?.reflectionPromptEn || currentChapter?.reflectionPromptCantonese) && (
                    <div className="p-3.5 rounded-xl bg-[#2A241E] border border-[#C88A58]/30 text-xs text-[#E9F0E8] flex items-start gap-2.5">
                      <Heart className="w-4 h-4 text-[#C88A58] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#C88A58]">
                          {isEnglish ? 'Introspection Cue:' : '內在覺察反思：'}
                        </span>
                        <p className="mt-0.5">
                          {isEnglish 
                            ? (currentChapter.reflectionPromptEn || currentChapter.reflectionPrompt) 
                            : (isCantonese && currentChapter.reflectionPromptCantonese ? currentChapter.reflectionPromptCantonese : currentChapter.reflectionPrompt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Act On Action Checklist */}
              {activeTab === 'action' && (
                <div className="bg-[#1C2216] border border-[#3D4734] p-5 sm:p-6 rounded-2xl space-y-4 shadow-inner">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[#8BA888]" />
                      <span>{isEnglish ? 'Guided Support to Act On · Practical Steps' : 'Guided Support to Act On · 實踐行動檢核'}</span>
                    </h3>
                    <p className="text-xs text-[#C9D6C8]">
                      {isEnglish 
                        ? 'Complete these clinical behavioral micro-actions as you listen to anchor neural learning:'
                        : '邊聽邊做，完成以下實證心理行為練習，將知識轉化為神經記憶：'}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {actionItemsList.map((item, idx) => {
                      const isChecked = !!checkedActions[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleActionItem(idx)}
                          className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            isChecked
                              ? 'bg-[#2C3324] border-[#8BA888] text-white shadow-xs'
                              : 'bg-[#242A1E] border-[#3D4734] text-[#C9D6C8] hover:border-[#8BA888]/50 hover:text-white'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-[#8BA888] shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-[#7A7D73] shrink-0" />
                          )}
                          <span className={`text-xs font-semibold leading-relaxed ${
                            isChecked ? 'line-through text-[#C9D6C8]' : 'text-white'
                          }`}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#242A1E] border border-[#3D4734] text-xs text-[#8BA888] leading-relaxed">
                    💡 {isEnglish ? 'Key Takeaway: ' : '關鍵要點：'}{keyTakeawayText}
                  </div>
                </div>
              )}

              {/* Tab 3: Reflection Notes */}
              {activeTab === 'notes' && (
                <div className="bg-[#1C2216] border border-[#3D4734] p-5 sm:p-6 rounded-2xl space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-[#8BA888] font-bold">
                    <div className="flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4" />
                      <span>{isEnglish ? 'Session Reflection Journal' : '聆聽隨堂反思筆記'}</span>
                    </div>
                    <span className="text-[11px] text-[#A0A398]">{isEnglish ? 'Auto-Saved' : '自動即時儲存'}</span>
                  </div>

                  <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder={isEnglish 
                      ? 'Capture your immediate takeaways, boundary declarations, or kind words to yourself...' 
                      : '寫下你在本音訊導引中獲得的洞見、想對自己說的鼓勵，或接下來要執行的界線宣告...'}
                    className="w-full h-32 p-3.5 bg-[#242A1E] border border-[#3D4734] rounded-xl text-xs text-white placeholder-[#7A7D73] focus:outline-hidden focus:border-[#8BA888] transition-all resize-none leading-relaxed"
                  />

                  <p className="text-[11px] text-[#C9D6C8]">
                    {isEnglish ? 'Reflection Cue: ' : '當前思考：'}
                    {isEnglish 
                      ? (currentChapter?.reflectionPromptEn || 'What kind commitment can I make to myself right now?') 
                      : (currentChapter?.reflectionPrompt || '我今天能為自己的身心做出哪一個溫柔的承諾？')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Completed Screen */
            <div className="text-center py-8 space-y-5 bg-[#1C2216] rounded-3xl border border-[#8BA888]/40 p-6 sm:p-8 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#8BA888]/20 border border-[#8BA888] flex items-center justify-center mx-auto text-[#8BA888]">
                <Award className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white">
                  {isEnglish ? 'Audio Guidance & Action Complete' : '音訊導引與行動練習圓滿完成'}
                </h3>
                <p className="text-xs text-[#8BA888] font-semibold">
                  Audio Guide Completed · Action Items Solidified
                </p>
                <p className="text-xs text-[#C9D6C8] max-w-md mx-auto pt-1 leading-relaxed">
                  {isEnglish 
                    ? 'You have completed this guided session and anchored your micro-actions. Carry this clarity and inner steady strength into your day.'
                    : '你已經成功聆聽並完成了專屬支持行動。帶著這份由內而外的清晰度與堅定力量，繼續從容面對日常。'}
                </p>
              </div>

              {/* Action summary badge */}
              <div className="p-4 rounded-2xl bg-[#242A1E] border border-[#3D4734] text-xs text-left max-w-md mx-auto space-y-2">
                <div className="font-bold text-[#8BA888] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEnglish ? 'Session Takeaway & Action Summary:' : '本次行動實踐摘要：'}</span>
                </div>
                <p className="text-[#C9D6C8] leading-relaxed">
                  {keyTakeawayText}
                </p>
                {userNote && (
                  <div className="pt-2 border-t border-[#3D4734] text-[11px] text-[#E9F0E8] italic">
                    "{userNote}"
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 rounded-2xl bg-[#3D4734] hover:bg-[#4D5A42] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isEnglish ? 'Replay Guide' : '重新聆聽導引'}</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.stopSoundscape();
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEnglish ? 'Return to Hub' : '重返主頁面'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Chapters Progress Bar */}
          {!isCompleted && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[11px] font-medium text-[#C9D6C8]">
                <span>
                  {isEnglish 
                    ? `Progress (${Math.round(((currentChapterIndex + 1) / totalChapters) * 100)}%)` 
                    : `章節進度 (${Math.round(((currentChapterIndex + 1) / totalChapters) * 100)}%)`}
                </span>
                <span>
                  {isEnglish
                    ? `Chapter ${currentChapterIndex + 1}/${totalChapters}: ${displayedChapterTitle}`
                    : `章節 ${currentChapterIndex + 1} / ${totalChapters}：${displayedChapterTitle}`}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                {guide.chapters.map((chp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setSecondsRemaining(chp.durationSeconds);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx < currentChapterIndex
                        ? 'bg-[#8BA888]'
                        : idx === currentChapterIndex
                        ? 'bg-white ring-2 ring-[#8BA888]/50'
                        : 'bg-[#3D4734]'
                    }`}
                    title={isEnglish ? (chp.titleEn || chp.title) : chp.title}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Play Controls */}
        {!isCompleted && (
          <div className="px-5 sm:px-6 py-4 bg-[#1C2216] border-t border-[#3D4734] flex items-center justify-between">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
              className={`p-2.5 rounded-xl border border-[#3D4734] transition-all flex items-center gap-1 text-xs font-semibold ${
                currentChapterIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-[#7A7D73]'
                  : 'text-white hover:bg-[#3D4734] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isEnglish ? 'Previous' : '上一章節'}</span>
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-6 py-3 rounded-2xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>{isEnglish ? 'Pause' : '暫停導引'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isEnglish ? 'Resume' : '繼續聆聽'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterIndex + 1 >= totalChapters}
              className={`p-2.5 rounded-xl border border-[#3D4734] transition-all flex items-center gap-1 text-xs font-semibold ${
                currentChapterIndex + 1 >= totalChapters
                  ? 'opacity-40 cursor-not-allowed text-[#7A7D73]'
                  : 'text-white hover:bg-[#3D4734] cursor-pointer'
              }`}
            >
              <span className="hidden sm:inline">{isEnglish ? 'Next' : '下一章節'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
