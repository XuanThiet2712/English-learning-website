// FORUM.JS 
'use strict';

let allPosts = [];
let allMessages = [];
let currentFilter = 'all';
let currentRanking = 'exp';
let chatSubscription = null;

document.addEventListener('DOMContentLoaded', async function() {
  
  // Đợi auth load - kiểm tra mỗi 100ms
  await waitForAuth();
  
  // Load tất cả dữ liệu
  await loadAllData();
  
  // Setup realtime chat
  setupChatRealtime();
  
  // Setup đếm ký tự khi gõ 
  setupContentCounter();
  
  // Hiển thị "0 online" cố định ( bỏ )
  updateOnlineBadge();
  
  console.log('✅ Forum đã sẵn sàng');
});

async function waitForAuth() {
  return new Promise((resolve) => {
    let attempts = 0;
    const checkAuth = setInterval(() => {
      if (typeof currentUser !== 'undefined' || attempts > 50) {
        clearInterval(checkAuth);
        resolve();
      }
      attempts++;
    }, 100);
  });
}

// LOAD TẤT CẢ DỮ LIỆU

async function loadAllData() {
  await Promise.all([
    loadPosts(),
    loadRanking(),
    loadChatMessages()
  ]);
}
// 1. LOAD BÀI VIẾT TỪ DATABASE
async function loadPosts() {
  try {
    // lâsy tất cả posts, sắp xếp mới nhất trước
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    allPosts = data || [];
    
    // tạm ngưng làm phần này , lỏ quá
    if (currentUser) {
      for (let post of allPosts) {
        const { data: likeData } = await supabase
          .from('forum_likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_email', currentUser.email)
          .maybeSingle(); 
        post.userLiked = !!likeData;
      }
    }
    renderPosts();
    
  } catch (error) {
    showErrorMessage('Không thể tải bài viết. Vui lòng thử lại!');
  }
}



function renderPosts() {
  const container = document.getElementById('postsList');
  const emptyState = document.getElementById('emptyState');
  
  if (!container || !emptyState) return;
  
  let filteredPosts = allPosts;
  
  if (currentFilter !== 'all') {
    filteredPosts = allPosts.filter(p => p.category === currentFilter);
  }
  
  if (filteredPosts.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  

  container.style.display = 'flex';
  emptyState.style.display = 'none';
  
  // Tạo HTML cho từng post và nối lại
  let html = '';
  for (let post of filteredPosts) {
    html += createPostHTML(post);
  }
  
  container.innerHTML = html;
}

// 3. TẠO HTML CHO MỘT BÀI VIẾT

function createPostHTML(post) {
  const categoryNames = {
    vocabulary: 'Từ vựng',
    grammar: 'Ngữ pháp',
    tips: 'Chia sẻ'
  };
  
  // Format thời gian
  const timeAgo = formatTimeAgo(post.created_at);
  const likedClass = post.userLiked ? 'liked' : '';

  const title = escapeHtml(post.title);
  const content = escapeHtml(post.content);
  const userName = escapeHtml(post.user_name);
  
  return `
    <div class="post-item">
      <div class="post-header">
        <img src="${post.user_avatar}" alt="Avatar" class="post-avatar">
        <div class="post-author-info">
          <h4 class="post-author-name">${userName}</h4>
          <div class="post-meta">
            <span><i class="far fa-clock me-1"></i>${timeAgo}</span>
            <span class="post-category-tag">
              <i class="fas fa-tag"></i>
              ${categoryNames[post.category] || post.category}
            </span>
          </div>
        </div>
      </div>
      
      <h3 class="post-title">${title}</h3>
      <p class="post-content">${content}</p>
      
      <div class="post-actions">
        <button class="post-action-btn ${likedClass}" onclick="toggleLike(${post.id})">
          <i class="fas fa-heart"></i>
          <span>${post.likes || 0}</span>
        </button>
        <button class="post-action-btn">
          <i class="fas fa-comment"></i>
          <span>${post.comments_count || 0}</span>
        </button>
      </div>
    </div>
  `;
}

//tẠO BÀI VIẾT MỚI

async function createPost(event) {
  event.preventDefault();
  // Kiểm tra đăng nhập
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để đăng bài!', 'warning');
    showGlobalLoginModal();
    return;
  }
  
  // Lấy dữ liệu từ form
  const title = document.getElementById('postTitle').value.trim();
  const category = document.getElementById('postCategory').value;
  const content = document.getElementById('postContent').value.trim();
  
  if (!title || !category || !content) {
    showNotification('Vui lòng điền đầy đủ thông tin!', 'warning');
    return;
  }
  
  if (content.length > 1000) {
    showNotification('Nội dung không được quá 1000 ký tự!', 'warning');
    return;
  }
  
  try {
    // Insert vào database
    const { error } = await supabase
      .from('forum_posts')
      .insert([{
        user_email: currentUser.email,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar,
        title: title,
        category: category,
        content: content,
        likes: 0,
        comments_count: 0
      }]);
    
    if (error) throw error;
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
    if (modal) modal.hide();
    
    // Reset form
    document.getElementById('newPostForm').reset();
    document.getElementById('contentCounter').textContent = '0';
    
    // Reload posts
    await loadPosts();
    
    showNotification('✅ Đã đăng bài viết thành công!', 'success');
    
  } catch (error) {
    console.error('❌ Lỗi tạo bài:', error);
    showNotification('Không thể đăng bài!', 'error');
  }
}

//LIKE/UNLIKE BÀI VIẾT , tạm thời bỏ phần này nha ae
async function toggleLike(postId) {
  // Kiểm tra đăng nhập
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để thích bài viết!', 'warning');
    showGlobalLoginModal();
    return;
  }
  
  try {
    // Tìm post trong mảng
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Kiểm tra đã like chưa 
    const { data: existingLike } = await supabase
      .from('forum_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_email', currentUser.email)
      .maybeSingle();
    
    if (existingLike) {
      // Đã like rồi -> Unlike
      await supabase
        .from('forum_likes')
        .delete()
        .eq('id', existingLike.id);
      
      // Giảm số likes
      const newLikes = Math.max(0, (post.likes || 0) - 1);
      await supabase
        .from('forum_posts')
        .update({ likes: newLikes })
        .eq('id', postId);
      
    } else {
      // Chưa like -> Like
      await supabase
        .from('forum_likes')
        .insert([{
          post_id: postId,
          user_email: currentUser.email
        }]);
      
      // Tăng số likes
      const newLikes = (post.likes || 0) + 1;
      await supabase
        .from('forum_posts')
        .update({ likes: newLikes })
        .eq('id', postId);
    }
    
    // Reload posts
    await loadPosts();
    
  } catch (error) {
    console.error('❌ Lỗi toggle like:', error);
    showNotification('Có lỗi xảy ra!', 'error');
  }
}

function filterPosts(category, element) {
  currentFilter = category;
  
  const allChips = document.querySelectorAll('.filter-chip');
  for (let chip of allChips) {
    chip.classList.remove('active');
  }
  
  element.classList.add('active');
  
  renderPosts();
}

// 7. TÌM KIẾM BÀI VIẾT

function searchPosts() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  const container = document.getElementById('postsList');
  
  if (!searchTerm) {
    renderPosts();
    return;
  }
  
  const filtered = allPosts.filter(post => {
    return post.title.toLowerCase().includes(searchTerm) ||
           post.content.toLowerCase().includes(searchTerm) ||
           post.user_name.toLowerCase().includes(searchTerm);
  });
  

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h4>Không tìm thấy kết quả</h4>
        <p>Thử tìm kiếm với từ khóa khác</p>
      </div>
    `;
    return;
  }
  
  // Hiển thị kết quả tìm kiếm
  let html = '';
  for (let post of filtered) {
    html += createPostHTML(post);
  }
  container.innerHTML = html;
}


// LOAD BẢNG XẾP HẠNG

async function loadRanking() {
  try {
    let rankingData = [];
    
    if (currentRanking === 'exp') {
      // XẾP HẠNG THEO EXP - Lấy từ bảng users
      const { data, error } = await supabase
        .from('users')
        .select('email, name, avatar, exp')
        .order('exp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      rankingData = (data || []).map(user => ({
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        statValue: user.exp || 0,
        statType: 'exp'
      }));
      
    } else {
      // XẾP HẠNG THEO STREAK - Lấy từ bảng attendance_history
      const { data, error } = await supabase
        .from('attendance')
        .select('user_email, streak')
        .order('streak', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Lấy thông tin user cho mỗi email
      const userPromises = (data || []).map(async (item) => {
        const { data: userData } = await supabase
          .from('users')
          .select('email, name, avatar')
          .eq('email', item.user_email)
          .maybeSingle(); 
        
        if (userData) {
          return {
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            statValue: item.streak || 0,
            statType: 'streak'
          };
        }
        return null;
      });
      
      const results = await Promise.all(userPromises);
      rankingData = results.filter(item => item !== null);
    }
    
    renderRanking(rankingData);
    
  } catch (error) {
    console.error('❌ Lỗi load rank', error);
  }
}


// RENDER BẢNG XẾP HẠNG

function renderRanking(users) {
  const container = document.getElementById('rankingList');
  if (!container) return;
  
  if (users.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">Chưa có dữ liệu</p>';
    return;
  }
  
  let html = '';
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const position = i + 1;

    const isCurrentUser = currentUser && user.email === currentUser.email;
    

    const positionClass = position <= 3 ? `top-${position}` : '';
    

    const itemClass = isCurrentUser ? 'ranking-item current-user' : 'ranking-item';
    

    const statValue = user.statType === 'exp' 
      ? `${user.statValue} EXP`
      : `${user.statValue} ngày`;
    
    const userName = escapeHtml(user.name);
    
    html += `
      <div class="${itemClass}">
        <div class="ranking-position ${positionClass}">
          ${position <= 3 ? '<i class="fas fa-trophy"></i>' : position}
        </div>
        <img src="${user.avatar}" alt="Avatar" class="ranking-avatar">
        <div class="ranking-info">
          <p class="ranking-name">${userName}${isCurrentUser ? ' 🎯' : ''}</p>
          <p class="ranking-stat">${statValue}</p>
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html;
}


// CHUYỂN LOẠI BẢNG XẾP HẠNG

function switchRanking(type, element) {

  currentRanking = type;
  

  const allTabs = document.querySelectorAll('.ranking-tab');
  for (let tab of allTabs) {
    tab.classList.remove('active');
  }
  
  element.classList.add('active');
  
  loadRanking();
}


// LOAD TIN NHẮN CHAT

async function loadChatMessages() {
  try {
    // Lấy 50 tin nhắn mới nhất
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    // đảo ngược để cái tin nhắn cũ ở trên 
    allMessages = (data || []).reverse();
    
    // Render ra giao diện
    renderChatMessages();
    
    // Scroll xuống dưới cùng
    scrollChatToBottom();
    
  } catch (error) {
    console.error('❌ Lỗi load chat  ', error);
  }
}


function renderChatMessages() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  if (allMessages.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">Chưa có tin nhắn nào. Hãy là người đầu tiên!</p>';
    return;
  }
  
  let html = '';
  for (let msg of allMessages) {
    html += createMessageHTML(msg);
  }
  
  container.innerHTML = html;
}

function createMessageHTML(msg) {
  // Kiểm tra tin nhắn của người dunfg 
  const isOwn = currentUser && msg.user_email === currentUser.email;
  const messageClass = isOwn ? 'chat-message own' : 'chat-message';
  
  // Format thời gian
  const timeAgo = formatTimeAgo(msg.created_at);
  const userName = escapeHtml(msg.user_name);
  const message = escapeHtml(msg.message);
  
  return `
    <div class="${messageClass}">
      <img src="${msg.user_avatar}" alt="Avatar" class="chat-message-avatar">
      <div class="chat-message-content">
        <div class="chat-message-header">
          <span class="chat-message-author">${userName}</span>
          <span class="chat-message-time">${timeAgo}</span>
        </div>
        <div class="chat-message-text">${message}</div>
      </div>
    </div>
  `;
}

// GỬI TIN NHẮN 
async function sendMessage() {
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để chat!', 'warning');
    showGlobalLoginModal();
    return;
  }
  
  const input = document.getElementById('chatInput');
  if (!input) return;
  
  const message = input.value.trim();
  
  if (!message) return;
  
  if (message.length > 500) {
    showNotification('Tin nhắn không được quá 500 ký tự!', 'warning');
    return;
  }
  
  try {
    console.log('dang gui tin nhan ....', {
      user: currentUser.email,
      message: message
    });
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        user_email: currentUser.email,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar,
        message: message
      }])
      .select(); 
    
    if (error) {
      console.error('❌ Lỗi chi tiết :(( ', error);
      throw error;
    }
    
    console.log('✅ Gửi tin nhắn thành công nè jej ', data);
    
    input.value = '';
    
    
  } catch (error) {
    console.error('❌ Lỗi gửi tin nhắn  - > ', error);
    
   // thông báo lỗi ,,,
    if (error.message) {
      showNotification(`Lỗi: ${error.message}`, 'error');
    } else {
      showNotification('Không thể gửi tin nhắn! Vui lòng kiểm tra kết nối.', 'error');
    }
  }
}

//  XỬ LÝ cái ENTER TRONG CHAT

function handleChatKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

//SETUP REALTIME CHAT

function setupChatRealtime() {

  if (chatSubscription) {
    supabase.removeChannel(chatSubscription);
  }
  

  chatSubscription = supabase
    .channel('chat_realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      },
      (payload) => {
        console.log('Tin nhắn mới:', payload.new);
        
        // Thêm tin nhắn mới vào mảng
        allMessages.push(payload.new);      
        if (allMessages.length > 50) {
          allMessages.shift();
        }
        renderChatMessages();
        scrollChatToBottom();
      }
    )
    .subscribe((status) => {
      console.log('Chat realtime status :', status);
    });
}

// SCROLL CHAT XUỐNG DƯỚI

function scrollChatToBottom() {
  const container = document.getElementById('chatMessages');
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }
}

// CÁI HIỆN ONLINE UPADTE SAU NHÉ 

function updateOnlineBadge() {
  const badge = document.getElementById('onlineCount');
  if (badge) {
    badge.textContent = '99+ online';
  }
}


function showNewPostModal() {

  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để đăng bài!', 'warning');
    showGlobalLoginModal();
    return;
  }
  
  const modal = document.getElementById('newPostModal');
  if (modal) {
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}


function setupContentCounter() {
  const contentInput = document.getElementById('postContent');
  const counter = document.getElementById('contentCounter');
  
  if (!contentInput || !counter) return;
  
  contentInput.addEventListener('input', function() {
    const length = this.value.length;
    counter.textContent = length;
    
    if (length > 1000) {
      counter.style.color = 'red';
    } else if (length > 800) {
      counter.style.color = 'orange';
    } else {
      counter.style.color = '#667eea';
    }
  });
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // Tính giây
  
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  
  // Quá 1 tuần thì hiển thị ngày tháng
  return date.toLocaleDateString('vi-VN');
}
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Hiển thị thông báo lỗi
function showErrorMessage(message) {
  const container = document.getElementById('postsList');
  if (container) {
    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
      </div>
    `;
  }
}
// CLEANUP KHI THOÁT TRANG
window.addEventListener('beforeunload', () => {
  // Hủy subscription khi thoát
  if (chatSubscription) {
    supabase.removeChannel(chatSubscription);
  }
});

console.log('✅ forum.js');