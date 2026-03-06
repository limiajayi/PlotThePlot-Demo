const { supabase } = require('../lib/supabase')
const express = require('express')
const router = express.Router()
let media = require('../data/media')
let ratings = require('../data/ratings')

//API endpoint for searching media
//basic search with a search type and media type
//For example: http://localhost:3001/api/media?search=gladiator&type=movie
router.get('/', async (request, response) => {
    const search = request.query.search?.toLowerCase()
    const type = request.query.type

    let query = supabase
        .from('media')
        .select('*, ratings (*)');
    
    if (search) query = query.ilike('title', `%${search}%`);

    if (type) query = query.eq('media_type', type);

    const { data, error } = await query;

    if (error) {
        console.log("Error fetching all media: ", error);
        return response.json({ 
            error: `Error fetching all media: ${error.message}`
        });
    }

    response.json(data);
});

// API endpoint for the ratings of a specific media
router.get('/:id/ratings', async (request, response) => {
    const id = request.params.id;

    const { data, error } = await supabase
        .from('media')
        .select('ratings (*)')
        .eq('id', id);

    if (error) {
        console.log("Error fetching this medium: ", error);
        return response.json({ 
            error: `Error fetching all media: ${error.message}`
        });
    }

    response.json(data);
})

//TODO: add legitimate ways to post media
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
        "cover_image_url": body.cover_image_url,
        "ratings": [],
        "rating_count": 0,
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
        "ratings": body.ratings,
        "ratings_count": body.ratings.length,
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
