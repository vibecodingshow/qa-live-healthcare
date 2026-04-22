#!/usr/bin/env node

/**
 * ASDM Demo Builder - Build Script
 * Converts markdown files into interactive demo sites
 */

const fs = require('fs');
const path = require('path');

class DemoBuilder {
    constructor() {
        this.inputFile = '';
        this.outputDir = 'demo-output';
        this.title = 'ASDM Demo';
        this.pages = [];
    }

    parseArguments() {
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            this.showUsage();
            process.exit(1);
        }

        this.inputFile = args[0];
        
        // Parse optional arguments
        for (let i = 1; i < args.length; i++) {
            const arg = args[i];
            if (arg === '--output' || arg === '-o') {
                this.outputDir = args[++i];
            } else if (arg === '--title' || arg === '-t') {
                this.title = args[++i];
            } else if (arg === '--help' || arg === '-h') {
                this.showUsage();
                process.exit(0);
            }
        }

        // Validate input file
        if (!fs.existsSync(this.inputFile)) {
            console.error(`Error: Input file '${this.inputFile}' not found`);
            process.exit(1);
        }
    }

    showUsage() {
        console.log(`
ASDM Demo Builder - Convert markdown to interactive demo sites

Usage:
  node build-demo.js <markdown-file> [options]

Options:
  -o, --output <dir>    Output directory (default: demo-output)
  -t, --title <title>   Demo title (default: ASDM Demo)
  -h, --help           Show this help message

Examples:
  node build-demo.js ./README.md
  node build-demo.js presentation.md -o my-demo -t "My Presentation"
  node build-demo.js --help
        `);
    }

    parseMarkdown(content) {
        const lines = content.split('\n');
        const pages = [];
        let currentPage = null;
        let currentSection = null;
        let currentSubsection = null;

        for (const line of lines) {
            // Check for H1 headings (pages)
            const h1Match = line.match(/^#\s+(.+)$/);
            if (h1Match) {
                if (currentPage) {
                    pages.push(currentPage);
                }
                currentPage = {
                    title: h1Match[1].trim(),
                    sections: []
                };
                currentSection = null;
                currentSubsection = null;
                continue;
            }

            // Check for H2 headings (sections)
            const h2Match = line.match(/^##\s+(.+)$/);
            if (h2Match && currentPage) {
                currentSection = {
                    title: h2Match[1].trim(),
                    content: [],
                    subsections: []
                };
                currentPage.sections.push(currentSection);
                currentSubsection = null;
                continue;
            }

            // Check for H3 headings (subsections)
            const h3Match = line.match(/^###\s+(.+)$/);
            if (h3Match && currentSection) {
                currentSubsection = {
                    title: h3Match[1].trim(),
                    content: []
                };
                currentSection.subsections.push(currentSubsection);
                continue;
            }

            // Process content lines
            if (line.trim() && !line.match(/^#+\s/)) {
                const processedLine = this.processMarkdownLine(line);
                
                if (currentSubsection) {
                    currentSubsection.content.push(processedLine);
                } else if (currentSection) {
                    currentSection.content.push(processedLine);
                } else if (currentPage) {
                    // Content at page level (before any sections)
                    if (!currentPage.content) {
                        currentPage.content = [];
                    }
                    currentPage.content.push(processedLine);
                }
            }
        }

        // Add the last page
        if (currentPage) {
            pages.push(currentPage);
        }

        return pages;
    }

    processMarkdownLine(line) {
        // Simple markdown to HTML conversion
        return line.trim()
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    }

    createOutputDirectory() {
        if (fs.existsSync(this.outputDir)) {
            console.log(`Cleaning output directory: ${this.outputDir}`);
            fs.rmSync(this.outputDir, { recursive: true });
        }
        
        fs.mkdirSync(this.outputDir, { recursive: true });
        console.log(`Created output directory: ${this.outputDir}`);
    }

    copyTemplateFiles() {
        const templateDir = path.join(__dirname, '..', 'templates');
        const files = ['demo-styles.css', 'demo-script.js'];
        
        for (const file of files) {
            const source = path.join(templateDir, file);
            const destination = path.join(this.outputDir, file);
            
            if (fs.existsSync(source)) {
                fs.copyFileSync(source, destination);
                console.log(`Copied: ${file}`);
            } else {
                console.warn(`Warning: Template file not found: ${file}`);
            }
        }
    }

    generateHTML(pages) {
        const templatePath = path.join(__dirname, '..', 'templates', 'demo-template.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Replace template variables
        template = template.replace(/\{\{title\}\}/g, this.title);
        template = template.replace(/\{\{totalPages\}\}/g, pages.length);
        
        // Generate pages HTML
        let pagesHTML = '';
        pages.forEach((page, index) => {
            let sectionsHTML = '';
            
            page.sections.forEach(section => {
                let subsectionsHTML = '';
                
                section.subsections.forEach(subsection => {
                    subsectionsHTML += `
                    <div class="subsection">
                        <h3 class="subsection-title">${subsection.title}</h3>
                        <div class="subsection-content">
                            ${subsection.content.map(content => `<p>${content}</p>`).join('')}
                        </div>
                    </div>`;
                });
                
                sectionsHTML += `
                <section class="content-section">
                    <h2 class="section-title">${section.title}</h2>
                    <div class="section-content">
                        ${section.content.map(content => `<p>${content}</p>`).join('')}
                        ${subsectionsHTML}
                    </div>
                </section>`;
            });
            
            pagesHTML += `
            <div class="slide" data-page="${index}">
                <div class="slide-content">
                    <h1 class="slide-title">${page.title}</h1>
                    <div class="slide-body">
                        ${sectionsHTML}
                    </div>
                </div>
            </div>`;
        });
        
        template = template.replace(/\{\{#pages\}\}([\s\S]*?)\{\{\/pages\}\}/g, pagesHTML);
        
        return template;
    }

    generateIndexFile(pages) {
        const htmlContent = this.generateHTML(pages);
        const indexPath = path.join(this.outputDir, 'index.html');
        
        fs.writeFileSync(indexPath, htmlContent);
        console.log(`Generated: index.html`);
    }

    generateReadme() {
        const readmeContent = `# ASDM Demo Site

This demo site was generated using the ASDM Demo Builder toolset.

## Features

- Interactive presentation mode
- Keyboard navigation (left/right arrows)
- Full-screen support
- Responsive design

## Usage

1. Open \`index.html\` in your web browser
2. Use the navigation buttons or keyboard shortcuts:
   - Left arrow / PageUp: Previous page
   - Right arrow / PageDown / Space: Next page
   - F11: Toggle fullscreen
   - ESC: Exit fullscreen

## Source

Generated from: ${path.basename(this.inputFile)}
Build date: ${new Date().toISOString()}
`;
        
        const readmePath = path.join(this.outputDir, 'README.md');
        fs.writeFileSync(readmePath, readmeContent);
        console.log(`Generated: README.md`);
    }

    async build() {
        console.log(`ASDM Demo Builder - Building demo site...`);
        console.log(`Input file: ${this.inputFile}`);
        console.log(`Output directory: ${this.outputDir}`);
        console.log(`Title: ${this.title}`);
        console.log('');

        try {
            // Read and parse markdown
            const markdownContent = fs.readFileSync(this.inputFile, 'utf8');
            this.pages = this.parseMarkdown(markdownContent);
            
            console.log(`Parsed ${this.pages.length} pages from markdown`);
            
            // Create output structure
            this.createOutputDirectory();
            this.copyTemplateFiles();
            this.generateIndexFile(this.pages);
            this.generateReadme();
            
            console.log('');
            console.log('Demo site built successfully!');
            console.log(`Open ${this.outputDir}/index.html in your browser to view the demo.`);
            console.log('');
            
            // Show summary
            this.showSummary();
            
        } catch (error) {
            console.error('Error building demo site:', error.message);
            process.exit(1);
        }
    }

    showSummary() {
        console.log('Demo Summary:');
        console.log('┌' + '─'.repeat(50) + '┐');
        
        this.pages.forEach((page, index) => {
            console.log(`│ Page ${index + 1}: ${page.title}`);
            
            page.sections.forEach(section => {
                console.log(`│   ├─ ${section.title}`);
                
                section.subsections.forEach(subsection => {
                    console.log(`│   │  └─ ${subsection.title}`);
                });
            });
            
            if (index < this.pages.length - 1) {
                console.log('│');
            }
        });
        
        console.log('└' + '─'.repeat(50) + '┘');
    }
}

// Main execution
if (require.main === module) {
    const builder = new DemoBuilder();
    builder.parseArguments();
    builder.build();
}

module.exports = DemoBuilder;