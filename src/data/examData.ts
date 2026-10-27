export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic: string;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
}

export interface TrueFalseSubItem {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  correctAnswer: boolean; // true = Đúng, false = Sai
  level: string;
  explanation: string;
}

export interface TrueFalseQuestion {
  id: number;
  context: string;
  items: TrueFalseSubItem[];
  topic: string;
}

export interface EssaySubItem {
  id: 'a' | 'b' | 'c' | 'd';
  question: string;
  modelAnswer: string;
  maxScore: number;
}

export interface EssayQuestion {
  id: number;
  title: string;
  context?: string;
  items: EssaySubItem[];
  topic: string;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  submittedAt: string;
  timeSpentSeconds: number;
  scorePart1: number; // out of 4.0 (30 câu)
  correctPart1Count: number;
  scorePart2: number; // out of 3.0 (6 câu Đúng/Sai tính theo quy chế)
  correctPart2SubCount: number;
  scorePart3: number; // out of 3.0 (tự đánh giá hoặc chấm điểm)
  totalScore: number; // out of 10.0
  gradeClassification: string;
  feedback: string;
  answersPart1: Record<number, 'A' | 'B' | 'C' | 'D'>;
  answersPart2: Record<string, boolean>; // key: `${qId}_${subId}` -> true/false
  answersPart3: Record<string, string>; // key: `${qId}_${subId}` -> text
  selfGradingPart3?: Record<string, number>;
}

export const MULTIPLE_CHOICE_QUESTIONS: MultipleChoiceQuestion[] = [
  {
    id: 1,
    question: "Phát biểu nào sau đây nêu đúng khái niệm trí tuệ nhân tạo?",
    options: [
      { key: 'A', text: "Trí tuệ của máy tính có thể làm những công việc tương đương trí tuệ con người." },
      { key: 'B', text: "Tích hợp công nghệ hiện đại vào máy tính, giúp máy tính hiểu được con người." },
      { key: 'C', text: "Hoạt động máy tính giao tiếp được với con người bằng ngôn ngữ tự nhiên." },
      { key: 'D', text: "Khả năng của máy tính có thể làm những công việc mang tính trí tuệ con người." }
    ],
    correctAnswer: 'D',
    explanation: "Trí tuệ nhân tạo (AI - Artificial Intelligence) là khả năng của máy tính có thể làm những công việc mang tính trí tuệ của con người như học hỏi, suy luận, nhận thức môi trường và giải quyết vấn đề.",
    topic: "Bài 1. Làm quen với Trí tuệ nhân tạo",
    level: "Nhận biết"
  },
  {
    id: 2,
    question: "Đặc trưng nào sau đây KHÔNG PHẢI là đặc trưng cơ bản của hệ thống Trí tuệ nhân tạo hiện đại?",
    options: [
      { key: 'A', text: "Khả năng biểu diễn tri thức và suy luận." },
      { key: 'B', text: "Khả năng học từ dữ liệu." },
      { key: 'C', text: "Khả năng nhận thức môi trường xung quanh." },
      { key: 'D', text: "Khả năng cảm nhận và phản hồi cảm xúc như con người." }
    ],
    correctAnswer: 'D',
    explanation: "Các đặc trưng cơ bản của AI gồm: Khả năng biểu diễn tri thức, suy luận, học từ dữ liệu và nhận thức môi trường. AI hiện đại chưa có khả năng cảm nhận và có cảm xúc thực sự như con người.",
    topic: "Bài 1. Làm quen với Trí tuệ nhân tạo",
    level: "Nhận biết"
  },
  {
    id: 3,
    question: "Một ứng dụng dịch tự động như Google Dịch được xem là có khả năng học và suy luận vì lý do nào dưới đây?",
    options: [
      { key: 'A', text: "Có thể dịch được nhiều ngôn ngữ với độ chính xác tuyệt đối." },
      { key: 'B', text: "Liên tục cải thiện chất lượng dịch nhờ phản hồi và dữ liệu người dùng." },
      { key: 'C', text: "Chỉ dịch được những câu có sẵn trong cơ sở dữ liệu của hệ thống." },
      { key: 'D', text: "Có thể dịch văn bản ngay cả khi không có kết nối Internet." }
    ],
    correctAnswer: 'B',
    explanation: "Google Dịch áp dụng học máy (Machine Learning) dựa trên mô hình dữ liệu song ngữ khổng lồ, liên tục cải thiện và học hỏi độ chính xác nhờ dữ liệu và phản hồi của người dùng.",
    topic: "Bài 1. Làm quen với Trí tuệ nhân tạo",
    level: "Thông hiểu"
  },
  {
    id: 4,
    question: "Một hệ thống học tập trực tuyến có khả năng tự điều chỉnh bài giảng, gợi ý nội dung phù hợp với trình độ của từng học sinh. Hệ thống này thể hiện đặc trưng nào của trí tuệ nhân tạo (AI)?",
    options: [
      { key: 'A', text: "Khả năng lưu trữ và tìm kiếm thông tin nhanh chóng." },
      { key: 'B', text: "Khả năng học và thích ứng dựa trên dữ liệu người dùng." },
      { key: 'C', text: "Khả năng xử lý đồ họa và âm thanh trong thời gian thực." },
      { key: 'D', text: "Khả năng truyền tải dữ liệu qua Internet tốc độ cao." }
    ],
    correctAnswer: 'B',
    explanation: "Hệ thống phân tích lịch sử học tập, mức độ hiểu bài của người học để tự điều chỉnh lộ trình và gợi ý bài tập tương ứng, thể hiện đặc trưng 'học và thích ứng dựa trên dữ liệu người dùng'.",
    topic: "Bài 1. Làm quen với Trí tuệ nhân tạo",
    level: "Thông hiểu"
  },
  {
    id: 5,
    question: "Phương án nào sau đây nêu đúng lợi ích áp dụng AI vào lĩnh vực giao thông?",
    options: [
      { key: 'A', text: "Tăng tốc độ giới hạn trên đường cao tốc." },
      { key: 'B', text: "Quản lí lưu lượng xe và dự báo tình trạng giao thông." },
      { key: 'C', text: "Xây dựng các hệ thống đường hầm ngầm." },
      { key: 'D', text: "Giảm giá thành của phương tiện giao thông công cộng." }
    ],
    correctAnswer: 'B',
    explanation: "Trong giao thông, AI được dùng để điều phối đèn tín hiệu thông minh, quản lý luồng phương tiện, dự báo ùn tắc và hỗ trợ xe tự hành vận hành an toàn.",
    topic: "Bài 2. Trí tuệ nhân tạo trong khoa học và đời sống",
    level: "Nhận biết"
  },
  {
    id: 6,
    question: "Khái niệm AI tạo sinh (Generative AI) được hiểu là các hệ thống AI có khả năng chính nào sau đây?",
    options: [
      { key: 'A', text: "Tự động điều khiển hoàn toàn các phương tiện giao thông trên mọi tuyến đường" },
      { key: 'B', text: "Tự động tạo ra các nội dung mới như văn bản, hình ảnh, âm thanh" },
      { key: 'C', text: "Thay thế hoàn toàn nhận thức và đạo đức của con người" },
      { key: 'D', text: "Chẩn đoán chính xác tuyệt đối mọi loại bệnh trong y tế" }
    ],
    correctAnswer: 'B',
    explanation: "AI tạo sinh (Generative AI) như ChatGPT, Gemini, Midjourney,... có khả năng học từ khối lượng dữ liệu khổng lồ để tạo ra nội dung mới độc đáo như văn bản, hình ảnh, âm thanh, mã nguồn lập trình.",
    topic: "Bài 2. Trí tuệ nhân tạo trong khoa học và đời sống",
    level: "Nhận biết"
  },
  {
    id: 7,
    question: "Thiết bị mạng nào dưới đây đóng vai trò kết nối các máy tính trong cùng một mạng cục bộ (LAN) và chuyển dữ liệu dựa trên địa chỉ MAC?",
    options: [
      { key: 'A', text: "Switch." },
      { key: 'B', text: "Modem." },
      { key: 'C', text: "Router." },
      { key: 'D', text: "Access Point." }
    ],
    correctAnswer: 'A',
    explanation: "Switch (bộ chuyển mạch) kết nối các thiết bị trong cùng một mạng LAN và chuyển tiếp các khung dữ liệu chính xác đến cổng của thiết bị nhận dựa trên bảng địa chỉ MAC.",
    topic: "Bài 3. Một số thiết bị mạng thông dụng",
    level: "Nhận biết"
  },
  {
    id: 8,
    question: "Thiết bị nào dưới đây có chức năng biến đổi tín hiệu số thành tín hiệu tương tự để truyền qua đường truyền viễn thông và ngược lại?",
    options: [
      { key: 'A', text: "Switch." },
      { key: 'B', text: "Router." },
      { key: 'C', text: "Hub." },
      { key: 'D', text: "Modem." }
    ],
    correctAnswer: 'D',
    explanation: "Modem (Modulator - Demodulator / Bộ điều chế và giải điều chế) có chức năng chuyển đổi giữa tín hiệu số (digital) của máy tính và tín hiệu tương tự (analog/quang) trên đường truyền nhà mạng ISP.",
    topic: "Bài 3. Một số thiết bị mạng thông dụng",
    level: "Nhận biết"
  },
  {
    id: 9,
    question: "Thiết bị nào dưới đây có chức năng kết nối các mạng máy tính khác nhau và định tuyến các gói dữ liệu đến mạng đích?",
    options: [
      { key: 'A', text: "Switch." },
      { key: 'B', text: "Router." },
      { key: 'C', text: "Hub." },
      { key: 'D', text: "Modem." }
    ],
    correctAnswer: 'B',
    explanation: "Router (Bộ định tuyến) có chức năng kết nối các mạng con khác nhau và tìm đường đi tối ưu (định tuyến) cho các gói tin dựa trên địa chỉ IP.",
    topic: "Bài 3. Một số thiết bị mạng thông dụng",
    level: "Nhận biết"
  },
  {
    id: 10,
    question: "Phát biểu nào dưới đây là SAI khi nói về Hub và Switch?",
    options: [
      { key: 'A', text: "Switch hoạt động hiệu quả hơn Hub khi mạng có nhiều thiết bị hoặc lưu lượng cao." },
      { key: 'B', text: "Switch chỉ có thể thay thế cho Hub khi số thiết bị mạng lớn hay tần suất sử dụng mạng cao." },
      { key: 'C', text: "Trong mạng quy mô nhỏ, việc sử dụng Hub đơn giản và tiết kiệm hơn dùng Switch." },
      { key: 'D', text: "Hub không đáp ứng tốt như Switch khi mạng có nhiều thiết bị hoặc nhu cầu truyền dữ liệu lớn." }
    ],
    correctAnswer: 'B',
    explanation: "Phát biểu B sai vì Switch hoàn toàn có thể thay thế cho Hub ở bất kỳ quy mô nào (kể cả mạng nhỏ ít máy) nhằm nâng cao hiệu năng và tránh xung đột đường truyền.",
    topic: "Bài 3. Một số thiết bị mạng thông dụng",
    level: "Thông hiểu"
  },
  {
    id: 11,
    question: "Khái niệm nào dưới đây là chính xác về giao thức mạng?",
    options: [
      { key: 'A', text: "Là tập hợp các thiết bị dùng để kết nối và truyền dữ liệu giữa các máy tính trong mạng." },
      { key: 'B', text: "Là một chương trình phần mềm được cài đặt trên máy tính để quản lí việc gửi và nhận dữ liệu." },
      { key: 'C', text: "Là tập hợp các quy định về cách thức giao tiếp để truyền dữ liệu giữa các đối tượng tham gia truyền nhận dữ liệu qua mạng." },
      { key: 'D', text: "Là tập hợp các dịch vụ và ứng dụng giúp người dùng truy cập Internet và trao đổi thông tin." }
    ],
    correctAnswer: 'C',
    explanation: "Giao thức mạng (Network Protocol) là tập hợp các quy tắc, quy chuẩn xác định cách định dạng, truyền dẫn và xử lý dữ liệu giữa các thiết bị kết nối trong mạng.",
    topic: "Bài 4. Giao thức mạng",
    level: "Nhận biết"
  },
  {
    id: 12,
    question: "Phương án nào sau đây mô tả đúng sự khác biệt giữa địa chỉ IP và địa chỉ MAC?",
    options: [
      { key: 'A', text: "IP cố định; MAC có thể thay đổi." },
      { key: 'B', text: "IP xác định thiết bị; MAC định danh trong mạng cục bộ." },
      { key: 'C', text: "IP thay đổi theo mạng; MAC luôn cố định theo thiết bị." },
      { key: 'D', text: "IP và MAC đều do nhà sản xuất gán cho thiết bị." }
    ],
    correctAnswer: 'C',
    explanation: "Địa chỉ MAC là địa chỉ vật lý gắn cố định trên card mạng (NIC) do nhà sản xuất quy định. Địa chỉ IP là địa chỉ logic có thể thay đổi tùy thuộc vào vị trí kết nối mạng.",
    topic: "Bài 4. Giao thức mạng",
    level: "Thông hiểu"
  },
  {
    id: 13,
    question: "Phát biểu nào dưới đây là ĐÚNG khi nói đến sự khác biệt cơ bản về vai trò giữa giao thức IP và giao thức TCP?",
    options: [
      { key: 'A', text: "IP quy định cách gửi dữ liệu trong mạng nội bộ, còn TCP quy định cách gửi dữ liệu ra Internet toàn cầu." },
      { key: 'B', text: "IP chỉ đảm bảo chuyển dữ liệu giữa các mạng, còn TCP đảm bảo chuyển dữ liệu đến một ứng dụng cụ thể trên máy nhận." },
      { key: 'C', text: "IP chịu trách nhiệm gán địa chỉ vật lí cho thiết bị, còn TCP chịu trách nhiệm gán địa chỉ logic cho gói tin." },
      { key: 'D', text: "IP quản lí việc truyền dữ liệu trong cùng mạng, còn TCP quản lí việc định tuyến dữ liệu giữa các mạng khác nhau." }
    ],
    correctAnswer: 'B',
    explanation: "IP đảm nhận việc định tuyến và vận chuyển các gói tin giữa các host trên mạng, còn TCP phân chia/ghép gói tin, kiểm soát độ tin cậy và chuyển tiếp chính xác đến cổng (port) của ứng dụng nhận.",
    topic: "Bài 4. Giao thức mạng",
    level: "Thông hiểu"
  },
  {
    id: 14,
    question: "Khi kết nối thiết bị thông minh vào mạng máy tính, tùy chọn nào dưới đây cần được bật để thiết bị có thể phát hiện mạng?",
    options: [
      { key: 'A', text: "Airplane mode." },
      { key: 'B', text: "Network discovery." },
      { key: 'C', text: "Bluetooth." },
      { key: 'D', text: "Location services." }
    ],
    correctAnswer: 'B',
    explanation: "Tính năng Network discovery (Dò tìm mạng) trên hệ điều hành giúp máy tính nhìn thấy các thiết bị khác trong cùng mạng và cho phép các máy khác nhìn thấy máy mình.",
    topic: "Bài 5. Thực hành chia sẻ tài nguyên trên mạng",
    level: "Nhận biết"
  },
  {
    id: 15,
    question: "Loại tài nguyên nào sau đây không thể chia sẻ trong mạng LAN thông qua chức năng mạng của hệ điều hành?",
    options: [
      { key: 'A', text: "Máy in." },
      { key: 'B', text: "Thư mục." },
      { key: 'C', text: "Bàn phím và chuột." },
      { key: 'D', text: "Ổ đĩa." }
    ],
    correctAnswer: 'C',
    explanation: "Chức năng mạng mặc định của hệ điều hành cho phép chia sẻ tệp tin, thư mục, ổ đĩa và máy in dùng chung, nhưng không hỗ trợ chia sẻ bàn phím, chuột trực tiếp như tài nguyên hệ thống thông thường.",
    topic: "Bài 5. Thực hành chia sẻ tài nguyên trên mạng",
    level: "Nhận biết"
  },
  {
    id: 16,
    question: "Khi chia sẻ tài nguyên trong mạng cục bộ, hệ điều hành Windows khuyến nghị chọn chế độ mạng Private Network thay vì Public Network. Giải thích nào dưới đây là phù hợp cho việc chọn chế độ mạng?",
    options: [
      { key: 'A', text: "Vì Public Network tự động xóa dữ liệu chia sẻ sau khi khởi động lại máy tính." },
      { key: 'B', text: "Vì Private Network tự động tăng tốc độ truyền dữ liệu giữa các máy tính." },
      { key: 'C', text: "Vì Private Network phù hợp với mạng tin cậy, thuận lợi cho việc chia sẻ tệp và máy in." },
      { key: 'D', text: "Vì Public Network chỉ hỗ trợ mạng không dây, không hỗ trợ kết nối mạng có dây." }
    ],
    correctAnswer: 'C',
    explanation: "Private Network (Mạng riêng) mở các cổng tường lửa cho phép chia sẻ file và máy in trong môi trường mạng tin cậy (nhà, cơ quan), trong khi Public Network ẩn máy để bảo đảm an toàn ở nơi công cộng.",
    topic: "Bài 5. Thực hành chia sẻ tài nguyên trên mạng",
    level: "Thông hiểu"
  },
  {
    id: 17,
    question: "Phương án nào sau đây đúng về ưu điểm của giao tiếp trong không gian mạng?",
    options: [
      { key: 'A', text: "Chỉ diễn ra trong thời gian cố định." },
      { key: 'B', text: "Tiêu tốn nhiều thời gian và chi phí." },
      { key: 'C', text: "Có thể diễn ra mọi lúc, mọi nơi." },
      { key: 'D', text: "Hạn chế số lượng người tham gia." }
    ],
    correctAnswer: 'C',
    explanation: "Giao tiếp trong không gian mạng khắc phục khoảng cách không gian và thời gian, cho phép kết nối, trao đổi mọi lúc, mọi nơi và tiết kiệm đáng kể chi phí.",
    topic: "Bài 6. Giao tiếp & ứng xử trong không gian mạng",
    level: "Nhận biết"
  },
  {
    id: 18,
    question: "Hành vi nào dưới đây thể hiện trách nhiệm của người dùng khi tham gia mạng xã hội?",
    options: [
      { key: 'A', text: "Đăng tải thông tin tích cực, có ích cho cộng đồng." },
      { key: 'B', text: "Sử dụng ngôn từ xúc phạm người khác." },
      { key: 'C', text: "Chia sẻ thông tin sai sự thật." },
      { key: 'D', text: "Xâm phạm quyền riêng tư của người khác." }
    ],
    correctAnswer: 'A',
    explanation: "Đăng tải thông tin chính xác, tích cực và có giá trị cho cộng đồng là biểu hiện cụ thể của văn hóa số và tinh thần trách nhiệm của công dân trên không gian mạng.",
    topic: "Bài 6. Giao tiếp & ứng xử trong không gian mạng",
    level: "Nhận biết"
  },
  {
    id: 19,
    question: "Việc làm nào sau đây là KHÔNG đúng khi giao tiếp trong không gian mạng?",
    options: [
      { key: 'A', text: "Kiểm tra tính xác thực thông tin trước khi chia sẻ." },
      { key: 'B', text: "Kiềm chế cảm xúc, tôn trọng ý kiến người khác." },
      { key: 'C', text: "Sử dụng ngôn từ đúng mực để tranh luận." },
      { key: 'D', text: "Lan truyền tin tức sai lệch." }
    ],
    correctAnswer: 'D',
    explanation: "Lan truyền tin tức sai lệch, tin giả (fake news) gây hoang mang dư luận và là hành vi vi phạm pháp luật về an ninh mạng.",
    topic: "Bài 6. Giao tiếp & ứng xử trong không gian mạng",
    level: "Nhận biết"
  },
  {
    id: 20,
    question: "Biện pháp nào sau đây bảo vệ tài khoản cá nhân khi nhận được email yêu cầu cập nhật thông tin tài khoản ngân hàng qua một liên kết?",
    options: [
      { key: 'A', text: "Nhấp vào liên kết và nhập thông tin để kiểm tra xem email có hợp lệ không." },
      { key: 'B', text: "Liên hệ trực tiếp ngân hàng để xác minh trước khi hành động." },
      { key: 'C', text: "Chuyển tiếp email đó cho bạn bè để hỏi ý kiến mà không kiểm tra thêm." },
      { key: 'D', text: "Tắt máy tính ngay lập tức và không làm gì thêm để tránh rủi ro." }
    ],
    correctAnswer: 'B',
    explanation: "Đây là hình thức tấn công giả mạo (Phishing). Tuyệt đối không bấm vào link lạ; cách an toàn nhất là liên hệ hotline chính thức của ngân hàng để kiểm tra xác minh.",
    topic: "Bài 6. Giao tiếp & ứng xử trong không gian mạng",
    level: "Vận dụng"
  },
  {
    id: 21,
    question: "Phần tử nào trong HTML được xem là phần tử gốc (root) của toàn bộ trang web?",
    options: [
      { key: 'A', text: "<head>" },
      { key: 'B', text: "<body>" },
      { key: 'C', text: "<html>" },
      { key: 'D', text: "<title>" }
    ],
    correctAnswer: 'C',
    explanation: "Thẻ <html>...</html> là phần tử gốc (root element), bao bọc toàn bộ mã nguồn của trang web HTML.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Nhận biết"
  },
  {
    id: 22,
    question: "Phần nội dung hiển thị trên thanh tiêu đề của cửa sổ trình duyệt được đặt trong cặp thẻ HTML nào dưới đây?",
    options: [
      { key: 'A', text: "<head></head>." },
      { key: 'B', text: "<body></body>." },
      { key: 'C', text: "<html></html>." },
      { key: 'D', text: "<title></title>." }
    ],
    correctAnswer: 'D',
    explanation: "Thẻ <title> nằm trong cặp thẻ <head>, dùng để đặt tiêu đề cho trang web hiển thị trên tab/thanh tiêu đề của trình duyệt.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Nhận biết"
  },
  {
    id: 23,
    question: "Trong cấu trúc cơ bản của trang web HTML, phần tử nào chứa các thông tin được hiển thị trực tiếp trên trang web?",
    options: [
      { key: 'A', text: "<body>...</body>" },
      { key: 'B', text: "<head>...</head>" },
      { key: 'C', text: "<title>...</title>" },
      { key: 'D', text: "<html>...</html>" }
    ],
    correctAnswer: 'A',
    explanation: "Phần thân <body>...</body> chứa tất cả nội dung hiển thị cho người xem như văn bản, hình ảnh, âm thanh, video, liên kết và bảng biểu.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Nhận biết"
  },
  {
    id: 24,
    question: "Khi soạn thảo văn bản HTML, muốn xuống dòng thì thực hiện cách nào dưới đây?",
    options: [
      { key: 'A', text: "Nhấn phím Enter." },
      { key: 'B', text: "Dùng thẻ <br>." },
      { key: 'C', text: "Dùng thẻ <hr>." },
      { key: 'D', text: "Dùng thẻ <qr>." }
    ],
    correctAnswer: 'B',
    explanation: "Thẻ <br> (break) được dùng để ngắt và xuống dòng văn bản trong HTML mà không tạo thêm khoảng cách đoạn lớn như thẻ <p>.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Nhận biết"
  },
  {
    id: 25,
    question: "Thẻ HTML nào sau đây được sử dụng để chèn một đường kẻ ngang phân cách trên trang web?",
    options: [
      { key: 'A', text: "<br/>." },
      { key: 'B', text: "<hr/>." },
      { key: 'C', text: "<qr/>." },
      { key: 'D', text: "<dr/>." }
    ],
    correctAnswer: 'B',
    explanation: "Thẻ <hr/> (horizontal rule) dùng để chèn một đường phân cách ngang giữa các khối nội dung trên trang web.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Nhận biết"
  },
  {
    id: 26,
    question: "Cặp thẻ HTML nào sau đây dùng để tạo tiêu đề văn bản có kích thước lớn nhất?",
    options: [
      { key: 'A', text: "<h1>...</h1>" },
      { key: 'B', text: "<h6>...</h6>" },
      { key: 'C', text: "<p>...</p>" },
      { key: 'D', text: "<title>...</title>" }
    ],
    correctAnswer: 'A',
    explanation: "HTML hỗ trợ 6 cấp tiêu đề từ <h1> đến <h6>, trong đó <h1> có kích thước chữ lớn nhất và mức độ ưu tiên cao nhất.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Nhận biết"
  },
  {
    id: 27,
    question: "Phần tử HTML nào sau đây viết đúng cú pháp?",
    options: [
      { key: 'A', text: "<title>Trái cây Việt Nam<title>" },
      { key: 'B', text: "<p> Xin chào các bạn!" },
      { key: 'C', text: "<p> Ngôn ngữ Python</p>" },
      { key: 'D', text: "</h1> Trang web và HTML <h1>" }
    ],
    correctAnswer: 'C',
    explanation: "Phương án C đúng vì có đầy đủ thẻ mở <p>, nội dung văn bản và thẻ đóng tương ứng </p> theo đúng chuẩn cú pháp.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Thông hiểu"
  },
  {
    id: 28,
    question: "Đoạn mã HTML nào sau đây được viết đúng cú pháp?",
    options: [
      { key: 'A', text: "<b><i>Tin học 12</b></i>" },
      { key: 'B', text: "<p><br>Tin học 12</br></p>" },
      { key: 'C', text: "</b></i>Tin học 12<i><b>" },
      { key: 'D', text: "<b><i>Tin học 12</i></b>" }
    ],
    correctAnswer: 'D',
    explanation: "Theo nguyên tắc lồng thẻ trong HTML, thẻ nào mở trước thì đóng sau: <b> được mở trước <i>, nên <i> phải được đóng trước (</i>) rồi mới đến (</b>).",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Thông hiểu"
  },
  {
    id: 29,
    question: "Phát biểu nào sau đây phân biệt đúng giữa thẻ HTML (tag) và phần tử HTML (element)?",
    options: [
      { key: 'A', text: "Thẻ HTML gồm thẻ mở, thẻ đóng và nội dung bên trong, còn phần tử HTML chỉ là ký hiệu nằm trong dấu < >." },
      { key: 'B', text: "Thẻ HTML là ký hiệu đánh dấu được viết trong dấu < >, còn phần tử HTML là cấu trúc gồm thẻ mở, nội dung và thẻ đóng." },
      { key: 'C', text: "Thẻ HTML là toàn bộ nội dung của trang web, còn phần tử HTML chỉ dùng để định dạng văn bản." },
      { key: 'D', text: "Thẻ HTML và phần tử HTML là hai khái niệm hoàn toàn giống nhau, có thể sử dụng thay thế cho nhau trong mọi trường hợp." }
    ],
    correctAnswer: 'B',
    explanation: "Thẻ HTML (tag) là các từ khóa đặt trong dấu ngoặc nhọn như <p>, </p>. Phần tử HTML (element) bao gồm từ thẻ mở, nội dung cho đến thẻ đóng hoàn chỉnh.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Thông hiểu"
  },
  {
    id: 30,
    question: "Quan sát đoạn mã HTML sau:\n<html>\n<head>\n  <title>Thử nghiệm thẻ p</title>\n</head>\n<body>\n  <p>Xin chào các bạn</p>\n  <p>học sinh lớp 12</p>\n</body>\n</html>\n\nTrên trình duyệt sẽ hiển thị kết quả nào dưới đây?",
    codeSnippet: `<html>\n<head>\n  <title>Thử nghiệm thẻ p</title>\n</head>\n<body>\n  <p>Xin chào các bạn</p>\n  <p>học sinh lớp 12</p>\n</body>\n</html>`,
    options: [
      { key: 'A', text: "Hai dòng văn bản “Xin chào các bạn” và “học sinh lớp 12” nằm trên cùng một dòng." },
      { key: 'B', text: "Hai dòng văn bản “Xin chào các bạn” và “học sinh lớp 12” nằm trên hai dòng riêng biệt." },
      { key: 'C', text: "Chỉ dòng đầu tiên “Xin chào các bạn” được hiển thị trên trang." },
      { key: 'D', text: "Cả hai dòng văn bản đều không hiển thị trên trang web do lỗi cú pháp." }
    ],
    correctAnswer: 'B',
    explanation: "Thẻ <p> là phần tử dạng khối (block element), mỗi khối đoạn văn bản sẽ tự động bắt đầu trên một dòng mới và có khoảng cách lề trên/dưới.",
    topic: "Bài 7. HTML và cấu trúc trang web",
    level: "Thông hiểu"
  }
];

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    id: 1,
    context: "Trường THPT X triển khai một hệ thống chatbot trợ lý học tập tích hợp AI để giải đáp thắc mắc bài tập Tin học cho học sinh và phân tích lịch sử làm bài để gợi ý tài liệu ôn luyện phù hợp. Nhóm học sinh đưa ra các nhận định sau:",
    topic: "Bài 1 & 2. Trí tuệ nhân tạo",
    items: [
      {
        id: 'a',
        text: "Chatbot trợ lý học tập trong hệ thống là một ví dụ minh họa cho ứng dụng AI hẹp.",
        correctAnswer: true,
        level: "Nhận biết",
        explanation: "Đúng. Chatbot được huấn luyện cho một miền nhiệm vụ cụ thể (giải đáp thắc mắc Tin học), thuộc loại AI hẹp (Narrow AI / Weak AI)."
      },
      {
        id: 'b',
        text: "Khả năng tự đưa ra gợi ý bài tập phù hợp dựa trên kết quả bài làm thể hiện năng lực “Hiểu ngôn ngữ” của AI.",
        correctAnswer: false,
        level: "Nhận biết",
        explanation: "Sai. Việc đưa ra gợi ý dựa trên phân tích kết quả bài tập thể hiện năng lực 'học từ dữ liệu và suy luận', không đơn thuần chỉ là năng lực hiểu ngôn ngữ tự nhiên."
      },
      {
        id: 'c',
        text: "Khi chatbot đưa ra câu trả lời chưa chính xác, học sinh cần kiểm tra và đối chiếu thông tin với các nguồn đáng tin cậy thay vì hoàn toàn tin tưởng vào kết quả do AI cung cấp.",
        correctAnswer: true,
        level: "Thông hiểu",
        explanation: "Đúng. AI có thể gặp hiện tượng ảo giác (hallucination) hoặc dữ liệu huấn luyện chưa cập nhật, người học cần có tư duy phản biện và đối chiếu nguồn chuẩn."
      },
      {
        id: 'd',
        text: "Để bảo đảm tính khách quan, nhà trường cần kiểm tra và đánh giá các gợi ý của chatbot trước khi sử dụng để điều chỉnh nội dung ôn luyện cho học sinh.",
        correctAnswer: true,
        level: "Vận dụng",
        explanation: "Đúng. Cần có sự giám sát của giáo viên chuyên môn để đảm bảo các đề xuất học tập phù hợp chương trình và sư phạm."
      }
    ]
  },
  {
    id: 2,
    context: "Một hợp tác xã nông nghiệp triển khai hệ thống AI sử dụng camera và cảm biến để nhận diện sâu bệnh trên cây trồng, theo dõi độ ẩm đất, phân tích dữ liệu thời tiết nhằm dự đoán năng suất và đề xuất thời điểm tưới nước phù hợp. Nhóm học sinh đưa ra các nhận định sau:",
    topic: "Bài 2. Ứng dụng AI trong khoa học và đời sống",
    items: [
      {
        id: 'a',
        text: "Hệ thống AI sử dụng camera để nhận diện sâu bệnh trên lá cây là một ví dụ về ứng dụng AI trong nhận dạng hình ảnh.",
        correctAnswer: true,
        level: "Nhận biết",
        explanation: "Đúng. Sử dụng camera chụp lá cây và mô hình thị giác máy tính (computer vision) để phát hiện sâu bệnh là ứng dụng nhận dạng hình ảnh."
      },
      {
        id: 'b',
        text: "AI trong nông nghiệp chỉ được ứng dụng để nhận diện hình ảnh cây trồng, không thể phân tích dữ liệu.",
        correctAnswer: false,
        level: "Nhận biết",
        explanation: "Sai. AI có thể phân tích nhiều loại dữ liệu: độ ẩm đất, thời tiết, cảm biến hóa chất, dự báo sản lượng và tối ưu phân bón."
      },
      {
        id: 'c',
        text: "Người nông dân cần kiểm tra tình trạng thực tế của cây trồng và đối chiếu với kết quả phân tích của AI trước khi quyết định biện pháp xử lí sâu bệnh.",
        correctAnswer: true,
        level: "Thông hiểu",
        explanation: "Đúng. Cần kết hợp quan sát thực tế và kinh nghiệm để đưa ra quyết định xử lý an toàn, tránh phụ thuộc mù quáng."
      },
      {
        id: 'd',
        text: "Để nâng cao hiệu quả sản xuất, hợp tác xã cần đánh giá độ chính xác của hệ thống AI, kiểm tra các khuyến nghị trước khi áp dụng.",
        correctAnswer: true,
        level: "Vận dụng",
        explanation: "Đúng. Việc đánh giá và tinh chỉnh mô hình AI giúp giảm sai sót và đảm bảo hiệu quả kinh tế lâu dài."
      }
    ]
  },
  {
    id: 3,
    context: "Khi tìm hiểu về bộ giao thức TCP/IP và quá trình truyền dữ liệu trên mạng Internet giữa hai máy tính khác vùng địa lý, nhóm học sinh đưa ra các phát biểu sau:",
    topic: "Bài 4. Giao thức mạng TCP/IP",
    items: [
      {
        id: 'a',
        text: "TCP/IP là bộ giao thức truyền thông tiêu chuẩn được sử dụng trên mạng Internet toàn cầu.",
        correctAnswer: true,
        level: "Nhận biết",
        explanation: "Đúng. TCP/IP là bộ giao thức nền tảng chuẩn quốc tế cho mạng toàn cầu Internet."
      },
      {
        id: 'b',
        text: "Giao thức IP chịu trách nhiệm kiểm soát luồng dữ liệu và đảm bảo các gói tin đến đúng thứ tự.",
        correctAnswer: false,
        level: "Nhận biết",
        explanation: "Sai. IP chỉ định tuyến và gửi gói tin theo kiểu best-effort (không bảo đảm thứ tự hay tin cậy). Chính TCP mới chịu trách nhiệm kiểm soát luồng, sửa lỗi và sắp xếp lại thứ tự gói tin."
      },
      {
        id: 'c',
        text: "Các máy tính khác nhau về phần cứng và hệ điều hành vẫn trao đổi thông tin được nhờ tuân thủ cùng bộ giao thức TCP/IP.",
        correctAnswer: true,
        level: "Thông hiểu",
        explanation: "Đúng. Nhờ chuẩn giao thức chung TCP/IP, các thiết bị với kiến trúc phần cứng và hệ điều hành khác biệt (Windows, Linux, macOS, iOS, Android) vẫn giao tiếp thông suốt."
      },
      {
        id: 'd',
        text: "Khi máy gửi đóng gói dữ liệu để gửi đi, giao thức TCP chia nhỏ dữ liệu thành các gói tin và giao thức IP gán địa chỉ IP đích để Router định tuyến.",
        correctAnswer: true,
        level: "Vận dụng",
        explanation: "Đúng. TCP chia nhỏ dòng byte thành các segment, sau đó chuyển xuống tầng mạng nơi IP đóng gói vào packet có gắn IP đích để router định tuyến."
      }
    ]
  },
  {
    id: 4,
    context: "Trong giờ thực hành Tin học, học sinh sử dụng máy MAY_01 để chia sẻ thư mục TAI_LIEU cho các máy tính khác trong mạng LAN phòng máy. Sau khi thiết lập chia sẻ và phân quyền truy cập, nhóm học sinh đưa ra các khẳng định sau:",
    topic: "Bài 5. Thực hành chia sẻ tài nguyên trên mạng",
    items: [
      {
        id: 'a',
        text: "Để các máy tính khác trong cùng mạng LAN có thể phát hiện máy MAY_01, tùy chọn Network discovery trong cửa sổ Advanced sharing settings phải tắt (Off).",
        correctAnswer: false,
        level: "Nhận biết",
        explanation: "Sai. Tùy chọn Network discovery phải được bật (On) thì các máy khác mới có thể dò tìm và thấy máy MAY_01."
      },
      {
        id: 'b',
        text: "Khi chia sẻ thư mục TAI_LIEU trên Windows, hệ điều hành mặc định cấp quyền Read/Write cho tất cả người dùng trong mạng.",
        correctAnswer: false,
        level: "Nhận biết",
        explanation: "Sai. Windows mặc định cấp quyền Read (Chỉ đọc) để đảm bảo an toàn cho dữ liệu, không tự động cấp quyền Write/Chỉnh sửa."
      },
      {
        id: 'c',
        text: "Khi thư mục TAI_LIEU trên MAY_01 được cấp quyền Read cho Everyone, học sinh dùng MAY_02 có thể xem nhưng không thể chỉnh sửa và lưu thay đổi vào tệp gốc.",
        correctAnswer: true,
        level: "Thông hiểu",
        explanation: "Đúng. Quyền Read cho phép mở xem và sao chép về máy cá nhân, nhưng ngăn chặn việc ghi đè hay xóa tệp gốc trên máy chia sẻ."
      },
      {
        id: 'd',
        text: "Để truy cập nhanh thư mục TAI_LIEU trên MAY_01, học sinh có thể nhập đường dẫn \\\\MAY_01\\TAI_LIEU vào thanh địa chỉ File Explorer trên MAY_02.",
        correctAnswer: true,
        level: "Vận dụng",
        explanation: "Đúng. Đây là cú pháp chuẩn đường dẫn UNC (Universal Naming Convention) để truy cập tài nguyên mạng: \\\\Tên_máy_chủ\\Tên_thư_mục_chia_sẻ."
      }
    ]
  },
  {
    id: 5,
    context: "Học sinh Minh tham gia nhóm thảo luận học tập trên mạng xã hội. Khi một bạn đưa ra ý kiến trái chiều, một số thành viên trong nhóm đã dùng lời lẽ xúc phạm và đăng công khai số điện thoại, địa chỉ nhà của bạn đó lên mạng. Minh đưa ra nhận xét:",
    topic: "Bài 6. Giao tiếp & ứng xử trong không gian mạng",
    items: [
      {
        id: 'a',
        text: "Việc tự ý công khai thông tin cá nhân của người khác khi chưa được sự đồng ý là vi phạm pháp luật và quyền riêng tư.",
        correctAnswer: true,
        level: "Nhận biết",
        explanation: "Đúng. Luật An ninh mạng và Bộ luật Dân sự nghiêm cấm việc tự ý phát tán thông tin đời tư, cá nhân khi chưa được cho phép (Doxxing)."
      },
      {
        id: 'b',
        text: "Hành vi dùng lời lẽ xúc phạm người khác trên nhóm thảo luận thể hiện sự thiếu văn hóa và vi phạm quy tắc ứng xử mạng.",
        correctAnswer: true,
        level: "Nhận biết",
        explanation: "Đúng. Hành vi lăng mạ, bạo lực mạng vi phạm bộ quy tắc ứng xử trên mạng xã hội và đạo đức giao tiếp."
      },
      {
        id: 'c',
        text: "Bảo vệ thông tin cá nhân giúp giảm thiểu nguy cơ bị kẻ xấu lợi dụng lừa đảo tài chính hoặc tống tiền.",
        correctAnswer: true,
        level: "Thông hiểu",
        explanation: "Đúng. Lộ số điện thoại và thông tin cá nhân có thể dẫn tới các vụ lừa đảo qua mạng, quấy rối và đe dọa tống tiền."
      },
      {
        id: 'd',
        text: "Minh nên lưu lại bằng chứng về hành vi xúc phạm và công khai thông tin cá nhân, đồng thời báo cáo nội dung vi phạm với quản trị viên nhóm để có biện pháp xử lí phù hợp.",
        correctAnswer: true,
        level: "Vận dụng",
        explanation: "Đúng. Đây là cách xử lý văn minh, tỉnh táo và bảo vệ nạn nhân theo đúng quy trình xử lý vi phạm mạng."
      }
    ]
  },
  {
    id: 6,
    context: "Học sinh Bình tìm hiểu về ngôn ngữ HTML để soạn thảo một trang web đơn giản hiển thị thông tin lớp học. Bình viết đoạn mã và đưa ra các nhận xét sau:",
    topic: "Bài 7. HTML và cấu trúc trang web",
    items: [
      {
        id: 'a',
        text: "HTML là ngôn ngữ đánh dấu siêu văn bản dùng để định dạng cấu trúc và nội dung trang web.",
        correctAnswer: true,
        level: "Nhận biết",
        explanation: "Đúng. HTML (HyperText Markup Language) là ngôn ngữ chuẩn để định dạng cấu trúc nội dung trang web."
      },
      {
        id: 'b',
        text: "Thẻ <title> dùng để khai báo tiêu đề trang web và nội dung này hiển thị trực tiếp trong vùng body của trình duyệt.",
        correctAnswer: false,
        level: "Nhận biết",
        explanation: "Sai. Thẻ <title> nằm trong cặp thẻ <head>, nội dung hiển thị trên thanh tiêu đề hoặc tab của trình duyệt, không hiển thị trong vùng nội dung body."
      },
      {
        id: 'c',
        text: "Thẻ <br> dùng để xuống dòng trong văn bản, trong khi thẻ <p> dùng để tạo một đoạn văn hoàn chỉnh.",
        correctAnswer: true,
        level: "Thông hiểu",
        explanation: "Đúng. Thẻ <br> ngắt dòng đơn thuần, còn <p> là đoạn văn bản độc lập có căn lề trước sau."
      },
      {
        id: 'd',
        text: "Đoạn mã <h1><b>Tin học 12</h1></b> viết đúng quy tắc lồng ghép thẻ trong chuẩn ngôn ngữ HTML.",
        correctAnswer: false,
        level: "Vận dụng",
        explanation: "Sai. Viết sai quy tắc lồng thẻ. Thẻ <b> được mở sau <h1> thì phải đóng trước: <h1><b>Tin học 12</b></h1>."
      }
    ]
  }
];

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  {
    id: 1,
    title: "Ứng dụng trợ lý học tập AI trong nhà trường",
    context: "Trường THPT X triển khai hệ thống trợ lý học tập thông minh có khả năng phân tích câu trả lời của học sinh trong các bài kiểm tra trực tuyến, nhận biết những kiến thức học sinh còn hạn chế và gợi ý tài liệu ôn tập phù hợp. Dựa trên tình huống và kiến thức bài học, em hãy trả lời ngắn gọn các câu hỏi sau:",
    topic: "Bài 1 & 2. Trí tuệ nhân tạo (AI)",
    items: [
      {
        id: 'a',
        question: "Hệ thống trợ lý học tập sử dụng công nghệ nào để phân tích câu trả lời và gợi ý tài liệu ôn tập cho học sinh?",
        modelAnswer: "Hệ thống sử dụng công nghệ trí tuệ nhân tạo (AI), có khả năng phân tích câu trả lời và đề xuất tài liệu ôn tập phù hợp.",
        maxScore: 0.25
      },
      {
        id: 'b',
        question: "Vì sao hệ thống trợ lý học tập có thể phân tích câu trả lời và đưa ra gợi ý phù hợp, trong khi phần mềm thông thường chỉ thực hiện các chức năng được lập trình sẵn?",
        modelAnswer: "Hệ thống AI có khả năng phân tích dữ liệu câu trả lời, nhận biết những kiến thức học sinh còn hạn chế và dựa vào kết quả phân tích để đưa ra gợi ý phù hợp (học máy, thích ứng). Phần mềm thông thường chủ yếu thực hiện các chức năng theo quy tắc hoặc chương trình cố định đã được thiết lập.",
        maxScore: 0.25
      },
      {
        id: 'c',
        question: "Hệ thống trợ lý học tập thông minh thuộc loại trí tuệ nhân tạo hẹp (AI yếu) hay trí tuệ nhân tạo tổng quát (AI mạnh)? Vì sao?",
        modelAnswer: "Hệ thống thuộc loại trí tuệ nhân tạo hẹp (AI yếu) vì được thiết kế để thực hiện những nhiệm vụ cụ thể trong học tập, chưa có khả năng thực hiện đa dạng các nhiệm vụ trí tuệ toàn diện như con người.",
        maxScore: 0.25
      },
      {
        id: 'd',
        question: "Theo em, nhà trường cần thực hiện những biện pháp nào để bảo vệ thông tin cá nhân và kết quả học tập của học sinh khi sử dụng hệ thống trợ lý học tập thông minh?",
        modelAnswer: "Nhà trường cần bảo mật dữ liệu học tập, mã hóa lưu trữ, giới hạn quyền truy cập, sử dụng thông tin đúng mục đích giáo dục, không tự ý chia sẻ thông tin cá nhân và kết quả học tập của học sinh cho bên thứ ba không có thẩm quyền.",
        maxScore: 0.25
      }
    ]
  },
  {
    id: 2,
    title: "Ứng dụng Camera thông minh điểm danh học sinh",
    context: "Trường THPT X đưa vào sử dụng camera thông minh điểm danh học sinh bằng khuôn mặt ở cổng trường. Dựa trên tình huống và kiến thức bài học, em hãy trả lời ngắn gọn các câu hỏi sau:",
    topic: "Bài 1 & 2. Trí tuệ nhân tạo (AI)",
    items: [
      {
        id: 'a',
        question: "Camera thông minh sử dụng công nghệ nào để xác định danh tính học sinh khi điểm danh?",
        modelAnswer: "Camera thông minh sử dụng công nghệ nhận dạng khuôn mặt (Face Recognition), thuộc lĩnh vực thị giác máy tính trong trí tuệ nhân tạo (AI).",
        maxScore: 0.25
      },
      {
        id: 'b',
        question: "Vì sao camera thông minh có thể nhận dạng khuôn mặt học sinh, trong khi camera thông thường chỉ ghi lại hình ảnh?",
        modelAnswer: "Camera thông minh được tích hợp hệ thống AI có khả năng trích xuất đặc trưng khuôn mặt (khoảng cách mắt, mũi, cằm) và đối chiếu với cơ sở dữ liệu đã lưu để xác định danh tính. Camera thông thường chủ yếu chỉ ghi lại tín hiệu hình ảnh mà không tự phân tích hay xử lý dữ liệu.",
        maxScore: 0.25
      },
      {
        id: 'c',
        question: "Hệ thống camera điểm danh bằng khuôn mặt thuộc loại trí tuệ nhân tạo hẹp (AI yếu) hay trí tuệ nhân tạo tổng quát (AI mạnh)? Vì sao?",
        modelAnswer: "Hệ thống thuộc loại trí tuệ nhân tạo hẹp (AI yếu) vì chuyên biệt thực hiện một tác vụ cụ thể là nhận dạng khuôn mặt và điểm danh học sinh, không có ý thức hay khả năng thực hiện các tác vụ trí tuệ đa dạng khác của con người.",
        maxScore: 0.25
      },
      {
        id: 'd',
        question: "Theo em, nhà trường cần thực hiện những biện pháp nào để hạn chế nguy cơ lộ thông tin cá nhân của học sinh khi sử dụng hệ thống camera điểm danh bằng khuôn mặt?",
        modelAnswer: "Nhà trường cần bảo vệ dữ liệu sinh trắc học khuôn mặt, mã hóa đường truyền và lưu trữ an toàn, phân quyền truy cập nghiêm ngặt, chỉ dùng cho mục đích điểm danh nội bộ và tuyệt đối không chia sẻ cho bên ngoài.",
        maxScore: 0.25
      }
    ]
  },
  {
    id: 3,
    title: "Thiết bị mạng máy tính thông dụng",
    context: "Sử dụng các kiến thức về thiết bị mạng máy tính, em hãy thực hiện các yêu cầu sau:",
    topic: "Bài 3. Một số thiết bị mạng thông dụng",
    items: [
      {
        id: 'a',
        question: "Phân biệt vai trò kết nối của Switch và Router trong mạng máy tính.",
        modelAnswer: "Switch kết nối các thiết bị trong cùng mạng nội bộ LAN (chuyển tiếp gói tin theo địa chỉ MAC); Router kết nối các mạng khác nhau (mạng LAN với Internet) và định tuyến gói dữ liệu dựa trên địa chỉ IP.",
        maxScore: 0.25
      },
      {
        id: 'b',
        question: "Nêu chức năng chính của thiết bị Modem.",
        modelAnswer: "Modem chuyển đổi (điều chế/giải điều chế) tín hiệu số từ máy tính thành tín hiệu tương tự/quang để truyền qua đường truyền viễn thông của nhà mạng ISP và ngược lại.",
        maxScore: 0.25
      },
      {
        id: 'c',
        question: "Giải thích vì sao trong mạng LAN phòng máy, người ta ưu tiên dùng Switch thay vì Hub.",
        modelAnswer: "Switch gửi dữ liệu chính xác đến đúng cổng máy nhận dựa trên địa chỉ MAC, giúp tránh xung đột tín hiệu (collision domain riêng) và tối ưu băng thông mạng. Ngược lại, Hub phát tán (broadcast) tín hiệu ra tất cả các cổng gây xung đột và nghẽn mạng.",
        maxScore: 0.25
      },
      {
        id: 'd',
        question: "Giải thích nguyên nhân vì sao một máy tính kết nối thông suốt với Switch vẫn không thể truy cập Internet nếu Modem bị ngắt kết nối.",
        modelAnswer: "Switch chỉ có chức năng liên lạc nội bộ trong mạng LAN. Muốn truy cập Internet toàn cầu phải có Modem để kết nối và chuyển đổi tín hiệu với nhà cung cấp dịch vụ Internet (ISP). Khi ngắt Modem, mạng LAN mất đường ra Internet bên ngoài.",
        maxScore: 0.25
      }
    ]
  },
  {
    id: 4,
    title: "Giao thức mạng và hạ tầng kết nối",
    context: "Trường THPT X nâng cấp hạ tầng mạng để phục vụ công tác quản lý dạy học và tra cứu tài liệu trực tuyến. Em hãy thực hiện các yêu cầu sau:",
    topic: "Bài 4. Giao thức mạng",
    items: [
      {
        id: 'a',
        question: "Phân biệt vai trò của địa chỉ IP (Internet Protocol) và địa chỉ MAC (Media Access Control) trong việc truyền dữ liệu giữa các máy tính.",
        modelAnswer: "Địa chỉ MAC là địa chỉ vật lý duy nhất được gắn cố định vào card mạng khi sản xuất. Địa chỉ IP là địa chỉ logic có thể thay đổi tùy mạng kết nối, dùng để định danh và định tuyến gói tin giữa các mạng khác nhau.",
        maxScore: 0.25
      },
      {
        id: 'b',
        question: "So sánh ưu điểm và hạn chế của kết nối mạng có dây (Ethernet) so với kết nối không dây (Wi-Fi) trong phòng máy tính.",
        modelAnswer: "- Mạng có dây: Tốc độ cao, đường truyền ổn định, độ bảo mật cao, ít bị can nhiễu; hạn chế: tính linh hoạt kém, đi dây phức tạp.\n- Wi-Fi: Linh hoạt, kết nối tiện lợi không cần dây; hạn chế: tốc độ phụ thuộc khoảng cách, dễ bị nhiễu sóng và suy giảm khi nhiều thiết bị truy cập đồng thời.",
        maxScore: 0.25
      },
      {
        id: 'c',
        question: "Giải thích hiện tượng: Khi nhiều học sinh cùng kết nối Wi-Fi phòng máy để xem video bài giảng chuẩn HD thì mạng bị giật lag, mặc dù biểu tượng sóng Wi-Fi vẫn báo đầy vạch.",
        modelAnswer: "Sóng Wi-Fi đầy vạch chỉ phản ánh cường độ tín hiệu sóng vô tuyến giữa máy và Access Point rất tốt. Tuy nhiên tổng băng thông của đường truyền Internet hoặc công suất xử lý đồng thời của Access Point có hạn; khi quá nhiều máy cùng xem video HD sẽ gây nghẽn băng thông.",
        maxScore: 0.25
      },
      {
        id: 'd',
        question: "Nêu vai trò của Tường lửa (Firewall) trong việc bảo vệ hệ thống mạng nội bộ nhà trường trước các cuộc tấn công từ bên ngoài Internet.",
        modelAnswer: "Tường lửa giám sát và kiểm soát mọi lưu lượng mạng ra/vào dựa trên các quy tắc an ninh thiết lập trước, ngăn chặn các kết nối trái phép, virus, mã độc hoặc các cuộc tấn công từ hacker bên ngoài vào mạng nội bộ nhà trường.",
        maxScore: 0.25
      }
    ]
  },
  {
    id: 5,
    title: "Thực hành chia sẻ tài nguyên trong mạng LAN",
    context: "Sử dụng kiến thức về thực hành chia sẻ tài nguyên trong mạng cục bộ (LAN), em hãy thực hiện các yêu cầu sau:",
    topic: "Bài 5. Thực hành chia sẻ tài nguyên trên mạng",
    items: [
      {
        id: 'a',
        question: "Nêu hai lợi ích thiết thực của việc chia sẻ thư mục và máy in qua mạng LAN trong phòng máy trường học.",
        modelAnswer: "1. Giúp giáo viên và học sinh trao đổi bài tập, tài liệu học tập trực tiếp nhanh chóng mà không cần sao chép qua USB.\n2. Tiết kiệm chi phí đầu tư thiết bị nhờ việc nhiều máy tính dùng chung một máy in qua mạng.",
        maxScore: 0.25
      },
      {
        id: 'b',
        question: "Phân biệt quyền Read (Chỉ đọc) và quyền Read/Write (Đọc/Ghi) khi chia sẻ thư mục.",
        modelAnswer: "- Quyền Read: Người dùng chỉ được phép mở xem và sao chép tệp tin, không được phép chỉnh sửa hay lưu đè lên thư mục gốc.\n- Quyền Read/Write: Người dùng có quyền xem, chỉnh sửa, thêm tệp mới hoặc xóa tệp tin trong thư mục chia sẻ.",
        maxScore: 0.25
      },
      {
        id: 'c',
        question: "Giải thích vì sao người quản trị mạng nên phân quyền cụ thể theo tài khoản thay vì cấp quyền cho đối tượng Everyone.",
        modelAnswer: "Phân quyền theo tài khoản cụ thể giúp kiểm soát chặt chẽ quyền truy cập, bảo đảm tính riêng tư và tránh nguy cơ dữ liệu quan trọng bị người không có thẩm quyền sửa đổi, xóa nhầm hoặc lộ thông tin.",
        maxScore: 0.25
      },
      {
        id: 'd',
        question: "Nêu cách khắc phục khi máy B không nhìn thấy thư mục chia sẻ từ máy A dù hai máy đã cắm chung dây cáp vào một Switch.",
        modelAnswer: "Bật tính năng Network Discovery và File and printer sharing trên cả 2 máy; kiểm tra xem hai máy đã cùng Workgroup và cùng dải địa chỉ IP hay chưa; kiểm tra tắt bớt chặn của Windows Firewall hoặc truy cập trực tiếp bằng địa chỉ IP (\\\\IP_May_A).",
        maxScore: 0.25
      }
    ]
  },
  {
    id: 6,
    title: "Quản trị chia sẻ tài nguyên và thiết bị trong mạng LAN",
    context: "Sử dụng kiến thức thực hành về quản trị chia sẻ tài nguyên trong mạng cục bộ (LAN), em hãy thực hiện các yêu cầu sau:",
    topic: "Bài 5. Thực hành chia sẻ tài nguyên trên mạng",
    items: [
      {
        id: 'a',
        question: "Để có thể chia sẻ tệp và máy in trong mạng, em cần thực hiện những công việc gì?",
        modelAnswer: "- Thiết lập chế độ mạng tin cậy (Private Network).\n- Bật tính năng 'Turn on network discovery' và 'Turn on file and printer sharing'.\n- Cấu hình chia sẻ trên thư mục hoặc máy in và phân quyền truy cập phù hợp.",
        maxScore: 0.25
      },
      {
        id: 'b',
        question: "Giải thích vì sao khi tạo thư mục cho học sinh nộp bài thực hành, giáo viên không nên cấp quyền Read/Write cho đối tượng Everyone mà nên phân quyền theo tài khoản cá nhân.",
        modelAnswer: "Để tránh việc học sinh vô tình hoặc cố ý sửa đổi, sao chép hay xóa bài làm của bạn khác; đồng thời nâng cao tính tự giác và chịu trách nhiệm cá nhân đối với bài làm của mình.",
        maxScore: 0.25
      },
      {
        id: 'c',
        question: "Phân biệt chế độ Private Network và Public Network trong Windows về khả năng phát hiện máy tính và chia sẻ tài nguyên qua mạng LAN.",
        modelAnswer: "- Private Network: Mặc định bật dò tìm mạng và cho phép chia sẻ tài nguyên giữa các thiết bị tin cậy trong mạng nội bộ.\n- Public Network: Tự động ẩn máy và khóa chia sẻ tài nguyên để bảo vệ máy tính trước nguy cơ bị xâm nhập từ môi trường mạng công cộng.",
        maxScore: 0.25
      },
      {
        id: 'd',
        question: "Trình bày các bước cơ bản để chia sẻ một máy in kết nối trực tiếp với máy tính của giáo viên cho tất cả các máy học sinh trong phòng máy LAN cùng sử dụng.",
        modelAnswer: "- Trên máy giáo viên (nối máy in): Mở Devices and Printers -> Click chuột phải vào máy in -> Chọn Printer Properties -> Chọn thẻ Sharing -> Tích chọn 'Share this printer' và đặt tên máy in.\n- Trên máy học sinh: Mở Devices and Printers -> Chọn 'Add a printer' -> Dò tìm hoặc chọn máy in đã chia sẻ từ máy giáo viên để kết nối.",
        maxScore: 0.25
      }
    ]
  }
];

export const INITIAL_MOCK_SUBMISSIONS: StudentSubmission[] = [
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
