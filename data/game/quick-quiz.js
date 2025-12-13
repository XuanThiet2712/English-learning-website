// Câu hỏi
const questions = [
  {
    q: 'What does "cat" mean?',
    options: ['Con mèo', 'Con chó', 'Con gà', 'Con vịt'],
    answer: 0
  },
  {
    q: 'Từ nào nghĩa là "sách"?',
    options: ['Pen', 'Book', 'Paper', 'Desk'],
    answer: 1
  },
  {
    q: '"Love" có nghĩa là gì?',
    options: ['Ghét', 'Yêu', 'Buồn', 'Vui'],
    answer: 1
  },
  {
    q: 'How do you say "bạn bè"?',
    options: ['Family', 'Teacher', 'Friend', 'Brother'],
    answer: 2
  },
  {
    q: 'What does "happy" mean?',
    options: ['Buồn', 'Giận', 'Sợ', 'Vui'],
    answer: 3
  }
];

let current = 0;
let score = 0;

// Bắt đầu game
window.startGame = function() {
  current = 0;
  score = 0;
  
  startTimer();
  showQuestion();
};

// Hiển thị câu hỏi
function showQuestion() {
  if (current >= questions.length) {
    // Hết câu
    endGame();
    const percent = Math.round((score / questions.length) * 100);
    document.getElementById('gameContainer').innerHTML = `
      <div style="text-align: center; padding: 80px 20px;">
        <i class="fas fa-trophy" style="font-size: 5rem; color: #ffd700;"></i>
        <h3 style="color: #667eea; margin: 20px 0;">Hoàn thành!</h3>
        <p style="color: #666; margin-bottom: 10px;">Số câu đúng: ${score} / ${questions.length}</p>
        <p style="color: #666; margin-bottom: 30px;">Độ chính xác: ${percent}%</p>
        <button onclick="window.startGame()" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1rem;">
          Chơi lại
        </button>
      </div>
    `;
    return;
  }
  
  const q = questions[current];
  
  document.getElementById('gameContainer').innerHTML = `
    <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
      <p style="text-align: center; background: #f0f2ff; padding: 10px; border-radius: 8px; color: #667eea; font-weight: 700; margin-bottom: 20px;">
        Câu ${current + 1} / ${questions.length}
      </p>
      
      <div style="text-align: center; background: #667eea; color: white; padding: 30px 20px; border-radius: 12px; margin-bottom: 30px; font-size: 1.3rem; font-weight: 600;">
        ${q.q}
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        ${q.options.map((opt, i) => `
          <button onclick="selectAnswer(${i})" style="padding: 20px; background: white; border: 3px solid #ddd; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1.1rem; text-align: center;">
            ${opt}
          </button>
        `).join('')}
      </div>
    </div>
    
    <style>
      button:hover { background: #f0f2ff !important; border-color: #667eea !important; }
    </style>
  `;
}

// Chọn đáp án
window.selectAnswer = function(index) {
  const q = questions[current];
  const buttons = document.querySelectorAll('#gameContainer button');
  
  buttons.forEach(btn => btn.disabled = true);
  
  if (index === q.answer) {
    // Đúng
    buttons[index].style.background = '#10b981';
    buttons[index].style.color = 'white';
    buttons[index].style.borderColor = '#10b981';
    score++;
    addScore(10);
  } else {
    // Sai
    buttons[index].style.background = '#ef4444';
    buttons[index].style.color = 'white';
    buttons[index].style.borderColor = '#ef4444';
    
    // Hiện đáp án đúng
    buttons[q.answer].style.background = '#10b981';
    buttons[q.answer].style.color = 'white';
    buttons[q.answer].style.borderColor = '#10b981';
  }
  
  setTimeout(() => {
    current++;
    showQuestion();
  }, 1500);
};

console.log('✅ Quick Quiz loaded');