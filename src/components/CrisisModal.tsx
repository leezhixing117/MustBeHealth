import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  Heart, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { CRISIS_RESOURCES } from '../data/mockData';

interface CrisisModalProps {
  onClose: () => void;
  onStartBreathe: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  onClose,
  onStartBreathe,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('全部地區');

  const regions = ['全部地區', '台灣 (Taiwan)', '香港 (Hong Kong)', '新加坡 (Singapore)', '馬來西亞 (Malaysia)', '中國內地 (Mainland China)'];

  const filteredResources = selectedRegion === '全部地區'
    ? CRISIS_RESOURCES
    : CRISIS_RESOURCES.filter((r) => r.region.includes(selectedRegion.split(' ')[0]));

  return (
    <div className="fixed inset-0 z-50 bg-[#2C3324]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] text-[#3D4035] w-full max-w-2xl rounded-3xl border border-[#E8E6E0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Urgent Header */}
        <div className="p-6 bg-[#9C4141] text-[#FDFCF8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <LifeBuoy className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">24/7 心理危機與緊急求助支援</h3>
              <p className="text-xs text-[#F8E7E5]">如果你或身邊的人正處於痛苦或危急狀態，請記住你絕非孤單一人。</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#F8E7E5] hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Immediate Safe Action Banner */}
        <div className="p-4 bg-[#FBF0EE] border-b border-[#F2D6D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#782828]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#9C4141] shrink-0" />
            <span>若有立即的生命安全危險，請立刻撥打當地的緊急救援電話（如 110 / 119 / 999 / 911）。</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onStartBreathe();
            }}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#9C4141] text-white font-bold hover:bg-[#853434] transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            立即啟動呼吸平靜
          </button>
        </div>

        {/* Region Filter (Multi-Row Full Glance) */}
        <div className="p-3 bg-[#F9F8F4] border-b border-[#E8E6E0] flex flex-wrap items-center gap-1.5">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-[#2C3324] text-white shadow-xs'
                  : 'bg-white text-[#5A6352] border border-[#E8E6E0] hover:bg-[#F1F5EF]'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Helpline Directory List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {filteredResources.map((res, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-[#E8E6E0] hover:border-[#8BA888] hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5EF] text-[#5A6352] border border-[#E8E6E0]">
                    {res.region}
                  </span>
                  <span className="text-xs text-[#7A7D73] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {res.availableHours}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#2C3324]">{res.name}</h4>
                <p className="text-xs text-[#5A6352] leading-relaxed">{res.note}</p>
              </div>

              <a
                href={`tel:${res.phone.replace(/\s+/g, '')}`}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#FBF0EE] hover:bg-[#F6DFDC] text-[#9C4141] border border-[#F2D6D3] text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>撥打 {res.phone}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E6E0] bg-[#F9F8F4] text-center text-xs text-[#7A7D73]">
          醫定要健康 全體團隊關心您的身心安全 · 所有專線皆受各專業機構嚴格隱私保護
        </div>
      </div>
    </div>
  );
};
