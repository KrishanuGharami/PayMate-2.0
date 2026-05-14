import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background-end p-4">
      <SignIn
        forceRedirectUrl="/dashboard"
        signUpUrl="/signup"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-2xl bg-card/70 backdrop-blur-xl border-border/20',
          },
        }}
      />
    </div>
  );
}
