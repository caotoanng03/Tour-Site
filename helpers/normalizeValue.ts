
export const normalizeValue = (value) => {
    // Trim whitespace; if the result is an empty string, treat as null
    return value && value.trim() ? value.trim() : null;
}