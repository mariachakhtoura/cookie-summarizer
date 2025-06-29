export const UI_TEXT = {
    TITLES: {
        SUMMARIZING_COOKIES: 'Summarizing cookies for',
        ERROR_ANALYSIS: 'Error - Cookie Analysis'
    },

    SUBTITLES: {
        NO_COOKIES_FOUND: 'No cookies found on this website',
        UNDERSTAND_ONE_COOKIE: 'Understand what 1 cookie is doing on this site',
        UNDERSTAND_MULTIPLE_COOKIES: (count: number) => `Understand what ${count} cookies are doing on this site`,
        ANALYZING_COOKIES: 'Analyzing cookies...',
        ONE_COOKIE_ANALYZED: '1 cookie analyzed',
        MULTIPLE_COOKIES_ANALYZED: (count: number) => `${count} cookies analyzed`,
        ERROR_LOADING_COOKIES: 'Error loading cookies',
        ERROR_LOADING_TAB: 'Error loading tab'
    },

    LOADING: {
        ANALYZING_COOKIES: 'Analyzing cookies...'
    },

    COOKIE_SECURITY: {
        SECURE: 'Secure',
        NOT_SECURE: 'Not secure',
        HTTP_ONLY: 'HttpOnly',
        JAVASCRIPT_ACCESSIBLE: 'JavaScript accessible',
        SAME_SITE_NONE: 'None'
    },

    COOKIE_DETAILS: {
        DOMAIN: 'Domain:',
        SECURITY: 'Security:',
        PATH: 'Path:',
        SAME_SITE: 'SameSite:'
    },

    MESSAGES: {
        NO_COOKIES_TITLE: 'No cookies found on this website.',
        NO_COOKIES_DESCRIPTION: 'This site doesn\'t use cookies for tracking or functionality.',
        NO_COOKIES_TO_SHOW: 'No cookies to show'
    },

    AI_ERRORS: {
        UNAVAILABLE: 'Chrome AI isn\'t available on this device. You need Chrome 127+ and compatible hardware.',
        DOWNLOADABLE: 'Chrome AI needs to download first. Please wait and try again.',
        DOWNLOADING: 'Chrome AI is downloading. Please wait and try again.',
        NO_RESPONSE: 'Chrome AI didn\'t respond. Please try again.'
    },

    AI_PROMPT: `You are a cookie analysis assistant. Your job is to help users understand the purpose of cookies used on a website.

Use ONLY the cookie data provided in the "cookies" object below. Do NOT guess or hallucinate. Whenever possible, refer to known behavior from https://github.com/privacy/cookies.

---

Your task:

1. Begin with a 3-4 sentence summary explaining the overall purpose of the cookies (e.g., login, personalization, performance).
2. Then list each and every cookie using the following format:
   - CookieName: Start with a verb or noun (e.g., "Stores user's timezone…"). Max 12 words. Be concise.
3. Only apply a ⚠️ warning if:
   - The cookie domain is different from the site's origin
   - The cookie name matches known tracking patterns (_ga, _fbp, _trk, etc.)
   - The cookie clearly belongs to an ad/analytics network

---

DO NOT:
- Assume cookie purpose from partial matches (e.g., '_octo' ≠ Octoparse)
- Flag session, theme, or timezone cookies unless they're third-party or cross-site
- Include technical jargon or multiple-sentence paragraphs
- Analyze cookies not included below

Respond in this format:
Summary paragraph

cookieName1: Explanation...
cookieName2: Explanation...

---

"cookies": `,

    CACHE_LOGS: {
        HIT: (domain: string) => `Cache hit for domain: ${domain}`,
        STORED: (domain: string) => `Cached analysis for domain: ${domain}`,
        CLEARED_DOMAIN: (domain: string) => `Cleared cache for domain: ${domain}`,
        CLEARED_ALL: 'Cleared all analysis cache',
        CLEANUP: (count: number) => `Cleaned up ${count} expired cache entries`
    },

    CACHE_ERRORS: {
        READ_ERROR: 'Error reading from cache',
        WRITE_ERROR: 'Error writing to cache',
        CLEAR_DOMAIN_ERROR: 'Error clearing domain cache',
        CLEAR_ALL_ERROR: 'Error clearing all cache',
        STATS_ERROR: 'Error getting cache stats',
        CLEANUP_ERROR: 'Error cleaning up cache'
    }
} as const;
