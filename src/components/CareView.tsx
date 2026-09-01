import React, { useState } from 'react';
import { 
  Star, 
  Award, 
  ShieldCheck, 
  Calendar, 
  MessageSquare, 
  Clock, 
  Globe2, 
  Search, 
  UserPlus,
  Trash2,
  Sparkles,
  X,
  CheckCircle2,
  Users,
  HeartHandshake
} from 'lucide-react';
import { Coach, Language } from '../types';
import { DEFAULT_CARE_CONSULTANT } from '../data/mockData';
import { analytics } from '../utils/analytics';

interface CareViewProps {
  lang: Language;
  coaches: Coach[];
  onOpenCoach: (coach: Coach, mode?: 'book' | 'chat') => void;
  onAddCoach: (coach: Coach) => void;
  onDeleteCoach: (id: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594824813626-d368b63a9ebf?w=400&auto=format&fit=crop&q=80',
];

export const CareView: React.FC<CareViewProps> = ({
  lang,
  coaches,
  onOpenCoach,
  onAddCoach,
  onDeleteCoach,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form states for adding a new coach
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<'clinical-psychologist' | 'behavioral-coach' | 'counsellor'>('clinical-psychologist');
  const [newAvatar, setNewAvatar] = useState(PRESET_AVATARS[0]);
  const [newSpecialties, setNewSpecialties] = useState('情緒調節, 職場壓力, 焦慮緩解');
  const [newBio, setNewBio] = useState('');
  const [newYears, setNewYears] = useState('8');
  const [newEducation, setNewEducation] = useState('心理學碩士 / 國家合格心理諮商師執照');
  const [newLanguages, setNewLanguages] = useState('國語/普通話, English');
  const [newSlots, setNewSlots] = useState('今天 15:00, 明天 10:00, 明天 14:00, 週五 16:00');

  const roles = [
    { id: 'all', label: '全體心理專家' },
    { id: 'clinical-psychologist', label: '臨床心理師 (Psychologist)' },
    { id: 'behavioral-coach', label: '行為健康教練 (Coach)' },
    { id: 'counsellor', label: '諮商心理師 (Counsellor)' },
  ];

  const getRoleLabel = (r: 'clinical-psychologist' | 'behavioral-coach' | 'counsellor') => {
    switch (r) {
      case 'clinical-psychologist':
        return '臨床心理師';
      case 'behavioral-coach':
        return '行為健康教練';
      case 'counsellor':
        return '諮商心理師';
      default:
        return '心理專家';
    }
  };

  const filteredCoaches = coaches.filter((c) => {
    const roleMatches = selectedRole === 'all' || c.role === selectedRole;
    const searchMatches = searchKeyword === '' || 
      c.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      c.bio.toLowerCase().includes(searchKeyword.toLowerCase());
    return roleMatches && searchMatches;
  });

  const handleCreateCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: Coach = {
      id: `coach-${Date.now()}`,
      name: newName.trim(),
      title: newTitle.trim() || '專業心理健康顧問',
      role: newRole,
      roleLabel: getRoleLabel(newRole),
      avatar: newAvatar,
      rating: 4.95,
      reviewCount: 50 + Math.floor(Math.random() * 200),
      languages: newLanguages.split(',').map((s) => s.trim()).filter(Boolean),
      specialties: newSpecialties.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      bio: newBio.trim() || '致力於為每位學員提供安全、包容且具備實證科學依據的心理陪伴與支持。',
      yearsExperience: parseInt(newYears, 10) || 5,
      education: newEducation.trim() || '心理諮商相關研究所碩士',
      availableSlots: newSlots.split(',').map((s) => s.trim()).filter(Boolean),
    };

    onAddCoach(created);
    setIsAddModalOpen(false);

    // Reset form
    setNewName('');
    setNewTitle('');
    setNewBio('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3324] bg-[#E9F0E8] border border-[#C9D6C8] px-2.5 py-0.5 rounded-full">
              1對1 尊享個人化照護
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3324] tracking-tight">
            心理教練與臨床諮商師 (Care & Coaching)
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6352] mt-1 max-w-2xl">
            提供即時文字諮詢與深度預約諮詢。支援自由新增心理顧問與諮商專家，隨時啟動溫暖、隱私且具實證依據的身心陪伴。
          </p>
        </div>

        {/* Action Button: Add New Coach */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2C3324] hover:bg-[#3D4733] text-white text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#C9D6C8]" />
            <span>新增心理師 / 教練</span>
          </button>
        </div>
      </div>

      {/* Quick Direct Consultation Gateway Bar */}
      <div className="p-5 rounded-3xl bg-[#F9F8F4] border border-[#E8E6E0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5 text-[#8BA888]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2C3324]">即時心理支援通道（保留文字諮詢與預約功能）</h3>
            <p className="text-xs text-[#7A7D73]">隨時開啟 1對1 文字交談或預約安排專屬時段</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onOpenCoach(coaches[0] || DEFAULT_CARE_CONSULTANT, 'chat')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F5EF] text-[#2C3324] border border-[#E8E6E0] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-[#8BA888]" />
            <span>即時文字諮詢</span>
          </button>
          <button
            onClick={() => onOpenCoach(coaches[0] || DEFAULT_CARE_CONSULTANT, 'book')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>預約諮詢時段</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#2C3324] text-white shadow-xs ring-2 ring-[#2C3324]/20'
                    : 'bg-white text-[#5A6352] border border-[#E8E6E0] hover:border-[#8BA888] hover:bg-[#F9F8F4] hover:text-[#2C3324]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#8C8F85] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜尋專長或姓名（如：焦慮、職場）..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#E8E6E0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] placeholder:text-[#8C8F85] text-[#3D4035]"
          />
        </div>
      </div>

      {/* Coach Cards or Empty State */}
      {filteredCoaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-white rounded-3xl border border-[#E8E6E0] shadow-xs hover:border-[#8BA888] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between p-6 space-y-5 relative group"
            >
              {/* Delete quick action */}
              <button
                onClick={() => onDeleteCoach(coach.id)}
                title="刪除此專家"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8C8F85] hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E8E6E0] shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1 pr-6">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-[#2C3324] truncate">
                        {coach.name}
                      </h3>
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8]">
                      {coach.roleLabel}
                    </span>
                    <p className="text-xs text-[#7A7D73] truncate mt-1">{coach.title}</p>
                  </div>
                </div>

                {/* Rating & Exp */}
                <div className="flex items-center justify-between text-xs py-2 px-3 bg-[#FDFCF8] border border-[#E8E6E0] rounded-xl">
                  <span className="flex items-center gap-1 font-bold text-[#C88A58]">
                    <Star className="w-3.5 h-3.5 fill-[#C88A58] text-[#C88A58]" />
                    {coach.rating} ({coach.reviewCount} 則好評)
                  </span>
                  <span className="text-[#5A6352] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#8BA888]" />
                    {coach.yearsExperience} 年經驗
                  </span>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-1.5 text-xs text-[#7A7D73]">
                  <Globe2 className="w-3.5 h-3.5 text-[#8C8F85] shrink-0" />
                  <span className="line-clamp-1">{coach.languages.join(' · ')}</span>
                </div>

                {/* Bio */}
                <p className="text-xs text-[#5A6352] line-clamp-3 leading-relaxed">
                  {coach.bio}
                </p>

                {/* Specialties */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-[#2C3324]">擅長領域：</p>
                  <div className="flex flex-wrap gap-1.5">
                    {coach.specialties.map((sp, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F5EF] text-[#5A6352] font-medium border border-[#E8E6E0]">
                        #{sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions: Text Consultation & Booking */}
              <div className="pt-3 border-t border-[#E8E6E0] flex items-center gap-2">
                <button
                  onClick={() => {
                    analytics.track('referral_click', { coachName: coach.name, mode: 'chat', from: 'care_view' });
                    onOpenCoach(coach, 'chat');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#F1F5EF] hover:bg-[#E9F0E8] text-[#3D4035] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#7A7D73]" />
                  <span>文字諮詢</span>
                </button>
                <button
                  onClick={() => {
                    analytics.track('referral_click', { coachName: coach.name, mode: 'book', from: 'care_view' });
                    onOpenCoach(coach, 'book');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>預約諮詢</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E8E6E0] p-10 text-center space-y-6 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#E9F0E8] text-[#2C3324] border border-[#C9D6C8] flex items-center justify-center mx-auto shadow-xs">
            <Users className="w-8 h-8 text-[#8BA888]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#2C3324]">專家名單已清空，隨時可加入新人員</h3>
            <p className="text-xs text-[#7A7D73] leading-relaxed max-w-md mx-auto">
              原本的示範資料已清除完畢。文字諮詢與預約諮詢功能均完整保留，你可以立即新增新的臨床心理師、行為健康教練或諮商師。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2C3324] hover:bg-[#3D4733] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-[#C9D6C8]" />
              <span>新增第一位心理專家/教練</span>
            </button>
            <button
              onClick={() => onOpenCoach(DEFAULT_CARE_CONSULTANT, 'chat')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>開啟即時文字諮詢</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add New Coach / Specialist */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2C3324]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] text-[#3D4035] w-full max-w-xl rounded-3xl border border-[#E8E6E0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#E8E6E0] flex items-center justify-between bg-[#F9F8F4]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#E9F0E8] text-[#2C3324] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4 text-[#8BA888]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2C3324]">新增專業心理師 / 健康教練</h3>
                  <p className="text-xs text-[#7A7D73]">填寫基本資料，將新專家加入照護名單中</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-[#7A7D73] hover:text-[#2C3324] hover:bg-[#F1F5EF] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoach} className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#2C3324] mb-1.5">身份角色分類</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('clinical-psychologist')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      newRole === 'clinical-psychologist'
                        ? 'bg-[#2C3324] text-white border-[#2C3324]'
                        : 'bg-white text-[#5A6352] border-[#E8E6E0]'
                    }`}
                  >
                    臨床心理師
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('behavioral-coach')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      newRole === 'behavioral-coach'
                        ? 'bg-[#2C3324] text-white border-[#2C3324]'
                        : 'bg-white text-[#5A6352] border-[#E8E6E0]'
                    }`}
                  >
                    行為健康教練
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('counsellor')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      newRole === 'counsellor'
                        ? 'bg-[#2C3324] text-white border-[#2C3324]'
                        : 'bg-white text-[#5A6352] border-[#E8E6E0]'
                    }`}
                  >
                    諮商心理師
                  </button>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-1">專家姓名 *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="例如：張雅涵 心理師"
                    className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-1">專業頭銜 / 認證</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="例如：資深臨床心理師 / CBT認證督導"
                    className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-[#2C3324] mb-1.5">頭像照片</label>
                <div className="flex items-center gap-3">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewAvatar(av)}
                      className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        newAvatar === av ? 'border-[#8BA888] ring-2 ring-[#8BA888]/30 scale-105' : 'border-[#E8E6E0] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-xs font-bold text-[#2C3324] mb-1">專長領域（以逗號分隔）</label>
                <input
                  type="text"
                  value={newSpecialties}
                  onChange={(e) => setNewSpecialties(e.target.value)}
                  placeholder="例如：情緒調節, 職場倦怠, 焦慮緩解, 睡眠改善"
                  className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888]"
                />
              </div>

              {/* Experience & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-1">資歷年數</label>
                  <input
                    type="number"
                    value={newYears}
                    onChange={(e) => setNewYears(e.target.value)}
                    placeholder="8"
                    className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2C3324] mb-1">學歷 / 認證機構</label>
                  <input
                    type="text"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    placeholder="例如：心理研究所碩士"
                    className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <label className="block text-xs font-bold text-[#2C3324] mb-1">可預約時段（以逗號分隔）</label>
                <input
                  type="text"
                  value={newSlots}
                  onChange={(e) => setNewSlots(e.target.value)}
                  placeholder="今天 15:00, 明天 10:00, 明天 14:00, 週五 16:00"
                  className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888]"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-[#2C3324] mb-1">個人簡介與諮商風格</label>
                <textarea
                  rows={2}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="簡要描述其專業背景、心理學派別與諮商理念..."
                  className="w-full text-xs text-[#3D4035] bg-white border border-[#E8E6E0] rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8BA888] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E6E0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A6352] hover:bg-[#E8E6E0] transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#759672] text-white text-xs font-bold transition-all shadow-md shadow-[#8BA888]/20 cursor-pointer"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
