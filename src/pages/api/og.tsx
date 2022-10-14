import { ImageResponse } from '@vercel/og';

import { NextApiHandler } from 'next';

const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

type FakeIntl = {
    supportedValuesOf: (t: string) => string[];
};
function getRandom<T>(list: T[]): T {
    return list[random(0, list.length - 1)] as T;
}
const font = fetch(new URL('./IBMPlexMono-Regular.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer()
);

const zones = (Intl as unknown as FakeIntl).supportedValuesOf('timeZone');
const handler: NextApiHandler = async () => {
    const fontData = await font;
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
                    fontFamily: 'ibm-flex-mono',
                    background: '#1e2022',
                }}
            >
                <div tw="shadow-inner m-auto w-[80%] h-[400px] border bg-[#000]/60 border-[#C9C9C9]/30 rounded-3xl shadow-2xl flex flex-col justify-center">
                    <div tw="m-auto items-center  text-4xl text-white text-center">
                        {timeFormat}
                    </div>
                </div>
            </div>
        ),
        {
            fonts: [
                {
                    name: 'imb-plex-mono',
                    data: fontData,
                    style: 'normal',
                },
            ],
        }
    );
};

export default handler;

export const config = {
    runtime: 'experimental-edge',
};
