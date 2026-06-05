import { useState, useEffect } from 'react';

export function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(hover: none), (pointer: coarse)');
        const update = () => setIsTouch(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    return isTouch;
}
