import { handleError } from '../utils/logger';
import { ErrorContext } from '../utils/error-constants';
import { UI_TEXT } from '../utils/text-constants';

export class AIService {
    static async generateCookieAnalysis(
        cookies: chrome.cookies.Cookie[]
    ): Promise<string> {
        try {
            const available = await LanguageModel.availability();

            if (available === 'unavailable') {
                throw new Error(UI_TEXT.AI_ERRORS.UNAVAILABLE);
            }

            if (available === 'downloadable') {
                throw new Error(UI_TEXT.AI_ERRORS.DOWNLOADABLE);
            }

            if (available === 'downloading') {
                throw new Error(UI_TEXT.AI_ERRORS.DOWNLOADING);
            }

            const session = await LanguageModel.create();

            try {
                const cookieData = cookies.map(cookie => ({
                    name: cookie.name,
                    domain: cookie.domain,
                }));

                const prompt = `${UI_TEXT.AI_PROMPT}${JSON.stringify(cookieData, null, 2)}`;

                const result = await session.prompt(prompt);

                if (!result || result.trim().length === 0) {
                    throw new Error(UI_TEXT.AI_ERRORS.NO_RESPONSE);
                }

                return result;
            } finally {
                session.destroy();
            }
        } catch (error) {
            handleError(ErrorContext.ANALYZE_COOKIES_OPERATION, error, 'AI cookie analysis failed', {
                cookiesCount: cookies.length
            });
            throw error;
        }
    }
}
