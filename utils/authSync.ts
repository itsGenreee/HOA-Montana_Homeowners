// utils/authSync.ts
import type { User } from '@/types';
import type { Dispatch, SetStateAction } from 'react';
import { clearToken } from './TokenStorage';

type SetUserType = Dispatch<SetStateAction<User | null>>;
type SetTokenType = Dispatch<SetStateAction<string | null>>;

interface AuthStateSetters {
  setUser: SetUserType;
  setToken: SetTokenType;
}

class AuthSync {
  private static setUserState: SetUserType | null = null;
  private static setTokenState: SetTokenType | null = null;

  static init({ setUser, setToken }: AuthStateSetters): void {
    AuthSync.setUserState = setUser;
    AuthSync.setTokenState = setToken;
    console.log('🔗 Auth sync initialized');
  }

  static async clearAuthCompletely(): Promise<void> {
    console.log('🧹 Clearing auth completely...');
    
    // 1. Clear token from storage
    await clearToken();
    
    // 2. Clear React state
    if (AuthSync.setUserState && AuthSync.setTokenState) {
      AuthSync.setUserState(null);
      AuthSync.setTokenState(null);
      console.log('✅ Storage AND React state cleared');
    } else {
      console.log('⚠️ Only storage cleared (React state not initialized)');
    }
  }

  static isInitialized(): boolean {
    return !!(AuthSync.setUserState && AuthSync.setTokenState);
  }
}

export { AuthSync };
