import { useState } from 'react';

type UseYearState = {
    currentYear: number;
    setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
    incrementYear: () => void;
    decrementYear: () => void;
};

export const useYearState = (): UseYearState => {
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    const incrementYear = () => {
        setCurrentYear(year => year + 1);
    };

    const decrementYear = () => {
        setCurrentYear(year => year - 1);
    };

    return { currentYear, setCurrentYear, incrementYear, decrementYear };
};
