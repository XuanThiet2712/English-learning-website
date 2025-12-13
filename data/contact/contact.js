

'use strict';

let isSubmitting = false;

function updateCharCount() {
  const textarea = document.getElementById('contactMessage');
  const charCountSpan = document.getElementById('charCount');
  const charCountDiv = document.querySelector('.char-count');
  
  if (!textarea || !charCountSpan) return;
  
  const currentLength = textarea.value.length;
  const maxLength = 1000;
  
  charCountSpan.textContent = currentLength;
  

  if (currentLength > maxLength * 0.9) {
    charCountDiv.classList.add('danger');
    charCountDiv.classList.remove('warning');
  } else if (currentLength > maxLength * 0.7) {
    charCountDiv.classList.add('warning');
    charCountDiv.classList.remove('danger');
  } else {
    charCountDiv.classList.remove('warning', 'danger');
  }
  

  if (currentLength > maxLength) {
    textarea.value = textarea.value.substring(0, maxLength);
  }
}

function validateForm(data) {
  // Kiểm tra tên
  if (data.name.trim().length < 2) {
    showNotification('❌ Họ tên phải có ít nhất 2 ký tự!', 'error');
    return false;
  }
  
  // Kiểm tra email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showNotification('❌ Email không hợp lệ!', 'error');
    return false;
  }
  
  // Kiểm tra số điện thoại 
  if (data.phone && data.phone.trim() !== '') {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      showNotification('❌ Số điện thoại không hợp lệ (10-11 số)!', 'error');
      return false;
    }
  }
  
  // Kiểm tra chủ đề
  if (!data.subject) {
    showNotification('❌ Vui lòng chọn chủ đề!', 'error');
    return false;
  }
  
  // Kiểm tra nội dung
  if (data.message.trim().length < 10) {
    showNotification('❌ Nội dung phải có ít nhất 10 ký tự!', 'error');
    return false;
  }
  
  return true;
}


async function handleSubmit(e) {
  e.preventDefault();
  
  if (isSubmitting) {
    showNotification('⏳ Đang gửi, vui lòng đợi...', 'warning');
    return;
  }
  
  // Lấy dữ liệu từ form
  const formData = {
    name: document.getElementById('contactName').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    phone: document.getElementById('contactPhone').value.trim(),
    subject: document.getElementById('contactSubject').value,
    message: document.getElementById('contactMessage').value.trim(),
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  

  if (!validateForm(formData)) return;
  
  // Bắt đầu gửi
  isSubmitting = true;
  const btn = document.getElementById('submitBtn');
  const originalHTML = btn.innerHTML;
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang gửi...';
  
  try {
    // Gửi lên Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([formData]);
    
    if (error) {
      console.error('❌ Lỗi Supabase:', error);
      throw error;
    }
    showNotification('✅ Gửi tin nhắn thành công!', 'success');
    
    // Ẩn form, hiện success message
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('successMessage').classList.add('show');
    
    // Hiệu ứng confetti - nghiên cứu sau 
    
    // Reset form sau 3 giây
    setTimeout(() => {
      document.getElementById('contactForm').reset();
      document.getElementById('contactForm').style.display = 'block';
      document.getElementById('successMessage').classList.remove('show');
      updateCharCount();
    }, 3000);
    
  } catch (error) {
    showNotification('❌ Có lỗi xảy ra! Vui lòng thử lại.', 'error');
  } finally {
    isSubmitting = false;
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}


function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
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

function initContact() {
 
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  

  const textarea = document.getElementById('contactMessage');
  if (textarea) {
    textarea.addEventListener('input', updateCharCount);
    updateCharCount();
  }
  
  //  nếu đã đăng nhập
  if (typeof currentUser !== 'undefined' && currentUser) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    
    if (nameInput && !nameInput.value) {
      nameInput.value = currentUser.name || '';
    }
    if (emailInput && !emailInput.value) {
      emailInput.value = currentUser.email || '';
    }
  }
  
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContact);
} else {
  initContact();
}

console.log('✅ contact.js');