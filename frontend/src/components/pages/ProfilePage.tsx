import { useParams } from 'react-router-dom';
import RatingsList from '../rating/RatingsList';
import RatingSearch from '../rating/RatingsSearch';
import useUser from '../../hooks/useUser';

//TODO: Customize
// I want this to contain:
// profile picture
// username
// a quick bio probably

const ProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { user, loading, error } = useUser(userId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>User not found</div>;
    
    return (
        <div>
            <h1>{user.username}'s profile</h1>
            <RatingSearch />
            <RatingsList user={user} />
            {/* <RatingsGraph user={user}/> */}
        </div>
    );
}

export default ProfilePage;