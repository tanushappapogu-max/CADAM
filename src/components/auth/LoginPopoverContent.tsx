import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';

type ViewState = 'idle' | 'emailSent';

export function LoginPopoverContent() {
  const { signInWithEmail, signInWithGoogle, verifyOtp } = useAuth();
  const [view, setView] = useState<ViewState>('idle');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await signInWithEmail(email);
      setView('emailSent');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && otp) {
      await verifyOtp(email, otp);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  if (view === 'emailSent') {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setView('idle')}
          className="flex items-center gap-1 text-sm text-adam-neutral-400 transition-colors hover:text-adam-neutral-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-adam-blue/20">
            <Mail className="h-6 w-6 text-adam-blue" />
          </div>
          <h3 className="text-lg font-semibold text-adam-neutral-10">
            Check your email
          </h3>
          <p className="text-center text-sm text-adam-neutral-400">
            We sent a magic link to{' '}
            <span className="font-medium text-adam-neutral-200">{email}</span>
          </p>
        </div>

        <div className="relative flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-adam-neutral-700" />
          <span className="text-xs text-adam-neutral-500">
            or enter code manually
          </span>
          <div className="h-px flex-1 bg-adam-neutral-700" />
        </div>

        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              className="gap-2"
            >
              <InputOTPGroup className="text-adam-neutral-10">
                <InputOTPSlot
                  index={0}
                  className="h-11 w-11 border-adam-neutral-700 bg-adam-background-1"
                />
                <InputOTPSlot
                  index={1}
                  className="h-11 w-11 border-adam-neutral-700 bg-adam-background-1"
                />
                <InputOTPSlot
                  index={2}
                  className="h-11 w-11 border-adam-neutral-700 bg-adam-background-1"
                />
              </InputOTPGroup>
              <InputOTPSeparator className="text-adam-neutral-500" />
              <InputOTPGroup className="text-adam-neutral-10">
                <InputOTPSlot
                  index={3}
                  className="h-11 w-11 border-adam-neutral-700 bg-adam-background-1"
                />
                <InputOTPSlot
                  index={4}
                  className="h-11 w-11 border-adam-neutral-700 bg-adam-background-1"
                />
                <InputOTPSlot
                  index={5}
                  className="h-11 w-11 border-adam-neutral-700 bg-adam-background-1"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={otp.length !== 6}
          >
            Verify Code
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-adam-neutral-10">Sign In</h3>
        <p className="text-sm text-adam-neutral-400">
          Sign in to save your creations and access them anywhere.
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-lg bg-adam-background-1"
        />
        <Button type="submit" variant="outline" className="w-full">
          Continue with Email
        </Button>
      </form>

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-adam-neutral-700" />
        <span className="text-xs text-adam-neutral-500">or</span>
        <div className="h-px flex-1 bg-adam-neutral-700" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleGoogleSignIn}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  );
}
