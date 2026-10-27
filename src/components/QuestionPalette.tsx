import React from 'react';
import { MULTIPLE_CHOICE_QUESTIONS, TRUE_FALSE_QUESTIONS, ESSAY_QUESTIONS } from '../data/examData';
import { ListChecks, Shuffle } from 'lucide-react';

interface QuestionPaletteProps {
  activeTab: 'part1' | 'part2' | 'part3';
  onTabChange: (tab: 'part1' | 'part2' | 'part3') => void;
  answersPart1: Record<number, 'A' | 'B' | 'C' | 'D'>;
  answersPart2: Record<string, boolean>;
  answersPart3: Record<string, string>;
  onJumpToQuestion: (tab: 'part1' | 'part2' | 'part3', elementId: string) => void;
  isShuffledPart1?: boolean;
  isShuffledPart2?: boolean;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  answersPart1,
  answersPart2,
  answersPart3,
  onJumpToQuestion,
  isShuffledPart1,
  isShuffledPart2
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-200 text-xs font-bold text-slate-900 uppercase tracking-wider">
        <ListChecks className="w-4 h-4 text-[#005A9C]" />
        <span>Mục lục câu hỏi</span>
      </div>

      {/* Part 1: 30 Questions Grid */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-[#005A9C]">Phần I (30 câu)</span>
            {isShuffledPart1 && (
              <span className="px-1.5 py-0.2 rounded bg-[#FFF275]/60 text-amber-950 text-[10px] font-bold border border-[#FFD147] flex items-center space-x-0.5" title="Đang ở chế độ đảo ngẫu nhiên">
                <Shuffle className="w-2.5 h-2.5 text-amber-800" />
                <span>Đảo</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            {Object.keys(answersPart1).length}/30
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-1.5">
          {MULTIPLE_CHOICE_QUESTIONS.map(q => {
            const isDone = answersPart1[q.id] !== undefined;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpToQuestion('part1', `p1-q-${q.id}`)}
                className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isDone
                    ? 'bg-[#005A9C] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
                title={`Câu ${q.id}: ${isDone ? `Đã chọn (${answersPart1[q.id]})` : 'Chưa làm'}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 2: 6 Questions (4 sub-items each) */}
      <div className="space-y-2 mb-4 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-[#005A9C]">Phần II (6 câu)</span>
            {isShuffledPart2 && (
              <span className="px-1.5 py-0.2 rounded bg-[#FFF275]/60 text-amber-950 text-[10px] font-bold border border-[#FFD147] flex items-center space-x-0.5" title="Đang ở chế độ đảo ngẫu nhiên">
                <Shuffle className="w-2.5 h-2.5 text-amber-800" />
                <span>Đảo</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            {Object.keys(answersPart2).length}/24 ý
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
          {TRUE_FALSE_QUESTIONS.map(q => {
            const answeredCount = q.items.filter(item => answersPart2[`${q.id}_${item.id}`] !== undefined).length;
            const isFull = answeredCount === 4;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpToQuestion('part2', `p2-q-${q.id}`)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                  isFull
                    ? 'bg-[#80C8F8]/20 border-[#005A9C] text-[#005A9C]'
                    : answeredCount > 0
                    ? 'bg-[#FFF275]/40 border-amber-300 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>C{q.id}</span>
                <span className="text-[10px] font-semibold">{answeredCount}/4</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 3: 6 Questions */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-700">
          <span className="font-bold text-[#005A9C]">Phần III (6 câu)</span>
          <span className="text-[11px] text-slate-500 font-semibold">Tự luận</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
          {ESSAY_QUESTIONS.map(q => {
            const answeredCount = q.items.filter(item => answersPart3[`${q.id}_${item.id}`]?.trim()).length;
            const isFull = answeredCount === 4;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpToQuestion('part3', `p3-q-${q.id}`)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                  isFull
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : answeredCount > 0
                    ? 'bg-slate-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>C{q.id}</span>
                <span className="text-[10px] font-semibold">{answeredCount}/4</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-around text-[10px] text-slate-500">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-[#005A9C]"></span>
          <span>Đã làm</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300"></span>
          <span>Chưa làm</span>
        </div>
      </div>
    </div>
  );
};
