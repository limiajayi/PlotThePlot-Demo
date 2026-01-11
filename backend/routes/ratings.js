const express = require('express')
const router = express.Router()
let ratings = require('../data/ratings')
let media = require('../data/media')

const generateId = (userId) => {
    const userRatings = ratings.filter(rating => rating.id === userId)
    const maxId = userRatings.reduce((max, rating) => rating.id > max ? rating.id : max, 0 )

    return (maxId + 1)
}

// takes in ratings objects and filters them based on the different quadrants
// amazing media -> x positive y positive
// guilty pleasure -> x negative y positive
// good but not for me -> x positive y negative
// dont touch -> x negative y negative

const quadrants = (quadrant, ratings) => {
    if (quadrant === "guilty-pleasure") {
        return ratings.filter(r => r.x_coordinate < 0 && r.y_coordinate > 0)
    } else if (quadrant === "amazing-media") {
        return ratings.filter(r => r.x_coordinate > 0 && r.y_coordinate > 0)
    } else if (quadrant === "dont-touch") {
        return ratings.filter(r => r.x_coordinate < 0 && r.y_coordinate < 0)
    } else {
        return ratings.filter(r.x_coordinate > 0 && r.y_coordinate < 0)
    }
}

router.get('/users/:id/ratings', (request, response) => {
    // this is used to get a user's ratings alongside query parameters
    // for example:  http://localhost:3001/api/users/:userId/ratings
    // query:        http://localhost:3001/api/users/:userId/ratings?title=avengers&media_type=movie

    const id = Number(request.params.id)
    const title = request.query.title?.toLowerCase()
    const quadrant = request.query.quadrant?.toLowerCase()
    const media_type = request.query.media_type?.toLowerCase()

    let results = ratings.filter(r => r.user_id === id)

    // changing each rating object to also include their equivalent media objects
    // like a join on ratings and media
    results = results.map(rating => {
        const mediaItem = media.find(m => m.id === rating.media_id)
        return {
            ...rating,
            media: mediaItem
        }
    })

    // searching ratings by quadrant
    if (quadrant) {
        results = quadrants(quadrant, results)
    }

    // searching ratings by media type
    if (media_type) {
        results = results.filter(rating => rating.media?.media_type === media_type)
    }

    // searching ratings by title
    if (title) {
        results = results.filter(r => {
            return r.media?.title.toLowerCase().includes(title)
        })
    }

    // if results exist, return their json format
    // else return status code 404: not found
    if (results || results.length >= 0) {
        return response.json(results)
    } else {
        return response.status(404).json({
            error: "This user does not exist."
        })
    }
})


// // API endpoint to get a specific user's ratings
// router.get('/users/:id/ratings', (request, response) => {
//     const id = Number(request.params.id)
//     const userRatings = ratings.filter(rating => rating.user_id === id)

//     if (userRatings) {
//         return response.json(userRatings)
//     } else {
//         return response.status(404).json({
//             error: "This user does not exist."
//         })
//     }
// })


router.get('/users/:userId/ratings/:ratingId', (request, response) => {
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

    response.json(rating)
})


//API endpoint to add a new rating by user
router.post('/users/:id/ratings', (request, response) => {
    const body = request.body
    const id = request.params.id
    const date = new Date()

     // validate required fields
    if (!body.media_id || !body.x_coordinate || !body.y_coordinate || !body.good_reason || !body.like_reason || !body.context) {
        return response.status(400).json({
            error: "Missing required fields: media_id, x_coordinate, y_coordinate, good_reason, like_reason, context"
        })
    }

    const newRating = {
        "id": generateId(id),
        "user_id": id,
        "media_id": body.media_id,
        "x_coordinate": body.x_coordinate,
        "y_coordinate": body.y_coordinate,
        "good_reason": body.good_reason,
        "like_reason": body.like_reason,
        "context": body.context,
        "watch_number": 1,
        "created_at": date
    }

    ratings = ratings.concat(newRating)
    response.status(201).json(newRating)
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

//API endpoint to delete a user's rating
router.delete('/users/:userId/ratings/:ratingId', (request, response) => {
    const {userId, ratingId} = request.params
    ratings = ratings.filter(r => r.id === Number(ratingId) && r.user_id === Number(userId))

    response.status(204).end()
})


module.exports = router