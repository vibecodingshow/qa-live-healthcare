// ASDM Demo Builder 导航功能

// 导航配置
const NAVIGATION_CONFIG = {
    // 页面切换动画配置
    animationDuration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // 触摸手势配置
    swipeThreshold: 50, // 滑动阈值（像素）
    swipeVelocity: 0.3, // 滑动速度阈值
    
    // 键盘快捷键配置
    shortcuts: {
        previous: ['ArrowLeft', 'PageUp'],
        next: ['ArrowRight', 'PageDown', ' '],
        first: ['Home'],
        last: ['End'],
        exit: ['Escape']
    }
};

// 触摸手势处理
class TouchNavigation {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.startTime = 0;
        this.isSwiping = false;
        
        this.init();
    }
    
    init() {
        // 绑定触摸事件
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    handleTouchStart(event) {
        const touch = event.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.startTime = Date.now();
        this.isSwiping = true;
    }
    
    handleTouchMove(event) {
        if (!this.isSwiping) return;
        
        const touch = event.touches[0];
        this.endX = touch.clientX;
        this.endY = touch.clientY;
    }
    
    handleTouchEnd() {
        if (!this.isSwiping) return;
        
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;
        const duration = Date.now() - this.startTime;
        const velocity = Math.abs(deltaX) / duration;
        
        // 检查是否为有效的水平滑动
        if (Math.abs(deltaX) > Math.abs(deltaY) && 
            Math.abs(deltaX) > NAVIGATION_CONFIG.swipeThreshold &&
            velocity > NAVIGATION_CONFIG.swipeVelocity) {
            
            if (deltaX > 0) {
                // 向右滑动 - 上一页
                this.goToPreviousPage();
            } else {
                // 向左滑动 - 下一页
                this.goToNextPage();
            }
        }
        
        this.isSwiping = false;
    }
    
    goToPreviousPage() {
        if (window.ASDMDemoBuilder) {
            window.ASDMDemoBuilder.goToPreviousPage();
        }
    }
    
    goToNextPage() {
        if (window.ASDMDemoBuilder) {
            window.ASDMDemoBuilder.goToNextPage();
        }
    }
}

// 页面切换动画
class PageTransition {
    constructor() {
        this.isTransitioning = false;
    }
    
    async slideToNext() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        await this.performSlide('next');
        this.isTransitioning = false;
    }
    
    async slideToPrevious() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        await this.performSlide('previous');
        this.isTransitioning = false;
    }
    
    async performSlide(direction) {
        return new Promise((resolve) => {
            const frame = document.getElementById('presentationFrame');
            if (!frame) {
                resolve();
                return;
            }
            
            // 设置动画样式
            frame.style.transition = `transform ${NAVIGATION_CONFIG.animationDuration}ms ${NAVIGATION_CONFIG.easing}`;
            
            // 根据方向设置动画
            if (direction === 'next') {
                frame.style.transform = 'translateX(-100%)';
            } else {
                frame.style.transform = 'translateX(100%)';
            }
            
            // 动画结束后重置
            setTimeout(() => {
                frame.style.transition = 'none';
                frame.style.transform = 'translateX(0)';
                resolve();
            }, NAVIGATION_CONFIG.animationDuration);
        });
    }
    
    fadeIn() {
        const frame = document.getElementById('presentationFrame');
        if (frame) {
            frame.style.opacity = '0';
            frame.style.transition = `opacity ${NAVIGATION_CONFIG.animationDuration}ms ${NAVIGATION_CONFIG.easing}`;
            
            setTimeout(() => {
                frame.style.opacity = '1';
            }, 10);
        }
    }
}

// 进度指示器
class ProgressIndicator {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 10;
        this.progressElement = null;
        
        this.createProgressElement();
    }
    
    createProgressElement() {
        // 创建进度条元素
        this.progressElement = document.createElement('div');
        this.progressElement.className = 'progress-bar';
        this.progressElement.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">1 / 10</div>
        `;
        
        // 添加到演示模式头部
        const header = document.querySelector('.presentation-header');
        if (header) {
            header.appendChild(this.progressElement);
        }
    }
    
    updateProgress(pageNumber) {
        this.currentPage = pageNumber;
        
        // 更新进度条
        const progressFill = this.progressElement?.querySelector('.progress-fill');
        const progressText = this.progressElement?.querySelector('.progress-text');
        
        if (progressFill) {
            const progress = (pageNumber / this.totalPages) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${pageNumber} / ${this.totalPages}`;
        }
    }
    
    setTotalPages(total) {
        this.totalPages = total;
    }
}

// 键盘导航增强
class EnhancedKeyboardNavigation {
    constructor() {
        this.isEnabled = true;
        this.init();
    }
    
    init() {
        // 监听键盘事件
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // 添加键盘帮助提示
        this.createKeyboardHelp();
    }
    
    handleKeyPress(event) {
        if (!this.isEnabled) return;
        
        const key = event.key;
        const { shortcuts } = NAVIGATION_CONFIG;
        
        // 检查快捷键
        if (shortcuts.previous.includes(key)) {
            event.preventDefault();
            this.navigateToPrevious();
        } else if (shortcuts.next.includes(key)) {
            event.preventDefault();
            this.navigateToNext();
        } else if (shortcuts.first.includes(key)) {
            event.preventDefault();
            this.navigateToFirst();
        } else if (shortcuts.last.includes(key)) {
            event.preventDefault();
            this.navigateToLast();
        }
    }
    
    navigateToPrevious() {
        if (window.ASDMDemoBuilder) {
            window.ASDMDemoBuilder.goToPreviousPage();
        }
    }
    
    navigateToNext() {
        if (window.ASDMDemoBuilder) {
            window.ASDMDemoBuilder.goToNextPage();
        }
    }
    
    navigateToFirst() {
        if (window.ASDMDemoBuilder) {
            window.ASDMDemoBuilder.goToPage(1);
        }
    }
    
    navigateToLast() {
        if (window.ASDMDemoBuilder) {
            window.ASDMDemoBuilder.goToPage(10);
        }
    }
    
    createKeyboardHelp() {
        // 在演示模式下显示键盘帮助
        const helpElement = document.createElement('div');
        helpElement.className = 'keyboard-help';
        helpElement.innerHTML = `
            <div class="help-content">
                <h4>键盘快捷键</h4>
                <div class="shortcut-list">
                    <div class="shortcut-item">
                        <kbd>←</kbd> <span>上一页</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>→</kbd> <span>下一页</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>空格</kbd> <span>播放/暂停</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>ESC</kbd> <span>退出演示</span>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(helpElement);
        
        // 自动隐藏
        setTimeout(() => {
            helpElement.classList.add('hidden');
        }, 5000);
    }
    
    enable() {
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
    }
}

// 导出导航功能
window.ASDMNavigation = {
    TouchNavigation,
    PageTransition,
    ProgressIndicator,
    EnhancedKeyboardNavigation,
    
    // 初始化所有导航功能
    initAll() {
        // 初始化触摸导航
        new TouchNavigation();
        
        // 初始化页面切换动画
        const pageTransition = new PageTransition();
        
        // 初始化进度指示器
        const progressIndicator = new ProgressIndicator();
        
        // 初始化键盘导航增强
        const keyboardNav = new EnhancedKeyboardNavigation();
        
        return {
            pageTransition,
            progressIndicator,
            keyboardNav
        };
    }
};

// 页面加载完成后初始化导航功能
document.addEventListener('DOMContentLoaded', () => {
    if (window.ASDMNavigation) {
        window.ASDMNavigation.initAll();
        console.log('导航功能初始化完成');
    }
});