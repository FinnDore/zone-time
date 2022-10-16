import { animated, config, useSpring } from '@react-spring/three';
import { Text, useCursor } from '@react-three/drei';
import { Canvas, Vector3 } from '@react-three/fiber';
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

const fontWidth = 35;
const Time: FC<{
    time: Date;
    currentHour: number;
    onHourChange: ((hour: number) => unknown) | undefined;
    index: number;
}> = ({ time, currentHour, onHourChange, index }) => {
    const [hovered, setHovered] = useState(false);

    const hour = time.getHours();
    const utcHours = time.getUTCHours();
    const isCurrentHour = hour === currentHour;

    useCursor(hovered);
    return (
        <animated.mesh
            position={[index * fontWidth, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => onHourChange && onHourChange(utcHours)}
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
    onHourChange?: (hour: number) => unknown;
}> = ({ inputCurrentHour, onHourChange }) => {
    const times = useTimes();
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
