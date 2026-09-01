import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Sparkles,
  Search,
  X,
  Compass,
  Heart,
  Moon,
  Zap,
  Smile,
  Clock,
  CheckSquare,
  ShieldCheck,
  UserCheck,
  Headphones,
  Volume2,
  Globe
} from 'lucide-react';
import { AudioGuide, Language } from '../types';
import { AUDIO_GUIDES } from '../data/mockData';
import { AUDIO_CATEGORY_THEMES, getAudioTheme } from '../utils/categoryTheme';
import { speechEngine, VoiceLang } from '../utils/speechEngine';

interface AudioGuidesViewProps {
  lang: Language;
  onOpenGuide: (guide: AudioGuide) => void;
}

export const AudioGuidesView: React.FC<AudioGuidesViewProps> = ({
  lang,
  onOpenGuide,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [voiceLang, setVoiceLang] = useState<VoiceLang>(() => speechEngine.getVoiceLang());

  const isEnglish = voiceLang === 'english' || lang === 'en';

  const handleVoiceLangSelect = (newLang: VoiceLang) => {
    setVoiceLang(newLang);
    speechEngine.setVoiceLang(newLang);
  };

  const categories = [
    { id: 'all', label: '全部音訊導引', en: 'All Audio Guides' },
    { id: 'emotions', label: '情緒調適與降溫', en: 'Emotional Agility & Coping' },
    { id: 'workplace', label: '職場身心與界線', en: 'Workplace & Boundaries' },
    { id: 'relationships', label: '人際關係與溝通', en: 'Relationships & Connection' },
    { id: 'self-growth', label: '自我關懷與接納', en: 'Self-Compassion & Growth' },
    { id: 'sleep-rest', label: '睡眠與深度卸壓', en: 'Sleep & Deep Rest' },
    { id: 'focus-flow', label: '專注心流與動力', en: 'Focus, Clarity & Flow' },
  ];

  const filteredGuides = useMemo(() => {
    return AUDIO_GUIDES.filter((g) => {
      const matchCategory = selectedCategory === 'all' || g.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        g.title.toLowerCase().includes(q) ||
        g.titleEn.toLowerCase().includes(q) ||
        g.subtitle.toLowerCase().includes(q) ||
        (g.subtitleEn && g.subtitleEn.toLowerCase().includes(q)) ||
        g.description.toLowerCase().includes(q) ||
        (g.descriptionEn && g.descriptionEn.toLowerCase().includes(q)) ||
        g.guideName.toLowerCase().includes(q) ||
        (g.guideNameEn && g.guideNameEn.toLowerCase().includes(q)) ||
        g.clinicalFramework.toLowerCase().includes(q) ||
        (g.clinicalFrameworkEn && g.clinicalFrameworkEn.toLowerCase().includes(q)) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        (g.tagsEn && g.tagsEn.some((t) => t.toLowerCase().includes(q)));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'emotions':
        return <Smile className="w-4 h-4 text-[#8BA888]" />;
      case 'workplace':
        return <Compass className="w-4 h-4 text-[#647A5F]" />;
      case 'relationships':
        return <Heart className="w-4 h-4 text-[#D48C80]" />;
      case 'self-growth':
        return <Sparkles className="w-4 h-4 text-[#C88A58]" />;
      case 'sleep-rest':
        return <Moon className="w-4 h-4 text-[#7A8B99]" />;
      case 'focus-flow':
        return <Zap className="w-4 h-4 text-[#D4A373]" />;
      default:
        return <Headphones className="w-4 h-4 text-[#8BA888]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#2C3324]" />
              {isEnglish ? 'Intellect Audio Guides' : '音訊導引 · Audio Guides'}
            </span>
            <span className="text-xs font-semibold text-[#5A6352] bg-[#FDFCF8] border border-[#E8E6E0] px-2.5 py-0.5 rounded-full">
              Guided support to listen to & act on
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
            {isEnglish ? 'Audio Guides & Guided Action' : '音訊導引與即時行動 (Audio Guides)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1 max-w-2xl">
            {isEnglish 
              ? 'Bite-sized, evidence-based psychological guidance to listen to and act on. Led by clinical psychologists & behavioral coaches combining CBT, ACT, and neuroscience.'
              : '邊聽邊行動的專屬心理支持。由臨床心理學家與行為教練錄製，融合認知行為 (CBT)、接受承諾 (ACT) 與神經科學，陪伴你即時跨越職場、情緒與人際挑戰。'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#7A7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEnglish ? 'Search audio guides, experts or topics...' : '搜尋音訊導引、專家或心理主題...'}
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

      {/* Voice Narration Language Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#F4F7F2] border border-[#D5DFD1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2C3324] text-[#8BA888] flex items-center justify-center shrink-0 shadow-xs">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#2C3324]">旁白語音語言選擇 (Voice Narration Language)</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9F0E8] text-[#5A6E55] border border-[#C9D6C8]">
                全單元適用
              </span>
            </div>
            <p className="text-xs text-[#5A6352] mt-0.5">
              選擇音訊導引與練習的朗讀腔調（支援廣東話、普通話與英語）
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto p-1 bg-white border border-[#D5DFD1] rounded-2xl shadow-2xs">
          <button
            onClick={() => handleVoiceLangSelect('english')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              voiceLang === 'english'
                ? 'bg-[#2C3324] text-white shadow-xs'
                : 'text-[#5A6352] hover:bg-[#F1F5EF] hover:text-[#2C3324]'
            }`}
          >
            <span>🇬🇧 英語 (English)</span>
            {voiceLang === 'english' && <span className="w-1.5 h-1.5 rounded-full bg-[#8BA888]" />}
          </button>

          <button
            onClick={() => handleVoiceLangSelect('cantonese')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              voiceLang === 'cantonese'
                ? 'bg-[#2C3324] text-white shadow-xs'
                : 'text-[#5A6352] hover:bg-[#F1F5EF] hover:text-[#2C3324]'
            }`}
          >
            <span>🇭🇰 廣東話 (粵語)</span>
            {voiceLang === 'cantonese' && <span className="w-1.5 h-1.5 rounded-full bg-[#8BA888]" />}
          </button>

          <button
            onClick={() => handleVoiceLangSelect('mandarin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              voiceLang === 'mandarin'
                ? 'bg-[#2C3324] text-white shadow-xs'
                : 'text-[#5A6352] hover:bg-[#F1F5EF] hover:text-[#2C3324]'
            }`}
          >
            <span>🇹🇼 普通話 (國語)</span>
            {voiceLang === 'mandarin' && <span className="w-1.5 h-1.5 rounded-full bg-[#8BA888]" />}
          </button>
        </div>
      </div>

      {/* Category Filter Bar (Multi-Row Full Glance) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5A6352] px-1">
          <span className="font-bold text-[#2C3324]">{isEnglish ? 'Filter by Clinical Theme:' : '依心理支持維度全覽：'}</span>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-[#5A6E55] hover:text-[#2C3324] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
            >
              {isEnglish ? `Show All (${AUDIO_GUIDES.length})` : `顯示全部音訊 (${AUDIO_GUIDES.length})`}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? AUDIO_GUIDES.length
              : AUDIO_GUIDES.filter((g) => g.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            const theme = AUDIO_CATEGORY_THEMES[cat.id] || AUDIO_CATEGORY_THEMES.all;
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
                <span>{isEnglish ? cat.en : cat.label}</span>
                {!isEnglish && (
                  <span className={`text-[11px] font-normal ${
                    isSelected ? 'text-white/80' : 'text-[#7A7D73]'
                  }`}>
                    · {cat.en}
                  </span>
                )}
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
        <span>
          {isEnglish 
            ? `Showing ${filteredGuides.length} of ${AUDIO_GUIDES.length} Audio Guides` 
            : `顯示 ${filteredGuides.length} / ${AUDIO_GUIDES.length} 個音訊導引 (Audio Guides)`}
        </span>
        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#8BA888] hover:underline cursor-pointer font-medium"
          >
            {isEnglish ? 'Reset all filters' : '重置所有篩選'}
          </button>
        )}
      </div>

      {/* Audio Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E6E0] p-8">
          <Headphones className="w-12 h-12 text-[#8BA888]/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#2C3324]">
            {isEnglish ? 'No matching audio guides found' : '未找到相符的音訊導引'}
          </h3>
          <p className="text-xs text-[#7A7D73] mt-1 max-w-sm mx-auto">
            {isEnglish ? 'Try searching for other keywords or select a different category.' : '請嘗試搜尋其他關鍵字或切換類別以瀏覽全部音訊導引庫。'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#2C3324] text-white text-xs font-semibold rounded-xl hover:bg-[#3D4035] transition-all cursor-pointer"
          >
            {isEnglish ? 'View All Audio Guides' : '查看全部音訊導引'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => {
            const theme = getAudioTheme(guide.category);
            const isCantonese = voiceLang === 'cantonese';
            const cardTitle = isEnglish 
              ? guide.titleEn 
              : (isCantonese && guide.titleCantonese ? guide.titleCantonese : guide.title);
            const cardSub = isEnglish 
              ? (guide.subtitleEn || guide.subtitle) 
              : (isCantonese && guide.subtitleCantonese ? guide.subtitleCantonese : guide.subtitle);
            const cardFramework = isEnglish 
              ? (guide.clinicalFrameworkEn || guide.clinicalFramework) 
              : (isCantonese && guide.clinicalFrameworkCantonese ? guide.clinicalFrameworkCantonese : guide.clinicalFramework);
            const cardCategory = isEnglish 
              ? guide.categoryEn 
              : (isCantonese && guide.categoryLabelCantonese ? guide.categoryLabelCantonese : guide.categoryLabel);
            const cardRole = isEnglish 
              ? (guide.guideRoleEn || guide.guideRole) 
              : (isCantonese && guide.guideRoleCantonese ? guide.guideRoleCantonese : guide.guideRole);
            const cardActions = isEnglish && guide.actionItemsEn 
              ? guide.actionItemsEn 
              : (isCantonese && guide.actionItemsCantonese ? guide.actionItemsCantonese : guide.actionItems);
            const cardTags = isEnglish && guide.tagsEn 
              ? guide.tagsEn 
              : (isCantonese && guide.tagsCantonese ? guide.tagsCantonese : guide.tags);

            return (
              <div
                key={guide.id}
                className={`bg-white rounded-3xl border border-[#E8E6E0] shadow-xs ${theme.cardBorderHover} hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group`}
              >
                <div>
                  {/* Thumbnail Header */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={guide.thumbnail}
                      alt={guide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end justify-between p-4">
                      <div className={`flex items-center gap-1.5 ${theme.pillActiveBg} text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs`}>
                        {getCategoryIcon(guide.category)}
                        <span>{cardCategory}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#2C3324]/80 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[11px] font-medium">
                        <Clock className="w-3 h-3 text-[#8BA888]" />
                        <span>{guide.durationMinutes} {isEnglish ? 'min' : '分鐘'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#2C3324] leading-snug group-hover:text-[#8BA888] transition-colors">
                        {cardTitle}
                      </h3>
                      {!isEnglish && (
                        <p className="text-xs text-[#7A7D73] font-medium mt-0.5">
                          {guide.titleEn}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#5A6352] leading-relaxed line-clamp-2">
                      {cardSub}
                    </p>

                    {/* Speaker & Clinical Framework */}
                    <div className={`p-3 rounded-2xl ${theme.badgeBg} border ${theme.badgeBorder} space-y-1.5`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-bold ${theme.badgeText} flex items-center gap-1`}>
                          <UserCheck className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                          {guide.guideName}
                        </span>
                        <span className="text-[#7A7D73]">{cardRole.split('·')[0]}</span>
                      </div>
                      <div className="text-[10px] text-[#647A5F] font-medium bg-white/70 px-2 py-0.5 rounded-md inline-block">
                        {isEnglish ? 'Framework: ' : '實證框架：'}{cardFramework}
                      </div>
                    </div>

                    {/* Action Items Preview */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-[#2C3324] flex items-center gap-1">
                        <CheckSquare className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                        <span>
                          {isEnglish 
                            ? `Includes ${cardActions.length} guided actions to act on:` 
                            : `包含 ${guide.actionItems.length} 項即時行動實踐：`}
                        </span>
                      </div>
                      <ul className="text-[11px] text-[#5A6352] space-y-1 list-disc list-inside">
                        {cardActions.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="line-clamp-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cardTags.map((tag, idx) => (
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
                    onClick={() => onOpenGuide(guide)}
                    className={`w-full py-3 rounded-2xl ${theme.pillActiveBg} hover:opacity-90 text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>
                      {isEnglish 
                        ? `Listen & Act On (${guide.durationMinutes} min)` 
                        : `開始聆聽與行動 (${guide.durationMinutes} 分鐘)`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
