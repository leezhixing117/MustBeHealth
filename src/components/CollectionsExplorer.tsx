import React, { useState, useMemo } from 'react';
import { 
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
  ArrowRight, 
  Clock, 
  BookMarked, 
  Headphones, 
  ShieldCheck, 
  Search, 
  Flame, 
  Sun,
  Shield,
  Layers,
  Brain,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  IntellectCollection, 
  LearningPath, 
  RescueSession, 
  AudioGuide, 
  JournalTemplate, 
  Language, 
  SoundscapeItem 
} from '../types';
import { 
  INTELLECT_COLLECTIONS, 
  RESCUE_SESSIONS, 
  AUDIO_GUIDES, 
  LEARNING_PATHS, 
  JOURNAL_TEMPLATES 
} from '../data/mockData';

interface CollectionsExplorerProps {
  lang: Language;
  onSelectCollection: (col: IntellectCollection) => void;
  onOpenRescue: (session: RescueSession) => void;
  onOpenPath: (path: LearningPath, lessonIndex?: number) => void;
  onOpenAudioGuide: (guide: AudioGuide) => void;
  onOpenJournal: (templateId?: string) => void;
  onPlaySoundscape: (sound: SoundscapeItem) => void;
}

export const CollectionsExplorer: React.FC<CollectionsExplorerProps> = ({
  lang,
  onSelectCollection,
  onOpenRescue,
  onOpenPath,
  onOpenAudioGuide,
  onOpenJournal,
  onPlaySoundscape,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const categories = [
    { id: 'all', label: '全部主題', icon: Layers, count: INTELLECT_COLLECTIONS.length },
    { id: 'stress-burnout', label: '應對壓力與倦怠', icon: Flame, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'stress-burnout').length },
    { id: 'anxiety', label: '化解焦慮與思維模式', icon: Wind, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'anxiety').length },
    { id: 'sleep', label: '深度睡眠與夜間安心', icon: Moon, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'sleep').length },
    { id: 'productivity', label: '職場卓越與拖延突破', icon: Target, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'productivity').length },
    { id: 'self-compassion', label: '重塑自信與自我接納', icon: Heart, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'self-compassion').length },
    { id: 'relationships', label: '人際溝通與心理界線', icon: MessageSquare, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'relationships').length },
    { id: 'emotions', label: '情緒敏銳度與日常調節', icon: Activity, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'emotions').length },
    { id: 'growth-decisions', label: '人生階段與習慣躍升', icon: Compass, count: INTELLECT_COLLECTIONS.filter(c => c.category === 'growth-decisions').length },
  ];

  // Global Quick Situation buttons for fast access
  const QUICK_SITUATIONS = [
    {
      label: '⚡ 我快被死線壓垮了',
      sub: '2分鐘生理降溫呼吸',
      toolType: 'rescue',
      targetId: 'rescue-deadline-overwhelm',
      color: 'hover:border-[#C88A58] hover:bg-[#FAF6F0]',
    },
    {
      label: '🌊 現在很慌、心悸難平',
      sub: '4-7-8 急救呼吸法',
      toolType: 'rescue',
      targetId: 'rescue-breathe-478',
      color: 'hover:border-[#8BA888] hover:bg-[#F4F8F3]',
    },
    {
      label: '🌙 躺在床上翻來覆去睡不著',
      sub: '平息睡前運轉大腦導引',
      toolType: 'audio',
      targetId: 'ag-sleep-racing-mind',
      color: 'hover:border-[#647A5F] hover:bg-[#F1F5EF]',
    },
    {
      label: '⏳ 一直想拖延、不想動手',
      sub: '2分鐘極小化微行動',
      toolType: 'rescue',
      targetId: 'rescue-procrastination-2min',
      color: 'hover:border-[#8BA888] hover:bg-[#F4F8F3]',
    },
    {
      label: '🚫 想拒絕別人但充滿罪惡感',
      sub: '勇敢說「不」腳本演練',
      toolType: 'journal',
      targetId: 'journal-31',
      color: 'hover:border-[#647A5F] hover:bg-[#F1F5EF]',
    },
    {
      label: '💔 被批評指責了，很自責',
      sub: '批評盾牌過濾法',
      toolType: 'rescue',
      targetId: 'rescue-criticism-shield',
      color: 'hover:border-[#C88A58] hover:bg-[#FAF6F0]',
    },
    {
      label: '📝 大腦思緒太亂，想清空',
      sub: '思緒斷捨離日記',
      toolType: 'journal',
      targetId: 'journal-13',
      color: 'hover:border-[#8BA888] hover:bg-[#F4F8F3]',
    },
    {
      label: '✨ 花 3 分鐘記錄今日美好',
      sub: '每日感恩三件事',
      toolType: 'journal',
      targetId: 'journal-1',
      color: 'hover:border-[#C88A58] hover:bg-[#FAF6F0]',
    },
  ];

  // Filtered collections
  const filteredCollections = useMemo(() => {
    return INTELLECT_COLLECTIONS.filter((col) => {
      const matchCat = selectedCategory === 'all' || col.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const displayedCollections = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return filteredCollections;
    }
    return filteredCollections.slice(0, visibleCount);
  }, [filteredCollections, visibleCount, searchQuery]);

  const handleLaunchSituation = (sit: typeof QUICK_SITUATIONS[0]) => {
    if (sit.toolType === 'rescue') {
      const s = RESCUE_SESSIONS.find((item) => item.id === sit.targetId) || RESCUE_SESSIONS[0];
      onOpenRescue(s);
    } else if (sit.toolType === 'journal') {
      onOpenJournal(sit.targetId);
    } else if (sit.toolType === 'audio') {
      const a = AUDIO_GUIDES.find((item) => item.id === sit.targetId) || AUDIO_GUIDES[0];
      onOpenAudioGuide(a);
    }
  };

  const getCollectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'ZapOff': return <ZapOff className="w-5 h-5 text-[#C88A58]" />;
      case 'Flame': return <Flame className="w-5 h-5 text-[#C88A58]" />;
      case 'Wind': return <Wind className="w-5 h-5 text-[#8BA888]" />;
      case 'Moon': return <Moon className="w-5 h-5 text-[#647A5F]" />;
      case 'Sun': return <Sun className="w-5 h-5 text-[#C88A58]" />;
      case 'Target': return <Target className="w-5 h-5 text-[#7A8C74]" />;
      case 'Brain': return <Brain className="w-5 h-5 text-[#7A8C74]" />;
      case 'Shield': return <Shield className="w-5 h-5 text-[#5A6E55]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#8BA888]" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-[#5A6E55]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#C88A58]" />;
      case 'Activity': return <Activity className="w-5 h-5 text-[#7A7D73]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-[#2C3324]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#647A5F]" />;
      case 'Play': return <Play className="w-5 h-5 text-[#8BA888]" />;
      default: return <Sparkles className="w-5 h-5 text-[#8BA888]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#5A6E55]" />
              55 主題專區完整收編 · 依主題探索
            </span>
            <span className="text-xs text-[#7A7D73]">醫定要健康 55 Curated Collections</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C3324] tracking-tight flex items-center gap-2">
            <span>主題分類專區 · 全套 55 個情境工具庫</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1">
            已收編 醫定要健康 官方全部 55 個分類主題（涵蓋職場高壓、睡眠失眠、情緒調節、自我慈悲、人際界線、神經多樣性與人生抉擇），整合多模態實證工具。
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#7A7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(8);
            }}
            placeholder="搜尋 55 個專題關鍵字..."
            className="w-full pl-9.5 pr-4 py-2.5 text-xs bg-white rounded-2xl border border-[#E8E6E0] focus:outline-hidden focus:border-[#8BA888] text-[#2C3324] placeholder-[#7A7D73] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#7A7D73] hover:text-[#2C3324]"
            >
              清除
            </button>
          )}
        </div>
      </div>

      {/* 1. Fast Situational Matcher (即時困擾導航快捷列) */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#F9F8F4] via-white to-[#F1F5EF] border border-[#E8E6E0] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#E9F0E8] text-[#2C3324] flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#2C3324]">
              依你現在的即時需求快速開啟工具 (Instant Tool Match)：
            </h3>
          </div>
          <span className="text-[11px] text-[#7A7D73] hidden sm:inline">一鍵直達 · 免去翻找時間</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {QUICK_SITUATIONS.map((sit, idx) => (
            <button
              key={idx}
              onClick={() => handleLaunchSituation(sit)}
              className={`p-3 rounded-2xl bg-white border border-[#E8E6E0] ${sit.color} hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer group`}
            >
              <div>
                <p className="text-xs font-bold text-[#2C3324] group-hover:text-[#2C3324] leading-snug line-clamp-1">
                  {sit.label}
                </p>
                <p className="text-[10px] text-[#7A7D73] mt-0.5 line-clamp-1">
                  {sit.sub}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-[#8BA888]">
                <span>即刻開始</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Category Filter Pills with Multi-Row Layout (一目了然多行排列) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#5A6352]">
          <span className="font-bold text-[#2C3324] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#5A6E55]" />
            主題分類快速切換（全套 9 大維度 · 一覽無遺）：
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setVisibleCount(8);
              }}
              className="text-[11px] text-[#5A6E55] hover:text-[#2C3324] font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
            >
              顯示全部主題 (55)
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const IconComp = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setVisibleCount(8);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-[#2C3324] text-white shadow-sm ring-2 ring-[#2C3324]/20'
                    : 'bg-white text-[#5A6352] border border-[#E8E6E0] hover:border-[#8BA888] hover:bg-[#F9F8F4] hover:text-[#2C3324]'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#C88A58]' : 'text-[#7A8C74]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#E9F0E8] text-[#2C3324]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedCollections.map((col) => {
          const totalTools =
            col.rescueSessionIds.length +
            col.learningPathIds.length +
            col.audioGuideIds.length +
            col.journalTemplateIds.length +
            col.soundscapeIds.length;

          return (
            <div
              key={col.id}
              className="rounded-3xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header & Banner */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F1F5EF] group-hover:bg-[#E9F0E8] border border-[#E8E6E0] flex items-center justify-center shrink-0 transition-colors">
                      {getCollectionIcon(col.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E9F0E8] text-[#2C3324]">
                          {col.badge}
                        </span>
                        <span className="text-[11px] text-[#7A7D73] font-medium">
                          收錄 {totalTools} 款工具
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#2C3324] mt-0.5 group-hover:text-[#8BA888] transition-colors">
                        {col.title}
                      </h3>
                      <p className="text-[11px] text-[#7A7D73] font-medium">
                        {col.titleEn}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#5A6352] line-clamp-2 leading-relaxed">
                  {col.description}
                </p>

                {/* Modality Chips Breakdown */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-[#7A7D73]">
                  <span className="px-2 py-1 rounded-lg bg-[#F9F8F4] border border-[#E8E6E0] flex items-center gap-1">
                    <ZapOff className="w-3 h-3 text-[#8BA888]" /> 急救 {col.rescueSessionIds.length} 個
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#F9F8F4] border border-[#E8E6E0] flex items-center gap-1">
                    <Headphones className="w-3 h-3 text-[#C88A58]" /> 音訊 {col.audioGuideIds.length} 首
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#F9F8F4] border border-[#E8E6E0] flex items-center gap-1">
                    <BookMarked className="w-3 h-3 text-[#8BA888]" /> 日記 {col.journalTemplateIds.length} 篇
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#F9F8F4] border border-[#E8E6E0] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#647A5F]" /> 深度課程 {col.learningPathIds.length} 門
                  </span>
                </div>

                {/* Quick 2 Featured Situations */}
                <div className="space-y-1.5 pt-2 border-t border-[#F1F5EF]">
                  <p className="text-[11px] font-bold text-[#2C3324]">推薦切入點：</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {col.quickSituations.slice(0, 2).map((sit, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (sit.toolType === 'rescue') {
                            const sess = RESCUE_SESSIONS.find((r) => r.id === sit.targetId) || RESCUE_SESSIONS[0];
                            onOpenRescue(sess);
                          } else if (sit.toolType === 'journal') {
                            onOpenJournal(sit.targetId);
                          } else if (sit.toolType === 'audio') {
                            const g = AUDIO_GUIDES.find((a) => a.id === sit.targetId) || AUDIO_GUIDES[0];
                            onOpenAudioGuide(g);
                          } else if (sit.toolType === 'path') {
                            const p = LEARNING_PATHS.find((path) => path.id === sit.targetId) || LEARNING_PATHS[0];
                            onOpenPath(p, 0);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-[#FDFCF8] border border-[#E8E6E0] hover:border-[#8BA888] text-left flex items-center justify-between text-xs cursor-pointer group/btn"
                      >
                        <span className="text-[11px] font-semibold text-[#2C3324] truncate pr-2 group-hover/btn:text-[#8BA888]">
                          {sit.label}
                        </span>
                        <Play className="w-3 h-3 text-[#8BA888] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer / Action Bar: 新增【🎧 聆聽對應音訊】CTA (1.4規範) */}
              <div className="p-4 bg-[#F9F8F4] border-t border-[#E8E6E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <span className="text-[11px] text-[#7A7D73] font-medium truncate max-w-[200px] hidden sm:inline">
                  {col.clinicalOutcome}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* CTA 1: 聆聽對應音訊 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      let targetAudio = AUDIO_GUIDES.find(a => col.audioGuideIds.includes(a.id));
                      if (!targetAudio) {
                        targetAudio = AUDIO_GUIDES.find(a => a.category === col.category) || AUDIO_GUIDES[0];
                      }
                      if (targetAudio) {
                        onOpenAudioGuide(targetAudio);
                      }
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#E9F0E8] hover:bg-[#8BA888] text-[#2C3324] hover:text-white text-xs font-bold transition-all border border-[#C9D6C8] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>🎧 聆聽對應音訊</span>
                  </button>

                  {/* CTA 2: 探索專題 */}
                  <button
                    onClick={() => onSelectCollection(col)}
                    className="px-3.5 py-2 rounded-xl bg-[#2C3324] hover:bg-[#3D4035] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>探索專題</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / Collapse or Load More */}
      {searchQuery.trim() === '' && filteredCollections.length > displayedCollections.length && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredCollections.length))}
            className="px-6 py-3 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] text-xs font-bold text-[#2C3324] hover:bg-[#F9F8F4] shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>展開更多專題 (目前顯示 {displayedCollections.length} / 共 {filteredCollections.length} 個)</span>
            <ChevronDown className="w-4 h-4 text-[#8BA888]" />
          </button>
        </div>
      )}

      {searchQuery.trim() === '' && visibleCount >= filteredCollections.length && filteredCollections.length > 8 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisibleCount(8)}
            className="px-5 py-2.5 rounded-2xl bg-[#F1F5EF] text-xs font-bold text-[#5A6352] hover:text-[#2C3324] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>收起部分專題</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}

      {filteredCollections.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E6E0] space-y-3">
          <p className="text-sm font-bold text-[#2C3324]">找不到符合「{searchQuery}」的專題分類</p>
          <p className="text-xs text-[#7A7D73]">試試搜尋「壓力」、「焦慮」、「失眠」、「拖延」、「界線」、「ADHD」或點選上方類別。</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#E9F0E8] text-[#2C3324] text-xs font-bold hover:bg-[#C9D6C8] transition-colors"
          >
            重設篩選條件
          </button>
        </div>
      )}
    </div>
  );
};
