import { type Media } from "./media.types";

export type Ratings = {
    id: number;
    user_id: number;
    media_id: number;
    x_coordinate: number;
    y_coordinate: number;
    good_reason: string;
    like_reason: string;
    context?: string;
    watch_number?: number;
    created_at: string;
    media: Media
}