import { 
  MULTIPLE_CHOICE_QUESTIONS, 
  TRUE_FALSE_QUESTIONS,
  MultipleChoiceQuestion,
  TrueFalseQuestion
} from '../data/examData';

export interface ShuffledMultipleChoiceOption {
  displayKey: 'A' | 'B' | 'C' | 'D';
  originalKey: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ShuffledMultipleChoiceQuestion {
  id: number;
  topic: string;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
  question: string;
  codeSnippet?: string;
  options: ShuffledMultipleChoiceOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface ShuffledTrueFalseSubItem {
  displayId: 'a' | 'b' | 'c' | 'd';
  originalId: 'a' | 'b' | 'c' | 'd';
  level: string;
  text: string;
  correctAnswer: boolean;
}

export interface ShuffledTrueFalseQuestion {
  id: number;
  topic: string;
  context: string;
  items: ShuffledTrueFalseSubItem[];
}

/**
 * Fisher-Yates array shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const DISPLAY_KEYS_P1: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
const DISPLAY_IDS_P2: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];

/**
 * Get Part 1 questions in original order and original options
 */
export function getOriginalPart1Questions(): ShuffledMultipleChoiceQuestion[] {
  return MULTIPLE_CHOICE_QUESTIONS.map(q => ({
    ...q,
    options: q.options.map(opt => ({
      displayKey: opt.key,
      originalKey: opt.key,
      text: opt.text
    }))
  }));
}

/**
 * Generate randomized Part 1 questions:
 * - Shuffles the 30 questions
 * - Shuffles the 4 options inside each question (assigning display keys A, B, C, D)
 */
export function generateShuffledPart1Questions(): ShuffledMultipleChoiceQuestion[] {
  const shuffledQuestions = shuffleArray(MULTIPLE_CHOICE_QUESTIONS);

  return shuffledQuestions.map(q => {
    const shuffledOptions = shuffleArray(q.options);
    const optionsWithKeys: ShuffledMultipleChoiceOption[] = shuffledOptions.map((opt, idx) => ({
      displayKey: DISPLAY_KEYS_P1[idx] || 'A',
      originalKey: opt.key,
      text: opt.text
    }));

    return {
      ...q,
      options: optionsWithKeys
    };
  });
}

/**
 * Get Part 2 questions in original order and original sub-items
 */
export function getOriginalPart2Questions(): ShuffledTrueFalseQuestion[] {
  return TRUE_FALSE_QUESTIONS.map(q => ({
    ...q,
    items: q.items.map(item => ({
      displayId: item.id,
      originalId: item.id,
      level: item.level,
      text: item.text,
      correctAnswer: item.correctAnswer
    }))
  }));
}

/**
 * Generate randomized Part 2 questions:
 * - Shuffles the 6 questions
 * - Shuffles the 4 sub-items inside each question (assigning display IDs a, b, c, d)
 */
export function generateShuffledPart2Questions(): ShuffledTrueFalseQuestion[] {
  const shuffledQuestions = shuffleArray(TRUE_FALSE_QUESTIONS);

  return shuffledQuestions.map(q => {
    const shuffledItems = shuffleArray(q.items);
    const itemsWithIds: ShuffledTrueFalseSubItem[] = shuffledItems.map((item, idx) => ({
      displayId: DISPLAY_IDS_P2[idx] || 'a',
      originalId: item.id,
      level: item.level,
      text: item.text,
      correctAnswer: item.correctAnswer
    }));

    return {
      ...q,
      items: itemsWithIds
    };
  });
}
