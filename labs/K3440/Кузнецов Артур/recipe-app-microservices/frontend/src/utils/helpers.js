export function formatMinutesToText(minutes) {
    if (!Number.isFinite(minutes)) return '-';
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    if (hours === 0) return `${minutes} мин`;
    if (restMinutes === 0) return `${hours} ч`;
    return `${hours} ч ${restMinutes} мин`;
}

export function escapeHtml(input) {
    if (typeof input !== 'string') return input ?? '';
    return input.replace(/[&<>"']/g, (character) =>
        ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
        }[character]),
    );
}

