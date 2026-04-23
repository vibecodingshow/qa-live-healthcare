// 演示状态
let slides = [];
let currentSlide = 0;
let isFullscreen = false;

// 跳转到演示页面
function goToDemo(content, filename) {
    // 使用 localStorage 存储（更可靠）
    localStorage.setItem('presentationMarkdown', content);
    localStorage.setItem('presentationFilename', filename || '演示');
    window.location.href = 'pages/demo.html';
}

// 加载本地 Markdown 文件（FileReader）
function loadLocalFile(file) {
    if (!file) return;
    
    // 检查文件类型
    if (!file.name.match(/\.(md|markdown)$/i)) {
        alert('请选择 Markdown 文件 (.md 或 .markdown)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        console.log('读取文件:', file.name, '内容长度:', content.length);
        console.log('前100字符:', content.substring(0, 100));
        goToDemo(content, file.name);
    };
    reader.onerror = () => {
        alert('文件读取失败，请重试');
    };
    reader.readAsText(file);
}

// 解析 Markdown 为幻灯片
function parseMarkdown(markdown) {
    console.log('开始解析 Markdown，长度:', markdown.length);
    
    // 按一级标题（# 标题）分割页面
    // 匹配行首的 # 标题
    const slideRegex = /(^|\n)(#\s+.+(?:\n|$))/gm;
    const parts = markdown.split(slideRegex);
    
    // 清理 parts，移除空字符串
    const cleanedParts = parts.filter(part => part && part.trim());
    
    console.log('分割后部分数量:', cleanedParts.length);
    
    slides = cleanedParts.map((part, index) => {
        // 移除开头的 # 标题（已经是页面标题）
        let content = part.trim();
        
        // 处理 Markdown 语法
        content = content
            // 代码块（必须先处理）
            .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            // 行内代码
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // 一级标题
            .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
            // 二级标题
            .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
            // 三级标题
            .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
            // 四级标题
            .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
            // 粗体
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // 斜体
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // 链接
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // 分隔线
            .replace(/^---+$/gm, '<hr>')
            // 无序列表项
            .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
            // 有序列表项
            .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
            // 表格行
            .replace(/^\|(.+)\|$/gm, (match, row) => {
                const cells = row.split('|').map(c => c.trim());
                // 检查是否是分隔行
                if (cells.every(c => /^-+$/.test(c))) {
                    return '';
                }
                return '<tr>' + cells.map(c => '<td>' + c + '</td>').join('') + '</tr>';
            })
            // 段落（普通文本行）
            .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')
            // 清理空的段落标签
            .replace(/<p>\s*<\/p>/g, '');
        
        // 处理列表：将连续的 <li> 包装成 <ul>
        content = content.replace(/(<li>[\s\S]*?<\/li>)+/g, (match) => {
            return '<ul>' + match.replace(/<\/li>/g, '</li>') + '</ul>';
        });
        
        // 处理表格
        content = content.replace(/(<tr>[\s\S]*?<\/tr>)+/g, (match) => {
            return '<table>' + match + '</table>';
        });
        
        // 清理连续的 </p> 和 <p>
        content = content.replace(/<\/p>\s*<p>/g, '<br><br>');
        
        return content;
    });
    
    // 过滤掉空内容
    slides = slides.filter(slide => slide.trim() && slide !== '<h1></h1>');
    
    console.log('最终幻灯片数量:', slides.length);
    
    renderSlides();
}

// 渲染幻灯片
function renderSlides() {
    const container = document.getElementById('presentation');
    if (!container) {
        console.error('找不到 presentation 容器');
        return;
    }
    
    if (slides.length === 0) {
        slides = ['<h1>无内容</h1><p>文件内容为空或解析失败</p>'];
    }
    
    container.innerHTML = slides.map((content, index) => 
        `<div class="slide${index === 0 ? ' active' : ''}" data-index="${index}">${content}</div>`
    ).join('');
    
    console.log('渲染完成，幻灯片数量:', slides.length);
    updateProgress();
}

// 更新进度
function updateProgress() {
    const total = slides.length;
    const current = currentSlide + 1;
    
    const currentEl = document.getElementById('currentPage');
    const totalEl = document.getElementById('totalPages');
    const progressEl = document.getElementById('progressFill');
    const counterEl = document.getElementById('slideCounter');
    
    if (currentEl) currentEl.textContent = current;
    if (totalEl) totalEl.textContent = total;
    if (progressEl) progressEl.style.width = `${(current / total) * 100}%`;
    if (counterEl) counterEl.textContent = `${current} / ${total}`;
}

// 切换幻灯片
function goToSlide(index) {
    const slideElements = document.querySelectorAll('.slide');
    if (!slideElements.length) return;
    
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    
    slideElements[currentSlide]?.classList.remove('active');
    slideElements[index]?.classList.add('active');
    
    currentSlide = index;
    updateProgress();
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        isFullscreen = true;
    } else {
        document.exitFullscreen();
        isFullscreen = false;
    }
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'Escape':
            if (isFullscreen) {
                document.exitFullscreen();
                isFullscreen = false;
            }
            break;
        case 'Home':
            goToSlide(0);
            break;
        case 'End':
            goToSlide(slides.length - 1);
            break;
    }
});

// 鼠标滚轮控制
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) nextSlide();
        else prevSlide();
    }, 50);
});

// 触摸滑动控制
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
}, { passive: true });

// 初始化演示页
function initPresentation() {
    console.log('初始化演示页...');
    
    const markdown = localStorage.getItem('presentationMarkdown');
    const filename = localStorage.getItem('presentationFilename') || '演示';
    
    console.log('从 localStorage 读取:', filename);
    
    if (markdown) {
        console.log('Markdown 内容长度:', markdown.length);
        parseMarkdown(markdown);
        document.title = '演示 - ' + filename;
    } else {
        console.log('没有找到 Markdown 内容');
        slides = [
            '<h1>演示站点</h1><p>请返回首页选择文件</p><p><a href="../index.html">返回首页</a></p>',
            '<h1>使用方法</h1><ul><li>← → 键翻页</li><li>F 键全屏</li><li>Esc 退出全屏</li></ul>'
        ];
        renderSlides();
    }
    
    // 绑定按钮事件
    document.getElementById('prevBtn')?.addEventListener('click', prevSlide);
    document.getElementById('nextBtn')?.addEventListener('click', nextSlide);
    document.getElementById('playBtn')?.addEventListener('click', toggleFullscreen);
    
    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
    });
}

// 页面加载时初始化
if (document.getElementById('presentation')) {
    console.log('检测到演示容器，开始初始化...');
    initPresentation();
}
