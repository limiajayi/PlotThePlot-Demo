const { supabase } = require("../lib/supabase");

const requireAuth = async (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return response.status(401).json({ error: "Missing auth token" });
    }

    const token = authHeader.split(" ")[1];

    //supabase verifies the token and returns the user it belongs to
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return response.status(403).json({ error: "Invalid or expired token" });
    }

    request.userId = data.user.id;
    next();
};

module.exports = { requireAuth };
