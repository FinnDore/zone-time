import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';
import { useTimeZones } from '../hooks/time-zones';
import { commandScore } from '../_functions/command-score';

export const TimeInput = ({
    defaultVal,
    onChange,
}: {
    defaultVal?: string;
    onChange: (zone: string) => unknown;
}) => {
    const { prettyZones, prettyZoneMap } = useTimeZones();
    const [selectedZone, setSelectedZone] = useState(defaultVal ?? null);
    const [query, setQuery] = useState('');
    const scores: Record<string, number> = {};

    prettyZones?.forEach(
        (timeZone) => (scores[timeZone] = commandScore(timeZone, query))
    );
    const filteredZones =
        query === ''
            ? prettyZones ?? []
            : prettyZones
                  ?.filter((x) => !!scores[x])
                  .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)) ?? [];

    return (
        <form
            className="relative w-min"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
        >
            <Combobox
                value={selectedZone}
                onChange={(zone) => {
                    if (!zone) {
                        return;
                    }
                    const newZone = prettyZoneMap[zone];
                    if (newZone) {
                        setSelectedZone(zone);
                        onChange(newZone);
                    }
                }}
            >
                <Combobox.Input
                    className="bg-transparent text-center text-3xl"
                    onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Options className="max-h-32 overflow-y-auto bg-black border-[#C9C9C9]/30 border z-50 w-full">
                    {filteredZones.map((zone) => (
                        <Combobox.Option key={zone} value={zone}>
                            {({ active }) => (
                                <div
                                    className={clsx({
                                        'bg-white/30': active,
                                    })}
                                >
                                    {zone}
                                </div>
                            )}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox>
        </form>
    );
};
