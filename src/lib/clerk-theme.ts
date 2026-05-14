import type { Appearance } from '@clerk/types';

/**
 * Shared Clerk theme matching the PayMate 2.0 purple-glow dark aesthetic.
 * Primary:  hsl(250, 75%, 60%)  →  #7c3aed-ish vibrant purple
 * Card BG:  hsl(240, 5.9%, 10%) →  deep dark surface
 */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: 'hsl(250, 75%, 60%)',
    colorTextOnPrimaryBackground: 'hsl(210, 40%, 98%)',
    colorBackground: 'hsl(240, 5.9%, 10%)',
    colorText: 'hsl(210, 40%, 98%)',
    colorTextSecondary: 'hsl(215, 20.2%, 65.1%)',
    colorInputBackground: 'hsl(217.2, 32.6%, 17.5%)',
    colorInputText: 'hsl(210, 40%, 98%)',
    colorDanger: 'hsl(0, 72%, 51%)',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    // Root & Card
    rootBox: 'mx-auto w-full max-w-md',
    card: [
      'shadow-2xl',
      'bg-[hsl(240,5.9%,10%)]/80',
      'backdrop-blur-xl',
      'border border-[hsl(250,75%,60%)]/20',
      'rounded-xl',
    ].join(' '),
    cardBox: 'shadow-none',

    // Header
    headerTitle: 'text-2xl font-bold text-[hsl(210,40%,98%)]',
    headerSubtitle: 'text-[hsl(215,20.2%,65.1%)]',

    // Inputs
    formFieldInput: [
      'bg-[hsl(217.2,32.6%,17.5%)]',
      'border-[hsl(217.2,32.6%,17.5%)]',
      'text-[hsl(210,40%,98%)]',
      'placeholder:text-[hsl(215,20.2%,65.1%)]',
      'focus:ring-2 focus:ring-[hsl(250,75%,60%)] focus:border-[hsl(250,75%,60%)]',
      'rounded-md',
    ].join(' '),
    formFieldLabel: 'text-[hsl(210,40%,98%)] font-medium text-sm',

    // Primary Button (purple glow)
    formButtonPrimary: [
      'bg-[hsl(250,75%,60%)]',
      'hover:bg-[hsl(250,75%,55%)]',
      'text-[hsl(210,40%,98%)]',
      'shadow-[0_0_20px_hsl(250,75%,60%,0.4)]',
      'hover:shadow-[0_0_30px_hsl(250,75%,60%,0.6)]',
      'transition-all duration-300',
      'font-semibold',
      'rounded-md',
    ].join(' '),

    // Social Buttons
    socialButtonsBlockButton: [
      'bg-[hsl(217.2,32.6%,17.5%)]',
      'border-[hsl(217.2,32.6%,22.5%)]',
      'text-[hsl(210,40%,98%)]',
      'hover:bg-[hsl(217.2,32.6%,22.5%)]',
      'transition-all duration-200',
      'rounded-md',
    ].join(' '),
    socialButtonsBlockButtonText: 'text-[hsl(210,40%,98%)] font-medium',

    // Divider
    dividerLine: 'bg-[hsl(217.2,32.6%,17.5%)]',
    dividerText: 'text-[hsl(215,20.2%,65.1%)]',

    // Footer links
    footerActionLink: 'text-[hsl(250,75%,60%)] hover:text-[hsl(250,75%,70%)] font-semibold',
    footerActionText: 'text-[hsl(215,20.2%,65.1%)]',

    // OTP Input
    otpCodeFieldInput: [
      'bg-[hsl(217.2,32.6%,17.5%)]',
      'border-[hsl(217.2,32.6%,22.5%)]',
      'text-[hsl(210,40%,98%)]',
      'focus:ring-2 focus:ring-[hsl(250,75%,60%)]',
    ].join(' '),

    // User Button & Profile
    avatarBox: 'ring-2 ring-[hsl(250,75%,60%)]/40',
    userButtonPopoverCard: [
      'bg-[hsl(240,5.9%,10%)]',
      'border border-[hsl(250,75%,60%)]/20',
      'shadow-xl',
    ].join(' '),
    userButtonPopoverActionButton: 'text-[hsl(210,40%,98%)] hover:bg-[hsl(217.2,32.6%,17.5%)]',
    userButtonPopoverActionButtonText: 'text-[hsl(210,40%,98%)]',
    userButtonPopoverFooter: 'hidden',

    // Identity Preview (email shown after first step)
    identityPreview: 'bg-[hsl(217.2,32.6%,17.5%)] rounded-md',
    identityPreviewText: 'text-[hsl(210,40%,98%)]',
    identityPreviewEditButton: 'text-[hsl(250,75%,60%)]',

    // Alert & form errors
    formFieldErrorText: 'text-[hsl(0,72%,51%)]',
    alert: 'bg-[hsl(0,72%,51%)]/10 border-[hsl(0,72%,51%)]/30 text-[hsl(0,72%,70%)]',
  },
};
