# iFAST Docs Tutorial System

This document explains the step-by-step tutorial system implemented in the iFAST Docs platform.

## Overview

The tutorial system provides an interactive, guided tour of the platform to help new users understand how to use the documentation tools effectively. It includes:

- **Welcome Modal**: Asks users if they want to take a tour
- **Step-by-Step Guide**: Highlights different UI elements with explanations
- **Progress Tracking**: Shows completion status and allows navigation
- **Persistent State**: Remembers if users have completed the tutorial
- **Easy Access**: Multiple ways to start or restart the tutorial

## Features

### 1. Automatic Tutorial Prompt
- Shows automatically for first-time visitors (after 2 seconds)
- Stored in localStorage to avoid showing repeatedly
- Users can choose to start or skip

### 2. Interactive Tutorial Steps
The tutorial covers 6 main areas:

1. **Navigation Sidebar** - Explains the main navigation structure
2. **Top Header** - Covers search, language settings, and user menu
3. **Dashboard Overview** - Shows statistics and quick actions
4. **Document Creation** - Explains the different ways to create docs
5. **Smart Search** - Covers search features and AI capabilities
6. **Document Maintenance** - Explains maintenance tools and monitoring

### 3. Visual Highlighting
- Each step highlights the relevant UI element
- Uses a pulsing blue ring effect
- Smooth scrolling to bring elements into view
- CSS animations for smooth transitions

### 4. Multiple Access Points
Users can start the tutorial from:
- **Header**: Help button in the top-right
- **Sidebar**: Onboarding section
- **Floating Help**: Bottom-right help button
- **Onboarding Page**: Dedicated tutorial section

## Technical Implementation

### Components

#### `TutorialOverlay.jsx`
- Main tutorial interface
- Handles step navigation and content display
- Manages element highlighting

#### `TutorialContext.jsx`
- React context for tutorial state management
- Handles localStorage persistence
- Provides tutorial functions to components

#### `FloatingHelpButton.jsx`
- Always-accessible help button
- Quick access to tutorial and other help options
- Positioned in bottom-right corner

### CSS Classes

The tutorial system uses specific CSS classes for targeting elements:

```css
.dashboard-stats      /* Dashboard statistics grid */
.search-container     /* Search interface container */
.maintenance-tabs    /* Maintenance tab navigation */
.write-docs-tabs     /* Document creation tabs */
.tutorial-highlight  /* Active tutorial highlighting */
```

### State Management

```javascript
const {
  showTutorial,           // Whether tutorial is visible
  hasCompletedTutorial,   // User has finished tutorial
  isFirstVisit,          // First time user
  startTutorial,         // Function to start tutorial
  closeTutorial,         // Function to close tutorial
  completeTutorial,      // Function to mark as complete
  resetTutorial          // Function to reset progress
} = useTutorial();
```

## Usage

### Starting the Tutorial

```javascript
import { useTutorial } from '../contexts/TutorialContext';

const MyComponent = () => {
  const { startTutorial } = useTutorial();
  
  return (
    <button onClick={startTutorial}>
      Start Tutorial
    </button>
  );
};
```

### Tutorial Steps Configuration

Each tutorial step is defined with:

```javascript
{
  id: 'unique-id',
  title: 'Step Title',
  description: 'Brief description',
  target: '.css-selector',  // Element to highlight
  position: 'top|bottom|left|right',
  content: <JSX content>    // Detailed explanation
}
```

### Customizing Tutorial Content

To modify tutorial steps, edit the `tutorialSteps` array in `TutorialOverlay.jsx`:

```javascript
const tutorialSteps = [
  {
    id: 'custom-step',
    title: 'Custom Step',
    description: 'Custom description',
    target: '.custom-selector',
    content: (
      <div>
        <p>Custom content here</p>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      </div>
    )
  }
  // ... more steps
];
```

## Styling

### Tutorial Highlight Effect

```css
.tutorial-highlight {
  @apply ring-4 ring-primary-500 ring-opacity-50 shadow-lg;
  animation: tutorial-pulse 2s ease-in-out infinite;
  z-index: 10;
  position: relative;
}
```

### Animations

- **Pulse Effect**: Glowing ring around highlighted elements
- **Slide-in**: Smooth entrance for tutorial tooltips
- **Fade-in**: Background overlay transitions

## Best Practices

### 1. Element Targeting
- Use specific, unique CSS selectors
- Test selectors work across different screen sizes
- Provide fallback selectors for better targeting

### 2. Content Writing
- Keep explanations concise and clear
- Use bullet points for feature lists
- Include practical examples when possible

### 3. User Experience
- Allow users to skip at any time
- Provide clear progress indicators
- Make tutorial restartable for refreshers

### 4. Performance
- Lazy load tutorial content
- Minimize DOM queries during highlighting
- Use CSS transforms for smooth animations

## Troubleshooting

### Common Issues

1. **Elements not highlighting**
   - Check CSS selector exists in DOM
   - Verify element is visible and rendered
   - Test selector in browser console

2. **Tutorial not showing**
   - Check TutorialProvider wraps the app
   - Verify localStorage permissions
   - Check console for errors

3. **Highlighting conflicts**
   - Ensure unique CSS classes
   - Check z-index values
   - Verify no conflicting styles

### Debug Mode

Add console logs to track tutorial state:

```javascript
useEffect(() => {
  console.log('Tutorial state:', { showTutorial, currentStep, isFirstVisit });
}, [showTutorial, currentStep, isFirstVisit]);
```

## Future Enhancements

- **Video Tutorials**: Embed video content in steps
- **Interactive Exercises**: Hands-on practice tasks
- **Progress Analytics**: Track tutorial completion rates
- **Customizable Tours**: User-defined tutorial paths
- **Multi-language Support**: Localized tutorial content
- **A/B Testing**: Different tutorial approaches

## Support

For questions or issues with the tutorial system:
- Check this documentation
- Review browser console for errors
- Test in different browsers and devices
- Contact the development team 