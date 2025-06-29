import { Elements } from '../types/index';
import { formatUrl } from '../utils/url-formatter';
import { handleError } from '../utils/logger';
import { ErrorContext } from '../utils/error-constants';
import { UI_TEXT } from '../utils/text-constants';

export class PopupDisplay {
    private readonly elements: Elements;

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
                    this.elements.dynamicSubtitle.textContent = errorMsg ?? UI_TEXT.SUBTITLES.ERROR_LOADING_COOKIES;
                    break;
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to update subtitle', { cookieCount, state });
        }
    }

    showResults(): void {
        if (this.elements.analysisHeader) {
            this.elements.analysisHeader.classList.remove('hidden');
            this.elements.analysisHeader.classList.add('block');
        }
        if (this.elements.analysisContent) {
            this.elements.analysisContent.classList.remove('hidden');
            this.elements.analysisContent.classList.add('block');
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
