import React from 'react';
import { 
  Flame, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { MoodRecord, Language } from '../types';

interface InsightsViewProps {
  lang: Language;
  moodHistory: MoodRecord[];
  streakCount: number;
  completedLessonsCount: number;
  completedRescueCount: number;
  onOpenAssessment: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  lang,
  moodHistory,
  streakCount,
  completedLessonsCount,
  completedRescueCount,
  onOpenAssessment,
}) => {
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great': return '✨ 絕佳';
      case 'good': return '😊 愉快';
      case 'okay': return '😌 平靜';
      case 'down': return '😔 低落';
      case 'stressed': return '😫 焦慮緊繃';
      default: return '😐 平靜';
    }
  };

  const getMoodBarHeight = (mood: string) => {
    switch (mood) {
      case 'great': return 'h-24 bg-[#8BA888]';
      case 'good': return 'h-20 bg-[#647A5F]';
      case 'okay': return 'h-16 bg-[#A3B899]';
      case 'down': return 'h-10 bg-[#7A7D73]';
      case 'stressed': return 'h-12 bg-[#C88A58]';
      default: return 'h-14 bg-[#E8E6E0]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full">
              📊 數據與趨勢分析
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
            身心健康趨勢與洞察 (Wellbeing Insights)
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1 max-w-2xl">
            透過持續的情緒簽到與練習數據，發現心理波動規律與潛在觸發源，培養長期心理韌性。
          </p>
        </div>

        <button
          onClick={onOpenAssessment}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 active:scale-98 cursor-pointer self-start"
        >
          <Activity className="w-4 h-4" />
          <span>重新進行身心評估 (GAD/PHQ)</span>
        </button>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#C88A58]">
            <span className="text-xs font-bold text-[#7A7D73]">連續打卡</span>
            <Flame className="w-5 h-5 fill-[#C88A58]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#2C3324]">{streakCount} 天</p>
          <p className="text-[11px] text-[#8BA888] font-medium">保持良好習慣 🔥</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8BA888]">
            <span className="text-xs font-bold text-[#7A7D73]">CBT 課程完成</span>
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#2C3324]">{completedLessonsCount} 節</p>
          <p className="text-[11px] text-[#7A7D73] font-medium">認知重塑微模組</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#647A5F]">
            <span className="text-xs font-bold text-[#7A7D73]">即時急救練習</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#2C3324]">{completedRescueCount} 次</p>
          <p className="text-[11px] text-[#7A7D73] font-medium">及時阻斷焦慮緊繃</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#2C3324]">
            <span className="text-xs font-bold text-[#7A7D73]">身心韌性指數</span>
            <ShieldCheck className="w-5 h-5 text-[#8BA888]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#2C3324]">84 / 100</p>
          <p className="text-[11px] text-[#8BA888] font-medium">優良且穩步提升 ↑</p>
        </div>
      </div>

      {/* Mood Trend & Factors 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood history timeline */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#2C3324]">近期情緒分佈曲線</h3>
              <p className="text-xs text-[#7A7D73]">記錄每日情緒波動與自我覺察</p>
            </div>
            <span className="text-xs font-bold text-[#5A6352] bg-[#F1F5EF] border border-[#E8E6E0] px-2.5 py-1 rounded-full">
              最近記錄
            </span>
          </div>

          <div className="flex items-end justify-around gap-2 pt-8 pb-2 border-b border-[#E8E6E0] min-h-[160px]">
            {moodHistory.slice(-7).map((rec, i) => (
              <div key={rec.id || i} className="flex flex-col items-center gap-2 group">
                <div className="relative flex items-end justify-center">
                  <div
                    className={`w-9 sm:w-12 rounded-t-xl transition-all group-hover:opacity-80 shadow-xs ${getMoodBarHeight(rec.mood)}`}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#5A6352] whitespace-nowrap">
                  {rec.date.slice(5)}
                </span>
                <span className="text-[10px] text-[#7A7D73] scale-90">
                  {getMoodEmoji(rec.mood).split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          {/* History Details list */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-[#2C3324]">歷史打卡詳情：</h4>
            {moodHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-2xl bg-[#FDFCF8] border border-[#E8E6E0] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#2C3324]">{rec.date}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#E8E6E0] font-semibold text-[#3D4035]">
                    {getMoodEmoji(rec.mood)}
                  </span>
                  {rec.factors.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1 text-[#7A7D73] text-[11px]">
                      {rec.factors.map((f) => (
                        <span key={f} className="px-1.5 py-0.5 bg-[#F1F5EF] rounded">
                          #{f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {rec.note && (
                  <span className="text-[#7A7D73] italic truncate max-w-[200px]">
                    "{rec.note}"
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Triggers Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-[#2C3324]">主要情緒影響來源</h3>
            <p className="text-xs text-[#7A7D73]">過去 14 天簽到因子統計</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#3D4035]">
                <span>💼 職場與工作挑戰</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-[#F1F5EF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#8BA888] h-full w-[45%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#3D4035]">
                <span>💤 睡眠與精力管理</span>
                <span>28%</span>
              </div>
              <div className="w-full bg-[#F1F5EF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#647A5F] h-full w-[28%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#3D4035]">
                <span>🌱 自我期待與完美主義</span>
                <span>17%</span>
              </div>
              <div className="w-full bg-[#F1F5EF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#C88A58] h-full w-[17%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#3D4035]">
                <span>👥 人際與界線</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-[#F1F5EF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#7A7D73] h-full w-[10%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F1F5EF] border border-[#E8E6E0] text-xs text-[#2C3324] leading-relaxed">
            💡 <span className="font-bold">臨床洞察建議：</span>
            工作與睡眠是你的關鍵調節樞紐。建議在結束工作時建立「關機儀式」，避免將工作思緒帶入就寢時間。
          </div>
        </div>
      </div>
    </div>
  );
};
