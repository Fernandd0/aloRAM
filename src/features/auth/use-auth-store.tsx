import type { TokenType, UserType } from '@/lib/auth/utils';

import { create } from 'zustand';
import { getToken, getUser, removeToken, setToken, setUser } from '@/lib/auth/utils';
import { createSelectors } from '@/lib/utils';

type AuthState = {
  token: TokenType | null;
  user: UserType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType, user?: UserType) => void;
  signUp: (user: UserType, token?: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
};

const _useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,
  signIn: (token, user) => {
    setToken(token);
    if (user) {
      setUser(user);
    }
    set({ status: 'signIn', token, user: user ?? getUser() });
  },
  signUp: (user, token) => {
    const defaultToken: TokenType = token ?? {
      access: 'vacunacare-access-token',
      refresh: 'vacunacare-refresh-token',
    };
    setToken(defaultToken);
    setUser(user);
    set({ status: 'signIn', token: defaultToken, user });
  },
  signOut: () => {
    removeToken();
    set({ status: 'signOut', token: null, user: null });
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      const userData = getUser();
      if (userToken !== null) {
        set({ status: 'signIn', token: userToken, user: userData });
      }
      else {
        get().signOut();
      }
    }
    catch (e) {
      console.error(e);
      get().signOut();
    }
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);

export const signOut = () => _useAuthStore.getState().signOut();
export const signIn = (token: TokenType, user?: UserType) => _useAuthStore.getState().signIn(token, user);
export const signUp = (user: UserType, token?: TokenType) => _useAuthStore.getState().signUp(user, token);
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
