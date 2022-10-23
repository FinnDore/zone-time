import { animated, config, useSpring } from '@react-spring/three';
import { Text, useCursor } from '@react-three/drei';
import { Canvas, Vector3 } from '@react-three/fiber';
import { format, setHours } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { FC, memo, useCallback, useRef, useState } from 'react';
import { getUtc } from '../_functions/get-utc';

const timeFormat = 'kk:mm';

const useTimes = () => {
    const times = useRef<Date[]>([]);

    const newTimes: Date[] = [];
    const time = getUtc();
    time.setMinutes(0);
    time.setHours(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    for (let i = 0; i < 24; i++) {
        newTimes.push(setHours(time, i));
    }

    times.current = newTimes;

    return times.current;
};

const fontWidth = 35;
const Time = memo(function TimeInner({
    time,
    currentHour,
    onHourChange,
    index,
    timeZone,
}: {
    time: Date;
    timeZone: string;
    currentHour: number;
    onHourChange: ((hours: number) => unknown) | undefined;
    index: number;
}) {
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
                {format(time, timeFormat)}
            </Text>
        </animated.mesh>
    );
});

export const TimeScroller: FC<{
    inputCurrentHour: number;
    timeZone: string;
    onHourChange?: (hour: number) => unknown;
}> = ({ inputCurrentHour, onHourChange, timeZone }) => {
    const times = useTimes();

    const center = times.findIndex(
        (time) => time.getHours() === inputCurrentHour
    );

    const { position } = useSpring({
        from: { position: [0, 0, 0] },
        config: config.default,
        position: center !== -1 ? [-(center * fontWidth), 0, 0] : [12, 0, 0],
    });

    return (
        <div className="w-full h-4">
            <Canvas className="w-full h-4 absolute">
                <animated.mesh position={position as unknown as Vector3}>
                    {times.map((x) => (
                        <Time
                            index={x.getHours()}
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
