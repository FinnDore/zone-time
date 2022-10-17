import { animated, config, useSpring } from '@react-spring/three';
import { Text, useCursor } from '@react-three/drei';
import { Canvas, Vector3 } from '@react-three/fiber';
import { intlFormat, setHours } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { getUtc } from '../_functions/get-utc';

const intlFormatToUse = {
    hour: 'numeric',
    minute: 'numeric',
} as const;

const useTimes = () => {
    const times = useRef<Date[]>([]);

    useEffect(() => {
        const newTimes: Date[] = [];
        const time = new Date();
        time.setMinutes(0);
        time.setHours(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        for (let i = 0; i < 24; i++) {
            newTimes.push(setHours(time, i));
        }

        times.current = newTimes;

        return () => {
            times.current = [];
        };
    }, []);

    return times.current;
};

const fontWidth = 35;
const Time: FC<{
    time: Date;
    timeZone: string;
    currentHour: number;
    onHourChange: ((hours: number) => unknown) | undefined;
    index: number;
}> = ({ time, currentHour, onHourChange, index, timeZone }) => {
    const [hovered, setHovered] = useState(false);

    const hour = time.getHours();
    const isCurrentHour = hour === currentHour;

    const onHourChangeFn = useCallback(
        () =>
            onHourChange &&
            currentHour !== hour &&
            onHourChange(
                zonedTimeToUtc(
                    setHours(utcToZonedTime(getUtc(), timeZone), hour),
                    timeZone
                ).getHours()
            ),
        [currentHour, hour, onHourChange, timeZone]
    );

    useCursor(hovered);
    return (
        <animated.mesh
            position={[index * fontWidth, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onHourChangeFn}
        >
            <Text
                color={'#fff'}
                fillOpacity={isCurrentHour ? 1 : 0.4}
                fontSize={isCurrentHour ? 9 : 7}
                font={'/IBMPlexMono/IBMPlexMono-Regular.ttf'}
            >
                {intlFormat(time, intlFormatToUse)}
            </Text>
        </animated.mesh>
    );
};

export const TimeScroller: FC<{
    inputCurrentHour: number;
    timeZone: string;
    onHourChange?: (hour: number) => unknown;
}> = ({ inputCurrentHour, onHourChange, timeZone }) => {
    const times = useTimes();
    const [pos, setPos] = useState([12, 0, 0]);
    const { position } = useSpring({
        config: config.default,
        position: [...pos],
    });

    useEffect(() => {
        const center = times.findIndex(
            (time) => time.getHours() === inputCurrentHour
        );
        if (center !== -1) {
            setPos(() => [-(center * fontWidth), 0, 0]);
        }
    }, [inputCurrentHour, times]);

    return (
        <div className="w-full h-4">
            <Canvas className="w-full h-4 absolute">
                <animated.mesh position={position as unknown as Vector3}>
                    {times.map((x, i) => (
                        <Time
                            index={i}
                            timeZone={timeZone}
                            currentHour={inputCurrentHour}
                            time={x}
                            onHourChange={onHourChange}
                            key={x.getHours()}
                        />
                    ))}
                </animated.mesh>
            </Canvas>
        </div>
    );
};
