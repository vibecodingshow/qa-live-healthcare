/**
 * Presentation Builder - Script
 * 纯前端 Markdown 演示生成器
 */

// 全局状态
let currentSlide = 0;
let slides = [];
let isFullscreen = false;

/**
 * 初始化演示
 */
function initPresentation() {
  const markdown = localStorage.getItem('presentationMarkdown');
  
  if (!markdown) {
    // 如果没有 Markdown，返回首页
    document.body.innerHTML = `
      <div class="container">
        <div class="header">
          <h1>📋 没有找到演示内容</h1>
          <p class="subtitle">请先在首页选择 Markdown 文件</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="index.html" class="btn btn-primary" style="text-decoration: none; color: white; padding: 15px 40px; border-radius: 8px;">返回首页</a>
        </div>
      </div>
    `;
    return;
  }

  // 解析 Markdown 并生成幻灯片
  parseMarkdown(markdown);
  
  // 初始化控制
  setupControls();
  
  // 显示第一页
  showSlide(0);
  
  // 隐藏键盘提示
  setTimeout(() => {
    const hint = document.getElementById('keyboardHint');
    if (hint) hint.style.opacity = '0';
  }, 3000);
}

/**
 * 解析 Markdown 为幻灯片
 * @param {string} markdown 
 */
function parseMarkdown(markdown) {
  // 配置 marked 选项
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false
    });
  }

  // 按一级标题分割
  const parts = markdown.split(/(?:^|\n)(?=#\s)/);
  
  slides = parts.map((part, index) => {
    // 解析 Markdown 为 HTML
    const html = typeof marked !== 'undefined' 
      ? marked.parse(part.trim()) 
      : part.trim().replace(/\n/g, '<br>');
    
    return `<div class="slide-content">${html}</div>`;
  }).filter(slide => slide.trim() !== '<div class="slide-content"></div>');

  // 如果没有找到标题，将整个内容作为一页
  if (slides.length === 0 && markdown.trim()) {
    const html = typeof marked !== 'undefined' 
      ? marked.parse(markdown.trim()) 
      : markdown.trim().replace(/\n/g, '<br>');
    slides = [`<div class="slide-content">${html}</div>`];
  }

  // 渲染幻灯片
  renderSlides();
}

/**
 * 渲染幻灯片到 DOM
 */
function renderSlides() {
  const container = document.getElementById('slideContainer');
  if (!container) return;

  container.innerHTML = slides.map((content, index) => `
    <div class="slide" data-index="${index}">
      ${content}
    </div>
  `).join('');

  // 更新总页数
  const totalPages = document.getElementById('totalPages');
  if (totalPages) totalPages.textContent = slides.length;
}

/**
 * 显示指定幻灯片
 * @param {number} index 
 */
function showSlide(index) {
  if (slides.length === 0) return;

  // 边界检查
  if (index < 0) index = 0;
  if (index >= slides.length) index = slides.length - 1;

  currentSlide = index;

  // 更新幻灯片显示
  const slideElements = document.querySelectorAll('.slide');
  slideElements.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  // 更新页码
  const currentPage = document.getElementById('currentPage');
  if (currentPage) currentPage.textContent = index + 1;

  // 更新进度条
  const progress = document.getElementById('progress');
  if (progress) {
    const percentage = ((index + 1) / slides.length) * 100;
    progress.style.width = `${percentage}%`;
  }
}

/**
 * 上一页
 */
function prevSlide() {
  showSlide(currentSlide - 1);
}

/**
 * 下一页
 */
function nextSlide() {
  showSlide(currentSlide + 1);
}

/**
 * 切换全屏
 */
function toggleFullscreen() {
  const presentation = document.getElementById('presentation');
  
  if (!document.fullscreenElement) {
    presentation.requestFullscreen().then(() => {
      isFullscreen = true;
    }).catch(err => {
      console.log('全屏请求失败:', err);
    });
  } else {
    document.exitFullscreen();
    isFullscreen = false;
  }
}

/**
 * 设置控制事件
 */
function setupControls() {
  // 上一页按钮
  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  // 下一页按钮
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  // 全屏按钮
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // 键盘控制
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        prevSlide();
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
      case 'Home':
        showSlide(0);
        break;
      case 'End':
        showSlide(slides.length - 1);
        break;
    }
  });

  // 触摸滑动支持
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // 鼠标滚轮支持
  let wheelTimeout;
  document.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }, 50);
  }, { passive: true });

  // ESC 退出全屏
  document.addEventListener('fullscreenchange', () => {
    isFullscreen = !!document.fullscreenElement;
  });
}

// 导出函数供外部使用
window.initPresentation = initPresentation;
window.showSlide = showSlide;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.toggleFullscreen = toggleFullscreen;
