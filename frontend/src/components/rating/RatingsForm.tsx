import { useState } from "react";
import type { NewRating, Ratings } from "../../types/ratings.types";
import type { ExternalMediaResult, MediaType } from "../../types/media.types";
import { getQuadrant, MEDIA_DOT_COLOR, MEDIA_TYPE_OPTIONS } from "../../utils/helpers";
import styles from "../../styles/RatingsForm.module.css";

type RatingsFormProps = {
    coordinates: { x: number, y: number };
    onSubmit: (rating: NewRating) => void;
    onCancel: () => void;
    editingRating?: Ratings | null;
};

const RatingsForm = ({ coordinates, onSubmit, onCancel, editingRating }: RatingsFormProps) => {

    const [searchQuery, setSearchQuery] = useState(''); // passed to useParams then the backend to return the media we need
    const [searchMediaType, setSearchMediaType] = useState<MediaType>('movie');

    const [searchResults, setSearchResults] = useState<ExternalMediaResult[]>([]); 
    const [selectedMedia, setSelectedMedia] = useState<ExternalMediaResult | null>(
        editingRating ? {
            tmdb_id: editingRating.media.tmdb_id,
            isbn: editingRating.media.isbn,
            title: editingRating.media.title,
            media_type: editingRating.media.media_type,
            release_year: editingRating.media.release_year,
            cover_image_url: editingRating.media.cover_image_url,
            creator: editingRating.media.creator
        } : null
    );
    const [formData, setFormData] = useState({
        good_reason: editingRating?.good_reason ?? '',
        like_reason: editingRating?.like_reason ?? '',
        context: editingRating?.context ?? ''
    });

    const quadrant = getQuadrant(coordinates.x, coordinates.y);

    // queries the backend to find the appropriate media results
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        const response = await fetch(
            `http://localhost:3001/api/media/search?query=${encodeURIComponent(searchQuery)}&media_type=${searchMediaType}`
        );

        const result = await response.json();
        setSearchResults(result);
    }

    const handleMediaSelect = (media: ExternalMediaResult) => {
        setSelectedMedia(media);
        setSearchResults([]); // Clear search results after media has been found
    }

    const handleSubmit = (event: React.FormEvent) => {
        // no refresh
        event.preventDefault();

        if (!selectedMedia) return;

        const newRating: NewRating = {
            media: selectedMedia,
            x_coordinate: coordinates?.x,
            y_coordinate: coordinates?.y,
            good_reason: formData.good_reason,
            like_reason: formData.like_reason,
            context: formData.context
        };

        onSubmit(newRating)
    }


    return (
        <form onSubmit={handleSubmit}>
            {editingRating && (
                <p>
                    Note: To change coordinates, delete this rating and create a new one.
                </p>
            )}
            
            
            {/* header */}
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {editingRating ? 'Editing Rating' : 'Rating Media'}
                </h3>
            </div>

            {/* coordinate display */}
            <div className={styles.coordDisplay}>
                <div className={styles.coordItem}>

                    <span className={styles.coordLabel}>X (good / bad)</span>
                    <span className={styles.coordValue}>{coordinates.x}</span>

                </div>
                <div className={styles.coordItem}>

                    <span className={styles.coordLabel}>Y (liked  / disliked)</span>
                    <span className={styles.coordValue}>{coordinates.y}</span>

                </div>
                <span className={`${styles.quadrantBadge} ${styles[quadrant]}`}>
                    {quadrant}
                </span>
            </div>

            {editingRating && (
                <p className={styles.editNote}>
                    Coordinates are locked. Delete or rate this media again to change coordinate position.
                </p>
            )}



            {/* Search media only if not selectedMedia is empty */}
            {/* Media Search */}

            {!selectedMedia ? (
                <div className={styles.inputGroup}>
                    
                    <label className={styles.label}>Search for title</label>

                    
                    <div className={styles.searchRow}>
                        {/* media type chips */}
                        <div className={styles.chipRow}>
                            {/* destructuring label and value */}
                            {MEDIA_TYPE_OPTIONS.map(type => (
                                <button
                                    key={type}
                                    className={`${styles.chip} ${searchMediaType === type ? styles.chipActive : ''}`}
                                    onClick={() => {
                                        setSearchMediaType(type)
                                        setSearchResults([]) // clear stale results when switching type
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.searchRow}>
                        <input 
                            className={styles.input}
                            type="text" 
                            value={searchQuery}
                            onChange={({ target }) => setSearchQuery(target.value)}
                            placeholder="e.g. The Godfather..."
                            
                            
                        />

                        <button 
                            className={`${styles.btnSecondary} ${styles.btnSmall}`}
                            type="button" 
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>

                    {/* Search results dropdown */}
                    {searchResults?.length > 0 && (
                        <div className={styles.searchResults}>
                            {searchResults.map((media, index) => (
                                <div 
                                    className={styles.searchRedultItem}
                                    key={media.tmdb_id ?? media.isbn ?? index} 
                                    onClick={() => handleMediaSelect(media)}
                                    style={{ padding: '8px', cursor: 'pointer', border: '1px solid #eee', borderRadius: '8px' }}
                                >

                                    <span 
                                        className={styles.mediaTypeDot}
                                        style={{ background: MEDIA_DOT_COLOR[media.media_type] ?? '#888' }}
                                    />
                                    

                                    <div>
                                        <p className={styles.mediaTitle}>{media.title}</p>
                                        <p className={styles.mediaMeta}>{media.media_type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
            ) : (
                // selected media row
                <div className={styles.selectedMediaRow}>
                    {/* if the user wants to change their choice */}

                    <span 
                        className={styles.mediaTypeDot}
                        style={{ background: MEDIA_DOT_COLOR[selectedMedia.media_type] ?? '#888' }}
                    />
                    <span className={styles.selectedMediaTitle}>
                        {selectedMedia.title}
                        <span className={styles.mediaMeta}> · {selectedMedia.media_type}</span>
                    </span>
                    
                    <button 
                        className={`${styles.btnGhost} ${styles.btnSecondary}`}
                        type="button" 
                        onClick={() => setSelectedMedia(null)}
                    >
                        Change
                    </button>
                </div>
            )}

            {/* Only show reason fields if media is selected */}
            {selectedMedia && (
                <>
                    {/* x axis */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Why was it good / bad?

                            <span className={styles.labelHint}>(x axis)</span>
                        </label>
                        
                        <textarea
                            className={styles.textarea}
                            value={formData.good_reason}
                            onChange={({ target }) => setFormData(prev => ({ ...prev, good_reason: target.value }))}
                            placeholder="The writing was tight but the pacing dragged in act 2..."
                        />
                        
                    </div>

                    {/* y axis */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Why did you like it / dislike it?

                            <span className={styles.labelHint}>(y axis)</span>
                        </label>
                        
                        <textarea 
                            className={styles.textarea}
                            value={formData.like_reason}
                            onChange={({ target }) => setFormData(prev => ({ ...prev, like_reason: target.value }))}
                            placeholder="Despite all it's flaws I still loved how sincere it was..."
                        />
                    </div>

                    {/* context */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Context

                            <span className={styles.labelHint}>(optional)</span>
                        </label>
                        <br />
                        <textarea 
                            className={styles.textarea}
                            value={formData.context}
                            onChange={({ target }) => setFormData(prev => ({ ...prev, context: target.value }))}
                            placeholder="Watched it on a flight, tired, might rewatch..."
                        />
                    </div>

                </>
            )}

            {/* footer */}

            <div className={styles.footer}>
                    <button className={styles.btnSecondary} type="button" onClick={onCancel}>
                        Cancel
                    </button>

                    {selectedMedia && (
                        <button className={styles.btnPrimary} type="submit">
                            Submit Rating →
                        </button>
                    )}
            </div>


        </form>
    );
}

export default RatingsForm;