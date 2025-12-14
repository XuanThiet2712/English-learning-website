// ATTENDANCE.JS - ĐÃ SỬA LỖI LOGIC

async function autoCheckIn(activityType = 'exercise') {      
  
  if (!currentUser) {
    return false;
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Kiểm tra homo nay diem danh chua 
    const { data: existingCheckIn } = await supabase
      .from('attendance')
      .select('id')
      .eq('user_email', currentUser.email)
      .eq('check_in_date', today)
      .single();
    
    if (existingCheckIn) {
      console.log('Đã điểm danh hôm nay rồi');
      return false;
    }
    
    // lay du lieu danh sach diem danh
    const { data: allAttendance } = await supabase
      .from('attendance')
      .select('check_in_date')
      .eq('user_email', currentUser.email)
      .order('check_in_date', { ascending: false });
    
    // Tính streak
    const currentStreak = calculateStreak(allAttendance || []);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const checkedInYesterday = allAttendance && allAttendance.some(r => r.check_in_date === yesterdayStr);
    const newStreak = checkedInYesterday ? currentStreak + 1 : 1;
    
    // Tính EXP
    const baseExp = 15;
    const streakBonus = Math.min(newStreak * 2, 50);
    const earnedExp = baseExp + streakBonus;
    
    // Lưu vào database
    const { error: insertError } = await supabase
      .from('attendance')
      .insert([{
        user_email: currentUser.email,
        check_in_date: today,
        exp_earned: earnedExp,
        streak: newStreak,
        activity_type: activityType
      }]);
    
    if (insertError) throw insertError;
    
    // Cập nhật EXP và Rank của user
    const newExp = currentUser.exp + earnedExp;
    const newRank = calculateRank(newExp);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({
        exp: newExp,
        rank: newRank
      })
      .eq('email', currentUser.email);
    
    if (updateError) throw updateError;
    
    // Cập nhật currentUser
    currentUser.exp = newExp;
    currentUser.rank = newRank;
    
    // Hiển thị thông báo
    let message = `🎉 Điểm danh thành công! +${earnedExp} EXP`;
    if (newStreak > 1) {
      message += ` (🔥 ${newStreak} ngày liên tiếp!)`;
    }
    showNotification(message, 'success');
    
    // Kiểm tra milestone
    checkAttendanceMilestones(allAttendance ? allAttendance.length + 1 : 1, newStreak);
  
    
    // update giao dien
    setTimeout(() => {
      updateAttendanceUI();
      if (typeof updateAuthUI === 'function') updateAuthUI();
      if (typeof updateUserCard === 'function') updateUserCard();
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Lỗi autoCheckIn:', error);
    return false;
  }
}

// Cập nhật nhat giao dien diem danh
async function updateAttendanceUI() {
 
  
  const attendanceCard = document.querySelector('.attendance-card');
  if (!attendanceCard) {
    return;
  }
  
  if (!currentUser || currentUser === null || currentUser === undefined) {
   
    attendanceCard.innerHTML = `
      <h3>  <img class = "logo" src="asset/logo7day.png" style="height: 40px ; width: 40px ;">  Chào mừng đến Seven Day!</h3>
      
      <div class="intro-section">
        <div class="intro-icon">
          <i class="fas fa-book-reader"></i>
        </div>
        <h4>Nơi Học Tiếng Anh Thông Minh Mỗi Ngày</h4>
        <p>
          Phương pháp học vui nhộn, hiệu quả với hệ thống game, bài tập đa dạng 
          và điểm danh thúc đẩy động lực. Chỉ 15 phút mỗi ngày, tiến bộ rõ rệt sau 7 ngày!
        </p>
      
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
              <i class="fas fa-book"></i>
            </div>
            <h5>Từ vựng phong phú</h5>
            <p>5000+ từ vựng theo chủ đề thực tế</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
              <i class="fas fa-language"></i>
            </div>
            <h5>Ngữ pháp dễ hiểu</h5>
            <p>Giải thích ngắn gọn với ví dụ sinh động</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7);">
              <i class="fas fa-gamepad"></i>
            </div>
            <h5>Game học tập</h5>
            <p>Học qua chơi, ghi nhớ lâu hơn</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon" style="background: linear-gradient(135deg, #ff6b6b, #ee5a6f);">
              <i class="fas fa-fire"></i>
            </div>
            <h5>Điểm danh streak</h5>
            <p>Xây dựng thói quen học bền vững</p>
          </div>
        </div>

        <button class="btn-cta" onclick="showGlobalLoginModal()">
          <i class="fas fa-rocket"></i>
          Bắt đầu học ngay
        </button>
        <p style="margin-top: 15px; font-size: 0.9rem; color: #999; font-style: italic;">
          Miễn phí 100% • Thật ra cũng có thể không ...
        </p>
      </div>
    `;
    return;
  }
  
  
  try {
    // Lấy dữ liệu điểm danh
    const { data: attendanceRecords, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_email', currentUser.email)
      .order('check_in_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    

    
    // Tính toán thống kê : a Phus lo phan nay cho e nhe 
    const totalDays = attendanceRecords ? attendanceRecords.length : 0;
    const totalExp = attendanceRecords ? 
      attendanceRecords.reduce((sum, r) => sum + (r.exp_earned || 0), 0) : 0;
    const currentStreak = calculateStreak(attendanceRecords || []);
    
    // kiem tra da diem danh hom nay chua 
    const today = new Date().toISOString().split('T')[0];
    const checkedInToday = attendanceRecords && 
      attendanceRecords.some(r => r.check_in_date === today);
    
    // tao du lieu 7 ngay gan nhat
    const last7Days = getLast7Days();
    const calendarData = last7Days.map(dateStr => {
      const record = attendanceRecords?.find(r => r.check_in_date === dateStr);
      return {
        date: dateStr,
        checked: !!record,
        isToday: dateStr === today
      };
    });
    
    // cap nhat giao dien 
    attendanceCard.innerHTML = `
      <h3><i class="fas fa-calendar-check"></i> Lịch điểm danh</h3>
      
      <!-- Hiển thị streak -->
      <div class="streak-main">
        <div class="streak-icon-box">
          <i class="fas fa-fire"></i>
        </div>
        <div class="streak-info">
          <div class="streak-number">${currentStreak}</div>
          <div class="streak-label">Ngày liên tiếp</div>
        </div>
      </div>

      <div class="calendar-week">
        ${calendarData.map(day => {
          const date = new Date(day.date);
          const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
          const dayNum = date.getDate();
          return `
            <div class="calendar-day ${day.checked ? 'checked' : ''} ${day.isToday ? 'today' : ''}">
              <div class="day-name">${dayName}</div>
              <div class="day-number">${dayNum}</div>
              ${day.checked ? '<div class="check-mark"><i class="fas fa-check"></i></div>' : ''}
              ${day.isToday && !day.checked ? '<div class="today-indicator">Hôm nay</div>' : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Thống kê -->
      <div class="attendance-stats">
        <div class="stat-item">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">${totalDays}</div>
            <div class="stat-label">Tổng ngày</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
            <i class="fas fa-star"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">${totalExp}</div>
            <div class="stat-label">Tổng EXP</div>
          </div>
        </div>
      </div>

      <!-- Ghi chú -->
      <div class="attendance-note ${checkedInToday ? 'checked' : ''}">
        <i class="fas fa-info-circle"></i>
        ${checkedInToday 
          ? '<p>✅ Hôm nay bạn đã điểm danh rồi!</p>' 
          : '<p>💡 Hoàn thành 1 bài tập để điểm danh hôm nay</p>'
        }
      </div>
    `;
    
    console.log('✅ ĐÃ RENDER XONG LỊCH ĐIỂM DANH');
    
  } catch (error) {
    console.error('❌', error);
    attendanceCard.innerHTML = `
      <h3><i class="fas fa-exclamation-triangle"></i> Lỗi</h3>
      <div style="padding: 20px; text-align: center;">
        <p style="color: red;">Không thể tải dữ liệu điểm danh</p>
        <p style="font-size: 0.9rem; color: #666;">${error.message}</p>
      </div>
    `;
  }
}

// lay 7 ngay gan nhat
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

//  milestone - cột mốc điểm danh
function checkAttendanceMilestones(totalDays, streak) {
  const dayMilestones = [
    { days: 1, message: 'Tôi rất mong chờ bạn có thể trụ được tới ngày 7 '},
    { days: 7, message: '🎊 Chúc mừng! 7 ngày điểm danh!' },
    { days: 30, message: '🏆 Xuất sắc! 30 ngày điểm danh!' },
    { days: 100, message: '⭐ Đỉnh cao! 100 ngày điểm danh!' },
    { days: 365, message: '👑 Huyền thoại! 1 năm điểm danh!' }
  ];
  
  const dayMilestone = dayMilestones.find(m => m.days === totalDays);
  if (dayMilestone) {
    setTimeout(() => showNotification(dayMilestone.message, 'success'), 1500);
  }
  
  const streakMilestones = [
    { streak: 7, message: '🔥 Streak 7 ngày! Tuyệt vời!' },
    { streak: 30, message: '🔥🔥 Streak 30 ngày! Không thể tin được!' },
    { streak: 100, message: '🔥🔥🔥 Streak 100 ngày! Bạn là huyền thoại!' }
  ];
  
  const streakMilestone = streakMilestones.find(m => m.streak === streak);
  if (streakMilestone) {
    setTimeout(() => showNotification(streakMilestone.message, 'success'), 2000);
  }
}

// Hiệu ứng pháo hoa

function initAttendance() {
  
  let attempts = 0;
  const maxAttempts = 100; 
  
  const checkInterval = setInterval(() => {
    attempts++;
    
    if (typeof currentUser !== 'undefined') {
      clearInterval(checkInterval);
      setTimeout(() => {
        updateAttendanceUI();
      }, 200);
    }
    
    if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      updateAttendanceUI(); // Gọi anyway
    }
  }, 100);
}

// CALLBACK từ auth-username.js
window.onUserLoginSuccess = async function() {
  setTimeout(() => {
    updateAttendanceUI();
  }, 300);
};

window.onUserLogout = function() {
  setTimeout(() => {
    updateAttendanceUI();
  }, 100);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAttendance);
} else {
  initAttendance();
}

window.autoCheckIn = autoCheckIn;
window.updateAttendanceUI = updateAttendanceUI;

console.log('✅ attendance.js');