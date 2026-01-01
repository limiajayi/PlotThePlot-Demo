const express = require('express')
const app = express()


// dummy data for what the API will possibly look like
// could likely be more complicated than this

//dummy data for users
let users = [
    {
        "id": 1,
        "username": "temi_ajayi",
        "email": "temi@plottheplot.com",
        "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=temi",
        "created_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": 2,
        "username": "movie_buff_23",
        "email": "cinephile@example.com",
        "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=buff",
        "created_at": "2024-02-20T14:22:00Z"
    }
]

//dummy data for the type of medium that would be used in plottheplot
let media = [
    {
        "id": 1,
        "title": "Avengers: Age of Ultron",
        "media_type": "movie",
        "release_year": 2015,
        "genre": "Action, Sci-Fi",
        "cover_image_url": "https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg"
    },
    {
        "id": 2,
        "title": "This Is How You Lose the Time War",
        "media_type": "book",
        "release_year": 2019,
        "genre": "Science Fiction, Romance",
        "cover_image_url": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1551029952i/43352954.jpg"
    },
    {
        "id": 3,
        "title": "Gladiator",
        "media_type": "movie",
        "release_year": 2000,
        "genre": "Action, Drama",
        "cover_image_url": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"
    },
    {
        "id": 4,
        "title": "Ginny and Georgia",
        "media_type": "show",
        "release_year": 2021,
        "genre": "Drama, Comedy",
        "cover_image_url": "https://image.tmdb.org/t/p/w500/8KHddPKgcwEfOcCiMG4rHFCRmBf.jpg"
    }
]

//dummy "ratings" or "plots"
let ratings = [
    {
        "id": 1,
        "user_id": 1,
        "media_id": 1,
        "x_coordinate": -1,
        "y_coordinate": 0.8,
        "good_reason": "The plot was messy and overstuffed with too many characters. Ultron felt underdeveloped as a villain, and the pacing was all over the place.",
        "like_reason": "Despite its flaws, the action sequences were incredibly fun and the cast chemistry made every scene entertaining. It's the perfect mindless popcorn movie.",
        "context": "Watched during finals week when I desperately needed a brain break. The spectacle was exactly what I needed - didn't have to think too hard.",
        "watch_number": 1,
        "created_at": "2024-09-15T20:45:00Z"
    },
    {
        "id": 2,
        "user_id": 1,
        "media_id": 2,
        "x_coordinate": 0.7,
        "y_coordinate": 1,
        "good_reason": "The prose is absolutely stunning - poetic without being pretentious. The epistolary structure is innovative and the worldbuilding through letters is masterful.",
        "like_reason": "I fell completely in love with Red and Blue's relationship. The yearning, the wit, the tenderness - it destroyed me in the best way. I couldn't stop thinking about it for weeks.",
        "context": "Read during a quiet summer break when I had time to really savor the language. Perfect headspace for literary fiction that demands your full attention.",
        "watch_number": 1,
        "created_at": "2024-08-20T15:30:00Z"
    },
    {
        "id": 3,
        "user_id": 1,
        "media_id": 3,
        "x_coordinate": 0.9,
        "y_coordinate": -0.65,
        "good_reason": "Objectively brilliant filmmaking - incredible performances from Russell Crowe and Joaquin Phoenix, gorgeous cinematography, Hans Zimmer's score is iconic. Technically flawless.",
        "like_reason": "I respect the craft, but I just couldn't connect with it emotionally. The story felt predictable and the pacing dragged for me. I was bored more often than I was engaged.",
        "context": "Watched it because 'everyone says it's a masterpiece' but I think I just don't vibe with this type of historical epic. Not my genre.",
        "watch_number": 1,
        "created_at": "2024-07-10T21:15:00Z"
    },
    {
        "id": 4,
        "user_id": 1,
        "media_id": 4,
        "x_coordinate": -0.3,
        "y_coordinate": -0.9,
        "good_reason": "The writing is inconsistent and melodramatic. Character motivations don't make sense half the time and the plot twists feel forced rather than earned.",
        "like_reason": "I didn't enjoy watching it at all. The cringe dialogue and unrealistic scenarios made me actively annoyed. Couldn't even finish the second season.",
        "context": "Started watching because of all the TikTok hype but realized very quickly it wasn't for me. Probably just not the target demographic.",
        "watch_number": 1,
        "created_at": "2024-06-05T19:00:00Z"
    },
    {
        "id": 5,
        "user_id": 2,
        "media_id": 1,
        "x_coordinate": -0.6,
        "y_coordinate": 0.5,
        "good_reason": "Pretty standard MCU formula with some questionable creative choices, but nothing offensively bad.",
        "like_reason": "It's entertaining enough for what it is. Good background movie while doing other stuff.",
        "context": "Rewatched during a Marvel marathon. It's fine.",
        "watch_number": 2,
        "created_at": "2024-10-01T18:30:00Z"
    },
    {
        "id": 6,
        "user_id": 2,
        "media_id": 3,
        "x_coordinate": 0.95,
        "y_coordinate": 0.9,
        "good_reason": "One of the best films ever made. Period. The storytelling, performances, and technical achievement are all top-tier.",
        "like_reason": "Absolutely loved it. The 'Are you not entertained?!' scene gives me chills every time. This is peak cinema.",
        "context": "Watched on a rainy Sunday afternoon with my dad. Perfect movie experience.",
        "watch_number": 3,
        "created_at": "2024-09-22T16:45:00Z"
    }
]

//middleware for me to see what each request looks like
//when testing with Postman
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// helps to convert the request body into a JSON format
app.use(express.json())
app.use(requestLogger)



//API endpoint to get all users
app.get('/api/users', (request, response) => {
    response.json(users)
})

//API endpoint to get a specific user
app.get('/api/users/:id', (request, response) => {
    const id = Number(request.params.id)
    const user = users.find(user => user.id === Number(id))

    if (user) {
        return response.json(user)
    } else {
        response.status(404).end()
    }
})

//API endpoint to modify a specific user
app.put('/api/users/:id', (request, response) => {
    // save the id of the user
    // filter for the specific user
    // get the body of the request
    // if the user does not exist, return an error
    // else create a new user object and add it to the existing users
    const id = Number(request.params.id)
    const user = users.find(user => user.id === id)
    const body = request.body

    users = users.filter(user => user.id !== id)

    if (!user) {
        return response.status(404).json({
            error: "This user does not exist."
        })
    }

    const newUser = {
        ...user,
        "username": body.username,
        "email": body.email,
        "profile_picture": body.profile_picture,
    }

    users = users.concat(newUser)
    response.json(newUser)
})

//API endpoint to get a specific user's ratings
app.get('/api/users/:id/ratings', (request, response) => {
    const id = Number(request.params.id)
    const userRatings = ratings.filter(rating => rating.user_id === id)

    console.log(id)

    if (userRatings) {
        return response.json(userRatings)
    } else {
        return response.status(404).json({
            error: "This user does not exist."
        })
    }
})

//API endpoint to modify a rating by user
app.put('/api/users/:userId/ratings/:ratingId', (request, response) => {

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




//API endpoint for all media
//TODO: could add a way to filter for media types
app.get('/api/media', (request, response) => {
    response.json(media)
})

//API endpoint for a specific medium
app.get('/api/media/:id', (request, response) => {
    const id = Number(request.params.id)
    const medium = media.find(m => m.id === id)

    if (medium) {
        return response.json(medium)
    } else {
        response.status(404).end()
    }
})

//API endpoint to modify a piece of media
app.put('/api/media/:id', (request, response) => {
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



//API endpoint for the ratings of a specific media
//TODO: Make a way to average every single rating for a specific medium

app.get('/api/media/:id/ratings', (request, response) => {
    const id = Number(request.params.id)
    const mediaRatings = ratings.filter(rating => rating.media_id === id)
    console.log("Hello??")

    if (mediaRatings) {
        return response.json(mediaRatings)
    } else {
        return response.status(404).json({
            error: "This media does not exist."
        })
    }
})




const PORT = 3001
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}.`)
})