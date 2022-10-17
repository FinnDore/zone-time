import { setHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { firstAndLastAtom } from '../attoms/first-and-last';
import { getUtc } from '../_functions/get-utc';
import { TimeScroller } from './time-scroller';

const intlFormatToUse = {
    hour: 'numeric',
    minute: 'numeric',
} as const;

const useCurrentUtcTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(getUtc());
    const interval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        console.log('useCurrentTime');
        setCurrentTime(getUtc());
        interval.current = setInterval(() => {
            setCurrentTime(getUtc());
        }, 100000);
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [setCurrentTime]);
    return currentTime;
};

const useRelativeTimes = (timeZones: string[]) => {
    const [masterTime, setMasterTime] = useState<Date | null>(null);
    const relativeTimes = useRef<[[Date, string]] | null>(null);

    const currentTime = useCurrentUtcTime();
    const setFirstAndLast = useSetAtom(firstAndLastAtom);

    useEffect(() => {
        const reset = () => {
            // relativeTimes.current = null;
            // setMasterTime(null);
        };
        if (!currentTime) {
            return reset;
        }

        const zonedTime = masterTime ?? currentTime;

        const times: [[Date, string]] = [[zonedTime, 'utc']];
        for (const timeZone of timeZones) {
            const time = utcToZonedTime(zonedTime, timeZone);
            times.push([time, timeZone]);
        }

        const first = times[0][0];
        const last = times[times.length - 1]?.[0];
        if (first && last) {
            setFirstAndLast({ first: first, last: last });
        }

        relativeTimes.current = times;

        return reset;
    }, [currentTime, masterTime, setFirstAndLast, timeZones]);

    return {
        relativeTimes: relativeTimes.current,
        setMasterTime,
    };
};

const TimeScrollers = () => {
    const { relativeTimes, setMasterTime } = useRelativeTimes([
        'PST',
        'EST',
        'CET',
        'IST',
    ]);
    const onHourChange = useCallback(
        (hour: number) => {
            if (relativeTimes?.[0]) {
                const [masterTime] = relativeTimes[0];
                setMasterTime(() => setHours(masterTime, hour));
            }
        },
        [relativeTimes, setMasterTime]
    );

    if (!relativeTimes) {
        return null;
    }

    return (
        <>
            {relativeTimes.map((time, index) => (
                <div key={time[1]}>
                    <div className="my-6">
                        <TimeScroller
                            timeZone={time[1]}
                            onHourChange={onHourChange}
                            inputCurrentHour={time[0].getHours()}
                        />
                    </div>
                    {index !== relativeTimes.length - 1 && (
                        <div className="border-t-[#C9C9C9]/30 w-[80%] border-t mx-auto"></div>
                    )}
                </div>
            ))}
        </>
    );
};

export default TimeScrollers;
