export const hasDecimalPart = (number) => {
    return number !== Math.floor(number);
}

export const formatNumber = (number) => {
    const decimalPart = number % 1;

    if (decimalPart === 0) {
        return Math.floor(number);
    } else if (decimalPart * 10 < 1) {
        // If there's only one non-zero decimal digit, round down
        return Math.floor(number);
    } else {
        // If there are more than one decimal places, round to two decimals
        return Number(number.toFixed(2));
    }
}