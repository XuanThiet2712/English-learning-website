

const documents = [
  {
    id: 1,
    title: "Ngữ pháp tiếng Anh cơ bản",
    description: "Tài liệu tổng hợp các kiến thức ngữ pháp cơ bản dành cho người mới bắt đầu học tiếng Anh. Bao gồm các thì, câu điều kiện, và câu bị động.",
    category: "grammar",
    categoryName: "Ngữ pháp",

    image: "images/1.jpg", 
    fileUrl: "files/tong on ngu phap tieng anh.pdf", 

    fileSize: "2.5 MB",
    fileType: "PDF"
  },
  {
    id: 2,
    title: "3000 từ vựng tiếng Anh thông dụng",
    description: "Danh sách 3000 từ vựng tiếng Anh thường gặp nhất, được phân loại theo chủ đề và kèm ví dụ minh họa cụ thể.",
    category: "vocabulary",
    categoryName: "Từ vựng",

    image: "images/2.jpg",
    fileUrl: "files/3000 từ vựng Tiếng Anh thông dụng nhất.docx",

    fileSize: "5.8 MB",
    fileType: "DOC"
  },
  {
    id: 3,
    title: "Bài tập đọc hiểu ",
    description: "50 bài đọc hiểu với nhiều chủ đề đa dạng từ khoa học, văn hóa đến kinh tế. Có đáp án chi tiết và giải thích.",
    category: "reading",
    categoryName: "Đọc hiểu",

    image: "images/3.jpg",
    fileUrl: "files/Đọc hiểu.pdf",

    fileSize: "4.2 MB",
    fileType: "PDF"
  },
  {
    id: 4,
    title: "Hướng dẫn viết luận tiếng Anh",
    description: "Tài liệu hướng dẫn chi tiết cách viết các dạng bài luận tiếng Anh: Opinion, Discussion, Problem-Solution với ví dụ mẫu.",
    category: "writing",
    categoryName: "Viết",

    image: "images/4.jpg",
    fileUrl: "files/Hướng dẫn cách viết bài luận Tiếng Anh.docx",

    fileSize: "3.1 MB",
    fileType: "DOC"
  },
  {
    id: 5,
    title: "Đề thi IELTS mẫu",
    description: "Bộ đề thi IELTS thực tế với đáp án và phân tích chi tiết. Phù hợp cho người luyện thi IELTS 6.0-7.5.",
    category: "exam",
    categoryName: "Luyện thi",

    image: "images/5.jpg",
    fileUrl: "files/IELTS_Practice_Tests_Plus_1.pdf",

    fileSize: "6.5 MB",
    fileType: "PDF"
  },
  {
    id: 6,
    title: "Cấu trúc câu tiếng Anh phổ biến",
    description: "120 cấu trúc câu tiếng Anh thông dụng nhất trong giao tiếp và viết. Mỗi cấu trúc có ví dụ minh họa và bài tập.",
    category: "grammar",
    categoryName: "Ngữ pháp",

    image: "images/6.jpg",
    fileUrl: "files/Cau trúc trong tiếng anh.docx",

    fileSize: "3.7 MB",
    fileType: "DOC"
  },
  {
    id: 7,
    title: "Từ vựng TOEIC 600+ theo chủ đề",
    description: "Tài liệu từ vựng TOEIC được phân loại theo 13 chủ đề thường gặp trong bài thi, kèm ví dụ và bài tập.",
    category: "vocabulary",
    categoryName: "Từ vựng",

    image: "images/7.jpg",
    fileUrl: "files/1250 từ vựng TOEIC.pdf",

    fileSize: "4.9 MB",
    fileType: "PDF"
  },
  {
    id: 8,
    title: "Bài đọc tiếng Anh cho người mới",
    description: "30 bài đọc ngắn với từ vựng đơn giản, phù hợp cho người mới bắt đầu học tiếng Anh. Có dịch nghĩa và từ vựng.",
    category: "reading",
    categoryName: "Đọc hiểu",

    image: "images/8.jpg",
    fileUrl: "files/tienanhchonguoibatdau.pdf",

    fileSize: "2.8 MB",
    fileType: "PDF"
  }
];

let currentCategory = 'all';


function initializePage() {
  // Cập nhật thống kê
  updateStatistics();
  
  // Cập nhật số lượng từng danh mục
  updateCategoryCounts();
  
  // Hiển thị tất cả tài liệu
  displayDocuments(documents);
  

}


function updateStatistics() {
  const totalDocs = documents.length;
  const totalDownloads = getTotalDownloads();
  
  document.getElementById('totalDocs').textContent = totalDocs;
  document.getElementById('totalDownloads').textContent = totalDownloads;
}


function updateCategoryCounts() {
  const categories = ['all', 'grammar', 'vocabulary', 'reading', 'writing', 'exam'];
  
  categories.forEach(cat => {
    let count;
    if (cat === 'all') {
      count = documents.length;
    } else {
      count = documents.filter(doc => doc.category === cat).length;
    }
    
    const badge = document.getElementById(`count-${cat}`);
    if (badge) {
      badge.textContent = count;
    }
  });
}


function getTotalDownloads() {
  const downloads = localStorage.getItem('totalDownloads');
  return downloads ? parseInt(downloads) : 0;
}

function incrementDownloads() {
  let downloads = getTotalDownloads();
  downloads++;
  localStorage.setItem('totalDownloads', downloads);
  document.getElementById('totalDownloads').textContent = downloads;
}



function filterByCategory(category) {
  currentCategory = category;
  
  // Cập nhật active class
  const menuLinks = document.querySelectorAll('.menu-list a');
  menuLinks.forEach(link => {
    if (link.getAttribute('data-category') === category) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Lọc và hiển thị
  filterDocuments();
}


function filterDocuments() {
  const searchText = document.getElementById('sidebarSearch').value.toLowerCase();
  
  let filtered = documents;
  
  // Lọc theo danh mục
  if (currentCategory !== 'all') {
    filtered = filtered.filter(doc => doc.category === currentCategory);
  }
  
  // Lọc theo từ khóa tìm kiếm
  if (searchText) {
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(searchText) ||
      doc.description.toLowerCase().includes(searchText)
    );
  }
  

  displayDocuments(filtered);
}



function displayDocuments(docs) {
  const grid = document.getElementById('documentsGrid');
  const noResults = document.getElementById('noResults');
  

  if (docs.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  

  noResults.style.display = 'none';
  

  grid.innerHTML = docs.map(doc => `
    <div class="document-card">
      <div class="document-image">
        <img src="${doc.image}" alt="${doc.title}" 
             onerror="this.src='images/default.jpg'">
        <span class="document-badge">${doc.categoryName}</span>
      </div>
      
      <div class="document-content">
        <h3 class="document-title">${doc.title}</h3>
        <p class="document-description">${doc.description}</p>
        
        <div class="document-info">
          <div class="info-item">
            <i class="fas fa-file-pdf"></i>
            <span>${doc.fileType}</span>
          </div>
          <div class="info-item">
            <i class="fas fa-hdd"></i>
            <span>${doc.fileSize}</span>
          </div>
        </div>
        
        <button class="download-btn" onclick="downloadDocument('${doc.fileUrl}', '${doc.title}')">
          <i class="fas fa-download"></i>
          Tải xuống
        </button>
      </div>
    </div>
  `).join('');
}


// HÀM TẢI XUỐNG TÀI LIỆU


function downloadDocument(fileUrl, fileName) {

  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Tăng lượt tải
  incrementDownloads();
  
  // Hiển thị thông báo tải xuống thành công
  showDownloadNotification(fileName);
}


function showDownloadNotification(fileName) {
  // Tạo thông báo
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 20px 30px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
    z-index: 10000;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 15px;
    animation: slideIn 0.3s ease;
  `;
  
  notification.innerHTML = `
    <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
    <span>Đang tải xuống: ${fileName}</span>
  `;

  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
  initializePage();
});


const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);