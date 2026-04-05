import { useState } from "react";
import type { NewRating, Ratings } from "../types/ratings.types";
import type { User } from "../types/user.types";
import useApi from "./useApi";


const useRatingEdit = (user: User, rating: Ratings | null, setRating: (value: Ratings | ((prevState: Ratings | null) => Ratings | null) | null) => void) => {

    const [editingRating, setEditingRating] = useState<Ratings | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const api = useApi();

    const handleEdit = () => {
        setEditingRating(rating);
        setIsModalOpen(true);
        setSelectedCoordinates({ x: rating?.x_coordinate ?? 0, y: rating?.y_coordinate ?? 0 })
        setRating(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setRating(null);
        setSelectedCoordinates({ x: 0, y: 0 });
        setEditingRating(null);
    };

    const handleRatingSubmit = async (rating: NewRating) => {
        try {

            setIsSubmitting(true)
            
            if (editingRating) {

                await api.ratings.updateRating(user.id, editingRating.id, {
                    good_reason: rating.good_reason,
                    like_reason: rating.like_reason,
                    context: rating.context,
                });
            } else {
                await api.ratings.createRating(user.id, rating);
            }

            setIsModalOpen(false);
            setEditingRating(null);
            setSelectedCoordinates({ x: 0, y: 0 });
            window.location.reload();
            
        } catch (error) {
            console.log(`Error ${ editingRating ? 'updating' : 'creating' } rating`, error);
            alert(`Failed to ${editingRating ? 'update' : 'create'} rating`);
            
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!rating) return;

        try {
            await api.ratings.deleteRating(user.id, rating.id);
            setRating(null);
            window.location.reload();
        } catch (error) {
            console.log('Error deleting rating: ', error);
            alert(`Failed to delete rating`);
        }
    };

    return { editingRating, isModalOpen, setIsModalOpen, selectedCoordinates, isSubmitting, handleEdit, handleRatingSubmit, handleModalClose, handleDelete };
}

export default useRatingEdit;