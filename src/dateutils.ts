export function addDays(dt: Date, days: number) {
    return new Date(dt.getTime() + (1000*60*60*24*days));
}

export function addSeconds(dt: Date, seconds: number) {
    return new Date(dt.getTime() + (1000*seconds));
}

export function isAfter(dt1: Date, dt2: Date) {
    return dt1.getTime() > dt2.getTime();
}

export function minDate(dt1: Date, dt2: Date) {
    return dt1.getTime() < dt2.getTime() ? dt1 : dt2;
}

export function getDateRangesMillis(startDate: Date, endDate: Date, intervalMillis: number) {
    const ranges = [];
    let curr = startDate;
    while (curr < endDate) {
        const nextDate = new Date(curr.getTime() + intervalMillis);
        const currEnd = minDate(nextDate, endDate);
        ranges.push({startDate: curr,  endDate: currEnd});
        curr = currEnd;
    }
    return ranges;
}

export function getDateRanges(startDate: Date, endDate: Date, days: number) {
    const ranges = [];
    let curr = startDate;
    while (curr < endDate) {
        const currEnd = minDate(addDays(curr, days), endDate);
        ranges.push({startDate: curr,  endDate: currEnd});
        curr = currEnd;
    }
    return ranges;
}

export function getDateRangesSecs(startDate: Date, endDate: Date, seconds: number) {
    const ranges = [];
    let curr = startDate;
    while (curr < endDate) {
        const currEnd = minDate(addSeconds(curr, seconds), endDate);
        ranges.push({startDate: curr,  endDate: currEnd});
        curr = currEnd;
    }
    return ranges;
}