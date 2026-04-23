// 演示站点导航功能
class DemoNavigation {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 10; // 基于 demo-installation-guide.md 的 H1 标题数量
        this.pages = [
            { 
                id: 1, 
                title: "ASDM Demo Builder 工具集安装指南", 
                content: `<h1>ASDM Demo Builder 工具集安装指南</h1>
                <h2>概述</h2>
                <p>ASDM Demo Builder 是一个专门用于将 Markdown 文件转换为交互式演示站点的工具集。它提供了以下核心功能：</p>
                <ul>
                    <li><strong>自动页面生成</strong>：每个 H1 标题成为一个独立的演示页面</li>
                    <li><strong>交互式导航</strong>：支持键盘左右键切换页面</li>
                    <li><strong>全屏演示模式</strong>：点击播放按钮进入全屏演示</li>
                    <li><strong>响应式设计</strong>：适配桌面和移动设备</li>
                </ul>
                <p>这个工具集的设计目标是简化技术文档的展示过程，让用户能够快速创建专业的演示站点。</p>`
            },
            { 
                id: 2, 
                title: "概述", 
                content: `<h1>概述</h1>
                <h2>什么是 ASDM Demo Builder</h2>
                <p>ASDM Demo Builder 是一个专门用于将 Markdown 文件转换为交互式演示站点的工具集。它提供了强大的功能来帮助开发者和文档作者快速创建专业的演示内容。</p>
                <h2>核心特性</h2>
                <ul>
                    <li><strong>自动页面生成</strong>：每个 H1 标题成为一个独立的演示页面</li>
                    <li><strong>交互式导航</strong>：支持键盘左右键切换页面</li>
                    <li><strong>全屏演示模式</strong>：点击播放按钮进入全屏演示</li>
                    <li><strong>响应式设计</strong>：适配桌面和移动设备</li>
                </ul>
                <h2>使用场景</h2>
                <ul>
                    <li>产品演示和展示</li>
                    <li>技术文档演示</li>
                    <li>培训材料展示</li>
                    <li>项目汇报演示</li>
                </ul>`
            },
            { 
                id: 3, 
                title: "安装步骤", 
                content: `<h1>安装步骤</h1>
                <h2>1. 验证工具集结构</h2>
                <p>工具集已创建在以下位置：</p>
                <pre><code>.asdm/toolsets/demo-builder/
├── README.md                 # 工具集说明文档
├── INSTALL.md                # 安装指南
├── actions/
│   └── asdm-build-demo.md     # 构建指令
├── templates/
│   ├── demo-template.html     # 演示站点模板
│   ├── demo-styles.css        # 样式文件
│   └── demo-script.js         # 交互脚本
├── scripts/
│   ├── build-demo.js          # 构建脚本
│   └── asdm-build-demo.js     # 命令行接口
└── examples/
    └── sample-demo.md         # 示例文件</code></pre>
                <h2>2. CodeBuddy 命令集成</h2>
                <p>已创建 CodeBuddy 命令文件：</p>
                <pre><code>.codebuddy/commands/asdm-build-demo.md</code></pre>
                <h2>3. 测试安装</h2>
                <p>使用示例文件测试工具集：</p>
                <pre><code>node .asdm/toolsets/demo-builder/scripts/build-demo.js .asdm/toolsets/demo-builder/examples/sample-demo.md</code></pre>`
            },
            { 
                id: 4, 
                title: "使用方法", 
                content: `<h1>使用方法</h1>
                <h2>基本用法</h2>
                <pre><code># 使用 CodeBuddy 命令
/asdm-build-demo ./README.md

# 直接使用 Node.js 脚本
node .asdm/toolsets/demo-builder/scripts/build-demo.js presentation.md</code></pre>
                <h2>高级选项</h2>
                <pre><code># 自定义输出目录和标题
/asdm-build-demo ./README.md -o my-demo -t "我的演示"

# 显示帮助信息
/asdm-build-demo --help</code></pre>
                <h2>常用命令</h2>
                <ul>
                    <li><code>/asdm-build-demo</code> - 构建演示站点</li>
                    <li><code>/asdm-preview-demo</code> - 预览演示站点</li>
                    <li><code>/asdm-customize-demo</code> - 自定义演示样式</li>
                </ul>
                <h2>输出说明</h2>
                <p>构建完成后，会在指定目录生成完整的演示站点文件，包括 HTML、CSS、JavaScript 等资源文件。</p>`
            },
            { 
                id: 5, 
                title: "功能特性", 
                content: `<h1>功能特性</h1>
                <h2>1. Markdown 解析</h2>
                <ul>
                    <li><strong>H1 标题</strong> (<code># Title</code>) → 演示页面</li>
                    <li><strong>H2 标题</strong> (<code>## Section</code>) → 内容区域</li>
                    <li><strong>H3 标题</strong> (<code>### Subsection</code>) → 子区域</li>
                    <li><strong>普通文本</strong> → 段落内容</li>
                </ul>
                <h2>2. 交互功能</h2>
                <h3>键盘导航</h3>
                <ul>
                    <li>左箭头 / PageUp：上一页</li>
                    <li>右箭头 / PageDown / 空格键：下一页</li>
                    <li>Home：第一页</li>
                    <li>End：最后一页</li>
                </ul>
                <h3>全屏模式</h3>
                <ul>
                    <li>F11 / Ctrl+F：切换全屏</li>
                    <li>ESC：退出全屏</li>
                    <li>点击播放按钮进入演示模式</li>
                </ul>
                <h2>3. 响应式设计</h2>
                <ul>
                    <li>适配桌面、平板、手机等多种设备</li>
                    <li>自动调整字体大小和布局</li>
                    <li>优化触摸交互体验</li>
                </ul>`
            },
            { 
                id: 6, 
                title: "输出结构", 
                content: `<h1>输出结构</h1>
                <h2>生成的文件结构</h2>
                <p>构建完成后，会在指定目录生成以下文件：</p>
                <pre><code>demo-output/
├── index.html          # 演示站点主文件
├── demo-styles.css     # 样式表
├── demo-script.js      # 交互脚本
├── pages/              # 页面目录
│   ├── page1.html
│   ├── page2.html
│   └── ...
├── assets/             # 资源目录
│   ├── css/
│   ├── js/
│   └── images/
└── README.md           # 使用说明</code></pre>
                <h2>文件说明</h2>
                <ul>
                    <li><strong>index.html</strong> - 演示站点入口文件</li>
                    <li><strong>demo-styles.css</strong> - 演示站点样式表</li>
                    <li><strong>demo-script.js</strong> - 演示站点交互脚本</li>
                    <li><strong>pages/</strong> - 各演示页面文件</li>
                    <li><strong>assets/</strong> - 静态资源目录</li>
                </ul>
                <h2>部署说明</h2>
                <p>可以将生成的文件部署到任何静态服务器上，包括 GitHub Pages、Netlify、Vercel 等平台。</p>`
            },
            { 
                id: 7, 
                title: "自定义配置", 
                content: `<h1>自定义配置</h1>
                <h2>修改样式</h2>
                <p>编辑 <code>.asdm/toolsets/demo-builder/templates/demo-styles.css</code> 文件来自定义演示站点的外观。</p>
                <pre><code>/* 示例：修改主题颜色 */
:root {
    --primary-color: #your-color;
    --secondary-color: #your-secondary-color;
}</code></pre>
                <h2>修改模板</h2>
                <p>编辑 <code>.asdm/toolsets/demo-builder/templates/demo-template.html</code> 文件来自定义页面结构。</p>
                <h2>修改交互逻辑</h2>
                <p>编辑 <code>.asdm/toolsets/demo-builder/templates/demo-script.js</code> 文件来自定义交互行为。</p>
                <pre><code>// 示例：添加自定义键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'p') {
        // 自定义功能
    }
});</code></pre>
                <h2>配置选项</h2>
                <ul>
                    <li><strong>主题配置</strong> - 修改颜色、字体、间距等</li>
                    <li><strong>布局配置</strong> - 调整页面结构和布局</li>
                    <li><strong>功能配置</strong> - 启用或禁用特定功能</li>
                </ul>`
            },
            { 
                id: 8, 
                title: "故障排除", 
                content: `<h1>故障排除</h1>
                <h2>常见问题</h2>
                <h3>1. 命令未找到</h3>
                <ul>
                    <li>确保 <code>.codebuddy/commands/asdm-build-demo.md</code> 文件存在</li>
                    <li>检查文件权限</li>
                    <li>重启 CodeBuddy IDE</li>
                </ul>
                <h3>2. Markdown 文件解析失败</h3>
                <ul>
                    <li>确保文件包含至少一个 H1 标题</li>
                    <li>检查文件编码（推荐 UTF-8）</li>
                    <li>验证 Markdown 语法正确性</li>
                </ul>
                <h3>3. 输出目录权限问题</h3>
                <ul>
                    <li>确保对输出目录有写入权限</li>
                    <li>尝试使用不同的输出目录</li>
                    <li>以管理员身份运行命令</li>
                </ul>
                <h2>调试模式</h2>
                <p>添加 <code>--verbose</code> 参数获取详细日志：</p>
                <pre><code>node .asdm/toolsets/demo-builder/scripts/build-demo.js file.md --verbose</code></pre>`
            },
            { 
                id: 9, 
                title: "示例演示", 
                content: `<h1>示例演示</h1>
                <h2>快速开始</h2>
                <p>工具集包含一个完整的示例文件，可以立即测试：</p>
                <pre><code># 构建示例演示
node .asdm/toolsets/demo-builder/scripts/build-demo.js .asdm/toolsets/demo-builder/examples/sample-demo.md

# 在浏览器中打开演示
open demo-output/index.html</code></pre>
                <h2>使用 CodeBuddy 命令</h2>
                <pre><code># 使用示例文件构建演示
/asdm-build-demo .asdm/toolsets/demo-builder/examples/sample-demo.md

# 预览生成的演示
/asdm-preview-demo</code></pre>
                <h2>创建自定义演示</h2>
                <p>基于自己的 Markdown 文件创建演示：</p>
                <pre><code># 1. 准备 Markdown 文件
# 2. 确保包含 H1 标题
# 3. 运行构建命令
/asdm-build-demo ./your-file.md

# 4. 自定义演示
/asdm-customize-demo</code></pre>
                <h2>最佳实践</h2>
                <ul>
                    <li>使用清晰的 H1 标题结构</li>
                    <li>保持内容简洁明了</li>
                    <li>添加代码示例和截图</li>
                    <li>测试所有交互功能</li>
                </ul>`
            },
            { 
                id: 10, 
                title: "技术架构", 
                content: `<h1>技术架构</h1>
                <h2>构建流程</h2>
                <ol>
                    <li><strong>解析阶段</strong>：读取并解析 Markdown 文件结构</li>
                    <li><strong>模板渲染</strong>：根据模板生成 HTML 页面</li>
                    <li><strong>资源复制</strong>：复制 CSS 和 JavaScript 文件</li>
                    <li><strong>输出生成</strong>：创建完整的演示站点</li>
                </ol>
                <h2>前端技术</h2>
                <ul>
                    <li><strong>HTML5</strong>：语义化标记</li>
                    <li><strong>CSS3</strong>：现代样式和动画</li>
                    <li><strong>JavaScript ES6+</strong>：交互功能</li>
                    <li><strong>响应式设计</strong>：移动端适配</li>
                </ul>
                <h2>扩展开发</h2>
                <h3>添加新功能</h3>
                <ol>
                    <li>修改对应的模板文件</li>
                    <li>更新构建脚本以支持新功能</li>
                    <li>测试确保兼容性</li>
                </ol>
                <h3>集成到工作流</h3>
                <p>可以将 Demo Builder 集成到：</p>
                <ul>
                    <li>CI/CD 流水线</li>
                    <li>文档生成流程</li>
                    <li>自动化部署系统</li>
                </ul>
                <h2>支持与反馈</h2>
                <p>如遇到问题或需要新功能，请联系 ASDM 工具集维护团队。</p>`
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPagesGrid();
        this.updateProgress();
    }

    setupEventListeners() {
        // 播放按钮
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.enterPresentationMode());
        }

        // 退出演示按钮
        const exitBtn = document.getElementById('exitPresentation');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exitPresentationMode());
        }

        // 导航按钮
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousPage());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

        // 键盘导航
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // 全屏变化监听
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    }

    renderPagesGrid() {
        const grid = document.getElementById('pagesGrid');
        if (!grid) return;

        grid.innerHTML = this.pages.map(page => `
            <div class="page-card" data-page="${page.id}">
                <h3>${page.title}</h3>
                <p>第 ${page.id} 页 - 点击查看详情</p>
            </div>
        `).join('');

        // 添加页面点击事件
        grid.querySelectorAll('.page-card').forEach(card => {
            card.addEventListener('click', () => {
                const pageId = parseInt(card.dataset.page);
                this.goToPage(pageId);
            });
        });
    }

    enterPresentationMode() {
        const modal = document.getElementById('presentationModal');
        if (!modal) return;

        modal.classList.remove('hidden');
        this.currentPage = 1;
        this.loadPageContent();
        
        // 进入全屏模式
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }

    exitPresentationMode() {
        const modal = document.getElementById('presentationModal');
        if (!modal) return;

        modal.classList.add('hidden');
        
        // 退出全屏模式
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    handleFullscreenChange() {
        const modal = document.getElementById('presentationModal');
        if (!modal) return;

        if (!document.fullscreenElement) {
            modal.classList.add('hidden');
        }
    }

    handleKeyboard(event) {
        const modal = document.getElementById('presentationModal');
        if (!modal || modal.classList.contains('hidden')) return;

        switch(event.key) {
            case 'ArrowLeft':
            case 'PageUp':
                event.preventDefault();
                this.previousPage();
                break;
                
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                event.preventDefault();
                this.nextPage();
                break;
                
            case 'Escape':
                event.preventDefault();
                this.exitPresentationMode();
                break;
                
            case 'Home':
                event.preventDefault();
                this.goToPage(1);
                break;
                
            case 'End':
                event.preventDefault();
                this.goToPage(this.totalPages);
                break;
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.currentPage = pageNumber;
            this.loadPageContent();
            this.updateProgress();
        }
    }

    loadPageContent() {
        const contentElement = document.getElementById('presentationContent');
        const titleElement = document.getElementById('presentationTitle');
        
        if (!contentElement || !titleElement) return;

        const currentPage = this.pages.find(page => page.id === this.currentPage);
        if (!currentPage) return;

        // 更新标题
        titleElement.textContent = currentPage.title;

        // 直接使用内嵌的页面内容
        contentElement.innerHTML = `<div class="page-content">${currentPage.content}</div>`;

        // 更新导航按钮状态
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages;
        }
    }

    updateProgress() {
        // 更新首页进度条
        const progressFill = document.getElementById('progressFill');
        const currentPageElement = document.getElementById('currentPage');
        const totalPagesElement = document.getElementById('totalPages');
        
        if (progressFill) {
            const progress = (this.currentPage / this.totalPages) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        if (currentPageElement) {
            currentPageElement.textContent = this.currentPage;
        }
        
        if (totalPagesElement) {
            totalPagesElement.textContent = this.totalPages;
        }

        // 更新演示模式进度
        const presentationCurrent = document.getElementById('presentationCurrent');
        const presentationTotal = document.getElementById('presentationTotal');
        
        if (presentationCurrent) {
            presentationCurrent.textContent = this.currentPage;
        }
        
        if (presentationTotal) {
            presentationTotal.textContent = this.totalPages;
        }
    }
}

// 初始化导航系统
document.addEventListener('DOMContentLoaded', () => {
    new DemoNavigation();
});