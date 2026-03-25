/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ExternalMediaResult, MediaType } from "../types/media.types";

type ApiFetch = (path: string, options?: RequestInit) => Promise<any>;

export const createMediaSearchService = (apiFetch: ApiFetch) => ({
    
    search: (query: string, mediaType: MediaType): Promise<ExternalMediaResult[]> => {
        return apiFetch(`/api/media/search?query=${encodeURIComponent(query)}&media_type=${mediaType}`);
    },

})