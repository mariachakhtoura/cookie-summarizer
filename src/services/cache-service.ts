import { ErrorContext } from '../utils/error-constants';
import { logError, logInfo } from '../utils/logger';
import { UI_TEXT } from '../utils/text-constants';

export interface CachedAnalysis {
    domain: string;
    cookieHash: string;
    analysis: string;
    timestamp: number;
    cookieCount: number;
}

export class CacheService {
    private static readonly CACHE_KEY = 'cookieAnalysisCache';
    private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000;

    private static generateCookieHash(cookies: chrome.cookies.Cookie[]): string {
        const sortedCookies = [...cookies].sort((a, b) => a.name.localeCompare(b.name));
        const cookieData = sortedCookies.map(cookie => ({
            name: cookie.name,
            domain: cookie.domain,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite ?? "None"
        }));

        return btoa(JSON.stringify(cookieData));
    }

    static async getCachedAnalysis(
        domain: string,
        cookies: chrome.cookies.Cookie[]
    ): Promise<string | null> {
        try {
            const result = await chrome.storage.local.get(this.CACHE_KEY);
            const cache: Record<string, CachedAnalysis> = result[this.CACHE_KEY] ?? {};

            const cachedEntry = cache[domain];
            if (!cachedEntry) {
                return null;
            }

            const now = Date.now();
            if (now - cachedEntry.timestamp > this.CACHE_DURATION) {
                delete cache[domain];
                await chrome.storage.local.set({ [this.CACHE_KEY]: cache });
                return null;
            }

            const currentHash = this.generateCookieHash(cookies);
            if (cachedEntry.cookieHash !== currentHash) {
                return null;
            }

            logInfo(ErrorContext.CACHE_READ, UI_TEXT.CACHE_LOGS.HIT(domain));
            return cachedEntry.analysis;
        } catch (error) {
            logError(ErrorContext.CACHE_READ, error, { domain, cookieCount: cookies.length });
            return null;
        }
    }

    static async setCachedAnalysis(
        domain: string,
        cookies: chrome.cookies.Cookie[],
        analysis: string
    ): Promise<void> {
        try {
            const result = await chrome.storage.local.get(this.CACHE_KEY);
            const cache: Record<string, CachedAnalysis> = result[this.CACHE_KEY] ?? {};

            const cookieHash = this.generateCookieHash(cookies);

            cache[domain] = {
                domain,
                cookieHash,
                analysis,
                timestamp: Date.now(),
                cookieCount: cookies.length
            };

            await chrome.storage.local.set({ [this.CACHE_KEY]: cache });
            logInfo(ErrorContext.CACHE_WRITE, UI_TEXT.CACHE_LOGS.STORED(domain));
        } catch (error) {
            logError(ErrorContext.CACHE_WRITE, error, { domain, cookieCount: cookies.length });
        }
    }

    static async clearDomainCache(domain: string): Promise<void> {
        try {
            const result = await chrome.storage.local.get(this.CACHE_KEY);
            const cache: Record<string, CachedAnalysis> = result[this.CACHE_KEY] ?? {};

            delete cache[domain];
            await chrome.storage.local.set({ [this.CACHE_KEY]: cache });
            logInfo(ErrorContext.CACHE_CLEAR, UI_TEXT.CACHE_LOGS.CLEARED_DOMAIN(domain));
        } catch (error) {
            logError(ErrorContext.CACHE_CLEAR, error, { domain });
        }
    }

    static async clearAllCache(): Promise<void> {
        try {
            await chrome.storage.local.remove(this.CACHE_KEY);
            logInfo(ErrorContext.CACHE_CLEAR, UI_TEXT.CACHE_LOGS.CLEARED_ALL);
        } catch (error) {
            logError(ErrorContext.CACHE_CLEAR, error);
        }
    }

    static async getCacheStats(): Promise<{ totalEntries: number; totalSize: number }> {
        try {
            const result = await chrome.storage.local.get(this.CACHE_KEY);
            const cache: Record<string, CachedAnalysis> = result[this.CACHE_KEY] ?? {};

            const totalEntries = Object.keys(cache).length;
            const totalSize = JSON.stringify(cache).length;

            return { totalEntries, totalSize };
        } catch (error) {
            logError(ErrorContext.CACHE_STATS, error);
            return { totalEntries: 0, totalSize: 0 };
        }
    }

    static async cleanupExpiredEntries(): Promise<void> {
        try {
            const result = await chrome.storage.local.get(this.CACHE_KEY);
            const cache: Record<string, CachedAnalysis> = result[this.CACHE_KEY] ?? {};

            const now = Date.now();
            let cleanedCount = 0;

            for (const domain in cache) {
                if (now - cache[domain].timestamp > this.CACHE_DURATION) {
                    delete cache[domain];
                    cleanedCount++;
                }
            }

            if (cleanedCount > 0) {
                await chrome.storage.local.set({ [this.CACHE_KEY]: cache });
                logInfo(ErrorContext.CACHE_CLEANUP, UI_TEXT.CACHE_LOGS.CLEANUP(cleanedCount));
            }
        } catch (error) {
            logError(ErrorContext.CACHE_CLEANUP, error);
        }
    }

    static getDomainFromUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace(/^www\./, '');
        } catch (error) {
            logError(ErrorContext.VALIDATION_ERROR, error, { url });
            return 'unknown-domain';
        }
    }
}
