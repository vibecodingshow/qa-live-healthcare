# ASDM Demo Builder Command

## Description
Build an interactive demo site from a markdown file.

## Usage
```shell
/asdm-build-demo <markdown-file>
```

## Parameters
- `<markdown-file>`: Path to the markdown file to convert into a demo site

## Options
- `--output, -o <directory>`: Output directory (default: demo-output)
- `--title, -t <title>`: Demo title (default: ASDM Demo)
- `--help, -h`: Show help message

## Examples
```shell
/asdm-build-demo ./README.md
/asdm-build-demo ./docs/presentation.md -o my-demo -t "My Presentation"
/asdm-build-demo --help
```

## Output
Creates a demo site in the specified output directory with the following features:
- Full-screen presentation mode
- Keyboard navigation (left/right arrows)
- Automatic page generation from H1 headings
- Responsive design
- Progress indicator

## Implementation
This command uses the ASDM Demo Builder toolset to parse markdown and generate an interactive demo site.

## Keyboard Shortcuts in Demo
- **Left Arrow / PageUp**: Previous page
- **Right Arrow / PageDown / Space**: Next page
- **Home**: First page
- **End**: Last page
- **F11 / Ctrl+F**: Toggle fullscreen
- **ESC**: Exit fullscreen

## Features
- **Automatic Structure**: H1 headings become pages, H2/H3 become content sections
- **Interactive Navigation**: Click buttons or use keyboard shortcuts
- **Responsive Design**: Works on desktop and mobile devices
- **Full-screen Mode**: Professional presentation experience
- **Touch Support**: Swipe gestures on mobile devices

## Requirements
- Node.js environment for build script execution
- Valid markdown file with H1 headings
- Write permissions for output directory

## Troubleshooting
If the command fails, check:
- Markdown file exists and is accessible
- Output directory has write permissions
- Markdown file contains at least one H1 heading