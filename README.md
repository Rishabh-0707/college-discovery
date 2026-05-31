# CollegeQ

A premium, full-stack college discovery and comparison platform built with modern web technologies. Designed with an elegant, academic aesthetic inspired by top-tier global universities.

## ✨ Features

- **🎓 Academic Aesthetic:** Clean, sophisticated UI featuring Playfair Display typography, crisp white backgrounds, and deep red accents.
- **🔍 Advanced Search & Discovery:** Debounced searching with robust filtering by institution type, fees, and ratings.
- **⚖️ Comparison Matrix:** A powerful side-by-side comparison engine allowing users to stack up to 3 colleges against each other in real-time.
- **🔐 Secure Authentication:** Full credential-based login and registration system powered by NextAuth v5 and bcryptjs.
- **🔖 Saved Institutions:** Authenticated users can bookmark colleges for future reference in their private dashboard.
- **⚡ Optimized Architecture:** Built on Next.js App Router with server-side data fetching, robust caching, and connection-pooled database queries.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, TailwindCSS v4, Zustand (State Management), Lucide React (Icons).
- **Backend:** Next.js Route Handlers (Serverless APIs).
- **Database:** PostgreSQL (Hosted on Render).
- **ORM:** Prisma.
- **Authentication:** NextAuth.js (v5 Beta).

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed. You will also need a PostgreSQL database.

### 1. Clone the repository
```bash
git clone https://github.com/Rishabh-0707/college-discovery.git
cd college-discovery
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the provided `.env.example` file to create your own `.env` file:
```bash
cp .env.example .env
```
Update `.env` with your actual values:
- `DATABASE_URL`: Your PostgreSQL connection string (must include `sslmode=require` for production)
- `AUTH_SECRET`: A secure random string (generate with `openssl rand -hex 32`)
- `AUTH_URL`: Your application URL (e.g., `http://localhost:3000` for local dev)

### 4. Database Setup
The repository includes a convenience script to seed the database with initial college data:
```bash
npx prisma db push
npm run db:seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Deployment (Render)

This application is fully optimized for production deployment on Render. The repository includes an Infrastructure-as-Code configuration (`render.yaml`) and proper build scripts.

### Steps to Deploy:
1. Go to **Render** and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Environment:** `Node`
   - **Build Command:** `npm install --include=dev && npm run build:prod`
   - **Start Command:** `npm start`
4. Add the following **Environment Variables** in the Render dashboard:
   - `DATABASE_URL` (Your production PostgreSQL URL)
   - `AUTH_SECRET` (A 64-character random hex string)
   - `AUTH_URL` (Your Render deployment URL, e.g., `https://your-app-name.onrender.com`)
   - `NODE_ENV` set to `production`
5. **Deploy!** The `build:prod` script automatically generates the Prisma client, pushes schema updates, and builds the Next.js app.

---
*Built with precision for the modern student.*
