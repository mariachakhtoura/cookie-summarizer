import { ErrorContext } from './error-constants';
import { logError } from './logger';

export function markdownToHtml(text: string): string {
    try {
        let result = text
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
            .replace(/```([\s\S]*?)```/g, '<code>$1</code>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');

        const hasNumbers = /^\d+\./m.test(text);
        if (result.includes('<li>')) {
            if (hasNumbers) {
                result = result.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');
                result = result.replace(/<\/ol><ol>/g, '');
            } else {
                result = result.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
                result = result.replace(/<\/ul><ul>/g, '');
            }
        }

        result = result.replace(/<p><\/p>/g, '');
        result = result.replace(/<p><br><\/p>/g, '');

        return result;
    } catch (error) {
        logError(ErrorContext.RUNTIME_ERROR, error, { textLength: text.length });
        return text;
    }
}
