# Retinal-AI Medical Platform

A comprehensive AI-powered retinal disease diagnosis platform with role-based authentication, professional medical workflows, and deep learning integration capabilities.

## 🏥 Features

- **AI-Powered Analysis**: Advanced retinal image analysis with medical-grade precision
- **Role-Based Access**: Separate dashboards for Doctors, Patients, and Administrators
- **Medical Workflows**: Professional appointment booking, patient management, and reporting
- **Deep Learning Ready**: AI/ML model training interface for retinal disease diagnosis
- **Persistent Sessions**: Secure session management with auto-logout
- **Medical-Grade UI**: WCAG 2.1 AA compliant design with healthcare color palette

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

### Installation Steps

#### 1. Download the Project

**Option A: Direct Download**
1. Copy all the code files from Figma Make to your local machine
2. Create a new folder called `retinal-ai-platform`
3. Copy the entire file structure as shown below

**Option B: Create from scratch**
1. Create a new React TypeScript project:
```bash
npx create-react-app retinal-ai-platform --template typescript
cd retinal-ai-platform
```

#### 2. Set Up Project Structure

Create the following folder structure in your project directory:

```
retinal-ai-platform/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── AuthPage.tsx
│   │   ├── CommonPages.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── EnhancedVisionChatBot.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── UserDashboard.tsx
│   │   ├── VisionChatBot.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/
│   │       ├── [all shadcn components]
│   ├── services/
│   │   └── dataStore.js
│   └── styles/
│       └── globals.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

#### 3. Install Dependencies

Install all required dependencies by running:

```bash
npm install
```

**Required Dependencies:**
```bash
# Core React dependencies
npm install react react-dom react-router-dom

# TypeScript types
npm install -D @types/react @types/react-dom @types/node

# UI and Styling
npm install tailwindcss@4.0.0-alpha.25 @tailwindcss/forms
npm install lucide-react
npm install sonner@2.0.3
npm install motion

# Chart libraries
npm install recharts

# Form handling
npm install react-hook-form@7.55.0

# Additional utilities
npm install clsx class-variance-authority

# Development dependencies
npm install -D typescript @types/react @types/react-dom
```

#### 4. Configure Package.json

Update your `package.json` with the following scripts:

```json
{
  "name": "retinal-ai-platform",
  "version": "1.0.0",
  "description": "AI-powered retinal disease diagnosis platform",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "tailwindcss": "4.0.0-alpha.25",
    "lucide-react": "^0.263.1",
    "recharts": "^2.8.0",
    "sonner": "^2.0.3",
    "motion": "^10.16.0",
    "react-hook-form": "^7.55.0",
    "clsx": "^1.2.1",
    "class-variance-authority": "^0.7.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

#### 5. Configure Tailwind CSS

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#0A3D62',
        'medical-blue-light': '#1E5F8B',
        'medical-blue-lighter': '#E3F2FD',
        'health-green': '#27AE60',
        'health-green-light': '#52C882',
        'health-green-lighter': '#E8F5E8',
        'accent-red': '#E74C3C',
        'accent-red-light': '#EC7063',
        'accent-red-lighter': '#FADBD8'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
```

#### 6. Update src/index.tsx

Create or update `src/index.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 7. Update public/index.html

Update `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0A3D62" />
    <meta name="description" content="AI-powered retinal disease diagnosis platform" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Retinal-AI Medical Platform</title>
    
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

#### 8. Copy All Source Files

Copy all the TypeScript files from the Figma Make project:

1. Copy `App.tsx` to `src/App.tsx`
2. Copy all component files to `src/components/`
3. Copy `dataStore.js` to `src/services/`
4. Copy `globals.css` to `src/styles/`
5. Copy all UI components to `src/components/ui/`

### 🏃‍♂️ Running the Project

1. **Start the development server:**
```bash
npm start
```

2. **Open your browser and navigate to:**
```
http://localhost:3000
```

3. **The application should load with the landing page**

### 🔐 Default Login Credentials

The application comes with pre-configured demo accounts:

**Doctor Account:**
- Email: `sarah.johnson@retinalai.com`
- Password: `doctor123`

**Admin Account:**
- Email: `admin@retinalai.com`
- Password: `admin123`

**Patient Account:**
- Email: `john.smith@email.com`
- Password: `patient123`

### 🛠️ Development

#### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

#### Project Structure Explanation

```
src/
├── components/           # All React components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── figma/           # Figma-specific components
│   └── [pages]          # Main page components
├── services/            # Data management and API services
├── styles/              # Global CSS and styling
└── App.tsx             # Main application component
```

### 📦 Building for Production

To create a production build:

```bash
npm run build
```

This will create a `build` folder with optimized production files.

### 🔧 Troubleshooting

#### Common Issues:

1. **Node.js Version Issues:**
   - Ensure you're using Node.js 18.0 or higher
   - Check version: `node --version`

2. **Dependency Installation Errors:**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

3. **TypeScript Compilation Errors:**
   - Ensure all `.tsx` files are properly typed
   - Check `tsconfig.json` configuration

4. **Tailwind CSS Not Loading:**
   - Verify `globals.css` is imported in `index.tsx`
   - Check `tailwind.config.js` content paths

5. **Router Issues:**
   - Ensure all route components are properly imported
   - Check that `BrowserRouter` is wrapping the app

#### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all dependencies are installed correctly
3. Ensure the file structure matches the requirements
4. Check that all imports are correctly typed and available

### 🚀 Next Steps

After setting up locally, you can:

1. **Customize the UI** - Modify components and styling
2. **Add Real Backend** - Integrate with actual medical databases
3. **Implement ML Models** - Add real AI/ML retinal analysis
4. **Deploy to Production** - Host on cloud platforms
5. **Add More Features** - Extend functionality as needed

### 📄 License

This project is for educational and development purposes. Ensure compliance with medical software regulations before production use.

### 🏥 Medical Disclaimer

This application is for educational purposes only and should not be used for actual medical diagnosis without proper validation and regulatory approval.