import { useEffect, useState} from 'react';
import { type Ratings } from '../types/ratings.types';
import { type User } from '../types/user.types';
import { useParams, useSearchParams } from 'react-router-dom';



const RatingsList = () => {
    const { userId } = useParams<{ userId: string }>();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<User>()
    const [ratings, setRatings] = useState<Ratings[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRatings = async () => {
            
            try {
                // while loading, set loading to be true
                setLoading(true);
                const baseUrl = `http://localhost:3001/api/users/${userId}`

                const userResponse = await fetch(baseUrl);
                const userData = await userResponse.json();
                setUser(userData);

                const queryString = searchParams.toString();

                const ratingsResponse = await fetch(queryString ? `${baseUrl}/ratings?${queryString}` : `${baseUrl}/ratings`);
                const data = await ratingsResponse.json();
                setRatings(data);
            } catch (error) {
                console.log('Error', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [searchParams, userId]);

    if (loading) return <div>Loading....</div>
    if (ratings.length === 0) return <div>No ratings found matching your filters.</div>
    
    return (
        <div>
            <h2>Ratings for {user?.username}</h2>

            {ratings.map(rating => (
                <div key={rating.id}>
                    {rating.media.title}  ( {rating.x_coordinate} , {rating.y_coordinate} )
                </div>
            ))}
            
        </div>
    );
}

export default RatingsList;