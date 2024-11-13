export const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const convertToSlug = (str) => {
    return removeDiacritics(str)
        .toLowerCase()
        .replace(/\s+/g, '-')   // Replace spaces with dashes
        .replace(/[^\w-]+/g, '') // Remove all non-word characters except dashes
        .replace(/--+/g, '-')    // Replace multiple dashes with a single dash
        .replace(/^-+|-+$/g, ''); // Trim dashes from the start and end
}

