# Winway Computers - Frontend Application

This directory houses the React, TypeScript, and Vite-powered frontend for the Winway Computers application.

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v16 or higher is recommended).

### 2. Installation
Install the necessary npm dependencies:
```bash
npm install
```

### 3. Running the Development Server
Launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will run locally at `http://localhost:5173`.

### 4. Build for Production
To bundle the application for production deployment:
```bash
npm run build
```
The compiled, production-ready static assets will be outputted to the `dist/` directory, which can be served using static hosts like Nginx, Netlify, or Vercel.

## Key Features & Customizations

- **Smooth Single-Page Anchor Navigation**: Allows seamless transit between sections (Home, Services, Products, Contact).
- **Dynamic Scroll Spy Header**: Automatically highlights the active link in the navigation header as you scroll through different sections of the landing page.
- **Login Visibility Controls**: The Admin Login page includes a password unmasking/masking visibility toggle button.
- **Optimized Layout Aesthetics**: Tailored typography, curated CSS design system tokens, and fully optimized brand logo sizing.
- **Hero Banner configuration preview**: Admin Dashboard allows configuring storefront banners.
