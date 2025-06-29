import { ApiResponse } from "../utils/error-constants";

export enum MessageType {
    GET_PAGE_INFO = 'GET_PAGE_INFO',
    ANALYZE_PAGE_COOKIES = 'ANALYZE_PAGE_COOKIES',
    COOKIE_COUNT_UPDATED = 'COOKIE_COUNT_UPDATED',
    GET_COOKIES = 'GET_COOKIES',
    ANALYZE_COOKIES = 'ANALYZE_COOKIES'
}

export interface StorageData {
    installDate: number;
    storiesGenerated: number;
}

export interface InstallationDetails {
    reason: string;
    previousVersion?: string;
}

export interface GetCookiesMessage {
    type: MessageType.GET_COOKIES;
    url: string;
}

export interface AnalyzeCookiesMessage {
    type: MessageType.ANALYZE_COOKIES;
    cookies: chrome.cookies.Cookie[];
    url?: string;
}

export interface GetPageInfoMessage {
    type: MessageType.GET_PAGE_INFO;
    url?: string;
}

export interface AnalyzePageCookiesMessage {
    type: MessageType.ANALYZE_PAGE_COOKIES;
    url?: string;
}

export interface CookieCountUpdatedMessage {
    type: MessageType.COOKIE_COUNT_UPDATED;
    count: number;
    url?: string;
}

export type ExtensionMessage =
    | GetCookiesMessage
    | AnalyzeCookiesMessage
    | GetPageInfoMessage
    | AnalyzePageCookiesMessage
    | CookieCountUpdatedMessage;

export interface MessageResponse {
    success: boolean;
    count?: number;
    cookies?: chrome.cookies.Cookie[];
    url?: string;
    title?: string;
    analysis?: string;
    message?: string;
    error?: string;
}

export type ResponseCallback = (response: ApiResponse) => void;
export type ContentMessage = GetPageInfoMessage | AnalyzePageCookiesMessage | { type: string };
export type BackgroundMessage = GetCookiesMessage | AnalyzeCookiesMessage | CookieCountUpdatedMessage;

export interface PageInfo {
    url: string;
    title: string;
    domain: string;
    cookieCount: number;
}

export interface Elements {
    dynamicTitle: HTMLElement | null;
    dynamicSubtitle: HTMLElement | null;
    analysisHeader: HTMLElement | null;
    analysisContent: HTMLElement | null;
    cookieDetails: HTMLElement | null;
    cookieList: HTMLElement | null;
}
