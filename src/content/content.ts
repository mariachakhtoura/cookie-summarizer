import { handleError, logWarning } from '../utils/logger';
import { ApiResponse, ErrorContext, ErrorMessage } from '../utils/error-constants';
import { MessageType, MessageResponse, ContentMessage, ResponseCallback, BackgroundMessage, PageInfo } from '../types/index';

class CookieAnalyzer {
    private isInitialized: boolean = false;
    private cookieCount: number = 0;

    private isValidPage(): boolean {
        return window.location.protocol === 'http:' || window.location.protocol === 'https:';
    }

    public async init(): Promise<void> {
        if (!this.isValidPage() || this.isInitialized) {
            return;
        }

        try {
            await this.updateCookieCount();
            this.setupCookieMonitoring();
            this.setupMessageListener();

            this.isInitialized = true;
        } catch (error) {
            handleError(ErrorContext.CONTENT_SCRIPT_INIT, error, 'Failed to initialize content script');
        }
    }

    private async updateCookieCount(): Promise<void> {
        if (!chrome?.runtime?.id) {
            logWarning('Content Script', 'Chrome runtime not available, skipping cookie count update');
            return;
        }

        try {
            const response = await this.sendMessageToBackground({
                type: MessageType.GET_COOKIES,
                url: window.location.href
            }) as MessageResponse;


            if (response && response.success && typeof response.count === 'number') {
                this.cookieCount = response.count;
                this.notifyPopup();
            } else {
                logWarning('Content Script', 'Invalid response from background', { response });
                this.cookieCount = document.cookie.split(';').filter(c => c.trim()).length;
                this.notifyPopup();
            }
        } catch (error) {
            handleError(ErrorContext.GET_COOKIES_OPERATION, error, 'Failed to update cookie count', { url: window.location.href });

            try {
                this.cookieCount = document.cookie.split(';').filter(c => c.trim()).length;
                this.notifyPopup();
            } catch (fallbackError) {
                handleError(ErrorContext.GET_COOKIES_OPERATION, fallbackError, 'Fallback cookie counting failed');
                this.cookieCount = 0;
            }
        }
    }

    private setupCookieMonitoring(): void {
        let lastCookieString = document.cookie;

        const checkCookies = (): void => {
            if (!chrome?.runtime?.id) {
                return;
            }

            const currentCookieString = document.cookie;
            if (currentCookieString !== lastCookieString) {
                lastCookieString = currentCookieString;
                this.updateCookieCount();
            }
        };

        const intervalId = setInterval(checkCookies, 2000);

        const cleanup = () => {
            if (!chrome?.runtime?.id) {
                clearInterval(intervalId);
            }
        };

        setInterval(cleanup, 10000);

        window.addEventListener('storage', () => {
            if (chrome?.runtime?.id) {
                setTimeout(() => this.updateCookieCount(), 100);
            }
        });

        window.addEventListener('focus', () => {
            if (chrome?.runtime?.id) {
                setTimeout(() => this.updateCookieCount(), 100);
            }
        });
    }

    private setupMessageListener(): void {
        chrome.runtime.onMessage.addListener((message: ContentMessage, sender: chrome.runtime.MessageSender, sendResponse: ResponseCallback) => {
            switch (message.type) {
                case MessageType.GET_PAGE_INFO: {
                    this.handleGetPageInfo(sendResponse);
                    return true;
                }

                case MessageType.ANALYZE_PAGE_COOKIES: {
                    this.handleAnalyzeCookies(sendResponse);
                    return true;
                }

                default: {
                    const errorResponse = handleError(
                        ErrorContext.UNKNOWN_MESSAGE_TYPE,
                        new Error(`Unknown message type: ${message.type}`),
                        ErrorMessage.UNKNOWN_MESSAGE_TYPE,
                        { messageType: message.type }
                    );
                    sendResponse(errorResponse);
                }
            }
        });
    }

    private async handleGetPageInfo(sendResponse: ResponseCallback): Promise<void> {
        try {
            const pageInfo: PageInfo = {
                url: window.location.href,
                title: document.title,
                domain: window.location.hostname,
                cookieCount: this.cookieCount
            };

            sendResponse({ success: true, data: pageInfo });
        } catch (error) {
            const errorResponse = handleError(
                ErrorContext.GET_COOKIES_OPERATION,
                error,
                'Failed to get page info',
                { url: window.location.href }
            );
            sendResponse(errorResponse);
        }
    }

    private async handleAnalyzeCookies(sendResponse: ResponseCallback): Promise<void> {
        try {
            const response = await this.sendMessageToBackground({
                type: MessageType.ANALYZE_COOKIES,
                cookies: await this.getAllCookies(),
                url: window.location.href
            });

            sendResponse(response);
        } catch (error) {
            const errorResponse = handleError(
                ErrorContext.ANALYZE_COOKIES_OPERATION,
                error,
                'Failed to analyze cookies',
                { url: window.location.href }
            );
            sendResponse(errorResponse);
        }
    }

    private async getAllCookies(): Promise<chrome.cookies.Cookie[]> {
        const response = await this.sendMessageToBackground({
            type: MessageType.GET_COOKIES,
            url: window.location.href
        }) as MessageResponse;

        return response.success && response.cookies ? response.cookies : [];
    }

    private notifyPopup(): void {
        if (!chrome?.runtime?.id) {
            logWarning('Content Script', 'Chrome runtime not available, cannot notify popup');
            return;
        }

        chrome.runtime.sendMessage({
            type: MessageType.COOKIE_COUNT_UPDATED,
            count: this.cookieCount,
            url: window.location.href
        }).catch((error) => {
        });
    }

    private sendMessageToBackground(message: BackgroundMessage): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response: ApiResponse) => {
                if (chrome.runtime.lastError) {
                    const error = new Error(`Runtime error: ${chrome.runtime.lastError.message ?? 'Unknown runtime error'}`);
                    handleError(ErrorContext.RUNTIME_ERROR, error, 'Runtime error sending message', { messageType: message.type });
                    reject(error);
                } else if (!response) {
                    const error = new Error('No response from background script');
                    handleError(ErrorContext.RUNTIME_ERROR, error, 'No response from background script', { messageType: message.type });
                    reject(error);
                } else if (response && !response.success) {
                    const error = new Error(`Background error: ${response.error ?? 'Unknown background script error'}`);
                    handleError(ErrorContext.RUNTIME_ERROR, error, 'Background script returned error', { messageType: message.type, response });
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

async function initializeCookieAnalyzer(): Promise<void> {
    const analyzer = new CookieAnalyzer();
    await analyzer.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeCookieAnalyzer();
    });
} else {
    initializeCookieAnalyzer();
}
