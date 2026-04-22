// ASDM Demo Builder 演示站点主逻辑

// 全局配置
const CONFIG = {
    totalPages: 10,
    currentPage: 1,
    isPresentationMode: false,
    autoPlayInterval: null,
    autoPlayDelay: 5000 // 5秒自动播放
};

// 页面配置数据
const PAGE_CONFIG = [
    { id: 1, title: '概述', file: 'pages/page1.html' },
    { id: 2, title: '安装步骤', file: 'pages/page2.html' },
    { id: 3, title: '使用方法', file: 'pages/page3.html' },
    { id: 4, title: '功能特性', file: 'pages/page4.html' },
    { id: 5, title: '输出结构', file: 'pages/page5.html' },
    { id: 6, title: '自定义配置', file: 'pages/page6.html' },
    { id: 7, title: '故障排除', file: 'pages/page7.html' },
    { id: 8, title: '示例演示', file: 'pages/page8.html' },
    { id: 9, title: '技术架构', file: 'pages/page9.html' },
    { id: 10, title: '扩展开发', file: 'pages/page10.html' }
];

// DOM 元素引用
const elements = {
    playBtn: document.getElementById('playBtn'),
    pageCount: document.getElementById('pageCount'),
    pageGrid: document.getElementById('pageGrid'),
    presentationMode: document.getElementById('presentationMode'),
    presentationFrame: document.getElementById('presentationFrame'),
    currentPage: document.getElementById('currentPage'),
    exitPresentation: document.getElementById('exitPresentation')
};

// 初始化函数
function init() {
    console.log('初始化 ASDM Demo Builder 演示站点');
    
    // 设置页面总数
    elements.pageCount.textContent = CONFIG.totalPages;
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化页面导航
    initPageNavigation();
    
    console.log('演示站点初始化完成');
}

// 绑定事件监听器
function bindEventListeners() {
    // 播放按钮点击事件
    elements.playBtn.addEventListener('click', startPresentation);
    
    // 退出演示按钮事件
    elements.exitPresentation.addEventListener('click', exitPresentation);
    
    // 键盘事件监听
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // 全屏变化监听
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    
    // 页面点击事件
    elements.pageGrid.addEventListener('click', handlePageClick);
}

// 初始化页面导航
function initPageNavigation() {
    // 创建页面项点击事件
    const pageItems = elements.pageGrid.querySelectorAll('.page-item');
    pageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const pageNumber = parseInt(item.getAttribute('data-page'));
            goToPage(pageNumber);
        });
    });
}

// 处理页面点击
function handlePageClick(event) {
    const pageItem = event.target.closest('.page-item');
    if (pageItem) {
        const pageNumber = parseInt(pageItem.getAttribute('data-page'));
        goToPage(pageNumber);
    }
}

// 开始演示
function startPresentation() {
    console.log('开始演示模式');
    
    // 进入全屏模式
    enterFullscreen();
    
    // 显示演示模式界面
    elements.presentationMode.classList.remove('hidden');
    
    // 加载第一页
    loadPage(1);
    
    CONFIG.isPresentationMode = true;
    
    // 开始自动播放（可选）
    // startAutoPlay();
}

// 退出演示
function exitPresentation() {
    console.log('退出演示模式');
    
    // 停止自动播放
    stopAutoPlay();
    
    // 退出全屏
    exitFullscreen();
    
    // 隐藏演示模式界面
    elements.presentationMode.classList.add('hidden');
    
    CONFIG.isPresentationMode = false;
    CONFIG.currentPage = 1;
}

// 进入全屏
function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}

// 退出全屏
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
}

// 处理全屏变化
function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement;
    
    if (!isFullscreen && CONFIG.isPresentationMode) {
        exitPresentation();
    }
}

// 处理键盘导航
function handleKeyboardNavigation(event) {
    if (!CONFIG.isPresentationMode) return;
    
    switch(event.key) {
        case 'ArrowLeft':
        case 'PageUp':
            event.preventDefault();
            goToPreviousPage();
            break;
            
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
            event.preventDefault();
            goToNextPage();
            break;
            
        case 'Escape':
            if (CONFIG.isPresentationMode) {
                event.preventDefault();
                exitPresentation();
            }
            break;
            
        case 'Home':
            event.preventDefault();
            goToPage(1);
            break;
            
        case 'End':
            event.preventDefault();
            goToPage(CONFIG.totalPages);
            break;
    }
}

// 跳转到指定页面
function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > CONFIG.totalPages) {
        console.warn(`无效的页面编号: ${pageNumber}`);
        return;
    }
    
    CONFIG.currentPage = pageNumber;
    loadPage(pageNumber);
    
    console.log(`跳转到页面 ${pageNumber}`);
}

// 跳转到上一页
function goToPreviousPage() {
    if (CONFIG.currentPage > 1) {
        goToPage(CONFIG.currentPage - 1);
    } else {
        console.log('已经是第一页');
    }
}

// 跳转到下一页
function goToNextPage() {
    if (CONFIG.currentPage < CONFIG.totalPages) {
        goToPage(CONFIG.currentPage + 1);
    } else {
        console.log('已经是最后一页');
        // 可选：循环到第一页
        // goToPage(1);
    }
}

// 加载页面内容
function loadPage(pageNumber) {
    const pageConfig = PAGE_CONFIG.find(page => page.id === pageNumber);
    if (!pageConfig) {
        console.error(`找不到页面配置: ${pageNumber}`);
        return;
    }
    
    // 更新当前页面显示
    elements.currentPage.textContent = `页面 ${pageNumber}/${CONFIG.totalPages}`;
    
    // 加载页面内容到 iframe
    elements.presentationFrame.src = pageConfig.file;
    
    // 更新页面导航高亮
    updatePageNavigation(pageNumber);
}

// 更新页面导航高亮
function updatePageNavigation(currentPage) {
    const pageItems = elements.pageGrid.querySelectorAll('.page-item');
    
    pageItems.forEach(item => {
        const pageNumber = parseInt(item.getAttribute('data-page'));
        if (pageNumber === currentPage) {
            item.style.borderColor = '#10b981';
            item.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
        } else {
            item.style.borderColor = '';
            item.style.boxShadow = '';
        }
    });
}

// 开始自动播放
function startAutoPlay() {
    stopAutoPlay(); // 先停止之前的自动播放
    
    CONFIG.autoPlayInterval = setInterval(() => {
        if (CONFIG.currentPage < CONFIG.totalPages) {
            goToNextPage();
        } else {
            stopAutoPlay();
            console.log('自动播放完成');
        }
    }, CONFIG.autoPlayDelay);
}

// 停止自动播放
function stopAutoPlay() {
    if (CONFIG.autoPlayInterval) {
        clearInterval(CONFIG.autoPlayInterval);
        CONFIG.autoPlayInterval = null;
    }
}

// 工具函数：检查浏览器是否支持全屏
function isFullscreenSupported() {
    return document.fullscreenEnabled || 
           document.webkitFullscreenEnabled || 
           document.mozFullScreenEnabled;
}

// 工具函数：显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 导出函数供其他模块使用
window.ASDMDemoBuilder = {
    goToPage,
    goToPreviousPage,
    goToNextPage,
    startPresentation,
    exitPresentation,
    startAutoPlay,
    stopAutoPlay
};