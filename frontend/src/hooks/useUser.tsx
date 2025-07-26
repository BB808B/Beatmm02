// src/hooks/useUser.tsx
'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useSessionContext, useUser as useSupaUser } from '@supabase/auth-helpers-react';
import { User } from '@supabase/supabase-js';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: any | null; // 你可以定义一个更具体的类型
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<any | null>(null);

  const getUserDetails = () => supabase.from('users').select('*').single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsloadingData(true);
      Promise.allSettled([getUserDetails()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          
          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data);
          
          setIsloadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
