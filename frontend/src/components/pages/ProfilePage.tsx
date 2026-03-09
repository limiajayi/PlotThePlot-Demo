import RatingsList from '../rating/RatingsList';
import RatingSearch from '../rating/RatingsSearch';
import RatingsGraph from '../rating/RatingsGraph';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useUser from '../../hooks/useUser';
import styles from '../../styles/ProfilePage.module.css'

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { user, loading, error } = useUser(username);
    const [grid, setGrid] = useState(false); // toggle between the grid view and graph view of ratings

    if (loading) return <p className={styles.stateMsg}>Loading User...</p>;
    if (error) return <p className={styles.stateMsg}>Error loading user: {error}</p>;
    if (!user) return <p className={styles.stateMsg}>User not found</p>;

    const avatarLetter = user.username[0].toUpperCase();
    
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
                <div className={styles.avatar} >{avatarLetter}</div>
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
                {grid ? <RatingsList user={user} /> :
                    <RatingsGraph user={user} />}
                    
                    
            </div>
        </div>
    );
}

export default ProfilePage;