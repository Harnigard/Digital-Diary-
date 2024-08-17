import { getDaysInMonth, startOfMonth, getDay, format } from 'date-fns';

export const generateCalendarData = (year:number) => {
    return Array.from({ length: 12 }, (_, index) => {
        const date = new Date(year, index, 1);
        const month = format(date, 'MMMM');
        const startDay = getDay(startOfMonth(date));
        const days = getDaysInMonth(date);

        return {
            month,
            year,
            startDay,
            days,
        };
    });
};