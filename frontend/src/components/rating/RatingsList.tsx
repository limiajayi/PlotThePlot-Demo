import styles from "../../styles/RatingsList.module.css"
import { useState } from 'react';
import type { Ratings } from '../../types/ratings.types';
import Modal from 'react-modal';
import RatingsDetail from './RatingsDetail';
import { MEDIA_EMOJI, getQuadrant, QUADRANT_COLOR } from "../../utils/helpers";
import useApi from "../../hooks/useApi";
import type { User } from "../../types/user.types";

type RatingsListProps = {
    user: User;
    ratings: Ratings[];
}

const RatingsList = ({ user, ratings }: RatingsListProps) => {

    const [selectedRating, setSelectedRating] = useState<Ratings | null>(null);
    const api = useApi();

    if (ratings.length === 0) return <div className={styles.empty}>No ratings yet.</div>;

    // for when a user edits a rating
    const handleRatingEdit = async (rating: Ratings) => {
        try {
            
            await api.ratings.updateRating(user.id, rating.id, {
                good_reason: rating.good_reason,
                like_reason: rating.like_reason,
                context: rating.context
            })

        } catch (error) {
            console.log('Error editing rating: ', error);
            alert('Failed to edit rating');
        }
    }

    // for when the user deletes a rating
    const handleDelete = async () => {
        if (!selectedRating) return;

        try {
            
            await api.ratings.deleteRating(user.id, selectedRating.id);
            setSelectedRating(null);
            window.location.reload();

        } catch (error) {
            console.log('Error deleting rating: ', error);
            alert(`Failed to delete rating`);
        }
    }

    
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
                                onDelete={handleDelete}
                            />
                        </div>)}

            </Modal>
        </>
    );
};

export default RatingsList;