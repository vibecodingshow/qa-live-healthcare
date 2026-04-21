# ASDM Toolset - Demo Builder

toolset-id: demo-builder
toolset-name: Demo Builder
version: 0.0.1
updated-date: 2026-04-21
toolset-description: A toolset for building interactive demo sites from markdown files.

## Overview

Demo Builder (toolset-id `demo-builder`) is a toolset for building interactive demo sites from markdown files. It converts markdown content into a full-screen presentation website with navigation controls.

User can install this `toolset` into a workspace and run `INSTALL.md` document using `AI Guided Installation` to initialize the toolset for the workspace. Just simply copy and paste the following prompt into your `AI Coding` tool's chat window and hit enter:

```shell
Follow instructions in .asdm/toolsets/demo-builder/INSTALL.md
```

## Features

Main features of Demo Builder:

- Convert markdown files into interactive demo sites
- Support full-screen presentation mode
- Automatic page generation based on markdown headings (H1 as pages, H2/H3 as content)
- Keyboard navigation (left/right arrows for page switching)
- Play button to enter full-screen mode
- Responsive design for different screen sizes

## Toolset Installation Process

`INSTALL.md` will setup the toolset with the following steps:

- Create `.asdm/demo-builder` directory for Demo Builder's workspace
- Create shortcuts commands for `Demo Builder` in provider's entry point
- Setup the demo site template and build scripts

## Toolset Workflow

Once `Demo Builder` is installed, user can use the following commands to build demo sites:

- `/asdm-build-demo <markdown-file>`: build a demo site from a markdown file

Usage example:
```shell
/asdm-build-demo ./README.md
```

## Toolset Structure

The structure of the toolset is as follows:

```
.asdm/toolsets/demo-builder/
├── INSTALL.md                          ## Installation instructions for the toolset
├── README.md                           ## Current document
├── actions                             ## Instructions for Demo Builder
│   ├── asdm-build-demo.md              ## Instruction for building demo sites
├── templates                           ## Demo site templates
│   ├── demo-template.html              ## Main demo template
│   ├── demo-script.js                  ## Demo site JavaScript
│   └── demo-styles.css                 ## Demo site CSS styles
├── scripts                             ## Build scripts
│   ├── build-demo.js                   ## Demo site builder script
└── examples                            ## Example markdown files
    └── sample-demo.md                  ## Sample markdown for testing
```

## Demo Site Features

- **Page Structure**: Each H1 heading becomes a separate demo page
- **Content Organization**: H2/H3 headings become content sections within pages
- **Navigation**: Left/right arrow keys for page navigation
- **Full-screen Mode**: Play button to enter full-screen presentation mode
- **Responsive Design**: Works on desktop and mobile devices

## Copyright & License

Copyright (c) 2026 LeansoftX.com & iSoftStone. All rights reserved.

Licensed under the PROPRIETARY SOFTWARE LICENSE.