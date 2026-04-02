import RatingsList from '../rating/RatingsList';
import RatingSearch from '../rating/RatingsSearch';
import RatingsGraph from '../rating/RatingsGraph';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUser from '../../hooks/useUser';
import styles from '../../styles/ProfilePage.module.css';
import type { Ratings } from '../../types/ratings.types';
import { getQuadrant } from '../../utils/helpers';


const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, loading, error } = useUser(username);
    const [grid, setGrid] = useState(false); // toggle between the grid view and graph view of ratings

    if (loading) return <p className={styles.stateMsg}>Loading User...</p>;
    if (error) return <p className={styles.stateMsg}>Error loading user: {error}</p>;
    if (!user) return <p className={styles.stateMsg}>User not found</p>;

    const avatarLetter = user.username[0].toUpperCase();

    const mediaType = searchParams.get('media_type') ?? '';
    const quadrant = searchParams.get('quadrant') ?? '';
    const title = searchParams.get('title') ?? '';

    const filteredRatings: Ratings[] = user.ratings.filter(r => {
        if (mediaType && r.media.media_type !== mediaType) return false;
        if (quadrant && getQuadrant(r.x_coordinate, r.y_coordinate) !== quadrant) return false;
        if (title && !r.media.title.toLowerCase().includes(title.toLowerCase())) return false;
        return true;
    });
    
    return (
        <div className={styles.layout}>

            <header className={styles.header}>
                <span className={styles.brand} >plottheplot</span>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${!grid ? styles.tabBtnActive : ''}`}
                        onClick={() => setGrid(false)}
                    >
                        Graph
                    </button>

                    <button
                        className={`${styles.tabBtn} ${grid ? styles.tabBtnActive : ''}`}
                        onClick={() => setGrid(true)}
                    >
                        Grid
                    </button>
                </div>

                <div className={styles.headerSpacer}  />
                <div 
                    className={styles.avatar}
                    onClick={() => {navigate(`/users/${user.username}/settings`)}}
                >
                    {avatarLetter}
                </div>
            </header>

            <div className={styles.body}>
                
                <aside className={styles.sidebar}>

                    {/* user info */}
                    <div>
                        <p className={styles.username}>{user.username}</p>
                        <p className={styles.meta}>{user.ratings.length} ratings</p>

                        {user.bio && <p className={styles.bio}>{user.bio}</p>}
                    </div>

                    {/* stat row */}
                    <div className={styles.statRow}>
                        <div className={styles.stat}>
                            <p className={styles.statNum}>
                                {user.ratings.filter(r => r.media.media_type === 'movie').length}
                            </p>
                            <p className={styles.statLabel}>movies</p>
                        </div>

                        <div className={styles.stat}>
                            <p className={styles.statNum}>
                                {user.ratings.filter(r => r.media.media_type === 'show').length}
                            </p>
                            <p className={styles.statLabel}>shows</p>
                        </div>

                        <div className={styles.stat}>
                            <p className={styles.statNum}>
                                {user.ratings.filter(r => r.media.media_type === 'book').length}
                            </p>
                            <p className={styles.statLabel}>books</p>
                        </div>
                    </div>

                    {user.ratings.length > 0 
                    ? <RatingSearch /> 
                    : <p>Filters will appear once you have ratings</p> }
                </aside>

                {/* if grid then RatingsList else RatingsGraph */}
                {grid ? <RatingsList ratings={filteredRatings} /> :
                    <RatingsGraph user={user} ratings={filteredRatings} />}
                    
                    
            </div>
        </div>
    );
}

export default ProfilePage;