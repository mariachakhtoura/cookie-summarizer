import { CookieService } from '../services/cookie-service';
import { AIService } from '../services/ai-service';
import { CacheService } from '../services/cache-service';
import { UIManager } from './ui-manager';
import { handleError } from '../utils/logger';
import { ErrorContext } from '../utils/error-constants';

class CookieAnalyzer {
    private currentTab: chrome.tabs.Tab | null = null;
    private cookies: chrome.cookies.Cookie[] = [];
    private isAnalyzing: boolean = false;
    private uiManager: UIManager;

    constructor() {
        this.uiManager = new UIManager();
        this.bindEvents();
        this.loadCurrentTab();

        CacheService.cleanupExpiredEntries();
    }

    private bindEvents(): void {
        this.uiManager.bindEvents(
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

            this.uiManager.updateTitle(tab.url || '');

            await this.loadCookies();
        } catch (error) {
            handleError(ErrorContext.TAB_ACTIVATION_HANDLER, error, 'Failed to load current tab');
            this.uiManager.setErrorState();
        }
    }

    private async loadCookies(): Promise<void> {
        if (!this.currentTab?.url) return;

        try {
            this.cookies = await CookieService.loadCookiesForTab(this.currentTab.url);

            this.uiManager.updateSubtitle(this.cookies.length, 'loading');

            if (this.cookies.length > 0) {
                await this.analyzeCookies();
            } else {
                this.uiManager.showResults();
                this.uiManager.displayNoCookiesMessage();
            }

        } catch (error) {
            handleError(ErrorContext.GET_COOKIES_OPERATION, error, 'Failed to load cookies', { url: this.currentTab.url });
            this.uiManager.updateSubtitle(0, 'error', 'Error loading cookies');
        }
    }

    private async analyzeCookies(): Promise<void> {
        if (this.isAnalyzing || this.cookies.length === 0) return;

        this.isAnalyzing = true;
        this.uiManager.showResults();

        try {
            const domain = CacheService.getDomainFromUrl(this.currentTab?.url || '');

            const cachedAnalysis = await CacheService.getCachedAnalysis(domain, this.cookies);

            let analysis: string;

            if (cachedAnalysis) {
                analysis = cachedAnalysis;
                console.log('🎯 Using cached analysis for', domain);
                this.uiManager.updateSubtitle(this.cookies.length, 'complete');
            } else {
                this.uiManager.showLoadingState();
                this.uiManager.updateSubtitle(this.cookies.length, 'analyzing');

                console.log('🤖 Generating new analysis for', domain);
                analysis = await AIService.generateCookieAnalysis(this.cookies);

                await CacheService.setCachedAnalysis(domain, this.cookies, analysis);
                this.uiManager.updateSubtitle(this.cookies.length, 'complete');
            }

            this.uiManager.displayAnalysis(analysis);

            this.uiManager.updateCookieDetails(this.cookies);

        } catch (error) {
            handleError(ErrorContext.ANALYZE_COOKIES_OPERATION, error, 'Failed to analyze cookies', {
                domain: CacheService.getDomainFromUrl(this.currentTab?.url || ''),
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

            this.uiManager.displayError(errorMessage);
        } finally {
            this.isAnalyzing = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new CookieAnalyzer();
    } catch (error) {
        handleError(ErrorContext.POPUP_INIT, error, 'Failed to start extension');
    }
});
