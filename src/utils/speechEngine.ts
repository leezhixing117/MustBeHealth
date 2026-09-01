// Web Speech Synthesis (TTS) Engine for Intellect Audio Guides & Mindful Narration

export type VoiceTone = 'gentle' | 'coach' | 'mindful';
export type VoiceLang = 'cantonese' | 'mandarin' | 'english';

interface SpeakOptions {
  lang?: string;
  voiceLang?: VoiceLang;
  rate?: number;
  pitch?: number;
  volume?: number;
  tone?: VoiceTone;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onBoundary?: (charIndex: number, text: string) => void;
}

// Convert standard written Chinese text to authentic colloquial spoken Cantonese phrasing
export function convertToCantoneseSpoken(text: string): string {
  if (!text) return '';
  return text
    // Multi-character compound phrases first
    .replace(/我們大家/g, '我哋大家')
    .replace(/我們的/g, '我哋嘅')
    .replace(/你們的/g, '你哋嘅')
    .replace(/他們的/g, '佢哋嘅')
    .replace(/別人的/g, '人哋嘅')
    .replace(/我們/g, '我哋')
    .replace(/你們/g, '你哋')
    .replace(/他們/g, '佢哋')
    .replace(/別人/g, '人哋')
    .replace(/自己一個人/g, '自己一個')
    .replace(/這些全部/g, '呢啲全部')
    .replace(/這些/g, '呢啲')
    .replace(/這個/g, '呢個')
    .replace(/這裡/g, '呢度')
    .replace(/這段/g, '呢段')
    .replace(/這次/g, '呢次')
    .replace(/這種/g, '呢種')
    .replace(/這份/g, '呢份')
    .replace(/這樣/g, '咁樣')
    .replace(/這刻/g, '呢刻')
    .replace(/這條/g, '呢條')
    .replace(/這場/g, '呢場')
    .replace(/這把/g, '呢把')
    .replace(/這張/g, '呢張')
    .replace(/這部/g, '呢部')
    .replace(/這一/g, '呢一')
    .replace(/這/g, '呢')
    .replace(/那些全部/g, '嗰啲全部')
    .replace(/那些/g, '嗰啲')
    .replace(/那個/g, '嗰個')
    .replace(/那裡/g, '嗰度')
    .replace(/那份/g, '嗰份')
    .replace(/那樣/g, '噉樣')
    .replace(/那時/g, '嗰陣')
    .replace(/那/g, '嗰')
    .replace(/現在/g, '依家')
    .replace(/目前/g, '依家')
    .replace(/現時/g, '依家')
    .replace(/為什麼/g, '點解')
    .replace(/怎麼辦/g, '點算')
    .replace(/怎麼樣/g, '點樣')
    .replace(/怎麼/g, '點樣')
    .replace(/如何/g, '點樣')
    .replace(/什麼時候/g, '幾時')
    .replace(/什麼/g, '咩')
    .replace(/什麼事/g, '咩事')
    .replace(/不是/g, '唔係')
    .replace(/不要/g, '唔好')
    .replace(/不用/g, '唔使')
    .replace(/不能/g, '唔可以')
    .replace(/不需/g, '唔使')
    .replace(/不需要/g, '唔使')
    .replace(/不會/g, '唔會')
    .replace(/不可以/g, '唔可以')
    .replace(/不管/g, '無論')
    .replace(/不行/g, '唔得')
    .replace(/不滿/g, '唔滿意')
    .replace(/做不到/g, '做唔到')
    .replace(/做得到/g, '做到')
    .replace(/做好了/g, '做好咗')
    .replace(/沒有/g, '冇')
    .replace(/沒法/g, '冇辦法')
    .replace(/給予/g, '畀')
    .replace(/給/g, '畀')
    .replace(/看著/g, '望住')
    .replace(/看見/g, '睇到')
    .replace(/看到/g, '睇到')
    .replace(/看/g, '睇')
    .replace(/聽著/g, '聽住')
    .replace(/說話/g, '講嘢')
    .replace(/說道/g, '講')
    .replace(/說/g, '講')
    .replace(/尋找/g, '搵')
    .replace(/找到/g, '搵到')
    .replace(/找/g, '搵')
    .replace(/好的/g, '好嘅')
    .replace(/的時候/g, '嗰陣')
    .replace(/時候/g, '嗰陣')
    .replace(/起來/g, '起嚟')
    .replace(/掉了/g, '咗')
    .replace(/正在/g, '正喺度')
    .replace(/在於/g, '在於')
    .replace(/在/g, '喺')
    .replace(/非常/g, '好')
    .replace(/很/g, '好')
    .replace(/想一想/g, '諗一諗')
    .replace(/思考/g, '諗下')
    .replace(/想著/g, '諗住')
    .replace(/想要/g, '想')
    .replace(/深吸一口氣/g, '深深吸一口氣')
    .replace(/吐氣/g, '呼氣')
    .replace(/吐出/g, '呼出嚟')
    .replace(/吐/g, '呼')
    .replace(/放下/g, '擺低')
    .replace(/拿掉/g, '攞走')
    .replace(/拿起/g, '攞起')
    .replace(/拿/g, '攞')
    .replace(/疲憊/g, '好攰')
    .replace(/累了/g, '攰喇')
    .replace(/累/g, '攰')
    .replace(/完成了/g, '搞掂咗')
    .replace(/完成/g, '搞掂')
    .replace(/一會兒/g, '一陣間')
    .replace(/剛剛/g, '頭先')
    .replace(/只是/g, '只係')
    .replace(/一起/g, '一齊')
    .replace(/謝謝/g, '多謝')
    .replace(/馬上/g, '即刻')
    .replace(/立刻/g, '即刻')
    .replace(/趕快/g, '快啲')
    .replace(/睡覺/g, '瞓覺')
    .replace(/睡著/g, '瞓著')
    .replace(/醒來/g, '醒返')
    .replace(/閉上雙眼/g, '合埋對眼')
    .replace(/閉上眼睛/g, '合埋對眼')
    .replace(/閉眼/g, '合埋眼')
    .replace(/睜開眼睛/g, '擘開對眼')
    .replace(/肩膀/g, '大裥同膊頭')
    .replace(/脖子/g, '頸部')
    .replace(/肚子/g, '肚仔')
    .replace(/慢慢地/g, '慢慢咁')
    .replace(/地/g, '咁')
    .replace(/了/g, '咗')
    .replace(/的/g, '嘅')
    .replace(/著/g, '住');
}

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private activeText: string = '';
  private keepAliveTimer: NodeJS.Timeout | null = null;
  private preferredTone: VoiceTone = 'gentle';
  private preferredVoiceLang: VoiceLang = 'cantonese';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.refreshVoices();

      // Listen for voice change events (fired when browser loads speech packages)
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.refreshVoices();
      }

      // Retry voice loading periodically for delayed browser initialization
      setTimeout(() => this.refreshVoices(), 200);
      setTimeout(() => this.refreshVoices(), 1000);
      setTimeout(() => this.refreshVoices(), 2500);

      try {
        const saved = localStorage.getItem('intellect_voice_lang');
        if (saved === 'cantonese' || saved === 'mandarin' || saved === 'english') {
          this.preferredVoiceLang = saved;
        }
      } catch (e) {
        // Ignore localStorage error
      }
    }
  }

  public refreshVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    try {
      const list = this.synth.getVoices();
      if (list && list.length > 0) {
        this.voices = list;
      }
    } catch (e) {
      // Ignore
    }
    return this.voices;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    this.refreshVoices();
    return this.voices;
  }

  public setVoiceLang(voiceLang: VoiceLang) {
    this.preferredVoiceLang = voiceLang;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('intellect_voice_lang', voiceLang);
      }
    } catch (e) {
      // Ignore localStorage error
    }
  }

  public getVoiceLang(): VoiceLang {
    return this.preferredVoiceLang;
  }

  public getVoiceLangLabel(vLang = this.preferredVoiceLang): string {
    if (vLang === 'cantonese') return '廣東話 (粵語)';
    if (vLang === 'mandarin') return '普通話 (國語)';
    return '英語 (English)';
  }

  // Returns Cantonese voice if available
  public getCantoneseVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. High-priority exact Cantonese identifiers
    const cantoneseVoice = voices.find((v) => {
      const langLower = (v.lang || '').toLowerCase().replace(/_/g, '-');
      const nameLower = (v.name || '').toLowerCase();

      return (
        langLower === 'zh-hk' ||
        langLower === 'yue-hk' ||
        langLower === 'yue' ||
        langLower === 'zh-yue' ||
        langLower === 'zh-hant-hk' ||
        langLower.startsWith('zh-hk') ||
        langLower.startsWith('yue') ||
        nameLower.includes('cantonese') ||
        nameLower.includes('hong kong') ||
        nameLower.includes('hongkong') ||
        nameLower.includes('sin-ji') ||
        nameLower.includes('sinji') ||
        nameLower.includes('tracy') ||
        nameLower.includes('hiugaai') ||
        nameLower.includes('hiumaan') ||
        nameLower.includes('wanlung') ||
        nameLower.includes('danny') ||
        nameLower.includes('szeman') ||
        nameLower.includes('kaho') ||
        nameLower.includes('粵語') ||
        nameLower.includes('粤语') ||
        nameLower.includes('廣東話') ||
        nameLower.includes('廣州話')
      );
    });

    return cantoneseVoice || null;
  }

  // Check if system has Cantonese synthesis installed
  public hasCantoneseVoice(): boolean {
    return this.getCantoneseVoice() !== null;
  }

  // Returns active voice summary for UI & troubleshooting
  public getActiveVoiceDetails(vLang: VoiceLang = this.preferredVoiceLang): {
    name: string;
    lang: string;
    isNative: boolean;
    allAvailableVoicesCount: number;
  } {
    const voices = this.getVoices();
    let voice: SpeechSynthesisVoice | null = null;
    let isNative = false;

    if (vLang === 'cantonese') {
      voice = this.getCantoneseVoice();
      isNative = !!voice;
    } else if (vLang === 'mandarin') {
      voice = this.getMandarinVoice();
      isNative = !!voice;
    } else if (vLang === 'english') {
      voice = this.getEnglishVoice();
      isNative = !!voice;
    }

    return {
      name: voice ? voice.name : (vLang === 'cantonese' ? 'zh-HK 預設合成語音' : '系統預設語音'),
      lang: voice ? voice.lang : (vLang === 'cantonese' ? 'zh-HK' : 'zh-TW'),
      isNative,
      allAvailableVoicesCount: voices.length,
    };
  }

  // Returns a Mandarin voice
  public getMandarinVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    const mandarinVoice = voices.find((v) => {
      const langLower = (v.lang || '').toLowerCase().replace(/_/g, '-');
      const nameLower = (v.name || '').toLowerCase();
      return (
        langLower === 'zh-tw' ||
        langLower === 'zh-cn' ||
        langLower === 'zh-sg' ||
        langLower === 'zh-hant-tw' ||
        langLower === 'zh-hans-cn' ||
        langLower.startsWith('zh-tw') ||
        langLower.startsWith('zh-cn') ||
        langLower.startsWith('cmn') ||
        nameLower.includes('taiwan') ||
        nameLower.includes('mandarin') ||
        nameLower.includes('meijia') ||
        nameLower.includes('hanhan') ||
        nameLower.includes('xiaoxiao') ||
        nameLower.includes('yunxi') ||
        nameLower.includes('yating') ||
        nameLower.includes('zhiyu') ||
        nameLower.includes('國語') ||
        nameLower.includes('普通话') ||
        nameLower.includes('普通話')
      );
    });

    return mandarinVoice || voices.find((v) => (v.lang || '').toLowerCase().startsWith('zh')) || null;
  }

  // Returns an English voice
  public getEnglishVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    const enVoice = voices.find((v) => {
      const langLower = (v.lang || '').toLowerCase().replace(/_/g, '-');
      return (
        langLower === 'en-us' ||
        langLower === 'en-gb' ||
        langLower === 'en-au' ||
        langLower.startsWith('en')
      );
    });

    return enVoice || null;
  }

  public getPreferredVoice(preferredLangOrType: string = 'cantonese'): SpeechSynthesisVoice | null {
    const langKey = preferredLangOrType.toLowerCase();

    if (langKey === 'cantonese' || langKey === 'zh-hk' || langKey === 'yue') {
      return this.getCantoneseVoice();
    }

    if (langKey === 'mandarin' || langKey === 'zh-tw' || langKey === 'zh-cn' || langKey === 'zh') {
      return this.getMandarinVoice();
    }

    if (langKey === 'english' || langKey.startsWith('en')) {
      return this.getEnglishVoice();
    }

    return null;
  }

  public setTone(tone: VoiceTone) {
    this.preferredTone = tone;
  }

  public getTone(): VoiceTone {
    return this.preferredTone;
  }

  public speak(rawText: string, options: SpeakOptions = {}) {
    if (!this.synth || this.isMuted) return;

    this.cancel();

    if (!rawText || !rawText.trim()) return;

    const voiceLang = options.voiceLang || this.preferredVoiceLang;
    
    // Transform text for Cantonese when selected
    let textToSpeak = rawText;
    if (voiceLang === 'cantonese') {
      textToSpeak = convertToCantoneseSpoken(rawText);
    }

    this.activeText = textToSpeak;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    this.currentUtterance = utterance;

    // Explicitly set language codes & voices
    if (voiceLang === 'cantonese') {
      utterance.lang = 'zh-HK';
      const cantoneseVoice = this.getCantoneseVoice();
      if (cantoneseVoice) {
        utterance.voice = cantoneseVoice;
      }
    } else if (voiceLang === 'mandarin') {
      utterance.lang = 'zh-TW';
      const mandarinVoice = this.getMandarinVoice();
      if (mandarinVoice) {
        utterance.voice = mandarinVoice;
      }
    } else if (voiceLang === 'english') {
      utterance.lang = 'en-US';
      const englishVoice = this.getEnglishVoice();
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    } else if (options.lang) {
      utterance.lang = options.lang;
    }

    // Apply voice tone modifiers
    const tone = options.tone || this.preferredTone;
    let basePitch = 1.0;
    let baseRate = 0.95;

    if (voiceLang === 'cantonese') {
      // Natural Cantonese speech pacing & pitch
      basePitch = 1.02;
      baseRate = 0.92;
    }

    if (tone === 'gentle') {
      basePitch *= 0.98;
      baseRate *= 0.92;
    } else if (tone === 'mindful') {
      basePitch *= 0.94;
      baseRate *= 0.85;
    } else if (tone === 'coach') {
      basePitch *= 1.04;
      baseRate *= 1.0;
    }

    utterance.rate = (options.rate ?? 1.0) * baseRate;
    utterance.pitch = (options.pitch ?? 1.0) * basePitch;
    utterance.volume = options.volume ?? 1.0;

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
      this.startKeepAlive();
    };

    utterance.onboundary = (event) => {
      if (options.onBoundary && event.charIndex !== undefined) {
        options.onBoundary(event.charIndex, textToSpeak);
      }
    };

    utterance.onend = () => {
      this.stopKeepAlive();
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.stopKeepAlive();
      this.currentUtterance = null;
      if (options.onError) options.onError(e);
    };

    try {
      // Resume if in paused state
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public cancel() {
    this.stopKeepAlive();
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.cancel();
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking && !this.synth.paused);
  }

  // Workaround for Chromium 15-second speech synthesis cutoff bug
  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      } else {
        this.stopKeepAlive();
      }
    }, 10000);
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }
}

export const speechEngine = new SpeechEngine();
