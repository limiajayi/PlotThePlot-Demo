
export const isValidPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(password);

export const isValidUsername = (username: string) => /^[a-zA-Z0-9_-]{7,20}$/.test(username);

export const isSusInput = (input: string) => {
    const metaChars = /(--|%|;|'|\/\*|\*\/|xp_)/i;

    const keyWords = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|TRUNCATE|EXEC|HAVING|WHERE)\b/i;
    
    return metaChars.test(input) || keyWords.test(input);
};