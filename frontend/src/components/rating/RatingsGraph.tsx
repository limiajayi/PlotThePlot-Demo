import { ErrorBoundary } from "react-error-boundary";
import ScatterPlot from "./ScatterPlot";
import { useState } from "react";
import Modal from "react-modal";
import RatingsForm from "./RatingsForm";
import type { NewRating, Ratings } from "../../types/ratings.types";
import RatingsDetail from "./RatingsDetail";
import type { User } from "../../types/user.types";
import useApi from "../../hooks/useApi";
import styles from "../../styles/RatingsList.module.css"

type RatingsGraphProps = {
    user: User;
    ratings: Ratings[];
}

const RatingsGraph = ({ user, ratings }: RatingsGraphProps) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false); // false when modal is closed, true when modal is open
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 }); // passed from scatter plot
    const [selectedRatings, setSelectedRatings] = useState<Ratings | null>(null);
    const [editingRating, setEditingRating] = useState<Ratings | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const api = useApi();

    // sets coordinates from the ScatterPlot component
    const handleCoordinateClick = (x: number, y: number ) => {
        setSelectedCoordinates({x, y});
        setIsModalOpen(true);
    };

    // when the modal is closed, isModalOpen equals false, reset selected coordinates
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCoordinates({ x: 0, y: 0 });
        setSelectedRatings(null);
        setEditingRating(null);
    };

    // when creating a new rating
    // or editing an existing rating

    const handleRatingSubmit = async (rating: NewRating) => {
        try {
            setIsSubmitting(true);

            if (editingRating) {
                await api.ratings.updateRating(user.id, editingRating.id, {
                    good_reason: rating.good_reason,
                    like_reason: rating.like_reason,
                    context: rating.context
                });
            } else {
                await api.ratings.createRating(user.id, rating);
            }

            setIsModalOpen(false);
            setEditingRating(null);
            setSelectedCoordinates({ x: 0, y: 0 });
            window.location.reload();

        } catch (error) {
            console.error('Error creating rating:', error);
            alert(`Failed to ${editingRating ? 'update' : 'create'} rating`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // for when the user deletes a rating
    const handleDelete = async () => {
        if (!selectedRatings) return;

        try {
            
            await api.ratings.deleteRating(user.id, selectedRatings.id);
            setSelectedRatings(null);
            window.location.reload();

        } catch (error) {
            console.error('Error deleting rating: ', error);
            alert(`Failed to delete rating`);
        }

    }

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
                        <div className={styles.empty}>
                            No ratings yet. Click the graph below to add a rating
                        </div>
                    )}

                    <ErrorBoundary FallbackComponent={() => <div>Error Detected</div>}>
                        <div style={{ display: 'flex' }}>
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
                                    onClose={handleModalClose}
                                />
                            </div>
                            )}

                            {!selectedRatings && (
                                <RatingsForm 
                                    coordinates={selectedCoordinates}
                                    onSubmit={handleRatingSubmit}
                                    onCancel={handleModalClose}
                                    editingRating={editingRating}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </Modal>
                    </ErrorBoundary>
            </div>
    );
}

export default RatingsGraph