# 🤖 Angul-It - Interactive CAPTCHA Challenge

A modern, interactive CAPTCHA application built with **Angular 20** that challenges users to prove they're human through a series of image selection tasks. This project demonstrates advanced Angular features including standalone components, route guards, state management, and responsive design.

[![Angular](https://img.shields.io/badge/Angular-20.2.0-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

### 🎯 Core Functionality

- **Multi-Stage CAPTCHA Challenges** - Three progressive stages with different image recognition tasks
- **Smart Validation System** - Real-time feedback with attempt tracking (3 attempts per stage)
- **Progress Persistence** - Automatic save/restore functionality using browser storage
- **Route Protection** - Guard-based navigation to ensure proper user flow
- **Performance Tracking** - Time tracking and completion percentage calculation
- **Responsive Design** - Mobile-first approach with seamless desktop experience

### 🏗️ Technical Highlights

- ✅ **Standalone Components** - Modern Angular architecture
- 🔒 **Route Guards** - Prevent unauthorized access to results page
- 💾 **State Management Service** - Centralized state handling with persistence
- 🎨 **SVG-based Images** - Lightweight, scalable graphics
- ♿ **Accessibility** - Semantic HTML and ARIA attributes
- 🚀 **Server-Side Rendering (SSR)** - Angular Universal support

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 18.x or higher ([Download](https://nodejs.org/))
- **npm** - Version 9.x or higher (comes with Node.js)
- **Angular CLI** - Version 20.x (optional, will be installed with dependencies)

Verify your installations:

```bash
node --version  # Should output v18.x or higher
npm --version   # Should output v9.x or higher
```

## 📦 Installation

### Step 1: Clone or Navigate to the Repository

```bash
cd d:\Projects\angul-it\angul-it
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Angular 20 framework and libraries
- TypeScript compiler
- Development tools and testing frameworks

### Step 3: Verify Installation

```bash
npm list --depth=0
```

## 🚀 Usage

### Starting the Development Server

**Option 1: Using npm script (Recommended)**

```bash
npm start
```

**Option 2: Using Angular CLI directly**

```bash
ng serve
```

The development server will start on `http://localhost:4200/`. The application will automatically reload if you make changes to any source files.

### Accessing the Application

1. Open your browser and navigate to **http://localhost:4200/**
2. Click "Start Challenge" on the home page
3. Complete the three CAPTCHA stages:
   - **Stage 1**: Select all images with CARS 🚗
   - **Stage 2**: Select all images with TRAFFIC LIGHTS 🚦
   - **Stage 3**: Select all images with CROSSWALKS 🚶
4. View your results and performance metrics

### User Flow

```
Home Page → CAPTCHA Challenge (3 Stages) → Results Page
    ↑              ↓ (auto-save)                 ↓
    └──────────── Start New Challenge ───────────┘
```

## 📁 Project Structure

```
angul-it/
├── src/
│   ├── app/
│   │   ├── captcha/              # Main CAPTCHA challenge component
│   │   │   ├── captcha.ts        # Component logic with 3 stages
│   │   │   ├── captcha.html      # Template with image grid
│   │   │   ├── captcha.css       # Styling
│   │   │   └── captcha.spec.ts   # Unit tests
│   │   │
│   │   ├── home/                 # Landing page component
│   │   │   ├── home.ts
│   │   │   ├── home.html
│   │   │   ├── home.css
│   │   │   └── home.spec.ts
│   │   │
│   │   ├── result/               # Results display component
│   │   │   ├── result.ts         # Performance metrics & completion
│   │   │   ├── result.html
│   │   │   ├── result.css
│   │   │   └── result.spec.ts
│   │   │
│   │   ├── services/             # Shared services
│   │   │   ├── captcha-state.ts  # State management & persistence
│   │   │   └── captcha-state.spec.ts
│   │   │
│   │   ├── guards/               # Route protection
│   │   │   ├── result-guard-guard.ts  # Prevents direct result access
│   │   │   └── result-guard-guard.spec.ts
│   │   │
│   │   ├── app.config.ts         # Application configuration
│   │   ├── app.routes.ts         # Routing configuration
│   │   └── app.ts                # Root component
│   │
│   ├── index.html                # Main HTML file
│   ├── main.ts                   # Application entry point
│   ├── styles.css                # Global styles
│   └── server.ts                 # SSR server configuration
│
├── public/                       # Static assets
├── angular.json                  # Angular workspace config
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🎯 Features In-Depth

### CAPTCHA Challenge System

The application implements a sophisticated multi-stage CAPTCHA system:

**Challenge Structure:**

- Each stage presents 9 images in a 3x3 grid
- Users must identify and select images matching specific criteria
- Three attempts are allowed per stage
- Incorrect selections are highlighted in red
- Correct answers are shown after validation

**CaptchaState Service** provides:

- Progress tracking across page refreshes
- LocalStorage-based persistence
- Start time recording for performance metrics
- Restore functionality for interrupted sessions

**ResultGuard** ensures:

- Users can't access results without completing challenges
- Maintains proper application flow
- Redirects unauthorized access back to home page


### Test Files

All unit test files are written in **TypeScript** and follow the `*.spec.ts` naming convention:

- `src/app/captcha/captcha.spec.ts` - Tests for CAPTCHA component
- `src/app/home/home.spec.ts` - Tests for Home component
- `src/app/result/result.spec.ts` - Tests for Result component
- `src/app/services/captcha-state.spec.ts` - Tests for state service
- `src/app/guards/result-guard-guard.spec.ts` - Tests for route guard

> **Note**: `.spec.ts` files are test specification files (unit tests), while `.ts` files are the actual application code.

## 🔨 Technologies

### Core Framework

- **Angular 20.2.0** - Modern web framework
- **TypeScript 5.9.2** - Type-safe JavaScript
- **RxJS 7.8.0** - Reactive programming

### Angular Modules

- `@angular/core` - Core framework
- `@angular/common` - Common directives and pipes
- `@angular/router` - Client-side routing
- `@angular/forms` - Form handling
- `@angular/platform-browser` - Browser platform
- `@angular/ssr` - Server-side rendering


## 📝 Available Scripts

| Script               | Command                                        | Description              |
| -------------------- | ---------------------------------------------- | ------------------------ |
| `start`              | `ng serve`                                     | Start development server |
| `build`              | `ng build`                                     | Build the application    |
| `watch`              | `ng build --watch --configuration development` | Build in watch mode      |
| `test`               | `ng test`                                      | Run unit tests           |
| `serve:ssr:angul-it` | `node dist/angul-it/server/server.mjs`         | Run SSR server           |


## 🤝 Contributing

Contributions are welcome!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ using Angular 20**
