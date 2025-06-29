import { handleError, createSuccessResponse } from '../utils/logger';
import { ErrorContext, ErrorMessage } from '../utils/error-constants';
import { MessageType, GetCookiesMessage, AnalyzeCookiesMessage, GetPageInfoMessage, AnalyzePageCookiesMessage, CookieCountUpdatedMessage, ExtensionMessage, StorageData, InstallationDetails, ResponseCallback } from '../types/index';

chrome.runtime.onInstalled.addListener(async (details: InstallationDetails): Promise<void> => {
    try {
        if (details.reason === 'install') {
            const storageData: StorageData = {
                installDate: Date.now(),
                storiesGenerated: 0
            };
            await chrome.storage.local.set(storageData);
        }
    } catch (error) {
        handleError(ErrorContext.EXTENSION_INSTALLATION, error, 'Failed to initialize extension', { reason: details.reason });
    }
});

chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender: chrome.runtime.MessageSender, sendResponse: ResponseCallback) => {
    try {
        switch (message.type) {
            case MessageType.GET_COOKIES: {
                handleGetCookies(message, sendResponse);
                return true;
            }

            case MessageType.ANALYZE_COOKIES: {
                handleAnalyzeCookies(message, sendResponse);
                return true;
            }

            default: {
                const messageType = message?.type || 'undefined';
                const errorResponse = handleError(
                    ErrorContext.UNKNOWN_MESSAGE_TYPE,
                    new Error(`Unknown message type: ${messageType}`),
                    ErrorMessage.UNKNOWN_MESSAGE_TYPE,
                    {
                        messageType,
                        receivedMessage: JSON.stringify(message, null, 2)
                    }
                );
                sendResponse(errorResponse);
                return false;
            }
        }
    } catch (error) {
        const errorResponse = handleError(
            ErrorContext.MESSAGE_HANDLER,
            error,
            ErrorMessage.MESSAGE_HANDLER_ERROR,
            { messageType: message.type }
        );
        sendResponse(errorResponse);
        return false;
    }
});

async function handleGetCookies(message: GetCookiesMessage, sendResponse: ResponseCallback): Promise<void> {
    try {
        if (!message.url) {
            throw new Error(ErrorMessage.NO_URL_PROVIDED);
        }

        const cookies: chrome.cookies.Cookie[] = await chrome.cookies.getAll({ url: message.url });
        const successResponse = createSuccessResponse(undefined, {
            count: cookies.length,
            cookies: cookies
        });
        sendResponse(successResponse);
    } catch (error) {
        const errorResponse = handleError(
            ErrorContext.GET_COOKIES_OPERATION,
            error,
            ErrorMessage.UNKNOWN_ERROR_GETTING_COOKIES,
            { url: message.url }
        );
        sendResponse(errorResponse);
    }
}

async function handleAnalyzeCookies(message: AnalyzeCookiesMessage, sendResponse: ResponseCallback): Promise<void> {
    try {
        if (!message.cookies) {
            throw new Error(ErrorMessage.NO_COOKIES_PROVIDED);
        }

        const successResponse = createSuccessResponse(undefined, {
            cookies: message.cookies
        });
        sendResponse(successResponse);
    } catch (error) {
        const errorResponse = handleError(
            ErrorContext.ANALYZE_COOKIES_OPERATION,
            error,
            ErrorMessage.UNKNOWN_ERROR_ANALYZING_COOKIES,
            { cookiesCount: message.cookies?.length }
        );
        sendResponse(errorResponse);
    }
}
