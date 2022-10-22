import { useEffect, useRef, useState } from 'react';

export const useCurrentUtcTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>();
    const interval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        setCurrentTime(new Date());
        console.log('new Time');
        interval.current = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [setCurrentTime]);
    return currentTime;
};
