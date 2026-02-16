import { useState } from "react";
import type { NewRating, Ratings } from "../../types/ratings.types";
import type { Media } from "../../types/media.types";

type RatingsFormProps = {
    coordinates: { x: number, y: number };
    onSubmit: (rating: NewRating) => void;
    onCancel: () => void;
    editingRating?: Ratings | null;
};

const RatingsForm = ({ coordinates, onSubmit, onCancel, editingRating }: RatingsFormProps) => {

    const [searchQuery, setSearchQuery] = useState(''); // passed to useParams then the backend to return the media we need
    const [searchResults, setSearchResults] = useState<Media[]>([]); 
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(editingRating?.media || null);
    const [formData, setFormData] = useState({
        good_reason: editingRating?.good_reason || '',
        like_reason: editingRating?.like_reason || '',
        context: editingRating?.context || ''
    });

    // queries the backend to find the appropriate media results
    const handleSearch = async () => {
        const response = await fetch(`http://localhost:3001/api/media?search=${searchQuery}`);
        const result = await response.json();
        setSearchResults(result);
    }

    const handleMediaSelect = (media: Media) => {
        setSelectedMedia(media);
        setSearchResults([]); // Clear search results after media has been found
    }

    const handleSubmit = (event: React.FormEvent) => {
        // no refresh
        event.preventDefault();

        if (!selectedMedia) return;

        const newRating: NewRating = {
            media_id: selectedMedia.id,
            x_coordinate: coordinates?.x,
            y_coordinate: coordinates?.y,
            good_reason: formData.good_reason,
            like_reason: formData.like_reason,
            context: formData.context
        };

        onSubmit(newRating)
    }

    // Determine quadrant for display
    const getQuadrant = () => {
        if (coordinates.x >= 0 && coordinates.y >= 0) return 'Over';
        if (coordinates.x < 0 && coordinates.y >= 0) return 'Overhated';
        if (coordinates.x >= 0 && coordinates.y < 0) return 'Overrated';
        return 'Under';
    };


    return (
        <form onSubmit={handleSubmit}>
            <h3>Rate { editingRating ? "" : "New" } Media</h3>
            <div style={{ width: '95%', marginBottom: '15px', padding: '5px', background: '#f5f5f5', borderRadius: '5px' }}>
                {/* Shows the user what coordinates they picked */}
                    {coordinates && (
                        <>
                        <p><strong>Coordinates: </strong> ({coordinates.x} , {coordinates.y})</p>
                        <p><strong>Quadrant: </strong> {getQuadrant()}</p>
                        </>
                    )}
            </div>

            {/* Search media only if not selectedMedia is empty */}

            {!selectedMedia ? (
                <div>
                    {/* Search for media input box */}
                    <label>Title:</label>
                    <div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={({ target }) => setSearchQuery(target.value)}
                            placeholder="Search for media..."
                            style={{ width: '95%', padding: '8px', borderRadius: '8px', border: '1px solid #252525' }}
                            // required
                        />
                        <button type="button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>

                    {/* Search results dropdown */}
                    {searchResults?.length > 0 && (
                        <div>
                            {searchResults.map(media => (
                                <div 
                                    key={media.id} 
                                    onClick={() => handleMediaSelect(media)}
                                    style={{ padding: '8px', cursor: 'pointer', border: '1px solid #eee', borderRadius: '8px' }}
                                >
                                    <strong>{media.title}</strong> ({media.media_type})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
            ) : (
                <div>
                    {/* if the user wants to change their choice */}

                    <p><strong>Selected:</strong> {selectedMedia.title} ({selectedMedia.media_type})</p>
                    <button type="button" onClick={() => setSelectedMedia(null)}>
                        Change
                    </button>
                </div>
            )}

            {/* Only show reason fields if media is selected */}
            {selectedMedia && (
                <>
                    {/* x axis */}
                    <div>
                        <label>Why was it good / bad?</label>
                        <br />
                        <textarea 
                            value={formData.good_reason}
                            onChange={({ target }) => setFormData(prev => ({ ...prev, good_reason: target.value }))}
                            style={{ width: '95%', borderRadius: '8px', border: '1px solid #252525' }}
                        />
                        
                    </div>

                    {/* y axis */}
                    <div>
                        <label>Why did you like it / dislike it?</label>
                        <br />
                        <textarea 
                            value={formData.like_reason}
                            onChange={({ target }) => setFormData(prev => ({ ...prev, like_reason: target.value }))}
                            style={{ width: '95%', borderRadius: '8px', border: '1px solid #252525' }}
                        />
                    </div>

                    {/* context */}
                    <div>
                        <label>Context (optional)</label>
                        <br />
                        <textarea 
                            value={formData.context}
                            onChange={({ target }) => setFormData(prev => ({ ...prev, context: target.value }))}
                            style={{ width: '95%', borderRadius: '8px', border: '1px solid #252525' }}
                        />
                    </div>

                    <button type="submit">
                        Submit Rating
                    </button>
                </>
            )}

            <button type="button" onClick={onCancel}>
                Cancel
            </button>

        </form>
    );
}

export default RatingsForm;