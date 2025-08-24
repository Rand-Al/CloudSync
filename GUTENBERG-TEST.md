# 🎨 CloudSync Theme - Gutenberg Blocks Testing Guide

## 📋 Quick Test Checklist

### ✅ HTML Demo File
1. Open `gutenberg-demo.html` in browser
2. Check all styles load correctly
3. Test responsive behavior (resize browser)

### ✅ WordPress Admin Testing

#### 1. Create Test Page
```
WordPress Admin → Pages → Add New
Title: "Gutenberg Blocks Test"
```

#### 2. Test Color Palette
- Add **Paragraph** block
- Select text → **Color settings** (right panel)
- **✅ Should see ONLY theme colors:**
  - Primary Purple (#667eea)
  - Secondary Purple (#764ba2) 
  - White (#ffffff)
  - Light Gray (#b8b8d4)
  - Dark Background (#0f0f23)

#### 3. Test Font Sizes
- Select **Heading** or **Paragraph**
- **Typography** → **Font size** (right panel)
- **✅ Should see ONLY theme sizes:**
  - Small (14px)
  - Normal (16px)
  - Medium (20px)
  - Large (24px)
  - Extra Large (32px)

#### 4. Test Block Styles
Add these blocks and check styling:

```markdown
# Test Content Template

## Heading with Primary Color
Set this heading to Primary Purple color and Large font size.

This is a paragraph with Light Gray color and Medium font size.

> "This is a quote block that should have a purple left border"
> — Quote Author

### Button Test
Add a Button block - should have gradient background.

#### Columns Test
Add Columns block (2 columns):
- Left: Some text content
- Right: Some text content

#### Table Test
Add Table block:
| Feature | Basic | Pro |
|---------|--------|-----|
| Storage | 10GB | 100GB |
| Users | 5 | Unlimited |

#### List Test
- First item
- Second item with **bold text**
- Third item with Primary Purple color

#### Code Test
```javascript
// Code block test
function hello() {
  return "Hello CloudSync!";
}
```

#### Wide Block Test
Add Image block → Set to "Wide width"
```

### ✅ Frontend Testing

#### 1. Save & Preview Page
- Click **Preview** in editor
- Check all blocks render correctly
- Colors and fonts match theme

#### 2. Mobile Testing
- Open on mobile OR use DevTools mobile view
- **✅ Check:**
  - Columns stack vertically
  - Tables scroll horizontally
  - Wide blocks fit screen
  - Font sizes scale properly

#### 3. Browser DevTools
Press F12 and check generated HTML:
```html
<!-- Should generate classes like: -->
<p class="has-primary-color has-large-font-size">...</p>
<div class="wp-block-button">
  <a class="wp-block-button__link">...</a>
</div>
```

### ✅ Common Issues & Fixes

#### ❌ Colors not showing
- Check `functions.php` has `editor-color-palette`
- Verify `gutenberg.css` is loading
- Clear browser cache

#### ❌ Font sizes not working
- Check `functions.php` has `editor-font-sizes`
- Verify CSS classes exist: `.has-small-font-size` etc.

#### ❌ Blocks look broken
- Check CSS files load order: base → layout → components → gutenberg
- Verify file paths in `wp_enqueue_style()`

#### ❌ Wide blocks not working
- Check `add_theme_support('align-wide')` in functions.php
- Verify `.alignwide` CSS exists

### 🎯 Expected Results

#### ✅ In Editor:
- Limited color palette (only theme colors)
- Limited font sizes (only theme sizes)
- Live preview shows correct styling
- Block inserter shows all blocks

#### ✅ On Frontend:
- All colors render correctly
- Font sizes apply properly
- Buttons have gradient styling
- Quotes have purple border
- Tables have dark styling
- Code blocks have proper background
- Mobile responsive behavior works

### 🐛 Debug Commands

If something's not working:

```bash
# Check if CSS files exist
ls -la assets/css/modules/

# Check CSS contains classes
grep "has-.*-color" assets/css/modules/gutenberg.css

# Check functions.php has theme support
grep "editor-color-palette\|editor-font-sizes" functions.php
```

### 📱 Mobile Test Scenarios

1. **Portrait phone (320px)**: Columns should stack
2. **Landscape phone (568px)**: Content should fit
3. **Tablet (768px)**: Columns might still be side-by-side
4. **Desktop (1200px+)**: Full layout

### 🎉 Success Criteria

**✅ Ready for production when:**
- [ ] All blocks render in theme style
- [ ] Only theme colors available in editor
- [ ] Only theme font sizes available
- [ ] Mobile responsive works
- [ ] No console errors
- [ ] Fast loading (modular CSS)
- [ ] Accessible (focus states work)

## 🚀 Next Steps

After testing works:
1. Create example pages for users
2. Add custom blocks if needed
3. Document for end users
4. Consider block patterns/templates