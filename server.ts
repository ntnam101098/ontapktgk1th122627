import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial sample data to pre-populate if file is created for first time
const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-001',
    studentName: 'Nguyễn Văn An',
    studentClass: '12A1',
    submittedAt: '2026-10-25 14:35',
    timeSpentSeconds: 2150,
    scorePart1: 3.87,
    correctPart1Count: 29,
    scorePart2: 2.75,
    correctPart2SubCount: 23,
    scorePart3: 2.75,
    totalScore: 9.37,
    gradeClassification: 'Xuất sắc',
    feedback: 'Nắm vững kiến thức toàn bộ 7 bài, đặc biệt là lý thuyết AI và giao thức TCP/IP. Kỹ năng phân biệt thiết bị mạng xuất sắc.',
    answersPart1: {},
    answersPart2: {},
    answersPart3: {}
  },
  {
    id: 'sub-002',
    studentName: 'Trần Thị Mai',
    studentClass: '12A1',
    submittedAt: '2026-10-25 15:10',
    timeSpentSeconds: 2400,
    scorePart1: 3.6,
    correctPart1Count: 27,
    scorePart2: 2.5,
    correctPart2SubCount: 21,
    scorePart3: 2.5,
    totalScore: 8.6,
    gradeClassification: 'Giỏi',
    feedback: 'Kết quả rất tốt! Cần chú ý thêm về các thẻ đóng mở lồng ghép trong HTML và phân biệt IP với MAC.',
    answersPart1: {},
    answersPart2: {},
    answersPart3: {}
  },
  {
    id: 'sub-003',
    studentName: 'Lê Hoàng Nam',
    studentClass: '12A2',
    submittedAt: '2026-10-25 16:05',
    timeSpentSeconds: 2600,
    scorePart1: 3.2,
    correctPart1Count: 24,
    scorePart2: 2.1,
    correctPart2SubCount: 18,
    scorePart3: 2.25,
    totalScore: 7.55,
    gradeClassification: 'Khá',
    feedback: 'Đã nắm được các khái niệm cơ bản. Cần củng cố thêm phần cấu hình chia sẻ tài nguyên mạng LAN và vai trò Router vs Switch.',
    answersPart1: {},
    answersPart2: {},
    answersPart3: {}
  }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '15mb' }));

  // Centralized persistent storage file
  const DATA_DIR = path.join(__dirname, 'data');
  const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    try {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(INITIAL_SUBMISSIONS, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error creating initial submissions file:', e);
    }
  }

  function readSubmissions(): any[] {
    try {
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (err) {
      console.error('Error reading submissions from disk:', err);
      return [];
    }
  }

  function writeSubmissions(data: any[]): void {
    try {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing submissions to disk:', err);
    }
  }

  // --- API Endpoints for Centralized Submissions ---

  // 1. Get all submissions (all students, all devices, all times)
  app.get('/api/submissions', (req, res) => {
    try {
      const data = readSubmissions();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Submit new exam result or update existing
  app.post('/api/submissions', (req, res) => {
    try {
      const newSub = req.body;
      if (!newSub || !newSub.studentName) {
        return res.status(400).json({ success: false, error: 'Dữ liệu bài nộp không hợp lệ' });
      }

      const list = readSubmissions();
      // If student already has a submission with this ID or updating, replace it; else prepend
      const filtered = list.filter((item: any) => item.id !== newSub.id);
      const updated = [newSub, ...filtered];
      writeSubmissions(updated);

      console.log(`[SUBMIT] New submission received: ${newSub.studentName} (${newSub.studentClass}) - Score: ${newSub.totalScore}`);
      res.json({ success: true, data: newSub });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Update self-grading score or submission
  app.put('/api/submissions/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const list = readSubmissions();
      const updated = list.map((item: any) => item.id === id ? { ...item, ...updatedData } : item);
      writeSubmissions(updated);
      res.json({ success: true, data: updatedData });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Delete all submissions (admin only)
  app.delete('/api/submissions', (req, res) => {
    try {
      writeSubmissions([]);
      console.log(`[DELETE] All submissions cleared by Admin.`);
      res.json({ success: true, message: 'Đã xóa toàn bộ bài nộp trên hệ thống' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Reset mock data
  app.post('/api/submissions/reset', (req, res) => {
    try {
      writeSubmissions(INITIAL_SUBMISSIONS);
      console.log(`[RESET] Submissions reset to initial data.`);
      res.json({ success: true, data: INITIAL_SUBMISSIONS });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Static & Vite Serving ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
