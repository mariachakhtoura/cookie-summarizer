import { handleError } from '../utils/logger';
import { ErrorContext } from '../utils/error-constants';
import { UI_TEXT } from '../utils/text-constants';
import { markdownToHtml } from '../utils/markdown-parser';

export class AnalysisRenderer {
    private readonly analysisContent: HTMLElement | null;

    constructor() {
        this.analysisContent = document.getElementById('analysisContent');
    }

    showLoadingState(): void {
        try {
            if (this.analysisContent) {
                this.analysisContent.innerHTML = '';

                const container = document.createElement('div');
                container.className = 'flex flex-col items-center justify-center p-2xl text-secondary';

                const spinner = document.createElement('div');
                spinner.className = 'spinner';

                const text = document.createElement('p');
                text.className = 'font-semibold text-secondary m-0';
                text.textContent = UI_TEXT.LOADING.ANALYZING_COOKIES;

                container.appendChild(spinner);
                container.appendChild(text);
                this.analysisContent.appendChild(container);
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to show loading state');
        }
    }

    displayAnalysis(analysis: string): void {
        if (this.analysisContent) {
            this.analysisContent.innerHTML = '';

            const container = document.createElement('div');
            container.className = 'text-lg leading-relaxed text-primary font-medium analysis-text';
            container.innerHTML = markdownToHtml(analysis);

            this.analysisContent.appendChild(container);
        }
    }

    displayError(message: string): void {
        if (this.analysisContent) {
            this.analysisContent.innerHTML = '';

            const container = document.createElement('div');
            container.className = 'p-xl text-center';

            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-error font-semibold bg-error p-md rounded border border-light m-0';
            errorMessage.textContent = message;

            container.appendChild(errorMessage);
            this.analysisContent.appendChild(container);
        }
    }

    displayNoCookiesMessage(): void {
        try {
            if (this.analysisContent) {
                this.analysisContent.innerHTML = '';

                const container = document.createElement('div');
                container.className = 'p-xl text-center';

                const title = document.createElement('p');
                title.className = 'text-secondary font-medium mb-md';
                title.textContent = UI_TEXT.MESSAGES.NO_COOKIES_TITLE;

                const description = document.createElement('p');
                description.className = 'mb-0 text-muted text-sm';
                description.textContent = UI_TEXT.MESSAGES.NO_COOKIES_DESCRIPTION;

                container.appendChild(title);
                container.appendChild(description);
                this.analysisContent.appendChild(container);
            }
        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to display no cookies message');
        }
    }
}
