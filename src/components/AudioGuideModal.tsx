import React, { useState, useEffect, useMemo } from 'react';
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
  Globe,
  Send,
  Calendar,
  Phone,
  MessageSquare,
  AlertCircle,
  Headphones
} from 'lucide-react';
import { AudioGuide } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { speechEngine, VoiceLang, convertToCantoneseSpoken } from '../utils/speechEngine';
import { analytics } from '../utils/analytics';

interface AudioGuideModalProps {
  guide: AudioGuide | null;
  onClose: () => void;
  onComplete?: (id: string) => void;
  onOpenOtherGuides?: () => void;
}

export const AudioGuideModal: React.FC<AudioGuideModalProps> = ({
  guide,
  onClose,
  onComplete,
  onOpenOtherGuides,
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

  // 50% progress subtle referral banner state
  const [hasTriggered50Percent, setHasTriggered50Percent] = useState(false);
  const [show50ReferralBanner, setShow50ReferralBanner] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  // Referral simple booking form fields (3 fields: name, contact, concern)
  const [referralName, setReferralName] = useState('');
  const [referralContact, setReferralContact] = useState('');
  const [referralConcern, setReferralConcern] = useState(guide.title || '');
  const [isReferralSubmitted, setIsReferralSubmitted] = useState(false);
  
  // Interactive "Act On" checked items & notes
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});
  const [userNote, setUserNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'script' | 'action' | 'notes'>('script');

  const currentChapter = guide.chapters[currentChapterIndex];
  const totalChapters = guide.chapters.length;

  // Calculate total seconds and elapsed seconds
  const totalDurationSeconds = useMemo(() => {
    return guide.chapters.reduce((acc, chp) => acc + chp.durationSeconds, 0);
  }, [guide]);

  // Initial event track
  useEffect(() => {
    analytics.track('audio_start', {
      guideId: guide.id,
      title: guide.title,
      durationMinutes: guide.durationMinutes,
    });
  }, [guide.id]);

  // Spoken voice narration function with multilingual support
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

  // Check 50% progress trigger
  useEffect(() => {
    if (!hasTriggered50Percent && !isCompleted) {
      const progressFraction = (currentChapterIndex + 1) / totalChapters;
      if (progressFraction >= 0.5) {
        setHasTriggered50Percent(true);
        setShow50ReferralBanner(true);
        analytics.track('audio_progress_50', { guideId: guide.id });
      }
    }
  }, [currentChapterIndex, totalChapters, hasTriggered50Percent, isCompleted, guide.id]);

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
            analytics.track('audio_complete', { guideId: guide.id });
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

  const keyTakeawayText = isEnglish 
    ? (guide.keyTakeawayEn || guide.keyTakeaway) 
    : (isCantonese && guide.keyTakeawayCantonese ? guide.keyTakeawayCantonese : guide.keyTakeaway);

  // Referral Submit Handler
  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralName.trim() || !referralContact.trim()) return;

    analytics.track('referral_form_submit', {
      guideId: guide.id,
      name: referralName,
      contact: referralContact,
      concern: referralConcern,
    });

    soundEngine.playChime(640, 1.5);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
    });
    setIsReferralSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C3324]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#242A1E] text-[#FDFCF8] w-full max-w-3xl rounded-3xl border border-[#3D4734] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#3D4734] flex items-center justify-between bg-[#1C2216]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2C3324] border border-[#8BA888]/30 flex items-center justify-center text-[#8BA888]">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#8BA888]/20 text-[#8BA888] border border-[#8BA888]/30">
                  {guide.categoryLabel}
                </span>
                <span className="text-xs text-[#A0A398]">{guide.durationMinutes} {isEnglish ? 'min' : '分鐘'}</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">{displayedTitle}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multilingual Switcher */}
            <div className="flex items-center bg-[#2C3324] rounded-xl p-1 border border-[#3D4734] text-xs">
              <button
                onClick={() => handleVoiceLangChange('cantonese')}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  voiceLang === 'cantonese' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#C9D6C8] hover:text-white'
                }`}
                title="廣東話語音 (Cantonese Voice)"
              >
                粵語
              </button>
              <button
                onClick={() => handleVoiceLangChange('mandarin')}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  voiceLang === 'mandarin' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#C9D6C8] hover:text-white'
                }`}
                title="國語語音 (Mandarin Voice)"
              >
                國語
              </button>
              <button
                onClick={() => handleVoiceLangChange('english')}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  voiceLang === 'english' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#C9D6C8] hover:text-white'
                }`}
                title="English Voice"
              >
                EN
              </button>
            </div>

            <button
              onClick={() => {
                speechEngine.cancel();
                soundEngine.stopSoundscape();
                onClose();
              }}
              className="p-2 rounded-xl text-[#C9D6C8] hover:text-white hover:bg-[#3D4734] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3.1 播放 50% 觸發的輕量溫和浮動轉介通知 (文案精準精簡) */}
        {show50ReferralBanner && !isCompleted && !isReferralModalOpen && (
          <div className="bg-gradient-to-r from-[#2C3324] to-[#37402E] border-b border-[#8BA888]/40 px-4 py-2.5 flex items-center justify-between gap-2 text-xs animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 text-[#E9F0E8] min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#8BA888] animate-ping shrink-0" />
              <span className="truncate font-medium">
                短期情緒可自我調適，長期壓力焦慮可尋求專業治療師協助
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  analytics.track('referral_click', { from: '50_progress_banner', guideId: guide.id });
                  setIsReferralModalOpen(true);
                }}
                className="px-3 py-1 rounded-lg bg-[#8BA888] hover:bg-[#759672] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              >
                查看治療師
              </button>
              <button
                onClick={() => setShow50ReferralBanner(false)}
                className="p-1 text-[#A0A398] hover:text-white cursor-pointer"
                title="關閉"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Main Player Display (When not completed and referral modal is closed) */}
          {!isCompleted && !isReferralModalOpen ? (
            <div className="space-y-6">
              
              {/* Doctor / Guide Information Banner */}
              <div className="p-4 rounded-2xl bg-[#1C2216] border border-[#3D4734] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={guide.thumbnail}
                    alt={guide.guideName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-[#3D4734]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">
                        {isEnglish ? (guide.guideNameEn || guide.guideName) : (isCantonese && guide.guideNameCantonese ? guide.guideNameCantonese : guide.guideName)}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#8BA888]/20 text-[#8BA888] font-semibold">
                        {isEnglish ? 'Clinical Host' : '臨床主講'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A0A398] mt-0.5 line-clamp-1">{displayedGuideRole}</p>
                    <p className="text-[10px] text-[#8BA888] mt-0.5">{displayedFramework}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={cycleSpeed}
                    className="px-2.5 py-1 rounded-xl bg-[#2C3324] border border-[#3D4734] text-xs font-bold text-[#8BA888] hover:text-white cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                  <button
                    onClick={handleToggleBackgroundSound}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      !isAudioMuted
                        ? 'bg-[#8BA888]/20 text-[#8BA888] border-[#8BA888]/30'
                        : 'border-[#3D4734] text-[#7A7D73] hover:text-white'
                    }`}
                    title={!isAudioMuted ? '情境白噪音開啟中' : '靜音背景白噪音'}
                  >
                    <Music className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleVoice}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      !isVoiceMuted
                        ? 'bg-[#8BA888]/20 text-[#8BA888] border-[#8BA888]/30'
                        : 'border-[#3D4734] text-[#7A7D73] hover:text-white'
                    }`}
                    title={!isVoiceMuted ? '心理師語音開啟中' : '語音靜音'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-Tabs: Script / Action Items / Notes */}
              <div className="flex items-center gap-2 border-b border-[#3D4734] pb-2 text-xs">
                <button
                  onClick={() => setActiveTab('script')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'script' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#A0A398] hover:text-white'
                  }`}
                >
                  📖 {isEnglish ? 'Clinical Script' : '心理師引導逐字稿'}
                </button>
                <button
                  onClick={() => setActiveTab('action')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'action' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#A0A398] hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{isEnglish ? 'Action Items' : '實證微行動'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#2C3324] text-[#8BA888]">
                    {Object.values(checkedActions).filter(Boolean).length}/{actionItemsList.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'notes' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#A0A398] hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEnglish ? 'Notes' : '隨堂反思筆記'}</span>
                </button>
              </div>

              {/* Tab 1: Clinical Script */}
              {activeTab === 'script' && (
                <div className="bg-[#1C2216] border border-[#3D4734] p-5 sm:p-6 rounded-2xl space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8BA888] animate-pulse" />
                      <h4 className="text-sm font-bold text-white">
                        {displayedChapterTitle}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-[#8BA888] font-bold">
                      {formatTime(secondsRemaining)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#E9F0E8] leading-relaxed tracking-wide font-normal">
                    {isEnglish 
                      ? (currentChapter?.narrationScriptEn || currentChapter?.narrationScript)
                      : (isCantonese && currentChapter?.narrationScriptCantonese ? currentChapter?.narrationScriptCantonese : currentChapter?.narrationScript)}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-[#3D4734] text-xs text-[#A0A398]">
                    <span>{isVoiceSpeaking ? '🎙️ 心理師語音導引進行中...' : '⏸️ 語音暫停'}</span>
                    <button
                      onClick={handleReplayVoice}
                      className="text-xs text-[#8BA888] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isEnglish ? 'Replay Voice' : '重新播放當前語音'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Action Items */}
              {activeTab === 'action' && (
                <div className="bg-[#1C2216] border border-[#3D4734] p-5 sm:p-6 rounded-2xl space-y-4 shadow-inner">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8BA888]" />
                      <span>{isEnglish ? 'Clinical Micro-Actions (Act On)' : '邊聽邊做 · 臨床微行動指南'}</span>
                    </h4>
                    <p className="text-xs text-[#A0A398]">
                      {isEnglish
                        ? 'Complete these behavioral micro-actions as you listen to anchor neural learning:'
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
                </div>
              )}
            </div>
          ) : isReferralModalOpen ? (
            /* 3.3 簡化預約/轉介表單 (3個極簡字段: 姓名、聯繫方式、核心困擾) */
            <div className="bg-[#1C2216] rounded-3xl border border-[#8BA888]/40 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
              {!isReferralSubmitted ? (
                <form onSubmit={handleReferralSubmit} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#3D4734] pb-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8BA888]/20 text-[#8BA888]">
                        精準轉介 · 專業治療師深度諮詢
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">預約 1對1 專業心理治療師諮詢</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReferralModalOpen(false)}
                      className="p-1.5 rounded-lg text-[#A0A398] hover:text-white hover:bg-[#3D4734] transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-[#C9D6C8] leading-relaxed">
                    音訊導引能即時降溫情緒，若你長期受困於壓力、焦慮、睡眠障礙或人際議題，填寫以下極簡資訊，臨床團隊將為你精準媒合對應專長治療師。
                  </p>

                  <div className="space-y-4">
                    {/* Field 1: Name */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        1. 你的稱呼 / 姓名 *
                      </label>
                      <input
                        type="text"
                        required
                        value={referralName}
                        onChange={(e) => setReferralName(e.target.value)}
                        placeholder="例如：Alex 或 陳小姐"
                        className="w-full p-3 rounded-xl bg-[#242A1E] border border-[#3D4734] text-xs text-white placeholder-[#7A7D73] focus:outline-hidden focus:border-[#8BA888]"
                      />
                    </div>

                    {/* Field 2: Contact */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        2. 聯繫方式（電話 / Line ID / Email）*
                      </label>
                      <input
                        type="text"
                        required
                        value={referralContact}
                        onChange={(e) => setReferralContact(e.target.value)}
                        placeholder="例如：0912-345-678 或 line_id 或 name@email.com"
                        className="w-full p-3 rounded-xl bg-[#242A1E] border border-[#3D4734] text-xs text-white placeholder-[#7A7D73] focus:outline-hidden focus:border-[#8BA888]"
                      />
                    </div>

                    {/* Field 3: Core Concern */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        3. 目前最想梳理的核心困擾 *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={referralConcern}
                        onChange={(e) => setReferralConcern(e.target.value)}
                        placeholder="例如：死線工作壓力大、睡眠品質差、常常過度思考..."
                        className="w-full p-3 rounded-xl bg-[#242A1E] border border-[#3D4734] text-xs text-white placeholder-[#7A7D73] focus:outline-hidden focus:border-[#8BA888] resize-none"
                      />
                    </div>
                  </div>

                  {/* 3.4 統一免責聲明 */}
                  <div className="p-3 rounded-xl bg-[#242A1E] border border-[#3D4734] flex items-start gap-2 text-[11px] text-[#A0A398] leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-[#8BA888] shrink-0 mt-0.5" />
                    <span>
                      <strong>免責聲明：</strong>本音訊為心理教育與情緒調適資源，不等同心理治療與醫療診斷，專業諮詢由外部合格治療師獨立提供。
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReferralModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-[#3D4734] text-white text-xs font-bold hover:bg-[#4D5A42] transition-colors cursor-pointer"
                    >
                      返回音訊
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>一鍵送出預約媒合</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Referral Submit Success Feedback */
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-[#8BA888]/20 border border-[#8BA888] flex items-center justify-center mx-auto text-[#8BA888]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white">預約媒合已送出！</h3>
                    <p className="text-xs text-[#C9D6C8] max-w-md mx-auto leading-relaxed">
                      感謝你的信任。我們已收到你的諮詢需求，專業個案個管師將在 24 小時內透過你留下的聯繫方式與你確認最合適的治療師與諮詢時段。
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsReferralModalOpen(false);
                      setIsReferralSubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    完成並關閉
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 3.2 播放 100% 完結：頁內強化轉介模組 (3.2 規範) */
            <div className="text-center py-6 space-y-5 bg-[#1C2216] rounded-3xl border border-[#8BA888]/40 p-6 sm:p-8 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#8BA888]/20 border border-[#8BA888] flex items-center justify-center mx-auto text-[#8BA888]">
                <Award className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white">
                  {isEnglish ? 'Audio Guidance Complete' : '音訊導引圓滿完成'}
                </h3>
                <p className="text-xs text-[#C9D6C8] max-w-md mx-auto pt-1 leading-relaxed">
                  {isEnglish 
                    ? 'You have completed this guided session. Carry this clarity and inner calm into your day.'
                    : '你已完成本次音訊導引。深呼吸，帶著這份平靜與穩定力量面對日常。'}
                </p>
              </div>

              {/* 核心轉介模組卡片 */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#242A1E] to-[#2C3324] border border-[#8BA888]/50 text-left max-w-lg mx-auto space-y-2.5 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8BA888]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>✅ 已完成音訊導引｜長期情緒、職場、人際困擾，可媒合專長治療師深度梳理</span>
                </div>
                <p className="text-xs text-[#C9D6C8] leading-relaxed">
                  自我練習有助於短期情緒調適。若面臨長期困擾，外部認證臨床/諮商心理師可提供一對一深度支持。
                </p>
              </div>

              {/* 固定雙按鈕：【預約諮詢】【探索其他音訊】 */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    analytics.track('referral_click', { from: '100_complete_screen', guideId: guide.id });
                    setIsReferralModalOpen(true);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>預約諮詢</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.stopSoundscape();
                    onClose();
                    if (onOpenOtherGuides) onOpenOtherGuides();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#3D4734] hover:bg-[#4D5A42] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Headphones className="w-4 h-4" />
                  <span>探索其他音訊</span>
                </button>
              </div>

              {/* 免責聲明 */}
              <p className="text-[10px] text-[#7A7D73] max-w-md mx-auto pt-2">
                免責聲明：本音訊為心理教育資源，不等同心理治療與醫療診斷，專業諮詢由外部合格治療師獨立提供。
              </p>
            </div>
          )}

          {/* Chapters Progress Bar */}
          {!isCompleted && !isReferralModalOpen && (
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
        {!isCompleted && !isReferralModalOpen && (
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
