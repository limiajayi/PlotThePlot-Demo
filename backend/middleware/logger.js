const crypto = require("node:crypto");

const requestLogger = (request, response, next) => {
    const start = process.hrtime.bigint();
    const id = crypto.randomUUID();

    const path = request.originalUrl.split("?")[0];

    request.id = id;
    response.setHeader("X-Request-Id", id);

    response.on("finish", () => {
        const entry = {
            time: new Date().toISOString(),
            id,
            method: request.method,
            path,
            status: response.statusCode,
            ms: Math.round(Number(process.hrtime.bigint() - start) / 1e6),
            userId: request.userId ?? null,
        };

        const log =
            entry.status >= 500
                ? console.error
                : entry.status >= 400
                  ? console.warn
                  : console.log;

        log(JSON.stringify(entry, null, 2));
    });

    next();
};

module.exports = { requestLogger };
