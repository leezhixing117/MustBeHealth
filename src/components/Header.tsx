import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Flame, 
  PhoneCall, 
  Globe, 
  User, 
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { NAV_THEMES } from '../utils/categoryTheme';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  streakCount: number;
  onOpenCrisis: () => void;
  onOpenAssessment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onLangChange,
  streakCount,
  onOpenCrisis,
  onOpenAssessment,
}) => {
  const t = translations[lang];
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'rescue', label: t.rescueSessions },
    { id: 'journals', label: t.journals },
    { id: 'learning', label: t.learningPaths },
    { id: 'soundscapes', label: t.soundscapes },
    { id: 'audio-guides', label: t.audioGuides },
    { id: 'insights', label: t.insights },
    { id: 'care', label: t.care },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#E8E6E0] shadow-xs">
      {/* Top micro banner for SOS access */}
      <div className="bg-[#2C3324] text-[#E9F0E8] text-xs px-4 py-1.5 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCrisis}
            className="flex items-center gap-1.5 text-[#D48C80] hover:text-white font-medium transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse text-[#D48C80]" />
            <span>24/7 心理危機支援專線</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#8BA888] flex items-center justify-center text-white shadow-md shadow-[#8BA888]/20 group-hover:scale-105 transition-transform shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-calligraphy text-2xl sm:text-3xl text-[#2C3324] tracking-wider leading-none group-hover:text-[#647A5F] transition-colors drop-shadow-xs py-0.5">
                  醫定要健康
                </span>
                <span className="text-[10px] text-[#7A7D73] font-medium tracking-wide mt-0.5">
                  身心健康與心理成長平台
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                const navTheme = NAV_THEMES[item.id] || NAV_THEMES.home;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? `${navTheme.activeBg} ${navTheme.activeText} shadow-xs`
                        : 'text-[#5A6352] hover:text-[#2C3324] hover:bg-[#F1F5EF]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : navTheme.dot}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Core Quick Funnel Navigation (全域固定快捷導航) */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#F1F5EF] border border-[#E8E6E0] rounded-2xl shadow-xs">
            <button
              onClick={() => {
                onTabChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#2C3324] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            >
              心情簽到
            </button>
            <span className="text-[#C9D6C8] text-xs">|</span>
            <button
              onClick={() => onTabChange('rescue')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#5A6352] hover:text-[#2C3324] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            >
              即時急救工具
            </button>
            <span className="text-[#C9D6C8] text-xs">|</span>
            <button
              onClick={() => onTabChange('audio-guides')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#8BA888] hover:text-[#6d8c6a] hover:bg-white hover:shadow-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🎧 音訊導引</span>
            </button>
            <span className="text-[#C9D6C8] text-xs">|</span>
            <button
              onClick={() => onTabChange('care')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#C88A58] hover:text-[#a0683a] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            >
              治療師轉介
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5EF] border border-[#E8E6E0] text-[#3D4035] text-xs font-semibold shadow-xs"
              title="連續打卡天數"
            >
              <Flame className="w-4 h-4 text-[#C88A58] fill-[#C88A58] animate-bounce" />
              <span>{streakCount} {t.days}</span>
            </div>

            {/* Assessment Quick Trigger */}
            <button
              onClick={onOpenAssessment}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9F0E8] hover:bg-[#DCE7DB] border border-[#C9D6C8] text-[#2C3324] text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8BA888]" />
              <span>身心自測</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E8E6E0] hover:bg-[#F1F5EF] text-xs font-medium text-[#3D4035] cursor-pointer"
                aria-label="語言切換"
              >
                <Globe className="w-3.5 h-3.5 text-[#7A7D73]" />
                <span>{lang === 'zh-TW' ? '繁體中文' : lang === 'zh-CN' ? '简体中文' : 'English'}</span>
                <ChevronDown className="w-3 h-3 text-[#7A7D73]" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-[#E8E6E0] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => { onLangChange('zh-TW'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F1F5EF] cursor-pointer ${
                      lang === 'zh-TW' ? 'text-[#2C3324] font-bold bg-[#E9F0E8]/60' : 'text-[#5A6352]'
                    }`}
                  >
                    繁體中文 (台灣/香港)
                  </button>
                  <button
                    onClick={() => { onLangChange('zh-CN'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F1F5EF] cursor-pointer ${
                      lang === 'zh-CN' ? 'text-[#2C3324] font-bold bg-[#E9F0E8]/60' : 'text-[#5A6352]'
                    }`}
                  >
                    简体中文 (CN/SG)
                  </button>
                  <button
                    onClick={() => { onLangChange('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F1F5EF] cursor-pointer ${
                      lang === 'en' ? 'text-[#2C3324] font-bold bg-[#E9F0E8]/60' : 'text-[#5A6352]'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full bg-[#F1F5EF] border border-[#E8E6E0] flex items-center justify-center text-[#3D4035] hover:bg-[#E9F0E8] transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8E6E0] p-3 z-50">
                  <div className="pb-3 border-b border-[#E8E6E0]">
                    <p className="text-xs font-bold text-[#2C3324]">Alex Chen (使用者)</p>
                    <p className="text-[11px] text-[#7A7D73]">mysticblaza@gmail.com</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold bg-[#E9F0E8] text-[#2C3324] rounded-full border border-[#C9D6C8]">
                      尊享會員 · 無限次數
                    </span>
                  </div>
                  <div className="py-2 space-y-1">
                    <button 
                      onClick={() => { onTabChange('insights'); setShowProfileMenu(false); }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#3D4035] hover:bg-[#F1F5EF] rounded-lg cursor-pointer"
                    >
                      身心健康歷史與報告
                    </button>
                    <button 
                      onClick={() => { onTabChange('care'); setShowProfileMenu(false); }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#3D4035] hover:bg-[#F1F5EF] rounded-lg cursor-pointer"
                    >
                      我的心理教練諮詢記錄
                    </button>
                    <button 
                      onClick={() => { onOpenCrisis(); setShowProfileMenu(false); }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer font-medium"
                    >
                      緊急求助與危機專線
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab All-at-a-glance Bar */}
      <div className="lg:hidden border-t border-[#E8E6E0] bg-[#FDFCF8] px-3 py-2 space-y-1.5">
        {/* Core Quick Funnel Navigation on Mobile */}
        <div className="flex items-center justify-between bg-[#F1F5EF] p-1 rounded-xl border border-[#E8E6E0] text-[11px] font-bold">
          <button
            onClick={() => {
              onTabChange('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 py-1 text-center text-[#2C3324] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            心情簽到
          </button>
          <span className="text-[#C9D6C8]">|</span>
          <button
            onClick={() => onTabChange('rescue')}
            className="flex-1 py-1 text-center text-[#5A6352] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            急救工具
          </button>
          <span className="text-[#C9D6C8]">|</span>
          <button
            onClick={() => onTabChange('audio-guides')}
            className="flex-1 py-1 text-center text-[#8BA888] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            🎧 音訊導引
          </button>
          <span className="text-[#C9D6C8]">|</span>
          <button
            onClick={() => onTabChange('care')}
            className="flex-1 py-1 text-center text-[#C88A58] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            治療師轉介
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const navTheme = NAV_THEMES[item.id] || NAV_THEMES.home;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? `${navTheme.activeBg} ${navTheme.activeText} font-bold shadow-xs`
                    : 'bg-[#F1F5EF] text-[#5A6352] hover:bg-[#E9F0E8] hover:text-[#2C3324]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : navTheme.dot}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
