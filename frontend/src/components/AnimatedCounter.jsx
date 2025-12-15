import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter Component
 * Smooth number counting animation with customizable duration and formatting
 */
const AnimatedCounter = ({
    end,
    start = 0,
    duration = 2000,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    delay = 0,
    onComplete = () => { }
}) => {
    // Validate and sanitize inputs
    const validEnd = typeof end === 'number' && isFinite(end) ? end : 0;
    const validStart = typeof start === 'number' && isFinite(start) ? start : 0;

    const [count, setCount] = useState(validStart);
    const [isComplete, setIsComplete] = useState(false);
    const countRef = useRef(validStart);
    const frameRef = useRef(null);
    const startTimeRef = useRef(null);

    // Easing function for smooth animation
    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    useEffect(() => {
        const animate = (timestamp) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp + delay;
            }

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            if (progress < 1) {
                const easedProgress = easeOutExpo(progress);
                const currentCount = validStart + (validEnd - validStart) * easedProgress;
                countRef.current = currentCount;
                setCount(currentCount);
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setCount(validEnd);
                setIsComplete(true);
                onComplete();
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [validEnd, validStart, duration, delay, onComplete]);

    // Format number with separators
    const formatNumber = (num) => {
        // Handle invalid numbers
        if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
            return '0';
        }

        const fixedNum = num.toFixed(decimals);
        const parts = fixedNum.split('.');

        // Add thousand separators
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

        return parts.join('.');
    };

    return (
        <span className={`animated-counter ${isComplete ? 'complete' : 'animating'}`}>
            {prefix}{formatNumber(count)}{suffix}
        </span>
    );
};

export default AnimatedCounter;
