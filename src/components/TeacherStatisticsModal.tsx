import React, { useState } from 'react';
import { 
  X, FileSpreadsheet, Search, Filter, Trash2, RotateCcw, 
  TrendingUp, Award, Users, Download, Eye, ChevronRight,
  Copy, Check, FileText, Printer, AlertTriangle, Sparkles, RefreshCw
} from 'lucide-react';
import { StudentSubmission } from '../data/examData';
import { 
  exportSubmissionsToExcel, 
  exportSubmissionsToCSV, 
  copySubmissionsToClipboard, 
  exportSingleStudentToExcel 
} from '../utils/excelExport';

interface TeacherStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: StudentSubmission[];
  onClearSubmissions: () => void | Promise<void>;
  onResetMockSubmissions: () => void | Promise<void>;
  onViewStudentSubmission: (sub: StudentSubmission) => void;
  onRefreshSubmissions?: () => void | Promise<void>;
}

export const TeacherStatisticsModal: React.FC<TeacherStatisticsModalProps> = ({
  isOpen,
  onClose,
  submissions,
  onClearSubmissions,
  onResetMockSubmissions,
  onViewStudentSubmission,
  onRefreshSubmissions
}) => {
  const [searchName, setSearchName] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('Tất cả');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  // Distinct classes list from actual data
  const classesList = ['Tất cả', ...Array.from(new Set(submissions.map(s => s.studentClass))).filter(Boolean)];

  // Filter submissions based on search and selected class
  const filteredSubmissions = submissions.filter(s => {
    const matchName = s.studentName.toLowerCase().includes(searchName.toLowerCase().trim());
    const matchClass = selectedClass === 'Tất cả' || s.studentClass.toUpperCase() === selectedClass.toUpperCase();
    return matchName && matchClass;
  });

  // Analytics calculation
  const totalCount = filteredSubmissions.length;
  let avgScore = 0;
  let maxScore = 0;
  let minScore = 0;
  let xuatSacCount = 0;
  let gioiCount = 0;
  let khaCount = 0;
  let trungBinhCount = 0;
  let yeuCount = 0;

  if (totalCount > 0) {
    const scores = filteredSubmissions.map(s => s.totalScore);
    avgScore = scores.reduce((a, b) => a + b, 0) / totalCount;
    maxScore = Math.max(...scores);
    minScore = Math.min(...scores);
    xuatSacCount = filteredSubmissions.filter(s => s.gradeClassification === 'Xuất sắc').length;
    gioiCount = filteredSubmissions.filter(s => s.gradeClassification === 'Giỏi').length;
    khaCount = filteredSubmissions.filter(s => s.gradeClassification === 'Khá').length;
    trungBinhCount = filteredSubmissions.filter(s => s.gradeClassification === 'Trung bình').length;
    yeuCount = filteredSubmissions.filter(s => s.gradeClassification === 'Cần cố gắng').length;
  }

  // 1. Export Excel (.xlsx) of current displayed list
  const handleExportExcel = () => {
    if (filteredSubmissions.length === 0) {
      setFeedbackMessage({ text: 'Danh sách hiện tại đang trống, không có dữ liệu để xuất!', type: 'error' });
      return;
    }
    const filterDesc = selectedClass === 'Tất cả' ? (searchName ? `Tim_${searchName}` : 'TatCa') : selectedClass;
    const { success, fileName } = exportSubmissionsToExcel(filteredSubmissions, filterDesc);
    if (success) {
      setFeedbackMessage({ 
        text: `Đã xuất thành công ${filteredSubmissions.length} bài nộp ra file Excel "${fileName}"!`, 
        type: 'success' 
      });
    } else {
      setFeedbackMessage({ text: 'Có lỗi xảy ra khi tạo file Excel. Hãy thử tính năng "Sao chép bảng"!', type: 'error' });
    }
  };

  // 2. Export CSV (.csv)
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      setFeedbackMessage({ text: 'Danh sách hiện tại đang trống, không có dữ liệu để xuất!', type: 'error' });
      return;
    }
    const filterDesc = selectedClass === 'Tất cả' ? (searchName ? `Tim_${searchName}` : 'TatCa') : selectedClass;
    const { success, fileName } = exportSubmissionsToCSV(filteredSubmissions, filterDesc);
    if (success) {
      setFeedbackMessage({ 
        text: `Đã xuất thành công ${filteredSubmissions.length} bài nộp ra file CSV "${fileName}"!`, 
        type: 'success' 
      });
    } else {
      setFeedbackMessage({ text: 'Có lỗi xảy ra khi tạo file CSV.', type: 'error' });
    }
  };

  // 3. Copy TSV to Clipboard (paste straight into Excel or Google Sheets)
  const handleCopyClipboard = async () => {
    if (filteredSubmissions.length === 0) {
      setFeedbackMessage({ text: 'Danh sách hiện tại đang trống!', type: 'error' });
      return;
    }
    const success = await copySubmissionsToClipboard(filteredSubmissions);
    if (success) {
      setIsCopied(true);
      setFeedbackMessage({ 
        text: `Đã sao chép toàn bộ bảng điểm (${filteredSubmissions.length} học sinh) vào Clipboard! Bạn có thể mở Excel/Google Sheets và nhấn Ctrl+V để dán.`, 
        type: 'success' 
      });
      setTimeout(() => setIsCopied(false), 3000);
    } else {
      setFeedbackMessage({ text: 'Không thể truy cập bộ nhớ tạm của trình duyệt.', type: 'error' });
    }
  };

  const handleRefresh = async () => {
    if (onRefreshSubmissions) {
      setIsRefreshing(true);
      try {
        await onRefreshSubmissions();
        setFeedbackMessage({ text: 'Đã cập nhật dữ liệu bài nộp mới nhất từ máy chủ!', type: 'success' });
      } catch (e) {
        setFeedbackMessage({ text: 'Không thể kết nối máy chủ để cập nhật dữ liệu.', type: 'error' });
      } finally {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  };

  // Confirm delete handler without window.confirm
  const handleConfirmClearAll = async () => {
    await onClearSubmissions();
    setShowConfirmClear(false);
    setFeedbackMessage({ text: 'Đã xóa toàn bộ bài nộp khỏi hệ thống thành công!', type: 'info' });
  };

  const handleResetMock = async () => {
    await onResetMockSubmissions();
    setFeedbackMessage({ text: 'Đã nạp lại dữ liệu bài thi mẫu thành công!', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#005A9C] flex items-center justify-center text-white shadow-md shadow-[#005A9C]/20 shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Bảng Thống kê & Thu thập Dữ liệu Excel
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#80C8F8]/20 text-[#005A9C] font-bold border border-[#80C8F8]/50">
                  Tin học 12
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Lưu tập trung máy chủ</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Lưu trữ tất cả bài làm của học sinh qua mọi thời điểm. Hỗ trợ lọc theo lớp, xem chi tiết và trích xuất bảng điểm Excel đầy đủ.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMessage && (
          <div className={`px-5 py-3 border-b flex items-center justify-between text-xs font-semibold ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedbackMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-[#80C8F8]/20 border-[#80C8F8]/40 text-[#005A9C]'
          }`}>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{feedbackMessage.text}</span>
            </div>
            <button 
              onClick={() => setFeedbackMessage(null)} 
              className="text-slate-400 hover:text-slate-700 ml-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Tổng bài đã nộp</span>
                <Users className="w-4 h-4 text-[#005A9C]" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {totalCount} <span className="text-xs font-normal text-slate-500">học sinh</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Điểm trung bình</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {avgScore.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 10</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Điểm cao nhất</span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {maxScore.toFixed(2)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Điểm thấp nhất</span>
                <Award className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {minScore.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Grade Distribution Bar */}
          {totalCount > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Phân bố xếp loại</span>
                <span className="text-[11px] text-slate-500">
                  XS: {xuatSacCount} • Giỏi: {gioiCount} • Khá: {khaCount} • TB: {trungBinhCount} • Yếu: {yeuCount}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                <div style={{ width: `${(xuatSacCount / totalCount) * 100}%` }} className="bg-emerald-500 h-full" title={`Xuất sắc: ${xuatSacCount}`}></div>
                <div style={{ width: `${(gioiCount / totalCount) * 100}%` }} className="bg-[#005A9C] h-full" title={`Giỏi: ${gioiCount}`}></div>
                <div style={{ width: `${(khaCount / totalCount) * 100}%` }} className="bg-[#FFD147] h-full" title={`Khá: ${khaCount}`}></div>
                <div style={{ width: `${(trungBinhCount / totalCount) * 100}%` }} className="bg-orange-400 h-full" title={`Trung bình: ${trungBinhCount}`}></div>
                <div style={{ width: `${(yeuCount / totalCount) * 100}%` }} className="bg-rose-500 h-full" title={`Cần cố gắng: ${yeuCount}`}></div>
              </div>
            </div>
          )}

          {/* Search, Filter & Multi-Channel Export Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
            <div className="flex flex-1 items-center space-x-2">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Tìm theo tên học sinh..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#80C8F8] focus:border-[#005A9C] focus:bg-white"
                />
              </div>

              {/* Class Filter */}
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#80C8F8] cursor-pointer"
                >
                  {classesList.map(cls => (
                    <option key={cls} value={cls}>Lớp: {cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Primary: Export Excel (.xlsx) - Màu điểm nhấn 2 #FFD147 */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-4 py-2.5 rounded-xl bg-[#FFD147] hover:bg-[#f6c63b] text-slate-900 font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0 active:scale-95"
                title="Tải file Excel .xlsx đầy đủ 2 sheet"
              >
                <Download className="w-4 h-4 text-slate-900" />
                <span>Xuất file Excel thống kê (.xlsx)</span>
              </button>

              {/* Copy to Clipboard (for pasting into Excel/Sheets) */}
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                title="Sao chép toàn bộ bảng điểm để dán trực tiếp vào Excel hoặc Google Sheets"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#005A9C]" />}
                <span>{isCopied ? 'Đã sao chép!' : 'Sao chép bảng'}</span>
              </button>

              {/* CSV Export */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                title="Tải danh sách định dạng CSV mở được trong Excel"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>CSV</span>
              </button>

              {/* Refresh from server */}
              {onRefreshSubmissions && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  title="Tải lại các bài nộp mới nhất từ máy chủ"
                >
                  <RefreshCw className={`w-4 h-4 text-[#005A9C] ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Đang tải...' : 'Làm mới'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Submissions Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">STT</th>
                    <th className="py-3 px-3">Họ và tên</th>
                    <th className="py-3 px-3 w-16">Lớp</th>
                    <th className="py-3 px-3">Thời gian nộp</th>
                    <th className="py-3 px-3 text-right">P.I</th>
                    <th className="py-3 px-3 text-right">P.II</th>
                    <th className="py-3 px-3 text-right">P.III</th>
                    <th className="py-3 px-3 text-right font-black">Tổng điểm</th>
                    <th className="py-3 px-3 text-center">Xếp loại</th>
                    <th className="py-3 px-3 text-center w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                        Chưa có dữ liệu bài nộp nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{sub.studentName}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#80C8F8]/20 text-[#005A9C] border border-[#80C8F8]/40 font-bold text-[10px]">
                            {sub.studentClass}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">{sub.submittedAt}</td>
                        <td className="py-3 px-3 text-right text-[#005A9C] font-semibold">{sub.scorePart1.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right text-indigo-600 font-semibold">{sub.scorePart2.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right text-emerald-600 font-semibold">{sub.scorePart3.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-black text-sm">
                          <span className={`px-2 py-0.5 rounded font-black ${
                            sub.totalScore >= 8.0 ? 'bg-emerald-100 text-emerald-800' : sub.totalScore >= 5.0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.totalScore.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.gradeClassification === 'Xuất sắc'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.gradeClassification === 'Giỏi'
                              ? 'bg-[#80C8F8]/30 text-[#005A9C]'
                              : sub.gradeClassification === 'Khá'
                              ? 'bg-[#FFF275] text-amber-950 border border-[#FFD147]'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.gradeClassification}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onViewStudentSubmission(sub);
                                onClose();
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#80C8F8]/20 text-[#005A9C] hover:text-[#005A9C] transition-colors cursor-pointer border border-slate-200"
                              title="Xem chi tiết bài làm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                exportSingleStudentToExcel(sub);
                                setFeedbackMessage({
                                  text: `Đã xuất bảng điểm cá nhân của "${sub.studentName}" ra Excel!`,
                                  type: 'success'
                                });
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer border border-slate-200"
                              title="Tải Excel cá nhân"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={handleResetMock}
              className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nạp lại bài thi mẫu</span>
            </button>

            <span className="text-slate-300">•</span>

            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              className="text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa tất cả bài nộp</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer transition-colors"
            >
              Đóng bảng
            </button>
          </div>
        </div>

      </div>

      {/* Inline Confirmation for Clear All */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Xóa toàn bộ bài nộp?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hành động này sẽ xóa toàn bộ bài làm của tất cả học sinh đã lưu. Thao tác không thể hoàn tác!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
