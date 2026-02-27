# TalentTrace AI

TalentTrace is a high-performance career optimization platform built with the latest web technologies.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Engine**: [Genkit](https://firebase.google.com/docs/genkit) powered by **Google Gemini 1.5 Flash**
- **Backend**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Icons**: [Lucide React](https://lucide.dev/)

## Features

- **Resume Optimizer**: AI-driven feedback and Job Readiness Scoring.
- **ATS Compatibility**: Detailed analysis of how resume parsing algorithms see your profile.
- **Job Match Tool**: Real-time comparison between your skills and job descriptions.
- **Analysis History**: Secure storage of your previous reports via Firestore (Authenticated mode).
- **Modern Dashboard**: A clean, responsive workspace for career growth.

## Deployment Root Files

For deploying TalentTrace to **Firebase App Hosting**, the following root files are essential:

1.  `/package.json`: Contains the `build` and `start` scripts required for the production environment.
2.  `/apphosting.yaml`: Configures the App Hosting runtime (e.g., max instances).
3.  `/next.config.ts`: Defines the build-time configuration for the Next.js framework.
4.  `/src/app/layout.tsx`: The root layout file for the user interface and context providers.
5.  `/src/app/page.tsx`: The entry point for the web application.

## Getting Started

1.  Explore the dashboard tools directly.
2.  Paste your resume text into the Optimizer or Match tool.
3.  Review the AI-generated insights and readiness scores.
