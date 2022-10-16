import clsx from 'clsx';
import { setHours } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import intlFormat from 'date-fns/intlFormat';
import type { NextPage } from 'next';
import React, {
    forwardRef,
    HTMLProps,
    Suspense,
    useEffect,
    useState,
} from 'react';

const intlFormatToUse = {
    hour: 'numeric',
    minute: 'numeric',
} as const;

const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
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

const Time = ({ date }: { date: Date }) => (
    <div>
        {intlFormat(date, {
            ...intlFormatToUse,
        })}
    </div>
);

const TimeAwareBg = forwardRef<
    HTMLDivElement,
    HTMLProps<HTMLDivElement> & {
        date: Date;
    }
>(function TimeAwareBgInner(props, forwardedRef) {
    const isMorning = props.date.getHours() < 12;

    return (
        <div
            {...props}
            className={clsx(
                'bg-[#1e2022] text-white pointer-events-none',
                props.className
            )}
            ref={forwardedRef}
        >
            <div
                {...props}
                className={clsx(
                    'bg-gradient-radial to-slate-500/0 absolute top-0 transition-all h-full w-full',
                    {
                        'opacity-0': !isMorning,
                        'from-orange-800/20': isMorning,
                    }
                )}
                ref={forwardedRef}
            ></div>
            <div
                {...props}
                className={clsx(
                    'bg-gradient-radial to-slate-500/0 absolute top-0 transition-all h-full w-full',
                    {
                        'opacity-0': isMorning,
                        'from-blue-800/20': !isMorning,
                    }
                )}
                ref={forwardedRef}
            ></div>
        </div>
    );
});
const TimeScroller = React.lazy(() => import('../components/time-scroller'));
const Home: NextPage = () => {
    const currentTime = useCurrentTime();
    const [timeOverride, setTimeOverride] = useState<Date | null>(null);
    const timeInLa = useTimeInZone(timeOverride ?? currentTime);

    return (
        <>
            <div className="h-screen grid place-items-center">
                <div className="big-shadow w-[90%] h-[90%] relative overflow-hidden md:w-[600px] md:h-[400px] border bg-[#000]/60 border-[#C9C9C9]/30 rounded-3xl shadow-2xl flex flex-col justify-center">
                    <div className="my-6 text-xl">
                        <Suspense fallback={'loading'}>
                            <TimeScroller
                                inputCurrentHour={
                                    timeOverride?.getHours() ??
                                    currentTime?.getHours() ??
                                    12
                                }
                                onHourChange={(hour) =>
                                    currentTime &&
                                    setTimeOverride(() =>
                                        setHours(currentTime, hour)
                                    )
                                }
                            />
                        </Suspense>
                        {/* <Time date={currentTime} /> */}
                    </div>
                    <div className="border-t-[#C9C9C9]/30 w-[80%] border-t mx-auto"></div>
                    <div className=" my-6 text-xl">
                        {/* <Time date={timeInLa} /> */}
                        <Suspense fallback={'loading'}>
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
                        </Suspense>
                        {/* <div className="ml-2">PST</div> */}
                    </div>
                    {timeInLa && currentTime && (
                        <>
                            <TimeAwareBg
                                date={timeOverride ?? currentTime}
                                className="absolute -top-[25%] h-1/3 w-full blur-2xl"
                            />
                            <TimeAwareBg
                                date={timeInLa}
                                className="absolute bottom-[-25%] h-1/3 w-full blur-2xl"
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
