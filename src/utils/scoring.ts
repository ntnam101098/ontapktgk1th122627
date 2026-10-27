import { MULTIPLE_CHOICE_QUESTIONS, TRUE_FALSE_QUESTIONS, ESSAY_QUESTIONS, StudentSubmission } from '../data/examData';

export interface ScoreResult {
  scorePart1: number;
  correctPart1Count: number;
  scorePart2: number;
  correctPart2SubCount: number;
  scorePart3: number;
  totalScore: number;
  gradeClassification: string;
  feedback: string;
  topicAnalysis: {
    topic: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
}

export function calculateExamScore(
  answersPart1: Record<number, 'A' | 'B' | 'C' | 'D'>,
  answersPart2: Record<string, boolean>,
  answersPart3: Record<string, string>,
  selfGradingPart3: Record<string, number> = {}
): ScoreResult {
  // 1. Calculate Part 1 (Multiple choice - 30 questions)
  // Total weight: 4.0 points (each question is 4.0 / 30 = 0.1333 pts)
  let correctPart1Count = 0;
  const topicStats: Record<string, { correct: number; total: number }> = {};

  MULTIPLE_CHOICE_QUESTIONS.forEach(q => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { correct: 0, total: 0 };
    }
    topicStats[q.topic].total += 1;

    if (answersPart1[q.id] === q.correctAnswer) {
      correctPart1Count += 1;
      topicStats[q.topic].correct += 1;
    }
  });

  const scorePart1 = (correctPart1Count / MULTIPLE_CHOICE_QUESTIONS.length) * 4.0;

  // 2. Calculate Part 2 (True/False - 6 questions, total 3.0 points)
  // Each question is 0.5 points max.
  // Standard Ministry of Education rule for True/False:
  // 1 correct item: 0.1 / 1.0 (here 0.05 / 0.5)
  // 2 correct items: 0.25 / 1.0 (here 0.125 / 0.5)
  // 3 correct items: 0.5 / 1.0 (here 0.25 / 0.5)
  // 4 correct items: 1.0 / 1.0 (here 0.5 / 0.5)
  let scorePart2 = 0;
  let correctPart2SubCount = 0;

  TRUE_FALSE_QUESTIONS.forEach(q => {
    let qCorrectCount = 0;
    q.items.forEach(item => {
      const key = `${q.id}_${item.id}`;
      const userAns = answersPart2[key];
      if (userAns !== undefined && userAns === item.correctAnswer) {
        qCorrectCount += 1;
        correctPart2SubCount += 1;
      }
    });

    let qScore = 0;
    if (qCorrectCount === 1) qScore = 0.05;
    else if (qCorrectCount === 2) qScore = 0.125;
    else if (qCorrectCount === 3) qScore = 0.25;
    else if (qCorrectCount === 4) qScore = 0.5;

    scorePart2 += qScore;
  });

  // 3. Calculate Part 3 (Essay - 6 questions, total 3.0 points)
  // If student self-evaluated using selfGradingPart3: sum them up (max 3.0)
  // If not, calculate based on answers filled vs blank (auto-estimate 0.125 per answered item, capped at 3.0)
  let scorePart3 = 0;
  let totalSelfGraded = 0;
  let hasSelfGrading = false;

  ESSAY_QUESTIONS.forEach(q => {
    q.items.forEach(item => {
      const key = `${q.id}_${item.id}`;
      if (selfGradingPart3[key] !== undefined) {
        hasSelfGrading = true;
        totalSelfGraded += Number(selfGradingPart3[key]) || 0;
      } else {
        const text = answersPart3[key]?.trim();
        if (text && text.length >= 10) {
          // meaningful answer provided, estimate 0.1pt out of 0.125pt
          scorePart3 += 0.1;
        } else if (text && text.length > 0) {
          scorePart3 += 0.05;
        }
      }
    });
  });

  if (hasSelfGrading) {
    scorePart3 = Math.min(3.0, totalSelfGraded);
  } else {
    scorePart3 = Math.min(3.0, scorePart3);
  }

  // Total Score (out of 10.0)
  const totalScore = Math.min(10.0, Math.round((scorePart1 + scorePart2 + scorePart3) * 100) / 100);

  // Classification
  let gradeClassification = 'Cần cố gắng';
  if (totalScore >= 9.0) gradeClassification = 'Xuất sắc';
  else if (totalScore >= 8.0) gradeClassification = 'Giỏi';
  else if (totalScore >= 6.5) gradeClassification = 'Khá';
  else if (totalScore >= 5.0) gradeClassification = 'Trung bình';

  // Topic analysis array
  const topicAnalysis = Object.keys(topicStats).map(topic => ({
    topic,
    correct: topicStats[topic].correct,
    total: topicStats[topic].total,
    percentage: Math.round((topicStats[topic].correct / topicStats[topic].total) * 100)
  }));

  // Smart personalized feedback
  const feedback = generateFeedback(totalScore, gradeClassification, topicAnalysis, correctPart1Count, correctPart2SubCount);

  return {
    scorePart1: Math.round(scorePart1 * 100) / 100,
    correctPart1Count,
    scorePart2: Math.round(scorePart2 * 100) / 100,
    correctPart2SubCount,
    scorePart3: Math.round(scorePart3 * 100) / 100,
    totalScore,
    gradeClassification,
    feedback,
    topicAnalysis
  };
}

function generateFeedback(
  totalScore: number, 
  classification: string, 
  topics: { topic: string; percentage: number }[],
  p1Correct: number,
  p2Correct: number
): string {
  const weakTopics = topics.filter(t => t.percentage < 60).map(t => t.topic);
  const strongTopics = topics.filter(t => t.percentage >= 80).map(t => t.topic);

  let text = '';
  if (totalScore >= 9.0) {
    text = `Xuất sắc! Em đã nắm rất vững và toàn diện toàn bộ nội dung đề cương KTGK1 Tin học 12. Khả năng tư duy và vận dụng kiến thức lý thuyết về AI, Mạng máy tính và HTML rất tốt. Hãy tiếp tục duy trì phong độ này trong bài thi chính thức!`;
  } else if (totalScore >= 8.0) {
    text = `Rất tốt! Em đạt điểm Giỏi với nền tảng kiến thức vững chắc (${p1Correct}/30 câu trắc nghiệm đúng). `;
    if (weakTopics.length > 0) {
      text += `Em nên rà soát lại một số câu thuộc: ${weakTopics.slice(0, 2).join(', ')} để đạt điểm tuyệt đối 10 nhé.`;
    } else {
      text += `Chú ý đọc kỹ các ý bẫy trong dạng câu hỏi Đúng/Sai để tối ưu điểm số.`;
    }
  } else if (totalScore >= 6.5) {
    text = `Khá tốt! Em đã nắm được hầu hết các khái niệm cốt lõi. Tuy nhiên phần câu hỏi trắc nghiệm Đúng/Sai và phân biệt thiết bị mạng (Switch, Router, Modem) vẫn còn nhầm lẫn đôi chút. Hãy xem kỹ phần giải thích chi tiết bên dưới.`;
  } else if (totalScore >= 5.0) {
    text = `Kết quả đạt mức Trung bình. Em đã có kiến thức cơ bản nhưng cần dành thêm thời gian ôn tập lại các bài: ${weakTopics.length > 0 ? weakTopics.slice(0, 2).join(', ') : 'Bộ giao thức TCP/IP, Cú pháp thẻ HTML và Cấu hình chia sẻ LAN'}.`;
  } else {
    text = `Em cần cố gắng hơn! Điểm số hiện tại chưa đạt kỳ vọng. Hãy đọc kỹ lại toàn bộ phần lời giải chi tiết và gợi ý tự luận trong app, sau đó bấm 'Làm lại' để củng cố kiến thức trước ngày thi nhé!`;
  }

  if (strongTopics.length > 0) {
    text += ` Điểm sáng: Em làm rất tốt các nội dung về ${strongTopics[0]}.`;
  }

  return text;
}
