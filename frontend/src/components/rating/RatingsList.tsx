import useRatings from '../../hooks/useRatings';
import { type User } from '../../types/user.types';

type RatingsListProps = {
    user: User;
}

const RatingsList = ({ user }: RatingsListProps) => {
    const { ratings, loading, error } = useRatings();

    const handleColor = (x: number, y: number) => {
        if (x > 0 && y > 0) return 'var(--green)';
        if (x < 0 && y > 0) return 'var(--orange)';
        if (x > 0 && y < 0) return 'var(--blue)';
        return 'var(--red)';
    }

    if (loading) return <div>Loading....</div>
    if (error) return <div>Error getting ratings: {error}</div>
    if (ratings.length === 0) return <div>No ratings found matching your filters.</div>
    
    return (
        <div>
            <h2>Ratings for {user?.username}</h2>

            {ratings.map(rating => (
                <div key={rating.id} style={{ background: handleColor(rating.x_coordinate, rating.y_coordinate), borderRadius: '2px', padding: '10px', margin: '8px' }}>
                    {rating.media.title}  ({rating.x_coordinate} , {rating.y_coordinate})
                </div>
            ))}
            
        </div>
    );
}

export default RatingsList;