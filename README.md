# PayMate 2.0 - AI-Enhanced Digital Payment Platform

![PayMate 2.0 Banner](https://placehold.co/1200x400.png)

**PayMate 2.0** is a feature-rich, full-stack web application prototype for a modern digital payment platform. Built with Next.js, ShadCN UI, and Google's Genkit, it provides a seamless and secure user experience for managing financial transactions. The application integrates advanced AI capabilities, including a conversational support chatbot and smart transaction suggestions, to deliver an intelligent and intuitive payment solution.

## ✨ Core Features

- **Modern Authentication**: Secure and user-friendly signup and login flows.
- **Interactive Dashboard**: A central hub to view account balance, recent activities, and initiate quick transfers.
- **Versatile Money Transfers**:
    - Send money via **UPI ID** or directly to a **Bank Account**.
    - **QR Code Payments**: Scan QR codes using the device camera or upload an image to automate payment details.
- **Bill Payments**: A dedicated section for paying various utility bills and recharges (e.g., mobile, electricity, gas).
- **Comprehensive Transaction History**: A detailed, filterable, and searchable log of all past transactions.
- **Multi-Gateway Payment Processing**: Integrated with major payment providers:
    - **Stripe** for card payments.
    - **PayPal** for international payments (with automatic INR to USD conversion).
    - **Razorpay** for a wide range of payment methods.
- **AI-Powered Modules**:
    - **AI Support Chatbot**: An intelligent assistant to help users navigate the app and answer questions.
    - **Smart Suggestions**: AI-driven recommendations for recurring payments and bills based on transaction history.

## 🚀 Technology Stack

| Category      | Technology                                                                                                  |
|---------------|-------------------------------------------------------------------------------------------------------------|
| **Frontend**  | **Next.js (App Router)**, **React**, **TypeScript**, **ShadCN UI**, **Tailwind CSS**, **Lucide React** (icons) |
| **Backend**   | **Next.js API Routes**, **Firebase App Hosting**                                                            |
| **AI/ML**     | **Genkit**, **Google AI (Gemini)**                                                                            |
| **Payments**  | **Stripe**, **PayPal**, **Razorpay**                                                                        |
| **Form Mgt.** | **React Hook Form** & **Zod**                                                                               |

---

## 🏁 Getting Started

Follow these instructions to set up and run the project locally for development.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager
- A code editor like [VS Code](https://code.visualstudio.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/KrishanuGharami/PayMate-2.0.git
cd PayMate-2.0
```

### 2. Install Dependencies

Install all the required packages using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a new file named `.env` in the root of the project and add your API keys. You can use the `.env.example` file as a template.

```bash
# Get your API key from the Google AI Studio
# https://aistudio.google.com/app/apikey
GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY

# Stripe API Keys (https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY

# PayPal API Keys (https://developer.paypal.com/dashboard/applications/sandbox)
# Use 'test' for the public key if you don't have one
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID

# Razorpay API Keys (https://dashboard.razorpay.com/app/keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET_KEY
```
**Note:** The payment gateway integrations are currently mocked to work without real API keys. However, for the AI features to function, a valid `GEMINI_API_KEY` is required.

### 4. Run the Development Servers

This project requires two development servers to be running simultaneously: one for the Next.js frontend and one for the Genkit AI backend.

**Terminal 1: Start the Next.js App**
```bash
npm run dev
```
Your application will be running at `http://localhost:9002`.

**Terminal 2: Start the Genkit AI Server**
```bash
npm run genkit:dev
```
This starts the Genkit server, which the Next.js app will call for AI-related tasks.

## 📂 Project Structure

The project follows a standard Next.js App Router structure with some key directories:

```
src
├── app/                  # Main application routes and pages
│   ├── (app)/            # Authenticated user routes (dashboard, transfer, etc.)
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── api/              # API routes for payment processing
├── ai/                   # Genkit AI flows and configuration
│   ├── flows/            # AI-powered feature definitions
│   └── genkit.ts         # Genkit initialization
├── components/           # Reusable React components
│   ├── ui/               # ShadCN UI components
│   └── payment-gateways/ # Components for Stripe, PayPal, Razorpay
├── hooks/                # Custom React hooks (e.g., useToast)
└── lib/                  # Utility functions
```

## 🤖 AI Features Overview

PayMate 2.0 leverages **Genkit** and **Google Gemini** to provide intelligent features:

1.  **AI Chatbot Support (`/support`)**: The `ai-chatbot-support.ts` flow defines a prompt that gives the Gemini model a persona as a helpful support agent for PayMate 2.0. The model is provided with a summary of the app's features and can guide users to the correct pages to perform actions.

2.  **Smart Transaction Suggestions (Dashboard)**: The `smart-transaction-suggestions.ts` flow analyzes a user's (mock) transaction history and uses an AI prompt to generate personalized suggestions for future payments, such as recurring bills or frequent purchases.

## ☁️ Deployment

This application is pre-configured for deployment on **Firebase App Hosting**. The `apphosting.yaml` file at the root of the project contains the necessary configuration for a seamless deployment experience.

## Conclusion

This project focused on the development of an AI-enhanced digital payment platform designed to offer a secure, intuitive, and intelligent user experience. With the growing expectation for smarter financial tools, a system that combines versatile payment options with robust AI assistance provides significant value.

The solution uses a modern web stack to deliver a seamless payment experience, including transfers via UPI, bank accounts, and QR codes. A key feature is the integration of an AI assistant powered by **Google's Genkit framework and the Gemini model**. This allows users to receive instant support through a natural language chatbot and get personalized payment suggestions based on their transaction history, making financial management more accessible and efficient.

From a development perspective, the system employs:
*   **Frontend:** Next.js with Tailwind CSS and ShadCN UI for a responsive, modern interface.
*   **Backend:** Next.js API Routes for handling server-side logic and payment processing.
*   **Database:** LocalStorage is used to mock user data persistence for this prototype.
*   **AI Layer:** Genkit orchestrates interactions with the Google Gemini model for all intelligent features.

The **Conversational Agile** development model was followed, enabling rapid prototyping, flexibility, and feedback-driven improvements throughout the project lifecycle.

**Key Outcomes:**
*   A fully-featured (mocked) payment system supporting multiple gateways.
*   A helpful, real-time AI chatbot for user support and navigation.
*   Personalized, AI-driven transaction suggestions to enhance user experience.
*   A scalable, responsive, and accessible web-based platform.
