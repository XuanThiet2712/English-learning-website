// SUPABASE-CONFIG.JS

'use strict';

const SUPABASE_URL = 'https://cmbbvfhvdnfcuidhpggr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtYmJ2Zmh2ZG5mY3VpZGhwZ2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzAxOTAsImV4cCI6MjA4MDY0NjE5MH0.feDyFcRiSFc8Hfzp69rIQTzVAVcfITyR3Ge2jDymGk4';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// upload avatar
async function uploadAvatar(file, userEmail) {
  try {
    if (!file) throw new Error('Không có file ảnh');
    
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      throw new Error('Ảnh phải nhỏ hơn 2MB');
    }
    
    if (!file.type || !file.type.startsWith('image/')) {
      throw new Error('Loại định dạng ảnh không hợp lệ');
    }
    
    // Đặt tên ảnh
    const fileExt = file.name.split('.').pop();
    const fileName = `${userEmail.split('@')[0]}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file, {
        cacheControl: '3636',
        upsert: true
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Lỗi upload avatar:', error);

    return 'https://ocjodjbqghyxhhmmvron.supabase.co/storage/v1/object/public/avatars/967e6186-0433-47db-a803-0af93cff03d8/1%20(2).png';
  }
}

// xóa avatar cux
async function deleteOldAvatar(avatarUrl) {
  if (!avatarUrl || avatarUrl.includes('placeholder') || avatarUrl.includes('1%20(2).png')) {
    return;
  }
  
  try {
    const urlParts = avatarUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `avatars/${fileName}`;
    
    await supabase.storage
      .from('user-avatars')
      .remove([filePath]);
  } catch (error) {
    console.error('Lỗi xóa avatar cũ:', error);
  }
}

// tính rank
function calculateRank(exp) {
  if (exp < 100) return 'Người mới 🌱';
  if (exp < 300) return 'Học viên 📚';
  if (exp < 600) return 'Chuyên cần ⭐';
  if (exp < 1000) return 'Xuất sắc 🏆';
  if (exp < 2000) return 'Tinh anh 💎';
  if (exp < 5000) return 'Cao thủ 👑';
  return 'Huyền thoại 🔥';
}

// tính streak
function calculateStreak(attendanceRecords) {
  if (!attendanceRecords || attendanceRecords.length === 0) return 0;
  const dates = attendanceRecords.map(r => r.check_in_date).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let currentDate = new Date(today);
  for (let i = 0; i < dates.length; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (dates[i] === dateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// llấy số liệu hôm nay
async function getTodayData(userEmail) {
  if (!userEmail) return null;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const [vocabResult, exerciseResult, gameResult] = await Promise.all([
      supabase
        .from('vocabulary_progress')
        .select('id')
        .eq('user_email', userEmail)
        .gte('learned_at', today)
        .eq('is_learned', true),
      
      supabase
        .from('exercise_results')
        .select('id, score')
        .eq('user_email', userEmail)
        .gte('completed_at', today),
      
      supabase
        .from('game_scores')
        .select('id, score')
        .eq('user_email', userEmail)
        .gte('played_at', today)
    ]);
    
    const vocabCount = vocabResult.data?.length || 0;
    const exerciseCount = exerciseResult.data?.length || 0;
    const gameCount = gameResult.data?.length || 0;
    
    const expToday = exerciseCount * 10;
    
    return {
      vocab: vocabCount,
      quiz: exerciseCount,
      game: gameCount,
      exp: expToday
    };
  } catch (error) {
    console.error('loi lay du lieu hom nay', error);
    return null;
  }
}

console.log('✅ supabase-config.js ');