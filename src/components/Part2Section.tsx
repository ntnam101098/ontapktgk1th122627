import React from 'react';
import { ShuffledTrueFalseQuestion } from '../utils/shuffle';
import { Check, X, Tag, FileText, Shuffle, RotateCcw, Sparkles } from 'lucide-react';

interface Part2SectionProps {
  questions: ShuffledTrueFalseQuestion[];
  isShuffled: boolean;
  onShuffle: () => void;
  onResetOrder: () => void;
  answers: Record<string, boolean>; // key: `${qId}_${itemId}`
  onSelectAnswer: (questionId: number, itemId: 'a' | 'b' | 'c' | 'd', value: boolean) => void;
}

export const Part2Section: React.FC<Part2SectionProps> = ({
  questions,
  isShuffled,
  onShuffle,
  onResetOrder,
  answers,
  onSelectAnswer
}) => {
  const totalSubItems = questions.reduce((acc, q) => acc + q.items.length, 0);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#80C8F8]/20 text-[#005A9C] text-xs font-bold uppercase tracking-wider">
                <span>Phần II</span>
                <span>•</span>
                <span>Trắc nghiệm Đúng / Sai</span>
              </div>

              {isShuffled ? (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FFF275]/50 text-amber-950 text-xs font-bold border border-[#FFD147] animate-in fade-in">
                  <Shuffle className="w-3.5 h-3.5 text-amber-800" />
                  <span>Đã đảo ngẫu nhiên câu hỏi & ý con</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                  <span>Thứ tự đề cương chuẩn (Câu 1 - 6)</span>
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Câu hỏi trắc nghiệm Đúng – Sai (6 bài, 24 ý)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai. (Điểm tính theo thang lũy tiến của Bộ GD&ĐT: đúng 1 ý = 0.1đ, 2 ý = 0.25đ, 3 ý = 0.5đ, 4 ý = 1.0đ quy đổi).
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-medium">Đã hoàn thành</div>
              <div className="text-sm font-bold text-[#005A9C]">
                {answeredCount} / {totalSubItems} ý
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#005A9C]/10 border border-[#005A9C]/30 flex items-center justify-center text-[#005A9C] font-bold text-xs">
              {Math.round((answeredCount / (totalSubItems || 1)) * 100)}%
            </div>
          </div>
        </div>

        {/* Action Bar with "Đảo câu hỏi" button */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>
              {isShuffled 
                ? 'Thứ tự 6 câu hỏi và các ý nhận định bên trong đã được xáo trộn ngẫu nhiên.' 
                : 'Muốn xáo trộn câu hỏi và ý con? Bấm "Đảo câu hỏi".'}
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
              title="Đảo ngẫu nhiên thứ tự 6 câu hỏi và các ý a, b, c, d"
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

      {/* Questions list */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const qAnsweredCount = q.items.filter(item => answers[`${q.id}_${item.originalId}`] !== undefined).length;
          const isAllAnswered = qAnsweredCount === q.items.length;

          return (
            <div
              key={q.id}
              id={`p2-q-${q.id}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Question Context Header */}
              <div className="p-5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-3 py-1 rounded-xl bg-[#005A9C] text-white font-black text-xs shadow-sm">
                      {isShuffled ? `Câu ${q.id} (Bài ${idx + 1})` : `Câu ${q.id}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span>{q.topic}</span>
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Tiến độ: <strong className={isAllAnswered ? "text-emerald-700" : "text-amber-700"}>{qAnsweredCount}/4 ý</strong>
                  </span>
                </div>

                <div className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed flex items-start space-x-2.5">
                  <FileText className="w-5 h-5 text-[#005A9C] shrink-0 mt-0.5" />
                  <span>{q.context}</span>
                </div>
              </div>

              {/* Sub-items a, b, c, d */}
              <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
                {q.items.map((item) => {
                  const key = `${q.id}_${item.originalId}`;
                  const currentVal = answers[key];

                  return (
                    <div
                      key={item.originalId}
                      className="p-3.5 sm:p-4 rounded-xl hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Statement Text */}
                      <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#005A9C] text-sm uppercase">
                            {item.displayId})
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                            {item.level}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed break-words">
                          {item.text}
                        </p>
                      </div>

                      {/* True / False Buttons */}
                      <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => onSelectAnswer(q.id, item.originalId, true)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                            currentVal === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-200'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-600 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>Đúng</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectAnswer(q.id, item.originalId, false)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                            currentVal === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-200'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-rose-600 hover:text-rose-700'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          <span>Sai</span>
                        </button>
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
  );
};
