// src/components/CountUp.jsx

import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

export default function CountUp({
    to,
    from = 0,
    direction = 'up',
    delay = 0,
    duration = 4,
    className = '',
    startWhen = true,
    separator = '',
    onStart,
    onEnd
}) {
    const ref = useRef(null);
    const motionValue = useMotionValue(direction === 'down' ? to : from);

    const damping = 20 + 40 * (1 / duration);
    const stiffness = 100 * (1 / duration);

    const springValue = useSpring(motionValue, {
        damping,
        stiffness
    });

    // The component should always be considered "in view" since it's a pre-loader
    // We can bypass the `useInView` check or ensure `startWhen` is always true if needed.
    const isInView = useInView(ref, { once: true, margin: '0px' });
    // NOTE: For pre-loaders, `useInView` isn't strictly necessary, but we'll keep it for code fidelity.

    const getDecimalPlaces = num => {
        const str = num.toString();

        if (str.includes('.')) {
            const decimals = str.split('.')[1];

            if (parseInt(decimals) !== 0) {
                return decimals.length;
            }
        }

        return 0;
    };

    const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

    const formatValue = useCallback(
        latest => {
            const hasDecimals = maxDecimals > 0;

            const options = {
                useGrouping: !!separator,
                minimumFractionDigits: hasDecimals ? maxDecimals : 0,
                maximumFractionDigits: hasDecimals ? maxDecimals : 0
            };

            const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);

            return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
        },
        [maxDecimals, separator]
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = formatValue(direction === 'down' ? to : from);
        }
    }, [from, to, direction, formatValue]);

    useEffect(() => {
        if (isInView && startWhen) {
            if (typeof onStart === 'function') onStart();

            const timeoutId = setTimeout(() => {
                motionValue.set(direction === 'down' ? from : to);
            }, delay * 1000);

            const durationTimeoutId = setTimeout(
                () => {
                    if (typeof onEnd === 'function') onEnd();
                },
                delay * 1000 + duration * 1000
            );

            return () => {
                clearTimeout(timeoutId);
                clearTimeout(durationTimeoutId);
            };
        }
    }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', latest => {
            if (ref.current) {
                ref.current.textContent = formatValue(latest);
            }
        });

        return () => unsubscribe();
    }, [springValue, formatValue]);

    // --- UI MODIFICATION START ---

    // Combine user-provided className with default styles for boldness and size
    const numberClasses = `text-7xl md:text-8xl font-extrabold white ${className}`;

    return (
        // Wrapper div for full-screen centering and black background
        <div className="fixed inset-0 flex items-center justify-center h-screen w-screen z-[1000] bg-black">
            <span
                className={numberClasses}
                ref={ref}
            />
        </div>
    );
    // --- UI MODIFICATION END ---
}