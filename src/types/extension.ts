export interface CookieData {
    name: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export interface StorageData {
    installDate: number;
    storiesGenerated: number;
}

export interface InstallationDetails {
    reason: string;
    previousVersion?: string;
}

export interface AICapabilities {
    available: string;
}

export interface AISession {
    prompt(text: string): Promise<string>;
    destroy(): void;
}

export interface LanguageModel {
    capabilities(): Promise<AICapabilities>;
    create(options: { systemPrompt: string }): Promise<AISession>;
}

export interface GetCookiesMessage {
    action: 'getCookies';
}

export interface CookiesResponse {
    success: boolean;
    cookies?: CookieData[];
    error?: string;
}

export interface GenerateStoryMessage {
    action: 'generateStory';
    cookies: CookieData[];
}

export interface StoryResponse {
    success: boolean;
    story?: string;
    error?: string;
}

export type ExtensionMessage = GetCookiesMessage | GenerateStoryMessage;
