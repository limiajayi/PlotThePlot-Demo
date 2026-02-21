import { type Ratings } from "./ratings.types";

export type User = {
    id: string;
    username: string;
    email: string;
    profile_picture?: string;
    bio?: string;
    created_at?: string;
    ratings: Ratings[];
    rating_count: number;
}