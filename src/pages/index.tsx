import { PlusIcon } from '@radix-ui/react-icons';
import {
    Anchor,
    Content,
    Popover,
    Portal,
    Trigger,
} from '@radix-ui/react-popover';
import { animated, config, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useAtomValue } from 'jotai';
import { capitalize } from 'lodash';
import type { NextPage } from 'next';
import {
    forwardRef,
    HTMLProps,
    lazy,
    Suspense,
    useEffect,
    useRef,
    useState,
} from 'react';
import { firstAndLastAtom } from '../attoms/first-and-last';
import { Skeleton } from '../components/skeleton';
import { TimeInput } from '../components/time-input';
import { useCurrentTime } from '../hooks/current-time';
import { useRelativeTimes } from '../hooks/use-relative-times';

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
        <Skeleton className="h-4 mx-4 my-4" />
        <Skeleton className="h-4 mx-4 my-4" />
        <Skeleton className="h-4 mx-4 my-4" />
        <Skeleton className="h-4 mx-4 my-4" />
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

const Header = () => {
    const currentTime = useCurrentTime();
    const timeZone = useRef<string | null>(null);

    useEffect(() => {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        timeZone.current = capitalize(
            zone.replace(/_/g, ' ').split('/').pop() ?? ''
        );
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-bold text-center">
                <div className="opacity-50">
                    {timeZone.current}
                    {` `}
                    {currentTime && format(currentTime, 'co LLL')}
                </div>
                <div className="text-4xl">
                    {currentTime && format(currentTime, 'HH:mm:ss')}
                </div>

                <div className="opacity-50"></div>
            </div>
        </div>
    );
};

const Home: NextPage = () => {
    const [timeZones, setTimezones] = useState([
        'Europe/London',
        'America/los_angeles',
        'Asia/Tokyo',
        'Pacific/Tahiti',
    ]);

    const { relativeTimes, setMasterTime } = useRelativeTimes(timeZones);
    const spring = useSpring({
        height: timeZones.length * 3 + 16 + 'rem',
        config: config.wobbly,
    });
    return (
        <>
            <div className="hidden absolute md:flex top-4 left-6">
                <h1 className="font-2xl">Time</h1>
            </div>
            <div className="h-screen grid place-items-center">
                <animated.div
                    style={spring}
                    className="big-shadow w-[90%] relative overflow-hidden md:w-[600px] border bg-[#000]/60 border-[#C9C9C9]/30 rounded-3xl shadow-2xl flex flex-col justify-center"
                >
                    <div className="flex justify-center mb-6 -mt-6">
                        <Header />
                    </div>

                    <Suspense fallback={<TimeScrollerFallback />}>
                        {relativeTimes && (
                            <TimeScrollers
                                times={relativeTimes}
                                setMasterTime={setMasterTime}
                            />
                        )}

                        <div className="flex justify-end -mt-5 opacity-50">
                            <Popover>
                                <Anchor />
                                <Trigger
                                    className="hover:bg-white/50 rounded-sm transition-colors px-3 py-1 mr-1"
                                    role="Add a timezone"
                                >
                                    <PlusIcon />
                                </Trigger>
                                <Portal>
                                    <Content className="bg-black  border-[#C9C9C9]/30  border rounded-md ">
                                        <TimeInput
                                            defaultVal="London"
                                            onChange={(val) =>
                                                setTimezones((x) => [...x, val])
                                            }
                                        />
                                    </Content>
                                </Portal>
                            </Popover>
                        </div>
                    </Suspense>
                    <TimeAwareBgs />
                </animated.div>
            </div>
        </>
    );
};

export default Home;
