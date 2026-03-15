/**
 * Currency Utility
 * Handles conversion and formatting for the store.
 */

// Exchange rate: 1 USD = 80 INR (Approximate for conversion)
export const EXCHANGE_RATE = 80;

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
 * Formats a price value. 
 * If the input is in USD (e.g. from DB), it converts to INR.
 */
export const formatPrice = (usdAmount: number | string) => {
    const amount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    return formatINR(amount * EXCHANGE_RATE);
};

/**
 * Converts USD amount to INR value (number)
 */
export const convertToINR = (usdAmount: number | string) => {
    const amount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    return Math.round(amount * EXCHANGE_RATE);
};
