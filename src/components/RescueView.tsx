import React, { useState } from 'react';
import { 
  Play, 
  Wind, 
  Compass, 
  Moon, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  PhoneCall,
  Shield,
  ZapOff,
  MessageSquare,
  Target,
  Search
} from 'lucide-react';
import { RescueSession, Language } from '../types';
import { RESCUE_SESSIONS } from '../data/mockData';
import { RESCUE_CATEGORY_THEMES, getRescueTheme } from '../utils/categoryTheme';

interface RescueViewProps {
  lang: Language;
  onOpenRescue: (session: RescueSession) => void;
  onOpenCrisis: () => void;
}

export const RescueView: React.FC<RescueViewProps> = ({
  lang,
  onOpenRescue,
  onOpenCrisis,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '全部急救練習', en: 'All Rescues', count: RESCUE_SESSIONS.length },
    { id: 'anxiety', label: '焦慮與心悸', en: 'Anxiety & Panic', count: RESCUE_SESSIONS.filter(s => s.category === 'anxiety').length },
    { id: 'overwhelm', label: '大腦過載與宕機', en: 'Overwhelm & Reset', count: RESCUE_SESSIONS.filter(s => s.category === 'overwhelm').length },
    { id: 'burnout', label: '職場重壓與倦怠', en: 'Burnout & Career', count: RESCUE_SESSIONS.filter(s => s.category === 'burnout').length },
    { id: 'procrastination', label: '拖延與動力啟動', en: 'Procrastination & Action', count: RESCUE_SESSIONS.filter(s => s.category === 'procrastination').length },
    { id: 'criticism', label: '批評與自我懷疑', en: 'Criticism & Imposter', count: RESCUE_SESSIONS.filter(s => s.category === 'criticism').length },
    { id: 'anger', label: '憤怒與煩躁降溫', en: 'Anger & Irritation', count: RESCUE_SESSIONS.filter(s => s.category === 'anger').length },
    { id: 'relationships', label: '關係衝突與界線', en: 'Conflict & Boundaries', count: RESCUE_SESSIONS.filter(s => s.category === 'relationships').length },
    { id: 'grief', label: '悲傷低落與失落', en: 'Grief & Heartbreak', count: RESCUE_SESSIONS.filter(s => s.category === 'grief').length },
    { id: 'sleep', label: '失眠與睡前雜念', en: 'Insomnia & Sleep', count: RESCUE_SESSIONS.filter(s => s.category === 'sleep').length },
    { id: 'focus', label: '專注提神與定心', en: 'Focus & Clarity', count: RESCUE_SESSIONS.filter(s => s.category === 'focus').length },
  ];

  const filteredSessions = RESCUE_SESSIONS.filter((sess) => {
    const matchesCat = selectedCategory === 'all' || sess.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      sess.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sess.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getRescueIcon = (cat: string) => {
    switch (cat) {
      case 'anxiety':
        return <Wind className="w-6 h-6 text-[#8BA888]" />;
      case 'overwhelm':
        return <Compass className="w-6 h-6 text-[#647A5F]" />;
      case 'burnout':
        return <ZapOff className="w-6 h-6 text-[#C88A58]" />;
      case 'procrastination':
        return <Play className="w-6 h-6 text-[#8BA888]" />;
      case 'criticism':
        return <Shield className="w-6 h-6 text-[#D97706]" />;
      case 'sleep':
        return <Moon className="w-6 h-6 text-[#6366F1]" />;
      case 'anger':
        return <Flame className="w-6 h-6 text-[#E11D48]" />;
      case 'relationships':
        return <MessageSquare className="w-6 h-6 text-[#0D9488]" />;
      case 'grief':
        return <Heart className="w-6 h-6 text-[#9333EA]" />;
      case 'focus':
        return <Target className="w-6 h-6 text-[#2563EB]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#8BA888]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full">
              ⚡ 40 款急速舒緩微練習 (2-5 分鐘)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
            即時情緒急救站 (Rescue Sessions 40)
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1 max-w-2xl">
            涵蓋焦慮、大腦過載、職場倦怠、拖延、批評懷疑、憤怒、人際界線、悲傷、失眠與專注等 40 個完整臨床急救練習，在幾分鐘內迅速幫你恢復平靜與能量。
          </p>
        </div>

        {/* SOS Hotline button */}
        <button
          onClick={onOpenCrisis}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F9F8F4] border border-[#E8E6E0] text-[#3D4035] text-xs font-bold transition-all shadow-xs cursor-pointer self-start"
        >
          <PhoneCall className="w-4 h-4 text-[#C88A58] animate-pulse" />
          <span>24/7 心理危機求助專線</span>
        </button>
      </div>

      {/* Search Bar & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7D73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋急救主題（如：焦慮、呼吸、下班、拖延、睡前...）"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E6E0] text-xs text-[#2C3324] placeholder-[#7A7D73] focus:outline-none focus:border-[#8BA888] focus:ring-1 focus:ring-[#8BA888]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5A6352]">
            <span className="font-bold text-[#2C3324]">急救情境分類（全覽直選）：</span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[#5A6E55] hover:text-[#2C3324] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
              >
                顯示全部 40 款急救練習
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const theme = RESCUE_CATEGORY_THEMES[cat.id] || RESCUE_CATEGORY_THEMES.all;
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
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSessions.map((sess) => {
          const theme = getRescueTheme(sess.category);
          return (
            <div
              key={sess.id}
              className={`p-5 sm:p-6 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs ${theme.cardBorderHover} hover:shadow-md transition-all flex flex-col justify-between space-y-5`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} border ${theme.badgeBorder} flex items-center justify-center`}>
                    {getRescueIcon(sess.category)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} px-2 py-0.5 rounded-full`}>
                      {theme.name}
                    </span>
                    <span className="text-[11px] font-bold text-[#7A7D73] bg-[#FDFCF8] border border-[#E8E6E0] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#7A7D73]" />
                      {sess.durationText}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#2C3324] leading-snug">{sess.title}</h3>
                  <p className="text-xs text-[#7A7D73] mt-1 leading-relaxed line-clamp-2">{sess.subtitle}</p>
                </div>

                {/* Step Highlights list */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-[#2C3324]">練習步驟：</p>
                  <div className="space-y-1">
                    {sess.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-[#FDFCF8] border border-[#E8E6E0]/60 text-[11px] text-[#3D4035] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`w-4 h-4 shrink-0 rounded-md ${theme.iconBg} ${theme.badgeText} text-[9px] font-bold flex items-center justify-center`}>
                            {idx + 1}
                          </span>
                          <span className="font-medium truncate">{step.phase}</span>
                        </div>
                        <span className="text-[10px] text-[#7A7D73] shrink-0 ml-1">{step.durationSec}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenRescue(sess)}
                className={`w-full py-2.5 rounded-2xl ${theme.pillActiveBg} hover:opacity-90 text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 group`}
              >
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>啟動急救練習 ({sess.durationText})</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
