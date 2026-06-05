import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';

export default function MagneticButton({ children, className = '', onClick, as: Tag = 'button', ...props }) {
    const ref = useRef(null);
    const isTouch = useIsTouchDevice();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e) => {
        if (isTouch || !ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.3);
        y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const MotionTag = motion[Tag] ?? motion.button;

    return (
        <MotionTag
            ref={ref}
            className={className}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={isTouch ? undefined : { x: mouseX, y: mouseY }}
            {...props}
        >
            {children}
        </MotionTag>
    );
}
