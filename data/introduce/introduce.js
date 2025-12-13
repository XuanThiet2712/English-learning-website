// INTRODUCE.JS 
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('globalModals')) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'globalModals';
    document.body.appendChild(modalContainer);
    if (typeof createGlobalModals === 'function') {
      createGlobalModals();
    }
  }
});