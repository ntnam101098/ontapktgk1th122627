import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, RotateCcw, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, 
  HelpCircle, ChevronDown, ChevronUp, Filter, Sparkles, User, School, Clock, 
  BookOpen, Share2, Check, ArrowRight, Download, Lock, ShieldCheck, LogOut
} from 'lucide-react';
import { StudentSubmission, MULTIPLE_CHOICE_QUESTIONS, TRUE_FALSE_QUESTIONS, ESSAY_QUESTIONS } from '../data/examData';
import { ScoreResult, calculateExamScore } from '../utils/scoring';
import { exportSingleStudentToExcel } from '../utils/excelExport';

interface ResultScreenProps {
  submission: StudentSubmission;
  scoreResult: ScoreResult;
  onRetake: () => void;
  onOpenTeacherStats: () => void;
  onUpdateSubmissionScore: (newScoreResult: ScoreResult, selfGrading: Record<string, number>) => void;
  isAdmin: boolean;
  onOpenAdminLogin: (intendedAction?: string, callback?: () => void) => void;
  onLogoutAdmin: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  submission,
  scoreResult,
  onRetake,
  onOpenTeacherStats,
  onUpdateSubmissionScore,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'part1' | 'part2' | 'part3'>('all');
  const [selfGrading, setSelfGrading] = useState<Record<string, number>>(submission.selfGradingPart3 || {});

  useEffect(() => {
    // Fire confetti if student scored >= 8.0
    if (scoreResult.totalScore >= 8.0) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if not supported
      }
    }
  }, [scoreResult.totalScore]);

  const handleSelfGradeChange = (questionId: number, itemId: string, score: number) => {
    const key = `${questionId}_${itemId}`;
    const updated = { ...selfGrading, [key]: score };
    setSelfGrading(updated);

    // Recalculate score
    const newScoreResult = calculateExamScore(
      submission.answersPart1,
      submission.answersPart2,
      submission.answersPart3,
      updated
    );
    onUpdateSubmissionScore(newScoreResult, updated);
  };

  const handleExportExcel = () => {
    if (isAdmin) {
      exportSingleStudentToExcel(submission);
    } else {
      onOpenAdminLogin('xuất kết quả ra file Excel', () => {
        exportSingleStudentToExcel(submission);
      });
    }
  };

  const handleStatsClick = () => {
    if (isAdmin) {
      onOpenTeacherStats();
    } else {
      onOpenAdminLogin('xem Thống kê cả lớp', onOpenTeacherStats);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã hoàn thành bài kiểm tra</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#005A9C] tracking-tight">
              KẾT QUẢ ÔN TẬP KTGK1 - MÔN TIN HỌC 12
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 mt-1">
              <span className="flex items-center space-x-1.5 text-slate-800">
                <User className="w-3.5 h-3.5 text-[#005A9C]" />
                <strong className="font-semibold">{submission.studentName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-800">
                <School className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Lớp: <strong className="px-1.5 py-0.5 rounded bg-[#80C8F8]/20 text-[#005A9C]">{submission.studentClass}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Nộp lúc: {submission.submittedAt} ({Math.round(submission.timeSpentSeconds / 60)} phút)</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {isAdmin ? (
              <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#FFF275]/50 border border-[#FFD147] text-amber-950 text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Admin (vvdtntbt)</span>
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  className="ml-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAdminLogin('đăng nhập quản trị viên')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Đăng nhập Admin</span>
              </button>
            )}

            <button
              onClick={handleExportExcel}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-[#005A9C] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
              title={isAdmin ? "Xuất kết quả bài làm ra file Excel" : "Chức năng chỉ dành cho Admin"}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Xuất kết quả Excel (.xlsx)</span>
              {!isAdmin && <Lock className="w-3.5 h-3.5 text-amber-600 ml-0.5" />}
            </button>

            <button
              onClick={onRetake}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Làm lại</span>
            </button>
          </div>
        </div>

        {/* Score Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Big Score Card */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-1">
                TỔNG ĐIỂM ĐẠT ĐƯỢC
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-5xl sm:text-6xl font-black text-[#005A9C]">
                  {scoreResult.totalScore.toFixed(2)}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-400">/ 10.0</span>
              </div>

              <div className={`mt-3 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide border shadow-sm ${
                scoreResult.gradeClassification === 'Xuất sắc'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : scoreResult.gradeClassification === 'Giỏi'
                  ? 'bg-[#80C8F8]/30 text-[#005A9C] border-[#80C8F8]'
                  : scoreResult.gradeClassification === 'Khá'
                  ? 'bg-[#FFF275] text-amber-950 border-[#FFD147]'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                Xếp loại: {scoreResult.gradeClassification}
              </div>
            </div>

            {/* Teacher's Feedback & Comments */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center space-x-2 text-[#005A9C] text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Nhận xét và đánh giá năng lực</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-[#FFF275]/25 border border-[#FFD147]/80 text-slate-800 text-sm sm:text-base leading-relaxed">
                {scoreResult.feedback}
              </div>

              {/* 3 Component Parts Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Phần I (TN 4 lựa chọn)</div>
                  <div className="text-lg font-bold text-[#005A9C] mt-0.5">
                    {scoreResult.scorePart1.toFixed(2)} / 4.0 đ
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Đúng {scoreResult.correctPart1Count}/30 câu ({Math.round((scoreResult.correctPart1Count / 30) * 100)}%)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Phần II (Đúng / Sai)</div>
                  <div className="text-lg font-bold text-indigo-700 mt-0.5">
                    {scoreResult.scorePart2.toFixed(2)} / 3.0 đ
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Đúng {scoreResult.correctPart2SubCount}/24 ý ({Math.round((scoreResult.correctPart2SubCount / 24) * 100)}%)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Phần III (Tự luận)</div>
                  <div className="text-lg font-bold text-emerald-700 mt-0.5">
                    {scoreResult.scorePart3.toFixed(2)} / 3.0 đ
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {Object.values(submission.answersPart3).filter(v => v?.trim()).length}/24 ý đã trả lời
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Topic Mastery Progress Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#005A9C]" />
              <span>Mức độ nắm vững theo 7 chuyên đề</span>
            </h3>
            <span className="text-xs text-slate-500">Dựa trên kết quả Phần I</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {scoreResult.topicAnalysis.map((item) => (
              <div key={item.topic} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 truncate pr-2">{item.topic}</span>
                  <span className={`font-bold shrink-0 ${
                    item.percentage >= 80 ? 'text-emerald-700' : item.percentage >= 50 ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {item.correct}/{item.total} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.percentage >= 80 ? 'bg-emerald-500' : item.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Solutions & Explanations Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-[#005A9C]" />
                <span>Đáp án và Giải thích chi tiết</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Xem lại từng câu hỏi, đối chiếu đáp án của em với đáp án chuẩn và lời giải thích chi tiết.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto border border-slate-200">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterMode === 'all' ? 'bg-[#005A9C] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả câu hỏi
              </button>
              <button
                onClick={() => setFilterMode('incorrect')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterMode === 'incorrect' ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chỉ câu làm sai
              </button>
              <button
                onClick={() => setFilterMode('part1')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterMode === 'part1' ? 'bg-[#005A9C] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Phần I (30 câu)
              </button>
              <button
                onClick={() => setFilterMode('part2')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterMode === 'part2' ? 'bg-[#005A9C] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Phần II (Đúng/Sai)
              </button>
              <button
                onClick={() => setFilterMode('part3')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterMode === 'part3' ? 'bg-[#005A9C] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Phần III (Tự luận)
              </button>
            </div>
          </div>

          {/* PART I: MULTIPLE CHOICE REVIEW */}
          {(filterMode === 'all' || filterMode === 'incorrect' || filterMode === 'part1') && (
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-[#005A9C] font-bold text-sm uppercase tracking-wide">
                <span>Phần I: Trắc nghiệm 4 lựa chọn (30 câu)</span>
              </div>

              <div className="space-y-4">
                {MULTIPLE_CHOICE_QUESTIONS.filter(q => {
                  if (filterMode === 'incorrect') {
                    return submission.answersPart1[q.id] !== q.correctAnswer;
                  }
                  return true;
                }).map((q) => {
                  const studentAns = submission.answersPart1[q.id];
                  const isCorrect = studentAns === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'bg-white border-slate-200 shadow-sm'
                          : 'bg-rose-50/50 border-rose-200 shadow-sm'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-[#005A9C] text-white' : 'bg-rose-600 text-white'
                          }`}>
                            {q.id}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{q.topic}</span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {isCorrect ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Chính xác (+{(4.0/30).toFixed(2)}đ)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-1">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>{studentAns ? `Sai (Em chọn: ${studentAns})` : 'Chưa chọn'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question */}
                      <div className="text-slate-900 text-xs sm:text-sm font-semibold mb-3 leading-relaxed break-words">
                        {q.question}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {q.options.map((opt) => {
                          const isStudentPick = studentAns === opt.key;
                          const isKeyCorrect = q.correctAnswer === opt.key;

                          return (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-xl border text-xs font-medium flex items-start space-x-2.5 ${
                                isKeyCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-300 font-bold'
                                  : isStudentPick
                                  ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isKeyCorrect ? 'bg-emerald-600 text-white' : isStudentPick ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {opt.key}
                              </div>
                              <span className="flex-1 leading-relaxed">{opt.text}</span>
                              {isKeyCorrect && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 shrink-0">
                                  Đáp án đúng
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Explanation */}
                      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs leading-relaxed space-y-1">
                        <div className="text-amber-900 font-bold flex items-center space-x-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>GIẢI THÍCH CHI TIẾT:</span>
                        </div>
                        <p className="text-slate-700 pl-5">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PART II: TRUE / FALSE REVIEW */}
          {(filterMode === 'all' || filterMode === 'part2') && (
            <div className="space-y-4 pt-4">
              <div className="inline-flex items-center space-x-2 text-[#005A9C] font-bold text-sm uppercase tracking-wide">
                <span>Phần II: Trắc nghiệm Đúng / Sai (6 câu)</span>
              </div>

              <div className="space-y-5">
                {TRUE_FALSE_QUESTIONS.map((q) => {
                  return (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                      {/* Context */}
                      <div className="border-b border-slate-200 pb-3">
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#005A9C] text-white font-bold">
                            Câu {q.id}
                          </span>
                          <span>• {q.topic}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{q.context}</div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {q.items.map((item) => {
                          const key = `${q.id}_${item.id}`;
                          const studentVal = submission.answersPart2[key];
                          const isCorrect = studentVal === item.correctAnswer;

                          return (
                            <div
                              key={item.id}
                              className={`p-3.5 rounded-xl border space-y-2 ${
                                isCorrect
                                  ? 'bg-slate-50 border-slate-200'
                                  : 'bg-rose-50/50 border-rose-200'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="text-xs sm:text-sm font-medium text-slate-800 flex-1 min-w-0 break-words">
                                  <strong className="text-[#005A9C] uppercase mr-1.5">{item.id})</strong>
                                  {item.text}
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                  <span className="text-xs text-slate-500">
                                    Em chọn: <strong className={studentVal !== undefined ? (studentVal ? 'text-emerald-700' : 'text-rose-700') : 'text-slate-400'}>
                                      {studentVal === undefined ? 'Chưa chọn' : studentVal ? 'Đúng' : 'Sai'}
                                    </strong>
                                  </span>
                                  <span className="text-slate-300">|</span>
                                  <span className="text-xs font-bold text-emerald-700">
                                    Chuẩn: {item.correctAnswer ? 'ĐÚNG' : 'SAI'}
                                  </span>
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                  )}
                                </div>
                              </div>

                              <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                                <strong className="text-[#005A9C]">Giải thích: </strong>
                                <span>{item.explanation}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PART III: ESSAY REVIEW & SELF EVALUATION */}
          {(filterMode === 'all' || filterMode === 'part3') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 text-[#005A9C] font-bold text-sm uppercase tracking-wide">
                  <span>Phần III: Tự luận & Đối chiếu gợi ý trả lời</span>
                </div>
                <span className="text-xs text-slate-500">Em có thể tự chấm điểm theo thang gợi ý</span>
              </div>

              <div className="space-y-5">
                {ESSAY_QUESTIONS.map((q) => {
                  return (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="border-b border-slate-200 pb-3">
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#005A9C] text-white font-bold">
                            Câu {q.id}
                          </span>
                          <span className="font-bold text-slate-900">{q.title}</span>
                          <span>• {q.topic}</span>
                        </div>
                        {q.context && (
                          <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            {q.context}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {q.items.map((item) => {
                          const key = `${q.id}_${item.id}`;
                          const studentText = submission.answersPart3[key] || '';
                          const currentScore = selfGrading[key] !== undefined ? selfGrading[key] : (studentText.trim().length >= 10 ? 0.1 : studentText.trim().length > 0 ? 0.05 : 0);

                          return (
                            <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 shadow-sm">
                              {/* Dedicated Question Row - Always 100% Full Width to prevent text dropping */}
                              <div className="w-full">
                                <div className="flex items-start space-x-2.5">
                                  <span className="px-2.5 py-1 rounded-lg bg-[#80C8F8]/20 text-[#005A9C] font-bold uppercase shrink-0 text-xs mt-0.5 border border-[#80C8F8]/40">
                                    Ý {item.id})
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed break-words flex-1">
                                    {item.question}
                                  </h4>
                                </div>
                              </div>

                              {/* Dedicated Self-grading Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                                <div className="flex items-center space-x-2 text-slate-600">
                                  <span className="text-[#005A9C] font-bold">Thang điểm: {item.maxScore} đ</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-500">Em tự chấm theo gợi ý:</span>
                                </div>

                                <div className="flex items-center space-x-2 ml-auto">
                                  <span className="text-slate-700 font-medium">Điểm tự chấm:</span>
                                  <select
                                    value={currentScore}
                                    onChange={(e) => handleSelfGradeChange(q.id, item.id, parseFloat(e.target.value))}
                                    className="bg-slate-50 text-[#005A9C] font-bold rounded-lg px-2.5 py-1 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#80C8F8] cursor-pointer text-xs"
                                  >
                                    <option value="0">0.0 đ</option>
                                    <option value="0.05">0.05 đ</option>
                                    <option value="0.1">0.10 đ</option>
                                    <option value="0.125">0.125 đ</option>
                                    <option value="0.25">0.25 đ (Tối đa)</option>
                                  </select>
                                </div>
                              </div>

                              {/* Student answer */}
                              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800">
                                <span className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wide">
                                  Bài làm của học sinh:
                                </span>
                                {studentText.trim() ? (
                                  <p className="whitespace-pre-wrap leading-relaxed text-slate-800">{studentText}</p>
                                ) : (
                                  <span className="text-slate-400 italic">Học sinh chưa trả lời câu này.</span>
                                )}
                              </div>

                              {/* Official model answer */}
                              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
                                <span className="text-[11px] font-bold text-emerald-800 flex items-center space-x-1.5 uppercase tracking-wide">
                                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                  <span>GỢI Ý TRẢ LỜI CHUẨN CỦA ĐỀ CƯƠNG:</span>
                                </span>
                                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium pl-5 sm:pl-6">
                                  {item.modelAnswer}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Action Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onRetake}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#005A9C] hover:bg-[#00487c] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#005A9C]/20 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại bài thi từ đầu</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleStatsClick}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
              title={isAdmin ? "Xem thống kê cả lớp" : "Chức năng chỉ dành cho Admin"}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Xem Thống kê cả lớp</span>
              {!isAdmin && <Lock className="w-3.5 h-3.5 text-amber-600 ml-1" />}
            </button>

            {/* Primary CTA Button: Màu điểm nhấn 2 #FFD147 */}
            <button
              onClick={handleExportExcel}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#FFD147] hover:bg-[#f6c63b] text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              title={isAdmin ? "Tải file Excel kết quả" : "Chức năng chỉ dành cho Admin"}
            >
              <Download className="w-4 h-4 text-slate-900" />
              <span>Tải file Excel (.xlsx)</span>
              {!isAdmin && <Lock className="w-3.5 h-3.5 text-amber-900 ml-1" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
