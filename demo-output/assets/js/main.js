// 演示站点主逻辑
class DemoBuilder {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('ASDM Demo Builder 初始化中...');
        
        // 检测设备类型
        this.detectDeviceType();
        
        // 设置触摸事件支持
        this.setupTouchSupport();
        
        // 设置页面加载完成后的初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDomReady());
        } else {
            this.onDomReady();
        }
        
        this.isInitialized = true;
    }

    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        this.isMobile = /mobile|android|iphone|ipad/.test(userAgent);
        this.isTablet = /ipad|tablet/.test(userAgent) || 
                       (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
        
        // 添加设备类到 body
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
        } else if (this.isTablet) {
            document.body.classList.add('tablet-device');
        } else {
            document.body.classList.add('desktop-device');
        }
    }

    setupTouchSupport() {
        if (!('ontouchstart' in window)) return;

        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const minSwipeDistance = 50;
        const swipeDistance = Math.abs(endX - startX);
        
        if (swipeDistance < minSwipeDistance) return;

        if (endX > startX) {
            // 右滑 - 上一页
            if (window.demoNavigation) {
                window.demoNavigation.previousPage();
            }
        } else {
            // 左滑 - 下一页
            if (window.demoNavigation) {
                window.demoNavigation.nextPage();
            }
        }
    }

    onDomReady() {
        console.log('DOM 加载完成，设置演示站点...');
        
        // 设置页面标题
        this.setPageTitle();
        
        // 初始化导航系统
        this.initNavigation();
        
        // 设置性能监控
        this.setupPerformanceMonitoring();
        
        // 设置错误处理
        this.setupErrorHandling();
        
        console.log('ASDM Demo Builder 初始化完成');
    }

    setPageTitle() {
        const currentPage = window.demoNavigation ? window.demoNavigation.currentPage : 1;
        const totalPages = window.demoNavigation ? window.demoNavigation.totalPages : 10;
        document.title = `ASDM Demo Builder - 页面 ${currentPage}/${totalPages}`;
    }

    initNavigation() {
        // 确保导航系统已初始化
        if (typeof DemoNavigation !== 'undefined') {
            window.demoNavigation = new DemoNavigation();
        } else {
            console.warn('导航系统尚未加载，将在稍后初始化');
            setTimeout(() => this.initNavigation(), 100);
        }
    }

    setupPerformanceMonitoring() {
        // 监控页面性能
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        console.log('页面加载性能:', {
                            'DOM 加载完成': `${navigation.domContentLoadedEventEnd - navigation.navigationStart}ms`,
                            '完全加载': `${navigation.loadEventEnd - navigation.navigationStart}ms`,
                            '首次内容绘制': performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A'
                        });
                    }
                }, 0);
            });
        }
    }

    setupErrorHandling() {
        // 全局错误处理
        window.addEventListener('error', (event) => {
            console.error('演示站点错误:', event.error);
            
            // 显示友好的错误信息
            this.showErrorMessage('发生了一个错误，请刷新页面重试。');
        });

        // Promise 错误处理
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的 Promise 拒绝:', event.reason);
            event.preventDefault();
        });
    }

    showErrorMessage(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef2f2;
            color: #dc2626;
            padding: 1rem;
            border: 1px solid #fecaca;
            border-radius: 0.5rem;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        `;
        errorDiv.innerHTML = `
            <strong>错误</strong>
            <p style="margin: 0.5rem 0 0; font-size: 0.9rem;">${message}</p>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    // 公共方法
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    // 页面刷新时重新初始化
    refresh() {
        console.log('刷新演示站点...');
        this.isInitialized = false;
        this.init();
    }
}

// 导出到全局作用域
window.DemoBuilder = DemoBuilder;

// 自动初始化
new DemoBuilder();