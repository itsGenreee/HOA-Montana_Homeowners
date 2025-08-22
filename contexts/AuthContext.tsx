import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/services/AuthService';
import { retrieveToken, clearToken, saveToken } from '@/utils/TokenStorage';
import { User } from '@/types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Added this line
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app startup
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await retrieveToken();
        if (storedToken) {
          try {
            const response = await AuthService.me();
            setUser(response.data.user);
            setToken(storedToken);
          } catch (error) {
            console.error('Token validation failed:', error);
            await clearToken();
          }
        }
      } catch (error) {
        console.error('Auth state loading failed:', error);
        await clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await AuthService.login(email, password);
      await saveToken(token);
      setUser(user); // This sets the user in context
      setToken(token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to handle in UI
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
        setUser, // Expose setUser to consumers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);