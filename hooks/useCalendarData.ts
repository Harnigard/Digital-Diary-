import {useEffect, useState} from 'react';
import {generateCalendarData} from "@/constants/calendarUtils";

const useCalendarData = (year: number) => {
    const [calendarData, setCalendarData] = useState<any[]>([]);

    useEffect(() => {
        const data = generateCalendarData(year);
        setCalendarData(data);
    }, [year]);

    return calendarData
};

export default useCalendarData;