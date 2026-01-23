import useRatings from '../../hooks/useRatings';
import { type User } from '../../types/user.types';

type RatingsListProps = {
    user: User;
}

const RatingsList = ({ user }: RatingsListProps) => {
    const { ratings, loading, error } = useRatings();

    if (loading) return <div>Loading....</div>
    if (error) return <div>Error getting ratings: {error}</div>
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