import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './AuthContext';

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
      });
    }
  }, []);

  // Initialize auth state and set up session listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let session = null;
        const {
          data: { session: refreshedSession },
        } = await supabase.auth.refreshSession();
        if (!refreshedSession) {
          const {
            data: { session: newSession },
          } = await supabase.auth.signInAnonymously();
          session = newSession;
        } else {
          session = refreshedSession;
        }
        setSession(session);
        localStorage.setItem('session', JSON.stringify(session));
        setUser(session?.user ?? null);
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
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      if (error.code === 'email_exists') {
        await supabase.auth.signInWithOtp({ email });
      } else {
        throw error;
      }
    }
  };

  const signInWithGoogle = async () => {
    // Track that we're attempting to link, so we can handle errors on redirect
    sessionStorage.setItem('pending_link_identity', 'google');
    // Always try to link identity first (for anonymous users)
    // If the identity already exists, the redirect will return an error
    // which is handled by the useEffect above
    await supabase.auth.linkIdentity({ provider: 'google' });
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
