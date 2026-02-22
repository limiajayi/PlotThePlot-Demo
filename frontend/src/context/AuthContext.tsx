import { createContext } from "react";
import type { User } from "../types/user.types";
import type { Session } from "@supabase/supabase-js";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<{ error: string | null, userId: string | null }>;
    signup: (email: string, password: string, username: string) => Promise<{ error: string | null, userId: string | null }>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext< AuthContextType | null >(null);
