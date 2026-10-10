const requireSelf =
    (paramName = "userId") =>
    (request, response, next) => {
        if (!request.userId || request.userId !== request.params[paramName]) {
            return response.status(403).json({ error: "Forbidden" });
        }

        next();
    };

module.exports = { requireSelf };
