import React, { useState, useMemo } from 'react';
import { 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Filter,
  Search,
  X
} from 'lucide-react';
import { LearningPath, Language } from '../types';
import { LEARNING_PATHS } from '../data/mockData';
import { LEARNING_CATEGORY_THEMES, getLearningTheme } from '../utils/categoryTheme';

interface LearningPathsViewProps {
  lang: Language;
  onOpenPath: (path: LearningPath, lessonIndex?: number) => void;
}

export const LearningPathsView: React.FC<LearningPathsViewProps> = ({
  lang,
  onOpenPath,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '全部課程', en: 'All Paths' },
    { id: 'emotion', label: '情緒調節與思維重塑', en: 'Emotion & CBT' },
    { id: 'productivity', label: '克服拖延與行動力', en: 'Productivity & Action' },
    { id: 'self-growth', label: '自我成長與自尊', en: 'Self-Growth & Esteem' },
    { id: 'relationship', label: '人際界線與溝通', en: 'Relationships & Boundaries' },
    { id: 'burnout', label: '職場壓力與抗倦怠', en: 'Burnout & Career' },
    { id: 'sleep', label: '深度睡眠與放鬆', en: 'Sleep & Restoration' },
    { id: 'mindfulness', label: '正念靜心與覺察', en: 'Mindfulness & ACT' },
  ];

  const filteredPaths = useMemo(() => {
    return LEARNING_PATHS.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lessons.some((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full">
              40 項成長技巧微課程 (CBT & ACT)
            </span>
            <span className="text-xs font-semibold text-[#5A6352] bg-[#FDFCF8] border border-[#E8E6E0] px-2.5 py-0.5 rounded-full">
              共收錄 {LEARNING_PATHS.length} 堂完整課程
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
            學習路徑與微課程庫 (Learning Paths)
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1 max-w-2xl">
            Step-by-step techniques to grow. 每天 4-6 分鐘，透過微小的認知重塑、行為實驗與臨床實踐，建立長久的內在心理韌性。
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#7A7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋 40 個成長學習路徑與技巧..."
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

      {/* Category Filter Pills (Multi-Row Full Glance) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5A6352] px-1">
          <span className="font-bold text-[#2C3324]">依主題維度全覽篩選：</span>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-[#5A6E55] hover:text-[#2C3324] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
            >
              重設並顯示全部 ({LEARNING_PATHS.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? LEARNING_PATHS.length 
              : LEARNING_PATHS.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            const theme = LEARNING_CATEGORY_THEMES[cat.id] || LEARNING_CATEGORY_THEMES.all;
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

      {/* Filter status & counter */}
      <div className="flex items-center justify-between text-xs text-[#5A6352] px-1">
        <span>顯示 {filteredPaths.length} / {LEARNING_PATHS.length} 個學習路徑</span>
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

      {/* Course Cards Grid */}
      {filteredPaths.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E6E0] p-8">
          <BookOpen className="w-12 h-12 text-[#8BA888]/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#2C3324]">未找到相符的學習路徑</h3>
          <p className="text-xs text-[#7A7D73] mt-1 max-w-sm mx-auto">
            請嘗試使用其他關鍵字或切換類別以瀏覽全部 40 個微課程。
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#2C3324] text-white text-xs font-semibold rounded-xl hover:bg-[#3D4035] transition-all cursor-pointer"
          >
            查看全部 40 門課程
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPaths.map((path) => {
            const progressPct = Math.round((path.completedDays / path.totalDays) * 100);
            const theme = getLearningTheme(path.category);
            return (
              <div
                key={path.id}
                className={`bg-white rounded-3xl border border-[#E8E6E0] shadow-xs ${theme.cardBorderHover} hover:shadow-md transition-all overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  {/* Image header */}
                  <div className="relative h-48 w-full">
                    <img
                      src={path.thumbnail}
                      alt={path.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-xl text-white shadow-xs backdrop-blur-md ${theme.pillActiveBg}`}>
                        {path.categoryLabel} · {path.totalDays} 天計劃
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#2C3324] leading-snug">
                        {path.title}
                      </h3>
                      <p className="text-xs text-[#7A7D73] mt-1 leading-relaxed">
                        {path.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-[#5A6352] leading-relaxed bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E8E6E0]">
                      {path.description}
                    </p>

                    <div className={`p-3 rounded-xl ${theme.badgeBg} border ${theme.badgeBorder} text-[11px] ${theme.badgeText} flex items-start gap-2`}>
                      <ShieldCheck className={`w-4 h-4 ${theme.iconColor} shrink-0 mt-0.5`} />
                      <span>{path.clinicalOutcome}</span>
                    </div>

                    {/* Progress info */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold text-[#3D4035]">
                        <span>學習進度 ({progressPct}%)</span>
                        <span className={theme.badgeText}>已完成 {path.completedDays} / {path.totalDays} 天</span>
                      </div>
                      <div className="w-full bg-[#F1F5EF] h-2 rounded-full overflow-hidden">
                        <div
                          className={`${theme.pillActiveBg} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Lessons Preview list */}
                    <div className="space-y-1.5 pt-2">
                      <p className="text-xs font-bold text-[#2C3324]">章節預覽：</p>
                      <div className="space-y-1">
                        {path.lessons.slice(0, 3).map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-[#FDFCF8] border border-[#E8E6E0]/60 text-xs text-[#3D4035]"
                          >
                            <div className="flex items-center gap-2">
                              {lesson.completed ? (
                                <CheckCircle2 className={`w-3.5 h-3.5 ${theme.iconColor} shrink-0`} />
                              ) : (
                                <span className={`w-3.5 h-3.5 rounded-full border ${theme.badgeBorder} flex items-center justify-center text-[9px] font-bold ${theme.badgeText}`}>
                                  {idx + 1}
                                </span>
                              )}
                              <span className="font-medium line-clamp-1">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-[#7A7D73] whitespace-nowrap">{lesson.durationMinutes} 分鐘</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-6 pt-0 border-t border-[#E8E6E0] mt-2">
                  <button
                    onClick={() => onOpenPath(path, path.completedDays < path.lessons.length ? path.completedDays : 0)}
                    className={`w-full py-3 rounded-2xl ${theme.pillActiveBg} hover:opacity-90 text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>
                      {path.completedDays === 0 ? '開始第一天課程' : path.completedDays >= path.totalDays ? '複習完整課程' : `繼續第 ${path.completedDays + 1} 天學習`}
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
