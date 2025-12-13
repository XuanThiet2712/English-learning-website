// AUTH-USERNAME.JS - 

let currentUser = null; // bien thong tin dang nhap

document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Bắt đầu khởi tạo auth...');
  
  // gioi han ngay sinh 5 - 100
  setupBirthdayLimits();
  
 // tai thong tin tu session
  await loadCurrentUser();
  
  setupAvatarPreview();
  
  console.log('✅auth');
});


// gioi han ngay sinh 
function setupBirthdayLimits() {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  
  const birthdayInput = document.getElementById('registerBirthday');
  if (birthdayInput) {
    birthdayInput.max = maxDate.toISOString().split('T')[0];
    birthdayInput.min = minDate.toISOString().split('T')[0];
  }
}


function setupAvatarPreview() {
  const avatarInput = document.getElementById('avatarInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', previewGlobalAvatar);
  }
}


// LOAD USER TỪ SESSIONSTORAGE
async function loadCurrentUser() {

  const savedUsername = sessionStorage.getItem('currentUsername');
 
  if (!savedUsername) {
    console.log('❌ chua ai dang nhap');
    currentUser = null;
    updateAuthUI();
    
    // callback nếu có
    if (typeof onUserLogout === 'function') {
      onUserLogout();
    }
    return;
  }
  
  console.log(' Tìm thấy username:', savedUsername);
  
  try {
   // lay thong tin nguoi dung tu database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', savedUsername)
      .single();
    
    if (error) {
      console.error('Lỗi load user:', error);
      sessionStorage.removeItem('currentUsername');
      currentUser = null;
      updateAuthUI();
      
      if (typeof onUserLogout === 'function') {
        onUserLogout();
      }
      return;
    }
    //load thanh cong
    currentUser = data;
   
    
    // Bước 6: Cập nhật giao diện
    updateAuthUI();
    
    // callback nếu có
    if (typeof onUserLoginSuccess === 'function') {
      await onUserLoginSuccess();
    }
    
  } catch (err) {
    sessionStorage.removeItem('currentUsername');
    currentUser = null;
    updateAuthUI();
    
    if (typeof onUserLogout === 'function') {
      onUserLogout();
    }
  }
}


// cap nhat navbar

function updateAuthUI() {
  const authButton = document.getElementById('authButton');
  if (!authButton) return;
  
  if (currentUser) {
  // sua lai phan nay giup em
    authButton.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-light dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
          ${currentUser.avatar ? 
            `<img src="${currentUser.avatar}" 
                  style="width:32px; height:32px; border-radius:50%; object-fit:cover; margin-right:8px;"
                  onerror="this.src='https://ocjodjbqghyxhhmmvron.supabase.co/storage/v1/object/public/avatars/967e6186-0433-47db-a803-0af93cff03d8/1%20(2).png'">` 
            : '<i class="fas fa-user-circle me-2"></i>'}
          <span>${currentUser.name}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
         
          <li><hr class="dropdown-divider"></li>
          <li>
            <button class="dropdown-item text-danger" onclick="globalLogout()">
              <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    `;
  } else {
   
    authButton.innerHTML = `
      <button class="btn btn-login" onclick="showGlobalLoginModal()">
        <i class="fas fa-sign-in-alt me-2"></i> Đăng nhập
      </button>
    `;
  }
}

//modal dang nhap

function showGlobalLoginModal() {
  // dong modal dang ki neu dang mo 
  const registerModalEl = document.getElementById('registerModal');
  if (registerModalEl) {
    const inst = bootstrap.Modal.getInstance(registerModalEl);
    if (inst) inst.hide();
  }
  
  // mo modal dang nhap
  const loginModalEl = document.getElementById('loginModal');
  if (loginModalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
    modal.show();
  }
}


function showGlobalRegisterModal() {
  
  const loginModalEl = document.getElementById('loginModal');
  if (loginModalEl) {
    const inst = bootstrap.Modal.getInstance(loginModalEl);
    if (inst) inst.hide();
  }
  
  const avatarPreview = document.getElementById('avatarPreview');
  if (avatarPreview) {
    avatarPreview.src = 'https://ocjodjbqghyxhhmmvron.supabase.co/storage/v1/object/public/avatars/967e6186-0433-47db-a803-0af93cff03d8/1%20(2).png';
  }
  
  
  const registerModalEl = document.getElementById('registerModal');
  if (registerModalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(registerModalEl);
    modal.show();
  }
}

// xu ly dang nhap

async function handleGlobalLogin(event) {
  event.preventDefault();
  
  const form = event.target;
  const username = form.loginUsername.value.trim().toLowerCase();
  const password = form.loginPassword.value;
  
  // Kiểm tra input
  if (!username || !password) {
    return showNotification('Vui lòng nhập đầy đủ Username và Mật khẩu', 'error');
  }
  
  // xoas nút submit
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang đăng nhập...';
  
  try {
    // tim nguoi dung
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      return showNotification('Username hoặc mật khẩu không đúng', 'error');
    }
    
    currentUser = data;
 // lu du lieu vao session
    sessionStorage.setItem('currentUsername', username);
    
    console.log('✅ Đăng nhập thành công :', currentUser.name);
    
    // Đóng modal
    const loginModalEl = document.getElementById('loginModal');
    if (loginModalEl) {
      const modalInstance = bootstrap.Modal.getInstance(loginModalEl);
      if (modalInstance) modalInstance.hide();
    }
    
    // Reset form
    form.reset();
    
    // Thông báo
    showNotification(`🎉 Chào mừng ${currentUser.name}!`, 'success');
    
    // Cập nhật giao diện
    updateAuthUI();
    
    // callback nếu có
    if (typeof onUserLoginSuccess === 'function') {
      await onUserLoginSuccess();
    }
    
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err);
    showNotification('Lỗi hệ thống khi đăng nhập', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

//XỬ LÝ ĐĂNG KÝ

async function handleGlobalRegister(event) {
  event.preventDefault();
  
  const form = event.target;
  
  //lay du lieu tu form
  const username = document.getElementById('registerUsername').value.trim().toLowerCase();
  const name = document.getElementById('registerName').value.trim();
  const gender = document.getElementById('registerGender').value;
  const birthday = document.getElementById('registerBirthday').value;
  const password = document.getElementById('registerPassword').value;
  const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
  const avatarFile = document.getElementById('avatarInput').files[0];
  
  // kiem tra user name 
  if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
    return showNotification('Username không hợp lệ (chữ/số/_; 3-50 ký tự)', 'error');
  }
  
  // kiem tra ho ten , sua lai may cai chu giup tao 
  if (!name || name.length < 2) {
    return showNotification('Họ tên quá ngắn', 'error');
  }
  
  // check gioi tinh
  if (!gender) {
    return showNotification('Vui lòng chọn giới tính', 'error');
  }
  
  // check ngay sinh
  if (!birthday) {
    return showNotification('Vui lòng nhập ngày sinh', 'error');
  }
  
  // Kiểm tra mật khẩu
  if (!password || password.length < 6) {
    return showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
  }
  
  // Kiểm tra mật khẩu khớp
  if (password !== passwordConfirm) {
    return showNotification('Mật khẩu không khớp', 'error');
  }
  
  // go nut submit
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang đăng ký...';
  
  try {
   
    const { data: existed, error: checkErr } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .limit(1);
    
    if (checkErr) throw checkErr;
    
    if (existed && existed.length > 0) {
      throw new Error('USERNAME_DUPLICATE');
    }
    
    let avatarUrl = 'https://ocjodjbqghyxhhmmvron.supabase.co/storage/v1/object/public/avatars/967e6186-0433-47db-a803-0af93cff03d8/1%20(2).png';
    
    if (avatarFile) {
      // kiểm tra file
      if (!avatarFile.type.startsWith('image/')) {
        throw new Error('FILE_NOT_IMAGE');
      }
      if (avatarFile.size > 2 * 1024 * 1024) {
        throw new Error('FILE_TOO_BIG');
      }
      
      // Upload
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${username}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: upErr } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, avatarFile, { cacheControl: '3600', upsert: true });
      
      if (upErr) throw upErr;
      
      const { data: urlData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);
      
      avatarUrl = urlData.publicUrl;
    }
    
    // tạo user mới
    const newUser = {
      username,
      password,
      name,
      email: `${username}@sevenday.local`,
      gender,
      birthday,
      avatar: avatarUrl,
      exp: 0,
      rank: 'Người mới 🌱'
    };
    
    const { data: created, error: insErr } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (insErr || !created) throw insErr || new Error('INSERT FAIL');
    
    currentUser = created;
  
    sessionStorage.setItem('currentUsername', username);
    
    console.log(' Đăng ký thành công:', currentUser.name);
    
    // Đóng modal
    const registerModalEl = document.getElementById('registerModal');
    if (registerModalEl) {
      const modalInstance = bootstrap.Modal.getInstance(registerModalEl);
      if (modalInstance) modalInstance.hide();
    }
    
    // reset form và avatar
    form.reset();
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview) {
      avatarPreview.src = 'https://ocjodjbqghyxhhmmvron.supabase.co/storage/v1/object/public/avatars/967e6186-0433-47db-a803-0af93cff03d8/1%20(2).png';
    }
    
    // Thông báo
    showNotification(`🎉 Đăng ký thành công! Xin chào ${currentUser.name}`, 'success');
    
    // Cập nhật giao diện
    updateAuthUI();
    
    // Gọi callback nếu có
    if (typeof onUserLoginSuccess === 'function') {
      await onUserLoginSuccess();
    }
    
  } catch (err) {
    console.error(' Lỗi đăng ký ', err);
    
    if (String(err.message) === 'USERNAME_DUPLICATE') {
      showNotification('Username này đã được sử dụng!', 'error');
    } else if (String(err.message) === 'FILE_NOT_IMAGE') {
      showNotification('File phải là ảnh', 'error');
    } else if (String(err.message) === 'FILE_TOO_BIG') {
      showNotification('Ảnh không được lớn hơn 2MB', 'error');
    } else {
      showNotification('Có lỗi xảy ra, vui lòng thử lại', 'error');
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ĐĂNG XUẤT
function globalLogout() {
  if (!confirm('Bạn có chắc muốn đăng xuất không?')) return;
  
  const name = currentUser?.name || 'Bạn';
  
  // Xóa session
  currentUser = null;
  sessionStorage.removeItem('currentUsername');
  

  showNotification(`👋 Tạm biệt ${name}!`, 'info');
  updateAuthUI();
  if (typeof onUserLogout === 'function') {
    onUserLogout();
  }
}

function previewGlobalAvatar(event) {
  const file = event.target.files[0];
  const avatarPreview = document.getElementById('avatarPreview');
  
  if (!file) {
    if (avatarPreview) {
      avatarPreview.src = 'https://ocjodjbqghyxhhmmvron.supabase.co/storage/v1/object/public/avatars/967e6186-0433-47db-a803-0af93cff03d8/1%20(2).png';
    }
    return;
  }
  
  // Kiểm tra file
  if (!file.type.startsWith('image/')) {
    showNotification('File phải là ảnh', 'error');
    event.target.value = '';
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    showNotification('Ảnh không được lớn hơn 2MB', 'error');
    event.target.value = '';
    return;
  }
  
  
  const reader = new FileReader();
  reader.onload = (e) => {
    if (avatarPreview) {
      avatarPreview.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

// THÔNG BÁO Manf Hinhf

function showNotification(message, type = 'success') {
  const colors = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-info',
    warning: 'bg-warning'
  };
  
  const selectedColor = colors[type] || colors.info;
  
  const toastHTML = `
    <div class="toast align-items-center text-white ${selectedColor} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.cssText = 'z-index:9999;margin-top:70px;';
    document.body.appendChild(container);
  }
  
  container.insertAdjacentHTML('beforeend', toastHTML);
  const toastElement = container.lastElementChild;
  
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();

  setTimeout(() => {
    toastElement?.remove();
  }, 4000);
}

console.log('✅ auth-username.js ');