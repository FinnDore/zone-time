import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

// eslint-disable-next-line react/display-name
export const Skeleton = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
    (props, forwardedRef) => (
        <div
            {...props}
            className={clsx(
                'animate-pulse bg-[#1e2022] rounded-sm',
                props.className
            )}
            ref={forwardedRef}
        ></div>
    )
);
