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

The explore categories available in the ASTEAI marketplace are as follows:

### Categories

1. **AI / Machine Learning**
2. **Data Science & Analytics**
3. **Web Development**
4. **Mobile Development**
5. **Software Engineering**
6. **DevOps & Cloud Computing**
7. **Cybersecurity**
8. **Blockchain & Web3**
9. **Database Administration**
10. **QA & Testing**
11. **Game Development**
12. **AR / VR Development**
13. **IoT & Embedded Systems**
14. **Robotics & Automation**
15. **Climate Tech**
16. **Biotechnology**
17. **Quantum Computing**
18. **Space Technology**
19. **Advanced Materials**
20. **Energy & Storage**
21. **Deep Infrastructure**

### Creative Services

1. **UI/UX Design**
2. **Graphic Design**
3. **Product Design**
4. **Brand Identity**
5. **Motion Graphics**
6. **Illustration**
7. **Video Production**
8. **Photography**

### Marketing & Consulting

1. **Digital Marketing**
2. **Content Marketing**
3. **SEO & SEM**
4. **Social Media Marketing**
5. **Email Marketing**
6. **Sales Strategy**
7. **Market Research**
8. **Business Consulting**
9. **Financial Consulting**
10. **Accounting & Bookkeeping**
11. **Legal Consulting**
12. **HR & Recruiting**
13. **Project Management**
14. **Product Management**
15. **Operations Management**

### Writing Services

1. **Content Writing**
2. **Copywriting**
3. **Technical Writing**
4. **Translation**
5. **Editing & Proofreading**
6. **Customer Support**
7. **Virtual Assistant**

This array covers a wide range of specialized areas in emerging technologies, creative services, and consulting.