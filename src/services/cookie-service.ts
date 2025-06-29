import { ErrorContext } from '../utils/error-constants';
import { logError } from '../utils/logger';

export class CookieService {
    static async loadCookiesForTab(tabUrl: string): Promise<chrome.cookies.Cookie[]> {
        try {
            const url = new URL(tabUrl);

            const cookies = await chrome.cookies.getAll({
                url: tabUrl
            });

            const domain = url.hostname.replace(/^www\./, '');
            const domainCookies = await chrome.cookies.getAll({
                domain: domain
            });

            const allCookies = [...cookies, ...domainCookies];
            return allCookies.filter((cookie, index, self) =>
                index === self.findIndex(c => c.name === cookie.name && c.domain === cookie.domain)
            );
        } catch (error) {
            logError(ErrorContext.GET_COOKIES_OPERATION, error, { tabUrl });
            return [];
        }
    }
}
