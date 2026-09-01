import React, { useState, useEffect } from 'react';
import { 
  MoodRecord, 
  LearningPath, 
  RescueSession, 
  Coach, 
  JournalEntry, 
  SoundscapeItem, 
  GuidedMeditation,
  AudioGuide,
  Language 
} from './types';
import { 
  INITIAL_MOOD_RECORDS, 
  LEARNING_PATHS, 
  RESCUE_SESSIONS, 
  COACHES, 
  DEFAULT_CARE_CONSULTANT,
  SOUNDSCAPES,
  GUIDED_MEDITATIONS,
  AUDIO_GUIDES
} from './data/mockData';
import { soundEngine } from './utils/soundEngine';

// Components
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { LearningPathsView } from './components/LearningPathsView';
import { AudioGuidesView } from './components/AudioGuidesView';
import { RescueView } from './components/RescueView';
import { CareView } from './components/CareView';
import { JournalsView } from './components/JournalsView';
import { SoundscapesView } from './components/SoundscapesView';
import { InsightsView } from './components/InsightsView';

// Modals
import { RescueModal } from './components/RescueModal';
import { LearningPathModal } from './components/LearningPathModal';
import { AudioGuideModal } from './components/AudioGuideModal';
import { CoachingModal } from './components/CoachingModal';
import { JournalModal } from './components/JournalModal';
import { CrisisModal } from './components/CrisisModal';
import { AssessmentModal } from './components/AssessmentModal';
import { MeditationModal } from './components/MeditationModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';

export default function App() {
  // App states
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [lang, setLang] = useState<Language>('zh-TW');
  const [streakCount, setStreakCount] = useState<number>(5);

  // Data states with localStorage initialization
  const [moodHistory, setMoodHistory] = useState<MoodRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ydy_health_moods') || localStorage.getItem('intellect_moods');
      return saved ? JSON.parse(saved) : INITIAL_MOOD_RECORDS;
    } catch {
      return INITIAL_MOOD_RECORDS;
    }
  });

  const [todayMoodRecord, setTodayMoodRecord] = useState<MoodRecord | null>(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return moodHistory.find((m) => m.date === todayStr) || null;
  });

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() => {
    try {
      const saved = localStorage.getItem('ydy_health_paths') || localStorage.getItem('intellect_paths');
      return saved ? JSON.parse(saved) : LEARNING_PATHS;
    } catch {
      return LEARNING_PATHS;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ydy_health_journals') || localStorage.getItem('intellect_journals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coaches, setCoaches] = useState<Coach[]>(() => {
    try {
      const saved = localStorage.getItem('ydy_health_coaches_v2');
      return saved ? JSON.parse(saved) : COACHES;
    } catch {
      return COACHES;
    }
  });

  useEffect(() => {
    localStorage.setItem('ydy_health_coaches_v2', JSON.stringify(coaches));
  }, [coaches]);

  const [completedRescueCount, setCompletedRescueCount] = useState<number>(12);

  // Modals state
  const [activeRescueSession, setActiveRescueSession] = useState<RescueSession | null>(null);
  const [activePathForModal, setActivePathForModal] = useState<{ path: LearningPath; lessonIndex: number } | null>(null);
  const [activeCoachForModal, setActiveCoachForModal] = useState<{ coach: Coach; mode: 'book' | 'chat' } | null>(null);
  const [journalModalTemplateId, setJournalModalTemplateId] = useState<string | undefined>(undefined);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [activeMeditationForModal, setActiveMeditationForModal] = useState<GuidedMeditation | null>(null);
  const [activeAudioGuideForModal, setActiveAudioGuideForModal] = useState<AudioGuide | null>(null);

  // Soundscape active state
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeItem | null>(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ydy_health_moods', JSON.stringify(moodHistory));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [moodHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('ydy_health_paths', JSON.stringify(learningPaths));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [learningPaths]);

  useEffect(() => {
    try {
      localStorage.setItem('ydy_health_journals', JSON.stringify(journalEntries));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem('ydy_health_coaches', JSON.stringify(coaches));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [coaches]);

  // Handlers
  const handleAddCoach = (newCoach: Coach) => {
    setCoaches((prev) => [newCoach, ...prev]);
    showToast(`✨ 已成功新增 ${newCoach.name} 至專家名單！`);
  };

  const handleDeleteCoach = (coachId: string) => {
    setCoaches((prev) => prev.filter((c) => c.id !== coachId));
    showToast('🗑️ 已從名單中移除該專家。');
  };

  const handleSaveMood = (record: MoodRecord) => {
    setTodayMoodRecord(record);
    const existingIdx = moodHistory.findIndex((m) => m.date === record.date);
    if (existingIdx >= 0) {
      const updated = [...moodHistory];
      updated[existingIdx] = record;
      setMoodHistory(updated);
    } else {
      setMoodHistory([...moodHistory, record]);
      setStreakCount((c) => c + 1);
    }
    showToast('✨ 今日心情已成功記錄！連續打卡天數已更新。');
  };

  const handleCompleteLesson = (pathId: string, lessonId: string) => {
    setLearningPaths((prev) =>
      prev.map((p) => {
        if (p.id === pathId) {
          const updatedLessons = p.lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: true } : l
          );
          const completedCount = updatedLessons.filter((l) => l.completed).length;
          return {
            ...p,
            lessons: updatedLessons,
            completedDays: completedCount,
          };
        }
        return p;
      })
    );
    showToast('🎉 恭喜完成今日微課程！已為你記錄學習進度。');
  };

  const handleCompleteRescue = (sessionId: string) => {
    setCompletedRescueCount((c) => c + 1);
    showToast('🌿 完成即時急救練習，為身心注入平靜能量。');
  };

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setJournalEntries([entry, ...journalEntries]);
    showToast('✍️ 日記已妥善加密保存。');
  };

  const handleBookingConfirmed = (coachName: string, slot: string, type: string) => {
    showToast(`📅 已成功預約 ${coachName} 的 ${type}（${slot}）`);
  };

  // Soundscape handlers
  const handleSelectSoundscape = (snd: SoundscapeItem) => {
    setActiveSoundscape(snd);
    setIsSoundPlaying(true);
    soundEngine.playSoundscape(snd.synthType, snd.id);
    showToast(`🎵 正在播放：${snd.name}`);
  };

  const handleToggleSoundscape = () => {
    if (!activeSoundscape) return;
    if (isSoundPlaying) {
      soundEngine.stopSoundscape();
      setIsSoundPlaying(false);
    } else {
      soundEngine.playSoundscape(activeSoundscape.synthType, activeSoundscape.id);
      setIsSoundPlaying(true);
    }
  };

  const handleStopSoundscape = () => {
    soundEngine.stopSoundscape();
    setIsSoundPlaying(false);
    setActiveSoundscape(null);
  };

  // Total completed lessons calculation
  const totalCompletedLessons = learningPaths.reduce((acc, p) => acc + p.completedDays, 0);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#3D4035] flex flex-col font-sans selection:bg-[#C9D6C8] selection:text-[#2C3324]">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        lang={lang}
        onLangChange={setLang}
        streakCount={streakCount}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        onOpenAssessment={() => setIsAssessmentModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
          <HomeDashboard
            lang={lang}
            todayMoodRecord={todayMoodRecord}
            coaches={coaches}
            onSaveMood={handleSaveMood}
            onOpenRescue={(session) => setActiveRescueSession(session)}
            onOpenPath={(path, lessonIdx = 0) => setActivePathForModal({ path, lessonIndex: lessonIdx })}
            onOpenAudioGuide={(guide) => setActiveAudioGuideForModal(guide)}
            onOpenCoach={(coach, mode = 'book') => setActiveCoachForModal({ coach, mode })}
            onOpenJournal={(tplId) => {
              setJournalModalTemplateId(tplId);
              setIsJournalModalOpen(true);
            }}
            onPlaySoundscape={handleSelectSoundscape}
            onOpenAssessment={() => setIsAssessmentModalOpen(true)}
            onTabChange={setCurrentTab}
            streakCount={streakCount}
          />
        )}

        {currentTab === 'learning' && (
          <LearningPathsView
            lang={lang}
            onOpenPath={(path, lessonIdx = 0) => setActivePathForModal({ path, lessonIndex: lessonIdx })}
          />
        )}

        {currentTab === 'audio-guides' && (
          <AudioGuidesView
            lang={lang}
            onOpenGuide={(guide) => setActiveAudioGuideForModal(guide)}
          />
        )}

        {currentTab === 'rescue' && (
          <RescueView
            lang={lang}
            onOpenRescue={(session) => setActiveRescueSession(session)}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}

        {currentTab === 'care' && (
          <CareView
            lang={lang}
            coaches={coaches}
            onOpenCoach={(coach, mode = 'book') => setActiveCoachForModal({ coach, mode })}
            onAddCoach={handleAddCoach}
            onDeleteCoach={handleDeleteCoach}
          />
        )}

        {currentTab === 'journals' && (
          <JournalsView
            lang={lang}
            entries={journalEntries}
            onOpenJournalModal={(tplId) => {
              setJournalModalTemplateId(tplId);
              setIsJournalModalOpen(true);
            }}
          />
        )}

        {currentTab === 'soundscapes' && (
          <SoundscapesView
            lang={lang}
            activeSound={activeSoundscape}
            isPlaying={isSoundPlaying}
            onSelectSound={handleSelectSoundscape}
            onTogglePlay={handleToggleSoundscape}
            onOpenMeditation={(med) => setActiveMeditationForModal(med)}
          />
        )}

        {currentTab === 'insights' && (
          <InsightsView
            lang={lang}
            moodHistory={moodHistory}
            streakCount={streakCount}
            completedLessonsCount={totalCompletedLessons}
            completedRescueCount={completedRescueCount}
            onOpenAssessment={() => setIsAssessmentModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Ambient Soundscape Player */}
      <AudioPlayerBar
        activeSound={activeSoundscape}
        isPlaying={isSoundPlaying}
        onTogglePlay={handleToggleSoundscape}
        onStop={handleStopSoundscape}
        onSelectSound={handleSelectSoundscape}
      />

      {/* Modals */}
      {activeRescueSession && (
        <RescueModal
          session={activeRescueSession}
          onClose={() => setActiveRescueSession(null)}
          onCompleteSession={handleCompleteRescue}
          onOpenAudioGuide={(guide) => setActiveAudioGuideForModal(guide)}
        />
      )}

      {activePathForModal && (
        <LearningPathModal
          path={activePathForModal.path}
          lessonIndex={activePathForModal.lessonIndex}
          onClose={() => setActivePathForModal(null)}
          onCompleteLesson={handleCompleteLesson}
          onOpenAudioGuide={(guide) => setActiveAudioGuideForModal(guide)}
        />
      )}

      {activeCoachForModal && (
        <CoachingModal
          coach={activeCoachForModal.coach}
          mode={activeCoachForModal.mode}
          onClose={() => setActiveCoachForModal(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {isJournalModalOpen && (
        <JournalModal
          initialTemplateId={journalModalTemplateId}
          onClose={() => setIsJournalModalOpen(false)}
          onSaveEntry={handleSaveJournalEntry}
          onOpenAudioGuide={(guide) => setActiveAudioGuideForModal(guide)}
        />
      )}

      {isCrisisModalOpen && (
        <CrisisModal
          onClose={() => setIsCrisisModalOpen(false)}
          onStartBreathe={() => {
            setIsCrisisModalOpen(false);
            setActiveRescueSession(RESCUE_SESSIONS[0]);
          }}
        />
      )}

      {isAssessmentModalOpen && (
        <AssessmentModal
          onClose={() => setIsAssessmentModalOpen(false)}
          onOpenPath={(pathId) => {
            const found = learningPaths.find((p) => p.id === pathId) || learningPaths[0];
            setActivePathForModal({ path: found, lessonIndex: 0 });
          }}
          onOpenCoach={(coachId) => {
            const found = coaches.find((c) => c.id === coachId) || coaches[0] || DEFAULT_CARE_CONSULTANT;
            setActiveCoachForModal({ coach: found, mode: 'book' });
          }}
          onOpenRescue={() => {
            setActiveRescueSession(RESCUE_SESSIONS[0]);
          }}
        />
      )}

      {activeMeditationForModal && (
        <MeditationModal
          meditation={activeMeditationForModal}
          onClose={() => setActiveMeditationForModal(null)}
          onComplete={(medId) => {
            showToast('🌿 正念冥想已圓滿完成，身心已重新獲得深層平靜與力量！');
            setStreakCount((prev) => prev);
          }}
        />
      )}

      {activeAudioGuideForModal && (
        <AudioGuideModal
          guide={activeAudioGuideForModal}
          onClose={() => setActiveAudioGuideForModal(null)}
          onOpenOtherGuides={() => {
            setActiveAudioGuideForModal(null);
            setCurrentTab('audio-guides');
          }}
          onComplete={(guideId) => {
            showToast('🎧 音訊導引與行動練習已圓滿完成，力量已深植於心！');
            setStreakCount((prev) => prev);
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C3324]/95 text-[#FDFCF8] px-4 py-2.5 rounded-2xl shadow-xl border border-[#5A6352]/80 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#F9F8F4] border-t border-[#E8E6E0] py-8 px-4 sm:px-6 lg:px-8 text-xs text-[#7A7D73]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2C3324]">醫定要健康</span>
            <span>· 心理與身心健康平台</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCrisisModalOpen(true)} className="hover:text-rose-600 transition-colors cursor-pointer">
              24/7 危機支援專線
            </button>
            <button onClick={() => setCurrentTab('insights')} className="hover:text-[#8BA888] transition-colors cursor-pointer">
              身心洞察
            </button>
            <span>© 2026 醫定要健康. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
