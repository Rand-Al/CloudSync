# CloudSync Theme - Claude Code Development Guide

## Project Overview
Modern WordPress SaaS landing page theme with comprehensive Customizer integration, Gutenberg support, and modular architecture.

## Development Commands

### Testing & Validation
- **Lint CSS**: `stylelint assets/css/**/*.css`
- **Lint JavaScript**: `eslint assets/js/*.js` 
- **WordPress PHP Standards**: `phpcs --standard=WordPress .`

### Build & Deployment
- **Minify CSS**: `cleancss -o style.min.css style.css`
- **Minify JS**: `uglifyjs assets/js/theme.js -o assets/js/theme.min.js`

### Git Workflow
- **Feature branches**: `git checkout -b feature/[feature-name]`
- **Main branch**: Protected, requires PR review

## Architecture

### File Structure
```
/wp-content/themes/saas/
├── assets/
│   ├── css/modules/     # Modular CSS (base, layout, components, etc.)
│   └── js/              # Vanilla JavaScript modules
├── inc/                 # PHP includes
│   ├── customizer.php   # WordPress Customizer settings
│   └── template-functions.php
└── *.php               # Template files
```

### CSS Architecture
- **Modular approach**: base → layout → components → gutenberg → contact
- **No grid**: Use flexbox for all layouts
- **Mobile-first**: All components are responsive
- **CSS Custom Properties**: Use for theme colors and spacing

### JavaScript Architecture
- **Main object**: `CloudSync` with modular structure
- **No jQuery**: Pure vanilla JavaScript
- **Modules**: Each feature as CloudSync property (e.g., `CloudSync.contactForm`)

## Recent Features

### Contact Form (v1.0.0)
- **Location**: `front-page.php:282`
- **CSS**: `assets/css/modules/contact.css`
- **JS**: `CloudSync.contactForm` module
- **Customizer**: Full live preview integration
- **Security**: WordPress nonce protection

## Development Guidelines

### Code Standards
- **PHP**: Follow WordPress Coding Standards
- **CSS**: Use BEM methodology where applicable
- **JavaScript**: ES6+ features, JSDoc documentation
- **Security**: Always sanitize input, use nonces for forms

### Customizer Integration
- **Live Preview**: All settings should use `transport: 'postMessage'`
- **Organization**: Use panels and sections for logical grouping
- **Validation**: Proper sanitization callbacks for all settings

### Performance
- **Modular CSS**: Load only needed stylesheets
- **Lazy Loading**: Consider for images and non-critical resources
- **Minification**: Minify for production builds

## Testing Checklist

### Functionality
- [ ] All Customizer settings work with live preview
- [ ] Forms submit without page reload (if AJAX enabled)
- [ ] Mobile responsive behavior
- [ ] Cross-browser compatibility

### Performance
- [ ] CSS/JS files load in correct order
- [ ] No console errors
- [ ] Fast loading times
- [ ] Proper caching headers

### Security
- [ ] All user input sanitized
- [ ] Nonce verification for forms
- [ ] No exposed sensitive data
- [ ] Proper escaping in templates

## Deployment Notes

### Production Settings
- Set `DEBUG = false` in `assets/js/customizer.js:20`
- Remove development comments and console.log statements
- Minify CSS and JavaScript files
- Test on staging environment first

### Apache Configuration
- AllowOverride All (set globally in apache2.conf)
- mod_rewrite enabled for WordPress permalinks

## Troubleshooting

### Common Issues
- **Live preview not working**: Check customizer.js loads and no JS errors
- **Styles not applying**: Verify CSS enqueue order in functions.php
- **Form submissions**: Check nonce validation and AJAX endpoints

### Debug Commands
```bash
# Check file permissions
ls -la assets/css/modules/

# Test CSS syntax
stylelint assets/css/**/*.css

# Check JavaScript
node -c assets/js/theme.js
```