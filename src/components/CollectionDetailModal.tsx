import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ZapOff, 
  Wind, 
  Moon, 
  Target, 
  MessageSquare, 
  Heart, 
  Activity, 
  Compass, 
  Play, 
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight, 
  Clock, 
  BookOpen, 
  BookMarked, 
  Headphones, 
  ShieldCheck, 
  Flame, 
  UserCheck, 
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight,
  Music
} from 'lucide-react';
import { 
  IntellectCollection, 
  LearningPath, 
  RescueSession, 
  AudioGuide, 
  JournalTemplate, 
  Coach, 
  SoundscapeItem, 
  Language 
} from '../types';
import { 
  LEARNING_PATHS, 
  RESCUE_SESSIONS, 
  AUDIO_GUIDES, 
  JOURNAL_TEMPLATES, 
  COACHES, 
  SOUNDSCAPES,
  DEFAULT_CARE_CONSULTANT 
} from '../data/mockData';
import { speechEngine, VoiceTone } from '../utils/speechEngine';
import { soundEngine } from '../utils/soundEngine';

interface CollectionDetailModalProps {
  collection: IntellectCollection;
  lang: Language;
  onClose: () => void;
  onOpenRescue: (session: RescueSession) => void;
  onOpenPath: (path: LearningPath, lessonIndex?: number) => void;
  onOpenAudioGuide: (guide: AudioGuide) => void;
  onOpenJournal: (templateId?: string) => void;
  onOpenCoach: (coach: Coach, mode?: 'book' | 'chat') => void;
  onPlaySoundscape: (sound: SoundscapeItem) => void;
}

export const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
  collection,
  lang,
  onClose,
  onOpenRescue,
  onOpenPath,
  onOpenAudioGuide,
  onOpenJournal,
  onOpenCoach,
  onPlaySoundscape,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rescue' | 'paths' | 'audio' | 'journals' | 'sound' | 'coaches'>('all');
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [voiceTone, setVoiceTone] = useState<VoiceTone>('gentle');

  // Matched items
  const matchedPaths = useMemo(() => {
    return LEARNING_PATHS.filter((p) => collection.learningPathIds.includes(p.id));
  }, [collection]);

  const matchedRescue = useMemo(() => {
    return RESCUE_SESSIONS.filter((r) => collection.rescueSessionIds.includes(r.id));
  }, [collection]);

  const matchedAudio = useMemo(() => {
    return AUDIO_GUIDES.filter((a) => collection.audioGuideIds.includes(a.id));
  }, [collection]);

  const matchedJournals = useMemo(() => {
    return JOURNAL_TEMPLATES.filter((j) => collection.journalTemplateIds.includes(j.id));
  }, [collection]);

  const matchedSoundscapes = useMemo(() => {
    return SOUNDSCAPES.filter((s) => collection.soundscapeIds.includes(s.id));
  }, [collection]);

  const matchedCoaches = useMemo(() => {
    return COACHES.slice(0, 2);
  }, []);

  const totalToolCount = matchedRescue.length + matchedPaths.length + matchedAudio.length + matchedJournals.length + matchedSoundscapes.length;

  // Collection speech narration script
  const getCollectionNarration = () => {
    return `歡迎來到「${collection.title}」專題專區。${collection.subtitle}。本專題整合了認知行為療法、接納承諾治療以及神經科學實證工具，為您規劃包含即時急救工具、多日微學習路徑、引導式日記與臨床教練諮詢。請依據您當前的狀態選擇工具開始練習。`;
  };

  const handleToggleCollectionVoice = () => {
    if (isVoicePlaying) {
      speechEngine.cancel();
      setIsVoicePlaying(false);
    } else {
      soundEngine.initContext();
      soundEngine.playChime(528, 0.8);
      setIsVoicePlaying(true);
      speechEngine.speak(getCollectionNarration(), {
        rate: voiceSpeed,
        tone: voiceTone,
        onStart: () => setIsVoicePlaying(true),
        onEnd: () => setIsVoicePlaying(false),
        onError: () => setIsVoicePlaying(false),
      });
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.8];
    const nextIdx = (speeds.indexOf(voiceSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setVoiceSpeed(newSpeed);
    if (isVoicePlaying) {
      speechEngine.speak(getCollectionNarration(), {
        rate: newSpeed,
        tone: voiceTone,
        onStart: () => setIsVoicePlaying(true),
        onEnd: () => setIsVoicePlaying(false),
        onError: () => setIsVoicePlaying(false),
      });
    }
  };

  useEffect(() => {
    return () => {
      speechEngine.cancel();
    };
  }, []);

  const getCollectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'ZapOff': return <ZapOff className="w-6 h-6 text-[#C88A58]" />;
      case 'Wind': return <Wind className="w-6 h-6 text-[#8BA888]" />;
      case 'Moon': return <Moon className="w-6 h-6 text-[#7A7D73]" />;
      case 'Target': return <Target className="w-6 h-6 text-[#647A5F]" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6 text-[#8BA888]" />;
      case 'Heart': return <Heart className="w-6 h-6 text-[#C88A58]" />;
      case 'Activity': return <Activity className="w-6 h-6 text-[#647A5F]" />;
      case 'Compass': return <Compass className="w-6 h-6 text-[#2C3324]" />;
      default: return <Sparkles className="w-6 h-6 text-[#8BA888]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C3324]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] text-[#3D4035] w-full max-w-4xl rounded-3xl border border-[#E8E6E0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Banner */}
        <div className="relative bg-[#2C3324] text-white p-6 sm:p-8 overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${collection.bannerImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2C3324] via-[#2C3324]/90 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8]">
                {collection.badge}
              </span>
              <span className="text-xs text-[#C9D6C8] font-medium">
                醫定要健康 主題專區 · 共 {totalToolCount} 款全方位整合工具
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                {getCollectionIcon(collection.icon)}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {collection.title}
                </h2>
                <p className="text-xs text-[#C9D6C8] font-medium">
                  {collection.titleEn}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#E8E6E0] leading-relaxed">
              {collection.subtitle}
            </p>

            {/* Voice Narration Player Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleCollectionVoice}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer shadow-md ${
                    isVoicePlaying
                      ? 'bg-[#8BA888] text-[#1C2216] animate-pulse'
                      : 'bg-white text-[#2C3324] hover:bg-[#E9F0E8]'
                  }`}
                  title={isVoicePlaying ? '暫停導讀語音' : '聆聽專題導讀語音'}
                >
                  {isVoicePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      專題語音導讀旁白
                    </span>
                    {isVoicePlaying && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#8BA888]/30 text-[#C9D6C8] border border-[#8BA888]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8BA888] animate-ping"></span>
                        語音朗讀中
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#C9D6C8]">
                    Intellect 臨床架構專題概要與導學引導
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={cycleSpeed}
                  className="px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/40 text-[11px] font-bold text-white border border-white/10 transition-colors cursor-pointer"
                  title="切換朗讀語速"
                >
                  {voiceSpeed}x 語速
                </button>
                <select
                  value={voiceTone}
                  onChange={(e) => {
                    const newTone = e.target.value as VoiceTone;
                    setVoiceTone(newTone);
                    speechEngine.setTone(newTone);
                    if (isVoicePlaying) {
                      speechEngine.speak(getCollectionNarration(), {
                        rate: voiceSpeed,
                        tone: newTone,
                        onStart: () => setIsVoicePlaying(true),
                        onEnd: () => setIsVoicePlaying(false),
                        onError: () => setIsVoicePlaying(false),
                      });
                    }
                  }}
                  className="px-2 py-1 rounded-lg bg-black/20 text-[11px] font-medium text-white border border-white/10 focus:outline-hidden cursor-pointer"
                >
                  <option value="gentle" className="bg-[#2C3324] text-white">溫柔引導音</option>
                  <option value="coach" className="bg-[#2C3324] text-white">專業教練音</option>
                  <option value="mindful" className="bg-[#2C3324] text-white">沉浸正念音</option>
                </select>
              </div>
            </div>

            {/* Featured stats pill row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
              {collection.featuredStats.map((st, idx) => (
                <div key={idx} className="p-2 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-[10px] text-[#C9D6C8]">{st.label}</p>
                  <p className="text-xs font-bold text-white mt-0.5">{st.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Situation Fast-Launch Cards */}
        <div className="p-4 bg-[#F9F8F4] border-b border-[#E8E6E0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2C3324] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8BA888]" />
              依當前狀態立即開啟最合適工具 (Quick Match)：
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {collection.quickSituations.map((sit, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (sit.toolType === 'rescue') {
                    const sess = RESCUE_SESSIONS.find((r) => r.id === sit.targetId) || RESCUE_SESSIONS[0];
                    onOpenRescue(sess);
                  } else if (sit.toolType === 'journal') {
                    onOpenJournal(sit.targetId);
                  } else if (sit.toolType === 'audio') {
                    const guide = AUDIO_GUIDES.find((a) => a.id === sit.targetId) || AUDIO_GUIDES[0];
                    onOpenAudioGuide(guide);
                  } else if (sit.toolType === 'path') {
                    const p = LEARNING_PATHS.find((path) => path.id === sit.targetId) || LEARNING_PATHS[0];
                    onOpenPath(p, 0);
                  }
                }}
                className="p-3 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888] transition-colors leading-snug">
                    {sit.label}
                  </p>
                  <p className="text-[11px] text-[#7A7D73] mt-1 line-clamp-1">
                    {sit.description}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-bold text-[#8BA888] flex items-center justify-between">
                  <span>點擊立即開始</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Navigation Tabs (Multi-Row Full Glance) */}
        <div className="px-5 py-2.5 bg-white border-b border-[#E8E6E0] flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'all', label: `全部工具 (${totalToolCount})` },
            { id: 'rescue', label: `即時急救 (${matchedRescue.length})` },
            { id: 'paths', label: `深度路徑 (${matchedPaths.length})` },
            { id: 'audio', label: `音訊導引 (${matchedAudio.length})` },
            { id: 'journals', label: `自我日記 (${matchedJournals.length})` },
            { id: 'sound', label: `放鬆白噪音 (${matchedSoundscapes.length})` },
            { id: 'coaches', label: `專業教練 (${matchedCoaches.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2C3324] text-white shadow-xs'
                    : 'bg-[#F9F8F4] text-[#5A6352] hover:bg-[#E9F0E8] hover:text-[#2C3324] border border-[#E8E6E0]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* 1. Quick Rescue Sessions */}
          {(activeTab === 'all' || activeTab === 'rescue') && matchedRescue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8BA888]" />
                  <h3 className="font-bold text-sm text-[#2C3324]">即時急救短練習 (Rescue Sessions · 2-5 分鐘)</h3>
                </div>
                <span className="text-[11px] text-[#7A7D73]">突發情緒快速降溫</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedRescue.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => onOpenRescue(sess)}
                    className="p-4 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.2 bg-[#E9F0E8] text-[#2C3324] rounded-md">
                          {sess.durationText}
                        </span>
                        <h4 className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888] truncate">
                          {sess.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#7A7D73] line-clamp-1">{sess.subtitle}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-[#F1F5EF] group-hover:bg-[#8BA888] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Audio Guides */}
          {(activeTab === 'all' || activeTab === 'audio') && matchedAudio.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C88A58]" />
                  <h3 className="font-bold text-sm text-[#2C3324]">音訊導引與實踐 (Audio Guides: Listen & Act)</h3>
                </div>
                <span className="text-[11px] text-[#7A7D73]">臨床語音引導行動</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedAudio.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => onOpenAudioGuide(guide)}
                    className="p-4 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E9F0E8] text-[#2C3324] rounded-md">
                          {guide.categoryLabel}
                        </span>
                        <span className="text-[11px] text-[#7A7D73] flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-[#8BA888]" />
                          {guide.durationMinutes} 分鐘
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888] leading-snug">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-[#5A6352] line-clamp-2 leading-relaxed">
                        {guide.subtitle}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#F1F5EF] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#7A7D73]">{guide.guideName}</span>
                      <span className="font-bold text-[#8BA888] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        開始聆聽 →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Learning Paths */}
          {(activeTab === 'all' || activeTab === 'paths') && matchedPaths.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#647A5F]" />
                  <h3 className="font-bold text-sm text-[#2C3324]">CBT 深度循序學習路徑 (Learning Paths)</h3>
                </div>
                <span className="text-[11px] text-[#7A7D73]">系統化行為改變</span>
              </div>

              <div className="space-y-3">
                {matchedPaths.map((path) => (
                  <div
                    key={path.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E9F0E8] text-[#2C3324] rounded-md">
                          共 {path.totalDays} 天課程
                        </span>
                        <span className="text-xs font-bold text-[#2C3324]">{path.title}</span>
                      </div>
                      <p className="text-xs text-[#5A6352] line-clamp-2 leading-relaxed">
                        {path.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenPath(path, 0)}
                      className="px-4 py-2 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>進入課程</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Guided Journals */}
          {(activeTab === 'all' || activeTab === 'journals') && matchedJournals.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8BA888]" />
                  <h3 className="font-bold text-sm text-[#2C3324]">引導式自我照顧日記 (Guided Journals)</h3>
                </div>
                <span className="text-[11px] text-[#7A7D73]">精選 {matchedJournals.length} 篇專屬反思</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchedJournals.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => onOpenJournal(tpl.id)}
                    className="p-4 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#8BA888]">
                        {tpl.categoryLabel} · {tpl.estimatedMinutes} 分鐘
                      </span>
                      <h4 className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888] leading-snug">
                        {tpl.title}
                      </h4>
                      <p className="text-[11px] text-[#7A7D73] line-clamp-2">
                        {tpl.subtitle}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#F1F5EF] flex items-center justify-between text-xs font-bold text-[#8BA888]">
                      <span>開始書寫</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Soundscapes & Meditations */}
          {(activeTab === 'all' || activeTab === 'sound') && matchedSoundscapes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7A7D73]" />
                  <h3 className="font-bold text-sm text-[#2C3324]">聲學舒緩與背景白噪音 (Soundscapes)</h3>
                </div>
                <span className="text-[11px] text-[#7A7D73]">沉浸放鬆</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {matchedSoundscapes.map((snd) => (
                  <button
                    key={snd.id}
                    onClick={() => onPlaySoundscape(snd)}
                    className="p-3.5 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex items-center justify-between cursor-pointer group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888] truncate">{snd.name}</p>
                      <p className="text-[10px] text-[#7A7D73] truncate">{snd.nameEn}</p>
                    </div>
                    <div className="w-7 h-7 rounded-xl bg-[#F1F5EF] group-hover:bg-[#8BA888] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Expert Coaching & Professional Care */}
          {(activeTab === 'all' || activeTab === 'coaches') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8BA888]" />
                  <h3 className="font-bold text-sm text-[#2C3324]">1對1 專業心理教練與諮商支援</h3>
                </div>
                <span className="text-[11px] text-[#7A7D73]">合約重新簽訂中 · 文字諮詢與預約通道正常</span>
              </div>

              {matchedCoaches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedCoaches.map((coach) => (
                    <div
                      key={coach.id}
                      className="p-4 rounded-2xl bg-white border border-[#E8E6E0] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={coach.avatar}
                          alt={coach.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-[#E8E6E0]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#2C3324] truncate">{coach.name}</h4>
                          <p className="text-[11px] text-[#7A7D73] truncate">{coach.title}</p>
                          <p className="text-[10px] text-[#8BA888] font-semibold mt-0.5">⭐ {coach.rating} · {coach.yearsExperience} 年經驗</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => onOpenCoach(coach, 'chat')}
                          className="px-3 py-1.5 rounded-lg bg-[#F1F5EF] hover:bg-[#E9F0E8] text-[#2C3324] text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          文字諮詢
                        </button>
                        <button
                          onClick={() => onOpenCoach(coach, 'book')}
                          className="px-3 py-1.5 rounded-lg bg-[#8BA888] hover:bg-[#759672] text-white text-[11px] font-bold transition-all cursor-pointer"
                        >
                          預約時段
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#F9F8F4] border border-[#E8E6E0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#2C3324]">即時文字諮詢與專案預約通道正常運作</p>
                    <p className="text-[11px] text-[#7A7D73]">專家團隊名單更新中，歡迎隨時啟動線上文字諮詢或登記預約。</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenCoach(DEFAULT_CARE_CONSULTANT, 'chat')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E6E0] hover:bg-[#F1F5EF] text-[#2C3324] text-xs font-bold transition-colors cursor-pointer"
                    >
                      文字諮詢
                    </button>
                    <button
                      onClick={() => onOpenCoach(DEFAULT_CARE_CONSULTANT, 'book')}
                      className="px-3 py-1.5 rounded-lg bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      預約時段
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F9F8F4] border-t border-[#E8E6E0] flex items-center justify-between text-xs">
          <span className="text-[#7A7D73] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8BA888]" />
            所有內容均經臨床心理學與神經科學專家審訂
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2C3324] hover:bg-[#3D4035] text-white font-bold transition-colors cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
