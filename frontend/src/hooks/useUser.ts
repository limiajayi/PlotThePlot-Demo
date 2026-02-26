import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { type User } from "../types/user.types";

// will eventually be changed to useAuth
const useUser = (username: string | undefined) => {
    const [user, setUser] = useState<User | null>(null); // user data
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            // if not user return nothing
            if (!username) return;
            
            try {
                setLoading(true);

                // setting up stuff for supabase
                const { data, error } = await supabase
                                        .from('users')
                                        .select('*')
                                        .eq('username', username)
                                        .single();
                
                if (error) throw new Error('Error: ', error);

                setUser(data as User);
                setError(null);

            } catch (error) {
                setError('Failed to load user.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [username])

    return { user, loading,  error}
}

export default useUser;