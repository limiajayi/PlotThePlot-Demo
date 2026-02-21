import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "../types/user.types";
import type { Session } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
        // data is desctructured desctructured
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

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return { error: null };
    };

    const signup = async (email: string, password: string, username: string) => {
        // Create the auth user
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) return { error: signUpError.message };
        if (!data.user) return { error: 'Signup failed - no user returned.' };

        // insert into users table
        const { error: profileError } = await supabase
                                                    .from('users')
                                                    .insert({
                                                        id: data.user.id,
                                                        email,
                                                        username
                                                    });
        if (profileError) return { error: profileError.message };
        return { error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );

};
