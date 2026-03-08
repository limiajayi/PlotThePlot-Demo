import type { Ratings } from "../../types/ratings.types"
import styles from "../../styles/RatingsDetail.module.css";
import { useState } from "react";

type RatingsDetailProps = {
    ratings: Ratings | null;
    onEdit?: () => void;
    onDelete?: () => void;
};

const getQuadrant = (x: number, y: number): string => {
    if (x >= 0 && y >= 0) return "over";
    if (x <= 0 && y >= 0) return "overhated";
    if (x >= 0 && y <= 0) return "overrated";
    return "under"
};

const MEDIA_EMOJI: Record<string, string> = {
    movie: "🎬",
    book: "📖",
    show: "📺"
};

const RatingsDetail = ({ ratings, onEdit, onDelete }: RatingsDetailProps) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!ratings) return <div>Error loading rating details</div>;

    const quadrant = getQuadrant(ratings.x_coordinate, ratings.y_coordinate);

    const emoji = MEDIA_EMOJI[ratings.media.media_type] ?? "🎬";

    return (
        <div>


            {/* Header: title, media type, coordinates */}
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <h3> {ratings.media.title} </h3>
                </div>
                <p className={styles.coordPair}>
                    {emoji} {ratings.media.media_type} ·
                    ({ratings.x_coordinate}, {ratings.y_coordinate})

                </p>
                <span className={`${styles.quadrantBadge} ${styles[quadrant]}`}>
                    {quadrant}
                </span>
            </div>

            {/* Why good/bad */}
            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                    Why was it good / bad?
                </span>
                <p className={styles.detailText}>
                    {ratings.good_reason}
                </p>
            </div>

            {/* why liked / disliked */}
            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                    Why was it did you like / dislike it?
                </span>
                <p className={styles.detailText}>
                    {ratings.like_reason}
                </p>
            </div>

            {ratings.context && (
            <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                        Context
                    </span>
                    <p className={styles.detailText}>
                        {ratings.context}
                    </p>
            </div>
            )}

            <div className={styles.divider}></div>


            {/* footer: delete (left) | edit (right) */}
            <div className={styles.footer}>

                <button className={styles.btnPrimary} onClick={onEdit}>
                    Edit Rating
                </button>

                <div className={styles.footerRight}>
                    <button 
                        className={styles.btnDanger}
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>


            {/* inline delete confirmation */}
            {showDeleteConfirm && (
                <div className={styles.deleteConfirm}>
                    <p className={styles.deleteConfirmText}>
                        Are you sure? This can't be undone
                    </p>
                    <div className={styles.deleteConfirmActions}>
                        <button
                            className={styles.btnSecondary}
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            Cancel
                        </button>
                        
                        <button
                            className={styles.btnDanger}
                            onClick={onDelete}
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RatingsDetail;