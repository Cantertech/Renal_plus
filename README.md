# Renal Plus - Kidney Health Mobile App

A comprehensive kidney health monitoring application with AI-powered features.

## Features

- 🏥 Health Tracking: Monitor kidney health test results and vital signs
- 🍎 Food Analysis: Scan foods to get kidney-friendly recommendations
- 💧 Hydration Tracker: Track daily water intake
- 🤖 AI Assistant: Get personalized health insights and recommendations
- 🎮 Educational Games: Learn about kidney health through interactive games
- 👨‍⚕️ Doctor Consultations: Find and book appointments with kidney specialists

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI analysis and recommendations
- **localStorage** - Data persistence

## Prerequisites

- Node.js 18 or higher
- A Google Gemini API key

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variable:
   - Go to Site settings → Environment variables
   - Add `GEMINI_API_KEY` with your API key
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

4. The app will be deployed and you'll get a URL

### Required Environment Variables on Netlify

Make sure to add these in Netlify dashboard → Site settings → Environment variables:

- `GEMINI_API_KEY` - Your Google Gemini API key

## Project Structure

```
renal-plus-mobile-app/
├── components/          # React components
│   ├── auth/           # Authentication screens
│   ├── games/          # Educational games
│   ├── main/           # Main app screens
│   ├── profile/        # User profile screens
│   └── wellness/       # Wellness tracking
├── services/           # API services
├── types.ts           # TypeScript type definitions
├── constants.ts       # App constants and translations
├── App.tsx            # Main app component
└── vite.config.ts     # Vite configuration
```

## Key Changes from Firebase to Local Storage

This app uses `localStorage` for data persistence instead of Firebase:
- User authentication is handled locally
- Test results, vitals, and history are stored in browser localStorage
- No API keys or external services required for basic functionality
- AI features require Gemini API key

## License

MIT
