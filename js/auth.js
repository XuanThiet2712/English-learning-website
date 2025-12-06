// ============================================
// AUTH.JS - COMPLETE STANDALONE VERSION
// Tất cả hàm cần thiết đều có trong file này!
// ============================================

'use strict';

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'success') {
  try {
    const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';

    const toastHTML = `
      <div class="toast align-items-center text-white ${bgColor} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas fa-${icon}"></i> ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    let container = document.querySelector('.toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = 'position: fixed; top: 90px; right: 24px; z-index: 9999;';
      document.body.appendChild(container);
    }

    container.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = container.lastElementChild;
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    setTimeout(() => {
      if (toastElement && toastElement.parentNode) {
        toastElement.remove();
      }
    }, 4000);
  } catch (error) {
    console.error('❌ Lỗi showToast:', error);
    alert(message);
  }
}

// ============================================
// FORMAT FUNCTIONS
// ============================================

function formatDate(dateString) {
  if (!dateString) return 'Chưa cập nhật';
  
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'N/A';
  }
}

function calculateAge(birthday) {
  if (!birthday) return 'N/A';
  
  try {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return 'N/A';
  }
}

// ============================================
// UPDATE UI - GỘP VÀO ĐÂY
// ============================================

function updateUI() {
  console.log('🔄 [updateUI] Đang cập nhật UI...');
  console.log('👤 [updateUI] Current user:', currentUser);
  
  try {
    const authButton = document.getElementById('authButton');
    const userCard = document.getElementById('userCard');

    if (!authButton || !userCard) {
      console.error('❌ [updateUI] Không tìm thấy elements');
      return;
    }

    if (currentUser) {
      console.log('✅ [updateUI] User đang đăng nhập:', currentUser.name);
      
      // Update auth button
      authButton.innerHTML = `
        <div class="dropdown">
          <a class="nav-link btn-login dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="${currentUser.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; margin-right: 8px; border: 2px solid white;">
            ${currentUser.name}
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#" onclick="showEditProfileModal(); return false;">
                <i class="fas fa-edit"></i> Chỉnh sửa thông tin
              </a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item text-danger" href="#" onclick="logout(); return false;">
                <i class="fas fa-sign-out-alt"></i> Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      `;

      // Update user card
      userCard.innerHTML = `
        <h3><i class="fas fa-user"></i> Thông tin cá nhân</h3>
        <img src="${currentUser.avatar}" alt="Avatar" class="user-avatar">
        
        <div class="user-info-item">
          <span class="user-info-label">
            <i class="fas fa-signature"></i> Họ tên
          </span>
          <span class="user-info-value">${currentUser.name}</span>
        </div>
        
        <div class="user-info-item">
          <span class="user-info-label">
            <i class="fas fa-id-card"></i> ID
          </span>
          <span class="user-info-value">#${String(currentUser.id).padStart(6, '0')}</span>
        </div>
        
        <div class="user-info-item">
          <span class="user-info-label">
            <i class="fas fa-venus-mars"></i> Giới tính
          </span>
          <span class="user-info-value">${currentUser.gender}</span>
        </div>
        
        <div class="user-info-item">
          <span class="user-info-label">
            <i class="fas fa-birthday-cake"></i> Ngày sinh
          </span>
          <span class="user-info-value">${formatDate(currentUser.birthday)} (${calculateAge(currentUser.birthday)} tuổi)</span>
        </div>
        
        <div class="user-info-item">
          <span class="user-info-label">
            <i class="fas fa-star"></i> EXP
          </span>
          <span class="user-info-value">${currentUser.exp}</span>
        </div>
        
        <div class="user-info-item">
          <span class="user-info-label">
            <i class="fas fa-trophy"></i> Danh hiệu
          </span>
          <span class="user-info-value">${currentUser.rank}</span>
        </div>
        
        <div class="user-info-item">
          <span class="user-info-label">
            <i class="fas fa-envelope"></i> Email
          </span>
          <span class="user-info-value" style="font-size: 0.9rem;">${currentUser.email}</span>
        </div>
        
        <div class="mt-4">
          <button class="btn btn-edit" onclick="showEditProfileModal()">
            <i class="fas fa-edit"></i> Chỉnh sửa
          </button>
          <button class="btn btn-logout" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      `;
      
      console.log('✅ [updateUI] Đã cập nhật UI thành công!');
      
    } else {
      console.log('ℹ️ [updateUI] Chưa đăng nhập');
      
      authButton.innerHTML = `
        <a class="nav-link btn-login" href="#" onclick="showLoginModal(); return false;">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập
        </a>
      `;

      userCard.innerHTML = `
        <div class="login-required">
          <i class="fas fa-user-circle"></i>
          <h4>Vui lòng đăng nhập</h4>
          <p>Đăng nhập để xem thông tin cá nhân và sử dụng đầy đủ tính năng của hệ thống</p>
          <button class="btn btn-primary mt-3" onclick="showLoginModal()">
            <i class="fas fa-sign-in-alt" style = "color:white;"></i> Đăng nhập ngay
          </button>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('❌ [updateUI] Lỗi:', error);
  }
}

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEYS = {
  USERS: 'learning_users',
  CURRENT_USER: 'learning_current_user',
  USER_COUNT: 'learning_user_count'
};

// ============================================
// GLOBAL VARIABLES
// ============================================

let currentUser = null;
let allUsers = {};
let userCount = 0;

// ============================================
// LOAD & SAVE DATA
// ============================================

function loadUsers() {
  try {
    console.log('📄 Đang load users từ localStorage...');
    
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
    if (usersData) {
      allUsers = JSON.parse(usersData);
      console.log('✅ Đã load', Object.keys(allUsers).length, 'users');
    } else {
      console.log('ℹ️ Chưa có user nào');
      allUsers = {};
    }

    const countData = localStorage.getItem(STORAGE_KEYS.USER_COUNT);
    userCount = countData ? parseInt(countData) : 0;

    const currentUserEmail = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUserEmail && allUsers[currentUserEmail]) {
      currentUser = allUsers[currentUserEmail];
      console.log('✅ User đang đăng nhập:', currentUser.name);
    } else {
      currentUser = null;
      console.log('ℹ️ Chưa có user đăng nhập');
    }

  } catch (error) {
    console.error('❌ Lỗi load users:', error);
    allUsers = {};
    currentUser = null;
    userCount = 0;
  }
}

function saveUsers() {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    localStorage.setItem(STORAGE_KEYS.USER_COUNT, userCount.toString());
    console.log('✅ Đã lưu users');
    return true;
  } catch (error) {
    console.error('❌ Lỗi lưu users:', error);
    showToast('Lỗi lưu dữ liệu!', 'error');
    return false;
  }
}

// ============================================
// AVATAR PREVIEW
// ============================================

function previewAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Vui lòng chọn file ảnh hợp lệ!', 'error');
    event.target.value = '';
    return;
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast('Ảnh không được vượt quá 2MB!', 'error');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const previewImg = document.getElementById('avatarPreview');
    if (previewImg) {
      previewImg.src = e.target.result;
    }
  };
  reader.onerror = function() {
    showToast('Lỗi khi đọc file ảnh!', 'error');
  };
  reader.readAsDataURL(file);
}

function previewEditAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Vui lòng chọn file ảnh hợp lệ!', 'error');
    event.target.value = '';
    return;
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast('Ảnh không được vượt quá 2MB!', 'error');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const previewImg = document.getElementById('editAvatarPreview');
    if (previewImg) {
      previewImg.src = e.target.result;
    }
  };
  reader.onerror = function() {
    showToast('Lỗi khi đọc file ảnh!', 'error');
  };
  reader.readAsDataURL(file);
}

// ============================================
// MODAL CONTROLS
// ============================================

function showLoginModal() {
  try {
    const registerModalEl = document.getElementById('registerModal');
    const registerModalInstance = bootstrap.Modal.getInstance(registerModalEl);
    if (registerModalInstance) {
      registerModalInstance.hide();
    }

    const loginModalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalEl);
    loginModal.show();
  } catch (error) {
    console.error('❌ Lỗi mở modal đăng nhập:', error);
  }
}

function showRegisterModal() {
  try {
    const loginModalEl = document.getElementById('loginModal');
    const loginModalInstance = bootstrap.Modal.getInstance(loginModalEl);
    if (loginModalInstance) {
      loginModalInstance.hide();
    }

    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview) {
      avatarPreview.src = 'https://via.placeholder.com/150/667eea/ffffff?text=Avatar';
    }

    const registerModalEl = document.getElementById('registerModal');
    const registerModal = new bootstrap.Modal(registerModalEl);
    registerModal.show();
  } catch (error) {
    console.error('❌ Lỗi mở modal đăng ký:', error);
  }
}

function showEditProfileModal() {
  if (!currentUser) {
    showToast('Vui lòng đăng nhập trước!', 'error');
    showLoginModal();
    return;
  }

  try {
    document.getElementById('editName').value = currentUser.name || '';
    document.getElementById('editGender').value = currentUser.gender || 'Nam';
    document.getElementById('editBirthday').value = currentUser.birthday || '';
    
    const editAvatarPreview = document.getElementById('editAvatarPreview');
    if (editAvatarPreview) {
      editAvatarPreview.src = currentUser.avatar || 'https://via.placeholder.com/150/667eea/ffffff?text=Avatar';
    }

    const editModalEl = document.getElementById('editProfileModal');
    const editModal = new bootstrap.Modal(editModalEl);
    editModal.show();
  } catch (error) {
    console.error('❌ Lỗi mở modal chỉnh sửa:', error);
  }
}

// ============================================
// VALIDATION
// ============================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// ============================================
// REGISTER
// ============================================

function handleRegister(event) {
  event.preventDefault();
  console.log('📄 Bắt đầu đăng ký...');

  try {
    const name = document.getElementById('registerName').value.trim();
    const gender = document.getElementById('registerGender').value;
    const birthday = document.getElementById('registerBirthday').value;
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const avatarFile = document.getElementById('avatarInput').files[0];

    if (!name || name.length < 2) {
      showToast('❌ Họ tên phải có ít nhất 2 ký tự!', 'error');
      return;
    }

    if (!gender) {
      showToast('❌ Vui lòng chọn giới tính!', 'error');
      return;
    }

    if (!birthday) {
      showToast('❌ Vui lòng chọn ngày sinh!', 'error');
      return;
    }

    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 5) {
      showToast('❌ Bạn phải từ 5 tuổi trở lên!', 'error');
      return;
    }

    if (age > 100) {
      showToast('❌ Ngày sinh không hợp lệ!', 'error');
      return;
    }

    if (!email || !validateEmail(email)) {
      showToast('❌ Email không hợp lệ!', 'error');
      return;
    }

    loadUsers();
    
    if (allUsers[email]) {
      showToast('❌ Email này đã được đăng ký!', 'error');
      return;
    }

    if (!password || !validatePassword(password)) {
      showToast('❌ Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      showToast('❌ Mật khẩu xác nhận không khớp!', 'error');
      return;
    }

    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        createUser(email, password, name, gender, birthday, e.target.result);
      };
      reader.onerror = function() {
        showToast('❌ Lỗi đọc file ảnh!', 'error');
      };
      reader.readAsDataURL(avatarFile);
    } else {
      const firstLetter = name.charAt(0).toUpperCase();
      const defaultAvatar = `https://via.placeholder.com/150/667eea/ffffff?text=${encodeURIComponent(firstLetter)}`;
      createUser(email, password, name, gender, birthday, defaultAvatar);
    }

  } catch (error) {
    console.error('❌ Lỗi đăng ký:', error);
    showToast('❌ Có lỗi xảy ra!', 'error');
  }
}

function createUser(email, password, name, gender, birthday, avatar) {
  try {
    console.log('📄 Đang tạo user...');

    userCount++;

    const newUser = {
      id: userCount,
      email: email,
      password: password,
      name: name,
      gender: gender,
      birthday: birthday,
      avatar: avatar,
      exp: 0,
      rank: 'Người mới 🌱',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    allUsers[email] = newUser;
    currentUser = newUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);

    if (!saveUsers()) {
      throw new Error('Không thể lưu dữ liệu');
    }

    const registerModalEl = document.getElementById('registerModal');
    const registerModalInstance = bootstrap.Modal.getInstance(registerModalEl);
    if (registerModalInstance) {
      registerModalInstance.hide();
    }

    document.getElementById('registerForm').reset();
    document.getElementById('avatarPreview').src = 'https://via.placeholder.com/150/667eea/ffffff?text=Avatar';

    console.log('✅ Đăng ký thành công!');
    showToast(`🎉 Đăng ký thành công! Chào mừng ${name}!`, 'success');

    // GỌI updateUI NGAY LẬP TỨC
    setTimeout(function() {
      console.log('🔄 Gọi updateUI sau đăng ký...');
      updateUI();
      if (typeof updateAttendanceUI === 'function') {
        updateAttendanceUI();
      }
    }, 100);

  } catch (error) {
    console.error('❌ Lỗi tạo user:', error);
    showToast('❌ Không thể tạo tài khoản!', 'error');
  }
}

// ============================================
// LOGIN
// ============================================

function handleLogin(event) {
  event.preventDefault();
  console.log('📄 Bắt đầu đăng nhập...');

  try {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!email) {
      showToast('❌ Vui lòng nhập email!', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('❌ Email không hợp lệ!', 'error');
      return;
    }

    if (!password) {
      showToast('❌ Vui lòng nhập mật khẩu!', 'error');
      return;
    }

    loadUsers();

    const user = allUsers[email];

    if (!user) {
      showToast('❌ Email chưa được đăng ký!', 'error');
      return;
    }

    if (user.password !== password) {
      showToast('❌ Mật khẩu không đúng!', 'error');
      return;
    }

    currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);

    const loginModalEl = document.getElementById('loginModal');
    const loginModalInstance = bootstrap.Modal.getInstance(loginModalEl);
    if (loginModalInstance) {
      loginModalInstance.hide();
    }

    document.getElementById('loginForm').reset();

    console.log('✅ Đăng nhập thành công!');
    showToast(`👋 Chào mừng trở lại ${user.name}!`, 'success');

    // GỌI updateUI NGAY LẬP TỨC
    setTimeout(function() {
      console.log('🔄 Gọi updateUI sau đăng nhập...');
      updateUI();
      if (typeof updateAttendanceUI === 'function') {
        updateAttendanceUI();
      }
    }, 100);

  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error);
    showToast('❌ Có lỗi xảy ra!', 'error');
  }
}

// ============================================
// UPDATE PROFILE
// ============================================

function handleUpdateProfile(event) {
  event.preventDefault();

  if (!currentUser) {
    showToast('❌ Vui lòng đăng nhập!', 'error');
    showLoginModal();
    return;
  }

  try {
    const name = document.getElementById('editName').value.trim();
    const gender = document.getElementById('editGender').value;
    const birthday = document.getElementById('editBirthday').value;
    const avatarFile = document.getElementById('editAvatarInput').files[0];

    if (!name || name.length < 2) {
      showToast('❌ Họ tên phải có ít nhất 2 ký tự!', 'error');
      return;
    }

    if (!gender || !birthday) {
      showToast('❌ Vui lòng điền đầy đủ!', 'error');
      return;
    }

    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        updateUserData(name, gender, birthday, e.target.result);
      };
      reader.onerror = function() {
        showToast('❌ Lỗi đọc file ảnh!', 'error');
      };
      reader.readAsDataURL(avatarFile);
    } else {
      updateUserData(name, gender, birthday, currentUser.avatar);
    }

  } catch (error) {
    console.error('❌ Lỗi cập nhật:', error);
    showToast('❌ Có lỗi xảy ra!', 'error');
  }
}

function updateUserData(name, gender, birthday, avatar) {
  try {
    currentUser.name = name;
    currentUser.gender = gender;
    currentUser.birthday = birthday;
    currentUser.avatar = avatar;
    currentUser.updatedAt = new Date().toISOString();

    allUsers[currentUser.email] = currentUser;

    if (!saveUsers()) {
      throw new Error('Không thể lưu dữ liệu');
    }

    const editModalEl = document.getElementById('editProfileModal');
    const editModalInstance = bootstrap.Modal.getInstance(editModalEl);
    if (editModalInstance) {
      editModalInstance.hide();
    }

    showToast('✅ Cập nhật thành công!', 'success');

    setTimeout(function() {
      updateUI();
    }, 100);

  } catch (error) {
    console.error('❌ Lỗi cập nhật user:', error);
    showToast('❌ Không thể lưu thông tin!', 'error');
  }
}

// ============================================
// LOGOUT
// ============================================

function logout() {
  if (!confirm('Bạn có chắc muốn đăng xuất không?')) {
    return;
  }

  try {
    const userName = currentUser ? currentUser.name : '';
    
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    showToast(`👋 Tạm biệt ${userName}!`, 'success');

    setTimeout(function() {
      updateUI();
      if (typeof updateAttendanceUI === 'function') {
        updateAttendanceUI();
      }
    }, 100);

  } catch (error) {
    console.error('❌ Lỗi đăng xuất:', error);
  }
}

// ============================================
// RANK SYSTEM
// ============================================

function calculateRank(exp) {
  if (exp >= 1000) return 'Cao thủ 👑';
  if (exp >= 500) return 'Chuyên gia ⭐';
  if (exp >= 200) return 'Thành thạo 🏆';
  if (exp >= 100) return 'Trung cấp 📚';
  if (exp >= 50) return 'Sơ cấp 📖';
  return 'Người mới 🌱';
}

function updateRank() {
  if (!currentUser) return;

  try {
    const oldRank = currentUser.rank;
    const newRank = calculateRank(currentUser.exp);

    if (oldRank !== newRank) {
      currentUser.rank = newRank;
      allUsers[currentUser.email] = currentUser;
      saveUsers();
      
      setTimeout(function() {
        showToast(`🎉 Chúc mừng! Bạn đã lên cấp: ${newRank}`, 'success');
      }, 1000);
    }
  } catch (error) {
    console.error('❌ Lỗi update rank:', error);
  }
}

// ============================================
// UTILITY
// ============================================

function clearAllData() {
  if (!confirm('⚠️ Xóa TẤT CẢ dữ liệu?')) {
    return;
  }

  try {
    localStorage.clear();
    allUsers = {};
    currentUser = null;
    userCount = 0;

    showToast('🗑️ Đã xóa toàn bộ dữ liệu!', 'success');

    setTimeout(function() {
      updateUI();
      if (typeof updateAttendanceUI === 'function') {
        updateAttendanceUI();
      }
    }, 100);

  } catch (error) {
    console.error('❌ Lỗi xóa dữ liệu:', error);
  }
}

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ auth.js đã load thành công (Complete Standalone Version)');