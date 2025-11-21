# Mobile Responsiveness Testing Guide

## Quick Visual Test Checklist

### 1. Tools Page Layout (320px - Mobile Small)
```
Expected Behavior:
- Single column of tool cards
- Cards have adequate padding (16px)
- Hero text is readable (24px)
- Buttons are touch-friendly (44px height)
- No horizontal scrolling
```

### 2. Tools Page Layout (768px - Tablet)
```
Expected Behavior:
- Two columns of tool cards
- Increased padding (24px)
- Larger hero text (36px)
- Proper spacing between cards
```

### 3. Tools Page Layout (1024px+ - Desktop)
```
Expected Behavior:
- Three columns of tool cards
- Maximum padding (32px)
- Largest hero text (48px)
- Centered modal for tool panels
```

### 4. Tool Panel Behavior

#### Mobile (< 768px)
```
Expected:
- Full-screen panel
- Sticky header at top
- Back button on left
- Close button on right
- Content scrolls smoothly
- No modal backdrop visible behind
```

#### Desktop (>= 768px)
```
Expected:
- Centered modal with rounded corners
- Dark backdrop behind modal
- Modal max-width: 896px (4xl)
- Modal max-height: 90vh
- Padding around modal
```

### 5. Input Field Testing

#### All Screen Sizes
```
Test Each Input Type:
1. Text inputs - minimum 44px height
2. Number inputs - proper keyboard on mobile
3. Select dropdowns - easy to tap and select
4. Buttons - 44px minimum height
5. Toggle switches - large enough to tap

Expected:
- No zoom on focus (iOS)
- Proper keyboard types
- Clear error messages
- Adequate spacing between fields
```

### 6. Typography Scaling

#### Mobile (320px)
```
- Hero: 24px (1.5rem)
- Page Title: 20px (1.25rem)
- Section Title: 18px (1.125rem)
- Body: 16px (1rem)
- Small: 14px (0.875rem)
```

#### Tablet (768px)
```
- Hero: 36px (2.25rem)
- Page Title: 30px (1.875rem)
- Section Title: 24px (1.5rem)
- Body: 16px (1rem)
- Small: 14px (0.875rem)
```

#### Desktop (1024px+)
```
- Hero: 48px (3rem)
- Page Title: 36px (2.25rem)
- Section Title: 30px (1.875rem)
- Body: 18px (1.125rem)
- Small: 14px (0.875rem)
```

## Browser DevTools Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test these presets:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - iPad Pro (1024x1366)
   - Responsive (custom sizes)

### Firefox Responsive Design Mode
1. Open DevTools (F12)
2. Click responsive design mode (Ctrl+Shift+M)
3. Test same device presets

### Safari Responsive Design Mode
1. Open Web Inspector (Cmd+Option+I)
2. Click device icon
3. Test iOS devices

## Manual Testing on Real Devices

### iOS Devices
- [ ] iPhone SE (small screen)
- [ ] iPhone 12/13 (standard)
- [ ] iPhone 14 Pro Max (large)
- [ ] iPad (tablet)
- [ ] iPad Pro (large tablet)

### Android Devices
- [ ] Small Android (320-360px)
- [ ] Standard Android (360-414px)
- [ ] Large Android (414-480px)
- [ ] Android Tablet

## Specific Component Tests

### Energy & Protein Calculator
```
Mobile Test:
1. Open tool on mobile
2. Toggle between Imperial/Metric
   - Should be full width on mobile
   - Should be inline on desktop
3. Fill in all fields
   - Inputs should be 44px height
   - Keyboard should be numeric for numbers
4. View results
   - Should be readable
   - Buttons should stack vertically
```

### Plate Builder
```
Mobile Test:
1. Open tool on mobile
2. Select goal and meal type
   - Dropdowns should be easy to tap
   - Options should be readable
3. View plate visual
   - Should scale to fit screen
   - Should not overflow
4. View meal examples
   - Should be readable
   - Should have proper spacing
```

### Heart Rate Zones
```
Mobile Test:
1. Open tool on mobile
2. Enter age and optional resting HR
3. View zone results
   - Zone cards should stack
   - BPM ranges should be visible
   - Icons should be appropriate size
   - Text should not overflow
```

### Recovery Check-In
```
Mobile Test:
1. Open tool on mobile
2. Tap emoji buttons
   - Should be easy to tap (44px)
   - Should show visual feedback
   - Should not mis-tap adjacent buttons
3. View results
   - Should be readable
   - Color coding should be clear
```

### Hydration & Sleep Snapshot
```
Mobile Test:
1. Open tool on mobile
2. Enter sleep and water values
3. View status indicators
   - Should be clear and readable
   - Tips should be visible
   - Status badges should fit
```

### Youth Corner
```
Mobile Test:
1. Open tool on mobile
2. Enter screen time and play time
3. View bar visualization
   - Bars should scale properly
   - Percentages should be visible
   - Should not overflow
```

## Common Issues to Check

### Layout Issues
- [ ] No horizontal scrolling
- [ ] No content overflow
- [ ] Proper text wrapping
- [ ] Adequate spacing
- [ ] No overlapping elements

### Touch Issues
- [ ] All buttons are 44x44px minimum
- [ ] Adequate spacing between touch targets
- [ ] No accidental taps
- [ ] Proper active states
- [ ] No blue tap highlight flash

### Typography Issues
- [ ] Text is readable (not too small)
- [ ] No text truncation
- [ ] Proper line heights
- [ ] No zoom on input focus (iOS)
- [ ] Consistent font sizes

### Performance Issues
- [ ] Smooth scrolling
- [ ] Fast transitions
- [ ] No layout shifts
- [ ] Quick load times
- [ ] Responsive interactions

## Accessibility Testing

### Screen Reader Test
1. Enable VoiceOver (iOS) or TalkBack (Android)
2. Navigate through tools page
3. Open a tool panel
4. Fill in form fields
5. Verify all content is announced

### Keyboard Navigation Test
1. Tab through all interactive elements
2. Verify focus indicators are visible
3. Test Enter/Space to activate buttons
4. Test Escape to close panels
5. Verify focus trap in modals

### Color Contrast Test
1. Use browser extension (WAVE, axe)
2. Verify all text meets 4.5:1 ratio
3. Check button states
4. Verify error messages are clear

## Performance Benchmarks

### Lighthouse Scores (Mobile)
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Sign-Off Checklist

- [ ] All screen sizes tested (320px - 1920px)
- [ ] All tools tested on mobile
- [ ] Touch targets meet 44px minimum
- [ ] Typography is readable on all devices
- [ ] No horizontal scrolling
- [ ] Smooth interactions
- [ ] Accessibility standards met
- [ ] Performance benchmarks met
- [ ] Real device testing completed
- [ ] Browser compatibility verified

## Notes
- Test in both portrait and landscape orientations
- Test with different font size settings
- Test with different zoom levels
- Test with slow network connections
- Test with touch and mouse interactions
