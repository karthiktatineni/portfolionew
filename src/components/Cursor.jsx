import { useRef, useEffect } from 'react';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';

export default function Cursor() {
    const isTouch = useIsTouchDevice();
    const cursorRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        if (isTouch) return;
        const cursor = cursorRef.current;
        const ring = ringRef.current;
        if (!cursor || !ring) return;

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instant update for dot
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        };

        const loop = () => {
            // Smooth lerp for ring
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', onMouseMove);
        requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [isTouch]);

    if (isTouch) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
            <div
                ref={ringRef}
                className="fixed top-0 left-0 w-8 h-8 border border-gold/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
        </>
    );
}
