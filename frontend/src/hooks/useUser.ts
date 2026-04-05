import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { type User } from "../types/user.types";

const cache = new Map<string, User>();

const useUser = (username: string | undefined) => {
    const [user, setUser] = useState<User | null>(
        username ? (cache.get(username) ?? null) : null
    );
    const [loading, setLoading] = useState(
        username ? !cache.has(username) : true
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        if (cache.has(username)) {
            setUser(cache.get(username)!);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('users')
                    .select('*, ratings (*, media (*))')
                    .eq('username', username)
                    .single();

                if (error) throw new Error(error.message);

                const userData = data as User;
                cache.set(username, userData);
                setUser(userData);
                setError(null);
            } catch (error) {
                setError('Failed to load user.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    return { user, loading, error };
};

export default useUser;