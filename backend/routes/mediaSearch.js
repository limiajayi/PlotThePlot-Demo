const express = require('express');
const router = express.Router();


router.get('/', async (request, response) => {
    const { query, media_type } = request.query;

    if (!query || !media_type) return response.status(400).json({ error: 'query and media_type are required' });

    try {
        if (media_type === 'book') {
        const openLibraryResponse = await fetch(`https://openlibrary.org/search.json?q=${query}`);

        
        }

    if (media_type === 'movie' || media_type === 'show') {
        const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}`, 
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
                }
            }
        );

    }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Failed to fetch from external APIs' });
    }
});

module.exports = router;