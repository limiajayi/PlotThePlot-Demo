const { supabase } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

//USERS

//API endpoint to get all users
router.get('/', async (request, response) => {

    const { data, error } = await supabase
    .from('users')
    .select('*, ratings (*, media (*))')
    .range(0, 5)

    if (error) {
        console.log("Error:", error)
        return response.status(500).json({
            error: "No users yet."
        })
    }
    
    response.json(data)
})

//API endpoint to get a specific user
router.get('/:id', async (request, response) => {
    const id = request.params.id
    const { data, error } = await supabase
    .from('users')
    .select('*, ratings (*, media (*))')
    .eq('id', id)
    .single();

    if (error) {
        console.log("Error fetching user by id: ", error)
        return response.status(404).json({
            error: "Cannot find this user."
        })
    }

    response.json(data)
})


//API endpoint to delete a user
router.delete('/:id', requireAuth, async (request, response) => {
    
    if (request.userId !== request.params.id) {
        console.log('Not allowed to take this action.');
        return response.status(403).json({ error: 'Forbidden' });
    }

    const id = request.params.id;

    const { error } = await supabase
    .auth
    .admin
    .deleteUser(id);

    if (error) {
        console.log('Error deleting user: ', error);
        return response.status(500).json({
            error: 'Failed to delete account'
        })
    }

    response.status(204).end()
})

module.exports = router