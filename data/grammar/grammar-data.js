
// GRAMMAR-DATA.JS - Dữ liệu Lộ trình Ngữ pháp


'use strict';

const grammarRoadmap = [
  
  // TUẦN 1 - NGÀY 1: Động từ TO BE

  {
    day: 1,
    week: 1,
    title: "Động từ TO BE",
    subtitle: "am / is / are",
    icon: "fas fa-hand-point-right",
    level: "Cơ bản",
    duration: "30 phút",
    
    theory: `
      <p><strong>Động từ TO BE</strong> là động từ quan trọng nhất trong tiếng Anh.</p>
      <p>Nó có 3 dạng ở hiện tại:</p>
      <p>• <strong>I am</strong> - Tôi là/thì</p>
      <p>• <strong>He/She/It is</strong> - Anh ấy/Cô ấy/Nó là/thì</p>
      <p>• <strong>You/We/They are</strong> - Bạn/Chúng ta/Họ là/thì</p>
      <p>TO BE được dùng để diễn tả trạng thái, nghề nghiệp, tuổi tác, nơi chốn...</p>
    `,
    
    formula: [
      { 
        label: "Khẳng định", 
        structure: "S + am/is/are + ..." 
      },
      { 
        label: "Phủ định", 
        structure: "S + am/is/are + not + ..." 
      },
      { 
        label: "Nghi vấn", 
        structure: "Am/Is/Are + S + ...?" 
      }
    ],
    
    examples: [
      { 
        en: "I am a student.", 
        vi: "Tôi là một sinh viên." 
      },
      { 
        en: "She is beautiful.", 
        vi: "Cô ấy xinh đẹp." 
      },
      { 
        en: "They are happy.", 
        vi: "Họ vui vẻ." 
      },
      { 
        en: "Are you tired?", 
        vi: "Bạn có mệt không?" 
      }
    ],
    
    usage: "TO BE được dùng để diễn tả trạng thái, tính chất, nghề nghiệp, tuổi tác, nơi chốn.",
    
    notes: [
      "Viết tắt: I'm, You're, He's, She's, It's, We're, They're",
      "Phủ định viết tắt: isn't (is not), aren't (are not)",
      "TO BE không dùng với động từ thường trong cùng câu"
    ]
  },

  
  // TUẦN 1 - NGÀY 2: Thì Hiện tại Đơn

  {
    day: 2,
    week: 1,
    title: "Thì Hiện tại Đơn",
    subtitle: "Present Simple Tense",
    icon: "fas fa-clock",
    level: "Cơ bản",
    duration: "35 phút",
    
    theory: `
      <p><strong>Thì Hiện tại Đơn</strong> diễn tả:</p>
      <p>• Thói quen hàng ngày: I get up at 6 AM</p>
      <p>• Sự thật hiển nhiên: The sun rises in the east</p>
      <p>• Sở thích: She likes music</p>
      <p>• Lịch trình cố định: The train leaves at 9 AM</p>
      <p><strong>Dấu hiệu:</strong> always, usually, often, sometimes, never, every day/week...</p>
    `,
    
    formula: [
      { 
        label: "Khẳng định", 
        structure: "S + V(s/es) + O" 
      },
      { 
        label: "Phủ định", 
        structure: "S + do/does not + V + O" 
      },
      { 
        label: "Nghi vấn", 
        structure: "Do/Does + S + V + O?" 
      }
    ],
    
    examples: [
      { 
        en: "I play football every day.", 
        vi: "Tôi chơi bóng đá mỗi ngày." 
      },
      { 
        en: "She goes to school by bus.", 
        vi: "Cô ấy đi học bằng xe buýt." 
      },
      { 
        en: "Do you like coffee?", 
        vi: "Bạn có thích cà phê không?" 
      },
      { 
        en: "He doesn't watch TV.", 
        vi: "Anh ấy không xem TV." 
      }
    ],
    
    usage: "Diễn tả thói quen, sự thật hiển nhiên, sở thích, lịch trình cố định.",
    
    notes: [
      "Thêm -s/-es với chủ ngữ he/she/it: go → goes, watch → watches",
      "Động từ kết thúc -y: study → studies (nếu trước y là phụ âm)",
      "Trợ động từ: do (I/you/we/they), does (he/she/it)"
    ]
  },

  // TUẦN 1 - NGÀY 3: Thì Hiện tại Tiếp diễn
 
  {
    day: 3,
    week: 1,
    title: "Thì Hiện tại Tiếp diễn",
    subtitle: "Present Continuous Tense",
    icon: "fas fa-running",
    level: "Cơ bản",
    duration: "35 phút",
    
    theory: `
      <p><strong>Thì Hiện tại Tiếp diễn</strong> diễn tả:</p>
      <p>• Hành động đang xảy ra ngay lúc nói: I am studying now</p>
      <p>• Hành động tạm thời trong giai đoạn hiện tại: She is living in Hanoi this month</p>
      <p>• Kế hoạch tương lai đã sắp xếp: We are meeting tomorrow</p>
      <p><strong>Dấu hiệu:</strong> now, right now, at the moment, at present, Look!, Listen!</p>
    `,
    
    formula: [
      { 
        label: "Khẳng định", 
        structure: "S + am/is/are + V-ing" 
      },
      { 
        label: "Phủ định", 
        structure: "S + am/is/are + not + V-ing" 
      },
      { 
        label: "Nghi vấn", 
        structure: "Am/Is/Are + S + V-ing?" 
      }
    ],
    
    examples: [
      { 
        en: "I am reading a book now.", 
        vi: "Tôi đang đọc sách bây giờ." 
      },
      { 
        en: "She is cooking dinner.", 
        vi: "Cô ấy đang nấu bữa tối." 
      },
      { 
        en: "Are they playing games?", 
        vi: "Họ đang chơi game à?" 
      },
      { 
        en: "He isn't working today.", 
        vi: "Hôm nay anh ấy không làm việc." 
      }
    ],
    
    usage: "Diễn tả hành động đang xảy ra tại thời điểm nói, hành động tạm thời.",
    
    notes: [
      "Thêm -ing: play → playing, study → studying",
      "Động từ kết thúc -e: make → making (bỏ e)",
      "Động từ 1 âm tiết, 1 phụ âm cuối: run → running (gấp đôi phụ âm)",
      "Không dùng với động từ chỉ cảm xúc, sở hữu: like, love, want, have..."
    ]
  },


  // TUẦN 1 - NGÀY 4: Danh từ số ít & số nhiều

  {
    day: 4,
    week: 1,
    title: "Danh từ số ít & số nhiều",
    subtitle: "Singular & Plural Nouns",
    icon: "fas fa-cubes",
    level: "Cơ bản",
    duration: "30 phút",
    
    theory: `
      <p><strong>Danh từ số nhiều</strong> thường được tạo bằng cách thêm <strong>-s</strong> hoặc <strong>-es</strong>.</p>
      <p><strong>Quy tắc chung:</strong></p>
      <p>• Thêm -s: book → books, cat → cats</p>
      <p>• Thêm -es (kết thúc -s, -ss, -ch, -sh, -x, -o): bus → buses, box → boxes</p>
      <p>• Đổi -y thành -ies: baby → babies (nếu trước y là phụ âm)</p>
      <p>• Đổi -f/-fe thành -ves: knife → knives, leaf → leaves</p>
    `,
    
    formula: [
      { 
        label: "Thông thường", 
        structure: "Danh từ + s/es" 
      },
      { 
        label: "Bất quy tắc", 
        structure: "man → men, child → children, tooth → teeth" 
      },
      { 
        label: "Không đổi", 
        structure: "sheep → sheep, fish → fish, deer → deer" 
      }
    ],
    
    examples: [
      { 
        en: "I have two cats and one dog.", 
        vi: "Tôi có hai con mèo và một con chó." 
      },
      { 
        en: "There are many children in the park.", 
        vi: "Có nhiều trẻ em trong công viên." 
      },
      { 
        en: "She bought three boxes of chocolates.", 
        vi: "Cô ấy mua ba hộp socola." 
      },
      { 
        en: "The sheep are eating grass.", 
        vi: "Những con cừu đang ăn cỏ." 
      }
    ],
    
    usage: "Tạo số nhiều cho danh từ để chỉ nhiều hơn một đối tượng.",
    
    notes: [
      "Một số danh từ bất quy tắc phổ biến: man/men, woman/women, foot/feet, mouse/mice",
      "Danh từ không đếm được không có số nhiều: water, rice, milk, money",
      "Dùng 'a/an' với danh từ số ít đếm được, 'some/any' với số nhiều"
    ]
  },

  
  // TUẦN 1 - NGÀY 5: Mạo từ A / AN / THE
  
  {
    day: 5,
    week: 1,
    title: "Mạo từ A / AN / THE",
    subtitle: "Articles",
    icon: "fas fa-font",
    level: "Cơ bản",
    duration: "30 phút",
    
    theory: `
      <p><strong>Mạo từ</strong> đi trước danh từ để xác định danh từ đó.</p>
      <p><strong>A / AN</strong> (mạo từ không xác định):</p>
      <p>• Dùng với danh từ số ít đếm được, chưa xác định</p>
      <p>• A + phụ âm: a book, a car</p>
      <p>• AN + nguyên âm (u, e, o, a, i): an apple, an egg</p>
      <p><strong>THE</strong> (mạo từ xác định):</p>
      <p>• Dùng với danh từ đã xác định (cả số ít và số nhiều)</p>
      <p>• Dùng với danh từ duy nhất: the sun, the moon</p>
    `,
    
    formula: [
      { 
        label: "A/AN", 
        structure: "a/an + danh từ số ít (lần đầu nhắc đến)" 
      },
      { 
        label: "THE", 
        structure: "the + danh từ (đã nhắc đến hoặc duy nhất)" 
      },
      { 
        label: "Không mạo từ", 
        structure: "Danh từ số nhiều hoặc không đếm được (chung chung)" 
      }
    ],
    
    examples: [
      { 
        en: "I have a cat. The cat is cute.", 
        vi: "Tôi có một con mèo. Con mèo đó dễ thương." 
      },
      { 
        en: "She is an engineer.", 
        vi: "Cô ấy là một kỹ sư." 
      },
      { 
        en: "The Earth goes around the Sun.", 
        vi: "Trái Đất quay quanh Mặt Trời." 
      },
      { 
        en: "I like cats.", 
        vi: "Tôi thích mèo (nói chung)." 
      }
    ],
    
    usage: "Xác định danh từ cụ thể hoặc chung chung trong câu.",
    
    notes: [
      "Dùng A trước âm /ju:/: a university, a European",
      "Dùng AN trước h câm: an hour, an honest man",
      "Không dùng mạo từ với tên riêng, bữa ăn, môn học (chung chung)"
    ]
  },

  
  // TUẦN 2 - NGÀY 6-10: Tiếp tục...

  {
    day: 6,
    week: 2,
    title: "Thì Quá khứ đơn",
    subtitle: "Past Simple Tense",
    icon: "fas fa-history",
    level: "Cơ bản",
    duration: "40 phút",
    theory: "<p>Thì Quá khứ đơn diễn tả hành động đã xảy ra và kết thúc trong quá khứ.</p>",
    formula: [
      { label: "Khẳng định", structure: "S + V-ed / V2" },
      { label: "Phủ định", structure: "S + did not + V" },
      { label: "Nghi vấn", structure: "Did + S + V?" }
    ],
    examples: [
      { en: "I visited Ha Long Bay last year.", vi: "Tôi đã thăm Vịnh Hạ Long năm ngoái." },
      { en: "She didn't go to school yesterday.", vi: "Hôm qua cô ấy không đi học." }
    ],
    usage: "Diễn tả hành động đã hoàn thành trong quá khứ.",
    notes: []
  },

  {
    day: 7,
    week: 2,
    title: "Thì Tương lai đơn",
    subtitle: "Future Simple (Will)",
    icon: "fas fa-rocket",
    level: "Cơ bản",
    duration: "35 phút",
    theory: "<p>Thì Tương lai đơn với WILL diễn tả quyết định tức thời, dự đoán, lời hứa.</p>",
    formula: [
      { label: "Khẳng định", structure: "S + will + V" },
      { label: "Phủ định", structure: "S + will not (won't) + V" },
      { label: "Nghi vấn", structure: "Will + S + V?" }
    ],
    examples: [
      { en: "I will help you.", vi: "Tôi sẽ giúp bạn." },
      { en: "It will rain tomorrow.", vi: "Ngày mai trời sẽ mưa." }
    ],
    usage: "Quyết định tức thời, dự đoán, lời hứa.",
    notes: []
  },

  {
    day: 8,
    week: 2,
    title: "Cấu trúc Be Going To",
    subtitle: "Near Future",
    icon: "fas fa-calendar-check",
    level: "Cơ bản",
    duration: "35 phút",
    theory: "<p>BE GOING TO diễn tả kế hoạch đã định trước hoặc dự đoán có căn cứ.</p>",
    formula: [
      { label: "Khẳng định", structure: "S + am/is/are + going to + V" },
      { label: "Phủ định", structure: "S + am/is/are + not + going to + V" },
      { label: "Nghi vấn", structure: "Am/Is/Are + S + going to + V?" }
    ],
    examples: [
      { en: "I'm going to study abroad next year.", vi: "Năm sau tôi sẽ đi du học." },
      { en: "Look at the clouds! It's going to rain.", vi: "Nhìn những đám mây kia! Trời sắp mưa rồi." }
    ],
    usage: "Kế hoạch đã định, dự đoán có căn cứ.",
    notes: []
  },

  {
    day: 9,
    week: 2,
    title: "So sánh hơn & nhất",
    subtitle: "Comparative & Superlative",
    icon: "fas fa-balance-scale",
    level: "Trung bình",
    duration: "40 phút",
    theory: "<p>So sánh hơn: 2 đối tượng. So sánh nhất: 3+ đối tượng.</p>",
    formula: [
      { label: "So sánh hơn", structure: "adj-er than / more adj than" },
      { label: "So sánh nhất", structure: "the adj-est / the most adj" }
    ],
    examples: [
      { en: "She is taller than me.", vi: "Cô ấy cao hơn tôi." },
      { en: "This is the most beautiful place.", vi: "Đây là nơi đẹp nhất." }
    ],
    usage: "So sánh giữa các đối tượng.",
    notes: []
  },

  {
    day: 10,
    week: 2,
    title: "Giới từ vị trí",
    subtitle: "Prepositions of Place",
    icon: "fas fa-map-marker-alt",
    level: "Cơ bản",
    duration: "30 phút",
    theory: "<p>Giới từ chỉ vị trí: in, on, at, under, behind, in front of...</p>",
    formula: [
      { label: "IN", structure: "trong không gian kín" },
      { label: "ON", structure: "trên bề mặt" },
      { label: "AT", structure: "tại điểm cụ thể" }
    ],
    examples: [
      { en: "The book is on the table.", vi: "Cuốn sách ở trên bàn." },
      { en: "She lives in Hanoi.", vi: "Cô ấy sống ở Hà Nội." }
    ],
    usage: "Chỉ vị trí trong không gian.",
    notes: []
  },

  {
    day: 10,
    week: 2,
    title: "Giới từ vị trí",
    subtitle: "Prepositions of Place",
    icon: "fas fa-map-marker-alt",
    level: "Cơ bản",
    duration: "30 phút",
    theory: "<p>Giới từ chỉ vị trí: in, on, at, under, behind, in front of...</p>",
    formula: [
      { label: "IN", structure: "trong không gian kín" },
      { label: "ON", structure: "trên bề mặt" },
      { label: "AT", structure: "tại điểm cụ thể" }
    ],
    examples: [
      { en: "The book is on the table.", vi: "Cuốn sách ở trên bàn." },
      { en: "She lives in Hanoi.", vi: "Cô ấy sống ở Hà Nội." }
    ],
    usage: "Chỉ vị trí trong không gian.",
    notes: ["IN + không gian kín: in the room, in the box", "ON + bề mặt: on the wall, on the floor", "AT + điểm cụ thể: at the bus stop, at home"]
  },


  // TUẦN 3 - NGÀY 11-15

  
  {
    day: 11,
    week: 3,
    title: "Thì Hiện tại Hoàn thành",
    subtitle: "Present Perfect Tense",
    icon: "fas fa-check-double",
    level: "Trung bình",
    duration: "45 phút",
    theory: `
      <p><strong>Thì Hiện tại Hoàn thành</strong> diễn tả:</p>
      <p>• Hành động đã xảy ra trong quá khứ, không rõ thời gian cụ thể</p>
      <p>• Hành động bắt đầu trong quá khứ và còn tiếp diễn đến hiện tại</p>
      <p>• Kinh nghiệm sống</p>
      <p><strong>Dấu hiệu:</strong> already, yet, just, ever, never, recently, lately, since, for</p>
    `,
    formula: [
      { label: "Khẳng định", structure: "S + have/has + V3/ed" },
      { label: "Phủ định", structure: "S + have/has + not + V3/ed" },
      { label: "Nghi vấn", structure: "Have/Has + S + V3/ed?" }
    ],
    examples: [
      { en: "I have lived here for 5 years.", vi: "Tôi đã sống ở đây được 5 năm." },
      { en: "She has just finished her homework.", vi: "Cô ấy vừa mới hoàn thành bài tập." },
      { en: "Have you ever been to Paris?", vi: "Bạn đã từng đến Paris chưa?" },
      { en: "They haven't seen that movie yet.", vi: "Họ vẫn chưa xem bộ phim đó." }
    ],
    usage: "Hành động quá khứ không rõ thời gian, kinh nghiệm, hành động kéo dài đến hiện tại.",
    notes: ["FOR + khoảng thời gian: for 3 years", "SINCE + mốc thời gian: since 2020", "Không dùng với thời gian cụ thể trong quá khứ"]
  },

  {
    day: 12,
    week: 3,
    title: "Câu điều kiện loại 1",
    subtitle: "First Conditional",
    icon: "fas fa-random",
    level: "Trung bình",
    duration: "40 phút",
    theory: `
      <p><strong>Câu điều kiện loại 1</strong> diễn tả điều kiện có thể xảy ra ở hiện tại hoặc tương lai.</p>
      <p>Dùng để đưa ra lời đề nghị, cảnh báo, đe dọa hoặc lời khuyên.</p>
      <p><strong>Mệnh đề IF:</strong> Thì hiện tại đơn</p>
      <p><strong>Mệnh đề chính:</strong> Will + động từ nguyên mẫu</p>
    `,
    formula: [
      { label: "Cấu trúc", structure: "If + S + V(s/es), S + will + V" },
      { label: "Đảo ngữ", structure: "S + will + V + if + S + V(s/es)" }
    ],
    examples: [
      { en: "If it rains, I will stay at home.", vi: "Nếu trời mưa, tôi sẽ ở nhà." },
      { en: "If you study hard, you will pass the exam.", vi: "Nếu bạn học chăm, bạn sẽ thi đỗ." },
      { en: "She will be happy if you come.", vi: "Cô ấy sẽ vui nếu bạn đến." },
      { en: "If I have money, I will buy a new car.", vi: "Nếu tôi có tiền, tôi sẽ mua xe mới." }
    ],
    usage: "Điều kiện có thể xảy ra ở hiện tại/tương lai.",
    notes: ["Có thể dùng unless = if...not", "Có thể thay will bằng can, may, should", "Mệnh đề IF có thể đứng trước hoặc sau"]
  },

  {
    day: 13,
    week: 3,
    title: "Động từ khiếm khuyết",
    subtitle: "Modal Verbs: Can, Could, May, Might",
    icon: "fas fa-magic",
    level: "Trung bình",
    duration: "40 phút",
    theory: `
      <p><strong>Động từ khiếm khuyết</strong> là động từ đặc biệt thể hiện khả năng, khả thi, xin phép, lời khuyên.</p>
      <p>• <strong>CAN:</strong> Khả năng, xin phép (thân mật)</p>
      <p>• <strong>COULD:</strong> Khả năng quá khứ, xin phép lịch sự hơn</p>
      <p>• <strong>MAY:</strong> Xin phép trang trọng, khả năng xảy ra</p>
      <p>• <strong>MIGHT:</strong> Khả năng thấp hơn may</p>
    `,
    formula: [
      { label: "Khẳng định", structure: "S + can/could/may/might + V" },
      { label: "Phủ định", structure: "S + cannot/could not/may not/might not + V" },
      { label: "Nghi vấn", structure: "Can/Could/May + S + V?" }
    ],
    examples: [
      { en: "I can speak English.", vi: "Tôi có thể nói tiếng Anh." },
      { en: "Could you help me?", vi: "Bạn có thể giúp tôi được không?" },
      { en: "May I come in?", vi: "Tôi có thể vào được không?" },
      { en: "It might rain tomorrow.", vi: "Ngày mai có thể sẽ mưa." }
    ],
    usage: "Thể hiện khả năng, xin phép, dự đoán, lời khuyên.",
    notes: ["Sau modal verb luôn là động từ nguyên mẫu", "Không chia theo ngôi", "Cannot viết liền, could not viết rời"]
  },

  {
    day: 14,
    week: 3,
    title: "Should / Must / Have to",
    subtitle: "Obligation & Advice",
    icon: "fas fa-exclamation-circle",
    level: "Trung bình",
    duration: "40 phút",
    theory: `
      <p><strong>SHOULD:</strong> Lời khuyên (nên)</p>
      <p><strong>MUST:</strong> Bắt buộc do người nói quy định</p>
      <p><strong>HAVE TO:</strong> Bắt buộc do hoàn cảnh, quy định bên ngoài</p>
      <p><strong>MUSTN'T:</strong> Cấm đoán</p>
      <p><strong>DON'T HAVE TO:</strong> Không cần thiết</p>
    `,
    formula: [
      { label: "Should", structure: "S + should/shouldn't + V" },
      { label: "Must", structure: "S + must/mustn't + V" },
      { label: "Have to", structure: "S + have to/has to + V" }
    ],
    examples: [
      { en: "You should eat more vegetables.", vi: "Bạn nên ăn nhiều rau hơn." },
      { en: "I must finish this work today.", vi: "Tôi phải hoàn thành công việc này hôm nay." },
      { en: "She has to wake up early.", vi: "Cô ấy phải dậy sớm." },
      { en: "You mustn't smoke here.", vi: "Bạn không được hút thuốc ở đây." }
    ],
    usage: "Lời khuyên, bắt buộc, cấm đoán.",
    notes: ["Should: lời khuyên nhẹ nhàng", "Must: bắt buộc mạnh mẽ", "Have to: bắt buộc do hoàn cảnh", "Mustn't ≠ don't have to"]
  },

  {
    day: 15,
    week: 3,
    title: "Thì Quá khứ Tiếp diễn",
    subtitle: "Past Continuous Tense",
    icon: "fas fa-history",
    level: "Trung bình",
    duration: "40 phút",
    theory: `
      <p><strong>Thì Quá khứ Tiếp diễn</strong> diễn tả:</p>
      <p>• Hành động đang xảy ra tại một thời điểm trong quá khứ</p>
      <p>• Hành động đang xảy ra thì có hành động khác xen vào</p>
      <p>• Hai hành động xảy ra đồng thời trong quá khứ</p>
      <p><strong>Dấu hiệu:</strong> at this time yesterday, at 8pm last night, when, while</p>
    `,
    formula: [
      { label: "Khẳng định", structure: "S + was/were + V-ing" },
      { label: "Phủ định", structure: "S + was/were + not + V-ing" },
      { label: "Nghi vấn", structure: "Was/Were + S + V-ing?" }
    ],
    examples: [
      { en: "I was studying at 8pm yesterday.", vi: "Tôi đang học lúc 8h tối hôm qua." },
      { en: "She was cooking when I came.", vi: "Cô ấy đang nấu ăn khi tôi đến." },
      { en: "They were playing while we were studying.", vi: "Họ đang chơi trong khi chúng tôi đang học." },
      { en: "Was he sleeping at that time?", vi: "Lúc đó anh ấy đang ngủ à?" }
    ],
    usage: "Hành động đang diễn ra tại thời điểm quá khứ.",
    notes: ["WHEN + past simple, WHILE + past continuous", "Was (I, he, she, it), Were (you, we, they)", "Thường kết hợp với Past Simple"]
  },


  // TUẦN 4 - NGÀY 16-20


  {
    day: 16,
    week: 4,
    title: "Câu bị động",
    subtitle: "Passive Voice",
    icon: "fas fa-exchange-alt",
    level: "Nâng cao",
    duration: "45 phút",
    theory: `
      <p><strong>Câu bị động</strong> nhấn mạnh hành động và đối tượng chịu tác động, không nhấn mạnh người thực hiện.</p>
      <p>Công thức chuyển đổi: Tân ngữ → Chủ ngữ, Động từ → be + V3/ed</p>
      <p><strong>Khi nào dùng:</strong></p>
      <p>• Không biết ai thực hiện hành động</p>
      <p>• Không quan trọng ai làm</p>
      <p>• Muốn nhấn mạnh hành động</p>
    `,
    formula: [
      { label: "Hiện tại đơn", structure: "S + am/is/are + V3/ed" },
      { label: "Quá khứ đơn", structure: "S + was/were + V3/ed" },
      { label: "Tương lai", structure: "S + will be + V3/ed" },
      { label: "HTHT", structure: "S + have/has been + V3/ed" }
    ],
    examples: [
      { en: "English is spoken all over the world.", vi: "Tiếng Anh được nói trên toàn thế giới." },
      { en: "The house was built in 1990.", vi: "Ngôi nhà được xây năm 1990." },
      { en: "The letter will be sent tomorrow.", vi: "Bức thư sẽ được gửi ngày mai." },
      { en: "This song has been sung by many people.", vi: "Bài hát này đã được nhiều người hát." }
    ],
    usage: "Nhấn mạnh hành động và đối tượng chịu tác động.",
    notes: ["BY + người thực hiện (có thể bỏ)", "Chỉ động từ có tân ngữ mới có bị động", "Thì của be phải tương ứng với thì câu chủ động"]
  },

  {
    day: 17,
    week: 4,
    title: "Câu điều kiện loại 2",
    subtitle: "Second Conditional",
    icon: "fas fa-cloud",
    level: "Nâng cao",
    duration: "40 phút",
    theory: `
      <p><strong>Câu điều kiện loại 2</strong> diễn tả điều kiện không có thật ở hiện tại hoặc tương lai.</p>
      <p>Dùng để diễn tả điều ước, tình huống giả định trái với hiện tại.</p>
      <p><strong>Mệnh đề IF:</strong> Thì quá khứ đơn</p>
      <p><strong>Mệnh đề chính:</strong> Would + động từ nguyên mẫu</p>
    `,
    formula: [
      { label: "Cấu trúc", structure: "If + S + V-ed/V2, S + would + V" },
      { label: "To be", structure: "If + S + were, S + would + V" }
    ],
    examples: [
      { en: "If I were rich, I would buy a big house.", vi: "Nếu tôi giàu, tôi sẽ mua một ngôi nhà lớn." },
      { en: "If she had time, she would help you.", vi: "Nếu cô ấy có thời gian, cô ấy sẽ giúp bạn." },
      { en: "What would you do if you won the lottery?", vi: "Bạn sẽ làm gì nếu trúng số?" },
      { en: "If I were you, I wouldn't do that.", vi: "Nếu tôi là bạn, tôi sẽ không làm vậy." }
    ],
    usage: "Điều kiện không có thật ở hiện tại.",
    notes: ["Dùng WERE cho tất cả các ngôi trong mệnh đề IF", "Có thể dùng could, might thay would", "If I were you = lời khuyên"]
  },

  {
    day: 18,
    week: 4,
    title: "Đại từ quan hệ",
    subtitle: "Relative Pronouns: Who, Which, That",
    icon: "fas fa-link",
    level: "Nâng cao",
    duration: "45 phút",
    theory: `
      <p><strong>Đại từ quan hệ</strong> dùng để nối hai câu có danh từ chung.</p>
      <p>• <strong>WHO:</strong> Thay thế cho người (chủ ngữ hoặc tân ngữ)</p>
      <p>• <strong>WHICH:</strong> Thay thế cho vật, động vật</p>
      <p>• <strong>THAT:</strong> Thay thế cho cả người và vật</p>
      <p>• <strong>WHOSE:</strong> Thay thế cho sở hữu</p>
      <p>• <strong>WHERE:</strong> Thay thế cho nơi chốn</p>
    `,
    formula: [
      { label: "WHO", structure: "N (người) + who + V" },
      { label: "WHICH", structure: "N (vật) + which + V/S + V" },
      { label: "THAT", structure: "N + that + V/S + V" },
      { label: "WHOSE", structure: "N + whose + N + V" }
    ],
    examples: [
      { en: "The girl who is sitting there is my sister.", vi: "Cô gái đang ngồi đó là em gái tôi." },
      { en: "The book which I bought yesterday is interesting.", vi: "Cuốn sách tôi mua hôm qua rất thú vị." },
      { en: "This is the house that I was born in.", vi: "Đây là ngôi nhà tôi sinh ra." },
      { en: "The man whose car was stolen called the police.", vi: "Người đàn ông bị mất xe đã gọi cảnh sát." }
    ],
    usage: "Nối hai câu, bổ sung thông tin cho danh từ.",
    notes: ["WHOM: dùng cho người (tân ngữ)", "Có thể bỏ đại từ quan hệ khi làm tân ngữ", "THAT không dùng trong mệnh đề không xác định"]
  },

  {
    day: 19,
    week: 4,
    title: "Reported Speech",
    subtitle: "Câu tường thuật",
    icon: "fas fa-quote-right",
    level: "Nâng cao",
    duration: "45 phút",
    theory: `
      <p><strong>Câu tường thuật</strong> dùng để thuật lại lời nói của người khác.</p>
      <p><strong>Quy tắc lùi thì:</strong></p>
      <p>• Hiện tại đơn → Quá khứ đơn</p>
      <p>• Hiện tại tiếp diễn → Quá khứ tiếp diễn</p>
      <p>• Hiện tại hoàn thành → Quá khứ hoàn thành</p>
      <p>• Quá khứ đơn → Quá khứ hoàn thành</p>
      <p>• Will → Would, Can → Could, May → Might</p>
    `,
    formula: [
      { label: "Câu kể", structure: "S + said (that) + S + V (lùi thì)" },
      { label: "Câu hỏi Yes/No", structure: "S + asked + if/whether + S + V" },
      { label: "Câu hỏi Wh-", structure: "S + asked + wh-word + S + V" },
      { label: "Câu mệnh lệnh", structure: "S + told/asked + O + (not) to V" }
    ],
    examples: [
      { en: "She said, 'I am happy.' → She said (that) she was happy.", vi: "Cô ấy nói rằng cô ấy hạnh phúc." },
      { en: "He asked, 'Do you like coffee?' → He asked if I liked coffee.", vi: "Anh ấy hỏi tôi có thích cà phê không." },
      { en: "She asked, 'Where do you live?' → She asked where I lived.", vi: "Cô ấy hỏi tôi sống ở đâu." },
      { en: "He said, 'Close the door.' → He told me to close the door.", vi: "Anh ấy bảo tôi đóng cửa." }
    ],
    usage: "Thuật lại lời nói của người khác.",
    notes: ["Đổi ngôi: I → he/she, you → I/we", "Đổi trạng từ: here → there, now → then, today → that day", "Câu mệnh lệnh: told/asked + O + to V"]
  },

  {
    day: 20,
    week: 4,
    title: "Wish Sentences",
    subtitle: "Câu ước",
    icon: "fas fa-star",
    level: "Nâng cao",
    duration: "40 phút",
    theory: `
      <p><strong>Câu ước</strong> diễn tả mong ước trái với thực tế.</p>
      <p><strong>WISH + Quá khứ đơn:</strong> Ước điều trái hiện tại</p>
      <p><strong>WISH + Quá khứ hoàn thành:</strong> Ước điều trái quá khứ</p>
      <p><strong>WISH + Would:</strong> Ước điều sẽ xảy ra trong tương lai (không chắc chắn)</p>
      <p><strong>IF ONLY:</strong> Tương tự WISH, nhưng nhấn mạnh hơn</p>
    `,
    formula: [
      { label: "Ước hiện tại", structure: "S + wish + S + V-ed/V2 (were)" },
      { label: "Ước quá khứ", structure: "S + wish + S + had + V3/ed" },
      { label: "Ước tương lai", structure: "S + wish + S + would + V" },
      { label: "IF ONLY", structure: "If only + S + V-ed / had V3" }
    ],
    examples: [
      { en: "I wish I were rich.", vi: "Tôi ước tôi giàu. (nhưng thực tế không giàu)" },
      { en: "She wishes she had studied harder.", vi: "Cô ấy ước đã học chăm hơn. (nhưng đã không)" },
      { en: "I wish it would stop raining.", vi: "Tôi ước trời ngừng mưa." },
      { en: "If only I could speak English fluently!", vi: "Giá như tôi có thể nói tiếng Anh trôi chảy!" }
    ],
    usage: "Diễn tả ước muốn trái với thực tế.",
    notes: ["Dùng WERE cho tất cả các ngôi trong wish hiện tại", "IF ONLY = WISH (nhưng mạnh hơn)", "Wish + would: không dùng cho chính mình làm chủ ngữ"]
  }
];


