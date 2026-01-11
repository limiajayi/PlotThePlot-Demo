import { type Ratings } from "./ratings.types";

export type User = {
    id: number;
    username: string;
    email: string;
    profile_picture?: string;
    created_at: string;
    ratings: Ratings[];
    rating_count: number;
}