
let gameScore = 0;
let gameTimer = 0;
let timerInterval = null;

// Chọn game
function selectGame(gameId) {

  document.querySelectorAll('.game-item').forEach(item => {
    item.classList.remove('active');
  });
  

  event.target.closest('.game-item').classList.add('active');
  

  gameScore = 0;
  gameTimer = 0;
  document.getElementById('currentScore').textContent = '0';
  document.getElementById('gameTimer').textContent = '00:00';
  if (timerInterval) clearInterval(timerInterval);
  

  const titles = {
    'word-matching': 'Word Matching',
    'spelling-bee': 'Spelling Bee',
    'word-search': 'Word Search',
    'memory-cards': 'Memory Cards',
    'quick-quiz': 'Quick Quiz'
  };
  document.getElementById('gameTitle').innerHTML = `<i class="fas fa-gamepad me-2"></i>${titles[gameId]}`;
  
  // Load game
  loadGame(gameId);
  
  // Cập nhật leaderboard
  document.getElementById('leaderboardGameSelect').value = gameId;
  if (typeof updateLeaderboard === 'function') {
    updateLeaderboard();
  }
}

// Load game
function loadGame(gameId) {
  const container = document.getElementById('gameContainer');
  container.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #667eea;"></i><p style="margin-top: 15px; color: #666;">Đang tải...</p></div>';
  
  // Xóa script cũ
  const oldScript = document.getElementById('currentGameScript');
  if (oldScript) oldScript.remove();
  
  // Load script mới
  const script = document.createElement('script');
  script.id = 'currentGameScript';
  script.src = `${gameId}.js`;
  script.onload = () => {
    if (typeof window.startGame === 'function') {
      window.startGame();
    }
  };
  script.onerror = () => {
    container.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;"><i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i><p>Không tìm thấy game</p></div>';
  };
  document.body.appendChild(script);
}

// Bắt đầu đếm thời gian
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  gameTimer = 0;
  timerInterval = setInterval(() => {
    gameTimer++;
    const m = Math.floor(gameTimer / 60).toString().padStart(2, '0');
    const s = (gameTimer % 60).toString().padStart(2, '0');
    document.getElementById('gameTimer').textContent = `${m}:${s}`;
  }, 1000);
}

// Cộng điểm
function addScore(points) {
  gameScore += points;
  document.getElementById('currentScore').textContent = gameScore;
}

// Kết thúc game
function endGame() {
  if (timerInterval) clearInterval(timerInterval);
  
  // Lưu điểm nếu đã đăng nhập
  if (typeof currentUser !== 'undefined' && currentUser) {
    const gameId = document.getElementById('leaderboardGameSelect').value;
    saveScore(gameId, gameScore, gameTimer);
  }
  
  if (typeof showNotification === 'function') {
    showNotification(`🎉 Hoàn thành! Điểm: ${gameScore}`, 'success');
  }
}

// Lưu điểm
async function saveScore(gameId, score, time) {
  try {
    await supabase.from('game_scores').insert({
      user_email: currentUser.email,
      username: currentUser.username,
      game_id: gameId,
      score: score,
      time_taken: time,
      played_at: new Date().toISOString()
    });
    
    if (typeof updateLeaderboard === 'function') {
      updateLeaderboard();
    }
  } catch (error) {
    console.error('Lỗi lưu điểm:', error);
  }
}

// Khởi tạo
setTimeout(() => {
  if (typeof updateLeaderboard === 'function') {
    updateLeaderboard();
  }
}, 500);

