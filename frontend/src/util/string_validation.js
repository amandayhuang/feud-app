// validating form input

export const removeNonAlpha = (string) => {
    return string.replace(/[^A-Za-z]/ig, '');
}