import { useEffect, useState} from 'react';
import { type Ratings } from '../../types/ratings.types';
import { type User } from '../../types/user.types';
import { useParams, useSearchParams } from 'react-router-dom';

type RatingsListProps = {
    user: User;
}

const RatingsList = ({ user }: RatingsListProps) => {
    const { userId } = useParams<{ userId: string }>(); // userId gotten from the url, used to query the API for a user's ratings
    const [searchParams] = useSearchParams();          // searchParams gotten from the url, used to query a user's ratings by type, quadrant, etc
    const [ratings, setRatings] = useState<Ratings[]>([]);   // ratings object 
    const [loading, setLoading] = useState(true);     // loading is either true or false for better ux

    useEffect(() => {

        const fetchRatings = async () => {
            
            try {
                // while loading, set loading to be true
                setLoading(true);
                const baseUrl = `http://localhost:3001/api/users/${userId}/ratings`
                const queryString = searchParams.toString();

                const ratingsResponse = await fetch(queryString ? `${baseUrl}?${queryString}` : `${baseUrl}`);
                const data = await ratingsResponse.json();
                setRatings(data);
            } catch (error) {
                console.log('Error: ', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchRatings();
    }, [searchParams, userId]);

    if (loading) return <div>Loading....</div>
    if (ratings.length === 0) return <div>No ratings found matching your filters.</div>
    
    return (
        <div>
            <h2>Ratings for {user?.username}</h2>

            {ratings.map(rating => (
                <div key={rating.id}>
                    {rating.media.title}  ({rating.x_coordinate} , {rating.y_coordinate})
                </div>
            ))}
            
        </div>
    );
}

export default RatingsList;