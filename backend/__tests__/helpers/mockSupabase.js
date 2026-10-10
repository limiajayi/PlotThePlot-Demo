const RELATIONS = {
    users: { ratings: { table: "ratings", foreignKey: "user_id", many: true } },
    ratings: { media: { table: "media", foreignKey: "media_id", many: false } },
    media: {
        ratings: { table: "ratings", foreignKey: "media_id", many: true },
    },
};

const TOKEN_PREFIX = "test-token-";

const tables = { users: [], ratings: [], media: [] };
const calls = [];
const failures = new Set();

const clones = (value) => JSON.parse(JSON.stringify(value));
const same = (a, b) => String(a) === String(b);

const splitTopLevel = (text) => {
    const parts = [];
    let depth = 0,
        current = "";

    for (const char of text) {
        if (char === "(") depth++;
        if (char === ")") depth--;
        if (char === "," && depth === 0) {
            parts.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
};

const findRelated = (tableName, row, relationName) => {
    const relation = RELATIONS[tableName]?.[relationName];
    if (!relation) return { relation: null };
};
