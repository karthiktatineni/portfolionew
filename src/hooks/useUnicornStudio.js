import { useEffect } from 'react';

export function useUnicornStudio({ projectId, elementId }) {
    useEffect(() => {
        // Safety check: if element doesn't exist, abort
        const element = document.getElementById(elementId);
        if (!element) return;

        // Load script dynamically if not present
        if (!window.UnicornStudio) {
            const script = document.createElement('script');
            script.src = "https://cdn.unicorn.studio/v1.2.1/unicornStudio.umd.js"; // Verify version
            script.onload = () => {
                initUnicorn();
            };
            script.onerror = () => {
                console.warn("Failed to load Unicorn Studio script");
            };
            document.body.appendChild(script);
        } else {
            initUnicorn();
        }

        function initUnicorn() {
            if (window.UnicornStudio && window.UnicornStudio.init) {
                try {
                    window.UnicornStudio.init({
                        projectId,
                        elementId,
                        lazyLoad: true,
                        // Add other options if needed
                    }).then(() => {
                        console.log("Unicorn Studio initialized");
                    }).catch(err => {
                        console.error("Unicorn Studio init error:", err);
                    });
                } catch (e) {
                    console.error("Unicorn Studio crash:", e);
                }
            }
        }

        // Cleanup not always possible with this lib, but good practice to try
        return () => {
            if (window.UnicornStudio && window.UnicornStudio.destroy) {
                // window.UnicornStudio.destroy(elementId); // Hypothetical API
            }
        };
    }, [projectId, elementId]);
}
