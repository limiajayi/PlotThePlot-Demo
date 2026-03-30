import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "../types/user.types";
import type { Session } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // first fetch the user's profile from user table
    const fetchProfile = async (id: string): Promise<User | null> => {

        const { data, error } = await supabase.from('users')
                                                .select('*')
                                                .eq('id', id)
                                                .single();
        
        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data as User;
    }

    useEffect(() => {
        // data is desctructured twice
        // get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                const profile = await fetchProfile(session.user.id);
                setUser(profile);
            }
            setLoading(false);
        });

        // listening for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                const profile = await fetchProfile(session.user.id);
                setUser(profile);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        
        return () => subscription.unsubscribe();


    }, []);

    const login = async (username: string, password: string) => {
        // find the email for this username
        const { data, error: lookupError } = await supabase
                        .from('users')
                        .select('email')
                        .eq('username', username)
                        .single();
        
        if (lookupError || !data) return { error: 'Username not found', userId: null };

        // use the email to log in!
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password
        });

        if (error) return { error: error.message, userId: null };
        return { error: null, userId: authData.user.id };
    };

    const signup = async (email: string, password: string, username: string) => {
        // Create the auth user
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) return { error: signUpError.message, userId: null };
        if (!data.user) return { error: 'Signup failed - no user returned.', userId: null };


        // insert into users table
        const { error: profileError } = await supabase
                                .from('users')
                                .insert({
                                    id: data.user.id,
                                    email,
                                    username
                                });

        if (profileError) return { error: profileError.message, userId: null };
        return { error: null, userId: data.user.id };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    }

    const updateUser = (updates: Partial<User>) => {
        setUser( prev => prev ? {...prev, ...updates} : null);
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;