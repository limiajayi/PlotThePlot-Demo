import { ErrorBoundary } from "react-error-boundary";
// import useRatings from "../../hooks/useRatings";
import ScatterPlot from "./ScatterPlot";
import { useState } from "react";
import Modal from "react-modal";
import RatingsForm from "./RatingsForm";
import type { NewRating, Ratings } from "../../types/ratings.types";
import RatingsDetail from "./RatingsDetail";
import type { User } from "../../types/user.types";

type RatingsGraphProps = {
    user: User;
    ratings: Ratings[];
}

const RatingsGraph = ({ user, ratings }: RatingsGraphProps) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false); // false when modal is closed, true when modal is open
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 }); // passed from scatter plot
    const [selectedRatings, setSelectedRatings] = useState<Ratings | null>(null);
    const [editingRating, setEditingRating] = useState<Ratings | null>(null);

    // sets coordinates from the ScatterPlot component
    const handleCoordinateClick = (x: number, y: number ) => {
        setSelectedCoordinates({x, y});
        setIsModalOpen(true);
    };

    // when the modal is closed, isModalOpen equals false, reset selected coordinates
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCoordinates({ x: 0, y: 0 });
        setEditingRating(null);
    };

    // when creating a new rating
    // or editing an existing rating
    const handleRatingSubmit = async (rating: NewRating) => {
        try {
            // if the user is editing we're changing it with a rating id
            // else we're letting the server decide the id
            const url = editingRating 
                        ? `http://localhost:3001/api/users/${user.id}/ratings/${editingRating.id}` 
                        : `http://localhost:3001/api/users/${user.id}/ratings`;
            
            // if editing the method is PUT
            // else the method is POST
            const method = editingRating ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...rating,
                })
            });

            if (!response.ok) throw new Error(`Failed to ${editingRating ? 'update' : 'create'} rating.`);

            //Close the modal we're done!
            setIsModalOpen(false);
            setEditingRating(null);
            setSelectedCoordinates({ x: 0, y: 0 }); // default for selected coordinates

            window.location.reload()

        } catch (error) {
            console.error('Error rating: ', error);
            alert(`Failed to ${editingRating ? 'update' : 'create'} rating`);
        }
    };

    // for when the user deletes a rating
    const handleDelete = async () => {
        if (!selectedRatings) return;

        try {
            const response = await fetch(
                `http://localhost:3001/api/users/${user.id}/ratings/${selectedRatings.id}`,
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

    // for when the user wants to edit a rating
    // use rating form & rating detail
    const handleEdit = () => {
        setEditingRating(selectedRatings);
        setSelectedRatings(null);
        setIsModalOpen(true);
        setSelectedCoordinates({ x: selectedRatings?.x_coordinate ?? 0, y: selectedRatings?.y_coordinate ?? 0 });
    }

    //TODO: change useRatings hook
    //if (loading) return <div>Loading graph...</div>;
    // if (error) return <div>Error loading graph: {error}</div>;

    return (
            <div>
                
                    {ratings.length === 0 && (
                        <div>
                            No ratings yet. Click the graph below to add a rating
                        </div>
                    )}
                    

                    <ErrorBoundary FallbackComponent={() => <div>Error Detected</div>}>
                        <div style={{ display: 'flex', width: '95%', alignContent: 'center', justifyContent: 'center', padding: '24px' }}>
                            <ScatterPlot 
                                data={ratings} 
                                onCoordinateClick={handleCoordinateClick}
                                onDotHover={setSelectedRatings}
                            />
                        </div>

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

                            {selectedRatings && (
                            <div>
                                
                                <RatingsDetail 
                                    ratings={selectedRatings}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                                <button onClick={() => {
                                    setSelectedRatings(null);
                                    setIsModalOpen(false);
                                }}>
                                    Close
                                </button>
                            </div>
                            )}

                            {!selectedRatings && (
                                <RatingsForm 
                                    coordinates={selectedCoordinates}
                                    onSubmit={handleRatingSubmit}
                                    onCancel={handleModalClose}
                                    editingRating={editingRating}
                                />
                            )}
                        </Modal>
                    </ErrorBoundary>
            </div>
    );
}

export default RatingsGraph