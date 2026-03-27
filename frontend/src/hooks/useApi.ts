import { useMemo } from "react";
import { useAuth } from "../context/useAuth";
import { createApiClient } from "../api/client";
import { createRatingsService } from "../api/ratings";
import { createMediaSearchService } from "../api/mediaSearch";

const useApi = () => {
    const { session } = useAuth();

    // useMemo so the services arent recreated on every render
    // only rebuilds when the token changes (login / logout)

    const api = useMemo(() => {
        const { apiFetch } = createApiClient(session?.access_token);
        return {
            ratings: createRatingsService(apiFetch),
            mediaSearch: createMediaSearchService(apiFetch)
        }
    }, [session?.access_token]);

    return api;
}

export default useApi;