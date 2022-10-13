import { ImageResponse } from '@vercel/og';
import clsx from 'clsx';

import { NextApiHandler } from 'next';

const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

type FakeIntl = {
    supportedValuesOf: (t: string) => string[];
};
function getRandom<T>(list: T[]): T {
    return list[random(0, list.length - 1)] as T;
}

const zones = (Intl as unknown as FakeIntl).supportedValuesOf('timeZone');
const handler: NextApiHandler = () => {
    const date = new Date();
    const timeFormat = date.toLocaleTimeString('utc', {
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'shortGeneric',
        timeZone: getRandom(zones),
    });

    const isMorning = date.getHours() < 12;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    background: '#000',
                }}
            >
                <div tw="w-[100%] h-[100%] flex text-center">
                    <div
                        tw={clsx('m-auto items-center  text-4xl', {
                            'text-orange-800': isMorning,
                            'text-blue-800': !isMorning,
                        })}
                    >
                        {timeFormat}
                    </div>
                </div>
            </div>
        )
    );
};

export default handler;

export const config = {
    runtime: 'experimental-edge',
};
