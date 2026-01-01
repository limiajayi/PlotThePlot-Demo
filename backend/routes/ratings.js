const express = require('express')
const router = express.Router()
let ratings = require('../data/ratings')

// API endpoint to get a specific user's ratings
router.get('/users/:id/ratings', (request, response) => {
    const id = Number(request.params.id)
    const userRatings = ratings.filter(rating => rating.user_id === id)

    console.log(userRatings)

    if (userRatings) {
        return response.json(userRatings)
    } else {
        return response.status(404).json({
            error: "This user does not exist."
        })
    }
})

// API endpoint to modify a rating by user
router.put('/users/:userId/ratings/:ratingId', (request, response) => {
    const {userId, ratingId} = request.params
    const rating = ratings.find(r => r.id === Number(ratingId))
    const body = request.body

    if (!rating) {
        return response.status(404).json({
            error: "This rating does not exist"
        })
    } else if (rating.user_id !== Number(userId)) {
        return response.status(403).json({
            error: "This is not your rating."
        })
    }

    ratings = ratings.filter(r => r.id !== Number(ratingId))

    const newRating = {
        ...rating,
        "x_coordinate": body.x_coordinate,
        "y_coordinate": body.y_coordinate,
        "good_reason": body.good_reason,
        "like_reason": body.like_reason,
        "context": body.context,
        "watch_number": rating.watch_number + 1
    }

    ratings = ratings.concat(newRating)
    response.json(newRating)
})

module.exports = router
