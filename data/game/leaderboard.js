
// LEADERBOARD GAME

let cache = {};

async function updateLeaderboard() {
  const gameId = document.getElementById('leaderboardGameSelect').value;
  
  // Kiểm tra cache 10s
  if (cache[gameId] && Date.now() - cache[gameId].time < 10000) {
    displayLeaderboard(cache[gameId].data);
    return;
  }
  
  showLoading();
  
  try {
    // LẤY DỮ LIỆU TỪ game_scores + JOIN với users để lấy name
    const { data: scoresData, error } = await supabase
      .from('game_scores')
      .select('username, score, time_taken, user_email')
      .eq('game_id', gameId)
      .order('score', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    //  Lấy danh sách email unique
    const emails = [...new Set(scoresData.map(s => s.user_email))];
    
    // lấy name từ bảng users
    const { data: usersData, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .in('email', emails);
    
    if (userError) throw userError;
    
    // Tạo Map để tra cứu name nhanh
    const nameMap = new Map();
    usersData?.forEach(u => {
      nameMap.set(u.email, u.name);
    });
    
    // Gắn name vào từng điểm số
    const dataWithNames = scoresData.map(score => ({
      ...score,
      name: nameMap.get(score.user_email) || score.username 
    }));
    
    //  Lojc điểm cao nhất của mỗi user
    const bestScores = new Map();
    dataWithNames.forEach(player => {
      const current = bestScores.get(player.username);
      if (!current || player.score > current.score || 
          (player.score === current.score && player.time_taken < current.time_taken)) {
        bestScores.set(player.username, player);
      }
    });
    
    // sắp xếp theo điểm cao xuống thấp
    const sorted = Array.from(bestScores.values())
      .sort((a, b) => b.score - a.score || a.time_taken - b.time_taken);
    
    //  Lưu cache
    cache[gameId] = { data: sorted, time: Date.now() };
    
    // Hiển thị
    displayLeaderboard(sorted);
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    showError();
  }
}

function displayLeaderboard(players) {
  displayTopPlayers(players.slice(0, 5));
  
  if (typeof currentUser !== 'undefined' && currentUser) {
    displayUserRank(players);
  } else {
    displayLoginPrompt();
  }
}

function displayTopPlayers(players) {
  const container = document.getElementById('topPlayers');
  
  if (!players || players.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #999;">
        <i class="fas fa-trophy" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
        <p>Chưa có người chơi</p>
      </div>
    `;
    return;
  }
  
  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  const classes = ['gold', 'silver', 'bronze', 'default', 'default'];
  

  container.innerHTML = players.map((p, i) => `
    <div class="player-item">
      <div class="rank-badge ${classes[i]}">${ranks[i]}</div>
      <div class="player-info">
        <p class="player-name">${escapeHtml(p.name)}</p>
        <p class="player-score">
          <i class="fas fa-star me-1"></i>${p.score} điểm
          ${p.time_taken ? `<span style="margin-left: 8px; opacity: 0.7;">⏱️ ${formatTime(p.time_taken)}</span>` : ''}
        </p>
      </div>
    </div>
  `).join('');
}

function displayUserRank(players) {
  const container = document.getElementById('yourRank');
  
  if (typeof currentUser === 'undefined' || !currentUser) {
    displayLoginPrompt();
    return;
  }
  
  const userIndex = players.findIndex(p => p.user_email === currentUser.email);
  
  if (userIndex === -1) {
    container.innerHTML = `
      <h4><i class="fas fa-user me-2"></i>Vị trí của bạn</h4>
      <div class="rank-placeholder">
        <i class="fas fa-gamepad"></i>
        <p>Bạn chưa chơi game này.<br>Hãy chơi để lên bảng xếp hạng!</p>
      </div>
    `;
    return;
  }
  
  const rank = userIndex + 1;
  const player = players[userIndex];
  let rankClass = 'default';
  let rankIcon = `#${rank}`;
  
  if (rank === 1) { rankClass = 'gold'; rankIcon = '🥇'; }
  else if (rank === 2) { rankClass = 'silver'; rankIcon = '🥈'; }
  else if (rank === 3) { rankClass = 'bronze'; rankIcon = '🥉'; }
  

  container.innerHTML = `
    <h4><i class="fas fa-user me-2"></i>Vị trí của bạn</h4>
    <div class="your-rank-display">
      <div class="rank-badge ${rankClass}">${rankIcon}</div>
      <div class="player-info">
        <p class="player-name">${escapeHtml(currentUser.name)}</p>
        <p class="player-score">
          <i class="fas fa-star me-1"></i>${player.score} điểm
          ${player.time_taken ? `<span style="margin-left: 8px;">⏱️ ${formatTime(player.time_taken)}</span>` : ''}
        </p>
      </div>
    </div>
    <div style="text-align: center; margin-top: 15px; padding: 12px; background: rgba(255, 255, 255, 0.15); border-radius: 8px;">
      <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">
        ${getRankMessage(rank, players.length)}
      </p>
    </div>
  `;
}

function displayLoginPrompt() {
  document.getElementById('yourRank').innerHTML = `
    <h4><i class="fas fa-user me-2"></i>Vị trí của bạn</h4>
    <div class="rank-placeholder">
      <i class="fas fa-sign-in-alt"></i>
      <p>Đăng nhập để xem vị trí của bạn</p>
      <button class="btn btn-light mt-2" onclick="showGlobalLoginModal()" style="background: white; color: #667eea; font-weight: 600; padding: 8px 20px; border-radius: 8px;">
        Đăng nhập ngay
      </button>
    </div>
  `;
}

function showLoading() {
  document.getElementById('topPlayers').innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #667eea;"></i>
      <p style="margin-top: 10px; color: #999;">Đang tải...</p>
    </div>
  `;
}

function showError() {
  document.getElementById('topPlayers').innerHTML = `
    <div style="text-align: center; padding: 40px 20px; color: #999;">
      <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 10px;"></i>
      <p>Lỗi tải bảng xếp hạng</p>
    </div>
  `;
  displayLoginPrompt();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getRankMessage(rank, total) {
  if (rank === 1) return '🎉 Bạn đang dẫn đầu!';
  if (rank === 2) return '🥈 Rất tốt! Cố lên top 1!';
  if (rank === 3) return '🥉 Xuất sắc!';
  if (rank <= 5) return `💪 Top ${rank}/${total} - Giỏi lắm!`;
  if (rank <= 10) return `⭐ Top ${rank}/${total} - Tốt lắm!`;
  return `📊 Vị trí ${rank}/${total} - Cố lên!`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Auto update mỗi 60 giây
setInterval(() => {
  if (document.getElementById('leaderboardGameSelect')) {
    updateLeaderboard();
  }
}, 60000);

