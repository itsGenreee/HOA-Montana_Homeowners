import { AuthService } from '@/services/AuthService';
import { User } from '@/types';
import { AuthSync } from '@/utils/authSync';
import { clearToken, retrieveToken, saveToken } from '@/utils/TokenStorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    first_name: string;
    last_name: string;
    address: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  me: () => Promise<void>; // Add this
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthSync.init({ setUser, setToken });
  }, []);

    useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const storedToken = await retrieveToken();
        if (!storedToken) {
          // No token - ensure we're logged out and stop loading
          setUser(null);
          setToken(null);
        }
        // If there's a token, the login page will call me() to validate it
      } catch (error) {
        console.error('Initial auth check failed:', error);
      } finally {
        // 🔥 CRITICAL: Always set loading to false
        setIsLoading(false);
      }
    };

    checkInitialAuth();
  }, []); // Run once on mount

  // Add the me function
  const me = async () => {
    try {
      const response = await AuthService.me();
      const storedToken = await retrieveToken();
      
      setUser(response.data.user);
      setToken(storedToken);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log(email, password);
      const { user, token } = await AuthService.login(email, password);
      await saveToken(token);
      setUser(user);
      setToken(token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      await clearToken();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    first_name: string;
    last_name: string;
    address: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    setIsLoading(true);
    try {
      const { user, token } = await AuthService.register(userData);
      await saveToken(token);
      setUser(user);
      setToken(token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        register,
        me, // Add this to the context value
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);