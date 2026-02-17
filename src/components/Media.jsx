import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useAnimations';

export default function Media() {
    const [ref, isVisible] = useScrollReveal(0.1);

    const mediaItems = [
        { type: 'video', src: '/videos/iaremun.mp4', alt: 'IARE MUN' },
        { type: 'video', src: '/videos/klvora.mp4', alt: 'Klvora Fashion' },
        { type: 'video', src: '/videos/helmet.mp4', alt: 'Helmet Detection' },
        { type: 'image', src: '/videos/server1.jpeg', alt: 'Home Server' },
        { type: 'image', src: '/videos/bot.png', alt: 'AI Bot' },
        { type: 'video', src: '/videos/mochi.mp4', alt: 'Desk Mochi' },
    ];

    return (
        <section id="media" className="py-24 overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />

            <div className="container mx-auto px-6" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <span className="text-gold font-display tracking-[0.2em] text-sm uppercase block mb-4">04. Gallery</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-white">
                        Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-white">Stories</span>
                    </h2>
                </motion.div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {mediaItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800"
                        >
                            {item.type === 'video' ? (
                                <video
                                    src={item.src}
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform duration-700"
                                />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <span className="text-gold font-display tracking-widest text-sm uppercase">
                                    {item.alt}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
