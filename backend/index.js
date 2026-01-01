const express = require('express')
const app = express()
const usersRouter = require('./routes/users')
const mediaRouter = require('./routes/media')
const ratingsRouter = require('./routes/ratings')

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

// Route handlers
app.use('/api/users', usersRouter)
app.use('/api/media', mediaRouter)
app.use('/api/', ratingsRouter)




const PORT = 3001
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}.`)
})