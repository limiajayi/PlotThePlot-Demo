import type { User } from "../../types/user.types";
import { ErrorBoundary } from "react-error-boundary";
import useRatings from "../../hooks/useRatings";
import ScatterPlot from "./ScatterPlot";
import { useState } from "react";
import Modal from "react-modal";
import RatingsForm from "./RatingsForm";
import type { NewRating, Ratings } from "../../types/ratings.types";
import RatingsDetail from "./RatingsDetail";

type RatingsGraphProps = {
    user: User;
}

const RatingsGraph = ({ user }: RatingsGraphProps) => {
    
    const { ratings, loading, error } = useRatings();
    const [isModalOpen, setIsModalOpen] = useState(false); // false when modal is closed, true when modal is open
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 }); // passed from scatter plot
    const [selectedRatings, setSelectedRatings] = useState<Ratings | null>(null);

    // sets coordinates from the ScatterPlot component
    const handleCoordinateClick = (x: number, y: number ) => {
        setSelectedCoordinates({x, y});
        setIsModalOpen(true);
    };

    // when the modal is closed, isModalOpen equals false, reset selected coordinates
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCoordinates({ x: 0, y: 0 });
    };

    // when creating a new rating
    const handleRatingSubmit = async (rating: NewRating) => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${user.id.toString()}/ratings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...rating,
                })
            });

            if (!response.ok) throw new Error('Failed to create rating');

            //Close the modal we're done!
            setIsModalOpen(false);
            setSelectedCoordinates({ x: 0, y: 0 });

        } catch (error) {
            console.error('Error submitting rating: ', error);
            alert('Failed to submit rating');
        }
    };

    const handleDelete = async () => {
        if (!selectedRatings) return;
        if (!confirm('Are you ure you want to delete this rating?')) return;

        try {
            const response = await fetch(
                `http://localhost:3001/api/users/${user.id.toString()}/ratings/${selectedRatings.id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) throw new Error('Failed to delete rating.');

            // close ratings detail
            setSelectedRatings(null);

            //refresh the page
            //for now
            window.location.reload();

        } catch (error) {
            console.error('Error deleting: ', error);
            alert('Failed to delete rating');
        }
    };


    if (loading) return <div>Loading graph...</div>;
    if (error) return <div>Error loading graph: {error}</div>;

    return (
            <div>
                <h2>Graph for {user?.username}</h2>
                    {ratings.length === 0 && (
                        <div>
                            No ratings yet. Click the graph below to add a rating
                        </div>
                    )}

                    <ErrorBoundary FallbackComponent={() => <div>Something's wrong with the form</div>}>
                        {selectedRatings && (
                            <div style={{ width: '30%', position: 'absolute', top: '90%', right: '5rem' }}>
                                <button onClick={() => setSelectedRatings(null)}>
                                    Close
                                </button>
                                <RatingsDetail 
                                    ratings={selectedRatings}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                    </ErrorBoundary>

                    <ErrorBoundary FallbackComponent={() => <div>Error Detected</div>}>
                        <ScatterPlot 
                            data={ratings} 
                            onCoordinateClick={handleCoordinateClick}
                            onDotHover={setSelectedRatings}
                        />

                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={handleModalClose}
                            contentLabel="Rate Media"
                            appElement={document.getElementById('root') as HTMLElement}
                            style={{
                                content: {
                                    width: '400px',
                                    height: '80%',
                                    margin: 'auto',
                                    borderRadius: '8px'
                                }
                            }}
                        >
                            <RatingsForm 
                                coordinates={selectedCoordinates}
                                onSubmit={handleRatingSubmit}
                                onCancel={handleModalClose}
                            />
                        </Modal>
                    </ErrorBoundary>
            </div>
    );
}

export default RatingsGraph