import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Heart,
  Send,
  Headphones,
  Zap,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { MoodType, MoodRecord, Language, AudioGuide } from '../types';
import { translations } from '../utils/i18n';
import { soundEngine } from '../utils/soundEngine';
import { analytics } from '../utils/analytics';
import { ALL_AUDIO_GUIDES } from '../data/audioGuidesData';

interface MoodCheckInProps {
  lang: Language;
  onSaveMood: (record: MoodRecord) => void;
  onStartRescue: (id?: string) => void;
  onStartJournal: (templateId?: string) => void;
  onOpenAudioGuide?: (guide: AudioGuide) => void;
  todayRecord?: MoodRecord | null;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({
  lang,
  onSaveMood,
  onStartRescue,
  onStartJournal,
  onOpenAudioGuide,
  todayRecord,
}) => {
  const t = translations[lang];
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(todayRecord?.mood || null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(todayRecord?.factors || []);
  const [note, setNote] = useState<string>(todayRecord?.note || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!todayRecord);
  const [submittedMood, setSubmittedMood] = useState<MoodType | null>(todayRecord?.mood || null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [emailSubscribed, setEmailSubscribed] = useState<boolean>(false);

  const moodOptions: { type: MoodType; label: string; emoji: string; color: string; ringColor: string }[] = [
    { type: 'great', label: t.moodGreat, emoji: '✨', color: 'bg-emerald-500 text-white', ringColor: 'ring-emerald-500' },
    { type: 'good', label: t.moodGood, emoji: '😊', color: 'bg-teal-500 text-white', ringColor: 'ring-teal-500' },
    { type: 'okay', label: t.moodOkay, emoji: '😌', color: 'bg-sky-500 text-white', ringColor: 'ring-sky-500' },
    { type: 'down', label: t.moodDown, emoji: '😔', color: 'bg-indigo-500 text-white', ringColor: 'ring-indigo-500' },
    { type: 'stressed', label: t.moodStressed, emoji: '😫', color: 'bg-rose-500 text-white', ringColor: 'ring-rose-500' },
  ];

  const factors = [
    { id: '工作', label: '💼 工作與職場' },
    { id: '人際關係', label: '👥 人際與朋友' },
    { id: '睡眠', label: '💤 睡眠與休息' },
    { id: '自我價值', label: '🌱 自我期待' },
    { id: '身體健康', label: '🏃 身體活力' },
    { id: '財務壓力', label: '💰 財務狀況' },
    { id: '家庭生活', label: '🏡 家庭關係' },
    { id: '學業進修', label: '📚 學習成長' },
  ];

  const handleToggleFactor = (factorId: string) => {
    if (selectedFactors.includes(factorId)) {
      setSelectedFactors(selectedFactors.filter((f) => f !== factorId));
    } else {
      setSelectedFactors([...selectedFactors, factorId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    const record: MoodRecord = {
      id: todayRecord?.id || `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      factors: selectedFactors,
      note,
      timestamp: Date.now(),
    };

    onSaveMood(record);
    setSubmittedMood(selectedMood);
    setIsSubmitted(true);
    soundEngine.playChime(580, 1.2);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    analytics.track('mood_checkin', {
      mood: selectedMood,
      factorsCount: selectedFactors.length,
      hasNote: !!note.trim(),
    });
  };

  const handleSubscribeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;
    setEmailSubscribed(true);
    soundEngine.playChime(640, 0.8);
    analytics.track('referral_form_submit', {
      type: 'weekly_email_support',
      email: userEmail,
    });
  };

  // 根據心情精準匹配 1 個急救工具 + 1 個臨床音訊導引 (極簡無冗字)
  const getRecommendation = (mood: MoodType) => {
    switch (mood) {
      case 'stressed': {
        const audio = ALL_AUDIO_GUIDES.find((a) => a.id === 'ag-stress-deadline') || ALL_AUDIO_GUIDES[0];
        return {
          title: '🌿 壓力緩解 · 即刻調適建議',
          advice: '大腦目前處於緊繃狀態。建議先透過 2 分鐘呼吸法生理降溫，再聆聽心理師音訊導引。',
          rescueId: 'rescue-breathe-478',
          rescueTitle: '4-7-8 焦慮急救呼吸法 (2分鐘)',
          audioGuide: audio,
          audioTitle: '應對高壓死線與壓迫感 (8分鐘)',
        };
      }
      case 'down': {
        const audio = ALL_AUDIO_GUIDES.find((a) => a.id === 'ag-self-compassion-harsh') || ALL_AUDIO_GUIDES[1] || ALL_AUDIO_GUIDES[0];
        return {
          title: '💙 低落接納 · 溫柔自癒方案',
          advice: '允許自己此刻停下腳步，透過自我慈悲練習與溫暖音訊陪伴自己。',
          rescueId: 'rescue-criticism-shield',
          rescueTitle: '自我慈悲與批評盾牌法 (3分鐘)',
          audioGuide: audio,
          audioTitle: '停止內在嚴厲批判：自我慈悲導引 (9分鐘)',
        };
      }
      case 'okay': {
        const audio = ALL_AUDIO_GUIDES.find((a) => a.id === 'ag-anxiety-racing-thoughts') || ALL_AUDIO_GUIDES[2] || ALL_AUDIO_GUIDES[0];
        return {
          title: '🌱 平穩定心 · 沉澱思緒計畫',
          advice: '花幾分鐘進行正念梳理，平息思緒過度運轉。',
          rescueId: 'rescue-procrastination-2min',
          rescueTitle: '2分鐘微行動破除停滯 (2分鐘)',
          audioGuide: audio,
          audioTitle: '平息大腦過度運轉與反芻思維 (7分鐘)',
        };
      }
      case 'good':
      case 'great': {
        const audio = ALL_AUDIO_GUIDES.find((a) => a.id === 'ag-boundaries-guilt-free') || ALL_AUDIO_GUIDES[3] || ALL_AUDIO_GUIDES[0];
        return {
          title: '✨ 能量賦能 · 鞏固心理界線',
          advice: '狀態良好時，適合練習清晰的心理界線，延續內在平穩。',
          rescueId: 'rescue-anxiety-somatic-shaking',
          rescueTitle: '正向活力身體重啟 (2分鐘)',
          audioGuide: audio,
          audioTitle: '堅定自我界線導引 (8分鐘)',
        };
      }
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8E6E0] shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#2C3324]">
            {t.dailyMoodCheckIn}
          </h2>
          <p className="text-xs text-[#5A6352]">
            10 秒覺察當下身心狀態 · 自動匹配專屬調適
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#E9F0E8] flex items-center justify-center text-[#8BA888]">
          <Heart className="w-4 h-4" />
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood 5 Options */}
          <div>
            <label className="block text-xs font-semibold text-[#3D4035] mb-3">
              你現在當下的心情狀態如何？
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {moodOptions.map((opt) => {
                const isSelected = selectedMood === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setSelectedMood(opt.type);
                      soundEngine.playChime(500 + moodOptions.indexOf(opt) * 60, 0.4);
                    }}
                    className={`flex flex-col items-center justify-center py-3 sm:py-4 px-2 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? `bg-[#E9F0E8] shadow-xs border-[#8BA888] ring-2 ring-[#8BA888] scale-105`
                        : 'bg-[#FDFCF8] border-[#E8E6E0] hover:bg-[#F1F5EF] text-[#5A6352]'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1.5 transition-transform group-hover:scale-110">
                      {opt.emoji}
                    </span>
                    <span className={`text-xs font-medium ${isSelected ? 'font-bold text-[#2C3324]' : 'text-[#5A6352]'}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Factors selection */}
          {selectedMood && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
              <label className="block text-xs font-semibold text-[#3D4035]">
                {t.factorsTitle}
              </label>
              <div className="flex flex-wrap gap-2">
                {factors.map((f) => {
                  const isChecked = selectedFactors.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleToggleFactor(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#8BA888] text-white shadow-xs'
                          : 'bg-[#F9F8F4] border border-[#E8E6E0] text-[#5A6352] hover:bg-[#F1F5EF]'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reflection note */}
          {selectedMood && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.notePlaceholder}
                rows={2}
                className="w-full text-xs text-[#3D4035] bg-[#F9F8F4] border border-[#E8E6E0] rounded-2xl p-3 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] focus:border-transparent resize-none placeholder:text-[#8C8F85]"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedMood}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                selectedMood
                  ? 'bg-[#8BA888] hover:bg-[#759672] text-white shadow-[#8BA888]/20 active:scale-98'
                  : 'bg-[#E8E6E0] text-[#8C8F85] cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.submitCheckin}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Submitted view: 零彈窗平滑展示「1 個急救工具 + 1 個專屬音訊導引」雙入口 */
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-[#F9F8F4] border border-[#E8E6E0] shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl mr-2">
                  {moodOptions.find((m) => m.type === submittedMood)?.emoji}
                </span>
                <span className="text-sm font-bold text-[#2C3324]">
                  今日心情已記錄：{moodOptions.find((m) => m.type === submittedMood)?.label}
                </span>
                {selectedFactors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedFactors.map((f) => (
                      <span key={f} className="text-[11px] px-2 py-0.5 rounded-md bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8] font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
                {note && (
                  <p className="text-xs text-[#5A6352] italic mt-2 bg-white p-2.5 rounded-xl border-l-3 border-[#8BA888]">
                    "{note}"
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-[#7A7D73] hover:text-[#2C3324] underline cursor-pointer"
              >
                重新簽到
              </button>
            </div>
          </div>

          {/* Clinically Grounded Dual Matched Recommendation */}
          {submittedMood && (() => {
            const rec = getRecommendation(submittedMood);
            return (
              <div className="p-5 rounded-3xl bg-[#2C3324] text-[#FDFCF8] shadow-md space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8BA888]">
                    <Sparkles className="w-4 h-4" />
                    <span>{rec.title}</span>
                  </div>
                  <p className="text-xs text-[#E9F0E8]/90 leading-relaxed">
                    {rec.advice}
                  </p>
                </div>

                {/* Dual Entry: 1 急救工具 + 1 臨床音訊導引 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Tool 1: Rescue Tool */}
                  <button
                    onClick={() => {
                      analytics.track('tool_open', { toolId: rec.rescueId, from: 'mood_checkin' });
                      onStartRescue(rec.rescueId);
                    }}
                    className="p-3.5 rounded-2xl bg-[#37402E] hover:bg-[#434E39] border border-[#4D5A42] text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8BA888]">
                        <Zap className="w-3.5 h-3.5" />
                        <span>即時生理急救工具</span>
                      </div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#8BA888] transition-colors line-clamp-1">
                        {rec.rescueTitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8BA888] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Tool 2: Matched Audio Guide */}
                  <button
                    onClick={() => {
                      if (onOpenAudioGuide && rec.audioGuide) {
                        analytics.track('audio_start', { guideId: rec.audioGuide.id, from: 'mood_checkin' });
                        onOpenAudioGuide(rec.audioGuide);
                      }
                    }}
                    className="p-3.5 rounded-2xl bg-[#8BA888]/20 hover:bg-[#8BA888]/30 border border-[#8BA888]/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C88A58]">
                        <Headphones className="w-3.5 h-3.5" />
                        <span>🎧 臨床心理師音訊導引</span>
                      </div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#C88A58] transition-colors line-clamp-1">
                        {rec.audioTitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C88A58] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Optional zero-barrier Email follow-up (免註冊，可選接收每週心理師練習) */}
          <div className="p-4 rounded-2xl bg-[#F1F5EF] border border-[#E8E6E0] text-xs">
            {!emailSubscribed ? (
              <form onSubmit={handleSubscribeEmail} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#5A6352]">
                  <Mail className="w-4 h-4 text-[#8BA888] shrink-0" />
                  <span>想在每週一收到心理師專屬音訊導引與練習？（選填）：</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="輸入你的 Email..."
                    className="px-3 py-1.5 text-xs bg-white rounded-xl border border-[#E8E6E0] text-[#2C3324] placeholder-[#7A7D73] focus:outline-hidden focus:border-[#8BA888] w-full sm:w-48"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#2C3324] hover:bg-[#3D4035] text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
                  >
                    訂閱支持
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-[#2C3324] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#8BA888]" />
                <span>感謝你的訂閱！已為你設定每週心理師精選音訊導引推播（隨時可退訂）。</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
