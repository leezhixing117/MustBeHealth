import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Compass, 
  UserCheck 
} from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../data/mockData';
import { soundEngine } from '../utils/soundEngine';
import { analytics } from '../utils/analytics';

interface AssessmentModalProps {
  onClose: () => void;
  onOpenPath: (pathId: string) => void;
  onOpenCoach: (coachId: string) => void;
  onOpenRescue: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  onClose,
  onOpenPath,
  onOpenCoach,
  onOpenRescue,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isCalculated, setIsCalculated] = useState(false);

  const currentQ = ASSESSMENT_QUESTIONS[currentQIndex];
  const totalQ = ASSESSMENT_QUESTIONS.length;

  const handleSelectOption = (score: number) => {
    soundEngine.playChime(520 + score * 40, 0.3);
    const updated = { ...answers, [currentQ.id]: score };
    setAnswers(updated);

    if (currentQIndex + 1 < totalQ) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate total score
      setIsCalculated(true);
      soundEngine.playChime(660, 1.8);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
      const finalScore = (Object.values(updated) as number[]).reduce((a, b) => a + b, 0);
      analytics.track('assessment_complete', { score: finalScore });
    }
  };

  const calculateTotalScore = (): number => {
    return (Object.values(answers) as number[]).reduce((a, b) => a + b, 0);
  };

  const getAssessmentResult = (score: number) => {
    if (score <= 4) {
      return {
        level: '良好且穩定 (Optimal Wellbeing)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800',
        summary: '你的心理韌性維持在健康平穩的狀態，能夠有效應對日常挑戰。',
        recommendation: '建議保持日常感恩習慣，並可探索自我成長路徑以進一步解鎖潛能。',
        suggestedPathId: 'path-overthinking',
      };
    } else if (score <= 8) {
      return {
        level: '輕度壓力與思緒波動 (Mild Stress)',
        color: 'text-teal-700 bg-teal-50 border-teal-200',
        badge: 'bg-teal-100 text-teal-800',
        summary: '近期在工作或生活中有一些微小壓力源，可能偶爾出現過度思考或疲憊感。',
        recommendation: '建議進行「重塑思維：擺脫過度思考」學習路徑，並在睡前聆聽放鬆白噪音。',
        suggestedPathId: 'path-overthinking',
      };
    } else if (score <= 11) {
      return {
        level: '中度焦慮與身心緊繃 (Moderate Anxiety)',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
        summary: '壓力已開始對你的專注度或情緒造成明顯消耗，身心需要即時的喘息與修復。',
        recommendation: '推薦每天進行 4-7-8 急救呼吸法，並預約行為健康教練進行 1對1 壓力梳理。',
        suggestedPathId: 'path-boundaries',
      };
    } else {
      return {
        level: '高度壓力需要關注 (High Distress - Care Recommended)',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        badge: 'bg-rose-100 text-rose-800',
        summary: '你目前承受著較高強度的情緒負荷，請不要獨自一人承擔這份沉重。',
        recommendation: '強烈建議預約 醫定要健康 認證臨床心理師或心理諮商師，並善用 24/7 危機支援專線。',
        suggestedPathId: 'path-overthinking',
      };
    }
  };

  const totalScore = calculateTotalScore();
  const result = getAssessmentResult(totalScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">心理與身心健康狀態自評 (GAD/PHQ)</h3>
              <p className="text-xs text-slate-500">臨床實證評估工具 · 2分鐘快速了解心理狀態</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-teal-600 h-full transition-all duration-300"
            style={{ width: `${isCalculated ? 100 : ((currentQIndex + 1) / totalQ) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {!isCalculated ? (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                問題 {currentQIndex + 1} / {totalQ}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.text}
              </h4>

              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.score)}
                    className="w-full p-3.5 rounded-2xl text-left text-xs font-medium border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 hover:text-teal-900 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-6 animate-in zoom-in-95 duration-300 max-w-md mx-auto text-center">
              <div className="space-y-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${result.badge}`}>
                  綜合自評結果：{totalScore} / 15 分
                </span>
                <h3 className="text-2xl font-bold text-slate-900">{result.level}</h3>
              </div>

              <div className={`p-4 rounded-2xl border text-left text-xs space-y-2 leading-relaxed ${result.color}`}>
                <p className="font-semibold">{result.summary}</p>
                <p className="opacity-90">{result.recommendation}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenPath(result.suggestedPathId);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>開始為你推薦的學習路徑</span>
                </button>

                <button
                  onClick={() => {
                    analytics.track('referral_click', { from: 'assessment_modal_result' });
                    onClose();
                    onOpenCoach('coach-1');
                  }}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-slate-600" />
                  <span>預約專業心理教練諮商</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
