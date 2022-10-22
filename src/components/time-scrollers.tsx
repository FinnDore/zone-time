import { setHours } from 'date-fns';
import { format as formatTz } from 'date-fns-tz';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { formatTimezone } from '../_functions/format-time-zone';
import { getUtc } from '../_functions/get-utc';
import { TimeScroller } from './time-scroller';

const TimeScrollers = ({
    times,
    setMasterTime,
}: {
    times: [Date, string][];
    setMasterTime: Dispatch<SetStateAction<Date | null>>;
}) => {
    const onHourChange = useCallback(
        (hour: number) => {
            setMasterTime((masterTime) =>
                setHours(masterTime ?? getUtc(), hour)
            );
        },
        [setMasterTime]
    );

    if (!times) {
        return null;
    }

    return (
        <>
            {times.map((time, index) => (
                <div key={index}>
                    <div className="my-1 relative">
                        <TimeScroller
                            timeZone={time[1]}
                            onHourChange={onHourChange}
                            inputCurrentHour={time[0].getHours()}
                        />
                        <div className="ml-4 mt-2 text-xs opacity-50 italic">
                            {formatTimezone(time[1])}{' '}
                            {formatTz(time[0], 'OOO', { timeZone: time[1] })}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TimeScrollers;
