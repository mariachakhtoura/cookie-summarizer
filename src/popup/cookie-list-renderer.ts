import { handleError } from '../utils/logger';
import { ErrorContext } from '../utils/error-constants';
import { UI_TEXT } from '../utils/text-constants';

export class CookieListRenderer {
    private readonly cookieList: HTMLElement | null;

    constructor() {
        this.cookieList = document.getElementById('cookieList');
    }

    private createCookieDetailItem(label: string, value: string): HTMLElement {
        const item = document.createElement('div');
        item.className = 'flex justify-between p-sm bg-secondary rounded-sm border';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'font-semibold text-primary';
        labelSpan.textContent = label;

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;

        item.appendChild(labelSpan);
        item.appendChild(valueSpan);

        return item;
    }

    private createCookieCard(cookie: chrome.cookies.Cookie): HTMLElement {
        const secureIcon = cookie.secure ? UI_TEXT.COOKIE_SECURITY.SECURE : UI_TEXT.COOKIE_SECURITY.NOT_SECURE;
        const isHttpOnly = cookie.httpOnly ? UI_TEXT.COOKIE_SECURITY.HTTP_ONLY : UI_TEXT.COOKIE_SECURITY.JAVASCRIPT_ACCESSIBLE;

        const container = document.createElement('div');
        container.className = 'bg-primary border rounded p-lg mb-sm shadow-sm';

        const header = document.createElement('div');
        header.className = 'font-bold text-accent mb-sm text-lg';
        header.textContent = `${cookie.name} (${secureIcon})`;

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-sm text-sm text-secondary';

        grid.appendChild(this.createCookieDetailItem(UI_TEXT.COOKIE_DETAILS.DOMAIN, cookie.domain));
        grid.appendChild(this.createCookieDetailItem(UI_TEXT.COOKIE_DETAILS.SECURITY, isHttpOnly));
        grid.appendChild(this.createCookieDetailItem(UI_TEXT.COOKIE_DETAILS.PATH, cookie.path));
        grid.appendChild(this.createCookieDetailItem(UI_TEXT.COOKIE_DETAILS.SAME_SITE, cookie.sameSite ?? UI_TEXT.COOKIE_SECURITY.SAME_SITE_NONE));

        container.appendChild(header);
        container.appendChild(grid);

        return container;
    }

    renderCookies(cookies: chrome.cookies.Cookie[]): void {
        try {
            if (!this.cookieList) return;

            this.cookieList.innerHTML = '';

            if (cookies.length === 0) {
                const noCookiesMessage = document.createElement('p');
                noCookiesMessage.className = 'text-center text-muted';
                noCookiesMessage.textContent = UI_TEXT.MESSAGES.NO_COOKIES_TO_SHOW;
                this.cookieList.appendChild(noCookiesMessage);
                return;
            }

            const cookieListElement = this.cookieList;
            cookies.forEach(cookie => {
                const cookieCard = this.createCookieCard(cookie);
                cookieListElement.appendChild(cookieCard);
            });

        } catch (error) {
            handleError(ErrorContext.POPUP_INIT, error, 'Failed to render cookies', { cookiesCount: cookies.length });
        }
    }
}
