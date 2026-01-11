import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type SearchFilters = {
    search: string;
    media_type: string;
    quadrant: string;
}

const RatingSearch = () => {
    const { userId } = useParams<{ userId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();


    return (
        <div>
            
        </div>
    )

}

export default RatingSearch;