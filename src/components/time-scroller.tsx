import { animated, config, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { intlFormat, setHours } from 'date-fns';
import { FC, useEffect, useState } from 'react';

const intlFormatToUse = {
    hour: 'numeric',
    minute: 'numeric',
} as const;

const useTimes = () => {
    const [times, setTimes] = useState<Date[]>([]);

    useEffect(() => {
        const newTimes: Date[] = [];
        const time = new Date();
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        for (let i = 0; i < 24; i++) {
            newTimes.push(setHours(time, i));
        }

        setTimes(() => newTimes);

        return () => setTimes(() => []);
    }, []);

    return times;
};

export const TimeScroller: FC<{ currentHour: number }> = ({ currentHour }) => {
    const times = useTimes();
    console.log(times);
    const springStyles = useSpring({
        config: config.default,
        transform: `translateX(calc(-${(currentHour / 24) * 100}% + -1.5ch))`,
    });

    return (
        <div className="relative w-[5ch] h-4 mx-4">
            <animated.div style={springStyles} className="absolute top-0 flex ">
                {times.map((x) => {
                    const hour = x.getHours();
                    const isCurrentHour = hour === currentHour;
                    return (
                        <span
                            className={clsx('mx-4 flex w-[5ch]', {
                                'opacity-40': !isCurrentHour,
                            })}
                            key={hour}
                        >
                            <span
                                className={clsx('m-auto', {
                                    'text-sm': !isCurrentHour,
                                })}
                            >
                                {intlFormat(x, intlFormatToUse)}{' '}
                            </span>
                        </span>
                    );
                })}
            </animated.div>
        </div>
    );
};
