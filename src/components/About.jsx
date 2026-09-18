import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useAnimations';

export default function About() {
    const [ref, isVisible] = useScrollReveal(0.2);

    const stats = [
        { label: 'Deployed Apps', value: '10+' },
        { label: 'ML & Tech Stack', value: '30+' },
        { label: 'Users Scaled', value: '1.5k+' },
        { label: 'Publications', value: '1 (Scopus)' },
    ];

    return (
        <section id="about" className="py-32 relative text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-900/20 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24"
                >
                    <span className="text-gold font-display tracking-[0.2em] text-sm uppercase block mb-2">01. Introduction</span>
                    <h2 className="text-4xl md:text-6xl font-bold font-display">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Me</span>
                    </h2>
                    <div className="w-24 h-1 bg-gold mt-6 rounded-full" />
                </motion.div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left Column - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6 text-lg text-gray-300 leading-relaxed font-light"
                    >
                        <p>
                            I'm <strong className="text-white font-medium">Karthik Tatineni</strong>, an Independent Software & AI Developer and Electronics & Communication Engineering student at IARE, Hyderabad. I specialize in engineering end-to-end Machine Learning pipelines, Generative AI & agentic platforms, and high-performance full-stack web applications.
                        </p>
                        <p>
                            My technical work centers on production ML systems and intelligent architectures: from causal feature engineering, entity graphs, and Optuna-tuned XGBoost risk scoring engines operating in sub-15ms, to local-first Generative AI assistants powered by open-source LLMs (Mistral, Qwen) with RAG and vector storage (ChromaDB, pgvector). I also build real-time computer vision pipelines with YOLO and CNNs for multi-class object detection.
                        </p>
                        <p>
                            With a solid foundation in modern web frameworks (FastAPI, Next.js) and cloud infrastructure (AWS, Azure, Docker, Redis), I bridge the gap between advanced predictive models and robust, user-facing production software.
                        </p>
                        <p className="border-l-4 border-gold pl-4 italic text-gold/80">
                            "I aim to architect scalable machine learning systems and intelligent platforms that transform complex data into reliable, real-time decisions."
                        </p>
                    </motion.div>

                    {/* Right Column - Stats & Image/Card */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="grid grid-cols-2 gap-6"
                        >
                            {stats.map((stat, index) => (
                                <div key={index} className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-gold/30 transition-colors group">
                                    <h3 className="text-3xl md:text-4xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform origin-left">
                                        {stat.value}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isVisible ? { opacity: 1 } : {}}
                            transition={{ delay: 0.6 }}
                            className="flex justify-end"
                        >
                            <a href="#contact" className="inline-flex items-center gap-3 text-gold hover:text-white transition-colors group">
                                <span className="text-lg font-medium"></span>
                                <span className="w-12 h-[1px] bg-gold group-hover:w-20 transition-all duration-300"></span>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
