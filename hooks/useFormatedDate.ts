import { parse, format, isValid } from 'date-fns';

type SelectedDate = {
    day: number;
    month: string;
    year: number;
};

const useFormattedDate = () => {
    const formatSelectedDate = (date: SelectedDate | null): string => {
        if (!date) return '';

        const dateStr = `${date.day} ${date.month} ${date.year}`;
        const parsedDate = parse(dateStr, 'd MMMM yyyy', new Date());

        if (!isValid(parsedDate)) {
            return 'Invalid Date';
        }

        return format(parsedDate, 'EEEE, d MMMM yyyy');
    };
    return { formatSelectedDate };
};

export default useFormattedDate;
