const express = require('express')
const router = express.Router()
let media = require('../data/media')
let ratings = require('../data/ratings')

const generateId = () => {
    const maxId = media.reduce((max, m) => m.id > max ? m.id : max, 0)
    return (maxId + 1)
}

//API endpoint for searching media
//basic search with a search type and media type
//For example: http://localhost:3001/api/media?search=gladiator&type=movie
router.get('/', (request, response) => {
    const search = request.query.search?.toLowerCase()
    const type = request.query.type

    let results = media
    
    if (search) {
        results = results.filter(m => m.title.toLowerCase().includes(search))
    }

    if (type) {
        results = results.filter(m => m.media_type === type)
    }

    response.json(results)
})

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

// API endpoint for the ratings of a specific media
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


router.post('/', (request, response) => {
    const body = request.body

     // Validating required fields
    if (!body.title || !body.media_type || !body.release_year || !body.genre || !body.cover_image_url) {
        return response.status(400).json({
            error: "Missing required fields: title, media_type, release_year, genre, cover_image_url"
        })
    }

    const existing = media.find(m => m.title === body.title && m.media_type === body.media_type && m.release_year === body.release_year)

    if (existing) {
        return response.status(409).json({
            error: "This media already exists."
        })
    }

    const newMedium = {
        "id": generateId(),
        "title": body.title,
        "media_type": body.media_type,
        "release_year": body.release_year,
        "genre": body.genre,
        "cover_image_url": body.cover_image_url
    }

    media = media.concat(newMedium)
    response.status(201).json(newMedium)
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

//API endpoint to delete a piece of media
router.delete('/:id', (request, response) => {
    const id = Number(request.params.id)
    media = media.filter(m => m.id !== id)

    response.status(204).end()
})


module.exports = router
