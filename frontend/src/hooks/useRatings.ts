import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import type { Ratings } from "../types/ratings.types";


const useRatings = () => {
    const { userId } = useParams<{ userId: string }>(); // userId gotten from the url, used to query the API for a user's ratings
    const [searchParams] = useSearchParams();   // searchParams gotten from the url, used to query a user's ratings by type, quadrant, etc
    const [ratings, setRatings] = useState<Ratings[]>([]);   // ratings gotten from API
    const [loading, setLoading] = useState(true);        // if the ratings take a while to load
    const [error, setError] = useState<string | null>();    // if there's some error or something

    useEffect(() => {

        const fetchRatings = async () => {
            // if theres no userId return nothing
            if (!userId) return;
            
            try {
                // while loading, set loading to be true
                setLoading(true);
                const baseUrl = `http://localhost:3001/api/users/${userId}/ratings`
                const queryString = searchParams.toString();
                const ratingsResponse = await fetch(queryString ? `${baseUrl}?${queryString}` : `${baseUrl}`);

                // if the response is not good, then the ratings couldn't be gotten 
                // in the case of server failure or API migrations
                if (!ratingsResponse.ok) {
                    throw new Error("Failed to fetch ratings");
                }

                const data = await ratingsResponse.json();
                setRatings(data);
                setError(null);
            } catch (err) {

                setError(err instanceof Error ? err.message : "Unknown error");
                console.log('Error fetching ratings: ', err);

            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchRatings();

    }, [searchParams, userId]);

    return { userId, ratings, loading, error };
}

export default useRatings;