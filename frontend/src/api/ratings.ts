/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NewRating } from "../types/ratings.types";

type ApiFetch = (path: string, options?: RequestInit) => Promise<any>;

export const createRatingsService = (apiFetch: ApiFetch) => ({

    getRatings: (userId: string, params?: URLSearchParams) => {
        const query = params?.toString();
        return apiFetch(`/api/users/${userId}/ratings${query ? `?${query}` : ''}`);
    },

    createRating: (userId: string, rating: NewRating) => {
        return apiFetch(`/api/users/${userId}/ratings`, {
            method: 'POST',
            body: JSON.stringify(rating)
        });
    },

    updateRating: (userId: string, ratingId: number, data: { good_reason: string, like_reason: string, context?: string }) => {
        return apiFetch(`/api/users/${userId}/ratings/${ratingId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteRating: (userId: string, ratingId: number) => {
        return apiFetch(`/api/users/${userId}/ratings/${ratingId}`, {
            method: 'DELETE'
        });
    },


});

