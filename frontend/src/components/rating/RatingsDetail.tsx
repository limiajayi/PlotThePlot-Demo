import type { Ratings } from "../../types/ratings.types"

type RatingsDetailProps = {
    ratings: Ratings | null;
};

const RatingsDetail = ({ ratings }: RatingsDetailProps) => {
    if (!ratings) return <div>No ratings available</div>;
    return (
        <div>
            <div style={{ width: '80%', marginTop: '10px', padding: '5px', background: '#f5f5f5', borderRadius: '5px' }}>
                <div>
                    <strong> {ratings.media.title} </strong>
                        ({ratings.media.media_type})
                </div>
                <div>
                    <strong>Coordinates: </strong> 
                    ({ratings.x_coordinate}, {ratings.y_coordinate})
                </div>
            </div>

            <div>
                <strong>Good / Bad reason: </strong> 
                {ratings.good_reason}
            </div>

            <div>
                <strong>Liked / Disliked reason: </strong> 
                {ratings.like_reason}
            </div>

            {ratings.context && (
                <div>
                    <strong>Context: </strong> 
                    {ratings.context}
                </div>
            )}

            <div>
                <button 
                    style={{ margin: '4px', padding: '5px' }}
                >
                    Edit
                </button>
                <button 
                    style={{ padding: '5px', margin: '4px', backgroundColor: '#db3838', color: 'white',  borderRadius: '3px', border: '1px solid black'}}
                >
                    Delete
                </button>
            </div>

        </div>
    );
};

export default RatingsDetail;