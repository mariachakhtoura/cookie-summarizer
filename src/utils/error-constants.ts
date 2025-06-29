export enum ErrorContext {
    EXTENSION_INSTALLATION = 'Extension installation failed',
    MESSAGE_HANDLER = 'Message handler failed',
    GET_COOKIES_OPERATION = 'Get cookies operation failed',
    ANALYZE_COOKIES_OPERATION = 'Analyze cookies operation failed',
    UNKNOWN_MESSAGE_TYPE = 'Unknown message type received',
    TAB_ACTIVATION_HANDLER = 'Tab activation handler failed',
    BADGE_UPDATE = 'Badge update failed',
    STORAGE_OPERATION = 'Storage operation failed',
    CHROME_API_ERROR = 'Chrome API error',
    VALIDATION_ERROR = 'Validation error',
    CONTENT_SCRIPT_INIT = 'Content script initialization failed',
    RUNTIME_ERROR = 'Chrome runtime error',
    POPUP_INIT = 'Popup initialization failed',
    CACHE_READ = 'Cache read operation failed',
    CACHE_WRITE = 'Cache write operation failed',
    CACHE_CLEAR = 'Cache clear operation failed',
    CACHE_STATS = 'Cache stats operation failed',
    CACHE_CLEANUP = 'Cache cleanup operation failed'
}

export enum ErrorMessage {
    NO_URL_PROVIDED = 'No URL provided in message',
    NO_COOKIES_PROVIDED = 'No cookies provided in message',
    UNKNOWN_MESSAGE_TYPE = 'Unknown message type',
    MESSAGE_HANDLER_ERROR = 'Message handler error',
    UNKNOWN_ERROR_GETTING_COOKIES = 'Unknown error getting cookies',
    UNKNOWN_ERROR_ANALYZING_COOKIES = 'Unknown error analyzing cookies'
}

export interface ErrorResponse {
    success: false;
    error: string;
    details?: string;
}

export interface SuccessResponse<T = any> {
    success: true;
    data?: T;
    count?: number;
    cookies?: any[];
}

export type ApiResponse<T = any> = ErrorResponse | SuccessResponse<T>;
