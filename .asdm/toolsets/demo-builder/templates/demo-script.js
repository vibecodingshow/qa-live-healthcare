// Demo Builder JavaScript

class DemoBuilder {
    constructor() {
        this.currentPage = 0;
        this.totalPages = 0;
        this.pages = [];
        this.isFullscreen = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadDemoData();
        this.showPage(0);
    }

    initializeElements() {
        // Navigation elements
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.playBtn = document.getElementById('play-btn');
        
        // Page indicators
        this.currentPageEl = document.getElementById('current-page');
        this.totalPagesEl = document.getElementById('total-pages');
        
        // Progress bar
        this.progressFill = document.getElementById('progress-fill');
        
        // Slides containers
        this.slidesContainer = document.querySelector('.demo-content .slides-container');
        this.fullscreenSlidesContainer = document.querySelector('.fullscreen-overlay .slides-container');
        
        // Fullscreen elements
        this.fullscreenOverlay = document.getElementById('fullscreen-overlay');
        this.exitFullscreenBtn = document.getElementById('exit-fullscreen');
        
        // Slides arrays
        this.slides = Array.from(this.slidesContainer.querySelectorAll('.slide'));
        this.fullscreenSlides = Array.from(this.fullscreenSlidesContainer.querySelectorAll('.slide'));
        
        this.totalPages = this.slides.length;
        this.totalPagesEl.textContent = this.totalPages;
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Play button
        this.playBtn.addEventListener('click', () => this.enterFullscreen());
        
        // Exit fullscreen
        this.exitFullscreenBtn.addEventListener('click', () => this.exitFullscreen());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
        
        // Touch events for mobile
        this.setupTouchEvents();
    }

    setupTouchEvents() {
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
        const swipeDistance = endX - startX;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                this.previousPage();
            } else {
                this.nextPage();
            }
        }
    }

    handleKeydown(e) {
        if (this.isFullscreen && e.key === 'Escape') {
            this.exitFullscreen();
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.previousPage();
                break;
                
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.nextPage();
                break;
                
            case 'Home':
                e.preventDefault();
                this.showPage(0);
                break;
                
            case 'End':
                e.preventDefault();
                this.showPage(this.totalPages - 1);
                break;
                
            case 'f':
            case 'F':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
                break;
        }
    }

    loadDemoData() {
        // This would normally load data from the server or embedded JSON
        // For now, we'll use the static HTML structure
        console.log('Demo data loaded:', this.totalPages, 'pages');
    }

    showPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.totalPages) {
            return;
        }
        
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.fullscreenSlides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        this.slides[pageIndex].classList.add('active');
        this.fullscreenSlides[pageIndex].classList.add('active');
        
        this.currentPage = pageIndex;
        this.currentPageEl.textContent = pageIndex + 1;
        
        // Update progress bar
        this.updateProgressBar();
        
        // Update button states
        this.updateNavigationButtons();
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.showPage(this.currentPage - 1);
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.showPage(this.currentPage + 1);
        }
    }

    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
    }

    updateProgressBar() {
        const progress = ((this.currentPage + 1) / this.totalPages) * 100;
        this.progressFill.style.width = progress + '%';
    }

    enterFullscreen() {
        this.isFullscreen = true;
        this.fullscreenOverlay.classList.add('active');
        
        // Show current page in fullscreen
        this.showPage(this.currentPage);
        
        // Try to enter fullscreen mode
        const element = this.fullscreenOverlay;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        this.isFullscreen = false;
        this.fullscreenOverlay.classList.remove('active');
        
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement);
        
        if (!isFullscreen && this.isFullscreen) {
            this.exitFullscreen();
        }
    }

    // Utility methods
    goToFirstPage() {
        this.showPage(0);
    }

    goToLastPage() {
        this.showPage(this.totalPages - 1);
    }

    // Public API for external control
    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.totalPages;
    }

    isFullscreenMode() {
        return this.isFullscreen;
    }
}

// Initialize the demo builder when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.demoBuilder = new DemoBuilder();
    
    // Add some helpful console messages
    console.log('ASDM Demo Builder initialized');
    console.log('Keyboard shortcuts:');
    console.log('- Left arrow / PageUp: Previous page');
    console.log('- Right arrow / PageDown / Space: Next page');
    console.log('- Home: First page');
    console.log('- End: Last page');
    console.log('- F11 or Ctrl+F: Toggle fullscreen');
    console.log('- ESC: Exit fullscreen');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoBuilder;
}