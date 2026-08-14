import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/api'; // Assuming you have an API utility for authentication

interface AuthContextType {
    user: any; // Replace 'any' with your user type
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null); // Replace 'any' with your user type
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        const userCredential = await auth.signInWithEmailAndPassword(credentials.email, credentials.password);
        setUser(userCredential.user);
    };

    const logout = async () => {
        await auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};