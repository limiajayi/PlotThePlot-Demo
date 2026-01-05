const request = require('supertest')
const express = require('express')

// Mock data for testing
const mockUsers = [
    { id: 1, username: 'john_doe', email: 'john@example.com', profile_picture: 'john.jpg' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', profile_picture: 'jane.jpg' },
    { id: 3, username: 'bob_jones', email: 'bob@example.com', profile_picture: 'bob.jpg' }
]

// Mock the users data module BEFORE importing the router
//When writing this, you're telling Jest "Whenever the router tries to require('../data/users')",
//give it mockUsers instead of reading the real file"
jest.mock('../../data/users', () => mockUsers)

const usersRouter = require('../../routes/users')

// Setup Express app for testing
const app = express()
app.use(express.json())
app.use('/api/users', usersRouter)

// Tests GET requests for just getting /api/users
describe('Users Router', () => {
    
    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(200)
            
            expect(response.body).toEqual(mockUsers)
            expect(response.body.length).toBe(3)
        })

        it('should return an array', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(200)
            
            expect(Array.isArray(response.body)).toBe(true)
        })
    })

    describe('GET /api/users/:id', () => {
        it('should return a specific user by id', async () => {
            const response = await request(app)
                .get('/api/users/1')
                .expect(200)
            
            expect(response.body).toEqual(mockUsers[0])
            expect(response.body.id).toBe(1)
            expect(response.body.username).toBe('john_doe')
        })

        it('should return a different user by id', async () => {
            const response = await request(app)
                .get('/api/users/2')
                .expect(200)
            
            expect(response.body.id).toBe(2)
            expect(response.body.username).toBe('jane_smith')
        })

        it('should return 404 for non-existent user', async () => {
            await request(app)
                .get('/api/users/999')
                .expect(404)
        })

        it('should handle string id and convert to number', async () => {
            const response = await request(app)
                .get('/api/users/1')
                .expect(200)
            
            expect(response.body.id).toBe(1)
        })
    })

    describe('PUT /api/users/:id', () => {
        it('should update a user successfully', async () => {
            const updatedData = {
                username: 'john_updated',
                email: 'john_new@example.com',
                profile_picture: 'john_new.jpg'
            }

            const response = await request(app)
                .put('/api/users/1')
                .send(updatedData)
                .expect(200)
            
            expect(response.body.username).toBe('john_updated')
            expect(response.body.email).toBe('john_new@example.com')
            expect(response.body.profile_picture).toBe('john_new.jpg')
            expect(response.body.id).toBe(1) // id should remain unchanged
        })

        it('should preserve existing data when fields are not provided', async () => {
            const updatedData = {
                username: 'jane_updated',
                email: 'jane@example.com',
                profile_picture: 'jane.jpg'
            }

            const response = await request(app)
                .put('/api/users/2')
                .send(updatedData)
                .expect(200)
            
            expect(response.body.id).toBe(2)
        })

        it('should return 404 when updating non-existent user', async () => {
            const updatedData = {
                username: 'ghost',
                email: 'ghost@example.com',
                profile_picture: 'ghost.jpg'
            }

            const response = await request(app)
                .put('/api/users/999')
                .send(updatedData)
                .expect(404)
            
            expect(response.body.error).toBe('This user does not exist.')
        })

        it('should accept partial updates', async () => {
            const updatedData = {
                username: 'bob_changed',
                email: 'bob_new@example.com',
                profile_picture: 'bob_new.jpg'
            }

            const response = await request(app)
                .put('/api/users/3')
                .send(updatedData)
                .expect(200)
            
            expect(response.body.username).toBe('bob_changed')
        })
    })

    describe('DELETE /api/users/:id', () => {
        it('should delete a user and return 204', async () => {
            await request(app)
                .delete('/api/users/1')
                .expect(204)
        })

        it('should delete with no response body', async () => {
            const response = await request(app)
                .delete('/api/users/2')
                .expect(204)
            
            expect(response.body).toEqual({})
        })

        it('should return 204 even for non-existent user', async () => {
            await request(app)
                .delete('/api/users/999')
                .expect(204)
        })
    })

    describe('Error Handling', () => {
        it('should handle invalid id format gracefully', async () => {
            const response = await request(app)
                .get('/api/users/invalid')
            
            expect(response.status).toBe(404)
        })

        it('should handle PUT with invalid id format', async () => {
            const response = await request(app)
                .put('/api/users/invalid')
                .send({
                    username: 'test',
                    email: 'test@example.com',
                    profile_picture: 'test.jpg'
                })
            
            expect(response.status).toBe(404)
        })
    })
})
