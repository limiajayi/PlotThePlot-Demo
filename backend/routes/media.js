const { supabase } = require('../lib/supabase');
const express = require('express');
const router = express.Router();

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
});


module.exports = router
