// ============================================
// ATTENDANCE.JS - XỬ LÝ ĐIỂM DANH HẰNG NGÀY
// ============================================
// Attendance storage key
const ATTENDANCE_KEY = 'learning_attendance';

/**
 * Load attendance data from localStorage
 * @returns {Object} All attendance data
 */
function loadAttendance() {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * Save attendance data to localStorage
 * @param {Object} attendanceData - Attendance data to save
 */
function saveAttendance(attendanceData) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceData));
}

/**
 * Get attendance data for specific user
 * @param {string} email - User's email
 * @returns {Object} User's attendance data
 */
function getUserAttendance(email) {
  const allAttendance = loadAttendance();
  return allAttendance[email] || {
    lastCheckIn: null,
    streak: 0,
    totalDays: 0,
    totalExp: 0,
    checkInHistory: []
  };
}

/**
 * Check if user can check in today
 * @param {string} email - User's email
 * @returns {boolean} True if user can check in
 */
function canCheckInToday(email) {
  const attendance = getUserAttendance(email);
  const today = new Date().toDateString();
  return attendance.lastCheckIn !== today;
}

/**
 * Main check-in function
 * Handles daily attendance and rewards
 */
function checkIn() {
  // Check if user is logged in
  if (!currentUser) {
    showToast('Vui lòng đăng nhập để điểm danh!', 'error');
    showLoginModal();
    return;
  }

  // Check if already checked in today
  if (!canCheckInToday(currentUser.email)) {
    showToast('Bạn đã điểm danh hôm nay rồi! 😊', 'error');
    return;
  }

  // Load attendance data
  const allAttendance = loadAttendance();
  const userAttendance = getUserAttendance(currentUser.email);

  // Get date information
  const today = new Date();
  const todayStr = today.toDateString();
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // Calculate streak
  if (userAttendance.lastCheckIn === yesterdayStr) {
    // Continue streak - user checked in yesterday
    userAttendance.streak++;
  } else if (userAttendance.lastCheckIn !== todayStr) {
    // Reset streak - user missed days
    userAttendance.streak = 1;
  }

  // Calculate EXP reward
  const baseExp = 10; // Base reward for checking in
  const streakBonus = Math.min(userAttendance.streak * 2, 50); // Bonus based on streak (max 50)
  const earnedExp = baseExp + streakBonus;

  // Update attendance record
  userAttendance.lastCheckIn = todayStr;
  userAttendance.totalDays++;
  userAttendance.totalExp += earnedExp;
  
  // Add to history
  userAttendance.checkInHistory.push({
    date: todayStr,
    timestamp: new Date().toISOString(),
    exp: earnedExp,
    streak: userAttendance.streak
  });

  // Keep only last 30 days in history to save space
  if (userAttendance.checkInHistory.length > 30) {
    userAttendance.checkInHistory = userAttendance.checkInHistory.slice(-30);
  }

  // Update user EXP
  currentUser.exp += earnedExp;
  updateRank(); // Update user rank based on new EXP
  allUsers[currentUser.email] = currentUser;
  saveUsers();

  // Save attendance data
  allAttendance[currentUser.email] = userAttendance;
  saveAttendance(allAttendance);

  // Show success message with details
  let message = `🎉 Điểm danh thành công! +${earnedExp} EXP`;
  if (userAttendance.streak > 1) {
    message += ` (🔥 ${userAttendance.streak} ngày liên tiếp!)`;
  }
  showToast(message, 'success');

  // Update UI to reflect changes
  updateUI();
  updateAttendanceUI();

  // Check for milestones
  checkAttendanceMilestones(userAttendance);
}

/**
 * Check and notify user about attendance milestones
 * @param {Object} attendance - User's attendance data
 */
function checkAttendanceMilestones(attendance) {
  const milestones = [
    { days: 7, message: '🎊 Chúc mừng! Bạn đã điểm danh 7 ngày!' },
    { days: 30, message: '🏆 Xuất sắc! 30 ngày điểm danh!' },
    { days: 100, message: '⭐ Đỉnh cao! 100 ngày điểm danh!' },
    { days: 365, message: '👑 Huyền thoại! 1 năm điểm danh!' }
  ];

  const milestone = milestones.find(m => m.days === attendance.totalDays);
  if (milestone) {
    setTimeout(() => {
      showToast(milestone.message, 'success');
    }, 1500);
  }

  // Check streak milestones
  const streakMilestones = [
    { streak: 7, message: '🔥 Streak 7 ngày! Tuyệt vời!' },
    { streak: 30, message: '🔥🔥 Streak 30 ngày! Không thể tin được!' },
    { streak: 100, message: '🔥🔥🔥 Streak 100 ngày! Bạn là huyền thoại!' }
  ];

  const streakMilestone = streakMilestones.find(m => m.streak === attendance.streak);
  if (streakMilestone) {
    setTimeout(() => {
      showToast(streakMilestone.message, 'success');
    }, 2000);
  }
}

/**
 * Update attendance UI elements
 * Displays current streak, total days, and total EXP earned
 */
function updateAttendanceUI() {
  // Default values when not logged in
  if (!currentUser) {
    document.getElementById('streakNumber').textContent = '0';
    document.getElementById('totalDays').textContent = '0';
    document.getElementById('expEarned').textContent = '0';
    document.getElementById('checkInBtn').disabled = false;
    document.getElementById('nextCheckIn').style.display = 'none';
    return;
  }

  // Get user's attendance data
  const attendance = getUserAttendance(currentUser.email);
  
  // Update statistics
  document.getElementById('streakNumber').textContent = attendance.streak;
  document.getElementById('totalDays').textContent = attendance.totalDays;
  document.getElementById('expEarned').textContent = attendance.totalExp;

  // Update button state
  const canCheckIn = canCheckInToday(currentUser.email);
  const checkInBtn = document.getElementById('checkInBtn');
  const nextCheckInMsg = document.getElementById('nextCheckIn');

  checkInBtn.disabled = !canCheckIn;
  
  if (canCheckIn) {
    checkInBtn.innerHTML = '<i class="fas fa-check-circle"></i> Điểm danh ngay';
    nextCheckInMsg.style.display = 'none';
  } else {
    checkInBtn.innerHTML = '<i class="fas fa-check-circle"></i> Đã điểm danh';
    nextCheckInMsg.style.display = 'block';
    
    // Calculate time until next check-in
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const now = new Date();
    const timeUntilTomorrow = tomorrow - now;
    const hoursLeft = Math.floor(timeUntilTomorrow / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeUntilTomorrow % (1000 * 60 * 60)) / (1000 * 60));
    
    nextCheckInMsg.innerHTML = `
      ✅ Bạn đã điểm danh hôm nay!<br>
      <small>Quay lại sau ${hoursLeft}h ${minutesLeft}p</small>
    `;
  }
}

/**
 * Get attendance statistics for display
 * @param {string} email - User's email
 * @returns {Object} Attendance statistics
 */
function getAttendanceStats(email) {
  const attendance = getUserAttendance(email);
  
  return {
    currentStreak: attendance.streak,
    totalDays: attendance.totalDays,
    totalExp: attendance.totalExp,
    lastCheckIn: attendance.lastCheckIn,
    canCheckIn: canCheckInToday(email),
    history: attendance.checkInHistory
  };
}

/**
 * Reset attendance data (for testing purposes)
 * WARNING: This will delete all attendance data
 */
function resetAttendanceData() {
  if (confirm('⚠️ Bạn có chắc muốn xóa toàn bộ dữ liệu điểm danh?')) {
    localStorage.removeItem(ATTENDANCE_KEY);
    showToast('Đã xóa dữ liệu điểm danh!', 'success');
    updateAttendanceUI();
  }
}