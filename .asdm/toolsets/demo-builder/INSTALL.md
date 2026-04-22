# Demo Builder Toolset - Installation Guide

## Overview

This document provides instructions for installing the Demo Builder toolset into your workspace. The Demo Builder toolset allows you to create interactive demo sites from markdown files.

## Installation Steps

### 1. Create Demo Builder Workspace Directory

Create the necessary directory structure for the Demo Builder toolset:

```bash
mkdir -p .asdm/demo-builder/templates
mkdir -p .asdm/demo-builder/scripts
mkdir -p .asdm/demo-builder/actions
mkdir -p .asdm/demo-builder/examples
```

### 2. Create Toolset Configuration Files

Copy the toolset configuration files to the appropriate locations:

- `README.md` → `.asdm/toolsets/demo-builder/README.md`
- `INSTALL.md` → `.asdm/toolsets/demo-builder/INSTALL.md`
- Template files → `.asdm/demo-builder/templates/`
- Script files → `.asdm/demo-builder/scripts/`
- Action files → `.asdm/demo-builder/actions/`

### 3. Create CodeBuddy Commands (if using CodeBuddy)

Create a commands directory for CodeBuddy integration:

```bash
mkdir -p .codebuddy/commands
```

Create the demo builder command file:

```bash
cat > .codebuddy/commands/asdm-build-demo.md << 'EOF'
# ASDM Demo Builder Command

## Description
Build an interactive demo site from a markdown file.

## Usage
```shell
/asdm-build-demo <markdown-file>
```

## Parameters
- `<markdown-file>`: Path to the markdown file to convert into a demo site

## Examples
```shell
/asdm-build-demo ./README.md
/asdm-build-demo ./docs/presentation.md
```

## Output
Creates a demo site in the `demo-output` directory with the following features:
- Full-screen presentation mode
- Keyboard navigation (left/right arrows)
- Automatic page generation from H1 headings
- Responsive design

## Implementation
This command uses the Demo Builder toolset to parse markdown and generate an interactive demo site.
EOF
```

### 4. Verify Installation

To verify the installation, run:

```shell
ls -la .asdm/toolsets/demo-builder/
ls -la .asdm/demo-builder/
ls -la .codebuddy/commands/asdm-build-demo.md
```

### 5. Test the Toolset

Create a sample markdown file to test the demo builder:

```bash
cat > .asdm/demo-builder/examples/sample-demo.md << 'EOF'
# Introduction to ASDM

Welcome to the ASDM Demo Builder toolset.

## What is ASDM?

ASDM is a powerful framework for building AI-assisted development tools.

## Features

- Markdown to demo conversion
- Interactive presentation mode
- Keyboard navigation

# Getting Started

## Installation

Follow the installation guide to set up the toolset.

## Usage

Use the `/asdm-build-demo` command to create demo sites.

# Advanced Features

## Customization

Customize the demo template to match your branding.

## Integration

Integrate with existing CI/CD pipelines.
EOF
```

Test the demo builder:

```shell
/asdm-build-demo .asdm/demo-builder/examples/sample-demo.md
```

## Uninstallation

To uninstall the Demo Builder toolset:

```bash
rm -rf .asdm/demo-builder/
rm -f .codebuddy/commands/asdm-build-demo.md
```

## Troubleshooting

### Common Issues

1. **Command not found**: Ensure the command file is in the correct location
2. **Permission denied**: Check file permissions for the demo-builder directory
3. **Markdown parsing errors**: Verify the markdown file is valid

### Support

For support, refer to the toolset documentation or contact the toolset maintainers.