# ASDM Demo Builder - Build Demo Action

## Description

This action builds an interactive demo site from a markdown file using the ASDM Demo Builder toolset.

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
# Basic usage
/asdm-build-demo ./README.md

# Custom output directory and title
/asdm-build-demo presentation.md -o my-demo -t "My Presentation"

# Show help
/asdm-build-demo --help
```

## Features

The demo site includes:

- **Automatic Page Generation**: Each H1 heading becomes a separate demo page
- **Content Organization**: H2 headings become sections, H3 headings become subsections
- **Interactive Navigation**: Left/right arrow keys for page switching
- **Full-screen Mode**: Play button to enter full-screen presentation
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Indicator**: Visual progress bar showing current position

## Output Structure

After building, the demo site will be created in the specified output directory:

```
demo-output/
├── index.html          # Main demo site
├── demo-styles.css     # Demo styles
├── demo-script.js      # Demo JavaScript
└── README.md           # Usage instructions
```

## Keyboard Shortcuts

- **Left Arrow / PageUp**: Previous page
- **Right Arrow / PageDown / Space**: Next page
- **Home**: First page
- **End**: Last page
- **F11 / Ctrl+F**: Toggle fullscreen
- **ESC**: Exit fullscreen

## Implementation Details

### Markdown Parsing

- H1 headings (`# Title`) → Demo pages
- H2 headings (`## Section`) → Content sections
- H3 headings (`### Subsection`) → Subsections
- Regular text → Paragraph content

### Template System

The demo site uses a template-based approach with:

- HTML template with placeholders for dynamic content
- CSS styles for responsive design and animations
- JavaScript for interactive functionality

### Build Process

1. Parse markdown file and extract structure
2. Generate HTML pages based on template
3. Copy supporting files (CSS, JS)
4. Create output directory with demo site

## Error Handling

- Validates input file existence
- Handles malformed markdown gracefully
- Provides clear error messages
- Creates backup of existing output directory

## Integration

This action can be integrated with:

- CI/CD pipelines for automated demo generation
- Documentation workflows
- Presentation preparation tools
- Training material creation

## Dependencies

- Node.js (for build script execution)
- File system access
- Markdown file input

## Testing

Test with the provided sample markdown file:

```shell
/asdm-build-demo .asdm/demo-builder/examples/sample-demo.md
```

## Troubleshooting

### Common Issues

1. **File not found**: Ensure the markdown file path is correct
2. **Permission denied**: Check write permissions for output directory
3. **Empty demo**: Verify markdown file contains H1 headings

### Debug Mode

Add `--verbose` flag for detailed logging (if supported by implementation).

## Support

For issues or feature requests, contact the ASDM Demo Builder toolset maintainers.