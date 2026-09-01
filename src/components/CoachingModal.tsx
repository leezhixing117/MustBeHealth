import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Send, 
  UserCheck, 
  ShieldCheck, 
  Award,
  Sparkles
} from 'lucide-react';
import { Coach } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CoachingModalProps {
  coach: Coach | null;
  mode: 'book' | 'chat';
  onClose: () => void;
  onBookingConfirmed: (coachName: string, slot: string, type: string) => void;
}

export const CoachingModal: React.FC<CoachingModalProps> = ({
  coach,
  mode: initialMode,
  onClose,
  onBookingConfirmed,
}) => {
  if (!coach) return null;

  const [activeMode, setActiveMode] = useState<'book' | 'chat'>(initialMode);
  const [selectedSlot, setSelectedSlot] = useState<string>(coach.availableSlots[0] || '');
  const [consultType, setConsultType] = useState<'video' | 'audio' | 'text'>('video');
  const [concerns, setConcerns] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Live text coaching chat messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'coach' | 'user'; text: string; time: string }>>([
    {
      sender: 'coach',
      text: `你好！我是 ${coach.name}。很高興在這裡遇見你。請放鬆，這裡是一個完全保密且安全的空間。今天有什麼困擾或想梳理的思緒嗎？`,
      time: '剛剛',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isCoachTyping, setIsCoachTyping] = useState<boolean>(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playChime(640, 1.5);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
    });
    setIsBooked(true);
    const typeLabel = consultType === 'video' ? '1對1 線上視訊' : consultType === 'audio' ? '語音通話' : '深度文字諮詢';
    onBookingConfirmed(coach.name, selectedSlot, typeLabel);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: nowTime }]);
    setInputText('');
    soundEngine.playChime(520, 0.3);

    // Simulate thoughtful behavioral coach responses
    setIsCoachTyping(true);
    setTimeout(() => {
      let reply = `我聽到了。當面對這種情況時，感到壓力和情緒波動是非常自然的反應。`;
      if (userMsg.includes('工作') || userMsg.includes('老闆') || userMsg.includes('累') || userMsg.includes('壓力')) {
        reply = `謝謝你願意分享這份職場的沉重。我們經常對自己有很高的要求，但大腦的能量容量是有限的。如果試著把當前的負擔拆成「能掌控的」與「暫時無法掌控的」，你覺得哪一部分最消耗你？`;
      } else if (userMsg.includes('焦慮') || userMsg.includes('擔心') || userMsg.includes('睡不著')) {
        reply = `焦慮往往是大腦在提前預演未發生的危機。試著先將雙手放在胸口感受溫暖，給自己一句話：「現在此時此刻，我是安全的。」我們一起一步步梳理。`;
      } else {
        reply = `感謝你的坦誠。在臨床認知行為中，我們常發現想法不等於事實。如果換作一位很珍惜你的摯友對你說同樣的話，你會給他什麼支持與建議呢？`;
      }

      setChatMessages((prev) => [...prev, { sender: 'coach', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsCoachTyping(false);
      soundEngine.playChime(600, 0.5);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C3324]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] text-[#3D4035] w-full max-w-2xl rounded-3xl border border-[#E8E6E0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Coach info */}
        <div className="p-5 border-b border-[#37402E] flex items-center justify-between bg-[#2C3324] text-[#FDFCF8]">
          <div className="flex items-center gap-3">
            <img
              src={coach.avatar}
              alt={coach.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#8BA888] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{coach.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8BA888]/30 text-[#E9F0E8] border border-[#8BA888]/40">
                  {coach.roleLabel}
                </span>
              </div>
              <p className="text-xs text-[#C9D6C8] line-clamp-1">{coach.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mode switch */}
            <div className="flex items-center bg-[#37402E] p-1 rounded-xl border border-[#48533D] text-xs">
              <button
                onClick={() => setActiveMode('book')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeMode === 'book' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#C9D6C8] hover:text-white'
                }`}
              >
                預約諮詢
              </button>
              <button
                onClick={() => setActiveMode('chat')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeMode === 'chat' ? 'bg-[#8BA888] text-white shadow-xs' : 'text-[#C9D6C8] hover:text-white'
                }`}
              >
                文字諮詢
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#C9D6C8] hover:text-white hover:bg-[#37402E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto">
          {activeMode === 'book' ? (
            !isBooked ? (
              <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-6">
                {/* Coach Bio highlights */}
                <div className="p-4 rounded-2xl bg-[#F1F5EF] border border-[#E8E6E0] flex flex-wrap gap-4 text-xs text-[#3D4035]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Star className="w-4 h-4 text-[#C88A58] fill-[#C88A58]" />
                    <span>{coach.rating} ({coach.reviewCount} 則高分評價)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Award className="w-4 h-4 text-[#8BA888]" />
                    <span>{coach.yearsExperience} 年臨床/教練資歷</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#647A5F]" />
                    <span>{coach.education}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-2">專長領域</label>
                  <div className="flex flex-wrap gap-1.5">
                    {coach.specialties.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#F1F5EF] text-[#5A6352] font-medium border border-[#E8E6E0]">
                        #{s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consultation Modality */}
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-2">選擇諮詢方式</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setConsultType('video')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        consultType === 'video'
                          ? 'bg-[#E9F0E8] border-[#8BA888] text-[#2C3324] ring-2 ring-[#8BA888]/30'
                          : 'border-[#E8E6E0] hover:bg-[#F9F8F4] text-[#5A6352]'
                      }`}
                    >
                      <Video className="w-5 h-5 mx-auto mb-1 text-[#8BA888]" />
                      <span className="text-xs font-bold block">1對1 線上視訊</span>
                      <span className="text-[10px] text-[#7A7D73]">面對面高互動</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('audio')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        consultType === 'audio'
                          ? 'bg-[#E9F0E8] border-[#8BA888] text-[#2C3324] ring-2 ring-[#8BA888]/30'
                          : 'border-[#E8E6E0] hover:bg-[#F9F8F4] text-[#5A6352]'
                      }`}
                    >
                      <Phone className="w-5 h-5 mx-auto mb-1 text-[#8BA888]" />
                      <span className="text-xs font-bold block">語音通話</span>
                      <span className="text-[10px] text-[#7A7D73]">無鏡頭隱私放鬆</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('text')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        consultType === 'text'
                          ? 'bg-[#E9F0E8] border-[#8BA888] text-[#2C3324] ring-2 ring-[#8BA888]/30'
                          : 'border-[#E8E6E0] hover:bg-[#F9F8F4] text-[#5A6352]'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 mx-auto mb-1 text-[#8BA888]" />
                      <span className="text-xs font-bold block">深度文字諮詢</span>
                      <span className="text-[10px] text-[#7A7D73]">非同步沉澱思考</span>
                    </button>
                  </div>
                </div>

                {/* Available Slot Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-2">
                    選擇可預約時段（時區：Asia/Taipei）
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {coach.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedSlot === slot
                            ? 'bg-[#2C3324] text-white border-[#2C3324] shadow-xs'
                            : 'bg-white border-[#E8E6E0] text-[#5A6352] hover:bg-[#F9F8F4]'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consultation Note */}
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-1.5">
                    你想在這次諮詢中討論的主題或目標（選填，完全保密）
                  </label>
                  <textarea
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    placeholder="例如：近期在職場上遇到瓶頸，常感到焦慮與過度思考，希望能學會建立情緒界線..."
                    rows={2}
                    className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] resize-none placeholder:text-[#8C8F85]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-[#7A7D73]">
                    <span className="text-[#2C3324] font-bold">線上照護專案涵蓋</span> · 無需額外費用
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 active:scale-98 cursor-pointer"
                  >
                    確認預約諮詢
                  </button>
                </div>
              </form>
            ) : (
              /* Booking Success Confirmation */
              <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#E9F0E8] text-[#8BA888] flex items-center justify-center mx-auto shadow-xs border border-[#C9D6C8]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#2C3324]">預約已成功確認！</h3>
                  <p className="text-xs text-[#7A7D73] max-w-md mx-auto">
                    我們已將會議連結與行事曆邀請發送至你的信箱。
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#E9F0E8] border border-[#C9D6C8] text-xs text-[#2C3324] text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#5A6352]">專業教練：</span>
                    <span className="font-bold">{coach.name} ({coach.roleLabel})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A6352]">預約時段：</span>
                    <span className="font-bold text-[#2C3324]">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A6352]">諮詢方式：</span>
                    <span className="font-bold">
                      {consultType === 'video' ? '1對1 線上視訊' : consultType === 'audio' ? '語音通話' : '深度文字諮詢'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  好的，返回平台
                </button>
              </div>
            )
          ) : (
            /* Live Interactive Text Coaching Chat */
            <div className="flex flex-col h-[480px]">
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F9F8F4]">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 max-w-[80%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    {msg.sender === 'coach' && (
                      <img
                        src={coach.avatar}
                        alt={coach.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-[#E8E6E0]"
                      />
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#2C3324] text-white rounded-tr-xs'
                          : 'bg-white border border-[#E8E6E0] text-[#3D4035] rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[10px] block mt-1 text-right ${
                        msg.sender === 'user' ? 'text-[#C9D6C8]' : 'text-[#7A7D73]'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isCoachTyping && (
                  <div className="flex items-center gap-2 text-xs text-[#7A7D73] italic">
                    <img
                      src={coach.avatar}
                      alt={coach.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{coach.name} 正在輸入支持回覆...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E8E6E0] bg-[#FDFCF8] flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="輸入你想和教練討論的心情或問題..."
                  className="flex-1 text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] placeholder:text-[#8C8F85]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white disabled:bg-[#E8E6E0] disabled:text-[#8C8F85] transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
