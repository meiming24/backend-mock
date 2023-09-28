export function limitOffsetArray<T>(array: T[], limit: number, offset: number): T[] {
    if (!array) return [];
    if (offset < 0) {
        offset = 0
    }
    const length = array.length;
    if (!length) {
        return [];
    }

    const start = limit * (+offset - 1)
    const end = start + limit
    return array.slice(start, end);
}

export function generateUniqueFileName(extension: string): string {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join("");
    return `${randomName}${extension}`
}