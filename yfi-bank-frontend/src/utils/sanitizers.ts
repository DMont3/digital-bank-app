import DOMPurify from 'dompurify';

// Sanitiza strings para prevenir XSS
export const sanitizeString = (value: string): string => {
    if (!value) return '';
    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
};

// Sanitiza objetos recursivamente
export const sanitizeObject = <T extends object>(obj: T): T => {
    const sanitized = { ...obj };
    Object.keys(sanitized).forEach(key => {
        const value = sanitized[key as keyof T];
        if (typeof value === 'string') {
            sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
            sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T];
        }
    });
    return sanitized;
};

// Sanitiza HTML permitindo apenas tags específicas
export const sanitizeHTML = (html: string): string => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href']
    });
};
