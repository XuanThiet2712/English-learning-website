

'use strict';


let currentWeekFilter = 'all';
let currentStatusFilter = 'all';
let currentSearchKeyword = '';
let completedLessons = []; // Mảng chứa DAY đã hoàn thành
let currentLessonIndex = 0;
let currentLesson = null;


document.addEventListener('DOMContentLoaded', async function() {
  await waitForAuth();
  if (currentUser) {
    await loadCompletedLessons();
  } else {
    loadFromLocalStorage();
  }
  
  renderRoadmap();
  renderLessons();
  updateProgress();
  updateUserCard();
  
});


async function waitForAuth() {
  return new Promise((resolve) => {
    let count = 0;
    const check = setInterval(() => {
      if (typeof currentUser !== 'undefined' || count > 50) {
        clearInterval(check);
        console.log('✅ Auth system đã load');
        resolve();
      }
      count++;
    }, 100);
  });
}


async function loadCompletedLessons() {
  if (!currentUser || !supabase) {
    loadFromLocalStorage();
    return;
  }
  
  try {
    console.log('📡 Đang tải tiến độ từ server...');
    
    const { data, error } = await supabase
      .from('grammar_progress')
      .select('day')
      .eq('user_email', currentUser.email)
      .eq('completed', true);
    
    if (error) {
      console.error('❌ Lỗi load từ server:', error);
      loadFromLocalStorage();
    } else {
      completedLessons = data ? data.map(item => item.day) : [];
      console.log('✅ Đã load', completedLessons.length, 'bài từ server');
      localStorage.setItem('completedGrammarLessons', JSON.stringify(completedLessons));
    }
  } catch (error) {
    console.error('❌ Lỗi:', error);
    loadFromLocalStorage();
  }
}


function loadFromLocalStorage() {
  const saved = localStorage.getItem('completedGrammarLessons');
  if (saved) {
    try {
      completedLessons = JSON.parse(saved);
    
    } catch (e) {
      console.error('❌ Lỗi parse:', e);
      completedLessons = [];
    }
  } else {
    completedLessons = [];
  }
}


async function saveCompletedLessons() {
  
  localStorage.setItem('completedGrammarLessons', JSON.stringify(completedLessons));
 
  

  if (currentUser && supabase) {
    try {
      for (const day of completedLessons) {
        const { data: existing } = await supabase
          .from('grammar_progress')
          .select('id')
          .eq('user_email', currentUser.email)
          .eq('day', day)
          .single();
        
        if (!existing) {
          await supabase
            .from('grammar_progress')
            .insert([{
              user_email: currentUser.email,
              day: day,
              completed: true,
              completed_at: new Date().toISOString()
            }]);
        }
      }
      
    } catch (error) {
      console.error('❌ Lỗi đồng bộ:', error);
    }
  }
}


function isLessonCompleted(day) {
  return completedLessons.includes(day);
}


function renderRoadmap() {
  const container = document.getElementById('roadmapList');
  if (!container) return;
  
  const weeks = {};
  grammarRoadmap.forEach(lesson => {
    if (!weeks[lesson.week]) {
      weeks[lesson.week] = [];
    }
    weeks[lesson.week].push(lesson);
  });
  
  let html = '';
  
  Object.keys(weeks).sort((a, b) => Number(a) - Number(b)).forEach(weekNum => {
    const lessons = weeks[weekNum];
    const weekId = `week-${weekNum}`;
    const completedInWeek = lessons.filter(l => isLessonCompleted(l.day)).length;
    
    html += `
      <div class="week-group">
        <div class="week-header" onclick="toggleWeek('${weekId}')">
          <i class="fas fa-calendar-week"></i>
          <span>Tuần ${weekNum} (${completedInWeek}/${lessons.length})</span>
        </div>
        <div id="${weekId}" class="week-days" style="display: block;">
          ${lessons.map(lesson => `
            <div class="day-item ${isLessonCompleted(lesson.day) ? 'completed' : ''}"
                 onclick="openLesson(${lesson.day})">
              <div class="day-number">${lesson.day}</div>
              <div class="day-content">
                <div class="day-title">${lesson.title}</div>
                <div class="day-subtitle">${lesson.subtitle}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}


function toggleWeek(weekId) {
  const element = document.getElementById(weekId);
  if (!element) return;
  element.style.display = element.style.display === 'none' ? 'block' : 'none';
}


function filterByWeek(week, button) {
  currentWeekFilter = week;
  document.querySelectorAll('.week-chip').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  renderLessons();
}


function filterByStatus(status, button) {
  currentStatusFilter = status;
  document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  renderLessons();
}


function searchGrammar() {
  const input = document.getElementById('searchInput');
  currentSearchKeyword = input.value.toLowerCase().trim();
  renderLessons();
}


function getFilteredLessons() {
  let lessons = [...grammarRoadmap];
  
 
  if (currentStatusFilter === 'all') {
    lessons = lessons.filter(l => !isLessonCompleted(l.day));
  } else if (currentStatusFilter === 'completed') {
    lessons = lessons.filter(l => isLessonCompleted(l.day));
  } else if (currentStatusFilter === 'not-started') {
    lessons = lessons.filter(l => !isLessonCompleted(l.day));
  }
  
  // Lọc theo tuần
  if (currentWeekFilter !== 'all') {
    lessons = lessons.filter(l => l.week === Number(currentWeekFilter));
  }
  
  // Lọc theo từ khóa
  if (currentSearchKeyword) {
    lessons = lessons.filter(l => 
      l.title.toLowerCase().includes(currentSearchKeyword) ||
      l.subtitle.toLowerCase().includes(currentSearchKeyword)
    );
  }
  
  return lessons;
}

function renderLessons() {
  const container = document.getElementById('lessonsList');
  const emptyState = document.getElementById('emptyState');
  if (!container || !emptyState) return;
  
  const lessons = getFilteredLessons();
  
  if (lessons.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    

    if (currentStatusFilter === 'all' || currentStatusFilter === 'not-started') {
      emptyState.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h4>🎉 Chúc mừng!</h4>
        <p>Bạn đã hoàn thành tất cả bài học!</p>
      `;
    } else {
      emptyState.innerHTML = `
        <i class="fas fa-inbox"></i>
        <h4>Không có bài học nào</h4>
        <p>Hãy chọn tuần từ menu bên trái</p>
      `;
    }
    return;
  }
  
  container.style.display = 'grid';
  emptyState.style.display = 'none';
  
  container.innerHTML = lessons.map(lesson => {
    const isCompleted = isLessonCompleted(lesson.day);
    
    const shortDesc = lesson.theory
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 120) + '...';
    
    return `
      <div class="grammar-card ${isCompleted ? 'completed' : ''}" 
           onclick="openLesson(${lesson.day})">
        
        <div class="card-badge ${isCompleted ? 'completed' : 'day'}">
          ${isCompleted 
            ? '<i class="fas fa-check"></i> Hoàn thành' 
            : `<i class="fas fa-calendar-day"></i> Ngày ${lesson.day}`
          }
        </div>
        
        <div class="card-header">
          <div class="card-icon">
            <i class="${lesson.icon}"></i>
          </div>
          <div class="card-info">
            <h3>${lesson.title}</h3>
            <p>${lesson.subtitle}</p>
          </div>
        </div>
        
        <div class="card-description">
          ${shortDesc}
        </div>
        
        <div class="card-meta">
          <div class="meta-item">
            <i class="fas fa-signal"></i>
            <span>${lesson.level}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-clock"></i>
            <span>${lesson.duration}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// mo bai hoc modal
function openLesson(day) {
  currentLesson = grammarRoadmap.find(l => l.day === day);
  if (!currentLesson) return;
  
  currentLessonIndex = grammarRoadmap.indexOf(currentLesson);
  
  document.getElementById('lessonTitle').textContent = 
    `Ngày ${currentLesson.day}: ${currentLesson.title}`;
  
  renderTheoryTab();
  renderExamplesTab();
  
  document.getElementById('theory-tab').click();
  
  const modal = new bootstrap.Modal(document.getElementById('learnModal'));
  modal.show();
}

function renderTheoryTab() {
  if (!currentLesson) return;
  
  document.getElementById('theoryTitle').textContent = currentLesson.title;
  document.getElementById('theoryDescription').innerHTML = currentLesson.theory;
  
  const structureHTML = currentLesson.formula.map(f => `
    <div class="formula-item">
      <div class="formula-label">${f.label}</div>
      <div class="formula-structure">${f.structure}</div>
    </div>
  `).join('');
  document.getElementById('theoryStructure').innerHTML = structureHTML;
  
  if (currentLesson.usage) {
    const usageHTML = Array.isArray(currentLesson.usage) 
      ? `<ul>${currentLesson.usage.map(u => `<li>${u}</li>`).join('')}</ul>`
      : currentLesson.usage;
    document.getElementById('theoryUsage').innerHTML = usageHTML;
  } else {
    document.getElementById('theoryUsage').innerHTML = '<p>Không có thông tin cách dùng.</p>';
  }
}

function renderExamplesTab() {
  if (!currentLesson) return;
  
  const html = currentLesson.examples.map(ex => `
    <div class="example-item">
      <div class="example-en">${ex.en}</div>
      <div class="example-vi">${ex.vi}</div>
    </div>
  `).join('');
  
  document.getElementById('examplesContent').innerHTML = html;
}


async function markLessonCompleted() {
  if (!currentLesson) return;
  
  const day = currentLesson.day;
  
  // Kiểm tra đã hoàn thành chưa
  if (isLessonCompleted(day)) {
    showNotification('Bạn đã hoàn thành bài này rồi! 🎉', 'info');
    return;
  }
  
  // Thêm vào danh sách đã hoàn thành
  completedLessons.push(day);
  
  await saveCompletedLessons();
  

  
  // Đóng modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('learnModal'));
  if (modal) modal.hide();
  

  setTimeout(() => {
  
    renderRoadmap();
    
    
    renderLessons();
    
    
    updateProgress();
    
    
    showNotification(
      `🎉 Chúc mừng! Bạn đã hoàn thành bài "${currentLesson.title}"!`, 'success'
    );
    
  }, 300);
  
  // Hỏi có muốn học bài tiếp không
  setTimeout(() => {
    const nextLesson = grammarRoadmap[currentLessonIndex + 1];
    if (nextLesson && !isLessonCompleted(nextLesson.day)) {
      if (confirm('Bạn có muốn học bài tiếp theo không?')) {
        openLesson(nextLesson.day);
      }
    }
  }, 1000);
}

// cap nhat tien do
function updateProgress() {
  const total = grammarRoadmap.length;
  const completed = completedLessons.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const daysEl = document.getElementById('daysCompleted');
  const rateEl = document.getElementById('completionRate');
  
  if (daysEl) daysEl.textContent = completed;
  if (rateEl) rateEl.textContent = rate + '%';
  
  console.log(`📊 Tiến độ: ${completed}/${total} bài (${rate}%)`);
}

function continueLastLesson() {
  const nextLesson = grammarRoadmap.find(l => !isLessonCompleted(l.day));
  
  if (nextLesson) {
    openLesson(nextLesson.day);
  } else {
    showNotification('🎉 Chúc mừng! Bạn đã hoàn thành tất cả bài học!', 'success');
  }
}


function updateUserCard() {
  const userCard = document.getElementById('userCard');
  if (!userCard) return;
  
  if (!currentUser) {
    userCard.innerHTML = `
      <div class="login-required">
        <i class="fas fa-user-circle"></i>
        <h4>Vui lòng đăng nhập</h4>
        <p>Đăng nhập để lưu tiến độ học tập của bạn</p>
        <button class="btn btn-primary btn-lg" onclick="showGlobalLoginModal()">
          <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập ngay
        </button>
      </div>
    `;
    return;
  }
  
  const totalLessons = grammarRoadmap.length;
  const completedCount = completedLessons.length;
  const completionRate = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  userCard.innerHTML = `
    <img src="${currentUser.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)}" 
         alt="Avatar" 
         class="user-avatar"
         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}'">
    
    <h3 class="user-name">${currentUser.name}</h3>
    
    <div class="user-details">
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-user"></i>
          Username
        </span>
        <span class="user-value">@${currentUser.username}</span>
      </div>
      
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-book-open"></i>
          Bài đã học
        </span>
        <span class="user-value">${completedCount}/${totalLessons}</span>
      </div>
      
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-chart-line"></i>
          Hoàn thành
        </span>
        <span class="user-value">${completionRate}%</span>
      </div>
      
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-star"></i>
          EXP
        </span>
        <span class="user-value">${currentUser.exp || 0}</span>
      </div>
    </div>
    
    <div class="user-buttons">
      <button class="btn-edit" onclick="window.location.href='../../index.html'">
        <i class="fas fa-home"></i>
        Về trang chủ
      </button>
      <button class="btn-logout" onclick="handleLogout()">
        <i class="fas fa-sign-out-alt"></i>
        Đăng xuất
      </button>
    </div>
  `;
}


function handleLogout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    if (typeof globalLogout === 'function') {
      globalLogout();
    }
  }
}
// THông báo
function showNotification(message, type = 'info') {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#667eea'
  };
  
  const icons = {
    success: 'check-circle',
    error: 'times-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    padding: 15px 20px;
    background: ${colors[type]};
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
    font-weight: 600;
  `;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-${icons[type]}"></i>
      <span>${message}</span>
    </div>
  `;
  
  if (!document.getElementById('notificationStyle')) {
    const style = document.createElement('style');
    style.id = 'notificationStyle';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}


window.onUserLoginSuccess = async function() {
  console.log('✅ User đã đăng nhập vào Grammar page');
  await loadCompletedLessons();
  updateUserCard();
  renderRoadmap();
  renderLessons();
  updateProgress();
  showNotification('Chào mừng trở lại! Tiến độ của bạn đã được tải.', 'success');
};


window.onUserLogout = function() {
  updateUserCard();
  showNotification('Đã đăng xuất. Tiến độ chỉ lưu trên thiết bị này.', 'info');
};

console.log('✅ grammar.js ');