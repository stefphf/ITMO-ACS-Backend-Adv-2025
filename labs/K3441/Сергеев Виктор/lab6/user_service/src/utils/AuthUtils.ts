import bcrypt = require("bcrypt");

export const hashPassword = (
    password: string
): string => {
    const hash = bcrypt.hashSync(password, 12)
    return hash
}

export const checkPassword = (
    password: string,
    passwordHash: string
): boolean => {
    return bcrypt.compareSync(password, passwordHash);
}
