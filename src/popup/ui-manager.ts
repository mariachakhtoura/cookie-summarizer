import { Elements } from '../types/ui';
import { formatUrl } from '../utils/url-formatter';
import { markdownToHtml } from '../utils/markdown-parser';
import { handleError } from '../utils/logger';
import { ErrorContext } from '../utils/error-constants';
import { UI_TEXT } from '../utils/text-constants';

export class UIManager {
    private elements: Elements;

    constructor() {
        this.elements = this.initializeElements();
    }

    private initializeElements(): Elements {
        return {
            dynamicTitle: document.getElementById('dynamicTitle'),
            dynamicSubtitle: document.getElementById('dynamicSubtitle'),
            analysisHeader: document.getElementById('analysisHeader'),
            analysisContent: document.getElementById('analysisContent'),
            cookieDetails: document.getElementById('cookieDetails'),
            cookieList: document.getElementById('cookieList'),
        };
    }

    bindEvents(onRefreshAnalysis?: () => void): void {
        try {
            document.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                if (target.id === 'refreshAnalysis' && onRefreshAnalysis) {
                    onRefreshAnalysis();
                }
            });
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to bind UI events');
        }
    }

    updateTitle(url: string): void {
        try {
            if (this.elements.dynamicTitle) {
                const formattedUrl = formatUrl(url);
                this.elements.dynamicTitle.innerHTML = `${UI_TEXT.TITLES.SUMMARIZING_COOKIES}<br>🌐 ${formattedUrl}`;
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to update title', { url });
        }
    }

    updateSubtitle(cookieCount: number, state: 'loading' | 'analyzing' | 'complete' | 'error', errorMsg?: string): void {
        try {
            if (!this.elements.dynamicSubtitle) return;

            switch (state) {
                case 'loading':
                    if (cookieCount === 0) {
                        this.elements.dynamicSubtitle.textContent = UI_TEXT.SUBTITLES.NO_COOKIES_FOUND;
                    } else if (cookieCount === 1) {
                        this.elements.dynamicSubtitle.textContent = UI_TEXT.SUBTITLES.UNDERSTAND_ONE_COOKIE;
                    } else {
                        this.elements.dynamicSubtitle.textContent = UI_TEXT.SUBTITLES.UNDERSTAND_MULTIPLE_COOKIES(cookieCount);
                    }
                    break;
                case 'analyzing':
                    this.elements.dynamicSubtitle.textContent = UI_TEXT.SUBTITLES.ANALYZING_COOKIES;
                    break;
                case 'complete':
                    if (cookieCount === 1) {
                        this.elements.dynamicSubtitle.textContent = UI_TEXT.SUBTITLES.ONE_COOKIE_ANALYZED;
                    } else {
                        this.elements.dynamicSubtitle.textContent = UI_TEXT.SUBTITLES.MULTIPLE_COOKIES_ANALYZED(cookieCount);
                    }
                    break;
                case 'error':
                    this.elements.dynamicSubtitle.textContent = errorMsg || UI_TEXT.SUBTITLES.ERROR_LOADING_COOKIES;
                    break;
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to update subtitle', { cookieCount, state });
        }
    }

    showResults(): void {
        if (this.elements.analysisHeader) {
            this.elements.analysisHeader.style.display = 'block';
        }
        if (this.elements.analysisContent) {
            this.elements.analysisContent.style.display = 'block';
        }
    }

    showLoadingState(): void {
        try {
            if (this.elements.analysisContent) {
                this.elements.analysisContent.innerHTML = `
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>${UI_TEXT.LOADING.ANALYZING_COOKIES}</p>
                    </div>
                `;
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to show loading state');
        }
    }

    displayAnalysis(analysis: string): void {
        if (this.elements.analysisContent) {
            this.elements.analysisContent.innerHTML = `
                <div class="analysis-text">${markdownToHtml(analysis)}</div>
            `;
        }
    }

    displayError(message: string): void {
        if (this.elements.analysisContent) {
            this.elements.analysisContent.innerHTML = `
                <div class="error-state">
                    <p style="color: #dc3545; text-align: center;">${message}</p>
                </div>
            `;
        }
    }

    displayNoCookiesMessage(): void {
        try {
            if (this.elements.analysisContent) {
                this.elements.analysisContent.innerHTML = `
                    <div class="no-cookies-state">
                        <p>${UI_TEXT.MESSAGES.NO_COOKIES_TITLE}</p>
                        <p>${UI_TEXT.MESSAGES.NO_COOKIES_DESCRIPTION}</p>
                    </div>
                `;
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to display no cookies message');
        }
    }

    updateCookieDetails(cookies: chrome.cookies.Cookie[]): void {
        try {
            const cookieItems = cookies.map(cookie => {
                const secureIcon = cookie.secure ? UI_TEXT.COOKIE_SECURITY.SECURE : UI_TEXT.COOKIE_SECURITY.NOT_SECURE;
                const isHttpOnly = cookie.httpOnly ? UI_TEXT.COOKIE_SECURITY.HTTP_ONLY : UI_TEXT.COOKIE_SECURITY.JAVASCRIPT_ACCESSIBLE;

                return `
                    <div class="cookie-item">
                        <div class="cookie-name">${cookie.name} (${secureIcon})</div>
                        <div class="cookie-details-grid">
                            <div class="cookie-detail">
                                <span>${UI_TEXT.COOKIE_DETAILS.DOMAIN}</span>
                                <span>${cookie.domain}</span>
                            </div>
                            <div class="cookie-detail">
                                <span>${UI_TEXT.COOKIE_DETAILS.SECURITY}</span>
                                <span>${isHttpOnly}</span>
                            </div>
                            <div class="cookie-detail">
                                <span>${UI_TEXT.COOKIE_DETAILS.PATH}</span>
                                <span>${cookie.path}</span>
                            </div>
                            <div class="cookie-detail">
                                <span>${UI_TEXT.COOKIE_DETAILS.SAME_SITE}</span>
                                <span>${cookie.sameSite || UI_TEXT.COOKIE_SECURITY.SAME_SITE_NONE}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            if (this.elements.cookieList) {
                this.elements.cookieList.innerHTML = cookieItems || `<p>${UI_TEXT.MESSAGES.NO_COOKIES_TO_SHOW}</p>`;
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to update cookie details', { cookiesCount: cookies.length });
        }
    }

    setErrorState(): void {
        try {
            if (this.elements.dynamicTitle) {
                this.elements.dynamicTitle.textContent = UI_TEXT.TITLES.ERROR_ANALYSIS;
            }
            if (this.elements.dynamicSubtitle) {
                this.elements.dynamicSubtitle.textContent = UI_TEXT.SUBTITLES.ERROR_LOADING_TAB;
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to set error state');
        }
    }
}
