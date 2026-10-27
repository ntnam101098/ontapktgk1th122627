import React, { useState, useEffect, useRef } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ExamNavbar } from './components/ExamNavbar';
import { Part1Section } from './components/Part1Section';
import { Part2Section } from './components/Part2Section';
import { Part3Section } from './components/Part3Section';
import { QuestionPalette } from './components/QuestionPalette';
import { ResultScreen } from './components/ResultScreen';
import { TeacherStatisticsModal } from './components/TeacherStatisticsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { checkIsAdminLoggedIn, logoutAdmin } from './utils/auth';
import { 
  StudentSubmission, 
  MULTIPLE_CHOICE_QUESTIONS, 
  TRUE_FALSE_QUESTIONS, 
  ESSAY_QUESTIONS 
} from './data/examData';
import { calculateExamScore, ScoreResult } from './utils/scoring';
import { 
  getStoredSubmissions, 
  fetchStoredSubmissions,
  saveSubmission, 
  clearAllSubmissions, 
  resetMockSubmissions 
} from './utils/storage';
import {
  ShuffledMultipleChoiceQuestion,
  ShuffledTrueFalseQuestion,
  getOriginalPart1Questions,
  generateShuffledPart1Questions,
  getOriginalPart2Questions,
  generateShuffledPart2Questions
} from './utils/shuffle';
import { AlertTriangle, Send, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

export default function App() {
  // Navigation & Screens
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'exam' | 'result'>('welcome');
  const [activeTab, setActiveTab] = useState<'part1' | 'part2' | 'part3'>('part1');

  // Student State
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('12A1');
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(45 * 60); // 45 minutes
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Shuffled Question States (Default is false = original order as per requirements)
  const [isShuffledPart1, setIsShuffledPart1] = useState<boolean>(false);
  const [questionsPart1, setQuestionsPart1] = useState<ShuffledMultipleChoiceQuestion[]>(() => getOriginalPart1Questions());

  const [isShuffledPart2, setIsShuffledPart2] = useState<boolean>(false);
  const [questionsPart2, setQuestionsPart2] = useState<ShuffledTrueFalseQuestion[]>(() => getOriginalPart2Questions());

  // Student Answers
  const [answersPart1, setAnswersPart1] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [answersPart2, setAnswersPart2] = useState<Record<string, boolean>>({});
  const [answersPart3, setAnswersPart3] = useState<Record<string, string>>({});
  const [selfGradingPart3, setSelfGradingPart3] = useState<Record<string, number>>({});

  // Submissions data
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<StudentSubmission | null>(null);
  const [currentScoreResult, setCurrentScoreResult] = useState<ScoreResult | null>(null);

  // Modals & Admin
  const [isTeacherStatsOpen, setIsTeacherStatsOpen] = useState<boolean>(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => checkIsAdminLoggedIn());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [intendedAdminAction, setIntendedAdminAction] = useState<string>('');
  const [pendingAdminCallback, setPendingAdminCallback] = useState<(() => void) | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load submissions from storage and server on mount
  useEffect(() => {
    // 1. Initial fast load from local cache
    setSubmissions(getStoredSubmissions());
    // 2. Fetch all student submissions from centralized server
    fetchStoredSubmissions().then(subs => {
      if (subs && subs.length > 0) {
        setSubmissions(subs);
      }
    });
  }, []);

  const handleOpenTeacherStats = async () => {
    setIsTeacherStatsOpen(true);
    try {
      const fresh = await fetchStoredSubmissions();
      setSubmissions(fresh);
    } catch {
      // ignore
    }
  };

  const handleRefreshSubmissions = async () => {
    const fresh = await fetchStoredSubmissions();
    setSubmissions(fresh);
  };

  // Timer logic
  useEffect(() => {
    if (currentScreen === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeSpentSeconds(prev => prev + 1);

        if (isTimed) {
          setTimeLeftSeconds(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              handlePerformSubmit();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentScreen, isTimed]);

  // Start exam from Welcome Screen
  const handleStartExam = (
    name: string, 
    cls: string, 
    timed: boolean, 
    initialSection?: 'all' | 'part1' | 'part2' | 'part3'
  ) => {
    setStudentName(name);
    setStudentClass(cls);
    setIsTimed(timed);
    setTimeLeftSeconds(45 * 60);
    setTimeSpentSeconds(0);
    setAnswersPart1({});
    setAnswersPart2({});
    setAnswersPart3({});
    setSelfGradingPart3({});

    // Reset to default original order
    setIsShuffledPart1(false);
    setQuestionsPart1(getOriginalPart1Questions());
    setIsShuffledPart2(false);
    setQuestionsPart2(getOriginalPart2Questions());

    if (initialSection === 'part2') setActiveTab('part2');
    else if (initialSection === 'part3') setActiveTab('part3');
    else setActiveTab('part1');

    setCurrentScreen('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Shuffle & Reset Handlers for Part 1 & Part 2
  const handleShufflePart1 = () => {
    setIsShuffledPart1(true);
    setQuestionsPart1(generateShuffledPart1Questions());
  };

  const handleResetOrderPart1 = () => {
    setIsShuffledPart1(false);
    setQuestionsPart1(getOriginalPart1Questions());
  };

  const handleShufflePart2 = () => {
    setIsShuffledPart2(true);
    setQuestionsPart2(generateShuffledPart2Questions());
  };

  const handleResetOrderPart2 = () => {
    setIsShuffledPart2(false);
    setQuestionsPart2(getOriginalPart2Questions());
  };

  // Multiple Choice answer select
  const handleSelectAnswerP1 = (qId: number, key: 'A' | 'B' | 'C' | 'D') => {
    setAnswersPart1(prev => ({ ...prev, [qId]: key }));
  };

  // True / False answer select
  const handleSelectAnswerP2 = (qId: number, itemId: 'a' | 'b' | 'c' | 'd', value: boolean) => {
    const key = `${qId}_${itemId}`;
    setAnswersPart2(prev => ({ ...prev, [key]: value }));
  };

  // Essay answer change
  const handleChangeAnswerP3 = (qId: number, itemId: 'a' | 'b' | 'c' | 'd', value: string) => {
    const key = `${qId}_${itemId}`;
    setAnswersPart3(prev => ({ ...prev, [key]: value }));
  };

  // Jump to question
  const handleJumpToQuestion = (tab: 'part1' | 'part2' | 'part3', elementId: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Submit trigger
  const handlePerformSubmit = async () => {
    setIsConfirmSubmitOpen(false);

    // Compute final scores
    const scoreResult = calculateExamScore(answersPart1, answersPart2, answersPart3, selfGradingPart3);

    const newSub: StudentSubmission = {
      id: `sub-${Date.now()}`,
      studentName: studentName || 'Học sinh',
      studentClass: studentClass || '12A1',
      submittedAt: new Date().toLocaleString('vi-VN', { 
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
      }),
      timeSpentSeconds: timeSpentSeconds || 1,
      scorePart1: scoreResult.scorePart1,
      correctPart1Count: scoreResult.correctPart1Count,
      scorePart2: scoreResult.scorePart2,
      correctPart2SubCount: scoreResult.correctPart2SubCount,
      scorePart3: scoreResult.scorePart3,
      totalScore: scoreResult.totalScore,
      gradeClassification: scoreResult.gradeClassification,
      feedback: scoreResult.feedback,
      answersPart1,
      answersPart2,
      answersPart3,
      selfGradingPart3
    };

    // Save to local cache & server database
    await saveSubmission(newSub);
    setSubmissions(prev => [newSub, ...prev.filter(item => item.id !== newSub.id)]);
    setCurrentSubmission(newSub);
    setCurrentScoreResult(scoreResult);
    setCurrentScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update submission if student self-graded essay
  const handleUpdateSubmissionScore = async (newScoreResult: ScoreResult, updatedSelfGrading: Record<string, number>) => {
    if (!currentSubmission) return;

    const updatedSub: StudentSubmission = {
      ...currentSubmission,
      scorePart3: newScoreResult.scorePart3,
      totalScore: newScoreResult.totalScore,
      gradeClassification: newScoreResult.gradeClassification,
      feedback: newScoreResult.feedback,
      selfGradingPart3: updatedSelfGrading
    };

    await saveSubmission(updatedSub);
    setSubmissions(prev => prev.map(item => item.id === updatedSub.id ? updatedSub : item));
    setCurrentSubmission(updatedSub);
    setCurrentScoreResult(newScoreResult);
  };

  // Retake exam
  const handleRetake = () => {
    setAnswersPart1({});
    setAnswersPart2({});
    setAnswersPart3({});
    setSelfGradingPart3({});
    setTimeLeftSeconds(45 * 60);
    setTimeSpentSeconds(0);
    // Reset to normal original state as per requirement
    setIsShuffledPart1(false);
    setQuestionsPart1(getOriginalPart1Questions());
    setIsShuffledPart2(false);
    setQuestionsPart2(getOriginalPart2Questions());
    setActiveTab('part1');
    setCurrentScreen('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View specific submission from statistics table
  const handleViewStudentSubmission = (sub: StudentSubmission) => {
    const scoreResult = calculateExamScore(sub.answersPart1, sub.answersPart2, sub.answersPart3, sub.selfGradingPart3);
    setCurrentSubmission(sub);
    setCurrentScoreResult(scoreResult);
    setCurrentScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear or reset storage
  const handleClearAll = async () => {
    await clearAllSubmissions();
    setSubmissions([]);
  };

  const handleResetMock = async () => {
    const list = await resetMockSubmissions();
    setSubmissions(list);
  };

  // Admin login handlers
  const handleOpenAdminLogin = (actionName = 'thực hiện thao tác này', callback?: () => void) => {
    setIntendedAdminAction(actionName);
    setPendingAdminCallback(callback ? () => callback : null);
    setIsAdminLoginOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    if (pendingAdminCallback) {
      pendingAdminCallback();
      setPendingAdminCallback(null);
    }
  };

  const handleLogoutAdmin = () => {
    logoutAdmin();
    setIsAdmin(false);
  };

  // Counts
  const totalQuestions = MULTIPLE_CHOICE_QUESTIONS.length + TRUE_FALSE_QUESTIONS.length + ESSAY_QUESTIONS.length;
  const answeredP1Count = Object.keys(answersPart1).length;
  const answeredP2Count = Object.keys(answersPart2).length;
  const answeredP3Count = Object.values(answersPart3).filter(v => v && v.trim().length > 0).length;
  const totalAnswered = answeredP1Count + (answeredP2Count > 0 ? 1 : 0) + (answeredP3Count > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-[#005A9C] selection:text-white">
      {/* 1. WELCOME SCREEN */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onStartExam={handleStartExam}
          onOpenTeacherStats={handleOpenTeacherStats}
          isAdmin={isAdmin}
          onOpenAdminLogin={handleOpenAdminLogin}
          onLogoutAdmin={handleLogoutAdmin}
        />
      )}

      {/* 2. EXAM SCREEN */}
      {currentScreen === 'exam' && (
        <div className="flex-1 flex flex-col">
          <ExamNavbar
            studentName={studentName}
            studentClass={studentClass}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isTimed={isTimed}
            timeLeftSeconds={timeLeftSeconds}
            totalAnsweredCount={answeredP1Count}
            totalQuestionsCount={MULTIPLE_CHOICE_QUESTIONS.length}
            onSubmitExam={() => setIsConfirmSubmitOpen(true)}
            onOpenTeacherStats={handleOpenTeacherStats}
            onExitToHome={() => {
              setCurrentScreen('welcome');
            }}
            isAdmin={isAdmin}
            onOpenAdminLogin={handleOpenAdminLogin}
          />

          <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left/Main Column: Active Section */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                {activeTab === 'part1' && (
                  <Part1Section
                    questions={questionsPart1}
                    isShuffled={isShuffledPart1}
                    onShuffle={handleShufflePart1}
                    onResetOrder={handleResetOrderPart1}
                    answers={answersPart1}
                    onSelectAnswer={handleSelectAnswerP1}
                  />
                )}

                {activeTab === 'part2' && (
                  <Part2Section
                    questions={questionsPart2}
                    isShuffled={isShuffledPart2}
                    onShuffle={handleShufflePart2}
                    onResetOrder={handleResetOrderPart2}
                    answers={answersPart2}
                    onSelectAnswer={handleSelectAnswerP2}
                  />
                )}

                {activeTab === 'part3' && (
                  <Part3Section
                    answers={answersPart3}
                    onChangeAnswer={handleChangeAnswerP3}
                  />
                )}

                {/* Section navigation footer */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                  {activeTab !== 'part1' ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'part3' ? 'part2' : 'part1')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-slate-200"
                    >
                      ← Phần trước
                    </button>
                  ) : <div></div>}

                  {activeTab !== 'part3' ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'part1' ? 'part2' : 'part3')}
                      className="px-5 py-2 rounded-xl bg-[#005A9C] hover:bg-[#00487c] text-white text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm shadow-[#005A9C]/20"
                    >
                      <span>Sang phần kế tiếp</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsConfirmSubmitOpen(true)}
                      className="px-6 py-2 rounded-xl bg-[#FFD147] hover:bg-[#f6c63b] text-slate-900 text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                    >
                      <Send className="w-4 h-4 text-slate-900" />
                      <span>Hoàn tất & Nộp bài</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Question Palette (Sticky on desktop) */}
              <div className="lg:col-span-4 xl:col-span-3 sticky top-20">
                <QuestionPalette
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  answersPart1={answersPart1}
                  answersPart2={answersPart2}
                  answersPart3={answersPart3}
                  onJumpToQuestion={handleJumpToQuestion}
                  isShuffledPart1={isShuffledPart1}
                  isShuffledPart2={isShuffledPart2}
                />
              </div>

            </div>
          </main>
        </div>
      )}

      {/* 3. RESULT SCREEN */}
      {currentScreen === 'result' && currentSubmission && currentScoreResult && (
        <ResultScreen
          submission={currentSubmission}
          scoreResult={currentScoreResult}
          onRetake={handleRetake}
          onOpenTeacherStats={handleOpenTeacherStats}
          onUpdateSubmissionScore={handleUpdateSubmissionScore}
          isAdmin={isAdmin}
          onOpenAdminLogin={handleOpenAdminLogin}
          onLogoutAdmin={handleLogoutAdmin}
        />
      )}

      {/* CONFIRM SUBMIT MODAL */}
      {isConfirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF275]/50 border border-[#FFD147] flex items-center justify-center text-amber-800 mx-auto shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">Xác nhận nộp bài thi?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sau khi nộp bài, hệ thống sẽ tính điểm tự động, đưa ra nhận xét chi tiết và lưu kết quả vào bảng thống kê.
              </p>
            </div>

            {/* Checklist of answered items */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Phần I (TN 4 lựa chọn):</span>
                <strong className={answeredP1Count === 30 ? "text-emerald-700" : "text-amber-800"}>
                  {answeredP1Count}/30 câu
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Phần II (Đúng / Sai):</span>
                <strong className={answeredP2Count === 24 ? "text-emerald-700" : "text-amber-800"}>
                  {answeredP2Count}/24 ý
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Phần III (Tự luận):</span>
                <strong className={answeredP3Count > 0 ? "text-emerald-700" : "text-slate-500"}>
                  {answeredP3Count}/24 ý đã điền
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                Tiếp tục làm bài
              </button>

              <button
                type="button"
                onClick={handlePerformSubmit}
                className="py-2.5 rounded-xl bg-[#FFD147] hover:bg-[#f6c63b] text-slate-900 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
              >
                Xác nhận nộp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER STATISTICS MODAL */}
      <TeacherStatisticsModal
        isOpen={isTeacherStatsOpen}
        onClose={() => setIsTeacherStatsOpen(false)}
        submissions={submissions}
        onClearSubmissions={handleClearAll}
        onResetMockSubmissions={handleResetMock}
        onViewStudentSubmission={handleViewStudentSubmission}
        onRefreshSubmissions={handleRefreshSubmissions}
      />

      {/* ADMIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        intendedActionName={intendedAdminAction}
      />
    </div>
  );
}
