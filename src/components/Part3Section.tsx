import React from 'react';
import { ESSAY_QUESTIONS } from '../data/examData';
import { CheckCircle2 } from 'lucide-react';

interface Part3SectionProps {
  answers: Record<string, string>; // key: `${qId}_${itemId}` -> text
  onChangeAnswer: (questionId: number, itemId: 'a' | 'b' | 'c' | 'd', value: string) => void;
}

export const Part3Section: React.FC<Part3SectionProps> = ({ answers, onChangeAnswer }) => {
  const totalItems = ESSAY_QUESTIONS.reduce((acc, q) => acc + q.items.length, 0);
  const filledCount = Object.values(answers).filter(v => v && v.trim().length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#80C8F8]/20 text-[#005A9C] text-xs font-bold uppercase tracking-wider">
              <span>Phần III</span>
              <span>•</span>
              <span>Câu hỏi Tự luận ngắn</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Câu hỏi tự luận vận dụng tình huống thực tiễn (6 câu)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thí sinh trả lời ngắn gọn, đúng trọng tâm các câu hỏi a, b, c, d theo từng tình huống thực tế. Sau khi nộp bài, hệ thống sẽ mở đối chiếu đáp án chi tiết và gợi ý thang điểm.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-medium">Đã trả lời</div>
              <div className="text-sm font-bold text-[#005A9C]">
                {filledCount} / {totalItems} ý
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#005A9C]/10 border border-[#005A9C]/30 flex items-center justify-center text-[#005A9C] font-bold text-xs">
              {Math.round((filledCount / totalItems) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Essay questions list */}
      <div className="space-y-6">
        {ESSAY_QUESTIONS.map((q) => {
          return (
            <div
              key={q.id}
              id={`p3-q-${q.id}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Context header */}
              <div className="p-5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center space-x-2.5 mb-2">
                  <span className="px-3 py-1 rounded-xl bg-[#005A9C] text-white font-black text-xs shadow-sm">
                    Câu {q.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{q.title}</span>
                  <span className="text-xs text-slate-500">• {q.topic}</span>
                </div>
                {q.context && (
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-2 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                    {q.context}
                  </p>
                )}
              </div>

              {/* Sub items inputs */}
              <div className="p-5 space-y-4">
                {q.items.map((item) => {
                  const key = `${q.id}_${item.id}`;
                  const currentText = answers[key] || '';
                  const hasAnswer = currentText.trim().length > 0;

                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-start space-x-2 text-xs sm:text-sm font-semibold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-[#005A9C]/10 text-[#005A9C] font-bold uppercase shrink-0 mt-0.5 border border-[#005A9C]/20">
                          {item.id}
                        </span>
                        <span className="flex-1 min-w-0 leading-relaxed break-words">{item.question}</span>
                      </div>

                      <div className="relative">
                        <textarea
                          value={currentText}
                          onChange={(e) => onChangeAnswer(q.id, item.id, e.target.value)}
                          rows={3}
                          placeholder="Nhập câu trả lời ngắn của em tại đây..."
                          className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#80C8F8] focus:border-[#005A9C] focus:bg-white transition-all resize-y"
                        />
                        {hasAnswer && (
                          <div className="absolute right-3 bottom-3 flex items-center space-x-1 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shadow-xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đã ghi ({currentText.trim().length} ký tự)</span>
                          </div>
                        )}
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
