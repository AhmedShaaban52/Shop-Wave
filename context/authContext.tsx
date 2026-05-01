"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const isMounted = useRef(true);
    const authChecked = useRef(false);

    const checkAdminStatus = (userData: User | null) => {
        if (userData?.email === 'ahmedshababn91@gmail.com') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    const initializeAuth = async () => {
        if (!isMounted.current || authChecked.current) return;

        try {
            authChecked.current = true;

            const { data: { session: currentSession } } = await supabase.auth.getSession();

            if (currentSession?.user) {
                setSession(currentSession);
                setUser(currentSession.user);
                checkAdminStatus(currentSession.user);
            } else {
                setSession(null);
                setUser(null);
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error in initializeAuth:', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                if (!isMounted.current) return;

                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    checkAdminStatus(currentSession.user);
                } else {
                    setIsAdmin(false);
                }

                setLoading(false);
            }
        );

        return () => {
            isMounted.current = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error in signOut:', error);
            throw error;
        }
    };

    const refreshSession = async () => {
        await initializeAuth();
    };

    const value = {
        session,
        user,
        loading,
        signOut,
        refreshSession,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}