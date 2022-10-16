import { animated, config, useSpring } from '@react-spring/three';
import { Text, useCursor } from '@react-three/drei';
import { Canvas, Vector3 } from '@react-three/fiber';
import { intlFormat, setHours } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { FC, useEffect, useState } from 'react';

const intlFormatToUse = {
    hour: 'numeric',
    minute: 'numeric',
} as const;

const useTimes = (timeZone: string) => {
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
    }, [timeZone]);

    return times;
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

    useCursor(hovered);
    return (
        <animated.mesh
            position={[index * fontWidth, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() =>
                onHourChange &&
                onHourChange(
                    zonedTimeToUtc(
                        setHours(utcToZonedTime(new Date(), timeZone), hour),
                        timeZone
                    ).getHours()
                )
            }
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
    const times = useTimes(timeZone);
    const center = times.findIndex(
        (time) => time.getHours() === inputCurrentHour
    );
    const { position } = useSpring({
        config: config.default,
        position: [-(center * fontWidth), 0, 0],
    });

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
