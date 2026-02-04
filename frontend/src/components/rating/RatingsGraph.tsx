import type { User } from "../../types/user.types";
import { ErrorBoundary } from "react-error-boundary";
import useRatings from "../../hooks/useRatings";
import ScatterPlot from "./ScatterPlot";
import { useState } from "react";
import Modal from "react-modal";
import RatingsForm from "./RatingsForm";
import type { NewRating } from "../../types/ratings.types";

type RatingsGraphProps = {
    user: User;
}

const RatingsGraph = ({ user }: RatingsGraphProps) => {
    
    const { ratings, loading, error } = useRatings();
    const [isModalOpen, setIsModalOpen] = useState(false); // false when modal is closed, true when modal is open
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 }); // passed from scatter plot

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

    const handleRatingSubmit = (rating: NewRating) => {
        
    };

    if (loading) return <div>Loading graph...</div>;
    if (error) return <div>Error loading graph: {error}</div>;

    return (
            <div>
                <h2>Graph for {user?.username}</h2>

                    <ErrorBoundary FallbackComponent={() => <div>Error Detected</div>}>
                        <ScatterPlot 
                            data={ratings} 
                            onCoordinateClick={handleCoordinateClick}
                        />

                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={handleModalClose}
                            contentLabel="Rate Media"
                            ariaHideApp={false}
                            style={{
                                content: {
                                    width: '400px',
                                    height: '70vh',
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