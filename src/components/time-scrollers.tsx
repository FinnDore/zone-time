import { setHours } from 'date-fns';
import { format as formatTz, utcToZonedTime } from 'date-fns-tz';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { firstAndLastAtom } from '../attoms/first-and-last';
import { formatTimezone } from '../_functions/format-time-zone';
import { getUtc } from '../_functions/get-utc';
import { TimeScroller } from './time-scroller';

const useCurrentUtcTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(getUtc());
    const interval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        setCurrentTime(getUtc());
        interval.current = setInterval(() => {
            setCurrentTime(getUtc());
        }, 10000);
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [setCurrentTime]);
    return currentTime;
};

const useRelativeTimes = (timeZones: string[]) => {
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

const TimeScrollers = ({ timeZones }: { timeZones: string[] }) => {
    const { relativeTimes, setMasterTime } = useRelativeTimes(timeZones);

    const onHourChange = useCallback(
        (hour: number) => {
            setMasterTime((masterTime) =>
                setHours(masterTime ?? getUtc(), hour)
            );
        },
        [setMasterTime]
    );

    if (!relativeTimes) {
        return null;
    }

    return (
        <>
            {relativeTimes.map((time, index) => (
                <div key={index}>
                    <div className="my-1 relative">
                        <TimeScroller
                            timeZone={time[1]}
                            onHourChange={onHourChange}
                            inputCurrentHour={time[0].getHours()}
                        />
                        <div className="ml-4 mt-2 text-xs opacity-50 italic">
                            {formatTimezone(time[1])}{' '}
                            {formatTz(time[0], 'xxx', { timeZone: time[1] })}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TimeScrollers;
