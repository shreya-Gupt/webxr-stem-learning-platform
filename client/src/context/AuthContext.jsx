import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'webxr_current_student';
const STORAGE_KEY_USERS_DB = 'webxr_registered_students';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Keep a local registry of registered accounts in localStorage to emulate user persistence
  const getRegisteredUsers = () => {
    try {
      const db = localStorage.getItem(STORAGE_KEY_USERS_DB);
      return db ? JSON.parse(db) : [
        {
          id: 'demo-student-1',
          name: 'Alex Rivera',
          email: 'alex@webxr.edu',
          password: 'password123',
          joinedAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  };

  const signup = async (name, email, password) => {
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'student-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // Stored in local development state
      joinedAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updated));

    // Exclude password in active session state
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      joinedAt: newUser.joinedAt
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const login = async (email, password) => {
    const users = getRegisteredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password. (Default test: alex@webxr.edu / password123)');
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      joinedAt: found.joinedAt
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
