import { useEffect, useRef } from 'react';

type FakeIntl = {
    supportedValuesOf: (t: string) => string[];
};

export const useTimeZones = () => {
    const timeZones = useRef<string[] | null>(null);

    useEffect(() => {
        timeZones.current = (Intl as unknown as FakeIntl).supportedValuesOf(
            'timeZone'
        );
    }, []);
    return timeZones.current;
};
