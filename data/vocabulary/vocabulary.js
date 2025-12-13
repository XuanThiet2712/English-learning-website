// VOCABULARY.JS

'use strict';

let currentTopic = null;     // chu de  

let currentFilter = 'all';      // bo loc 
let userProgress = {};          // tien do hoc
let learningWords = [];         // danh sach tu dang hoc
let currentWordIndex = 0;       // vi tri tu hien tai


document.addEventListener('DOMContentLoaded', async function() {
  await waitForAuth();
  renderTopics();
  if (currentUser) {
    await loadProgress();
    updateUserCard();
  }
  if (vocabularyTopics.length > 0) {
    selectTopic(vocabularyTopics[0].id);
  }
});


async function waitForAuth() {
  return new Promise((resolve) => {
    let count = 0;
    const check = setInterval(() => {
      if (typeof currentUser !== 'undefined' || count > 50) {
        clearInterval(check);
        resolve();
      }
      count++;
    }, 100);
  });
}


window.onUserLoginSuccess = async function() {
  console.log('📝 User vừa đăng nhập...');
  await loadProgress();
  updateUserCard();
  renderVocabulary();
};


function renderTopics() {
  const container = document.getElementById('topicsList');
  if (!container) return;
  
  let html = '';
  
  for (let topic of vocabularyTopics) {
    const learned = countLearned(topic.id);  // Đếm từ đã học
    const total = topic.words.length;         // Tổng số từ
    const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
    
    const isActive = currentTopic === topic.id ? 'active' : '';
    
    html += `
      <div class="topic-item ${isActive}" onclick="selectTopic('${topic.id}')">
        <div class="topic-header">
          <div class="topic-icon">
            <i class="fas ${topic.icon}"></i>
          </div>
          <div>
            <h4 class="topic-title">${topic.name}</h4>
          </div>
        </div>
        <div class="topic-stats">
          <span class="topic-stat">
            <i class="fas fa-book"></i> ${learned}/${total}
          </span>
          <span class="topic-stat">
            <i class="fas fa-chart-line"></i> ${percent}%
          </span>
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

function countLearned(topicId) {
  if (!currentUser) return 0;
  
  const topicData = userProgress[topicId] || {};
  let count = 0;
  
  for (let key in topicData) {
    if (topicData[key].status !== 'not-learned') {
      count++;
    }
  }
  
  return count;
}

function selectTopic(topicId) {
  currentTopic = topicId;
  renderTopics();      
  renderVocabulary();  
}

function renderVocabulary() {
  const container = document.getElementById('vocabularyList');
  const emptyState = document.getElementById('emptyState');
  
  if (!container || !emptyState) return;
  
 
  const topic = vocabularyTopics.find(t => t.id === currentTopic);
  
  if (!topic || !topic.words || topic.words.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  
  let words = [...topic.words];  
  
  if (currentFilter !== 'all' && currentUser) {
    words = words.filter(word => {
      const status = getStatus(topic.id, word.english);
      return status === currentFilter;
    });
  }
  
  if (words.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h4>Không tìm thấy từ vựng</h4>
        <p>Thử thay đổi bộ lọc</p>
      </div>
    `;
    return;
  }
  
  container.style.display = 'grid';
  emptyState.style.display = 'none';
  
  let html = '';
  for (let word of words) {
    const status = getStatus(topic.id, word.english);
    html += createCard(word, status, topic.id);
  }
  
  container.innerHTML = html;
}


function createCard(word, status, topicId) {
  const statusClass = status || 'not-learned';
  const hasImage = word.image && word.image.trim() !== '';
  const defaultIcon = '<i class="fas fa-book-open"></i>';
  
  return `
    <div class="vocab-card">
      <div class="vocab-status ${statusClass}"></div>
      
      ${hasImage 
        ? `<img src="${word.image}" alt="${word.english}" class="vocab-image" 
                onerror="this.onerror=null; this.classList.add('no-image'); this.innerHTML='${defaultIcon}` 
        : `<div class="vocab-image no-image">${defaultIcon}</div>`
      }
      
      <div class="vocab-content">
        <div class="vocab-english">${word.english}</div>
        <div class="vocab-phonetic">${word.phonetic}</div>
        <div class="vocab-vietnamese">${word.vietnamese}</div>
        
        <div class="vocab-example">
          <strong>VD:</strong> ${word.example}
          <br><em>${word.exampleVN}</em>
        </div>
      </div>
      
      <div class="vocab-actions in-content">
        <button class="vocab-btn vocab-btn-sound" 
                onclick="speak('${word.english}', event)">
          <i class="fas fa-volume-up"></i>
        </button>
        <button class="vocab-btn vocab-btn-learn" 
                onclick="startLearning('${topicId}')">
          <i class="fas fa-graduation-cap"></i> Học
        </button>
      </div>
    </div>
  `;
}


function getStatus(topicId, english) {
  if (!currentUser) return 'not-learned';
  
  const topicData = userProgress[topicId] || {};
  const key = english.toLowerCase().replace(/\s+/g, '_');
  
  return topicData[key]?.status || 'not-learned';
}

// loc
function filterByStatus(status, element) {
  currentFilter = status;
  
  // bo acitve
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  
  //them active
  element.classList.add('active');
  
  renderVocabulary();
}

// TÌM KIẾM TỪ VỰNG

function searchVocabulary() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const keyword = searchInput.value.toLowerCase().trim();
  
  if (!keyword) {
    renderVocabulary();
    return;
  }
  
  const topic = vocabularyTopics.find(t => t.id === currentTopic);
  if (!topic) return;
  
  const filtered = topic.words.filter(word => {
    return word.english.toLowerCase().includes(keyword) ||
           word.vietnamese.toLowerCase().includes(keyword) ||
           word.example.toLowerCase().includes(keyword);
  });
  
  const container = document.getElementById('vocabularyList');
  if (!container) return;
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h4>Không tìm thấy</h4>
        <p>Thử từ khóa khác</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  for (let word of filtered) {
    const status = getStatus(topic.id, word.english);
    html += createCard(word, status, topic.id);
  }
  
  container.innerHTML = html;
}


//PHÁT ÂM TỪ

function speak(text, event) {
  if (event) event.stopPropagation();
  
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('⚠️ Trình duyệt không hỗ trợ phát âm');
  }
}

// HỌC (CÓ RANDOM)
function startLearning(topicId, isRandom = false) {
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để học từ vựng!', 'warning');
    showGlobalLoginModal();
    return;
  }
  
  const topic = vocabularyTopics.find(t => t.id === topicId);
  if (!topic) return;
  learningWords = [...topic.words];
  if (isRandom) {
    shuffleArray(learningWords);
  }
  
  currentWordIndex = 0;
  
  const modal = document.getElementById('learnModal');
  if (modal) {
    new bootstrap.Modal(modal).show();
    showWord(currentWordIndex);
  }
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function showWord(index) {
  if (index < 0 || index >= learningWords.length) return;
  
  const word = learningWords[index];
  const hasImage = word.image && word.image.trim() !== '';
  
  
  const front = document.querySelector('.flashcard-front');
  if (front) {
    front.innerHTML = `
      ${hasImage ? `<img src="${word.image}" alt="${word.english}" class="flashcard-image" onerror="this.style.display='none';">` : ''}
      <div class="flashcard-text-content">
        <div class="word-english">${word.english}</div>
        <div class="word-phonetic">${word.phonetic}</div>
        <button class="btn-sound" onclick="playSound(event)">
          <i class="fas fa-volume-up"></i>
        </button>
      </div>
    `;
  }
  
  document.getElementById('wordVietnamese').textContent = word.vietnamese;
  document.getElementById('wordExample').innerHTML = `
    <strong>Example:</strong> ${word.example}<br>
    <em>${word.exampleVN}</em>
  `;
  
  // Cập nhật progress
  document.getElementById('currentWord').textContent = index + 1;
  document.getElementById('totalWords').textContent = learningWords.length;
  
  const percent = ((index + 1) / learningWords.length) * 100;
  document.getElementById('progressBar').style.width = percent + '%';
  
  document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}


// PHÁT ÂM TRONG MODAL

function playSound(event) {
  event.stopPropagation();
  const word = learningWords[currentWordIndex];
  if (word) speak(word.english);
}


// TỪ TIẾP THEO

function nextWord() {
  if (currentWordIndex < learningWords.length - 1) {
    currentWordIndex++;
    showWord(currentWordIndex);
  } else {
    showNotification('🎉 Đã hoàn thành!', 'success');
    completeLearn();
  }
}

// TỪ TRƯỚC

function previousWord() {
  if (currentWordIndex > 0) {
    currentWordIndex--;
    showWord(currentWordIndex);
  }
}


// ĐÁNH DẤU ĐÃ HỌC

async function markAsLearned() {
  if (!currentUser) return;
  
  const word = learningWords[currentWordIndex];
  const key = word.english.toLowerCase().replace(/\s+/g, '_');
  
  if (!userProgress[currentTopic]) {
    userProgress[currentTopic] = {};
  }
  
  const oldStatus = userProgress[currentTopic][key]?.status || 'not-learned';
  
  let newStatus = 'learning';
  if (oldStatus === 'learning') {
    newStatus = 'mastered';
  }
  
  userProgress[currentTopic][key] = {
    status: newStatus,
    learned_at: new Date().toISOString()
  };
  
  // Lưu database
  await saveProgress(currentTopic, key, newStatus);
  
  const msg = newStatus === 'mastered' ? '⭐ Đã thành thạo!' : '✅ Đã đánh dấu!';
  showNotification(msg, 'success');
  
  // Chuyển sang từ tiếp
  setTimeout(() => nextWord(), 500);
}

// 
// HOÀN THÀNH HỌC

async function completeLearn() {
  const topic = vocabularyTopics.find(t => t.id === currentTopic);
  if (!topic || !currentUser) return;
  
  const modal = document.getElementById('learnModal');
  if (modal) {
    bootstrap.Modal.getInstance(modal)?.hide();
  }
  
  // Cộng EXP
  try {
    const { data: user } = await supabase
      .from('users')
      .select('exp')
      .eq('username', currentUser.username)
      .single();
    
    const newExp = (user.exp || 0) + topic.exp;
    
    await supabase
      .from('users')
      .update({ exp: newExp })
      .eq('username', currentUser.username);
    
    currentUser.exp = newExp;
    
    showNotification(`🎉 +${topic.exp} EXP! Tổng: ${newExp}`, 'success');
    
    updateUserCard();
    renderTopics();
    
  } catch (error) {
    console.error('❌ Lỗi cộng EXP ', error);
  }
}
// LOAD TIẾN ĐỘ TỪ DATABASE

async function loadProgress() {
  if (!currentUser) {
    userProgress = {};
    return;
  }
  
  try {
    const { data } = await supabase
      .from('vocabulary_progress')
      .select('*')
      .eq('user_email', currentUser.email);
    
    userProgress = {};
    
    for (let record of (data || [])) {
      if (!userProgress[record.topic_id]) {
        userProgress[record.topic_id] = {};
      }
      
      userProgress[record.topic_id][record.word_key] = {
        status: record.status,
        learned_at: record.learned_at
      };
    }
     
   
    updateStats();
    
  } catch (error) {
    console.error('❌ Lỗi load:', error);
    userProgress = {};
  }
}

// luu tien do
async function saveProgress(topicId, wordKey, status) {
  if (!currentUser) return;
  
  try {
    const { data: existing } = await supabase
      .from('vocabulary_progress')
      .select('id')
      .eq('user_email', currentUser.email)
      .eq('topic_id', topicId)
      .eq('word_key', wordKey)
      .single();
    
    if (existing) {
      // Update
      await supabase
        .from('vocabulary_progress')
        .update({
          status: status,
          learned_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      // Insert
      await supabase
        .from('vocabulary_progress')
        .insert([{
          user_email: currentUser.email,
          topic_id: topicId,
          word_key: wordKey,
          status: status,
          learned_at: new Date().toISOString()
        }]);
    }
    
  } catch (error) {
    console.error('❌ Lỗi lưu:', error);
  }
}


function updateStats() {
  let totalLearned = 0;
  let totalMastered = 0;
  
  for (let topicId in userProgress) {
    for (let key in userProgress[topicId]) {
      const status = userProgress[topicId][key].status;
      
      if (status !== 'not-learned') totalLearned++;
      if (status === 'mastered') totalMastered++;
    }
  }
  
  const learnedEl = document.getElementById('totalLearned');
  const masteredEl = document.getElementById('totalMastered');
  
  if (learnedEl) learnedEl.textContent = totalLearned;
  if (masteredEl) masteredEl.textContent = totalMastered;
}

function updateUserCard() {
  const userCard = document.getElementById('userCard');
  if (!userCard) return;
  
  if (!currentUser) {
    userCard.innerHTML = `
      <div class="login-required">
        <i class="fas fa-user-circle"></i>
        <h4>Vui lòng đăng nhập</h4>
        <p>Đăng nhập để lưu tiến độ học tập</p>
        <button class="btn btn-primary btn-lg" onclick="showGlobalLoginModal()">
          <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập ngay
        </button>
      </div>
    `;
    return;
  }
  
  // Tính thống kê
  let totalWords = 0;
  let learnedWords = 0;
  
  for (let topic of vocabularyTopics) {
    totalWords += topic.words.length;
    learnedWords += countLearned(topic.id);
  }
  
  const percent = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
  
  userCard.innerHTML = `
    <img src="${currentUser.avatar}" alt="Avatar" class="user-avatar">
    <h3 class="user-name">${currentUser.name}</h3>
    
    <div class="user-details">
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-star"></i> EXP
        </span>
        <span class="user-value">${currentUser.exp || 0}</span>
      </div>
      
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-book"></i> Từ đã học
        </span>
        <span class="user-value">${learnedWords}/${totalWords}</span>
      </div>
      
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-chart-line"></i> Tiến độ
        </span>
        <span class="user-value">${percent}%</span>
      </div>
    </div>
    
    <div class="user-buttons">
      <button class="btn btn-primary btn-edit" onclick="window.location.href='../../index.html'">
        <i class="fas fa-home"></i> Về trang chủ
      </button>
      <button class="btn btn-danger btn-logout" onclick="globalLogout()">
        <i class="fas fa-sign-out-alt"></i> Đăng xuất
      </button>
    </div>
  `;
}

console.log('✅ vocabulary.js');