# PayMate 2.0 — AI-Enhanced Digital Payment Platform

![PayMate Banner](https://github.com/user-attachments/assets/5e4b0c8a-ec3e-4439-8947-4acd3547fb3b)

**PayMate 2.0** is a production-grade, full-stack digital payment platform built with Next.js, Firebase, Clerk, and Google Genkit. It features enterprise-level security with JWT-based session management, AI-powered fraud detection, real-time transaction tracking via Firestore, and a beautiful dark-mode UI with a signature purple-glow aesthetic.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://paymate-2-0.vercel.app)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://console.firebase.google.com/project/paymate-2-prod)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Clerk Authentication** — Full login, signup, MFA, OAuth (Google), and profile management via Clerk
- **Route Protection** — Server-side middleware guards all authenticated routes
- **Rate Limiting** — Upstash Redis-based rate limiting on login and payment endpoints
- **Secure Sessions** — Clerk-managed JWT sessions with automatic idle timeout & forced logout
- **AI Fraud Detection** — Genkit-powered fraud analysis blocks suspicious transactions in real time

### 💳 Payments
- **Multi-Gateway Support** — Stripe, PayPal, and Razorpay integrations
- **Robust Payment Pipeline** — Queue-based payment processing with idempotency keys via Redis
- **Transaction Tracking** — Real-time status tracking (PENDING → COMPLETED/FAILED) in Firestore
- **Payment Reminders** — Dashboard widget for upcoming bills with one-click "Pay Now"
- **QR Code Payments** — Scan via camera or upload QR image to auto-fill payment details

### 🤖 AI-Powered Features
- **Fraud Detection Engine** — Analyzes transaction amount, recipient history, and behavioral patterns using Gemini AI
- **Smart Support Chatbot** — Context-aware AI assistant at `/support` that understands your transaction history
- **Smart Suggestions** — AI-driven recommendations for recurring payments based on spending patterns
- **Post-Failure Assistance** — Blocked/failed payments link directly to the AI chatbot with full context injected

### 📊 Dashboard & History
- **Live Transaction Feed** — Recent Activity widget pulls real data from Firestore (with demo seed fallback)
- **Full Transaction History** — Searchable, filterable table with status badges and date formatting
- **Financial Overview** — Balance display, monthly growth indicators, and quick-action cards

### 🎨 Design
- **Dark Mode First** — Signature purple-glow glassmorphism aesthetic throughout
- **Responsive Layout** — Collapsible sidebar, mobile-optimized forms, and adaptive grids
- **Themed Clerk UI** — Custom-styled authentication pages matching the app's visual identity
- **Micro-animations** — Smooth transitions, hover effects, and loading states

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js App Router · React · TypeScript · ShadCN · Tailwind │
│  Clerk <SignIn/> · <UserButton/> · useUser()                 │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    MIDDLEWARE                                 │
│  Clerk Auth Guard · Route Protection · Session Validation    │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                   API ROUTES                                 │
│  /api/payments/initiate  → Idempotency + Fraud + Queue       │
│  /api/user/transactions  → Firestore Query + Seed Fallback   │
└────────┬─────────────┬───────────────────┬───────────────────┘
         │             │                   │
    ┌────▼────┐   ┌────▼────┐        ┌────▼────┐
    │ Firebase │   │  Redis  │        │  Genkit │
    │Firestore │   │ Upstash │        │ Gemini  │
    │  Admin   │   │  Cache  │        │   AI    │
    └─────────┘   └─────────┘        └─────────┘
```

---

## 🚀 Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React, TypeScript, ShadCN UI, Tailwind CSS, Lucide Icons |
| **Authentication** | Clerk (OAuth, MFA, Session Management, User Profiles) |
| **Backend** | Next.js API Routes, Firebase Admin SDK |
| **Database** | Cloud Firestore (transactions, user data) |
| **Cache/Queue** | Upstash Redis (idempotency keys, rate limiting) |
| **AI/ML** | Google Genkit, Gemini AI (fraud detection, chatbot, suggestions) |
| **Payments** | Stripe, PayPal, Razorpay |
| **Deployment** | Vercel (frontend), Firebase (backend services) |
| **Forms** | React Hook Form, Zod validation |

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- A [Clerk](https://dashboard.clerk.com) account
- A [Firebase](https://console.firebase.google.com) project

### 1. Clone & Install

```bash
git clone https://github.com/KrishanuGharami/PayMate-2.0.git
cd PayMate-2.0
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk Routing
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (server-side)
FIREBASE_PROJECT_ID=your_project_id

# Google AI (for Genkit flows)
GEMINI_API_KEY=your_gemini_api_key

# Upstash Redis (rate limiting & idempotency)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Payment Gateways (mocked — optional for demo)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (app)/                    # Authenticated routes
│   │   ├── dashboard/            # Home dashboard + widgets
│   │   ├── transfer/             # Money transfer flows
│   │   ├── bills/                # Bill payments
│   │   ├── history/              # Transaction history table
│   │   ├── support/              # AI chatbot support
│   │   ├── payment/              # Payment processing page
│   │   └── layout.tsx            # Auth layout with idle timeout
│   ├── login/[[...sign-in]]/     # Clerk Sign-In page
│   ├── signup/[[...sign-up]]/    # Clerk Sign-Up page
│   ├── api/
│   │   ├── payments/initiate/    # Robust payment endpoint
│   │   ├── user/transactions/    # Transaction history API
│   │   └── payment/              # Gateway-specific endpoints
│   └── layout.tsx                # Root layout with ClerkProvider
├── ai/
│   ├── flows/                    # Genkit AI flow definitions
│   │   ├── fraud-detection-flow.ts
│   │   ├── ai-chatbot-support.ts
│   │   └── smart-transaction-suggestions.ts
│   └── genkit.ts                 # Genkit initialization
├── components/
│   ├── ui/                       # ShadCN UI components
│   ├── payment-gateways/         # Stripe, PayPal, Razorpay
│   └── app-sidebar.tsx           # Sidebar with Clerk UserButton
├── lib/
│   ├── auth.ts                   # Rate limiting utilities
│   ├── clerk-theme.ts            # Clerk purple-glow theme
│   ├── firebase.ts               # Firebase client (lazy init)
│   ├── firebase-admin.ts         # Firebase Admin SDK
│   └── redis.ts                  # Upstash Redis client
├── hooks/                        # Custom React hooks
└── middleware.ts                  # Clerk route protection
```

---

## 🤖 AI Features Deep Dive

### Fraud Detection Engine
The `/api/payments/initiate` endpoint runs every transaction through the Genkit `detectFraud` flow before processing. It:
1. Queries the user's last 20 completed transactions from Firestore
2. Calculates average spending and frequent recipients
3. Sends the profile + current transaction to Gemini for risk analysis
4. Blocks transactions with a risk score above threshold (HTTP 403)

### Smart Support Chatbot
The `/support` page features a context-aware AI assistant. When a user arrives from a failed/blocked payment, the chatbot automatically receives the transaction context (amount, recipient, failure reason) and provides personalized troubleshooting.

### Smart Suggestions
The dashboard's Smart Suggestions widget analyzes transaction patterns and uses Gemini to recommend upcoming payments, recurring bills, and savings opportunities.

---

## ☁️ Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to Vercel's project settings
4. Deploy — Vercel auto-detects Next.js and builds accordingly

### Firebase Services

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

---

## 🔒 Security Architecture

| Layer | Implementation |
|---|---|
| **Authentication** | Clerk (OAuth, Email/Password, MFA) |
| **Route Protection** | Clerk middleware on all `/dashboard/*` routes |
| **API Security** | `auth()` from `@clerk/nextjs/server` on every API route |
| **Rate Limiting** | Upstash Redis — 5 req/10s (auth), 3 req/60s (payments) |
| **Idempotency** | Redis-backed UUID keys prevent duplicate transactions |
| **Fraud Detection** | AI-powered real-time analysis before payment processing |
| **Session Timeout** | 5-minute idle timer with warning dialog |
| **Data Validation** | Zod schemas on all API inputs |

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/KrishanuGharami">Krishanu Gharami</a>
</p>
