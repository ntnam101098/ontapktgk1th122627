import React, { useState } from 'react';
import { BookOpen, User, School, Clock, FileSpreadsheet, CheckCircle2, ChevronRight, Lock, ShieldCheck, LogOut, Info } from 'lucide-react';
import { MULTIPLE_CHOICE_QUESTIONS, TRUE_FALSE_QUESTIONS, ESSAY_QUESTIONS } from '../data/examData';

interface WelcomeScreenProps {
  onStartExam: (name: string, studentClass: string, isTimed: boolean, initialSection?: 'all' | 'part1' | 'part2' | 'part3') => void;
  onOpenTeacherStats: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: (intendedAction?: string) => void;
  onLogoutAdmin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStartExam, 
  onOpenTeacherStats,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin
}) => {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [isTimed, setIsTimed] = useState(true);
  const [selectedSection, setSelectedSection] = useState<'all' | 'part1' | 'part2' | 'part3'>('all');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    const finalClass = studentClass.trim().toUpperCase();

    if (!finalName) {
      setErrorMessage('Vui lòng nhập Họ và tên của học sinh!');
      return;
    }
    if (!finalClass) {
      setErrorMessage('Vui lòng nhập Lớp của học sinh!');
      return;
    }

    setErrorMessage('');
    onStartExam(finalName, finalClass, isTimed, selectedSection);
  };

  const handleTeacherStatsClick = () => {
    if (isAdmin) {
      onOpenTeacherStats();
    } else {
      onOpenAdminLogin('xem Bảng thống kê & Xuất Excel');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-[#005A9C] flex items-center justify-center shadow-md shadow-[#005A9C]/20 shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#005A9C]">
              ÔN TẬP KTGK1 - MÔN TIN HỌC 12
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Chương trình GDPT mới 2018 • Đề cương Kiểm tra Giữa Học kỳ 1 (2026 - 2027)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FFF275]/50 border border-[#FFD147] text-amber-950 text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Admin (vvdtntbt)</span>
              </span>
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shadow-sm"
                title="Đăng xuất Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAdminLogin('đăng nhập quản trị viên')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-[#005A9C] transition-all text-xs font-semibold cursor-pointer shadow-sm"
              title="Đăng nhập dành cho Giáo viên / Admin"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Đăng nhập Admin</span>
            </button>
          )}

          <button
            onClick={handleTeacherStatsClick}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-[#005A9C] transition-all text-xs sm:text-sm font-semibold shadow-sm cursor-pointer"
            title={isAdmin ? "Xem danh sách bài nộp và tải file Excel" : "Chức năng dành cho Admin"}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Thống kê & Xuất Excel</span>
            {!isAdmin && <Lock className="w-3 h-3 text-amber-600 ml-1" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Info & Outline summary */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#80C8F8]/20 border border-[#80C8F8]/60 text-[#005A9C] text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#005A9C]"></span>
            <span>Hệ thống Ôn tập & Kiểm tra Chuẩn hoá</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">
              Củng cố kiến thức, tự tin bứt phá <span className="text-[#005A9C]">điểm 10 Giữa kỳ 1</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Ứng dụng ôn luyện bám sát 100% nội dung Đề cương kiểm tra giữa học kỳ 1 môn Tin học 12, bao gồm đầy đủ 3 dạng thức trắc nghiệm và tự luận mới nhất của Bộ GD&ĐT.
            </p>
          </div>

          {/* 3 Core Components Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#80C8F8] transition-all">
              <div className="text-2xl font-black text-[#005A9C]">{MULTIPLE_CHOICE_QUESTIONS.length} Câu</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Phần I: Trắc nghiệm</div>
              <div className="text-xs text-slate-500 mt-0.5">4 lựa chọn (A, B, C, D)</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#80C8F8] transition-all">
              <div className="text-2xl font-black text-[#005A9C]">{TRUE_FALSE_QUESTIONS.length} Bài (24 ý)</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Phần II: Đúng / Sai</div>
              <div className="text-xs text-slate-500 mt-0.5">Tính điểm theo quy chế mới</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#80C8F8] transition-all">
              <div className="text-2xl font-black text-[#005A9C]">{ESSAY_QUESTIONS.length} Tình huống</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Phần III: Tự luận</div>
              <div className="text-xs text-slate-500 mt-0.5">Kèm đáp án & gợi ý chi tiết</div>
            </div>
          </div>

          {/* Highlight Callout Card (Accent Light #FFF275) */}
          <div className="p-4 rounded-2xl bg-[#FFF275]/35 border border-[#FFD147] text-slate-800 text-xs sm:text-sm leading-relaxed flex items-start space-x-3 shadow-sm">
            <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 font-bold block mb-0.5">Tính năng nổi bật cho Học sinh:</strong>
              Hỗ trợ đảo ngẫu nhiên câu hỏi & phương án để luyện phản xạ; tự động chấm điểm và hiển thị giải thích chi tiết ngay sau khi nộp bài.
            </div>
          </div>

          {/* Topics covered list */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Nội dung 7 bài học trọng tâm:</div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/15 border border-[#80C8F8]/40 text-[#005A9C] font-medium">Bài 1: Làm quen với AI</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/15 border border-[#80C8F8]/40 text-[#005A9C] font-medium">Bài 2: AI trong khoa học & đời sống</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/15 border border-[#80C8F8]/40 text-[#005A9C] font-medium">Bài 3: Thiết bị mạng thông dụng</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/15 border border-[#80C8F8]/40 text-[#005A9C] font-medium">Bài 4: Giao thức TCP/IP</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/15 border border-[#80C8F8]/40 text-[#005A9C] font-medium">Bài 5: Chia sẻ tài nguyên LAN</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/15 border border-[#80C8F8]/40 text-[#005A9C] font-medium">Bài 6: Giao tiếp & ứng xử trên mạng</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/15 border border-[#80C8F8]/40 text-[#005A9C] font-medium">Bài 7: HTML & cấu trúc web</span>
            </div>
          </div>
        </div>

        {/* Right Col: Student Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50">
            <div className="flex items-center space-x-3 pb-5 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-[#005A9C]/10 border border-[#005A9C]/20 flex items-center justify-center text-[#005A9C] font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Thông tin thí sinh</h3>
                <p className="text-xs text-slate-500">Nhập họ tên và lớp để bắt đầu làm bài</p>
              </div>
            </div>

            <form onSubmit={handleStart} className="space-y-4 pt-5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Họ và tên học sinh <span className="text-rose-500">*</span></span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#80C8F8] focus:border-[#005A9C] focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Class Textbox */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Lớp học <span className="text-rose-500">*</span></span>
                </label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="Nhập lớp của em (ví dụ: 12A1, 12A2, 12 Tin...)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#80C8F8] focus:border-[#005A9C] focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Mode Options */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700">Chế độ làm bài</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setIsTimed(true)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isTimed
                        ? 'bg-[#80C8F8]/15 border-[#005A9C] text-slate-900 ring-1 ring-[#005A9C]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#005A9C]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Thi thử (45 phút)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Đếm ngược thời gian, mô phỏng như thi thật.
                    </p>
                  </div>

                  <div
                    onClick={() => setIsTimed(false)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      !isTimed
                        ? 'bg-[#80C8F8]/15 border-[#005A9C] text-slate-900 ring-1 ring-[#005A9C]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#005A9C]">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ôn tập tự do</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Không giới hạn giờ, thoải mái suy nghĩ.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scope Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700">Phần muốn làm:</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#80C8F8] focus:bg-white cursor-pointer font-medium"
                >
                  <option value="all">Toàn bộ 3 phần (Chuẩn đề thi 100%)</option>
                  <option value="part1">Chỉ Phần I: 30 câu trắc nghiệm 4 lựa chọn</option>
                  <option value="part2">Chỉ Phần II: 6 bài trắc nghiệm Đúng/Sai</option>
                  <option value="part3">Chỉ Phần III: 6 tình huống Tự luận</option>
                </select>
              </div>

              {/* Submit CTA Button: Màu điểm nhấn 2 #FFD147 */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 bg-[#FFD147] hover:bg-[#f6c63b] text-slate-900 font-extrabold rounded-xl shadow-md hover:shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] cursor-pointer"
              >
                <span>Bắt đầu ôn tập & làm bài</span>
                <ChevronRight className="w-5 h-5 text-slate-900" />
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-500">
                Sau khi nộp bài, hệ thống sẽ tự động chấm điểm, hiển thị nhận xét và giải thích chi tiết từng câu.
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div>Hệ thống ôn thi Tin học 12 theo đề cương kiểm tra giữa học kỳ 1</div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Có lưu điểm & xuất file Excel</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>Thang điểm 10 chuẩn GDPT</span>
        </div>
      </footer>
    </div>
  );
};
