import { ErrorContext, ErrorMessage, ErrorResponse, SuccessResponse } from './error-constants';

export function logError(context: string, error: unknown, additionalData?: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error(`${context}:`, {
        message: errorMessage,
        stack: errorStack,
        additionalData
    });
}

export function logInfo(context: string, message: string, additionalData?: any): void {
    console.info(`${context}:`, {
        message,
        additionalData
    });
}

export function logWarning(context: string, message: string, additionalData?: any): void {
    console.warn(`${context}:`, {
        message,
        additionalData
    });
}

export function createErrorResponse(error: unknown, userMessage: string): ErrorResponse {
    return {
        success: false,
        error: userMessage,
        details: error instanceof Error ? error.stack : String(error)
    };
}

export function createSuccessResponse<T>(data?: T, additionalFields?: Partial<SuccessResponse<T>>): SuccessResponse<T> {
    return {
        success: true,
        data,
        ...additionalFields
    };
}

export function handleError(
    context: ErrorContext,
    error: unknown,
    userMessage: string,
    additionalData?: any
): ErrorResponse {
    logError(context, error, additionalData);
    return createErrorResponse(error, userMessage);
}
