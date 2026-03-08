import RatingsList from '../rating/RatingsList';
import RatingSearch from '../rating/RatingsSearch';
import RatingsGraph from '../rating/RatingsGraph';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useUser from '../../hooks/useUser';

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { user, loading, error } = useUser(username);
    const [grid, setGrid] = useState(false); // toggle between the grid view and graph view of ratings

    if (loading) return <div>Loading User...</div>;
    if (error) return <div>{`Error loading user: ${error}`}</div>;
    if (!user) return <div>User not found</div>;

    // console.log(user);
    
    return (
        <div>
            <div>
                <h1>{user.username}'s profile</h1>
                <button 
                    onClick={() => setGrid(prev => !prev)}
                    style={{ width: '100px' }}
                >
                    { grid ? "Graph View" : "Grid View" }
                </button>
                <RatingSearch />

               

                {/* if grid then RatingsList else RatingsGraph */}
                {grid ? <RatingsList user={user} /> :
                    <RatingsGraph user={user} />}
                    
                    
            </div>
        </div>
    );
}

export default ProfilePage;