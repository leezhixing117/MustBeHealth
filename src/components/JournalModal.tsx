import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Brain, 
  Moon, 
  Target, 
  BookMarked, 
  Save, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Shield,
  Search,
  ChevronDown
} from 'lucide-react';
import { JournalTemplate, JournalEntry, JournalCategory } from '../types';
import { JOURNAL_TEMPLATES } from '../data/mockData';
import { soundEngine } from '../utils/soundEngine';

interface JournalModalProps {
  initialTemplateId?: string;
  onClose: () => void;
  onSaveEntry: (entry: JournalEntry) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  initialTemplateId,
  onClose,
  onSaveEntry,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplateId || JOURNAL_TEMPLATES[0].id
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentTemplate = useMemo(() => {
    return JOURNAL_TEMPLATES.find((t) => t.id === selectedTemplateId) || JOURNAL_TEMPLATES[0];
  }, [selectedTemplateId]);

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSaved, setIsSaved] = useState(false);

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'gratitude', label: '感恩' },
    { id: 'cbt', label: 'CBT 認知' },
    { id: 'stress-burnout', label: '壓力防倦怠' },
    { id: 'self-compassion', label: '自我關懷' },
    { id: 'emotions', label: '情緒疏導' },
    { id: 'relationships', label: '人際界線' },
    { id: 'sleep', label: '睡眠安心' },
    { id: 'growth-decisions', label: '目標決策' },
  ];

  const filteredTemplates = useMemo(() => {
    return JOURNAL_TEMPLATES.filter((tpl) => {
      const matchCat = filterCategory === 'all' || tpl.category === filterCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      return (
        matchCat &&
        (tpl.title.toLowerCase().includes(q) ||
          tpl.titleEn.toLowerCase().includes(q) ||
          tpl.clinicalFramework.toLowerCase().includes(q))
      );
    });
  }, [filterCategory, searchQuery]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playChime(660, 1.5);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    const answersArray = currentTemplate.prompts.map((prompt, idx) => ({
      prompt,
      answer: answers[idx] || '',
    }));

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      templateId: currentTemplate.id,
      title: currentTemplate.title,
      date: new Date().toISOString().split('T')[0],
      answers: answersArray,
      tags: [currentTemplate.category, ...(currentTemplate.tags || [])],
    };

    setIsSaved(true);
    onSaveEntry(newEntry);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C3324]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] text-[#3D4035] w-full max-w-2xl rounded-3xl border border-[#E8E6E0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E6E0] flex items-center justify-between bg-[#F9F8F4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E9F0E8] text-[#2C3324] flex items-center justify-center">
              <BookMarked className="w-5 h-5 text-[#8BA888]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#2C3324]">引導式自我照顧日記</h3>
                <span className="text-[10px] font-bold bg-[#E9F0E8] text-[#2C3324] px-2 py-0.5 rounded-md border border-[#C9D6C8]/60">
                  43 門模板庫
                </span>
              </div>
              <p className="text-xs text-[#7A7D73]">藉由結構化問題，梳理情緒、卸載壓力與重拾力量</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7D73] hover:text-[#2C3324] hover:bg-[#F1F5EF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector & Category Filter Bar */}
        <div className="p-3 bg-[#F9F8F4] border-b border-[#E8E6E0] space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#2C3324] text-[#FDFCF8] shadow-2xs'
                    : 'bg-white text-[#5A6352] border border-[#E8E6E0] hover:border-[#8BA888] hover:bg-white/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Dropdown Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#E8E6E0] rounded-xl text-xs text-[#2C3324] font-medium hover:border-[#8BA888] transition-colors cursor-pointer"
            >
              <span className="truncate">
                當前選取：<strong className="text-[#8BA888] font-bold">{currentTemplate.title}</strong> · {currentTemplate.categoryLabel}
              </span>
              <ChevronDown className="w-4 h-4 text-[#7A7D73] shrink-0" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-[#E8E6E0] rounded-2xl shadow-xl max-h-56 overflow-y-auto p-2 space-y-1">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-[#7A7D73] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋 43 篇日記模板..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#F9F8F4] border border-[#E8E6E0] rounded-lg text-xs"
                  />
                </div>
                {filteredTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tpl.id);
                      setAnswers({});
                      setIsSaved(false);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? 'bg-[#E9F0E8] text-[#2C3324] font-bold'
                        : 'hover:bg-[#F9F8F4] text-[#3D4035]'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <span>{tpl.title}</span>
                      <span className="text-[10px] text-[#7A7D73] block">{tpl.titleEn}</span>
                    </div>
                    <span className="text-[10px] text-[#7A7D73] shrink-0 px-1.5 py-0.5 bg-white rounded border border-[#E8E6E0]">
                      {tpl.estimatedMinutes} 分鐘
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-5 sm:p-8 overflow-y-auto">
          {!isSaved ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Template Title & Metadata */}
              <div className="space-y-2 pb-2 border-b border-[#F1F5EF]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E9F0E8] text-[#2C3324]">
                    {currentTemplate.categoryLabel}
                  </span>
                  <span className="text-[11px] text-[#7A7D73] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8BA888]" />
                    預計 {currentTemplate.estimatedMinutes} 分鐘
                  </span>
                  <span className="text-[11px] text-[#8BA888] font-medium hidden sm:inline">
                    · {currentTemplate.clinicalFramework.split('(')[0]}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#2C3324]">
                  {currentTemplate.title}
                </h4>
                <p className="text-xs text-[#5A6352] leading-relaxed">
                  {currentTemplate.subtitle}
                </p>
              </div>

              {/* Prompts list */}
              <div className="space-y-4">
                {currentTemplate.prompts.map((prompt, idx) => (
                  <div key={idx} className="space-y-2 bg-[#F9F8F4] p-4 rounded-2xl border border-[#E8E6E0]">
                    <label className="block text-xs font-bold text-[#2C3324] flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#E9F0E8] text-[#2C3324] text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold border border-[#C9D6C8]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{prompt}</span>
                    </label>
                    <textarea
                      value={answers[idx] || ''}
                      onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                      placeholder="在此寫下你的直覺感受與思考，不需刻意修飾，真實即是力量..."
                      rows={3}
                      className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] resize-none placeholder:text-[#8C8F85] leading-relaxed"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#7A7D73]">
                  已填寫 {Object.values(answers).filter(Boolean).length} / {currentTemplate.prompts.length} 個提問
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 active:scale-98 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>保存今日日記</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E9F0E8] text-[#8BA888] flex items-center justify-center mx-auto shadow-xs border border-[#C9D6C8]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#2C3324]">日記已妥善保存！</h3>
                <p className="text-xs text-[#7A7D73] max-w-md mx-auto leading-relaxed">
                  每一次真誠的內在書寫，都是在給予心靈最深層的梳理與療癒。你的文字已安全加密存儲。
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                完成並返回
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
