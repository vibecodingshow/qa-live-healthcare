# Presentation Builder Toolset Installation

**Toolset ID:** `presentation-builder`

## Overview
This document provides instructions for installing and setting up the Presentation Builder toolset. Presentation Builder helps convert Markdown files into fullscreen presentation sites with keyboard navigation and slide management.

## AI Guided Installation
To install this toolset using AI Guided Installation, copy and paste the following prompt into your AI Coding tool's chat window:

```shell
Follow instructions in .asdm/toolsets/presentation-builder/INSTALL.md
```

## Installation Steps

### 1. Create `.asdm/toolsets/presentation-builder` directory

The directory structure should already exist. Verify:

```bash
ls -la .asdm/toolsets/presentation-builder/
```

Expected structure:
```
.asdm/toolsets/presentation-builder/
├── actions/           # Command instruction files
├── specs/             # Specification documents
├── templates/          # Presentation site templates
└── INSTALL.md         # This file
```

### 2. Detect the current `Agentic Engine` provider

Detect the current AI coding assistant provider:

- If `.claude` directory exists → use `Claude Code`
- If `.github` directory exists → use `GitHub Copilot`
- If `.codebuddy` directory exists → use `Tencent CodeBuddy`
- Otherwise → prompt user to select manually

### 3. Create shortcut commands for Presentation Builder

#### For Claude Code (`.claude/commands/`):

```bash
mkdir -p .claude/commands/

# Build Demo command
cat > .claude/commands/asdm-build-demo.md << 'EOF'
---
description: "Build a presentation site from Markdown"
argument-hint: "[markdown file path]"
---

EOF
cat .asdm/toolsets/presentation-builder/actions/asdm-build-demo.md >> .claude/commands/asdm-build-demo.md
```

#### For GitHub Copilot (`.github/prompts/`):

```bash
mkdir -p .github/prompts/

# Build Demo prompt
cat > .github/prompts/asdm-build-demo.prompt.md << 'EOF'
---
agent: 'agent'
description: 'Build a presentation site from Markdown'
argument-hint: 'Enter markdown file path'
---

EOF
cat .asdm/toolsets/presentation-builder/actions/asdm-build-demo.md >> .github/prompts/asdm-build-demo.prompt.md
```

#### For Tencent CodeBuddy (`.codebuddy/commands/`):

```bash
mkdir -p .codebuddy/commands/

# Copy instruction files directly
cp .asdm/toolsets/presentation-builder/actions/asdm-build-demo.md .codebuddy/commands/
```

### 4. Manual Usage for Other Providers

Directly use the instruction files by copying their paths:

1. Navigate to: `.asdm/toolsets/presentation-builder/actions/`
2. Use the instruction file: `asdm-build-demo.md`

## Initializing Presentation Builder

### Building a Demo

```shell
Follow the instructions in .asdm/toolsets/presentation-builder/actions/asdm-build-demo.md
```

This will:
1. Read the input Markdown file
2. Parse content by `#` headings (each H1 = one slide)
3. Generate a `presentation-site/` directory with:
   - `index.html` - File selector
   - `demo.html` - Presentation viewer
   - `style.css` - Styles
   - `script.js` - JavaScript logic

## Template Files

The toolset includes the following templates in `templates/`:

| File | Description |
|------|-------------|
| `index.html` | Landing page with file selector |
| `demo.html` | Fullscreen presentation viewer |
| `style.css` | Presentation styles |
| `script.js` | Navigation and rendering logic |

## Markdown Syntax

```
# Slide 1 Title          → New slide

## Section Title          → Content heading

Content here with **bold** and *italic* formatting

---

# Slide 2 Title          → Another new slide
```

## Verification

After installation, verify:

1. Template files exist in `.asdm/toolsets/presentation-builder/templates/`
2. Command file exists in `.codebuddy/commands/asdm-build-demo.md`
3. Run: `/asdm-build-demo` to test

## Usage Examples

### Build a Presentation

```shell
# Using slash command
/asdm-build-demo README.md

# Using prompt
Follow the instructions in .asdm/toolsets/presentation-builder/actions/asdm-build-demo.md
```

### Manual Build

```bash
# Copy templates to output directory
mkdir -p presentation-site/
cp .asdm/toolsets/presentation-builder/templates/* presentation-site/

# Edit index.html to load your markdown
```

## Features

| Feature | Description |
|---------|-------------|
| Fullscreen Mode | Click play button or press F |
| Keyboard Navigation | ← → arrow keys |
| Mouse Wheel | Scroll to navigate |
| Touch Support | Swipe left/right on mobile |
| Progress Bar | Visual slide progress |
| Markdown Parsing | Support for headings, lists, code blocks, tables |

## Notes

- This toolset is frontend-only (pure HTML/CSS/JS)
- No server required - works directly in browser
- Uses `marked.js` CDN for Markdown parsing
- All data stored in `localStorage`

## Getting Help

- ASDM Documentation: https://asdm.ai/docs
- Toolset README: `.asdm/toolsets/presentation-builder/README.md`

## License
Copyright (c) 2026 LeansoftX.com & iSoftStone. All rights reserved.

---

*This installation document is part of the Presentation Builder toolset.*
