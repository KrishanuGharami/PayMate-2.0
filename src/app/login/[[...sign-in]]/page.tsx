import { SignIn } from '@clerk/nextjs';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background-end p-4">
      {/* PayMate Branding */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-[0_0_30px_hsl(250,75%,60%,0.4)]">
            <Wallet size={28} />
          </div>
          <h1 className="text-4xl font-bold text-primary drop-shadow-[0_0_15px_hsl(250,75%,60%,0.5)]">
            PayMate 2.0
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">Secure payments, powered by AI</p>
      </div>

      <SignIn
        forceRedirectUrl="/dashboard"
        signUpUrl="/signup"
      />
    </div>
  );
}
