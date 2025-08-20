# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CloudSync is a premium WordPress SaaS landing page theme with modern dark design, complete WordPress Customizer integration, and mobile-first responsive design. The theme follows WordPress coding standards and is designed for international market distribution.

## Theme Architecture

### File Structure
```
wp-content/themes/saas/
├── style.css              # Main stylesheet + theme header
├── functions.php           # Core theme functionality  
├── header.php             # Header template
├── footer.php             # Footer template
├── front-page.php         # Landing page template
├── page.php               # Static page template
├── single.php             # Blog post template
├── index.php              # Fallback template
├── inc/
│   ├── customizer.php     # WordPress Customizer settings
│   ├── widgets.php        # Custom widgets
│   └── template-functions.php # Template helpers
└── assets/
    ├── css/
    │   └── normalize.css  # CSS reset
    └── js/
        ├── theme.js       # Main theme JavaScript (4000+ lines)
        └── customizer.js  # Customizer preview scripts
```

### Key Components

#### JavaScript Architecture (theme.js)
The main JavaScript file is organized into 6 logical sections:

1. **SECTION 1: CORE THEME FUNCTIONALITY** - Basic theme functions (smoothScrolling, mobileMenu, scrollAnimations, parallaxCards, interactiveCards, initCopyLinkButton)

2. **SECTION 2: SMART HEADER SYSTEM** - Intelligent header that hides/shows based on scroll direction

3. **SECTION 3: ADAPTIVE PAGES SYSTEM** - Comprehensive system with Table of Contents, reading progress, and mobile adaptations

4. **SECTION 4: UTILITY FUNCTIONS** - Helper functions (logging, DOM manipulation, throttling, debouncing)

5. **SECTION 5: SYSTEM INITIALIZATION & COORDINATION** - Module initialization and coordination

6. **SECTION 6: DEVELOPMENT & TESTING** - Debug functions and testing utilities

#### WordPress Customizer Integration
- All theme customization is done through WordPress Customizer
- 30+ customizable fields without external plugins
- Live preview with postMessage transport
- Proper sanitization callbacks for security

#### Responsive Design
- Mobile-first approach with CSS Grid and Flexbox
- Breakpoint management in JavaScript for adaptive features
- Progressive enhancement philosophy

## Development Workflow

### WordPress Standards
- Follow WordPress Coding Standards strictly
- All text strings must be translatable with `__()` and `_e()` functions
- Use proper WordPress hooks and filters
- Sanitize all inputs and escape all outputs
- Use nonces for security where applicable

### CSS Organization
- Use CSS custom properties for theming
- Follow BEM methodology for class naming
- Mobile-first media queries
- Optimize for Core Web Vitals

### JavaScript Patterns
- Vanilla JavaScript (no jQuery dependency)
- Module pattern with IIFE wrapper
- Event delegation for performance
- Throttling/debouncing for scroll and resize events
- Comprehensive error handling and logging

### Theme Features
- **Logo Upload**: WordPress Customizer logo support
- **Navigation Menus**: Primary, Footer, and Social menu locations
- **Widget Areas**: 4-column footer layout + sidebar
- **Post Thumbnails**: Multiple image sizes for different contexts
- **Custom Background**: Color and image support
- **HTML5 Support**: Semantic markup throughout

## Landing Page Sections

### Hero Section
- Dynamic content via Customizer (title, description, CTA buttons)
- Floating card animations with parallax effects
- Gradient background with CSS custom properties

### Features Section  
- 6 customizable feature cards
- Icon integration with Font Awesome
- Grid layout with CSS Grid

### How It Works Section
- 3-step process visualization
- Progressive flow design
- Number-based step indicators

### Pricing Section
- 3 pricing plans with customizable content
- Highlight "popular" plan functionality
- Dynamic feature lists

### Call-to-Action Section
- High-contrast conversion section
- Urgency elements
- Single focused action

### Footer
- 4-column widget-ready layout
- Social media integration
- Newsletter signup capability

## Common Development Tasks

### Adding New Customizer Settings
1. Add setting registration in `inc/customizer.php`
2. Implement proper sanitization callback
3. Add postMessage transport for live preview
4. Update `assets/js/customizer.js` for instant preview

### Modifying JavaScript Functionality
1. Locate the appropriate section in `theme.js`
2. Follow existing patterns for error handling
3. Use utility functions from SECTION 4
4. Add proper JSDoc comments
5. Test across different breakpoints

### Adding New Template Parts
1. Follow WordPress template hierarchy
2. Include proper security checks
3. Use `get_template_part()` for reusable components
4. Implement proper escaping for dynamic content

### Debugging and Development
- Enable debug mode in adaptive pages system: `CloudSync.adaptivePages.config.debug = true`
- Use browser dev tools with source maps
- Test TOC module: `CloudSync.adaptivePages.testTOCModule()`
- System state debug: `CloudSync.adaptivePages.debugSystem()`

### Performance Optimization
- Images: Use proper WordPress image sizes
- CSS: Minimize critical rendering path
- JavaScript: Lazy load non-critical functionality
- Fonts: Use font-display: swap

## Code Quality Standards

### Security
- Escape all dynamic content with appropriate WordPress functions
- Sanitize all user inputs
- Use nonces for forms and AJAX requests
- Follow principle of least privilege

### Accessibility
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Graceful degradation for JavaScript-disabled users

### Performance Targets
- Page load time: < 3 seconds
- Mobile PageSpeed score: 90+
- Lighthouse accessibility score: 95+
- No JavaScript errors in console

## Testing

### Manual Testing Checklist
- [ ] All Customizer settings work correctly
- [ ] Responsive design across breakpoints
- [ ] Cross-browser compatibility
- [ ] Accessibility with screen readers
- [ ] Performance metrics meet targets
- [ ] No JavaScript console errors

### WordPress Compatibility
- Test with latest WordPress version
- Verify PHP 7.4+ compatibility
- Check theme review guidelines compliance
- Test with common plugins

## Deployment Notes

### Production Preparation
- Minify CSS and JavaScript files
- Optimize images for web
- Remove debug code and console logs
- Test in clean WordPress environment
- Generate language files (.pot)

### Theme Package Structure
- Main theme files
- Documentation (PDF)
- Demo content (XML)
- Installation instructions
- Video tutorial assets

## Common Issues and Solutions

### JavaScript Errors
- Check browser console for specific errors
- Verify all dependencies are loaded
- Test adaptive pages system initialization
- Check for conflicting plugins

### Customizer Issues
- Verify setting registration syntax
- Check sanitization callbacks
- Test postMessage transport
- Clear browser cache

### Responsive Layout Problems
- Check CSS Grid browser support
- Verify breakpoint definitions
- Test on actual devices
- Validate HTML structure

## Notes for Future Development

- All JSDoc comments are preserved for theme documentation
- Russian comments in original code are business-related and can remain
- Theme is designed for international English-speaking market
- Modular architecture allows for easy feature additions
- Performance and SEO optimization are priorities