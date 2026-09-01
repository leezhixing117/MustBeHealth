import React, { useState, useMemo } from 'react';
import { 
  BookMarked, 
  Sparkles, 
  Brain, 
  Moon, 
  Target, 
  Plus, 
  Calendar, 
  Tag, 
  Clock, 
  ArrowRight,
  Search,
  CheckCircle2,
  Filter,
  Shield,
  Heart,
  HeartHandshake,
  Sun,
  Flame,
  CloudRain,
  Compass,
  Zap,
  ZapOff,
  Feather,
  Award,
  Layers,
  Unlock,
  MessageSquare,
  Mail,
  UserCheck,
  UserX,
  BedDouble,
  ListOrdered,
  FileText,
  Sliders,
  Scale,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { JournalEntry, JournalTemplate, JournalCategory, Language } from '../types';
import { JOURNAL_TEMPLATES } from '../data/mockData';
import { JOURNAL_CATEGORY_THEMES, getJournalTheme } from '../utils/categoryTheme';

interface JournalsViewProps {
  lang: Language;
  entries: JournalEntry[];
  onOpenJournalModal: (templateId?: string) => void;
}

export const JournalsView: React.FC<JournalsViewProps> = ({
  lang,
  entries,
  onOpenJournalModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '全部日記', labelEn: 'All Journals', count: JOURNAL_TEMPLATES.length },
    { id: 'gratitude', label: '感恩與日常反思', labelEn: 'Daily Gratitude', count: 6 },
    { id: 'cbt', label: 'CBT 認知重塑', labelEn: 'Cognitive Reframing', count: 6 },
    { id: 'stress-burnout', label: '壓力與防倦怠', labelEn: 'Stress & Burnout', count: 6 },
    { id: 'self-compassion', label: '自我關懷與接納', labelEn: 'Self-Compassion', count: 6 },
    { id: 'emotions', label: '情緒疏導與覺察', labelEn: 'Emotional Agility', count: 6 },
    { id: 'relationships', label: '人際關係與界線', labelEn: 'Relationships & Boundaries', count: 5 },
    { id: 'sleep', label: '睡眠與夜間安心', labelEn: 'Sleep & Night Rest', count: 4 },
    { id: 'growth-decisions', label: '目標決策與成長', labelEn: 'Goals & Decision Making', count: 4 },
  ];

  const getTemplateIcon = (iconName: string, cat: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#C88A58]" />;
      case 'Sun': return <Sun className="w-5 h-5 text-[#C88A58]" />;
      case 'Moon': return <Moon className="w-5 h-5 text-[#7A7D73]" />;
      case 'Smile': return <Sparkles className="w-5 h-5 text-[#8BA888]" />;
      case 'Award': return <Award className="w-5 h-5 text-[#C88A58]" />;
      case 'Feather': return <Feather className="w-5 h-5 text-[#8BA888]" />;
      case 'Brain': return <Brain className="w-5 h-5 text-[#8BA888]" />;
      case 'Search': return <Search className="w-5 h-5 text-[#8BA888]" />;
      case 'ZapOff': return <ZapOff className="w-5 h-5 text-[#C88A58]" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-[#647A5F]" />;
      case 'Scale': return <Scale className="w-5 h-5 text-[#8BA888]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#7A7D73]" />;
      case 'Shield': return <Shield className="w-5 h-5 text-[#647A5F]" />;
      case 'Battery': return <Zap className="w-5 h-5 text-[#C88A58]" />;
      case 'Target': return <Target className="w-5 h-5 text-[#647A5F]" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-[#8BA888]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#C88A58]" />;
      case 'Unlock': return <Unlock className="w-5 h-5 text-[#8BA888]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-[#647A5F]" />;
      case 'Flame': return <Flame className="w-5 h-5 text-[#C88A58]" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-[#7A7D73]" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-[#8BA888]" />;
      case 'Eye': return <Eye className="w-5 h-5 text-[#647A5F]" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-[#8BA888]" />;
      case 'Mail': return <Mail className="w-5 h-5 text-[#C88A58]" />;
      case 'UserX': return <UserX className="w-5 h-5 text-[#7A7D73]" />;
      case 'BedDouble': return <BedDouble className="w-5 h-5 text-[#7A7D73]" />;
      case 'ListOrdered': return <ListOrdered className="w-5 h-5 text-[#647A5F]" />;
      default: return <BookMarked className="w-5 h-5 text-[#8BA888]" />;
    }
  };

  const filteredTemplates = useMemo(() => {
    return JOURNAL_TEMPLATES.filter((tpl) => {
      const matchCat = selectedCategory === 'all' || tpl.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchSearch =
        tpl.title.toLowerCase().includes(q) ||
        tpl.titleEn.toLowerCase().includes(q) ||
        tpl.subtitle.toLowerCase().includes(q) ||
        tpl.clinicalFramework.toLowerCase().includes(q) ||
        tpl.tags.some((t) => t.toLowerCase().includes(q)) ||
        tpl.prompts.some((p) => p.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6E0] shadow-xs relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#E9F0E8] rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-[#8BA888]" />
                Reflect & clear your mind · 引導式自我照顧日記
              </span>
              <span className="text-xs font-bold text-[#8BA888] bg-[#F1F5EF] px-2.5 py-0.5 rounded-full border border-[#C9D6C8]/60">
                43 篇臨床實證完整收編
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
              沉澱反思與清空思緒 (Guided Journals)
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6352] leading-relaxed">
              將混亂的情緒轉化為清晰的字句。結合認知行為療法（CBT）、正向心理學、接納承諾療法（ACT）與睡眠衛生學，提供 43 門結構化深度提問，陪伴你隨時梳理心緒、卸載壓力與重拾力量。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenJournalModal()}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>隨心開啟日記</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#F1F5EF] text-center sm:text-left">
          <div className="p-3 bg-[#F9F8F4] rounded-2xl border border-[#E8E6E0]">
            <p className="text-[11px] text-[#7A7D73] font-semibold">收錄引導日記</p>
            <p className="text-lg font-bold text-[#2C3324] mt-0.5">43 篇</p>
          </div>
          <div className="p-3 bg-[#F9F8F4] rounded-2xl border border-[#E8E6E0]">
            <p className="text-[11px] text-[#7A7D73] font-semibold">涵蓋心理維度</p>
            <p className="text-lg font-bold text-[#2C3324] mt-0.5">8 大核心範疇</p>
          </div>
          <div className="p-3 bg-[#F9F8F4] rounded-2xl border border-[#E8E6E0]">
            <p className="text-[11px] text-[#7A7D73] font-semibold">歷史書寫記錄</p>
            <p className="text-lg font-bold text-[#8BA888] mt-0.5">{entries.length} 篇</p>
          </div>
          <div className="p-3 bg-[#F9F8F4] rounded-2xl border border-[#E8E6E0]">
            <p className="text-[11px] text-[#7A7D73] font-semibold">臨床實證支持</p>
            <p className="text-lg font-bold text-[#2C3324] mt-0.5">100% CBT & ACT</p>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#7A7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋 43 篇日記、提問關鍵字或心理框架..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E6E0] rounded-2xl text-xs text-[#2C3324] placeholder:text-[#8C8F85] focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A7D73] hover:text-[#2C3324]"
              >
                清除
              </button>
            )}
          </div>

          <div className="text-xs text-[#7A7D73] font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#8BA888]" />
            <span>顯示中：{filteredTemplates.length} 篇引導日記</span>
          </div>
        </div>

        {/* Category Pills (Multi-Row Full Glance) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5A6352]">
            <span className="font-bold text-[#2C3324]">日記主題分類（一目了然直選）：</span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[#5A6E55] hover:text-[#2C3324] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
              >
                顯示全部 43 篇引導日記
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const theme = JOURNAL_CATEGORY_THEMES[cat.id] || JOURNAL_CATEGORY_THEMES.all;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isSelected
                      ? `${theme.pillActiveBg} ${theme.pillActiveText} shadow-sm ring-2 ring-offset-1 ring-black/10`
                      : `bg-white ${theme.badgeText} border ${theme.badgeBorder} ${theme.pillInactiveHover}`
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : theme.dotColor}`} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-[#FDFCF8]'
                      : `${theme.badgeBg} ${theme.badgeText}`
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2C3324]">
            {selectedCategory === 'all' 
              ? `全部引導日記庫 (${filteredTemplates.length})` 
              : `${categories.find((c) => c.id === selectedCategory)?.label} (${filteredTemplates.length})`}
          </h2>
          <span className="text-xs text-[#7A7D73]">點選卡片即可開始記錄</span>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E6E0] space-y-3">
            <BookMarked className="w-10 h-10 text-[#7A7D73] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#2C3324]">查無符合「{searchQuery}」的引導日記</p>
            <p className="text-xs text-[#7A7D73]">請嘗試其他關鍵字，或切換至「全部日記」分類瀏覽。</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-[#8BA888] hover:underline cursor-pointer"
            >
              重設所有篩選條件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => {
              const theme = getJournalTheme(tpl.category);
              return (
                <div
                  key={tpl.id}
                  className={`p-5 rounded-3xl bg-white border border-[#E8E6E0] ${theme.cardBorderHover} hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group`}
                >
                  <div className="space-y-3">
                    {/* Top Metadata */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                        {tpl.categoryLabel}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-[#7A7D73] font-semibold">
                        <span className="flex items-center gap-0.5">
                          <Clock className={`w-3 h-3 ${theme.iconColor}`} />
                          {tpl.estimatedMinutes} 分鐘
                        </span>
                        <span>·</span>
                        <span>{tpl.prompts.length} 個提問</span>
                      </div>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0 transition-colors mt-0.5 border ${theme.badgeBorder}`}>
                        {getTemplateIcon(tpl.icon, tpl.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#2C3324] leading-snug">
                          {tpl.title}
                        </h3>
                        <p className="text-[11px] text-[#7A7D73] font-medium mt-0.5 line-clamp-1">
                          {tpl.titleEn}
                        </p>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-xs text-[#5A6352] line-clamp-2 leading-relaxed">
                      {tpl.subtitle}
                    </p>

                    {/* Framework Badge */}
                    <div className="pt-1 text-[11px] text-[#7A7D73] flex items-center gap-1 border-t border-[#F1F5EF]">
                      <span className={`font-semibold ${theme.badgeText}`}>實證依據:</span>
                      <span className="truncate">{tpl.clinicalFramework.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-[#E8E6E0] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplateId(previewTemplateId === tpl.id ? null : tpl.id);
                      }}
                      className="text-[#7A7D73] hover:text-[#2C3324] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>{previewTemplateId === tpl.id ? '收起提問' : '預覽提問'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenJournalModal(tpl.id)}
                      className={`font-bold ${theme.badgeText} flex items-center gap-1 cursor-pointer ${theme.badgeBg} border ${theme.badgeBorder} px-3 py-1.5 rounded-xl hover:${theme.pillActiveBg} hover:text-white transition-all`}
                    >
                      <span>開始書寫</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Expandable Prompts Preview */}
                  {previewTemplateId === tpl.id && (
                    <div className="mt-2 p-3 bg-[#F9F8F4] rounded-2xl border border-[#E8E6E0] space-y-2 animate-in fade-in duration-150">
                      <p className="text-[11px] font-bold text-[#2C3324]">引導提問預覽：</p>
                      <div className="space-y-1.5 text-[11px] text-[#5A6352]">
                        {tpl.prompts.map((p, idx) => (
                          <p key={idx} className="flex items-start gap-1.5">
                            <span className={`font-bold shrink-0 ${theme.badgeText}`}>{idx + 1}.</span>
                            <span>{p}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Entries Archives */}
      <div className="space-y-4 pt-6 border-t border-[#E8E6E0]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2C3324]">我的歷史日記存檔 ({entries.length})</h2>
            <p className="text-xs text-[#7A7D73]">隨時回顧過往的心靈沉澱軌跡與自我對話</p>
          </div>
          {entries.length > 0 && (
            <span className="text-xs text-[#8BA888] font-semibold">
              共保存 {entries.length} 篇成長記錄
            </span>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-[#E8E6E0] text-center space-y-3">
            <BookMarked className="w-10 h-10 text-[#7A7D73] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#2C3324]">目前尚無已保存的日記記錄</p>
            <p className="text-xs text-[#7A7D73]">點擊上方任一 43 篇引導日記模板，開始記錄你的第一篇感恩或思維重塑日記吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((ent) => (
              <div
                key={ent.id}
                onClick={() => setSelectedEntry(ent)}
                className="p-5 rounded-3xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all text-left space-y-3 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8]">
                    {ent.title}
                  </span>
                  <span className="text-xs text-[#7A7D73] flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#8BA888]" />
                    {ent.date}
                  </span>
                </div>

                <div className="space-y-2">
                  {ent.answers.slice(0, 2).map((a, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-semibold text-[#3D4035] line-clamp-1">Q: {a.prompt}</p>
                      <p className="text-[#7A7D73] italic line-clamp-2 mt-0.5">"{a.answer || '無內容'}"</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs font-bold text-[#8BA888] flex items-center justify-between border-t border-[#F1F5EF]">
                  <span className="text-[11px] text-[#7A7D73] font-normal">{ent.answers.length} 個提問回答</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">閱讀完整內容 →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entry Reader Popup Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-[#2C3324]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] text-[#3D4035] w-full max-w-xl rounded-3xl border border-[#E8E6E0] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E0]">
              <div>
                <span className="text-xs font-semibold text-[#8BA888] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedEntry.date}
                </span>
                <h3 className="text-lg font-bold text-[#2C3324] mt-0.5">{selectedEntry.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#7A7D73] hover:text-[#2C3324] hover:bg-[#F1F5EF] transition-colors cursor-pointer"
              >
                關閉
              </button>
            </div>

            <div className="space-y-4">
              {selectedEntry.answers.map((a, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F9F8F4] border border-[#E8E6E0] space-y-2 text-xs">
                  <p className="font-bold text-[#2C3324] flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#E9F0E8] text-[#2C3324] text-[10px] flex items-center justify-center shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span>{a.prompt}</span>
                  </p>
                  <p className="text-[#3D4035] leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-[#E8E6E0] font-sans">
                    {a.answer || '(未填寫)'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
