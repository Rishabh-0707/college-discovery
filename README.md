# CollegeDiscover

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
Create a `.env` file in the root directory and add the following variables:
```env
DATABASE_URL="postgresql://username:password@your-db-host/database?sslmode=require"
NEXTAUTH_SECRET="your-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
Push the Prisma schema to your database and seed it with the initial college data:
```bash
npx prisma db push
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Deployment (Render)

This application is optimized for deployment on Render.
1. Connect this repository to a new Render **Web Service**.
2. Add your `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` environment variables.
3. Set the Build Command: `npm install && npx prisma generate && npx prisma db push && npm run build`
4. Set the Start Command: `npm run start`

---
*Built with precision for the modern student.*
