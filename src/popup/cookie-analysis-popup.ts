import { PopupDisplay } from './popup-display';
import { AnalysisRenderer } from './analysis-renderer';
import { CookieListRenderer } from './cookie-list-renderer';

/**
 * Orchestrates the cookie analysis popup interface
 * Coordinates between display, analysis rendering, and cookie list components
 */
export class CookieAnalysisPopup {
    private readonly display: PopupDisplay;
    private readonly analysisRenderer: AnalysisRenderer;
    private readonly cookieRenderer: CookieListRenderer;

    constructor() {
        this.display = new PopupDisplay();
        this.analysisRenderer = new AnalysisRenderer();
        this.cookieRenderer = new CookieListRenderer();
    }

    bindEvents(onRefreshAnalysis?: () => void): void {
        this.display.bindEvents(onRefreshAnalysis);
    }

    updateTitle(url: string): void {
        this.display.updateTitle(url);
    }

    updateSubtitle(cookieCount: number, state: 'loading' | 'analyzing' | 'complete' | 'error', errorMsg?: string): void {
        this.display.updateSubtitle(cookieCount, state, errorMsg);
    }

    showResults(): void {
        this.display.showResults();
    }

    showLoadingState(): void {
        this.analysisRenderer.showLoadingState();
    }

    displayAnalysis(analysis: string): void {
        this.analysisRenderer.displayAnalysis(analysis);
    }

    displayError(message: string): void {
        this.analysisRenderer.displayError(message);
    }

    displayNoCookiesMessage(): void {
        this.analysisRenderer.displayNoCookiesMessage();
    }

    updateCookieDetails(cookies: chrome.cookies.Cookie[]): void {
        this.cookieRenderer.renderCookies(cookies);
    }

    setErrorState(): void {
        this.display.setErrorState();
    }
}
