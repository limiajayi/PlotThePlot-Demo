const express = require('express')
const router = express.Router()
let media = require('../data/media')
let ratings = require('../data/ratings')

const generateId = () => {
    const maxId = media.reduce((max, m) => m.id > max ? m.id : max, 0)
    return (maxId + 1)
}

// API endpoint for all media
// TODO: could add a way to filter for media types
router.get('/', (request, response) => {
    response.json(media)
})

// API endpoint for a specific medium
router.get('/:id', (request, response) => {
    const id = Number(request.params.id)
    const medium = media.find(m => m.id === id)

    if (medium) {
        return response.json(medium)
    } else {
        response.status(404).end()
    }
})

// API endpoint to modify a piece of media
router.put('/:id', (request, response) => {
    const id = Number(request.params.id)
    const medium = media.find(m => m.id === id)
    const body = request.body

    media = media.filter(m => m.id !== id)

    if (!medium) {
        return response.status(404).json({
            error: "This piece of media does not exist."
        })
    }

    const newMedium = {
        ...medium,
        "title": body.title,
        "genre": body.genre,
        "cover_image_url": body.cover_image_url,
    }

    media = media.concat(newMedium)
    response.json(newMedium)
})

// API endpoint for the ratings of a specific media
// TODO: Make a way to average every single rating for a specific medium
router.get('/:id/ratings', (request, response) => {
    const id = Number(request.params.id)
    const mediaRatings = ratings.filter(rating => rating.media_id === id)

    if (mediaRatings) {
        return response.json(mediaRatings)
    } else {
        return response.status(404).json({
            error: "This media does not exist."
        })
    }
})

module.exports = router
