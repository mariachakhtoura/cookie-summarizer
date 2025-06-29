import { CookieService } from '../services/cookie-service';
import { AIService } from '../services/ai-service';
import { CacheService } from '../services/cache-service';
import { CookieAnalysisPopup } from './cookie-analysis-popup';
import { handleError } from '../utils/logger';
import { ErrorContext } from '../utils/error-constants';

class CookieAnalyzer {
    private currentTab: chrome.tabs.Tab | null = null;
    private cookies: chrome.cookies.Cookie[] = [];
    private isAnalyzing: boolean = false;
    private readonly popup: CookieAnalysisPopup;

    constructor() {
        this.popup = new CookieAnalysisPopup();
        this.bindEvents();
    }

    public async init(): Promise<void> {
        try {
            await this.loadCurrentTab();
            CacheService.cleanupExpiredEntries();
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to initialize popup');
            this.popup.setErrorState();
        }
    }

    private bindEvents(): void {
        this.popup.bindEvents(
            () => this.forceRefreshAnalysis()
        );
    }

    async forceRefreshAnalysis(): Promise<void> {
        if (!this.currentTab?.url) return;

        const domain = CacheService.getDomainFromUrl(this.currentTab.url);
        await CacheService.clearDomainCache(domain);

        await this.analyzeCookies();
    }

    private async loadCurrentTab(): Promise<void> {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;

            this.popup.updateTitle(tab.url ?? '');

            await this.loadCookies();
        } catch (error) {
            handleError(ErrorContext.TAB_ACTIVATION_HANDLER, error, 'Failed to load current tab');
            this.popup.setErrorState();
        }
    }

    private async loadCookies(): Promise<void> {
        if (!this.currentTab?.url) return;

        try {
            this.cookies = await CookieService.loadCookiesForTab(this.currentTab.url);

            this.popup.updateSubtitle(this.cookies.length, 'loading');

            if (this.cookies.length > 0) {
                await this.analyzeCookies();
            } else {
                this.popup.showResults();
                this.popup.displayNoCookiesMessage();
            }

        } catch (error) {
            handleError(ErrorContext.GET_COOKIES_OPERATION, error, 'Failed to load cookies', { url: this.currentTab.url });
            this.popup.updateSubtitle(0, 'error', 'Error loading cookies');
        }
    }

    private async analyzeCookies(): Promise<void> {
        if (this.isAnalyzing || this.cookies.length === 0) return;

        this.isAnalyzing = true;
        this.popup.showResults();

        try {
            const domain = CacheService.getDomainFromUrl(this.currentTab?.url ?? '');

            const cachedAnalysis = await CacheService.getCachedAnalysis(domain, this.cookies);

            let analysis: string;

            if (cachedAnalysis) {
                analysis = cachedAnalysis;
                this.popup.updateSubtitle(this.cookies.length, 'complete');
            } else {
                this.popup.showLoadingState();
                this.popup.updateSubtitle(this.cookies.length, 'analyzing');

                analysis = await AIService.generateCookieAnalysis(this.cookies);

                await CacheService.setCachedAnalysis(domain, this.cookies, analysis);
                this.popup.updateSubtitle(this.cookies.length, 'complete');
            }

            this.popup.displayAnalysis(analysis);

            this.popup.updateCookieDetails(this.cookies);

        } catch (error) {
            handleError(ErrorContext.ANALYZE_COOKIES_OPERATION, error, 'Failed to analyze cookies', {
                domain: CacheService.getDomainFromUrl(this.currentTab?.url ?? ''),
                cookieCount: this.cookies.length
            });

            let errorMessage = 'Something went wrong. ';
            if (error instanceof Error) {
                if (error.message.includes('not available on this device')) {
                    errorMessage = 'Chrome AI isn\'t available on this device. You need Chrome 127+ with 4GB+ VRAM and 22GB+ storage.';
                } else if (error.message.includes('downloaded') || error.message.includes('downloading')) {
                    errorMessage = 'Chrome AI is downloading. Please wait and try again.';
                } else if (error.message.includes('empty response')) {
                    errorMessage = 'Chrome AI didn\'t respond. Please try again.';
                } else {
                    errorMessage += error.message;
                }
            } else {
                errorMessage += 'Please check your Chrome AI setup.';
            }

            this.popup.displayError(errorMessage);
        } finally {
            this.isAnalyzing = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const analyzer = new CookieAnalyzer();
        await analyzer.init();
    } catch (error) {
        handleError(ErrorContext.POPUP_INIT, error, 'Failed to start extension');
    }
});
