
// EXERCISE.JS - 

'use strict';

let reviewSchedule = {};
let exerciseHistory = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0;
let selectedAnswer = null;
let exerciseMode = '';

document.addEventListener('DOMContentLoaded', function() {

  waitForCurrentUser();
});


function waitForCurrentUser() {
  
  let attempts = 0;
  const maxAttempts = 50;
  
  const checkInterval = setInterval(() => {
    attempts++;
    
    if (typeof currentUser !== 'undefined') {
      clearInterval(checkInterval);
      initExercisePage();
    } 
    else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      initExercisePage();
    }
  }, 100);
}

async function initExercisePage() {
  
  loadReviewSchedule();
  await loadExerciseHistory();
  
  await updateStats();
  updateReviewCount();
  renderHistory();
  
  if (currentUser) {
    updateUserCard();
  }
  
  console.log('✅ Exercise page ');
}

//LOAD/SAVE LỊCH ÔN TẬP

function loadReviewSchedule() {
  try {
    if (!currentUser) {
      reviewSchedule = {};
      return;
    }
    
    const key = `reviewSchedule_${currentUser.email}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
      reviewSchedule = JSON.parse(saved);
    } else {
      reviewSchedule = {};
    }
  } catch (error) {
    console.error('❌ Lỗi ', error);
    reviewSchedule = {};
  }
}

function saveReviewSchedule() {
  try {
    if (!currentUser) return;
    
    const key = `reviewSchedule_${currentUser.email}`;
    localStorage.setItem(key, JSON.stringify(reviewSchedule));
  } catch (error) {
    console.error('❌ Lỗi ', error);
  }
}


//LỊCH SỬ BÀI TẬP

async function loadExerciseHistory() {
  try {
    if (!currentUser) {
      exerciseHistory = [];
      return;
    }
    
    
    const { data, error } = await supabase
      .from('exercise_results')
      .select('*')
      .eq('user_email', currentUser.email)
      .order('completed_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Lỗi load exercise_results', error);
      exerciseHistory = [];
      return;
    }
    
    exerciseHistory = (data || []).map(record => ({
      mode: record.exercise_type || 'Bài tập',
      date: record.completed_at,
      total: record.total_questions,
      correct: record.correct_answers,
      percent: record.score,
      expEarned: record.exp_earned,
      userEmail: record.user_email
    }));
    
    console.log('✅ Đã load', exerciseHistory.length, 'bài từ database');
    
  } catch (error) {
    console.error('❌ Lỗi loadExerciseHistory', error);
    exerciseHistory = [];
  }
}

// ============================================
// 7. CẬP NHẬT THỐNG KÊ (từ database)
// ============================================
async function updateStats() {
  try {
    if (!currentUser) {
      document.getElementById('totalCompleted').textContent = '0';
      document.getElementById('totalCorrect').textContent = '0';
      document.getElementById('accuracyRate').textContent = '0%';
      document.getElementById('streak').textContent = '0';
      return;
    }
    
    
    const { data: allResults, error } = await supabase
      .from('exercise_results')
      .select('*')
      .eq('user_email', currentUser.email)
      .order('completed_at', { ascending: false });
    
    if (error) {
      console.error('❌ loi lay thong ke ', error);
      return;
    }
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    if (allResults && allResults.length > 0) {
      allResults.forEach(record => {
        totalCompleted++;
        totalCorrect += record.correct_answers || 0;
        totalQuestions += record.total_questions || 0;
      });
    }
    
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    if (allResults && allResults.length > 0) {
      let currentDate = new Date(today);
      
      for (let record of allResults) {
        const recordDate = new Date(record.completed_at).toISOString().split('T')[0];
        const checkDate = currentDate.toISOString().split('T')[0];
        
        if (recordDate === checkDate) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    document.getElementById('totalCompleted').textContent = totalCompleted;
    document.getElementById('totalCorrect').textContent = totalCorrect;
    document.getElementById('accuracyRate').textContent = accuracy + '%';
    document.getElementById('streak').textContent = streak;
    
    console.log(`✅ Thống kê: ${totalCompleted} bài, ${totalCorrect}/${totalQuestions} đúng, ${accuracy}%, streak ${streak}`);
    
  } catch (error) {
    console.error('❌ Lỗi updateStats ', error);
  }
}


function updateReviewCount() {
  const now = new Date();
  
  let urgent = 0;
  let soon = 0;
  let ok = 0;
  let needReview = 0;
  
  for (let key in reviewSchedule) {
    const item = reviewSchedule[key];
    const nextReview = new Date(item.nextReview);
    const daysUntil = Math.floor((nextReview - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      urgent++;
      needReview++;
    } else if (daysUntil <= 2) {
      soon++;
      needReview++;
    } else {
      ok++;
    }
  }
  
  document.getElementById('reviewCount').textContent = needReview;
  document.getElementById('urgentCount').textContent = urgent;
  document.getElementById('soonCount').textContent = soon;
  document.getElementById('okCount').textContent = ok;
}


function renderHistory() {
  const container = document.getElementById('historyList');
  if (!container) return;
  
  if (exerciseHistory.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        <i class="fas fa-inbox"></i>
        <p>Chưa có lịch sử luyện tập</p>
      </div>
    `;
    return;
  }
  
  const html = exerciseHistory.map(h => {
    const date = new Date(h.date);
    const dateStr = date.toLocaleDateString('vi-VN');
    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const score = h.percent || Math.round((h.correct / h.total) * 100);
    
    return `
      <div class="history-item">
        <div class="history-info">
          <h4>${h.mode}</h4>
          <p>${h.correct}/${h.total} câu đúng • +${h.expEarned || 0} EXP</p>
        </div>
        <div class="history-result">
          <span class="history-score">${score}%</span>
          <span class="history-time">${dateStr} ${timeStr}</span>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

// tạo câu hỏi từ vựng 

function generateVocabQuestions(count = 10) {
  const questions = [];
  const allWords = [];
  
  if (typeof vocabularyTopics === 'undefined') {
    console.error('❌ từ uvjwng k không tồn tại!');
    return questions;
  }
  
  vocabularyTopics.forEach(topic => {
    topic.words.forEach(word => {
      allWords.push({
        ...word,
        topicId: topic.id,
        itemKey: `vocab_${topic.id}_${word.english.toLowerCase().replace(/\s+/g, '_')}`
      });
    });
  });
  
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  selected.forEach(word => {
    const wrongOptions = allWords
      .filter(w => w.vietnamese !== word.vietnamese)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.vietnamese);
    
    questions.push({
      type: 'vocab',
      itemKey: word.itemKey,
      question: `"${word.english}" có nghĩa là gì?`,
      options: [word.vietnamese, ...wrongOptions].sort(() => 0.5 - Math.random()),
      correct: word.vietnamese,
      explanation: `<strong>${word.english}</strong> = ${word.vietnamese}<br><br><em>Ví dụ:</em> ${word.example}`
    });
  });
  
  return questions;
}


function startVocabMode() {

  
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để sử dụng tính năng này!', 'warning');
    showGlobalLoginModal();
    return;
  }
  
  const questions = generateVocabQuestions(10);
  
  if (questions.length === 0) {
    showNotification('❌ Không có câu hỏi nào được tạo. Vui lòng kiểm tra dữ liệu!', 'error');
    return;
  }
  
  exerciseMode = 'Luyện từ vựng';
  startExercise(questions);
}

function startGrammarMode() {
  showNotification('Chức năng đang được phát triển!', 'info');
}

function startReviewMode() {
  showNotification('Chức năng đang được phát triển!', 'info');
}

function startMixedMode() {
  showNotification('Chức năng đang được phát triển!', 'info');
}

// 15. BẮT ĐẦU BÀI TẬP
function startExercise(questions) {
  
  
  currentQuestions = questions;
  currentQuestionIndex = 0;
  currentScore = 0;
  selectedAnswer = null;
  
  document.getElementById('exerciseTitle').textContent = exerciseMode;
  document.getElementById('totalQ').textContent = questions.length;
  
  const modal = new bootstrap.Modal(document.getElementById('exerciseModal'));
  modal.show();
  
  showQuestion();
}

function showQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  if (!question) return;
  
  selectedAnswer = null;
  
  document.getElementById('currentQ').textContent = currentQuestionIndex + 1;
  document.getElementById('currentScore').textContent = currentScore;
  
  const percent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
  document.getElementById('exerciseProgressBar').style.width = percent + '%';
  
  document.getElementById('questionContainer').innerHTML = `
    <div class="question-type">${question.type === 'vocab' ? 'Từ vựng' : 'Ngữ pháp'}</div>
    <div class="question-text">${question.question}</div>
  `;
  
  const optionsHTML = question.options.map((opt, index) => {
    const letter = String.fromCharCode(65 + index);
    return `
      <div class="option-item" onclick="selectAnswer('${opt.replace(/'/g, "\\'")}', this)">
        <div class="option-letter">${letter}</div>
        <div class="option-text">${opt}</div>
      </div>
    `;
  }).join('');
  
  document.getElementById('optionsContainer').innerHTML = optionsHTML;
  document.getElementById('explanationBox').style.display = 'none';
  
  document.getElementById('skipBtn').style.display = 'inline-flex';
  document.getElementById('checkBtn').style.display = 'inline-flex';
  document.getElementById('nextBtn').style.display = 'none';
}


// CHỌN ĐÁP ÁN

function selectAnswer(answer, element) {
  document.querySelectorAll('.option-item').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  element.classList.add('selected');
  selectedAnswer = answer;
}

// KIỂM TRA ĐÁP ÁN

function checkAnswer() {
  if (!selectedAnswer) {
    showNotification('Vui lòng chọn đáp án!', 'warning');
    return;
  }
  
  const question = currentQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correct;
  
  if (isCorrect) {
    currentScore++;
  }
  
  document.querySelectorAll('.option-item').forEach(opt => {
    opt.classList.add('disabled');
    
    const text = opt.querySelector('.option-text').textContent;
    if (text === question.correct) {
      opt.classList.add('correct');
    } else if (text === selectedAnswer && !isCorrect) {
      opt.classList.add('wrong');
    }
  });
  
  document.getElementById('explanationText').innerHTML = question.explanation;
  document.getElementById('explanationBox').style.display = 'block';
  
  document.getElementById('skipBtn').style.display = 'none';
  document.getElementById('checkBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'inline-flex';
  
  if (isCorrect) {
    showNotification('✅ Chính xác!', 'success');
  } else {
    showNotification('❌ Chưa đúng, đáp án là: ' + question.correct, 'error');
  }
}

// BỎ QUA - CÂU TIẾP THEO

function skipQuestion() {
  if (confirm('Bạn có chắc muốn bỏ qua câu này?')) {
    nextQuestion();
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex >= currentQuestions.length) {
    finishExercise();
  } else {
    showQuestion();
  }
}

// ket thuc bai tap la diem danh 

async function finishExercise() {
  const total = currentQuestions.length;
  const correct = currentScore;
  const percent = Math.round((correct / total) * 100);
  
  const baseExp = 10;
  const expEarned = correct * baseExp;
  
  
  try {
    
    const { error: insertError } = await supabase
      .from('exercise_results')
      .insert([{
        user_email: currentUser.email,
        exercise_type: exerciseMode,
        total_questions: total,
        correct_answers: correct,
        score: percent,
        exp_earned: expEarned,
        completed_at: new Date().toISOString()
      }]);
    
    if (insertError) {
      throw new Error('Lỗi lưu exercise_results : ' + insertError.message);
    }
    
    console.log('Đã lưu kết quả vào database');
    
    const newExp = currentUser.exp + expEarned;
    const newRank = calculateRank(newExp);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({
        exp: newExp,
        rank: newRank
      })
      .eq('email', currentUser.email);
    
    if (updateError) {
      throw new Error('Lỗi cập nhật EXP: ' + updateError.message);
    }
    
    currentUser.exp = newExp;
    currentUser.rank = newRank;


    if (typeof autoCheckIn !== 'function') {
      showNotification('⚠️ Lỗi: Không thể điểm danh tự động', 'warning');
    } else {   
      try {
        const checkInResult = await autoCheckIn('exercise');
        
        if (checkInResult === true) {
          showNotification('🎉 Điểm danh thành công! Tiếp tục phát huy!', 'success');
        } else if (checkInResult === false) {
        } else {
          console.log('⚠️ Kết quả điểm danh không xác định :', checkInResult);
        }
      } catch (checkInError) {
    
        showNotification('⚠️ Có lỗi khi điểm danh: ' + checkInError.message, 'warning');
      }
    }
    

    await new Promise(resolve => setTimeout(resolve, 500));
    

    if (typeof updateAttendanceUI === 'function') {
      console.log(' Đang cập nhật att...');
      await updateAttendanceUI();
      console.log('Đã cập nhậtattt');
    } else {
      console.warn('Không tt hàm updateAttendanceUI');
    }
    

    
    const modal = bootstrap.Modal.getInstance(document.getElementById('exerciseModal'));
    if (modal) modal.hide();
    
    await loadExerciseHistory();
    await updateStats();
    updateReviewCount();
    renderHistory();
    
    if (typeof updateAuthUI === 'function') {
      updateAuthUI();
    }
    if (typeof updateUserCard === 'function') {
      updateUserCard();
    }

    let message = `🎉 Hoàn thành bài tập!<br><br>`;
    message += `📊 Kết quả: ${correct}/${total} câu (${percent}%)<br>`;
    message += `⭐ +${expEarned} EXP<br>`;
    
    if (percent >= 90) {
      message += '<br>🏆 Xuất sắc!';
    } else if (percent >= 70) {
      message += '<br>⭐ Tốt lắm!';
    } else if (percent >= 50) {
      message += '<br>👍 Khá đấy!';
    } else {
      message += '<br>💪 Cố lên bạn nhé!';
    }
    
    showNotification(message, 'success');
  
    
  } catch (error) {
    console.error('❌ Lỗi trong finishExercise:', error);
    showNotification('Có lỗi xảy ra: ' + error.message, 'error');
  }
}

function updateUserCard() {
  const userCard = document.getElementById('userCard');
  if (!userCard || !currentUser) return;
  
  userCard.innerHTML = `
    <img src="${currentUser.avatar}" alt="Avatar" class="user-avatar">
    <h4 class="user-name">${currentUser.name}</h4>
    
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
          <i class="fas fa-star"></i>
          EXP
        </span>
        <span class="user-value">${currentUser.exp || 0}</span>
      </div>
      
      <div class="user-item">
        <span class="user-label">
          <i class="fas fa-trophy"></i>
          Rank
        </span>
        <span class="user-value">${currentUser.rank || 'Người mới'}</span>
      </div>
    </div>
    
    <div class="user-buttons">
      <button class="btn-edit" onclick="window.location.href='../../index.html'">
        <i class="fas fa-home"></i>
        Về trang chủ
      </button>
      <button class="btn-logout" onclick="globalLogout()">
        <i class="fas fa-sign-out-alt"></i>
        Đăng xuất
      </button>
    </div>
  `;
}

window.onUserLoginSuccess = async function() {
  console.log('✅ User đã đăng nhập vào Exercise page');
  loadReviewSchedule();
  await loadExerciseHistory();
  updateUserCard();
  await updateStats();
  updateReviewCount();
  renderHistory();
};

window.onUserLogout = function() {
  console.log('👋 User đã đăng xuất khỏi Exercise page');
  reviewSchedule = {};
  exerciseHistory = [];
  
  const userCard = document.getElementById('userCard');
  if (userCard) {
    userCard.innerHTML = `
      <div class="login-required">
        <i class="fas fa-user-circle"></i>
        <h4>Vui lòng đăng nhập</h4>
        <p>Đăng nhập để lưu tiến độ ôn tập của bạn</p>
        <button class="btn btn-primary btn-lg" onclick="showGlobalLoginModal()">
          <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập ngay
        </button>
      </div>
    `;
  }
  
  updateStats();
  updateReviewCount();
  renderHistory();
};

console.log('✅ exercise.j');