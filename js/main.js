// ============================================
// MAIN.JS - MINIMAL VERSION
// Chỉ chứa các hàm hỗ trợ, KHÔNG có updateUI
// ============================================

'use strict';

/**
 * Set max date for birthday inputs
 */
function setMaxBirthday() {
  try {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    const maxDateString = maxDate.toISOString().split('T')[0];
    
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const minDateString = minDate.toISOString().split('T')[0];
    
    const birthdayInputs = document.querySelectorAll('#registerBirthday, #editBirthday');
    birthdayInputs.forEach(input => {
      if (input) {
        input.max = maxDateString;
        input.min = minDateString;
      }
    });
    
    console.log('✅ Đã set giới hạn ngày sinh');
  } catch (error) {
    console.error('❌ Lỗi setMaxBirthday:', error);
  }
}

/**
 * Initialize app
 */
function initApp() {
  console.log('🚀 [initApp] Đang khởi động ứng dụng...');
  
  try {
    // Load data
    if (typeof loadUsers === 'function') {
      loadUsers();
    } else {
      console.warn('⚠️ loadUsers chưa được định nghĩa');
    }
    
    // Update UI
    if (typeof updateUI === 'function') {
      updateUI();
    } else {
      console.warn('⚠️ updateUI chưa được định nghĩa');
    }
    
    if (typeof updateAttendanceUI === 'function') {
      updateAttendanceUI();
    } else {
      console.warn('⚠️ updateAttendanceUI chưa được định nghĩa');
    }
    
    // Set birthday limits
    setMaxBirthday();
    
    // Add event listeners
    setupEventListeners();
    
    console.log('✅ [initApp] Ứng dụng đã sẵn sàng!');
    console.log('📊 [initApp] Thống kê:');
    console.log('   - Tổng users:', typeof allUsers !== 'undefined' ? Object.keys(allUsers).length : 'N/A');
    console.log('   - User hiện tại:', typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Chưa đăng nhập');
  } catch (error) {
    console.error('❌ [initApp] Lỗi khởi động:', error);
    if (typeof showToast === 'function') {
      showToast('Có lỗi xảy ra khi khởi động ứng dụng!', 'error');
    }
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  try {
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('hidden.bs.modal', function() {
        const forms = this.querySelectorAll('form');
        forms.forEach(form => {
          if (form.id !== 'editProfileForm') {
            form.reset();
          }
        });
      });
    });
    
    // Prevent form submission on Enter key in some inputs
    document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
        }
      });
    });
    
    console.log('✅ Đã setup event listeners');
  } catch (error) {
    console.error('❌ Lỗi setupEventListeners:', error);
  }
}

/**
 * Debug: Show all users in console
 */
function debugShowUsers() {
  if (typeof allUsers !== 'undefined') {
    console.log('📋 Danh sách users:', allUsers);
    console.table(Object.values(allUsers).map(u => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      Gender: u.gender,
      EXP: u.exp,
      Rank: u.rank
    })));
  } else {
    console.log('⚠️ allUsers chưa được định nghĩa');
  }
}

/**
 * Debug: Show current user
 */
function debugShowCurrentUser() {
  if (typeof currentUser !== 'undefined' && currentUser) {
    console.log('👤 User hiện tại:', currentUser);
  } else {
    console.log('ℹ️ Chưa đăng nhập');
  }
}

/**
 * Force update UI
 */
function forceUpdateUI() {
  console.log('🔄 [forceUpdateUI] Bắt buộc cập nhật UI...');
  
  if (typeof loadUsers === 'function') {
    loadUsers();
  }
  
  if (typeof updateUI === 'function') {
    updateUI();
  }
  
  if (typeof updateAttendanceUI === 'function') {
    updateAttendanceUI();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Expose debug functions to window
window.debugShowUsers = debugShowUsers;
window.debugShowCurrentUser = debugShowCurrentUser;
window.forceUpdateUI = forceUpdateUI;

if (typeof clearAllData !== 'undefined') {
  window.clearAllData = clearAllData;
}

// Log to console
console.log('✅ main.js đã load thành công (Minimal Version)');
console.log('💡 Sử dụng các lệnh debug:');
console.log('   - debugShowUsers() - Xem tất cả users');
console.log('   - debugShowCurrentUser() - Xem user hiện tại');
console.log('   - forceUpdateUI() - Bắt buộc cập nhật UI');
console.log('   - clearAllData() - Xóa toàn bộ dữ liệu');