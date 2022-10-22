import { useEffect, useRef, useState } from 'react';
import { getUtc } from '../_functions/get-utc';

export const useCurrentUtcTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>();
    const interval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        setCurrentTime(getUtc());

        interval.current = setInterval(() => {
            setCurrentTime(getUtc());
        }, 1000);
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [setCurrentTime]);
    return currentTime;
};

export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>();
    const interval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        setCurrentTime(new Date());

        interval.current = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [setCurrentTime]);
    return currentTime;
};
