import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { SessionContext } from '../supabase/SessionContext';

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
