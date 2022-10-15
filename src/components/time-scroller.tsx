import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { intlFormat, setHours } from 'date-fns';
import { FC, useEffect, useMemo, useState } from 'react';

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

const Time: FC<{
    time: Date;
    currentHour: number;
    onHourChange: ((hour: number) => unknown) | undefined;
}> = ({ time, currentHour, onHourChange }) =>
    useMemo(() => {
        const hour = time.getHours();
        const isCurrentHour = hour === currentHour;
        return (
            <span
                className={clsx(
                    'px-4 flex w-[calc(5ch + 2rem)] transition-all cursor-pointer select-none',
                    {
                        'opacity-40': !isCurrentHour,
                    }
                )}
                onClick={() => onHourChange && onHourChange(hour)}
                key={hour}
            >
                <span
                    className={clsx('m-auto', {
                        'text-sm': !isCurrentHour,
                    })}
                >
                    {intlFormat(time, intlFormatToUse)}
                </span>
            </span>
        );
    }, [currentHour, onHourChange, time]);

export const TimeScroller: FC<{
    inputCurrentHour: number;
    onHourChange?: (hour: number) => unknown;
}> = ({ inputCurrentHour, onHourChange }) => {
    const times = useTimes();

    const springStyles = useSpring({
        transform: `translateX(calc(-${
            (inputCurrentHour / 24) * 100
        }% + -1.5ch))`,
    });

    return (
        <div className="relative w-[5ch] h-4 mx-4">
            <animated.div style={springStyles} className="absolute top-0 flex">
                {times.map((x) => (
                    <Time
                        key={x.getHours()}
                        time={x}
                        currentHour={inputCurrentHour}
                        onHourChange={onHourChange}
                    />
                ))}
            </animated.div>
        </div>
    );
};
