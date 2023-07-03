export const getStartEndOfDate = (date: string) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setDate(end.getDate() + 1); // 设置日期为明天
    end.setHours(0, 0, 0, 0); // 设置时间为明天的 00:00:00
    return { start, end };
}
export const timestampToTime = (timestamp: number | undefined) => {
    if (timestamp === undefined) {
        return null;
    }
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// 轉換日期和時間為時間戳記
export const timeToTimestamp = (date: string, time: string): number => {
    const dateTimeString = `${date}T${time}:00`;
    const timestamp = Date.parse(dateTimeString);
    return isNaN(timestamp) ? 0 : timestamp / 1000;
}