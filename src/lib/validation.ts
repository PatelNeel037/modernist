/**
 * EMAIL VALIDATION UTILITY
 */

// Regex for standard email format
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// List of common disposable/fake email domains
const DISPOSABLE_DOMAINS = [
    'mailinator.com',
    'yopmail.com',
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'trashmail.com',
    'getairmail.com',
    'dispostable.com'
];

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
    if (!email) {
        return { isValid: false, message: 'Email is required.' };
    }

    if (!EMAIL_REGEX.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address (e.g., name@example.com).' };
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (DISPOSABLE_DOMAINS.includes(domain)) {
        return { isValid: false, message: 'Disposable email addresses are not allowed. Please use a real email.' };
    }

    // Check for "keyboard mashing" or obviously fake patterns (very basic)
    const localPart = email.split('@')[0];
    if (localPart.length < 2) {
        return { isValid: false, message: 'Email address is too short.' };
    }

    return { isValid: true };
};
