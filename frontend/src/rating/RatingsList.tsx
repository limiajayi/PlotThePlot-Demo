import { useEffect, useState} from 'react';
import { type Ratings } from '../types/ratings.types';
import { type User } from '../types/user.types';
import { useParams } from 'react-router-dom';
// import * as d3 from 'd3';


const RatingsList = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User>()
    const [ratings, setRatings] = useState<Ratings[]>([]);

    useEffect(() => {

        const fetchRatings = async () => {
        const userResponse = await fetch(`http://localhost:3001/api/users/${userId}`);
        const userData = await userResponse.json();

        setUser(userData);
        setRatings(userData.ratings);
        };

        fetchRatings();
    }, [userId]);
    
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