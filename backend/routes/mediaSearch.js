const express = require('express');
const router = express.Router();


router.get('/', async (request, response) => {
    const { query, media_type } = request.query;

    if (!query || !media_type) return response.status(400).json({ error: 'query and media_type are required' });

    try {
        if (media_type === 'book') {
            const openLibraryResponse = await fetch(`https://openlibrary.org/search.json?q=${query}&fields=title,author_name,first_publish_year,isbn&limit=10`);

            const data = await openLibraryResponse.json();

            const results = data.docs.map(book => ({
                isbn: book.isbn?.[0] ?? null,
                title: book.title,
                media_type: 'book',
                release_year: book.first_publish_year ?? null,
                cover_image_url: book.isbn?.[0] 
                        ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg` 
                        : null,
                creator: book.author_name?.join(', ') ?? null
            }));

            return response.status(200).json(results);
        }

        if (media_type === 'movie' || media_type === 'show') {
            const tmdbEndpoint = media_type === 'movie' ? 'search/movie' : 'search/tv';
            const tmdbResponse = await fetch(`https://api.themoviedb.org/3/${tmdbEndpoint}?query=${query}`, 
                {  headers: {  Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}` } }
            );

            const data = await tmdbResponse.json();

            const results = data.results.map(item => ({
                tmdb_id: item.id,
                title: item.title ?? item.name,
                media_type: media_type === 'movie' ? 'movie' : 'show',
                release_year: parseInt(
                    (item.release_date ?? item.first_air_date ?? '0').split('-')[0]
                ),
                cover_image_url: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
                        : null,
                creator: null
            }));

            return response.status(200).json(results);
        }

        return response.status(400).json({ error: 'media_type must be movie, show or book' });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Failed to fetch from external APIs' });
    }
});

module.exports = router;