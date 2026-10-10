const { supabase } = require("../lib/supabase");
const { requireAuth } = require("../middleware/auth");
const express = require("express");
const { requireSelf } = require("../middleware/requireSelf");
const {
    USER_PUBLIC_COLUMNS,
    RATING_COLUMNS,
    MEDIA_COLUMNS,
} = require("../lib/columns");
const router = express.Router();

//USERS

const PUBLIC_USER_SELECT = `${USER_PUBLIC_COLUMNS}, ratings(${RATING_COLUMNS}, media (${MEDIA_COLUMNS}))`;

//API endpoint to get all users
router.get("/", async (request, response) => {
    const { data, error } = await supabase
        .from("users")
        .select(`${PUBLIC_USER_SELECT}`)
        .range(0, 5);

    if (error) {
        console.log("Error:", error);
        return response.status(500).json({
            error: "No users yet.",
        });
    }

    response.json(data);
});

//API endpoint to get a specific user
router.get("/:id", async (request, response) => {
    const id = request.params.id;
    const { data, error } = await supabase
        .from("users")
        .select(`${PUBLIC_USER_SELECT}`)
        .eq("id", id)
        .single();

    if (error) {
        console.log("Error fetching user by id: ", error);
        return response.status(404).json({
            error: "Cannot find this user.",
        });
    }

    response.json(data);
});

router.delete(
    "/:id",
    requireAuth,
    requireSelf("id"),
    async (request, response) => {
        const id = request.params.id;

        const { error } = await supabase.auth.admin.deleteUser(id);

        if (error) {
            console.log("Error deleting user: ", error);
            return response.status(500).json({
                error: "Failed to delete account",
            });
        }

        response.status(204).end();
    },
);

module.exports = router;
