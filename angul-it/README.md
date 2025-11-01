# Angul-It 🤖

A modern, multi-stage CAPTCHA verification system built with Angular 20. This application challenges users to prove they're human through intelligent image recognition tasks, featuring dynamic challenge generation, state management, and a beautiful user interface.

![Angular](https://img.shields.io/badge/Angular-20.2-DD0031?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Functionality

- **🎯 Multi-Stage Challenges**: Three progressive CAPTCHA stages with varying difficulty
- **🔀 Dynamic Challenge Generation**: Randomly generated math and text-based challenges
- **💾 State Management**: Progress persistence using localStorage (survives page refresh)
- **🔒 Route Guards**: Prevents unauthorized access to results page
- **📱 Responsive Design**: Fully optimized for desktop and mobile devices
- **🎨 Animated UI**: Smooth transitions and engaging visual feedback

### Challenge Types

1. **Math Challenges**: Select images with specific calculation results

   - Equals specific value (12, 15, 18)
   - Greater than threshold (> 20)
   - Less than threshold (< 10)

2. **Text Recognition**: Identify images containing specific words
   - VERIFY, HUMAN, ACCESS, VALID, SECURE

### User Experience

- ✅ Real-time validation feedback
- ⚠️ Attempt tracking (max 3 attempts per stage)
- 🔄 Progress restore on page refresh
- 🎉 Celebration animation on completion
- 📊 Detailed results summary

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm
- Angular CLI (v20.2.2)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SaddamHosyn/angul-It.git
   cd angul-It
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

### Run Tests

```bash
npm test
```

## 📁 Project Structure

```
angul-it/
├── src/
│   ├── app/
│   │   ├── captcha/          # CAPTCHA challenge component
│   │   │   ├── captcha.ts
│   │   │   ├── captcha.html
│   │   │   └── captcha.css
│   │   ├── home/             # Landing page
│   │   │   ├── home.ts
│   │   │   ├── home.html
│   │   │   └── home.css
│   │   ├── result/           # Results display
│   │   │   ├── result.ts
│   │   │   ├── result.html
│   │   │   └── result.css
│   │   ├── guards/           # Route protection
│   │   │   └── result-guard-guard.ts
│   │   ├── services/         # State management
│   │   │   └── captcha-state.ts
│   │   └── app.routes.ts     # Application routing
│   └── public/               # Static assets
├── angular.json              # Angular configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## 🎮 How It Works

### User Flow

1. **Home Page**

   - Welcome screen with project overview

2. **Challenge Stages** (3 total)

   - Stage 1: Random challenge generation
   - Stage 2: Different challenge type
   - Stage 3: Final verification
   - Each stage allows up to 3 attempts
   - Navigate between stages with Previous/Next buttons

3. **Results Page**
   - Stage-by-stage completion summary
   - Success indicators for each completed stage
   - Option to start new challenge
   - Return to home page

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 20.2
- **Language**: TypeScript 5.9
- **State Management**: Custom service with localStorage
- **Routing**: Angular Router with Guards
- **Styling**: Custom CSS with animations
- **SSR**: Angular Universal (Server-Side Rendering)
- **Build Tool**: Angular CLI with Vite

## 🎨 Key Features Explained

### Form Validation

- Users cannot proceed without selecting at least one image
- Validation feedback shown in real-time
- Maximum attempt limit prevents brute-force

### Progress Persistence

```typescript
// Save progress automatically
saveProgress(stage, selections, attempts, completed);

// Restore on page load
loadProgress(); // Returns saved state or null
```

### Route Protection

```typescript
// Prevents direct access to results without completion
canActivate: () => hasCompletedAllStages();
```

### Challenge Randomization

```typescript
// Fisher-Yates shuffle for true randomness
shuffleArray<T>(array: T[]): T[]

// Random challenge selection
generateCaptchaChallenges(): Challenge[]
```

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Saddam Hosyn**

- GitHub: [@SaddamHosyn](https://github.com/SaddamHosyn)

**Made with ❤️ using Angular**
