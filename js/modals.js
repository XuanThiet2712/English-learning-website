
// TẠO CÁI MODALS ĐĂNG NHẬP ĐĂNG KÍ 

function createGlobalModals() {                 
  const container = document.getElementById('globalModals'); 
  if (!container) return;                        

  // Tạo HTML cho modals bằng innerHTML          
  container.innerHTML = `                        
   <!-- MODAL ĐĂNG NHẬP -->
    <div class="modal fade" id="loginModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          
          <!-- Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          
          <!-- Body -->
          <div class="modal-body p-4">
            <form id="loginForm" onsubmit="handleGlobalLogin(event)">
              
              <!-- Username -->
              <div class="mb-3">
                <label for="loginUsername" class="form-label">
                  <i class="fas fa-user me-2"></i>Username
                </label>
                <input type="text" class="form-control" id="loginUsername" 
                       placeholder="Nhập username" required>
              </div>
              
              <!-- Password -->
              <div class="mb-3">
                <label for="loginPassword" class="form-label">
                  <i class="fas fa-lock me-2"></i>Mật khẩu
                </label>
                <input type="password" class="form-control" id="loginPassword" 
                       placeholder="Nhập mật khẩu" required>
              </div>
              
              <!-- Button -->
              <button type="submit" class="btn btn-primary w-100 mt-3">
                <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
              </button>
            </form>
            
            <!-- Đăngg kí-->
            <div class="text-center mt-4">
              <p class="mb-0">Chưa có tài khoản? 
                <a href="#" onclick="showGlobalRegisterModal(); return false;" 
                   class="text-primary fw-bold text-decoration-none">Đăng ký ngay</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ĐĂNG KÝ -->
    <div class="modal fade" id="registerModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          
          <!-- Header -->
          <div class="modal-header">
            <h5 class="modal-title ">
              <i class="fas fa-user-plus me-2"></i>Đăng ký
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          
          <!-- Body -->
          <div class="modal-body p-4">
            <form id="registerForm" onsubmit="handleGlobalRegister(event)">
              
              <!-- Avatar preview -->
              <div class="mb-4 text-center">
                <img id="avatarPreview" 
                     style="width: 150px; height: 150px; border-radius: 50%; border: 5px solid #6366f1; object-fit: cover;" 
                     src="https://ocjodjbqghyxhhmmvron.supabase.co/storage/v1/object/public/avatars/967e6186-0433-47db-a803-0af93cff03d8/1%20(2).png" 
                     alt="avatar">
                <input type="file" class="form-control mt-3" id="avatarInput" 
                       accept="image/*" onchange="previewGlobalAvatar(event)">
              </div>
              
              <!-- Username -->
              <div class="mb-3">
                <label for="registerUsername" class="form-label">
                  <i class="fas fa-user me-2"></i>Username *
                </label>
                <input type="text" class="form-control" id="registerUsername" 
                       placeholder="vd: anhthietdeptrai" required 
                       pattern="[a-zA-Z0-9_]{3,50}">
                <div id="usernameFeedback"></div>
                <small class="text-muted">3-50 ký tự, chỉ chữ, số và dấu _</small>
              </div>
              
              <!-- Họ tên  -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="registerName" class="form-label">Họ tên *</label>
                  <input type="text" class="form-control" id="registerName" 
                         placeholder="Nguyễn Xuân Thiết" required>
                </div>
                <!-- gioi tinh -->
                <div class="col-md-6 mb-3">
                  <label for="registerGender" class="form-label">Giới tính </label>
                  <select class="form-select" id="registerGender" >
                    <option value="">Chọn</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              
              <!-- ngay sinh -->
              <div class="mb-3">
                <label for="registerBirthday" class="form-label">Ngày sinh </label>
                <input type="date" class="form-control" id="registerBirthday" >
              </div>
              
              <!-- Pass -->
              <div class="mb-3">
                <label for="registerPassword" class="form-label">Mật khẩu *</label>
                <input type="password" class="form-control" id="registerPassword" 
                       placeholder="Tối thiểu 6 ký tự" required minlength="6">
              </div>
              
              <!-- Xác nhận lại pass -->
              <div class="mb-3">
                <label for="registerPasswordConfirm" class="form-label">
                  Xác nhận mật khẩu *
                </label>
                <input type="password" class="form-control" id="registerPasswordConfirm" 
                       placeholder="Nhập lại mật khẩu" required>
              </div>
              
              <!-- Button -->
              <button type="submit" class="btn btn-primary w-100 mt-3">
                <i class="fas fa-user-plus me-2"></i>Đăng ký
              </button>
            </form>
            
            <!-- Link đăng nhập -->
            <div class="text-center mt-4">
              <p class="mb-0">Đã có tài khoản? 
                <a href="#" onclick="showGlobalLoginModal(); return false;" 
                   class="text-primary fw-bold">Đăng nhập</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;                                              
}

// de cho file van chay neu chua load xong                   
if (document.readyState === 'loading') {         
  document.addEventListener('DOMContentLoaded', createGlobalModals); 
}
else {                                          
  createGlobalModals();                        
}

console.log(' modals.js  da load');              
