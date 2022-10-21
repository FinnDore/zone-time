import { capitalize } from 'lodash-es';
import { useEffect, useRef } from 'react';

type FakeIntl = {
    supportedValuesOf: (t: string) => string[];
};

export const useTimeZones = () => {
    const timeZones = useRef<string[] | null>(null);
    const prettyZoneMap = useRef<Record<string, string>>({});
    const prettyZones = useRef<string[] | null>(null);
    useEffect(() => {
        timeZones.current = (Intl as unknown as FakeIntl).supportedValuesOf(
            'timeZone'
        );

        const prettyZonesTOset = [];
        for (const zone of timeZones.current) {
            const prettyZone = capitalize(
                zone.replace(/_/g, ' ').split('/').pop() ?? ''
            );

            prettyZoneMap.current[prettyZone] = zone;
            prettyZonesTOset.push(prettyZone);
        }

        prettyZones.current = prettyZonesTOset.sort();
    }, []);

    return {
        timeZones: timeZones.current,
        prettyZones: prettyZones.current,
        prettyZoneMap: prettyZoneMap.current,
    };
};
