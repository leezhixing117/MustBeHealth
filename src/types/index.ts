export type Language = 'zh-TW' | 'zh-CN' | 'en';

export type MoodType = 'great' | 'good' | 'okay' | 'down' | 'stressed';

export interface MoodRecord {
  id: string;
  date: string;
  mood: MoodType;
  factors: string[];
  note?: string;
  timestamp: number;
}

export interface LearningPathLesson {
  id: string;
  dayNumber: number;
  title: string;
  durationMinutes: number;
  completed: boolean;
  summary: string;
  contentCards: {
    title: string;
    description: string;
    interactiveType?: 'multiple-choice' | 'reflection' | 'cbt-reframe' | 'action-check';
    question?: string;
    options?: string[];
    sampleAnswer?: string;
  }[];
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  category: 'emotion' | 'productivity' | 'relationship' | 'sleep' | 'self-growth' | 'burnout' | 'mindfulness';
  categoryLabel: string;
  thumbnail: string;
  badgeColor: string;
  totalDays: number;
  completedDays: number;
  description: string;
  clinicalOutcome: string;
  lessons: LearningPathLesson[];
}

export interface RescueSession {
  id: string;
  title: string;
  subtitle: string;
  durationText: string;
  durationSeconds: number;
  category: 'anxiety' | 'sleep' | 'overwhelm' | 'anger' | 'burnout' | 'procrastination' | 'criticism' | 'grief' | 'relationships' | 'focus';
  themeColor: string;
  iconName: string;
  steps: {
    phase: string;
    instruction: string;
    subInstruction: string;
    durationSec: number;
    actionType: 'breathe-478' | 'grounding-54321' | 'muscle-release' | 'reframing' | 'visualization';
  }[];
}

export interface Coach {
  id: string;
  name: string;
  title: string;
  role: 'behavioral-coach' | 'clinical-psychologist' | 'counsellor';
  roleLabel: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  specialties: string[];
  bio: string;
  yearsExperience: number;
  education: string;
  availableSlots: string[];
}

export type JournalCategory = 
  | 'gratitude' 
  | 'cbt' 
  | 'stress-burnout' 
  | 'self-compassion' 
  | 'emotions' 
  | 'relationships' 
  | 'sleep' 
  | 'growth-decisions';

export interface JournalTemplate {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  icon: string;
  category: JournalCategory;
  categoryLabel: string;
  categoryEn: string;
  clinicalFramework: string;
  estimatedMinutes: number;
  prompts: string[];
  tags: string[];
}

export interface JournalEntry {
  id: string;
  templateId: string;
  title: string;
  date: string;
  answers: { prompt: string; answer: string }[];
  mood?: MoodType;
  tags: string[];
}

export interface CrisisResource {
  region: string;
  name: string;
  phone: string;
  availableHours: string;
  note: string;
}

export interface SoundscapeItem {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  synthType: 'rain' | 'ocean' | 'singingBowl' | 'forestBreeze' | 'lofiChime';
  description: string;
}

export interface GuidedMeditation {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  category: 'peace' | 'body' | 'emotions' | 'compassion' | 'sleep' | 'focus';
  categoryLabel: string;
  categoryEn: string;
  durationMinutes: number;
  thumbnail: string;
  description: string;
  soundType: 'singingBowl' | 'ocean' | 'rain' | 'forestBreeze' | 'lofiChime';
  tags: string[];
  stages: {
    title: string;
    durationSeconds: number;
    instruction: string;
    voiceGuidance: string;
  }[];
}

export interface AudioGuideChapter {
  title: string;
  titleEn?: string;
  titleCantonese?: string;
  durationSeconds: number;
  narrationScript: string;
  narrationScriptEn?: string;
  narrationScriptCantonese?: string;
  actionPrompt?: string;
  actionPromptEn?: string;
  actionPromptCantonese?: string;
  reflectionPrompt?: string;
  reflectionPromptEn?: string;
  reflectionPromptCantonese?: string;
}

export interface AudioGuide {
  id: string;
  title: string;
  titleEn: string;
  titleCantonese?: string;
  subtitle: string;
  subtitleEn: string;
  subtitleCantonese?: string;
  category: 'emotions' | 'workplace' | 'relationships' | 'self-growth' | 'sleep-rest' | 'focus-flow';
  categoryLabel: string;
  categoryEn: string;
  categoryLabelCantonese?: string;
  durationMinutes: number;
  guideName: string;
  guideNameEn?: string;
  guideNameCantonese?: string;
  guideRole: string;
  guideRoleEn: string;
  guideRoleCantonese?: string;
  thumbnail: string;
  description: string;
  descriptionEn?: string;
  descriptionCantonese?: string;
  clinicalFramework: string;
  clinicalFrameworkEn?: string;
  clinicalFrameworkCantonese?: string;
  keyTakeaway: string;
  keyTakeawayEn?: string;
  keyTakeawayCantonese?: string;
  actionItems: string[];
  actionItemsEn?: string[];
  actionItemsCantonese?: string[];
  soundType: 'rain' | 'ocean' | 'singingBowl' | 'forestBreeze' | 'lofiChime';
  tags: string[];
  tagsEn?: string[];
  tagsCantonese?: string[];
  chapters: AudioGuideChapter[];
}

export interface IntellectCollection {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  category: string;
  tagline: string;
  icon: string;
  bannerImage: string;
  themeColor: string;
  accentColor: string;
  badge: string;
  description: string;
  clinicalOutcome: string;
  featuredStats: { label: string; value: string }[];
  learningPathIds: string[];
  rescueSessionIds: string[];
  audioGuideIds: string[];
  journalTemplateIds: string[];
  meditationIds: string[];
  soundscapeIds: string[];
  recommendedCoachIds?: string[];
  quickSituations: {
    label: string;
    icon: string;
    toolType: 'rescue' | 'journal' | 'audio' | 'path' | 'meditation';
    targetId: string;
    description: string;
  }[];
}
