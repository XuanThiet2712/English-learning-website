// INDEX-PAGE.JS 
// tinh thanh tich tong
async function updateTotalStats() {
  console.log('Đang cập nhật thành tích tổng...');
  if (!currentUser) {
    document.getElementById('totalVocab').textContent = '0';
    document.getElementById('totalExercise').textContent = '0';
    document.getElementById('totalExp').textContent = '0';
    document.getElementById('userRank').textContent = '0';
    return;
  }
  
  try {
    //dem tu vung
    const { data: vocabData, error: vocabError } = await supabase
      .from('vocabulary_progress')
      .select('id')
      .eq('user_email', currentUser.email)
      .neq('status', 'not-learned'); 
    
  
    
    const totalVocab = vocabData ? vocabData.length : 0;
    document.getElementById('totalVocab').textContent = totalVocab;

    
    
    // dem bai tap 

    const { data: exerciseData, error: exerciseError } = await supabase
      .from('exercise_results')
      .select('id')
      .eq('user_email', currentUser.email);
    
  
    
    const totalExercise = exerciseData ? exerciseData.length : 0;
    document.getElementById('totalExercise').textContent = totalExercise;
    
  //lay exp

    const totalExp = currentUser.exp || 0;
    document.getElementById('totalExp').textContent = totalExp;
    
    
    //xep hang rank
    const { data: allUsers, error: rankError } = await supabase
      .from('users')
      .select('email, exp')
      .order('exp', { ascending: false });
    
    if (rankError) {
      console.error('❌ loi ddữ liệu xếp hạng:', rankError);
      document.getElementById('userRank').textContent = '0';
      return;
    }
    
    let userRank = 0;
    if (allUsers && allUsers.length > 0) {
      const index = allUsers.findIndex(u => u.email === currentUser.email);
      if (index !== -1) {
        userRank = index + 1;
      }
    }

    
    document.getElementById('userRank').textContent = userRank;
    console.log('xep hang', userRank);
    
    console.log(`xe[ hang ] ${totalVocab} tu, ${totalExercise} bai, ${totalExp} EXP, #${userRank}`);
    
  } catch (error) {
    console.error('❌ loi ', error);
    document.getElementById('totalVocab').textContent = '0';
    document.getElementById('totalExercise').textContent = '0';
    document.getElementById('totalExp').textContent = currentUser.exp || '0';
    document.getElementById('userRank').textContent = '0';
  }
}


//CẬP NHẬT USER CARD BÊNẢI
async function updateUserCard() {
  console.log('Đang User Card...');
  
  const userCard = document.getElementById('userCard');
  if (!userCard) return;
  

  if (!currentUser) {
    userCard.innerHTML = `
      <div class="login-required">
        <i class="fas fa-user-circle"></i>
        <h4>Vui lòng đăng nhập</h4>
        <p>Đăng nhập để xem thông tin cá nhân và sử dụng đầy đủ tính năng</p>
        <button class="btn btn-primary btn-lg" onclick="showGlobalLoginModal()">
          <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập ngay
        </button>
      </div>
    `;
    return;
  }
  
  
  try {
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', currentUser.email)
      .single();
    
    if (error) {
      console.error('❌ Lỗi lấy thông tin user:', error);
      return;
    }
    
   //cap nhat nguoi dung voi du lieu moi
    currentUser = userData;
    
    // tinh tuoi
    let ageText = '';
    if (userData.birthday) {
      const birthDate = new Date(userData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      ageText = ` (${age} tuổi)`;
    }
    
    // dem tu vung da hoc
    const { data: vocabData } = await supabase
      .from('vocabulary_progress')
      .select('id')
      .eq('user_email', currentUser.email)
      .neq('status', 'not-learned');
    
    const learnedWords = vocabData ? vocabData.length : 0;
    
    const totalWords = 21; 
    const percent = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
    
    userCard.innerHTML = `
      <img src="${userData.avatar}" alt="Avatar" class="user-avatar">
      <h4 class="user-name">${userData.name}</h4>
      
      <div class="user-details">
        <div class="user-item">
          <span class="user-label">
            <i class="fas fa-user"></i>
            Username
          </span>
          <span class="user-value">${userData.username}</span>
        </div>
        
        
        <div class="user-item">
          <span class="user-label">
            <i class="fas fa-venus-mars"></i>
            Giới tính
          </span>
          <span class="user-value">${userData.gender}${ageText}</span>
        </div>
        
        <div class="user-item">
          <span class="user-label">
            <i class="fas fa-star"></i>
            EXP
          </span>
          <span class="user-value">${userData.exp || 0}</span>
        </div>
        
        <div class="user-item">
          <span class="user-label">
            <i class="fas fa-trophy"></i>
            Rank
          </span>
          <span class="user-value">${userData.rank || 'Người mới 🌱'}</span>
        </div>
      </div>
      
      <div class="user-buttons">
        <button class="btn-edit" onclick="showEditProfile()">
          <i class="fas fa-user-edit"></i>
          Chỉnh sửa
        </button>
        <button class="btn-logout" onclick="globalLogout()">
          <i class="fas fa-sign-out-alt"></i>
          Đăng xuất
        </button>
      </div>
    `;
  
  } catch (error) {
  }
}

//modal chinh thong tin

function showEditProfile() {
  if (!currentUser) return;
  
 
  document.getElementById('editName').value = currentUser.name || '';
  document.getElementById('editGender').value = currentUser.gender || '';
  document.getElementById('editBirthday').value = currentUser.birthday || '';
  document.getElementById('editAvatarPreview').src = currentUser.avatar || '';
  const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
  modal.show();
}

// cap nhat profile 

async function handleUpdateProfile(event) {
  event.preventDefault();
  
  if (!currentUser) return;
  
  const form = event.target;
  const name = document.getElementById('editName').value.trim();
  const gender = document.getElementById('editGender').value;
  const birthday = document.getElementById('editBirthday').value;
  const avatarFile = document.getElementById('editAvatarInput').files[0];
  
  
  if (!name || !gender || !birthday) {
    showNotification('Vui lòng điền đầy đủ thông tin!', 'warning');
    return;
  }
  
  
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang lưu...';
  
  try {
    let avatarUrl = currentUser.avatar;
    
    // upload avatar 
    if (avatarFile) {
      avatarUrl = await uploadAvatar(avatarFile, currentUser.email);
    }
    
    // cap nhat len supabase
    const { error } = await supabase
      .from('users')
      .update({
        name: name,
        gender: gender,
        birthday: birthday,
        avatar: avatarUrl
      })
      .eq('email', currentUser.email);
    
    if (error) throw error;
    
    // Cập nhật currentUser
    currentUser.name = name;
    currentUser.gender = gender;
    currentUser.birthday = birthday;
    currentUser.avatar = avatarUrl;
    
    // đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    if (modal) modal.hide();
    showNotification('✅ Cập nhật thông tin thành công!', 'success');
    updateUserCard();
    updateAuthUI();
    
  } catch (error) {
    console.error(' Loi cap nhat profilee:', error);
    showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save me-2"></i>Lưu thay đổi';
  }
}



function previewEditAvatar(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('editAvatarPreview');
  
  if (!file) return;
  
  // Kiểm tra file
  if (!file.type.startsWith('image/')) {
    showNotification('File phải là ảnh !', 'error');
    event.target.value = '';
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    showNotification('Ảnh không được lớn hơn 2MB!', 'error');
    event.target.value = '';
    return;
  }
  
  // dọc file và hiển thị preview
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// khoi tao khi trang load 

document.addEventListener('DOMContentLoaded', function() {
  
  const checkUser = setInterval(() => {
    if (typeof currentUser !== 'undefined') {
      clearInterval(checkUser);
      updateTotalStats();
      updateUserCard();
      
      console.log('✅ trang index  sẵn sàng');
    }
  }, 100);
  
  // timeout sau 5 giây
  setTimeout(() => {
    clearInterval(checkUser);
  
    updateTotalStats();
    updateUserCard();
  }, 5000);
});


// CALLBACK 
//dang nhap
window.onUserLoginSuccess = function() {
  setTimeout(() => {
    updateTotalStats();
    updateUserCard();
  }, 500);
};

//  đăng xuất
window.onUserLogout = function() {
// reset thanh tich ve khong
  document.getElementById('totalVocab').textContent = '0';
  document.getElementById('totalExercise').textContent = '0';
  document.getElementById('totalExp').textContent = '0';
  document.getElementById('userRank').textContent = '0';
  // reset ussercard
  updateUserCard();
};

console.log('✅ index-page.js');