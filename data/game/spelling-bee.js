// Danh sách từ
const words = [
  { word: 'cat', meaning: 'con mèo' },
  { word: 'dog', meaning: 'con chó' },
  { word: 'book', meaning: 'quyển sách' },
  { word: 'love', meaning: 'tình yêu' },
  { word: 'happy', meaning: 'vui vẻ' },
  { word: 'friend', meaning: 'bạn bè' }
];

let current = 0;
let correct = 0;

// Bắt đầu game
window.startGame = function() {
  current = 0;
  correct = 0;
  
  startTimer();
  showWord();
};

// Hiển thị từ hiện tại
function showWord() {
  if (current >= words.length) {
    // Hết từ
    endGame();
    document.getElementById('gameContainer').innerHTML = `
      <div style="text-align: center; padding: 80px 20px;">
        <i class="fas fa-trophy" style="font-size: 5rem; color: #ffd700;"></i>
        <h3 style="color: #667eea; margin: 20px 0;">Hoàn thành!</h3>
        <p style="color: #666; margin-bottom: 10px;">Bạn đánh vần đúng: ${correct} / ${words.length}</p>
        <p style="color: #666; margin-bottom: 30px;">Độ chính xác: ${Math.round(correct/words.length*100)}%</p>
        <button onclick="window.startGame()" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1rem;">
          Chơi lại
        </button>
      </div>
    `;
    return;
  }
  
  const w = words[current];
  
  document.getElementById('gameContainer').innerHTML = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="text-align: center; background: #f0f2ff; padding: 10px; border-radius: 8px; color: #667eea; font-weight: 700; margin-bottom: 20px;">
        Từ ${current + 1} / ${words.length}
      </p>
      
      <div style="text-align: center; background: #667eea; color: white; padding: 40px 20px; border-radius: 12px; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.9; margin-bottom: 10px;">Nghĩa của từ:</p>
        <p style="margin: 0; font-size: 2rem; font-weight: 700;">${w.meaning}</p>
      </div>
      
      <input type="text" id="answer" placeholder="Nhập từ tiếng Anh..." autofocus
        style="width: 100%; padding: 20px; font-size: 1.5rem; border: 3px solid #ddd; border-radius: 12px; text-align: center; font-weight: 600; margin-bottom: 20px;">
      
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button onclick="checkAnswer()" style="padding: 15px 40px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1.1rem;">
          Kiểm tra
        </button>
        <button onclick="skipWord()" style="padding: 15px 40px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1.1rem;">
          Bỏ qua
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
}

// Kiểm tra đáp án
window.checkAnswer = function() {
  const input = document.getElementById('answer');
  const answer = input.value.trim().toLowerCase();
  const correctWord = words[current].word;
  
  if (!answer) {
    alert('Vui lòng nhập từ!');
    return;
  }
  
  if (answer === correctWord) {
    // Đúng
    input.style.borderColor = '#10b981';
    input.style.background = '#d1fae5';
    correct++;
    addScore(15);
    
    setTimeout(() => {
      current++;
      showWord();
    }, 1000);
  } else {
    // Sai
    input.style.borderColor = '#ef4444';
    input.style.background = '#fee2e2';
    alert(`Sai rồi! Đáp án đúng là: ${correctWord}`);
    
    setTimeout(() => {
      current++;
      showWord();
    }, 1500);
  }
};

// Bỏ qua từ
window.skipWord = function() {
  alert(`Đáp án: ${words[current].word}`);
  current++;
  showWord();
};

console.log('✅ Spelling Bee loaded');