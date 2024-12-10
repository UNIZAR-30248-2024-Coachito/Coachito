import { Session } from '@supabase/supabase-js';
import React, {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { supabase } from '@/api/supabaseClient';

export interface UserProfile {
  username: string;
  avatarUrl?: string;
}

export interface UserInfo {
  session: Session | null;
  profile: UserProfile | null;
}

const UserContext = createContext<UserInfo>({
  session: null,
  profile: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    session: null,
    profile: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error.message);
          return null;
        }

        return {
          username: data.username,
        };
      } catch (error) {
        console.error('Unexpected error fetching user profile:', error);
        return null;
      }
    };

    const initializeAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      let profile = null;
      if (session?.user) {
        profile = await fetchUserProfile(session.user.id);
      }
      setUserInfo({ session, profile });
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      let profile = null;
      if (session?.user) {
        profile = await fetchUserProfile(session.user.id);
      }
      setUserInfo({ session, profile });
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
}

export function useUserInfo() {
  return useContext(UserContext);
}
