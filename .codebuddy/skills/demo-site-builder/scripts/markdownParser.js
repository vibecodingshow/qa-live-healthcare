/**
 * Markdown解析脚本
 * 用于解析Markdown文件并生成结构化数据
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析Markdown内容
 * @param {string} content - Markdown文本内容
 * @returns {Object} 解析结果
 */
function parseMarkdown(content) {
  const lines = content.split('\n');
  const pages = [];
  let currentPage = null;
  let currentContent = [];
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber++;
    
    // 检测一级标题（页面分隔）
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      // 保存之前的页面
      if (currentPage && currentPage.title) {
        pages.push({
          ...currentPage,
          content: currentContent.join('\n').trim()
        });
      }
      
      // 开始新页面
      currentPage = {
        id: `page-${pages.length + 1}`,
        title: h1Match[1],
        level: 1,
        lineNumber,
        children: []
      };
      currentContent = [];
      continue;
    }

    // 检测二级标题
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      currentContent.push(line);
      continue;
    }

    // 检测三级标题
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      currentContent.push(line);
      continue;
    }

    // 检测代码块
    if (line.startsWith('```')) {
      currentContent.push(line);
      continue;
    }

    // 检测列表项
    const listMatch = line.match(/^[\-\*\+]\s+(.+)$/);
    if (listMatch) {
      currentContent.push(line);
      continue;
    }

    // 检测有序列表
    const orderedListMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedListMatch) {
      currentContent.push(line);
      continue;
    }

    // 检测表格行
    if (line.startsWith('|') && line.endsWith('|')) {
      currentContent.push(line);
      continue;
    }

    // 其他内容
    currentContent.push(line);
  }

  // 保存最后一页
  if (currentPage && currentPage.title) {
    pages.push({
      ...currentPage,
      content: currentContent.join('\n').trim()
    });
  }

  return {
    metadata: {
      title: pages[0]?.title || '未命名演示',
      pageCount: pages.length,
      parseTime: new Date().toISOString(),
      version: '1.0.0'
    },
    pages
  };
}

/**
 * 将Markdown转换为HTML
 * @param {string} content - Markdown内容
 * @returns {string} HTML内容
 */
function markdownToHtml(content) {
  let html = content;

  // 标题转换
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 列表转换
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // 代码块转换
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 链接转换
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 粗体和斜体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 段落转换
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // 清理空段落
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

/**
 * 生成目录结构
 * @param {Array} pages - 页面数组
 * @returns {Array} 目录项数组
 */
function generateTableOfContents(pages) {
  return pages.map((page, index) => ({
    id: page.id,
    title: page.title,
    level: page.level,
    index
  }));
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('用法: node markdownParser.js <markdown文件路径> [输出文件路径]');
    console.log('');
    console.log('示例:');
    console.log('  node markdownParser.js ./README.md');
    console.log('  node markdownParser.js ./README.md ./structure.json');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1] || null;

  try {
    // 读取文件
    if (!fs.existsSync(inputPath)) {
      console.error(`错误: 文件 ${inputPath} 不存在`);
      process.exit(1);
    }

    const content = fs.readFileSync(inputPath, 'utf-8');

    // 解析Markdown
    const result = parseMarkdown(content);
    const toc = generateTableOfContents(result.pages);

    // 输出结果
    const output = {
      ...result,
      tableOfContents: toc
    };

    if (outputPath) {
      // 输出到文件
      const format = path.extname(outputPath).toLowerCase();
      
      if (format === '.json') {
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
      } else if (format === '.yaml' || format === '.yml') {
        // 简单的YAML转换
        let yaml = '';
        yaml += `metadata:\n`;
        yaml += `  title: "${result.metadata.title}"\n`;
        yaml += `  pageCount: ${result.metadata.pageCount}\n`;
        yaml += `  parseTime: "${result.metadata.parseTime}"\n`;
        yaml += `\npages:\n`;
        
        result.pages.forEach(page => {
          yaml += `  - id: "${page.id}"\n`;
          yaml += `    title: "${page.title}"\n`;
          yaml += `    level: ${page.level}\n`;
          yaml += `    lineNumber: ${page.lineNumber}\n`;
        });
        
        fs.writeFileSync(outputPath, yaml, 'utf-8');
      } else {
        // 默认输出JSON
        fs.writeFileSync(outputPath + '.json', JSON.stringify(output, null, 2), 'utf-8');
      }
      
      console.log(`✓ 解析完成，已保存到 ${outputPath}`);
    } else {
      // 输出到控制台
      console.log(JSON.stringify(output, null, 2));
    }

    console.log(`\n解析结果:`);
    console.log(`  标题: ${result.metadata.title}`);
    console.log(`  页面数: ${result.metadata.pageCount}`);
    console.log(`  解析时间: ${result.metadata.parseTime}`);

  } catch (error) {
    console.error('解析失败:', error.message);
    process.exit(1);
  }
}

// 导出函数供其他模块使用
module.exports = {
  parseMarkdown,
  markdownToHtml,
  generateTableOfContents
};

// 如果是直接运行脚本
if (require.main === module) {
  main();
}
