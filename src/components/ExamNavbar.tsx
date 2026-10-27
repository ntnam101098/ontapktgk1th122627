import React from 'react';
import { Clock, Send, FileSpreadsheet, User, ArrowLeft } from 'lucide-react';

interface ExamNavbarProps {
  studentName: string;
  studentClass: string;
  activeTab: 'part1' | 'part2' | 'part3';
  onTabChange: (tab: 'part1' | 'part2' | 'part3') => void;
  isTimed: boolean;
  timeLeftSeconds: number;
  totalAnsweredCount: number;
  totalQuestionsCount: number;
  onSubmitExam: () => void;
  onOpenTeacherStats: () => void;
  onExitToHome: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: (intendedAction?: string) => void;
}

export const ExamNavbar: React.FC<ExamNavbarProps> = ({
  studentName,
  studentClass,
  activeTab,
  onTabChange,
  isTimed,
  timeLeftSeconds,
  totalAnsweredCount,
  totalQuestionsCount,
  onSubmitExam,
  onOpenTeacherStats,
  onExitToHome,
  isAdmin,
  onOpenAdminLogin
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = isTimed && timeLeftSeconds <= 300; // < 5 mins

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Brand & Student Info */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={onExitToHome}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              title="Quay lại màn hình chính"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm sm:text-base text-[#005A9C] tracking-tight">
                  ÔN TẬP KTGK1 - MÔN TIN HỌC 12
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#80C8F8]/20 text-[#005A9C] border border-[#80C8F8]/50">
                  {studentClass}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                <User className="w-3.5 h-3.5 text-[#005A9C]" />
                <span className="font-semibold text-slate-800">{studentName}</span>
                <span>•</span>
                <span>Tiến độ: <strong className="text-[#005A9C] font-bold">{totalAnsweredCount}/{totalQuestionsCount}</strong> câu</span>
              </div>
            </div>

            {/* Mobile Timer */}
            {isTimed && (
              <div className={`md:hidden px-3 py-1 rounded-lg font-mono font-bold text-xs flex items-center space-x-1.5 border ${
                isTimeCritical 
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}
          </div>

          {/* Center: Tabs Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => onTabChange('part1')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'part1'
                  ? 'bg-[#005A9C] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Phần I: TN 4 Lựa chọn (30 câu)
            </button>

            <button
              onClick={() => onTabChange('part2')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'part2'
                  ? 'bg-[#005A9C] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Phần II: Đúng / Sai (6 câu)
            </button>

            <button
              onClick={() => onTabChange('part3')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'part3'
                  ? 'bg-[#005A9C] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Phần III: Tự luận (6 câu)
            </button>
          </div>

          {/* Right: Timer & Submit Action */}
          <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
            {isTimed && (
              <div className={`hidden md:flex px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm items-center space-x-2 border ${
                isTimeCritical
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <Clock className="w-4 h-4 text-amber-700" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => {
                if (isAdmin) {
                  onOpenTeacherStats();
                } else {
                  onOpenAdminLogin('xem Bảng thống kê cả lớp');
                }
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer relative shadow-sm"
              title={isAdmin ? "Bảng thống kê kết quả" : "Thống kê (Yêu cầu quyền Admin)"}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </button>

            {/* Primary CTA Button: Màu điểm nhấn 2 #FFD147 */}
            <button
              onClick={onSubmitExam}
              className="px-4 py-2 rounded-xl bg-[#FFD147] hover:bg-[#f6c63b] text-slate-900 font-extrabold text-xs sm:text-sm flex items-center space-x-1.5 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-900" />
              <span>Nộp bài</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
