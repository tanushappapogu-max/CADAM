import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './AuthContext';

// Redirect back to current page after OAuth
const getRedirectUrl = () => window.location.origin + window.location.pathname;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(
    JSON.parse(localStorage.getItem('session') ?? 'null'),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle OAuth errors from redirect (e.g., identity_already_exists)
  useEffect(() => {
    const pendingLinkProvider = sessionStorage.getItem('pending_link_identity');
    if (!pendingLinkProvider) return;

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    const error_code = hashParams.get('error_code');

    // Clear the pending flag regardless of outcome
    sessionStorage.removeItem('pending_link_identity');

    if (error === 'server_error' && error_code === 'identity_already_exists') {
      // Clear the hash from URL
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
      // The identity exists on another account, so sign in instead of linking
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: getRedirectUrl() },
      });
    }
  }, []);

  // Clean up empty hash from URL after OAuth redirect
  useEffect(() => {
    if (window.location.hash === '#' || window.location.hash === '') {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  // Initialize auth state and set up session listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let session = null;

        // Try to refresh existing session
        const refreshResult = await supabase.auth.refreshSession();
        session = refreshResult.data?.session ?? null;

        // If no existing session, sign in anonymously
        if (!session) {
          const anonResult = await supabase.auth.signInAnonymously();
          if (anonResult.error) {
            console.error('[Auth] Anonymous sign-in failed:', anonResult.error);
          }
          session = anonResult.data?.session ?? null;
        }

        setSession(session);
        localStorage.setItem('session', JSON.stringify(session));
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('[Auth] Failed to initialize auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      localStorage.setItem('session', JSON.stringify(session));
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    localStorage.removeItem('session');
  };

  const signInWithEmail = async (email: string) => {
    // Check if we have an anonymous session to upgrade
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const redirectTo = getRedirectUrl();

    if (currentUser?.is_anonymous) {
      // Try to add email to anonymous user
      const { error } = await supabase.auth.updateUser(
        { email },
        { emailRedirectTo: redirectTo },
      );
      if (error) {
        if (error.code === 'email_exists') {
          // Email belongs to another account, send OTP to sign in
          await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectTo },
          });
        } else {
          throw error;
        }
      }
    } else {
      // No anonymous session, just send OTP
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
    }
  };

  const signInWithGoogle = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const redirectTo = getRedirectUrl();

    if (currentUser?.is_anonymous) {
      // Track that we're attempting to link, so we can handle errors on redirect
      sessionStorage.setItem('pending_link_identity', 'google');
      // Link identity to upgrade anonymous user
      await supabase.auth.linkIdentity({
        provider: 'google',
        options: { redirectTo },
      });
    } else {
      // No anonymous session, do regular OAuth
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) {
      // try email change if this is a new user
      const { error: emailChangeError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email_change',
      });
      if (emailChangeError) {
        throw emailChangeError;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signOut,
        signInWithEmail,
        signInWithGoogle,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
