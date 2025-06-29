// Chrome AI types (official API)
declare global {
    interface Window {
        ai?: {
            languageModel: {
                capabilities(): Promise<{ available: string }>;
                create(options: { systemPrompt: string }): Promise<{
                    prompt(text: string): Promise<string>;
                    destroy(): void;
                }>;
            };
        };
    }

    // Official Chrome AI LanguageModel API
    class LanguageModel {
        static availability(): Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
        static create(options?: {
            initialPrompts?: Array<{
                role: 'system' | 'user' | 'assistant';
                content: string;
            }>;
            temperature?: number;
            topK?: number;
            signal?: AbortSignal;
            monitor?: (monitor: any) => void;
        }): Promise<{
            prompt(text: string, options?: { signal?: AbortSignal }): Promise<string>;
            promptStreaming(text: string, options?: { signal?: AbortSignal }): ReadableStream;
            clone(options?: { signal?: AbortSignal }): Promise<any>;
            destroy(): void;
            inputUsage: number;
            inputQuota: number;
        }>;
        static params(): Promise<{
            defaultTopK: number;
            maxTopK: number;
            defaultTemperature: number;
            maxTemperature: number;
        }>;
    }
}

export { };
