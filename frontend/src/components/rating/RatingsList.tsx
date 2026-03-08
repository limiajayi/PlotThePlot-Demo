import { type User } from '../../types/user.types';
import styles from "../../styles/RatingsList.module.css"
import { useState } from 'react';
import type { Ratings } from '../../types/ratings.types';
import Modal from 'react-modal';
import RatingsDetail from './RatingsDetail';

type RatingsListProps = {
    user: User;
}

const MEDIA_EMOJI: Record<string, string> = {
    movie: '🎬',
    book:  '📖',
    show:  '📺',
};

// Same quadrant logic as RatingsDetail
const getQuadrant = (x: number, y: number): string => {
    if (x >= 0 && y >= 0) return 'over';
    if (x < 0  && y >= 0) return 'overhated';
    if (x >= 0 && y < 0)  return 'overrated';
    return 'under';
};

// Maps quadrant name to the CSS variable used for the colour strip
const QUADRANT_COLOR: Record<string, string> = {
    over:      'var(--green)',
    overhated: 'var(--orange)',
    overrated: 'var(--blue)',
    under:     'var(--red)',
};

const RatingsList = ({ user }: RatingsListProps) => {
    const { ratings } = user;

    const [selectedRating, setSelectedRating] = useState<Ratings | null>(null);

    if (ratings.length === 0) return <div className={styles.empty}>No ratings yet.</div>
    
    return (
        <>
        <div className={styles.grid}>
            {ratings.map(rating => {
                const quadrant = getQuadrant(rating.x_coordinate, rating.y_coordinate);
                const emoji = MEDIA_EMOJI[rating.media.media_type] ?? '🎬';

                return (
                    // card
                    <div
                        key={rating.id}
                        className={styles.card}
                        onClick={() => setSelectedRating(rating)}
                    >
                        <div 
                            className={styles.colorStrip}
                            style={{ background: QUADRANT_COLOR[quadrant] }}
                        />

                        <p className={styles.mediaTypeBadge}>
                            {emoji} {rating.media.media_type}
                        </p>

                        <p className={styles.title}>
                            {rating.media.title}
                        </p>

                        <p className={styles.coords}>
                            ({rating.x_coordinate}, {rating.y_coordinate})
                        </p>

                        <span className={`${styles.quadrantBadge} ${styles[quadrant]}`}>
                            {quadrant}
                        </span>

                    </div>
                );
            })}
        </div>

            <Modal
                isOpen={!!selectedRating}
                onRequestClose={() => setSelectedRating(null)}
                contentLabel="Rating Detail"
                appElement={document.getElementById('root') as HTMLElement}
                style={{
                    content: {
                        width: '400px',
                        height: '80%',
                        margin: 'auto',
                        borderRadius: '8px',
                    }
                }}
            >

                    {selectedRating && (
                        <div>
                            <button onClick={() => setSelectedRating(null)}>Close</button>
                            <RatingsDetail
                                ratings={selectedRating}
                                onEdit={() => {
                                    // TODO: wire up edit flow same as RatingsGraph
                                    setSelectedRating(null);
                                }}
                                onDelete={() => {
                                    // TODO: wire up delete same as RatingsGraph
                                    setSelectedRating(null);
                                }}
                            />
                        </div>)}

            </Modal>
        </>
    );
};

export default RatingsList;