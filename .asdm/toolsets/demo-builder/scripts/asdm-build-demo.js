#!/usr/bin/env node

/**
 * ASDM Demo Builder - Command Line Interface
 * Main entry point for the demo builder toolset
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class DemoBuilderCLI {
    constructor() {
        this.scriptPath = path.join(__dirname, 'build-demo.js');
    }

    showUsage() {
        console.log(`
ASDM Demo Builder - Convert markdown to interactive demo sites

Usage:
  asdm-build-demo <markdown-file> [options]

Options:
  -o, --output <dir>    Output directory (default: demo-output)
  -t, --title <title>   Demo title (default: ASDM Demo)
  -h, --help           Show this help message
  -v, --version        Show version information

Examples:
  asdm-build-demo ./README.md
  asdm-build-demo presentation.md -o my-demo -t "My Presentation"
  asdm-build-demo --help

Features:
  • Automatic page generation from H1 headings
  • Keyboard navigation (left/right arrows)
  • Full-screen presentation mode
  • Responsive design for all devices
  • Touch support for mobile devices

Keyboard shortcuts in demo:
  • Left arrow / PageUp: Previous page
  • Right arrow / PageDown / Space: Next page
  • Home: First page
  • End: Last page
  • F11 / Ctrl+F: Toggle fullscreen
  • ESC: Exit fullscreen
        `);
    }

    showVersion() {
        const packagePath = path.join(__dirname, '..', 'package.json');
        if (fs.existsSync(packagePath)) {
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            console.log(`ASDM Demo Builder v${pkg.version}`);
        } else {
            console.log('ASDM Demo Builder v0.0.1');
        }
    }

    validateNodeVersion() {
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
        
        if (majorVersion < 12) {
            console.error(`Error: Node.js version ${nodeVersion} is not supported.`);
            console.error('Please upgrade to Node.js 12.0.0 or later.');
            process.exit(1);
        }
    }

    async executeBuild(args) {
        return new Promise((resolve, reject) => {
            const buildProcess = spawn('node', [this.scriptPath, ...args], {
                stdio: 'inherit',
                shell: true
            });

            buildProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Build process exited with code ${code}`));
                }
            });

            buildProcess.on('error', (error) => {
                reject(error);
            });
        });
    }

    async run() {
        const args = process.argv.slice(2);

        // Handle help and version flags
        if (args.includes('--help') || args.includes('-h') || args.length === 0) {
            this.showUsage();
            return;
        }

        if (args.includes('--version') || args.includes('-v')) {
            this.showVersion();
            return;
        }

        // Validate Node.js version
        this.validateNodeVersion();

        // Validate script exists
        if (!fs.existsSync(this.scriptPath)) {
            console.error(`Error: Build script not found at ${this.scriptPath}`);
            console.error('Please ensure the Demo Builder toolset is properly installed.');
            process.exit(1);
        }

        try {
            await this.executeBuild(args);
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const cli = new DemoBuilderCLI();
    cli.run().catch(error => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = DemoBuilderCLI;