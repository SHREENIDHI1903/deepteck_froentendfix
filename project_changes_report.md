# Project Changes Report (Last 3 Days)

This report details the modifications made to the project codebase between **February 3rd, 2026** and **February 6th, 2026**.

## 1. Landing Page Redesign & Enhancements
**Goal:** Create a high-impact, "Vernacular DeepTech Marketplace" experience.

### Modified Files:
-   `src/pages/LandingPage.tsx`
-   `src/components/layout/HeroBackground.tsx`
-   `src/components/ui/TiltCard.tsx`

### Key Changes:
-   **Hero Section**:
    -   Implemented a split-layout design with a text slideshow ("Achievements = Skills + Talent...").
    -   Added a 3D-style image slideshow with floating "tech" icons (Brain, Rocket, DNA, etc.).
    -   Added a "purplish glow" background effect (`bg-gradient-to-tr from-indigo-500/20`) for visual depth.
-   **Visual Effects**:
    -   **Glow Effects**: Applied consistent indigo/purple glow blobs to "Why Choose Us", "Domains", "Experts", and "Engagement Models" sections.
    -   **Cyber Grid**: Added an animated grid background with "glitch" squares to the "Serious Engineering" section.
    -   **Tilt Cards**: Implemented 3D tilt interaction for Domain category cards.

## 2. Scroll Companion Bot (New Feature)
**Goal:** specific guide to walk the user through the platform's value proposition.

### New/Modified Files:
-   `src/components/ui/ScrollCompanion.tsx` (New)
-   `src/components/ui/AsteaiBot.tsx` (New)

### Key Changes:
-   **Component Creation**: Built a floating "AsteaiBot" that stays fixed at the bottom-right.
-   **Context-Aware Messaging**: The bot detects the active viewport section (Hero, Engineering, Domains, etc.) and updates its message box.
-   **Content Refinement**:
    -   Moved from "UI instructions" (e.g., "Hover here") to **Business Value** descriptions (e.g., "We verify every expert to protect your IP").
    -   Fixed typewriter effect glitches to ensure smooth text rendering.
    -   Corrected spelling ("Asteai" -> "ASTEAI") and encoding issues (Shield emoji).

## 3. Mobile Optimization
**Goal:** Ensure the complex animations work smoothly on smaller screens.

### Modified Files:
-   `src/pages/LandingPage.tsx`
-   `src/components/layout/HeroBackground.tsx`

### Key Changes:
-   **Animation Toggles**: Disabled complex mouse-tracking spotlights and heavy blur effects on mobile devices to prevent flickering.
-   **Layout Adjustments**: Stacked the Hero split-pane implementation for vertical mobile scrolling.
-   **Slideshow Visibility**: Fixed issues where the hero image slideshow would disappear or clip on mobile.

## 4. Performance & UX
**Goal:** silky smooth scrolling experience.

### Modified Files:
-   `src/components/layout/SmoothScroll.tsx` (New)
-   `src/App.tsx`

### Key Changes:
-   **Lenis Integration**: Integrated `lenis` for high-performance inertial scrolling, making the "cyber" feel more premium.
-   **Route Fixes**: Fixed routing logic for `/howitworks` and `/register` paths to ensure smooth navigation.
