import { useEffect, useState } from 'react';
import { format, getDate, getYear } from "date-fns";

const useSelectedDate = (currentYear: number) => {
    const [selectedDate, setSelectedDate] = useState<{ day: number, month: string, year: number } | null>(() => {
        const today = new Date();
        return {
            day: getDate(today),
            month: format(today, 'MMMM'),
            year: getYear(today),
        };
    });

    useEffect(() => {
        const today = new Date();
        let newSelectedDate = {
            day: (selectedDate?.day === 29 && selectedDate.month === 'February')
                ? (new Date(currentYear, 1, 29).getDate() === 1 ? 28 : 29)
                : (selectedDate?.day ?? getDate(today)),
            month: selectedDate?.month ?? format(today, 'MMMM'),
            year: currentYear
        };

        setSelectedDate(newSelectedDate);
    }, [currentYear]);

    const handleDatePress = (date: Date = new Date()) => {
        const day = getDate(date);
        const month = format(date, 'MMMM');
        const year = getYear(date);
        setSelectedDate({ day, month, year });
    };

    return { selectedDate, setSelectedDate, handleDatePress };
};

export default useSelectedDate;
