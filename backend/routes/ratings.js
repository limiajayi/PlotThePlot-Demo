const { supabase } = require('../lib/supabase')
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
// over -> x positive y positive
// overhated -> x negative y positive
// overrated -> x positive y negative
// under -> x negative y negative

router.get('/users/:id/ratings', async (request, response) => {
    // this is used to get a user's ratings alongside query parameters
    // for example:  http://localhost:3001/api/users/:userId/ratings
    // query:        http://localhost:3001/api/users/:userId/ratings?title=avengers&media_type=movie&quadrant=guilty-pleasure

    const id = request.params.id;
    const title = request.query.title?.toLowerCase();
    const quadrant = request.query.quadrant?.toLowerCase();
    const media_type = request.query.media_type?.toLowerCase();

    let query = supabase
                .from('ratings')
                .select('*, media (*)')
                .eq('user_id', id)

    if (media_type) query = query.eq('media.media_type', media_type)
    
    if (title) query = query.ilike('media.title', `%${title}%`) // ilike is case-insensitive

    if (quadrant) {
        if (quadrant === 'over') query = query.gt('x_coordinate', 0).gt('y_coordinate', 0)
        else if (quadrant === 'overhated') query = query.lt('x_coordinate', 0).gt('y_coordinate', 0)
        else if (quadrant === 'overrated') query = query.gt('x_coordinate', 0).lt('y_coordinate', 0)
        else if (quadrant === 'under') query = query.lt('x_coordinate', 0).lt('y_coordinate', 0)
        else { return response.status(404).json({ error: `No ratings exist for quadrant ${quadrant}` }) }
    }

    const { data, error } = await query

    // if data exist, return their json format
    // else return status code 404: not found

    if (error) {
        console.log("Error: ", error)
        return response.status(404).json({
            error: `Error fetching user ratings: ${error.message}`
        })
    }

    if (data) {
        return response.json(data)
    }
})

router.get('/users/:userId/ratings/:ratingId', async (request, response) => {
    const {userId, ratingId} = request.params
    
    const { data, error } = await supabase
        .from('ratings')
        .select('*, media (*)')
        .eq('user_id', userId)
        .eq('id', ratingId)

    if (error) {
        return response.status(404).json({
            error: 'Error finding this rating.'
        })
    }

    return response.json(data)
})


//API endpoint to add a new rating by user
router.post('/users/:id/ratings', async (request, response) => {
    const body = request.body
    const id = request.params.id

     // validate required fields
    if (!body.media || !body.x_coordinate || !body.y_coordinate || !body.good_reason || !body.like_reason) {
        return response.status(400).json({
            error: "Missing required fields: media, x_coordinate, y_coordinate, good_reason, like_reason"
        })
    }

    // -- upserting media --
    const { tmdb_id, isbn, title, media_type, release_year, cover_image_url, creator } = body.media;

    const lookupColumn = media_type === 'book' ? 'isbn' : 'tmdb_id';
    const lookupValue = media_type === 'book' ? isbn : tmdb_id;

    if (!lookupValue) {
        console.log('Missing isbn or tmdb_id');
        return response.status(400).json({ error: 'Media is missing a valid external identifier (tmdb_id or isbn)' })
    }

    let mediaId;

    // initially searching in supabase to see if the media exists
    const { data: existingMedia } = await supabase
        .from('media')
        .select('id')
        .eq(lookupColumn, lookupValue)
        .single();

    // if the media exists, 
    // assign mediaId to the id of the existing media
    if (existingMedia) {
        mediaId = existingMedia.id
    } else {
        const { data: newMedia, error: mediaError } = await supabase
            .from('media')
            .insert([{ title, media_type, release_year, tmdb_id, isbn, cover_image_url, creator }])
            .select('id')
            .single();

        if (mediaError) {
            console.log(mediaError);
            return response.status(500).json({ error: `Failed to create media: ${mediaError.message}` });
        }

        mediaId = newMedia.id;
    }

    // inserting rating

    // if the rating exists we need the highest watch number
    const { data: existingRating } = await supabase
        .from('ratings')
        .select('watch_number')
        .eq('user_id', id)
        .eq('media_id', mediaId)
        .order('watch_number', { ascending: false })
        .limit(1)
        .single()

    const newRating = {
        user_id: id,
        media_id: mediaId,
        x_coordinate: body.x_coordinate,
        y_coordinate: body.y_coordinate,
        good_reason: body.good_reason,
        like_reason: body.like_reason,
        context: body.context || null,
        watch_number: existingRating ? existingRating.watch_number + 1 : 1
    };

    const { data, error } = await supabase
        .from('ratings')
        .insert([newRating])
        .select('*, media (*)');

    if (error) return response.status(500).json({ error: `Error inserting new rating: ${error.message}` });

    response.status(201).json(data);
})

// API endpoint to modify a rating by user
router.put('/users/:userId/ratings/:ratingId', async (request, response) => {
    const {userId, ratingId} = request.params
    const body = request.body

    const newRating = {
        "good_reason": body.good_reason,
        "like_reason": body.like_reason,
        "context": body.context || null,
    }

    const { data, error } = await supabase
        .from('ratings')
        .update(newRating)
        .eq('id', ratingId)
        .eq('user_id', userId)
        .select('*, media (*)')

        if (error) return response.status(500).json({ error: `Error updating ratings: ${error.message}.` })
    
    response.json(data)
})

//API endpoint to delete a user's rating
router.delete('/users/:userId/ratings/:ratingId', async (request, response) => {
    const { userId, ratingId } = request.params

    const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId)
        .eq('user_id', userId)
    
    if (error) {
        console.log(`Error deleting this rating ${error.message}`);
        return response.status(500).json({ error: `Error deleting rating: ${error.message}` })
    }

    response.status(204).end()
})


module.exports = router