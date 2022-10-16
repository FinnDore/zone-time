import { animated, config, useSpring } from '@react-spring/three';
import { Text, useCursor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { intlFormat, setHours } from 'date-fns';
import { clamp } from 'lodash-es';
import {} from 'process';
import { FC, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';

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
    const isCurrentHour = hour === currentHour;

    // onClick={() => onHourChange && onHourChange(hour + 1)}
    useCursor(hovered);
    return (
        <animated.mesh
            position={[index * fontWidth, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
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

const useDragThing = (index: number) => {
    const dragObjectRef = useRef<typeof animated.mesh>();

    const [{ position }, api] = useSpring(() => ({
        position: [-(index * fontWidth), 0, 0] as const,
        config: { ...config.gentle, friction: 5, bounce: 0 },
    }));

    const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {
            console.log(x, y);

            const newX = clamp(
                x < 0 ? position.get()[0] - 15 : position.get()[0] + 15,
                -(fontWidth * 23),
                0
            );
            api.start({
                // position: active ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
                position: [newX, 0, 0],
            });
            return timeStamp;
        },
        { delay: true, axis: 'x' }
    );
    return { dragObjectRef, bind, position };
};

export const TimeScroller: FC<{
    inputCurrentHour: number;
    onHourChange?: (hour: number) => unknown;
}> = ({ inputCurrentHour, onHourChange }) => {
    const times = useTimes();
    const center = times.findIndex(
        (time) => time.getHours() === inputCurrentHour
    );

    const { position, bind, dragObjectRef } = useDragThing(center);

    return (
        <animated.mesh
            position={position as unknown as Vector3}
            ref={dragObjectRef}
            {...bind()}
        >
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
    );
};

const A = (props: any) => (
    <div className="w-full h-4">
        <Canvas className="w-full h-4 absolute">
            <TimeScroller {...props} />
        </Canvas>
    </div>
);
export default A;

// const { position } = useSpring({
//     config: config.default,
//     position: [-(center * fontWidth), 0, 0],
// });
