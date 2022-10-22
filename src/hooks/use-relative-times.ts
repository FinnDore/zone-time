import { utcToZonedTime } from 'date-fns-tz';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { firstAndLastAtom } from '../attoms/first-and-last';
import { useCurrentUtcTime } from './current-time';

export const useRelativeTimes = (timeZones: string[]) => {
    const [masterTime, setMasterTime] = useState<Date | null>(null);

    const currentTime = useCurrentUtcTime();
    const setFirstAndLast = useSetAtom(firstAndLastAtom);

    let relativeTimes: [Date, string][] | null = null;
    if (currentTime) {
        const zonedTime = masterTime ?? currentTime;

        const times: [Date, string][] = [];
        for (const timeZone of timeZones) {
            const time = utcToZonedTime(zonedTime, timeZone);
            times.push([time, timeZone]);
        }
        relativeTimes = times;
    }

    useEffect(() => {
        const first = relativeTimes?.[0]?.[0];
        const last = relativeTimes?.[relativeTimes.length - 1]?.[0];
        if (first && last) {
            setFirstAndLast({ first, last });
        }
    }, [relativeTimes, setFirstAndLast]);

    return {
        relativeTimes,
        setMasterTime,
    };
};
