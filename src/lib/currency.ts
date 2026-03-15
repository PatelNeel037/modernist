/**
 * Currency Utility
 * Handles conversion and formatting for the store.
 */

/**
 * Formats a number as INR currency (e.g., ₹8,000)
 */
export const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats a price value directly as INR.
 */
export const formatPrice = (amount: number | string) => {
    const val = typeof amount === 'string' ? parseFloat(amount) : amount;
    return formatINR(val);
};

/**
 * Returns the amount directly (used historically for conversion)
 */
export const convertToINR = (amount: number | string) => {
    const val = typeof amount === 'string' ? parseFloat(amount) : amount;
    return val;
};
