//import { useParams, useSearchParams } from "react-router-dom";
import type { User } from "../../types/user.types";
import { ErrorBoundary } from "react-error-boundary";
//import { useEffect, useState } from "react";
//import type { Ratings } from "../../types/ratings.types";
import useRatings from "../../hooks/useRatings";

type RatingsGraphProps = {
    user: User;
}

const ErrorFallback = () => {
    return (
        <div>
            <h3>
                Error detected!
            </h3>
        </div>
    )
}

// where the d3 mess happens
const RatingsGraph = ({ user }: RatingsGraphProps) => {
    
    const { ratings, loading, error } = useRatings();

    if (loading) return <div>Loading graph...</div>;
    if (error) return <div>Error loading graph: {error}</div>;
    if (ratings.length === 0) return <div>No ratings to display on graph</div>;

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div>
                <h2>Graph for {user?.username}</h2>
                
            </div>
        </ErrorBoundary>
    );
}

export default RatingsGraph