// import { useEffect, useState} from 'react';
// import { type User } from '../types/user.types';
// import * as d3 from 'd3';
import RatingsList from '../rating/RatingsList';
import RatingSearch from '../rating/RatingsSearch';



const ProfilePage = () => {
    // const { userId } = useParams<{ userId: string }>();
    // const [user, setUser] = useState<User>()

    // useEffect(() => {

    //     const fetchRatings = async () => {
    //     const userResponse = await fetch(`http://localhost:3001/api/users/${userId}`);
    //     const userData = await userResponse.json();

    //     setUser(userData);
    //     };

    //     fetchRatings();
    // }, [userId]);
    
    return (
        <div>
            <RatingSearch />
            <RatingsList />
        </div>
    );
}

export default ProfilePage;