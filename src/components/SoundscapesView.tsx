import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  CloudRain, 
  Waves, 
  Bell, 
  Trees, 
  Music, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Search,
  X,
  Compass,
  Heart,
  Moon,
  Zap,
  Smile,
  BookOpen
} from 'lucide-react';
import { SoundscapeItem, GuidedMeditation, Language } from '../types';
import { SOUNDSCAPES, GUIDED_MEDITATIONS } from '../data/mockData';
import { MEDITATION_CATEGORY_THEMES, getMeditationTheme } from '../utils/categoryTheme';

interface SoundscapesViewProps {
  lang: Language;
  activeSound: SoundscapeItem | null;
  isPlaying: boolean;
  onSelectSound: (sound: SoundscapeItem) => void;
  onTogglePlay: () => void;
  onOpenMeditation: (meditation: GuidedMeditation) => void;
}

export const SoundscapesView: React.FC<SoundscapesViewProps> = ({
  lang,
  activeSound,
  isPlaying,
  onSelectSound,
  onTogglePlay,
  onOpenMeditation,
}) => {
  const [viewMode, setViewMode] = useState<'meditations' | 'soundscapes'>('meditations');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timerMinutes, setTimerMinutes] = useState<number>(30);

  const categories = [
    { id: 'all', label: '全部冥想', en: 'All Meditations' },
    { id: 'peace', label: '內在平靜與定心', en: 'Inner Peace & Stillness' },
    { id: 'body', label: '身體覺察與放鬆', en: 'Body Awareness & Release' },
    { id: 'emotions', label: '情緒接納與解離', en: 'Emotional Acceptance & Thought Defusion' },
    { id: 'compassion', label: '慈心與自我關懷', en: 'Loving-Kindness & Compassion' },
    { id: 'sleep', label: '深度睡眠與夢境', en: 'Sleep & Deep Rest' },
    { id: 'focus', label: '專注心流與清醒', en: 'Focus, Clarity & Flow' },
  ];

  const filteredMeditations = useMemo(() => {
    return GUIDED_MEDITATIONS.filter((m) => {
      const matchCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const getSoundIcon = (id: string) => {
    switch (id) {
      case 'sound-rain':
        return <CloudRain className="w-8 h-8 text-[#8BA888]" />;
      case 'sound-ocean':
        return <Waves className="w-8 h-8 text-[#647A5F]" />;
      case 'sound-bowl':
        return <Bell className="w-8 h-8 text-[#C88A58]" />;
      case 'sound-forest':
        return <Trees className="w-8 h-8 text-[#8BA888]" />;
      default:
        return <Music className="w-8 h-8 text-[#7A7D73]" />;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'peace':
        return <Compass className="w-4 h-4 text-[#8BA888]" />;
      case 'body':
        return <Sparkles className="w-4 h-4 text-[#C88A58]" />;
      case 'emotions':
        return <Smile className="w-4 h-4 text-[#647A5F]" />;
      case 'compassion':
        return <Heart className="w-4 h-4 text-[#D48C80]" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-[#7A8B99]" />;
      case 'focus':
        return <Zap className="w-4 h-4 text-[#D4A373]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#8BA888]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full">
              正念冥想 · Meditations
            </span>
            <span className="text-xs font-semibold text-[#5A6352] bg-[#FDFCF8] border border-[#E8E6E0] px-2.5 py-0.5 rounded-full">
              Guided meditations for inner peace & stillness
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
            正念冥想與聲學舒緩 (Meditations & Soundscapes)
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1 max-w-2xl">
            尋求內在平靜與定心。由臨床心理學家設計的導引冥想與聲學神經調節白噪音，平息過度活躍的交感神經，喚醒自癒與安穩力量。
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#7A7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋導引冥想或放鬆音療..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E8E6E0] rounded-2xl text-xs text-[#2C3324] placeholder-[#A0A398] focus:outline-hidden focus:border-[#8BA888] focus:ring-2 focus:ring-[#8BA888]/20 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7D73] hover:text-[#2C3324] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div className="flex p-1 bg-[#E8E6E0]/60 rounded-2xl max-w-md">
        <button
          onClick={() => setViewMode('meditations')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            viewMode === 'meditations'
              ? 'bg-white text-[#2C3324] shadow-xs'
              : 'text-[#5A6352] hover:text-[#2C3324]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8BA888]" />
          <span>導引冥想庫 (Meditations)</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-[#E9F0E8] text-[#2C3324] rounded-full">
            {GUIDED_MEDITATIONS.length}
          </span>
        </button>

        <button
          onClick={() => setViewMode('soundscapes')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            viewMode === 'soundscapes'
              ? 'bg-white text-[#2C3324] shadow-xs'
              : 'text-[#5A6352] hover:text-[#2C3324]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-[#8BA888]" />
          <span>自然白噪音 (Soundscapes)</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-[#E9F0E8] text-[#2C3324] rounded-full">
            {SOUNDSCAPES.length}
          </span>
        </button>
      </div>

      {/* MEDITATIONS TAB */}
      {viewMode === 'meditations' && (
        <div className="space-y-6">
          {/* Category Filter Pills with English subtitles (Multi-Row Full Glance) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#5A6352] px-1">
              <span className="font-bold text-[#2C3324]">冥想主題分類（一目了然直選）：</span>
              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-[#5A6E55] hover:text-[#2C3324] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
                >
                  顯示全部冥想 ({GUIDED_MEDITATIONS.length})
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {categories.map((cat) => {
                const count = cat.id === 'all'
                  ? GUIDED_MEDITATIONS.length
                  : GUIDED_MEDITATIONS.filter((m) => m.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                const theme = MEDITATION_CATEGORY_THEMES[cat.id] || MEDITATION_CATEGORY_THEMES.all;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                      isSelected
                        ? `${theme.pillActiveBg} ${theme.pillActiveText} shadow-sm ring-2 ring-offset-1 ring-black/10`
                        : `bg-white ${theme.badgeText} border ${theme.badgeBorder} ${theme.pillInactiveHover}`
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : theme.dotColor}`} />
                    <span>{cat.label}</span>
                    <span className={`text-[11px] font-normal ${
                      isSelected ? 'text-white/80' : 'text-[#7A7D73]'
                    }`}>
                      · {cat.en}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : `${theme.badgeBg} ${theme.badgeText}`
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Counter bar */}
          <div className="flex items-center justify-between text-xs text-[#5A6352] px-1">
            <span>顯示 {filteredMeditations.length} / {GUIDED_MEDITATIONS.length} 個冥想練習</span>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#8BA888] hover:underline cursor-pointer font-medium"
              >
                重置所有篩選
              </button>
            )}
          </div>

          {/* Meditations Grid */}
          {filteredMeditations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E6E0] p-8">
              <Sparkles className="w-12 h-12 text-[#8BA888]/60 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#2C3324]">未找到相符的冥想練習</h3>
              <p className="text-xs text-[#7A7D73] mt-1 max-w-sm mx-auto">
                請嘗試搜尋其他關鍵字或切換類別以瀏覽全部導引冥想。
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#2C3324] text-white text-xs font-semibold rounded-xl hover:bg-[#3D4035] transition-all cursor-pointer"
              >
                查看全部冥想
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeditations.map((med) => {
                const theme = getMeditationTheme(med.category);
                return (
                  <div
                    key={med.id}
                    className={`bg-white rounded-3xl border border-[#E8E6E0] shadow-xs ${theme.cardBorderHover} hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group`}
                  >
                    <div>
                      {/* Thumbnail Image Header */}
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={med.thumbnail}
                          alt={med.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-4">
                          <div className={`flex items-center gap-1.5 ${theme.pillActiveBg} text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs`}>
                            {getCategoryIcon(med.category)}
                            <span>{med.categoryLabel}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-[#2C3324]/80 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[11px] font-medium">
                            <Clock className="w-3 h-3 text-[#8BA888]" />
                            <span>{med.durationMinutes} 分鐘</span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[#2C3324] leading-snug group-hover:text-[#8BA888] transition-colors">
                            {med.title}
                          </h3>
                          <p className="text-xs text-[#7A7D73] font-medium mt-0.5">
                            {med.titleEn}
                          </p>
                        </div>

                        <p className="text-xs text-[#5A6352] leading-relaxed line-clamp-2">
                          {med.subtitle}
                        </p>

                        {/* Stages preview pill */}
                        <div className={`p-2.5 rounded-xl text-[11px] ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} flex items-center justify-between`}>
                          <span className="font-semibold">
                            {med.stages.length} 個引導階段
                          </span>
                          <span className="text-xs opacity-90">
                            伴隨 {med.soundType === 'singingBowl' ? '西藏頌缽' : med.soundType === 'ocean' ? '深藍海浪' : med.soundType === 'rain' ? '綿綿細雨' : '自然微風'} 音療
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {med.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Play Action */}
                    <div className="p-5 sm:p-6 pt-0 border-t border-[#E8E6E0] mt-2">
                      <button
                        onClick={() => onOpenMeditation(med)}
                        className={`w-full py-3 rounded-2xl ${theme.pillActiveBg} hover:opacity-90 text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2`}
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>開始導引冥想 ({med.durationMinutes} 分鐘)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SOUNDSCAPES TAB */}
      {viewMode === 'soundscapes' && (
        <div className="space-y-6">
          {/* Timer Preset Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E6E0] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#2C3324]">
              <Clock className="w-4 h-4 text-[#8BA888]" />
              <span>自動定時停止播放器：</span>
            </div>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimerMinutes(mins)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    timerMinutes === mins
                      ? 'bg-[#2C3324] text-white shadow-xs'
                      : 'bg-[#F1F5EF] text-[#5A6352] hover:bg-[#E9F0E8]'
                  }`}
                >
                  {mins} 分鐘
                </button>
              ))}
            </div>
          </div>

          {/* Soundscape Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOUNDSCAPES.map((snd) => {
              const isThisActive = activeSound?.id === snd.id;
              const isThisPlaying = isThisActive && isPlaying;

              return (
                <div
                  key={snd.id}
                  className={`p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between space-y-6 ${
                    isThisActive
                      ? 'bg-[#2C3324] text-[#FDFCF8] border-[#8BA888] shadow-xl ring-2 ring-[#8BA888]/30'
                      : 'bg-white text-[#3D4035] border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-md'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isThisActive ? 'bg-[#37402E] border border-[#8BA888]/40' : 'bg-[#F1F5EF] border border-[#E8E6E0]'
                      }`}>
                        {getSoundIcon(snd.id)}
                      </div>
                      {isThisActive && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#8BA888]/30 text-[#E9F0E8] border border-[#8BA888]/40 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#8BA888] animate-ping" />
                          正在播放中
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold">{snd.name}</h3>
                      <p className={`text-xs mt-0.5 ${isThisActive ? 'text-[#C9D6C8]' : 'text-[#7A7D73]'}`}>
                        {snd.nameEn}
                      </p>
                    </div>

                    <p className={`text-xs leading-relaxed ${isThisActive ? 'text-[#E9F0E8]/90' : 'text-[#5A6352]'}`}>
                      {snd.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (isThisActive) {
                        onTogglePlay();
                      } else {
                        onSelectSound(snd);
                      }
                    }}
                    className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                      isThisActive
                        ? 'bg-[#8BA888] hover:bg-[#759672] text-white'
                        : 'bg-[#2C3324] hover:bg-[#8BA888] text-white'
                    }`}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>暫停播放</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                        <span>{isThisActive ? '繼續播放' : '開始聆聽'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
