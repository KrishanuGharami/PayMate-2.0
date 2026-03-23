# PayMate 2.0 - AI-Enhanced Digital Payment Platform

![PayMate 2.0 Banner](https://placehold.co/1200x400.png)

**PayMate 2.0** is an advanced, full-stack digital payment prototype designed for security, speed, and intelligence. Re-engineered with modern UI/UX principles, it leverages **Next.js**, **ShadCN**, and **Google Genkit** to deliver a premium financial experience.

## ✨ New in 2.0 (Phase-II Upgrades)

- **🚀 Performance Optimized**: Faster QR scanning simulation and streamlined payment flows.
- **🛡️ Secure-First Architecture**: 
    - **AI Fraud Detection**: Real-time transaction risk scoring.
    - **Multi-Factor Auth (MFA)**: Secure OTP verification during login.
    - **Session Guardian**: Automatic timeout and activity monitoring.
- **📱 Advanced UX**:
    - **Real-time Progress Tracker**: Visual stepper during transaction processing.
    - **Smart Error Handling**: Contextual feedback and one-click retries.
    - **Responsive Modern Design**: A high-contrast dark theme with elegant gradients.
- **🧠 AI-Powered Intelligence**:
    - **Smart Suggestions**: Behavioral analysis for recurring bill reminders.
    - **Intelligent Support**: Chatbot with deep link navigation.

## 🚀 Technology Stack

| Category      | Technology                                                                                                  |
|---------------|-------------------------------------------------------------------------------------------------------------|
| **Frontend**  | **Next.js 15 (App Router)**, **React 18**, **TypeScript**, **ShadCN UI**, **Tailwind CSS** |
| **Backend**   | **Next.js Server Actions**, **API Routes** |
| **AI/ML**     | **Genkit**, **Google Gemini 1.5 Flash** |
| **Payments**  | **Stripe**, **PayPal**, **Razorpay** (Integrated Mocks) |

---

## 🏁 Getting Started

### 1. Set Up Environment
Create a `.env` file in the root:
```bash
GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=test
NEXT_PUBLIC_PAYPAL_CLIENT_ID=test
NEXT_PUBLIC_RAZORPAY_KEY_ID=test
```

### 2. Run Servers
**Next.js Frontend:**
```bash
npm run dev
```

**Genkit AI Engine:**
```bash
npm run genkit:dev
```

## 📂 Architecture
- `/src/ai/flows/`: Logic for Fraud Detection, Support, and Suggestions.
- `/src/app/(app)/`: Secured routes for Dashboard, Transfer, and History.
- `/src/components/payment-gateways/`: Multi-gateway processing logic.

## 🔒 Security Notice
This is a prototype. Payment gateways are running in **mock mode**. Real API keys are required for production-level processing. The AI engine requires a valid Gemini API key.

```
Developed with ❤️ by the PayMate 2.0 Team
```