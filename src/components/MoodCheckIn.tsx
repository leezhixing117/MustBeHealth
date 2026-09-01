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
  Send
} from 'lucide-react';
import { MoodType, MoodRecord, Language } from '../types';
import { translations } from '../utils/i18n';
import { soundEngine } from '../utils/soundEngine';

interface MoodCheckInProps {
  lang: Language;
  onSaveMood: (record: MoodRecord) => void;
  onStartRescue: (id?: string) => void;
  onStartJournal: (templateId?: string) => void;
  todayRecord?: MoodRecord | null;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({
  lang,
  onSaveMood,
  onStartRescue,
  onStartJournal,
  todayRecord,
}) => {
  const t = translations[lang];
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(todayRecord?.mood || null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(todayRecord?.factors || []);
  const [note, setNote] = useState<string>(todayRecord?.note || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!todayRecord);
  const [submittedMood, setSubmittedMood] = useState<MoodType | null>(todayRecord?.mood || null);

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

    soundEngine.playChime(640, 1.2);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b'],
    });

    const newRecord: MoodRecord = {
      id: `mood-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      factors: selectedFactors,
      note: note.trim() || undefined,
      timestamp: Date.now(),
    };

    setSubmittedMood(selectedMood);
    setIsSubmitted(true);
    onSaveMood(newRecord);
  };

  const getCBTInsight = (mood: MoodType) => {
    switch (mood) {
      case 'stressed':
        return {
          title: '🌸 溫柔提醒：焦慮是大腦在試圖保護你',
          advice: '你現在處於高警覺狀態。試著將雙腳踩在地上，進行 3 次深長的呼氣，讓副交感神經重新掌舵。',
          actionText: '立即進行 4-7-8 焦慮急救呼吸',
          actionHandler: () => onStartRescue('rescue-breathe-478'),
        };
      case 'down':
        return {
          title: '💙 給情緒一個安全的容納空間',
          advice: '低落的情緒也是我們的一部分。試著辨識剛才閃過的自動化負面念頭，為它尋找客觀的溫柔視角。',
          actionText: '開啟 CBT 認知重塑日記',
          actionHandler: () => onStartJournal('tpl-cbt'),
        };
      case 'okay':
        return {
          title: '🍃 平靜是累積內在能量的好時刻',
          advice: '平穩的心境是最好的滋養。花 3 分鐘寫下今天值得感恩的小事，強化心理韌性。',
          actionText: '記錄今日感恩三件事',
          actionHandler: () => onStartJournal('tpl-gratitude'),
        };
      case 'good':
      case 'great':
        return {
          title: '✨ 捕捉當下的美好與充沛能量',
          advice: '記住這個輕盈舒適的感覺！你可以將這份積極感受化為動力，推進你的學習路徑。',
          actionText: '探索思維成長學習路徑',
          actionHandler: () => onStartJournal('tpl-gratitude'),
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6E0] shadow-xs relative overflow-hidden">
      {/* Decorative subtle background aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E9F0E8]/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F1F5EF]/60 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F0E8] text-[#2C3324] flex items-center justify-center">
            <Heart className="w-4 h-4 fill-[#8BA888] text-[#8BA888]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2C3324]">{t.checkinTitle}</h2>
            <p className="text-xs text-[#7A7D73]">{t.checkinSubtitle}</p>
          </div>
        </div>
        {isSubmitted && (
          <span className="flex items-center gap-1 text-xs font-semibold text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8BA888]" />
            {t.checkinDone}
          </span>
        )}
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
        /* Submitted view with psychological reflection & tailored action */
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-[#F9F8F4] border border-[#E8E6E0] shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl mr-2">
                  {moodOptions.find((m) => m.type === submittedMood)?.emoji}
                </span>
                <span className="text-sm font-bold text-[#2C3324]">
                  今天感到 {moodOptions.find((m) => m.type === submittedMood)?.label}
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
                重新編輯
              </button>
            </div>
          </div>

          {/* Clinically Grounded Next Step Recommendation */}
          {submittedMood && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#2C3324] text-[#FDFCF8] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#8BA888]">
                  {getCBTInsight(submittedMood).title}
                </p>
                <p className="text-xs text-[#E9F0E8]/90 leading-relaxed max-w-xl">
                  {getCBTInsight(submittedMood).advice}
                </p>
              </div>
              <button
                onClick={getCBTInsight(submittedMood).actionHandler}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{getCBTInsight(submittedMood).actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
