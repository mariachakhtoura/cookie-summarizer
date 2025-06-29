export function formatUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname || url;
    } catch {
        return url;
    }
}
