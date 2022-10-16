import { setHours } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useEffect, useRef, useState } from 'react';
import { TimeScroller } from './time-scroller';

const intlFormatToUse = {
    hour: 'numeric',
    minute: 'numeric',
} as const;

const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>();
    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return currentTime;
};

const useTimeInZone = (time: Date | null) => {
    const [timeInZone, setTimeInZone] = useState(time);

    useEffect(() => {
        if (time) {
            setTimeInZone(utcToZonedTime(time, 'America/New_York'));
        }
    }, [time]);

    return timeInZone;
};

const useRelativeTimes = (timeZones: string[]) => {
    const [masterTime, setMasterTime] = useState<Date | null>(null);
    const relativeTimes = useRef<Date[]>([]);
    const currentTime = useCurrentTime();

    useEffect(() => {
        const reset = () => {
            console.log('reset');
        };
        if (!currentTime) {
            return reset;
        }
        const zonedTime = zonedTimeToUtc(masterTime ?? currentTime, 'UTC');

        const times = [zonedTime];
        for (const timeZone of timeZones) {
            const time = utcToZonedTime(zonedTime, timeZone);
            times.push(time);
        }
        relativeTimes.current = times;
        console.log('re-renderTimes');
        return reset;
    }, [currentTime?.toUTCString(), masterTime, timeZones]);

    return {
        relativeTimes: relativeTimes.current,
        setMasterTime,
    };
};

export const TimeScrollers: React.FC<{
    setFirstAndLast: (dates: { first: Date; last: Date }) => unknown;
}> = ({ setFirstAndLast }) => {
    const { relativeTimes, setMasterTime } = useRelativeTimes([
        'America/New_York',
        'America/Argentina/San_Juan',
    ]);

    useEffect(() => {
        const first = relativeTimes[0];
        const last = relativeTimes[relativeTimes.length - 1];
        if (first && last) {
            setFirstAndLast({ first, last });
        }
    }, [relativeTimes, setFirstAndLast]);

    return (
        <>
            {relativeTimes.map((time, index) => (
                <>
                    <div className="my-6">
                        <TimeScroller
                            key={index}
                            inputCurrentHour={time.getHours()}
                            onHourChange={(hour) =>
                                setMasterTime(() => setHours(time, hour))
                            }
                        />
                    </div>
                    {index !== relativeTimes.length - 1 && (
                        <div className="border-t-[#C9C9C9]/30 w-[80%] border-t mx-auto"></div>
                    )}
                </>
            ))}
            {/* <div className="my-6 text-xl">
                <TimeScroller
                    inputCurrentHour={relativeTimes[0].getHours()}
                    onHourChange={(hour) =>
                        currentTime &&
                        setTimeOverride(() => setHours(currentTime, hour))
                    }
                />
            </div>

            <div className="my-6 text-xl">
                <TimeScroller
                    inputCurrentHour={timeInLa?.getHours() ?? 12}
                    onHourChange={(hour) =>
                        timeInLa &&
                        currentTime &&
                        setTimeOverride(() =>
                            utcToZonedTime(
                                zonedTimeToUtc(
                                    setHours(timeInLa, hour),
                                    'America/New_York'
                                ),
                                'gmt'
                            )
                        )
                    }
                /> 
                
            </div>
                */}
        </>
    );
};

export default TimeScrollers;
