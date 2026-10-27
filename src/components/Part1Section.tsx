import React from 'react';
import { ShuffledMultipleChoiceQuestion } from '../utils/shuffle';
import { CheckCircle2, Code2, Tag, Shuffle, RotateCcw, Sparkles } from 'lucide-react';

interface Part1SectionProps {
  questions: ShuffledMultipleChoiceQuestion[];
  isShuffled: boolean;
  onShuffle: () => void;
  onResetOrder: () => void;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onSelectAnswer: (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => void;
}

export const Part1Section: React.FC<Part1SectionProps> = ({
  questions,
  isShuffled,
  onShuffle,
  onResetOrder,
  answers,
  onSelectAnswer
}) => {
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  return (
    <div className="space-y-6">
      {/* Section Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#80C8F8]/20 text-[#005A9C] text-xs font-bold uppercase tracking-wider">
                <span>Phần I</span>
                <span>•</span>
                <span>Trắc nghiệm nhiều lựa chọn</span>
              </div>

              {isShuffled ? (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FFF275]/50 text-amber-950 text-xs font-bold border border-[#FFD147] animate-in fade-in">
                  <Shuffle className="w-3.5 h-3.5 text-amber-800" />
                  <span>Đã đảo ngẫu nhiên câu hỏi & phương án</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                  <span>Thứ tự đề cương chuẩn (1 - 30)</span>
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Câu hỏi trắc nghiệm khách quan 4 lựa chọn (30 câu)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thí sinh chọn 01 phương án đúng nhất trong 4 phương án A, B, C, D cho mỗi câu hỏi.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-medium">Đã hoàn thành</div>
              <div className="text-sm font-bold text-[#005A9C]">
                {answeredCount} / {totalCount} câu
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#005A9C]/10 border border-[#005A9C]/30 flex items-center justify-center text-[#005A9C] font-bold text-xs">
              {Math.round((answeredCount / (totalCount || 1)) * 100)}%
            </div>
          </div>
        </div>

        {/* Action Bar with "Đảo câu hỏi" button */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>
              {isShuffled 
                ? 'Câu hỏi và các phương án A, B, C, D đã được xáo trộn ngẫu nhiên.' 
                : 'Muốn xáo trộn để kiểm tra phản xạ? Bấm "Đảo câu hỏi".'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Primary button: Đảo câu hỏi */}
            <button
              type="button"
              onClick={onShuffle}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                isShuffled
                  ? 'bg-[#FFD147] hover:bg-[#f6c63b] text-slate-900'
                  : 'bg-[#005A9C] hover:bg-[#00487c] text-white shadow-[#005A9C]/20'
              }`}
              title="Đảo ngẫu nhiên thứ tự 30 câu hỏi và các phương án trả lời"
            >
              <Shuffle className="w-4 h-4" />
              <span>{isShuffled ? 'Đảo lại câu hỏi' : 'Đảo câu hỏi'}</span>
            </button>

            {/* Reset button: Thứ tự gốc */}
            {isShuffled && (
              <button
                type="button"
                onClick={onResetOrder}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Khôi phục về thứ tự gốc của đề cương"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Thứ tự gốc</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-5">
        {questions.map((q, idx) => {
          const selectedKey = answers[q.id];
          const isAnswered = selectedKey !== undefined;
          const selectedOpt = q.options.find(o => o.originalKey === selectedKey);

          return (
            <div
              key={q.id}
              id={`p1-q-${q.id}`}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                isAnswered
                  ? 'bg-white border-slate-300 shadow-sm ring-1 ring-slate-100'
                  : 'bg-white border-slate-200 shadow-sm hover:border-[#80C8F8]'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2.5 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors ${
                    isAnswered
                      ? 'bg-[#005A9C] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {isShuffled ? `Câu ${q.id} (Số ${idx + 1})` : `Câu ${q.id}`}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>{q.topic}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    q.level === 'Nhận biết'
                      ? 'bg-[#80C8F8]/20 text-[#005A9C] border-[#80C8F8]/40'
                      : q.level === 'Thông hiểu'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-purple-50 text-purple-800 border-purple-200'
                  }`}>
                    {q.level}
                  </span>

                  {isAnswered && (
                    <span className="flex items-center space-x-1 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã chọn ({selectedOpt ? selectedOpt.displayKey : selectedKey})</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-slate-900 text-sm sm:text-base font-semibold leading-relaxed mb-4 break-words">
                {q.question}
              </div>

              {/* Code Snippet if present */}
              {q.codeSnippet && (
                <div className="mb-4 p-3.5 rounded-xl bg-slate-900 text-emerald-300 border border-slate-800 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
                  <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mã nguồn HTML mẫu</span>
                  </div>
                  <pre className="whitespace-pre">{q.codeSnippet}</pre>
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt) => {
                  const isChecked = selectedKey === opt.originalKey;

                  return (
                    <button
                      type="button"
                      key={opt.displayKey}
                      onClick={() => onSelectAnswer(q.id, opt.originalKey)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start space-x-3 cursor-pointer ${
                        isChecked
                          ? 'bg-[#005A9C]/10 border-[#005A9C] text-[#005A9C] shadow-sm ring-1 ring-[#005A9C] font-semibold'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isChecked
                          ? 'bg-[#005A9C] text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-300'
                      }`}>
                        {opt.displayKey}
                      </div>
                      <span className="leading-relaxed flex-1 pt-0.5">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
