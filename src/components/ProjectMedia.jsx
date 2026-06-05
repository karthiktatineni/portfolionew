import { useState, useRef, useEffect } from 'react';

function MediaFallback({ type }) {
    return (
        <div className="w-full aspect-video flex items-center justify-center bg-[#171717] border border-[#262626] rounded-sm">
            <span className="text-[#525252] text-xs uppercase tracking-wider">
                {type === 'video' ? 'Video unavailable' : 'Image unavailable'}
            </span>
        </div>
    );
}

export function ProjectImage({ src, alt = 'Project Media', className = '' }) {
    const [failed, setFailed] = useState(false);

    if (failed) return <MediaFallback type="image" />;

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className={className}
        />
    );
}

export function ProjectVideo({
    src,
    className = '',
    autoPlayInView = false,
    controls = true,
    muted = true,
    loop = true,
}) {
    const [failed, setFailed] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!autoPlayInView) return;
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            },
            { threshold: 0.4 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, [autoPlayInView]);

    if (failed) return <MediaFallback type="video" />;

    return (
        <video
            ref={videoRef}
            src={src}
            controls={controls}
            autoPlay={!autoPlayInView}
            loop={loop}
            muted={muted}
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            className={className}
        />
    );
}
