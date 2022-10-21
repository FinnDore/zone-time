import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import type { NextPage } from 'next';
import { forwardRef, HTMLProps, lazy, Suspense, useState } from 'react';
import { firstAndLastAtom } from '../attoms/first-and-last';
import { Skeleton } from '../components/skeleton';
import { TimeInput } from '../components/time-input';

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

const TimeScrollers = lazy(() => import('../components/time-scrollers'));
const TimeScrollerFallback = () => (
    <div className="flex flex-col w-full">
        <Skeleton className="h-4 mx-4 my-6" />
        <div className="border-t-[#C9C9C9]/30 w-[80%] border-t mx-auto"></div>
        <Skeleton className="h-4 mx-4 my-6" />
    </div>
);

const TimeAwareBgs = () => {
    const firstAndLast = useAtomValue(firstAndLastAtom);
    if (!firstAndLast) {
        return null;
    }
    return (
        <>
            <TimeAwareBg
                date={firstAndLast.first}
                className="absolute -top-[25%] h-1/3 w-full blur-2xl"
            />
            <TimeAwareBg
                date={firstAndLast.last}
                className="absolute bottom-[-25%] h-1/3 w-full blur-2xl"
            />
        </>
    );
};

const Home: NextPage = () => {
    const [timeZones, setTimeZones] = useState<string[]>([
        'Europe/London',
        'America/los_angeles',
    ]);

    const onTimeZoneChange = (index: number) => (timeZone: string) => {
        setTimeZones((timeZones) => {
            const newTimeZones = [...timeZones];
            newTimeZones[index] = timeZone;
            return newTimeZones;
        });
    };

    return (
        <>
            <div className="hidden absolute md:flex top-4 left-6">
                <picture className="my-auto mr-2 w-6">
                    <img src="/time.png" alt="logo for time" />
                </picture>
                <h1 className="font-2xl">Time</h1>
            </div>
            <div className="h-screen grid place-items-center">
                <div className="big-shadow w-[90%] h-[90%] relative overflow-hidden md:w-[600px] md:h-[400px] border bg-[#000]/60 border-[#C9C9C9]/30 rounded-3xl shadow-2xl flex flex-col justify-center">
                    <div className="flex justify-center mb-4">
                        <TimeInput
                            defaultVal={'london'}
                            onChange={onTimeZoneChange(0)}
                        />
                    </div>
                    <Suspense fallback={<TimeScrollerFallback />}>
                        <TimeScrollers timeZones={timeZones} />
                    </Suspense>

                    <div className="flex justify-center mt-4">
                        <TimeInput
                            defaultVal={'Los angeles'}
                            onChange={onTimeZoneChange(1)}
                        />
                    </div>

                    <TimeAwareBgs />
                </div>
            </div>
        </>
    );
};

export default Home;
