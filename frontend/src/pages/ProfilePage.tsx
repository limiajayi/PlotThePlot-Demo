import { useEffect, useState} from 'react';
import { type Ratings } from '../types/ratings.types';
import { type User } from '../types/user.types';
import { useParams } from 'react-router-dom';
// import * as d3 from 'd3';


const ProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User>()
    const [ratings, setRatings] = useState<Ratings[]>([]);

    useEffect(() => {

        const fetchRatings = async () => {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/ratings`);
        const userResponse = await fetch(`http://localhost:3001/api/users/${userId}`)

        const data = await response.json();
        const userData = await userResponse.json()

        setRatings(data);
        setUser(userData)
        };

        fetchRatings();
    }, [userId]);
    
    return (
        <div>
            <h1>PlotThePlot Ratings for {user?.username}</h1>
            <p>Found {ratings.length} ratings</p>
            <pre>{JSON.stringify(ratings, null, 2)}</pre>
        </div>
    )
}

export default ProfilePage