const express = require('express')
const router = express.Router()
let users = require('../data/users')
let ratings = require('../data/ratings')
let media = require('../data/media')

//USERS

//TODO: Change PUT requests to include a ratings array
//TODO: Change POST requests to include a ratings array

//API endpoint to get all users
router.get('/', (request, response) => {
    response.json(users)
})

//API endpoint to get a specific user
router.get('/:id', (request, response) => {
    const id = Number(request.params.id)
    const user = users.find(user => user.id === id)

    const userRatings = ratings.filter(r => r.user_id === id).map(rating => {
        const mediaItem = media.find(m => m.id === rating.media_id)
        return {
            ...rating,
            media: mediaItem
        }
    })

    if (user) {
        return response.json({
            ...user,
            ratings: userRatings,
            rating_count: userRatings.length
        })
    } else {
        response.status(404).end()
    }
})

//API endpoint to modify a specific user
router.put('/:id', (request, response) => {
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

//API endpoint to delete a user
router.delete('/:id', (request, response) => {
    const id = Number(request.params.id)
    users = users.filter(user => user.id !== id)

    response.status(204).end()
})

module.exports = router