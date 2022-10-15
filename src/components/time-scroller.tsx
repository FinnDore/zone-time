import { animated, useSpring } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { intlFormat, setHours } from 'date-fns';
import { FC, useEffect, useRef, useState } from 'react';

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
    centerIndex: number;
    time: Date;
    currentHour: number;
    onHourChange: ((hour: number) => unknown) | undefined;
    index: number;
}> = ({ time, currentHour, onHourChange, centerIndex, index }) => {
    const hour = time.getHours();
    const isCurrentHour = hour === currentHour;
    const { position } = useSpring({
        position: [(index - centerIndex) * fontWidth, 0, 0],
    });

    const myMesh = useRef();
    return (
        <animated.mesh position={position} ref={myMesh}>
            <Text
                color={'#fff'}
                onClick={() => onHourChange && onHourChange(hour)}
                fillOpacity={isCurrentHour ? 1 : 0.4}
                font="/IBMPlexMono-Regular.ttf"
                fontSize={isCurrentHour ? 9 : 7}
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
    return (
        <div className="w-full h-4">
            <Canvas className="w-full h-4 absolute">
                {times.map((x, i) => (
                    <Time
                        centerIndex={center}
                        index={i}
                        currentHour={inputCurrentHour}
                        time={x}
                        onHourChange={onHourChange}
                        key={x.getHours()}
                    />
                ))}
            </Canvas>
        </div>
    );
};

{
    /* <animated.div
                    style={springStyles}
                    className="absolute top-0 flex"
                >
                    {times.map((x) => (
                        <Time
                            key={x.getHours()}
                            time={x}
                            currentHour={inputCurrentHour}
                            onHourChange={onHourChange}
                        />
                    ))}
                </animated.div> */
}

export default TimeScroller;
