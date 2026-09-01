// src/utils/analytics.ts
// 輕量無侵入式使用者行為數據埋點模組 (Analytics & Funnel Tracking)

export type AnalyticsEvent = 
  | 'home_view'
  | 'mood_checkin'
  | 'tool_open'
  | 'audio_start'
  | 'audio_progress_50'
  | 'audio_complete'
  | 'referral_click'
  | 'referral_form_submit'
  | 'crisis_open'
  | 'assessment_start'
  | 'assessment_complete';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  timestamp: number;
  data?: Record<string, any>;
}

class AnalyticsService {
  private storageKey = 'ydy_analytics_events_v1';

  public track(event: AnalyticsEvent, data?: Record<string, any>) {
    const payload: AnalyticsPayload = {
      event,
      timestamp: Date.now(),
      data,
    };

    try {
      const existing = this.getEvents();
      existing.push(payload);
      // 保留最近 200 筆事件，避免佔用過多記憶體
      const trimmed = existing.slice(-200);
      localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
      
      // 可以在開發者工具 console 檢視事件
      if (typeof window !== 'undefined' && (window as any).__DEBUG_ANALYTICS) {
        console.log(`[Analytics Tracked] ${event}`, data);
      }

      // 觸發自定義 window 事件供外部監聽整合 (如 GTM / Meta Pixel 等)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ydy_analytics', { detail: payload }));
      }
    } catch (e) {
      console.warn('Analytics track failed silently', e);
    }
  }

  public getEvents(): AnalyticsPayload[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public getFunnelSummary() {
    const events = this.getEvents();
    return {
      homeViews: events.filter(e => e.event === 'home_view').length,
      moodCheckIns: events.filter(e => e.event === 'mood_checkin').length,
      toolsOpened: events.filter(e => e.event === 'tool_open').length,
      audioStarts: events.filter(e => e.event === 'audio_start').length,
      audio50Progress: events.filter(e => e.event === 'audio_progress_50').length,
      audioCompletes: events.filter(e => e.event === 'audio_complete').length,
      referralClicks: events.filter(e => e.event === 'referral_click').length,
      formSubmissions: events.filter(e => e.event === 'referral_form_submit').length,
    };
  }
}

export const analytics = new AnalyticsService();
