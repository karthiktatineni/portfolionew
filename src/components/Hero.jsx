import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import heroPortrait from '../assets/hero-portrait.png';
import TextReveal from './TextReveal';
import MagneticButton from './MagneticButton';

export default function Hero() {
    const ref = useRef(null);
    const { scrollY } = useScroll();

    const yText = useTransform(scrollY, [0, 500], [0, 150]);
    const opacityText = useTransform(scrollY, [0, 300], [1, 0.5]);

    return (
        <section ref={ref} id="hero" className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col justify-end pb-0">

            {/* Background Gradient / Noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            {/* Smooth Gradient Blend to Next Section - Fixes 'Page Break' */}
            <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none"></div>

            {/* FULL NAME TEXT BEHIND */}
            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-0 select-none pointer-events-none px-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center gap-0"
                >
                    <h1 className="text-[15vw] md:text-[10vw] leading-[0.9] font-bold font-display tracking-widest text-[#1a1a1a] stroke-text-gold opacity-80 uppercase">
                        TATINENI
                    </h1>
                    <div className="flex items-center justify-center w-full gap-[4vw] md:gap-[5vw]">
                        <h1 className="text-[20vw] md:text-[16vw] leading-[0.8] font-bold font-display tracking-tighter text-[#1a1a1a] stroke-text-gold opacity-100 uppercase">
                            KAR
                        </h1>
                        <h1 className="text-[20vw] md:text-[16vw] leading-[0.8] font-bold font-display tracking-tighter text-[#1a1a1a] stroke-text-gold opacity-100 uppercase translate-x-[2vw]">
                            THIK
                        </h1>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="relative z-10 w-full h-[85vh] flex items-end justify-center pointer-events-none translate-x-[2%] md:translate-x-[5%]"
            >
                {/* Glow behind image */}
                <div className="absolute bottom-0 w-[60%] h-[60%] bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

                <img
                    src={heroPortrait}
                    alt="Karthik Tatineni"
                    className="w-auto h-full max-w-[90vw] md:max-w-[50vw] object-contain drop-shadow-2xl mask-image-gradient"
                />
            </motion.div>

            {/* FOREGROUND CONTENT - CENTERED BUT GROUNDED */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-12 left-0 w-full z-20 flex flex-col items-center gap-8 pointer-events-none"
            >
                <div className="flex flex-col items-center gap-8 pointer-events-auto">
                    <div className="overflow-hidden bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-gold/30 shadow-lg">
                        <h2 className="text-sm md:text-xl font-light tracking-[0.3em] text-white uppercase flex gap-3 items-center">
                            <span>Student</span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <MagneticButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="group relative px-10 py-4 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors rounded-full overflow-hidden shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                            View Work
                        </MagneticButton>
                        <MagneticButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors text-xs tracking-widest uppercase border-b border-transparent hover:border-white pb-1">
                            Contact Me
                        </MagneticButton>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
