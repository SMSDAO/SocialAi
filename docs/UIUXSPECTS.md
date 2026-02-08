# SocialAi UI/UX Specifications

**Version 1.0**

This document defines the user interface and user experience specifications for the SocialAi application. It covers both the Public Layer (user-facing) and Admin Layer (administrative console) applications.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Public Layer Specifications](#2-public-layer-specifications)
3. [Admin Layer Specifications](#3-admin-layer-specifications)
4. [Common Design Elements](#4-common-design-elements)
5. [Responsive Design Guidelines](#5-responsive-design-guidelines)
6. [Accessibility Standards](#6-accessibility-standards)
7. [Performance Guidelines](#7-performance-guidelines)

---

## 1. Design Principles

### 1.1 Core Principles

**Simplicity**
- Minimal UI elements
- Clear visual hierarchy
- Focus on content, not chrome
- Progressive disclosure of complexity

**Speed**
- Zero JavaScript by default on public pages
- Server-side rendering for instant loads
- Optimized images and assets
- Lazy loading for non-critical content

**Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

**SEO-First**
- Semantic HTML
- Proper heading hierarchy
- Meta tags and structured data
- Fast Core Web Vitals

### 1.2 Brand Identity

**Color Palette**

Primary Colors:
- **Primary Blue**: `#0066FF` - Main brand color
- **Dark Blue**: `#0052CC` - Hover states, emphasis
- **Light Blue**: `#4D94FF` - Accents, highlights

Neutral Colors:
- **Black**: `#000000` - Primary text
- **Dark Gray**: `#333333` - Secondary text
- **Medium Gray**: `#666666` - Tertiary text
- **Light Gray**: `#CCCCCC` - Borders, dividers
- **Off White**: `#F5F5F5` - Backgrounds
- **White**: `#FFFFFF` - Cards, modals

Semantic Colors:
- **Success Green**: `#00B050` - Success messages
- **Warning Orange**: `#FF9900` - Warning messages
- **Error Red**: `#FF3333` - Error messages
- **Info Blue**: `#0099FF` - Informational messages

**Typography**

Font Stack:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
             sans-serif;
```

Type Scale:
- **Heading 1**: 48px / 3rem (bold) - Page titles
- **Heading 2**: 36px / 2.25rem (bold) - Section titles
- **Heading 3**: 28px / 1.75rem (semibold) - Subsections
- **Heading 4**: 22px / 1.375rem (semibold) - Card titles
- **Body Large**: 18px / 1.125rem - Important text
- **Body**: 16px / 1rem - Default text
- **Body Small**: 14px / 0.875rem - Secondary text
- **Caption**: 12px / 0.75rem - Metadata, labels

**Spacing System**

Based on 8px grid:
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

---

## 2. Public Layer Specifications

The Public Layer is built with Astro + Vite and focuses on SEO, performance, and accessibility.

### 2.1 Landing Page

**Layout Structure**
```
┌─────────────────────────────────────────┐
│           Header / Navigation           │
├─────────────────────────────────────────┤
│                                         │
│          Hero Section                   │
│      (Title + Description + CTA)        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         Features Section                │
│     (3-column grid on desktop)          │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│       Recent Activity Feed              │
│     (Timeline preview)                  │
│                                         │
├─────────────────────────────────────────┤
│           Footer                        │
└─────────────────────────────────────────┘
```

**Hero Section**
- **Background**: White or subtle gradient
- **Max Width**: 1200px
- **Padding**: 3xl (64px) vertical, lg (24px) horizontal
- **Title**: H1, 48px, bold, center-aligned
- **Description**: Body Large, 18px, center-aligned, max-width 600px
- **CTA Button**: Primary blue, 48px height, 24px padding, rounded corners (8px)

**Features Section**
- **Grid**: 3 columns on desktop, 1 column on mobile
- **Gap**: lg (24px)
- **Icon Size**: 48x48px
- **Icon Color**: Primary blue
- **Title**: H3, 28px, semibold
- **Description**: Body, 16px

### 2.2 Profile Pages

**Layout Structure**
```
┌─────────────────────────────────────────┐
│           Header / Navigation           │
├─────────────────────────────────────────┤
│                                         │
│         Profile Header                  │
│  (Banner, Avatar, Name, Bio)            │
│                                         │
├─────────────────────────────────────────┤
│  Stats Bar (Followers, Following, etc)  │
├─────────────────────────────────────────┤
│                                         │
│           Tabs Navigation               │
│     (Posts | Replies | Likes)           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         Content Feed                    │
│     (Post cards in timeline)            │
│                                         │
└─────────────────────────────────────────┘
```

**Profile Header**
- **Banner**: 1500x500px recommended, aspect ratio 3:1
- **Avatar**: 128x128px circle, positioned -64px from bottom of banner
- **Avatar Border**: 4px white border
- **Max Width**: 1200px
- **Padding**: lg (24px)
- **Name**: H2, 36px, bold
- **Username**: Body, 16px, gray color, prefixed with @
- **Bio**: Body, 16px, max 280 characters
- **Links**: Primary blue, underlined on hover

**Stats Bar**
- **Height**: 64px
- **Background**: Off white
- **Border**: Top and bottom, light gray
- **Layout**: Horizontal flex, space-between
- **Stat Item**: Number (bold) + Label (gray)

**Tabs Navigation**
- **Height**: 48px
- **Border Bottom**: 2px solid light gray
- **Active Tab**: Primary blue border-bottom, bold text
- **Inactive Tab**: Gray text, no border
- **Hover**: Medium gray text

### 2.3 Timeline/Feed Pages

**Layout Structure**
```
┌─────────────────────────────────────────┐
│           Header / Navigation           │
├─────────────────────────────────────────┤
│         Filter Bar (optional)           │
├─────────────────────────────────────────┤
│                                         │
│         Post Card 1                     │
├─────────────────────────────────────────┤
│         Post Card 2                     │
├─────────────────────────────────────────┤
│         Post Card 3                     │
├─────────────────────────────────────────┤
│              ...                        │
└─────────────────────────────────────────┘
```

**Post Card**
```
┌─────────────────────────────────────────┐
│  Avatar  Name @username · timestamp     │
│                                         │
│  Post content text goes here...         │
│                                         │
│  [Media attachments if present]         │
│                                         │
│  💬 Reply  ♻️ Recast  ❤️ Like          │
└─────────────────────────────────────────┘
```

- **Card Background**: White
- **Card Border**: 1px solid light gray
- **Card Padding**: md (16px)
- **Card Margin**: sm (8px) vertical
- **Avatar Size**: 48x48px circle
- **Name**: Body, 16px, bold
- **Username**: Body Small, 14px, gray
- **Timestamp**: Body Small, 14px, gray
- **Content**: Body, 16px, with proper line-height (1.5)
- **Action Buttons**: Icon + text, gray color, primary blue on hover
- **Button Size**: 32px height
- **Button Spacing**: md (16px) gap

**Media Attachments**
- **Max Width**: 100% of card width
- **Max Height**: 500px
- **Border Radius**: 8px
- **Margin**: sm (8px) vertical

### 2.4 Claim Flow Page

**Layout Structure**
```
┌─────────────────────────────────────────┐
│           Header / Navigation           │
├─────────────────────────────────────────┤
│                                         │
│         Centered Card                   │
│    ┌─────────────────────────┐         │
│    │  Step Indicator         │         │
│    ├─────────────────────────┤         │
│    │  Title                  │         │
│    │  Description            │         │
│    │                         │         │
│    │  [Input Fields]         │         │
│    │                         │         │
│    │  [Action Button]        │         │
│    └─────────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

**Claim Card**
- **Max Width**: 480px
- **Background**: White
- **Border**: None
- **Box Shadow**: 0 4px 16px rgba(0,0,0,0.1)
- **Border Radius**: 16px
- **Padding**: xl (32px)
- **Margin**: Auto-centered

**Step Indicator**
- **Dots**: 8px circles
- **Active**: Primary blue, filled
- **Completed**: Success green, filled
- **Inactive**: Light gray, outlined
- **Spacing**: sm (8px) gap

**Form Elements**
- **Input Height**: 48px
- **Input Border**: 1px solid light gray
- **Input Border Radius**: 8px
- **Input Padding**: md (16px)
- **Input Focus**: Primary blue border, 2px
- **Label**: Body Small, 14px, bold, 8px margin-bottom
- **Helper Text**: Caption, 12px, gray, 4px margin-top
- **Error Text**: Caption, 12px, error red

**Action Button**
- **Width**: 100%
- **Height**: 48px
- **Background**: Primary blue
- **Text**: White, bold
- **Border Radius**: 8px
- **Hover**: Dark blue background
- **Disabled**: Light gray background, gray text

### 2.5 Navigation Header

**Desktop Layout**
```
┌────────────────────────────────────────────────────┐
│  Logo  |  Home  Profiles  Timeline  |  [Search] [Button] │
└────────────────────────────────────────────────────┘
```

**Mobile Layout**
```
┌────────────────────────────────────────┐
│  [Menu]  Logo              [Search]    │
└────────────────────────────────────────┘
```

- **Height**: 64px
- **Background**: White
- **Border Bottom**: 1px solid light gray
- **Max Width**: 100%
- **Padding**: 0 lg (24px)
- **Logo Height**: 32px
- **Nav Links**: Body, 16px, gray, primary blue on hover
- **Nav Link Padding**: md (16px)
- **Search Input**: 240px width, 40px height, rounded
- **Button**: Primary blue, 40px height, md (16px) padding

---

## 3. Admin Layer Specifications

The Admin Layer is built with Angular and focuses on functionality, data density, and efficient workflows.

### 3.1 Dashboard Page

**Layout Structure**
```
┌─────────────────────────────────────────┐
│  Sidebar  │   Main Content              │
│           │                             │
│  Nav      │   Dashboard Header          │
│  Items    │                             │
│           ├─────────────────────────────┤
│           │                             │
│           │   Metrics Cards (4-col)     │
│           │                             │
│           ├─────────────────────────────┤
│           │                             │
│           │   Charts Section            │
│           │                             │
└─────────────────────────────────────────┘
```

**Sidebar**
- **Width**: 240px
- **Background**: Dark gray (#333333)
- **Text Color**: White
- **Nav Item Height**: 48px
- **Nav Item Padding**: md (16px)
- **Active Item**: Primary blue background
- **Hover**: Lighter gray background
- **Logo**: Top of sidebar, 48px height, lg (24px) padding

**Metrics Cards**
- **Grid**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Gap**: md (16px)
- **Card Background**: White
- **Card Border**: 1px solid light gray
- **Card Border Radius**: 8px
- **Card Padding**: lg (24px)
- **Title**: Body Small, 14px, gray, uppercase
- **Value**: H2, 36px, bold
- **Change Indicator**: Body Small, 14px, green/red with arrow

**Charts**
- **Background**: White
- **Border**: 1px solid light gray
- **Border Radius**: 8px
- **Padding**: lg (24px)
- **Title**: H3, 28px, semibold
- **Height**: 300px minimum

### 3.2 Feature Flags Page

**Layout Structure**
```
┌─────────────────────────────────────────┐
│  Sidebar  │   Main Content              │
│           │                             │
│  Nav      │   Page Header               │
│  Items    │   "Feature Flags" + [New]   │
│           │                             │
│           ├─────────────────────────────┤
│           │                             │
│           │   Table                     │
│           │   ┌──────────────────────┐  │
│           │   │ Flag | Status | Edit │  │
│           │   ├──────────────────────┤  │
│           │   │ ...  | ...    | ...  │  │
│           │   └──────────────────────┘  │
│           │                             │
└─────────────────────────────────────────┘
```

**Page Header**
- **Height**: 80px
- **Padding**: lg (24px)
- **Border Bottom**: 1px solid light gray
- **Title**: H2, 36px, bold
- **Action Button**: Primary blue, 40px height

**Table**
- **Background**: White
- **Border**: 1px solid light gray
- **Border Radius**: 8px
- **Header Background**: Off white
- **Header Height**: 48px
- **Header Text**: Body Small, 14px, bold, uppercase, gray
- **Row Height**: 56px
- **Row Border**: 1px solid light gray (bottom only)
- **Row Hover**: Off white background
- **Cell Padding**: md (16px)

**Toggle Switch**
- **Width**: 48px
- **Height**: 24px
- **Border Radius**: 12px (fully rounded)
- **Background**: Light gray (off), primary blue (on)
- **Knob**: 20px circle, white, 2px margin

### 3.3 Sync Controls Page

**Layout Structure**
```
┌─────────────────────────────────────────┐
│  Sidebar  │   Main Content              │
│           │                             │
│  Nav      │   Page Header               │
│  Items    │                             │
│           ├─────────────────────────────┤
│           │                             │
│           │   Worker Cards (grid)       │
│           │                             │
│           │   ┌────────────┐ ┌────────┐ │
│           │   │ Farcaster  │ │ Reddit │ │
│           │   │ Worker     │ │ Worker │ │
│           │   └────────────┘ └────────┘ │
│           │                             │
└─────────────────────────────────────────┘
```

**Worker Card**
- **Grid**: 2 columns on desktop, 1 on mobile
- **Gap**: md (16px)
- **Background**: White
- **Border**: 1px solid light gray
- **Border Radius**: 8px
- **Padding**: lg (24px)
- **Status Badge**: 8px circle + text
  - Green: Running
  - Red: Stopped
  - Orange: Warning
- **Title**: H4, 22px, semibold
- **Last Sync**: Body Small, 14px, gray
- **Action Buttons**: Secondary style, md (16px) padding

### 3.4 Worker Health Page

**Layout Structure**
```
┌─────────────────────────────────────────┐
│  Sidebar  │   Main Content              │
│           │                             │
│  Nav      │   Page Header               │
│  Items    │                             │
│           ├─────────────────────────────┤
│           │                             │
│           │   Status Overview           │
│           │                             │
│           ├─────────────────────────────┤
│           │                             │
│           │   Worker Details (list)     │
│           │                             │
└─────────────────────────────────────────┘
```

**Status Overview**
- **Background**: Success green (all healthy) or error red (any issues)
- **Text Color**: White
- **Padding**: lg (24px)
- **Border Radius**: 8px
- **Margin**: 0 0 md (16px) 0
- **Icon**: 32px
- **Text**: H3, 28px, semibold

**Worker Detail Card**
- **Background**: White
- **Border**: 1px solid light gray
- **Border Left**: 4px solid (green/red/orange based on status)
- **Border Radius**: 8px
- **Padding**: lg (24px)
- **Margin**: sm (8px) vertical
- **Worker Name**: H4, 22px, semibold
- **Status**: Body, 16px, bold, colored
- **Metrics**: Body Small, 14px, gray
- **Last Check**: Caption, 12px, gray
- **Action Buttons**: Icon buttons, 32px size

---

## 4. Common Design Elements

### 4.1 Buttons

**Primary Button**
- Background: Primary blue
- Text: White, bold
- Height: 40px (default), 48px (large)
- Padding: md (16px) horizontal
- Border Radius: 8px
- Hover: Dark blue background
- Active: Darker blue, slight scale (0.98)
- Disabled: Light gray background, gray text

**Secondary Button**
- Background: White
- Text: Primary blue, bold
- Border: 1px solid primary blue
- Height: 40px (default), 48px (large)
- Padding: md (16px) horizontal
- Border Radius: 8px
- Hover: Off white background
- Active: Light gray background

**Tertiary Button**
- Background: Transparent
- Text: Primary blue
- Height: 40px (default)
- Padding: md (16px) horizontal
- Border Radius: 8px
- Hover: Off white background

**Icon Button**
- Size: 32px (small), 40px (medium), 48px (large)
- Background: Transparent
- Icon Color: Gray
- Border Radius: 50%
- Hover: Off white background, primary blue icon

### 4.2 Form Controls

**Text Input**
- Height: 48px
- Border: 1px solid light gray
- Border Radius: 8px
- Padding: md (16px)
- Font Size: Body, 16px
- Focus: Primary blue border, 2px
- Error: Error red border
- Disabled: Off white background, gray text

**Textarea**
- Min Height: 96px
- Border: 1px solid light gray
- Border Radius: 8px
- Padding: md (16px)
- Font Size: Body, 16px
- Focus: Primary blue border, 2px
- Resize: Vertical only

**Checkbox**
- Size: 20px
- Border: 1px solid light gray
- Border Radius: 4px
- Checked: Primary blue background, white checkmark
- Hover: Medium gray border

**Radio Button**
- Size: 20px
- Border: 1px solid light gray
- Border Radius: 50%
- Selected: Primary blue border (2px), primary blue dot (10px)
- Hover: Medium gray border

**Select/Dropdown**
- Height: 48px
- Border: 1px solid light gray
- Border Radius: 8px
- Padding: md (16px)
- Font Size: Body, 16px
- Arrow: Gray, right-aligned
- Focus: Primary blue border, 2px

### 4.3 Modals/Dialogs

**Overlay**
- Background: rgba(0, 0, 0, 0.5)
- Z-index: 1000

**Modal Container**
- Background: White
- Max Width: 600px (default), 800px (large)
- Border Radius: 16px
- Box Shadow: 0 8px 32px rgba(0, 0, 0, 0.2)
- Padding: xl (32px)
- Z-index: 1001

**Modal Header**
- Title: H3, 28px, semibold
- Close Button: Icon button, top-right
- Border Bottom: 1px solid light gray
- Padding Bottom: md (16px)
- Margin Bottom: lg (24px)

**Modal Footer**
- Border Top: 1px solid light gray
- Padding Top: lg (24px)
- Margin Top: lg (24px)
- Buttons: Aligned right, sm (8px) gap

### 4.4 Notifications/Alerts

**Toast Notification**
- Width: 320px
- Background: White
- Border: 1px solid light gray
- Border Left: 4px solid (blue/green/orange/red based on type)
- Border Radius: 8px
- Box Shadow: 0 4px 16px rgba(0, 0, 0, 0.1)
- Padding: md (16px)
- Position: Top-right, fixed
- Animation: Slide in from right
- Duration: 5 seconds (auto-dismiss)

**Alert Banner**
- Width: 100%
- Background: Light blue/green/orange/red (based on type)
- Text Color: Dark blue/green/orange/red
- Padding: md (16px)
- Border Radius: 8px
- Icon: 24px, left-aligned
- Close Button: Icon button, right-aligned

### 4.5 Loading States

**Spinner**
- Size: 32px (default), 16px (small), 48px (large)
- Color: Primary blue
- Animation: Rotate 360deg, 1s infinite

**Skeleton Screen**
- Background: Off white
- Animated gradient: Light gray to white, 1.5s infinite
- Border Radius: 8px
- Height: Match content being loaded

**Progress Bar**
- Height: 4px
- Background: Light gray
- Fill: Primary blue
- Animation: Indeterminate or percentage-based

---

## 5. Responsive Design Guidelines

### 5.1 Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { ... }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large Desktop */
@media (min-width: 1440px) { ... }
```

### 5.2 Layout Adjustments

**Mobile (< 768px)**
- Single column layouts
- Stacked navigation
- Full-width cards
- Touch-friendly targets (44px minimum)
- Collapsed sidebar (hamburger menu)
- Simplified data tables (card view)

**Tablet (768px - 1023px)**
- 2-column grids
- Side-by-side layouts where appropriate
- Larger touch targets (48px)
- Optional sidebar (collapsible)
- Responsive tables (horizontal scroll or card view)

**Desktop (≥ 1024px)**
- Multi-column layouts (3-4 columns)
- Fixed sidebar navigation
- Hover interactions
- Data-dense tables
- Maximum content width: 1200px

### 5.3 Typography Scaling

**Mobile**
- H1: 36px
- H2: 28px
- H3: 22px
- H4: 18px
- Body: 16px

**Desktop**
- H1: 48px
- H2: 36px
- H3: 28px
- H4: 22px
- Body: 16px

---

## 6. Accessibility Standards

### 6.1 WCAG 2.1 AA Compliance

**Color Contrast**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Keyboard Navigation**
- All interactive elements focusable
- Logical tab order
- Visible focus indicators (2px primary blue outline)
- Skip to main content link
- Escape to close modals

**Screen Reader Support**
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Form labels properly associated
- Status announcements for dynamic content

**Motion**
- Respect prefers-reduced-motion
- No autoplay videos
- Pausable animations
- No flashing content

### 6.2 Focus Management

**Focus Indicator**
- Outline: 2px solid primary blue
- Offset: 2px
- Border Radius: Match element

**Focus Order**
- Header → Main Content → Sidebar → Footer
- Within cards: Top to bottom, left to right
- Skip navigation for keyboard users

---

## 7. Performance Guidelines

### 7.1 Core Web Vitals Targets

**Largest Contentful Paint (LCP)**
- Target: < 2.5 seconds
- Good: < 2.5s
- Needs Improvement: 2.5s - 4.0s
- Poor: > 4.0s

**First Input Delay (FID)**
- Target: < 100 milliseconds
- Good: < 100ms
- Needs Improvement: 100ms - 300ms
- Poor: > 300ms

**Cumulative Layout Shift (CLS)**
- Target: < 0.1
- Good: < 0.1
- Needs Improvement: 0.1 - 0.25
- Poor: > 0.25

### 7.2 Image Optimization

- Use modern formats (WebP with fallbacks)
- Provide multiple sizes (srcset)
- Lazy load below-the-fold images
- Optimize file sizes (< 100KB for most images)
- Proper dimensions to prevent layout shift
- Alt text for accessibility

### 7.3 JavaScript Bundle

- Zero JavaScript for public pages by default
- Progressive enhancement
- Code splitting for admin app
- Lazy load routes
- Tree shaking
- Target bundle size: < 200KB (gzipped)

### 7.4 CSS Optimization

- Critical CSS inlined
- Non-critical CSS deferred
- Minimize unused CSS
- Use CSS custom properties
- Target CSS size: < 50KB (gzipped)

---

## Related Documentation

For more information, see:

- **[Documentation Index](README.md)** - Complete documentation table of contents
- **[Architecture Overview](ARCHITECTURE.md)** - System architecture and backend components
- **[API Reference](API.md)** - REST API for frontend integration
- **[Development Guide](DEVELOPMENT.md)** - Frontend development workflow
- **[Contributing Guidelines](CONTRIBUTING.md)** - UI/UX contribution guidelines
- **[Installation Guide](INSTALLATION.md)** - Setup instructions for development

---

## Conclusion

These UI/UX specifications ensure a consistent, accessible, and performant experience across both the Public and Admin layers of SocialAi. The design prioritizes simplicity, speed, and usability while maintaining a professional aesthetic.

For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).  
For API documentation, see [API.md](API.md).  
For installation instructions, see [INSTALLATION.md](INSTALLATION.md).

---

*Last Updated: 2026-02-07*
