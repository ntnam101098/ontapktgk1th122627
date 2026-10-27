import * as XLSX from 'xlsx';
import { StudentSubmission, MULTIPLE_CHOICE_QUESTIONS, TRUE_FALSE_QUESTIONS } from '../data/examData';

/**
 * Robust blob downloader that works across standard browsers and sandboxed iframes
 */
function triggerDownload(blob: Blob, fileName: string) {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);
    return true;
  } catch (err) {
    console.error('Download error:', err);
    return false;
  }
}

/**
 * Export given submissions to native Excel (.xlsx) file with 2 sheets
 */
export function exportSubmissionsToExcel(
  filteredSubmissions: StudentSubmission[], 
  filterLabel = 'Tất cả'
): { success: boolean; fileName: string } {
  // 1. Sheet 1: Danh sách kết quả chi tiết
  const tableData = filteredSubmissions.map((sub, index) => ({
    'STT': index + 1,
    'Họ và tên': sub.studentName,
    'Lớp': sub.studentClass,
    'Thời gian nộp bài': sub.submittedAt,
    'Thời gian làm (phút)': Math.round(sub.timeSpentSeconds / 60),
    'Điểm P.I (TN 4 Lựa chọn)': Number(sub.scorePart1.toFixed(2)),
    'Số câu đúng P.I (/30)': `${sub.correctPart1Count}/30`,
    'Điểm P.II (Đúng/Sai)': Number(sub.scorePart2.toFixed(2)),
    'Số ý đúng P.II (/24)': `${sub.correctPart2SubCount}/24`,
    'Điểm P.III (Tự luận)': Number(sub.scorePart3.toFixed(2)),
    'Tổng điểm (/10)': Number(sub.totalScore.toFixed(2)),
    'Xếp loại': sub.gradeClassification,
    'Nhận xét đánh giá': sub.feedback
  }));

  const worksheet1 = XLSX.utils.json_to_sheet(tableData);

  // Column width formatting
  worksheet1['!cols'] = [
    { wch: 6 },  // STT
    { wch: 24 }, // Họ tên
    { wch: 10 }, // Lớp
    { wch: 20 }, // Thời gian nộp
    { wch: 16 }, // Thời gian làm
    { wch: 18 }, // Điểm P1
    { wch: 14 }, // Số câu đúng P1
    { wch: 18 }, // Điểm P2
    { wch: 14 }, // Số ý đúng P2
    { wch: 16 }, // Điểm P3
    { wch: 14 }, // Tổng điểm
    { wch: 14 }, // Xếp loại
    { wch: 45 }  // Nhận xét
  ];

  // 2. Sheet 2: Báo cáo thống kê
  const totalStudents = filteredSubmissions.length;
  let avgScore = 0;
  let maxScore = 0;
  let minScore = 0;
  let countXuatSac = 0;
  let countGioi = 0;
  let countKha = 0;
  let countTrungBinh = 0;
  let countYeu = 0;

  if (totalStudents > 0) {
    const scores = filteredSubmissions.map(s => s.totalScore);
    avgScore = scores.reduce((a, b) => a + b, 0) / totalStudents;
    maxScore = Math.max(...scores);
    minScore = Math.min(...scores);
    countXuatSac = filteredSubmissions.filter(s => s.gradeClassification === 'Xuất sắc').length;
    countGioi = filteredSubmissions.filter(s => s.gradeClassification === 'Giỏi').length;
    countKha = filteredSubmissions.filter(s => s.gradeClassification === 'Khá').length;
    countTrungBinh = filteredSubmissions.filter(s => s.gradeClassification === 'Trung bình').length;
    countYeu = filteredSubmissions.filter(s => s.gradeClassification === 'Cần cố gắng').length;
  }

  const summaryData = [
    { 'Chỉ tiêu': 'Tên đợt kiểm tra', 'Giá trị': 'ÔN TẬP KTGK1 - MÔN TIN HỌC 12' },
    { 'Chỉ tiêu': 'Bộ lọc hiển thị', 'Giá trị': filterLabel },
    { 'Chỉ tiêu': 'Tổng số lượt nộp bài', 'Giá trị': totalStudents },
    { 'Chỉ tiêu': 'Điểm trung bình', 'Giá trị': avgScore.toFixed(2) },
    { 'Chỉ tiêu': 'Điểm cao nhất', 'Giá trị': maxScore.toFixed(2) },
    { 'Chỉ tiêu': 'Điểm thấp nhất', 'Giá trị': minScore.toFixed(2) },
    { 'Chỉ tiêu': 'Số lượng Xuất sắc (≥ 9.0)', 'Giá trị': `${countXuatSac} (${totalStudents > 0 ? ((countXuatSac / totalStudents) * 100).toFixed(1) : 0}%)` },
    { 'Chỉ tiêu': 'Số lượng Giỏi (8.0 - 8.9)', 'Giá trị': `${countGioi} (${totalStudents > 0 ? ((countGioi / totalStudents) * 100).toFixed(1) : 0}%)` },
    { 'Chỉ tiêu': 'Số lượng Khá (6.5 - 7.9)', 'Giá trị': `${countKha} (${totalStudents > 0 ? ((countKha / totalStudents) * 100).toFixed(1) : 0}%)` },
    { 'Chỉ tiêu': 'Số lượng Trung bình (5.0 - 6.4)', 'Giá trị': `${countTrungBinh} (${totalStudents > 0 ? ((countTrungBinh / totalStudents) * 100).toFixed(1) : 0}%)` },
    { 'Chỉ tiêu': 'Số lượng Cần cố gắng (< 5.0)', 'Giá trị': `${countYeu} (${totalStudents > 0 ? ((countYeu / totalStudents) * 100).toFixed(1) : 0}%)` }
  ];

  const worksheet2 = XLSX.utils.json_to_sheet(summaryData);
  worksheet2['!cols'] = [
    { wch: 35 },
    { wch: 35 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet1, 'Danh sách điểm');
  XLSX.utils.book_append_sheet(workbook, worksheet2, 'Thống kê tổng quan');

  const safeFilter = filterLabel.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Bang_Diem_Tin12_${safeFilter}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  try {
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const success = triggerDownload(blob, fileName);
    return { success, fileName };
  } catch (e) {
    // Fallback to XLSX.writeFile
    XLSX.writeFile(workbook, fileName);
    return { success: true, fileName };
  }
}

/**
 * Export submissions to CSV (with UTF-8 BOM so Excel opens Vietnamese characters properly)
 */
export function exportSubmissionsToCSV(
  filteredSubmissions: StudentSubmission[], 
  filterLabel = 'Tất cả'
): { success: boolean; fileName: string } {
  const headers = ['STT', 'Họ và tên', 'Lớp', 'Thời gian nộp bài', 'Thời gian làm (phút)', 'Điểm P.I', 'Số câu đúng P.I', 'Điểm P.II', 'Số ý đúng P.II', 'Điểm P.III', 'Tổng điểm', 'Xếp loại', 'Nhận xét'];
  
  const rows = filteredSubmissions.map((s, idx) => [
    idx + 1,
    `"${s.studentName.replace(/"/g, '""')}"`,
    `"${s.studentClass}"`,
    `"${s.submittedAt}"`,
    Math.round(s.timeSpentSeconds / 60),
    s.scorePart1.toFixed(2),
    `"${s.correctPart1Count}/30"`,
    s.scorePart2.toFixed(2),
    `"${s.correctPart2SubCount}/24"`,
    s.scorePart3.toFixed(2),
    s.totalScore.toFixed(2),
    `"${s.gradeClassification}"`,
    `"${s.feedback.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const safeFilter = filterLabel.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Danh_Sach_Diem_Tin12_${safeFilter}.csv`;
  
  const success = triggerDownload(blob, fileName);
  return { success, fileName };
}

/**
 * Copy submissions as Tab-Separated Values (TSV) to clipboard
 * Perfect for direct copy-paste into Excel or Google Sheets!
 */
export async function copySubmissionsToClipboard(filteredSubmissions: StudentSubmission[]): Promise<boolean> {
  try {
    const headers = ['STT', 'Họ và tên', 'Lớp', 'Thời gian nộp', 'Thời gian làm (phút)', 'Điểm P.I', 'Số đúng P.I', 'Điểm P.II', 'Số đúng P.II', 'Điểm P.III', 'Tổng điểm', 'Xếp loại', 'Nhận xét'];
    
    const rows = filteredSubmissions.map((s, idx) => [
      idx + 1,
      s.studentName,
      s.studentClass,
      s.submittedAt,
      Math.round(s.timeSpentSeconds / 60),
      s.scorePart1.toFixed(2),
      `${s.correctPart1Count}/30`,
      s.scorePart2.toFixed(2),
      `${s.correctPart2SubCount}/24`,
      s.scorePart3.toFixed(2),
      s.totalScore.toFixed(2),
      s.gradeClassification,
      s.feedback
    ]);

    const tsvContent = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    await navigator.clipboard.writeText(tsvContent);
    return true;
  } catch (e) {
    console.error('Clipboard copy error:', e);
    return false;
  }
}

/**
 * Export single student score report to Excel
 */
export function exportSingleStudentToExcel(submission: StudentSubmission): boolean {
  const overviewData = [
    { 'Thông tin': 'Họ và tên học sinh', 'Chi tiết': submission.studentName },
    { 'Thông tin': 'Lớp', 'Chi tiết': submission.studentClass },
    { 'Thông tin': 'Thời gian nộp bài', 'Chi tiết': submission.submittedAt },
    { 'Thông tin': 'Thời gian làm bài', 'Chi tiết': `${Math.floor(submission.timeSpentSeconds / 60)} phút ${submission.timeSpentSeconds % 60} giây` },
    { 'Thông tin': 'Điểm Phần I (TN 4 lựa chọn)', 'Chi tiết': `${submission.scorePart1.toFixed(2)} đ (${submission.correctPart1Count}/30 câu đúng)` },
    { 'Thông tin': 'Điểm Phần II (Đúng / Sai)', 'Chi tiết': `${submission.scorePart2.toFixed(2)} đ (${submission.correctPart2SubCount}/24 ý đúng)` },
    { 'Thông tin': 'Điểm Phần III (Tự luận)', 'Chi tiết': `${submission.scorePart3.toFixed(2)} đ` },
    { 'Thông tin': 'TỔNG ĐIỂM ĐẠT ĐƯỢC', 'Chi tiết': `${submission.totalScore.toFixed(2)} / 10.0` },
    { 'Thông tin': 'Xếp loại', 'Chi tiết': submission.gradeClassification },
    { 'Thông tin': 'Nhận xét của hệ thống', 'Chi tiết': submission.feedback }
  ];

  const part1Details = MULTIPLE_CHOICE_QUESTIONS.map(q => {
    const studentAns = submission.answersPart1[q.id] || 'Chưa chọn';
    const isCorrect = studentAns === q.correctAnswer;
    return {
      'Câu': `Câu ${q.id}`,
      'Chủ đề': q.topic,
      'Đáp án đã chọn': studentAns,
      'Đáp án đúng': q.correctAnswer,
      'Kết quả': isCorrect ? 'ĐÚNG' : 'SAI',
      'Giải thích chi tiết': q.explanation
    };
  });

  const part2Details: any[] = [];
  TRUE_FALSE_QUESTIONS.forEach(q => {
    q.items.forEach(item => {
      const key = `${q.id}_${item.id}`;
      const studentVal = submission.answersPart2[key];
      const studentStr = studentVal === undefined ? 'Chưa trả lời' : (studentVal ? 'Đúng' : 'Sai');
      const correctStr = item.correctAnswer ? 'Đúng' : 'Sai';
      const isCorrect = studentVal === item.correctAnswer;
      part2Details.push({
        'Câu': `Câu ${q.id} - ý (${item.id})`,
        'Nội dung nhận định': item.text,
        'Học sinh chọn': studentStr,
        'Đáp án chuẩn': correctStr,
        'Kết quả': isCorrect ? 'ĐÚNG' : 'SAI',
        'Giải thích': item.explanation
      });
    });
  });

  const wsOverview = XLSX.utils.json_to_sheet(overviewData);
  const wsPart1 = XLSX.utils.json_to_sheet(part1Details);
  const wsPart2 = XLSX.utils.json_to_sheet(part2Details);

  wsOverview['!cols'] = [{ wch: 30 }, { wch: 50 }];
  wsPart1['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 55 }];
  wsPart2['!cols'] = [{ wch: 16 }, { wch: 45 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 55 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, wsOverview, 'Phiếu báo điểm');
  XLSX.utils.book_append_sheet(workbook, wsPart1, 'Chi tiết Phần I');
  XLSX.utils.book_append_sheet(workbook, wsPart2, 'Chi tiết Phần II');

  const safeName = submission.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Ket_Qua_${safeName}_${submission.studentClass}.xlsx`;

  try {
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return triggerDownload(blob, fileName);
  } catch (e) {
    XLSX.writeFile(workbook, fileName);
    return true;
  }
}
