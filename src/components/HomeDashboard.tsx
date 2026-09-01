import React, { useState } from 'react';
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Wind, 
  Compass, 
  Moon, 
  Flame, 
  Star, 
  Calendar, 
  BookOpen, 
  BookMarked, 
  ShieldCheck, 
  Activity, 
  CheckCircle2,
  Clock,
  Music,
  Heart,
  Shield,
  ZapOff,
  MessageSquare,
  Target,
  Headphones,
  UserCheck
} from 'lucide-react';
import { MoodRecord, LearningPath, RescueSession, Coach, SoundscapeItem, AudioGuide, Language, IntellectCollection } from '../types';
import { LEARNING_PATHS, RESCUE_SESSIONS, DEFAULT_CARE_CONSULTANT, SOUNDSCAPES, AUDIO_GUIDES } from '../data/mockData';
import { translations } from '../utils/i18n';
import { MoodCheckIn } from './MoodCheckIn';
import { CollectionsExplorer } from './CollectionsExplorer';
import { CollectionDetailModal } from './CollectionDetailModal';

interface HomeDashboardProps {
  lang: Language;
  todayMoodRecord?: MoodRecord | null;
  coaches?: Coach[];
  onSaveMood: (record: MoodRecord) => void;
  onOpenRescue: (session: RescueSession) => void;
  onOpenPath: (path: LearningPath, lessonIndex?: number) => void;
  onOpenAudioGuide?: (guide: AudioGuide) => void;
  onOpenCoach: (coach: Coach, mode?: 'book' | 'chat') => void;
  onOpenJournal: (templateId?: string) => void;
  onPlaySoundscape: (sound: SoundscapeItem) => void;
  onOpenAssessment: () => void;
  onTabChange: (tab: string) => void;
  streakCount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  lang,
  todayMoodRecord,
  coaches = [],
  onSaveMood,
  onOpenRescue,
  onOpenPath,
  onOpenAudioGuide = (_guide: AudioGuide) => {},
  onOpenCoach,
  onOpenJournal,
  onPlaySoundscape,
  onOpenAssessment,
  onTabChange,
  streakCount,
}) => {
  const t = translations[lang];
  const [selectedCollectionForModal, setSelectedCollectionForModal] = useState<IntellectCollection | null>(null);

  // Active user path
  const activePath = LEARNING_PATHS[0]; // Overthinking CBT path
  const nextLessonIndex = activePath.completedDays < activePath.lessons.length ? activePath.completedDays : 0;
  const nextLesson = activePath.lessons[nextLessonIndex] || activePath.lessons[0];

  const getRescueIcon = (cat: string) => {
    switch (cat) {
      case 'anxiety':
        return <Wind className="w-5 h-5 text-[#8BA888]" />;
      case 'overwhelm':
        return <Compass className="w-5 h-5 text-[#647A5F]" />;
      case 'burnout':
        return <ZapOff className="w-5 h-5 text-[#C88A58]" />;
      case 'procrastination':
        return <Play className="w-5 h-5 text-[#8BA888]" />;
      case 'criticism':
        return <Shield className="w-5 h-5 text-[#D97706]" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-[#6366F1]" />;
      case 'anger':
        return <Flame className="w-5 h-5 text-[#E11D48]" />;
      case 'relationships':
        return <MessageSquare className="w-5 h-5 text-[#0D9488]" />;
      case 'grief':
        return <Heart className="w-5 h-5 text-[#9333EA]" />;
      case 'focus':
        return <Target className="w-5 h-5 text-[#2563EB]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#8BA888]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      {/* 1. Welcome Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full">
              🌿 每日身心陪伴
            </span>
            <span className="text-xs text-[#7A7D73]">
              {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
            {t.goodAfternoon}, Alex <span className="font-normal text-[#7A7D73] text-xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Quick self assessment pill badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAssessment}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F9F8F4] border border-[#E8E6E0] shadow-xs text-xs font-semibold text-[#3D4035] transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-[#8BA888]" />
            <span>心理狀態自評 (GAD/PHQ)</span>
          </button>
        </div>
      </div>

      {/* 2. Daily Mood Check-In Card */}
      <MoodCheckIn
        lang={lang}
        onSaveMood={onSaveMood}
        onStartRescue={(id) => {
          const sess = RESCUE_SESSIONS.find((s) => s.id === id) || RESCUE_SESSIONS[0];
          onOpenRescue(sess);
        }}
        onStartJournal={onOpenJournal}
        todayRecord={todayMoodRecord}
      />

      {/* 3. Thematic Collections (參考 app.intellect.co/collection/list 快速分類探索) */}
      <CollectionsExplorer
        lang={lang}
        onSelectCollection={(col) => setSelectedCollectionForModal(col)}
        onOpenRescue={onOpenRescue}
        onOpenPath={onOpenPath}
        onOpenAudioGuide={onOpenAudioGuide}
        onOpenJournal={onOpenJournal}
        onPlaySoundscape={onPlaySoundscape}
      />

      {/* 4. Today's Active Learning Path (CBT Mini-course) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8BA888]" />
            <h2 className="text-base sm:text-lg font-bold text-[#2C3324]">{t.todayPath}</h2>
          </div>
          <button
            onClick={() => onTabChange('learning')}
            className="text-xs font-bold text-[#8BA888] hover:text-[#6d8c6a] flex items-center gap-1 cursor-pointer"
          >
            <span>瀏覽全部課程</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E6E0] shadow-xs overflow-hidden hover:border-[#8BA888] hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            <div className="md:w-1/3 relative h-48 md:h-auto min-h-[180px]">
              <img
                src={activePath.thumbnail}
                alt={activePath.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2C3324]/80 to-transparent flex items-end p-4">
                <span className="text-[11px] font-bold text-white bg-[#8BA888]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  {activePath.categoryLabel}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-[#2C3324]">
                    進度：第 {activePath.completedDays} 天 / 共 {activePath.totalDays} 天 ({Math.round((activePath.completedDays / activePath.totalDays) * 100)}%)
                  </span>
                  <span className="text-xs text-[#7A7D73] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    約 {nextLesson.durationMinutes} 分鐘
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#F1F5EF] h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-[#8BA888] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(activePath.completedDays / activePath.totalDays) * 100}%` }}
                  />
                </div>

                <h3 className="text-lg font-bold text-[#2C3324] mb-1">{activePath.title}</h3>
                <p className="text-xs text-[#5A6352] line-clamp-2 leading-relaxed">
                  {activePath.description}
                </p>

                {/* Next lesson highlight */}
                <div className="mt-3 p-3 rounded-2xl bg-[#F9F8F4] border border-[#E8E6E0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#E9F0E8] text-[#2C3324] flex items-center justify-center font-bold text-[11px]">
                      {nextLesson.dayNumber}
                    </span>
                    <div>
                      <p className="font-bold text-[#2C3324]">{nextLesson.title}</p>
                      <p className="text-[11px] text-[#7A7D73]">{nextLesson.summary}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E8E6E0]">
                <span className="text-[11px] text-[#7A7D73] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8BA888]" />
                  臨床 CBT 實證架構
                </span>

                <button
                  onClick={() => onOpenPath(activePath, nextLessonIndex)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 active:scale-98 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>開始第 {nextLesson.dayNumber} 天課程</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Rescue Sessions (2-5 Min SOS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2C3324]">{t.quickRescue}</h2>
            <p className="text-xs text-[#7A7D73]">{t.quickRescueSub}</p>
          </div>
          <button
            onClick={() => onTabChange('rescue')}
            className="text-xs font-bold text-[#8BA888] hover:text-[#6d8c6a] flex items-center gap-1 cursor-pointer"
          >
            <span>查看全部</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {RESCUE_SESSIONS.map((sess) => (
            <button
              key={sess.id}
              onClick={() => onOpenRescue(sess)}
              className="p-5 rounded-3xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#F1F5EF] group-hover:bg-[#E9F0E8] border border-[#E8E6E0] flex items-center justify-center transition-colors">
                    {getRescueIcon(sess.category)}
                  </div>
                  <span className="text-[11px] font-bold text-[#7A7D73] bg-[#F9F8F4] border border-[#E8E6E0] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sess.durationText}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2C3324] group-hover:text-[#8BA888] transition-colors">
                    {sess.title}
                  </h3>
                  <p className="text-xs text-[#7A7D73] mt-1 line-clamp-2 leading-relaxed">
                    {sess.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#2C3324] font-bold">
                <span>立即開始</span>
                <div className="w-6 h-6 rounded-full bg-[#F1F5EF] group-hover:bg-[#8BA888] group-hover:text-white flex items-center justify-center transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4.5 Audio Guides Spotlight: Guided support to listen to & act on */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#8BA888] bg-[#E9F0E8] px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#C9D6C8]/60">
                <Headphones className="w-3 h-3 text-[#8BA888]" />
                音訊導引 · Audio Guides
              </span>
              <span className="text-[11px] text-[#7A7D73] font-medium hidden sm:inline">
                Guided support to listen to & act on
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#2C3324]">音訊導引與即時行動</h2>
            <p className="text-xs text-[#7A7D73]">臨床實證語音陪伴，引導你在聆聽中實踐心理調節動作</p>
          </div>
          <button
            onClick={() => onTabChange('audio-guides')}
            className="text-xs font-bold text-[#8BA888] hover:text-[#6d8c6a] flex items-center gap-1 cursor-pointer"
          >
            <span>瀏覽全部導引 ({AUDIO_GUIDES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUDIO_GUIDES.slice(0, 3).map((guide) => (
            <div
              key={guide.id}
              onClick={() => onOpenAudioGuide ? onOpenAudioGuide(guide) : onTabChange('audio-guides')}
              className="p-5 rounded-3xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#E9F0E8] text-[#2C3324]">
                    {guide.categoryLabel}
                  </span>
                  <span className="text-[11px] text-[#7A7D73] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8BA888]" />
                    {guide.durationMinutes} 分鐘
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2C3324] group-hover:text-[#8BA888] transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-[11px] text-[#7A7D73] font-medium mt-0.5 line-clamp-1">
                    {guide.titleEn}
                  </p>
                  <p className="text-xs text-[#5A6352] mt-1.5 line-clamp-2 leading-relaxed">
                    {guide.subtitle}
                  </p>
                </div>
                <div className="text-[11px] text-[#7A7D73] flex items-center gap-1 pt-1 border-t border-[#F1F5EF]">
                  <UserCheck className="w-3 h-3 text-[#8BA888]" />
                  <span>{guide.guideName} · {guide.guideRole.split('·')[0]}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#2C3324] font-bold">
                <span className="text-[#8BA888]">聆聽並行動</span>
                <div className="w-7 h-7 rounded-full bg-[#F1F5EF] group-hover:bg-[#8BA888] group-hover:text-white flex items-center justify-center transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Guided Journals & Ambient Soundscapes 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guided Journals */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F1F5EF] text-[#2C3324] flex items-center justify-center">
                <BookMarked className="w-4 h-4 text-[#8BA888]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base text-[#2C3324]">{t.guidedJournals}</h3>
                  <span className="text-[10px] font-bold text-[#8BA888] bg-[#E9F0E8] px-1.5 py-0.2 rounded-md">43 篇</span>
                </div>
                <p className="text-[11px] text-[#7A7D73]">Reflect & clear your mind · 沉澱反思與清空思緒</p>
              </div>
            </div>
            <button
              onClick={() => onTabChange('journals')}
              className="text-xs font-bold text-[#8BA888] hover:underline cursor-pointer"
            >
              瀏覽全部 (43)
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onOpenJournal('journal-1')}
              className="w-full p-3 rounded-2xl bg-[#FDFCF8] border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F1F5EF] text-[#C88A58] flex items-center justify-center font-bold">
                  ✨
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888]">每日感恩三件事</h4>
                  <p className="text-[11px] text-[#7A7D73]">重塑大腦神經迴路，發現身邊的小美好 · 3 分鐘</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#7A7D73] group-hover:text-[#2C3324] transition-colors" />
            </button>

            <button
              onClick={() => onOpenJournal('journal-7')}
              className="w-full p-3 rounded-2xl bg-[#FDFCF8] border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F1F5EF] text-[#8BA888] flex items-center justify-center font-bold">
                  🧠
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888]">CBT 自動化思維記錄表</h4>
                  <p className="text-[11px] text-[#7A7D73]">拆解自動負向想法，找出客觀替代視角 · 6 分鐘</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#7A7D73] group-hover:text-[#2C3324] transition-colors" />
            </button>

            <button
              onClick={() => onOpenJournal('journal-13')}
              className="w-full p-3 rounded-2xl bg-[#FDFCF8] border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F1F5EF] text-[#647A5F] flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888]">大腦思緒斷捨離</h4>
                  <p className="text-[11px] text-[#7A7D73]">無過濾傾倒雜亂思緒，卸載心理過載 · 4 分鐘</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#7A7D73] group-hover:text-[#2C3324] transition-colors" />
            </button>
          </div>
        </div>

        {/* Ambient Soundscapes & Meditations */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F1F5EF] text-[#2C3324] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#8BA888]" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#2C3324]">正念冥想與聲學舒緩</h3>
                <p className="text-[11px] text-[#7A7D73]">導引冥想庫與自然白噪音，尋求內在平靜與定心</p>
              </div>
            </div>
            <button
              onClick={() => onTabChange('soundscapes')}
              className="text-xs font-bold text-[#8BA888] hover:underline cursor-pointer"
            >
              瀏覽全部
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {SOUNDSCAPES.slice(0, 4).map((snd) => (
              <button
                key={snd.id}
                onClick={() => onPlaySoundscape(snd)}
                className="p-3 rounded-2xl bg-[#FDFCF8] border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#2C3324] group-hover:text-[#8BA888] truncate">
                    {snd.name}
                  </p>
                  <p className="text-[10px] text-[#7A7D73] truncate">{snd.nameEn}</p>
                </div>
                <div className="w-7 h-7 rounded-xl bg-[#F1F5EF] text-[#2C3324] group-hover:bg-[#8BA888] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. 1-on-1 Professional Care Spotlight (Moved to Absolute Bottom) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2C3324]">{t.coachCareTitle}</h2>
            <p className="text-xs text-[#7A7D73]">{t.coachCareSub}</p>
          </div>
          <button
            onClick={() => onTabChange('care')}
            className="text-xs font-bold text-[#8BA888] hover:text-[#6d8c6a] flex items-center gap-1 cursor-pointer"
          >
            <span>尋找更多專家</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {coaches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coaches.slice(0, 2).map((coach) => (
              <div
                key={coach.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-[#E8E6E0] shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm sm:text-base text-[#2C3324] truncate">
                        {coach.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8] shrink-0">
                        {coach.roleLabel}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A7D73] truncate mt-0.5">{coach.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5A6352]">
                      <span className="flex items-center gap-1 font-semibold text-[#C88A58]">
                        <Star className="w-3.5 h-3.5 fill-[#C88A58] text-[#C88A58]" />
                        {coach.rating} ({coach.reviewCount})
                      </span>
                      <span>·</span>
                      <span className="text-[#7A7D73]">{coach.yearsExperience} 年資歷</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {coach.specialties.slice(0, 3).map((sp, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-[#F1F5EF] text-[#5A6352] font-medium">
                      #{sp}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E8E6E0] flex items-center gap-2">
                  <button
                    onClick={() => onOpenCoach(coach, 'chat')}
                    className="flex-1 py-2 rounded-xl bg-[#F1F5EF] hover:bg-[#E9F0E8] text-[#3D4035] text-xs font-bold transition-colors cursor-pointer"
                  >
                    即時文字諮詢
                  </button>
                  <button
                    onClick={() => onOpenCoach(coach, 'book')}
                    className="flex-1 py-2 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    預約諮詢時段
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8]">
                  線上諮詢與預約功能運作中
                </span>
              </div>
              <h3 className="font-bold text-base text-[#2C3324]">專業 1對1 心理照護與教練支援</h3>
              <p className="text-xs text-[#7A7D73] max-w-xl">
                已準備就緒。你可以直接開啟即時文字諮詢、安排預約時段，或在專家管理專區新增心理師與健康教練。
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => onOpenCoach(DEFAULT_CARE_CONSULTANT, 'chat')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#F1F5EF] hover:bg-[#E9F0E8] text-[#2C3324] text-xs font-bold transition-colors cursor-pointer"
              >
                即時文字諮詢
              </button>
              <button
                onClick={() => onOpenCoach(DEFAULT_CARE_CONSULTANT, 'book')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 cursor-pointer"
              >
                預約諮詢時段
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collection Detail Full Modal */}
      {selectedCollectionForModal && (
        <CollectionDetailModal
          collection={selectedCollectionForModal}
          lang={lang}
          onClose={() => setSelectedCollectionForModal(null)}
          onOpenRescue={onOpenRescue}
          onOpenPath={onOpenPath}
          onOpenAudioGuide={onOpenAudioGuide}
          onOpenJournal={onOpenJournal}
          onOpenCoach={onOpenCoach}
          onPlaySoundscape={onPlaySoundscape}
        />
      )}
    </div>
  );
};
