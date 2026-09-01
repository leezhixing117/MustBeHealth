import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  HelpCircle,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Headphones
} from 'lucide-react';
import { LearningPath, LearningPathLesson } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { speechEngine, VoiceTone } from '../utils/speechEngine';

interface LearningPathModalProps {
  path: LearningPath | null;
  lessonIndex: number;
  onClose: () => void;
  onCompleteLesson: (pathId: string, lessonId: string) => void;
}

export const LearningPathModal: React.FC<LearningPathModalProps> = ({
  path,
  lessonIndex,
  onClose,
  onCompleteLesson,
}) => {
  if (!path) return null;

  const lesson: LearningPathLesson = path.lessons[lessonIndex] || path.lessons[0];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(lesson.completed);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [voiceTone, setVoiceTone] = useState<VoiceTone>('gentle');

  const totalCards = lesson.contentCards.length;
  const currentCard = lesson.contentCards[currentCardIndex];

  // Narration text generator for current card
  const getCardNarration = () => {
    let script = `${currentCard.title}。${currentCard.description}`;
    if (currentCard.question) {
      script += `。練習思考：${currentCard.question}`;
    }
    return script;
  };

  const playVoice = (speed = voiceSpeed, tone = voiceTone) => {
    soundEngine.initContext();
    setIsVoicePlaying(true);
    speechEngine.speak(getCardNarration(), {
      rate: speed,
      tone: tone,
      onStart: () => setIsVoicePlaying(true),
      onEnd: () => setIsVoicePlaying(false),
      onError: () => setIsVoicePlaying(false),
    });
  };

  const toggleVoice = () => {
    if (isVoicePlaying) {
      speechEngine.cancel();
      setIsVoicePlaying(false);
    } else {
      soundEngine.playChime(528, 0.6);
      playVoice();
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.8];
    const nextIdx = (speeds.indexOf(voiceSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setVoiceSpeed(newSpeed);
    if (isVoicePlaying) {
      playVoice(newSpeed, voiceTone);
    }
  };

  useEffect(() => {
    speechEngine.cancel();
    setIsVoicePlaying(false);
  }, [currentCardIndex]);

  useEffect(() => {
    return () => {
      speechEngine.cancel();
    };
  }, []);

  const handleNext = () => {
    soundEngine.playChime(540, 0.4);
    speechEngine.cancel();
    if (currentCardIndex + 1 < totalCards) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsCompleted(true);
      soundEngine.playChime(720, 1.8);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
      });
      onCompleteLesson(path.id, lesson.id);
    }
  };

  const handlePrev = () => {
    speechEngine.cancel();
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C3324]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] text-[#3D4035] w-full max-w-2xl rounded-3xl border border-[#E8E6E0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E6E0] flex items-center justify-between bg-[#F9F8F4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E9F0E8] text-[#2C3324] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8]">
                  第 {lesson.dayNumber} 天 / 共 {path.totalDays} 天
                </span>
                <span className="text-xs text-[#7A7D73]">· {lesson.durationMinutes} 分鐘微課程</span>
              </div>
              <h3 className="font-bold text-base text-[#2C3324] mt-0.5">{lesson.title}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                isVoicePlaying
                  ? 'bg-[#8BA888] text-[#1C2216] shadow-xs animate-pulse'
                  : 'bg-white border border-[#E8E6E0] text-[#2C3324] hover:bg-[#E9F0E8]'
              }`}
              title={isVoicePlaying ? '暫停語音旁白' : '聆聽本節語音導讀'}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isVoicePlaying ? '播放中' : '語音旁白'}</span>
            </button>
            <button
              onClick={() => {
                speechEngine.cancel();
                onClose();
              }}
              className="p-2 rounded-xl text-[#7A7D73] hover:text-[#2C3324] hover:bg-[#F1F5EF] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#E8E6E0] h-1.5">
          <div
            className="bg-[#8BA888] h-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {!isCompleted ? (
            <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#8BA888] text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>重點 {currentCardIndex + 1} / {totalCards}</span>
                </div>

                {/* Voice Control Toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playVoice(voiceSpeed, voiceTone)}
                    className="p-1.5 text-xs text-[#5A6352] hover:text-[#2C3324] hover:bg-[#E9F0E8] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="重播語音"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[10px]">重播</span>
                  </button>
                  <button
                    onClick={cycleSpeed}
                    className="px-2 py-0.5 text-[10px] font-bold text-[#5A6352] bg-[#E9F0E8] hover:bg-[#C9D6C8] rounded-md transition-colors cursor-pointer"
                    title="切換語速"
                  >
                    {voiceSpeed}x
                  </button>
                </div>
              </div>

              <h4 className="text-xl font-bold text-[#2C3324] leading-snug">
                {currentCard.title}
              </h4>

              <div className="text-sm text-[#3D4035] leading-relaxed whitespace-pre-line bg-[#F1F5EF] p-5 rounded-2xl border border-[#E8E6E0]">
                {currentCard.description}
              </div>

              {/* Interactive exercises on the card */}
              {currentCard.interactiveType === 'multiple-choice' && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-[#2C3324] flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#8BA888]" />
                    <span>{currentCard.question}</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentCard.options?.map((opt, idx) => {
                      const isOptSelected = selectedOption === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedOption(idx);
                            soundEngine.playChime(500 + idx * 50, 0.3);
                          }}
                          className={`p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                            isOptSelected
                              ? 'bg-[#2C3324] text-white border-[#2C3324] shadow-xs'
                              : 'bg-white border-[#E8E6E0] text-[#5A6352] hover:bg-[#F9F8F4]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {(currentCard.interactiveType === 'reflection' || currentCard.interactiveType === 'cbt-reframe') && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-[#2C3324] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#8BA888]" />
                    <span>{currentCard.question}</span>
                  </p>
                  <textarea
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder={currentCard.sampleAnswer || '在此輸入你的想法與自我覺察...'}
                    rows={3}
                    className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] resize-none placeholder:text-[#8C8F85]"
                  />
                  {currentCard.sampleAnswer && (
                    <p className="text-[11px] text-[#7A7D73] italic">
                      💡 提示範例：{currentCard.sampleAnswer}
                    </p>
                  )}
                </div>
              )}

              {currentCard.interactiveType === 'action-check' && (
                <div className="p-4 rounded-xl bg-[#F9F8F4] border border-[#E8E6E0] space-y-2">
                  <p className="text-xs font-bold text-[#2C3324]">
                    {currentCard.question}
                  </p>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#5A6352] cursor-pointer pt-1">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded-md accent-[#8BA888]" />
                    <span>我已了解，並將在今日實踐此思維習慣！</span>
                  </label>
                </div>
              )}
            </div>
          ) : (
            /* Lesson Finished Card */
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-[#E9F0E8] text-[#8BA888] flex items-center justify-center mx-auto shadow-xs border border-[#C9D6C8]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#2C3324]">今日學習已完成！</h3>
                <p className="text-xs text-[#7A7D73] leading-relaxed">
                  恭喜你完成了第 {lesson.dayNumber} 天的課程：<br />
                  <span className="font-semibold text-[#8BA888]">{lesson.title}</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#E9F0E8] border border-[#C9D6C8] text-xs text-[#2C3324] text-left space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#2C3324]">
                  <CheckSquare className="w-4 h-4 text-[#8BA888]" />
                  <span>今日核心收穫總結：</span>
                </div>
                <p className="text-[#3D4035] leading-relaxed">
                  {lesson.summary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-[#E8E6E0] bg-[#F9F8F4] flex items-center justify-between">
          {!isCompleted ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentCardIndex === 0}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentCardIndex === 0
                    ? 'text-[#8C8F85] cursor-not-allowed opacity-50'
                    : 'text-[#5A6352] hover:text-[#2C3324] hover:bg-[#E8E6E0]'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一頁</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 active:scale-98 cursor-pointer"
              >
                <span>{currentCardIndex + 1 < totalCards ? '繼續' : '完成今日課程'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                返回學習路徑
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
