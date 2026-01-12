import { useState, useEffect } from "react";
import { type User } from "../types/user.types";

// will eventually be changed to useAuth
const useUser = (userId: string | undefined) => {
    const [user, setUser] = useState<User | null>(null); // user data
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            // if not user return nothing
            if (!userId) return;
            try {
                setLoading(true)

                const response = await fetch(`http://localhost:3001/api/users/${userId}`);
                const data = await response.json();

                setUser(data);
            } catch (err) {
                setError('Failed to load user.');
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userId])

    return { user, loading,  error}
}

export default useUser;