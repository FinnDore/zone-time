import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { firstAndLastAtom } from '../attoms/first-and-last';
import { TimeScroller } from './time-scroller';

const intlFormatToUse = {
    hour: 'numeric',
    minute: 'numeric',
} as const;

const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(new Date());
    const interval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        console.log('useCurrentTime');
        setCurrentTime(new Date());
        interval.current = setInterval(() => {
            setCurrentTime(new Date());
        }, 100000);
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, []);
    return currentTime;
};
// const useCurrentTime = () => {
//     const currentTime = useRef<Date | null>();
//     useEffect(() => {
//         currentTime.current = new Date();
//         const timer = setInterval(() => {
//             currentTime.current = new Date();
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);
//     return currentTime.current;
// };

// const useTimeInZone = (time: Date | null) => {
//     const [timeInZone, setTimeInZone] = useState(time);

//     useEffect(() => {
//         if (time) {
//             setTimeInZone(utcToZonedTime(time, 'America/New_York'));
//         }
//     }, [time]);

//     return timeInZone;
// };

const useRelativeTimes = (timeZones: string[]) => {
    const [masterTime, setMasterTime] = useState<Date | null>(null);
    const relativeTimes = useRef<[[Date, string]] | null>(null);

    const currentTime = useCurrentTime();
    const setFirstAndLast = useSetAtom(firstAndLastAtom);

    useEffect(() => {
        const reset = () => {
            relativeTimes.current = null;
            setMasterTime(null);
        };
        if (!currentTime) {
            return reset;
        }

        const zonedTime = zonedTimeToUtc(masterTime ?? currentTime, 'UTC');

        const times: [[Date, string]] = [[zonedTime, 'utc']];
        for (const timeZone of timeZones) {
            const time = utcToZonedTime(zonedTime, timeZone);
            times.push([time, timeZone]);
        }

        const first = times[0][0];
        const last = times[times.length - 1]?.[0];
        if (first && last) {
            console.log('first', first);
            setFirstAndLast({ first, last });
        }

        relativeTimes.current = times;
        console.log('re-renderTimes');
        return reset;
    }, [currentTime, masterTime, setFirstAndLast, timeZones]);

    return {
        relativeTimes: relativeTimes.current,
        setMasterTime,
    };
};

export const TimeScrollers = () => {
    const { relativeTimes, setMasterTime } = useRelativeTimes([
        'America/New_York',
        'Pacific/Wallis',
        'Indian/Reunion',
    ]);

    if (!relativeTimes) {
        return null;
    }
    return (
        <>
            {relativeTimes.map((time, index) => (
                <>
                    <div className="my-6">
                        <TimeScroller
                            onHourChange={(hour) => {
                                const newTime = new Date(time[0]);
                                newTime.setHours(hour);
                                setMasterTime(newTime);
                            }}
                            key={index}
                            inputCurrentHour={time[0].getHours()}
                        />
                    </div>
                    {index !== relativeTimes.length - 1 && (
                        <div className="border-t-[#C9C9C9]/30 w-[80%] border-t mx-auto"></div>
                    )}
                </>
            ))}
        </>
    );
};

export default TimeScrollers;
