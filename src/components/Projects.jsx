import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, categories } from '../data/projects';
import TiltCard from './TiltCard';

export default function Projects() {
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedProject]);

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.category.includes(filter));

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 0.8
            }
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    // Helper to render media content
    const renderMedia = (src, isVideo) => {
        if (isVideo) {
            return (
                <video
                    src={src}
                    controls autoPlay loop
                    className="w-full h-auto object-contain rounded-sm shadow-xl"
                />
            );
        }
        return (
            <img
                src={src}
                alt="Project Media"
                className="w-full h-auto object-contain rounded-sm shadow-xl"
            />
        );
    };

    if (!projects) return <div className="text-white text-center py-20">Loading Projects...</div>;

    return (
        <section id="projects" className="py-32 border-t border-[#262626] relative z-20">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
                >
                    <div className="space-y-4">
                        <span className="text-gold font-display text-xs tracking-[0.3em] uppercase block">Showcase</span>
                        <h2 className="text-5xl md:text-6xl font-bold font-display text-white">
                            Featured <span className="text-gold">Works</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
                        {categories.map((cat, index) => (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + (index * 0.05) }}
                                onClick={() => setFilter(cat)}
                                className={`text-xs tracking-widest uppercase transition-colors duration-300 pb-1 relative ${filter === cat
                                    ? 'text-white border-b border-gold'
                                    : 'text-[#737373] hover:text-gold border-b border-transparent'
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* PROJECTS GRID */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 perspective-1000"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                >
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={cardVariants}
                                className="h-full"
                            >
                                <TiltCard className="h-full">
                                    <div
                                        onClick={() => setSelectedProject(project)}
                                        className="group cursor-pointer bg-[#141414] border border-[#262626] hover:border-gold/40 rounded-sm overflow-hidden flex flex-col shadow-2xl h-full transition-shadow duration-500 hover:shadow-[0_10px_40px_-10px_rgba(201,168,76,0.15)]"
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-black">
                                            <motion.div
                                                initial={{ scale: 1.1 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ duration: 1.2 }}
                                                className="w-full h-full"
                                            >
                                                {project.images?.[0] ? (
                                                    <img
                                                        src={project.images[0]}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                    />
                                                ) : project.videos?.[0] ? (
                                                    <video
                                                        src={project.videos[0]}
                                                        muted loop playsInline
                                                        onMouseOver={e => e.target.play().catch(() => { })}
                                                        onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#262626]">
                                                        <span className="text-[#525252] text-xs uppercase">No Preview</span>
                                                    </div>
                                                )}
                                            </motion.div>
                                            <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-[10px] text-gold font-bold uppercase tracking-wider backdrop-blur-sm border border-white/5">
                                                {project.category}
                                            </div>
                                        </div>

                                        <div className="p-5 flex-grow flex flex-col justify-between bg-[#141414] relative z-20">
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors line-clamp-1">
                                                    {project.title}
                                                </h3>
                                                <p className="text-[#a3a3a3] text-xs leading-relaxed line-clamp-2">
                                                    {project.shortDescription}
                                                </p>
                                            </div>
                                            <div className="mt-5 pt-3 border-t border-[#262626] flex justify-between items-center group-hover:border-gold/20 transition-colors">
                                                <span className="text-[10px] text-[#525252] uppercase tracking-wider group-hover:text-white transition-colors">Details</span>
                                                <span className="text-gold text-lg transform group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* MODAL - SHOWING ALL MEDIA */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
                            onClick={() => setSelectedProject(null)}
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#0a0a0a] border border-[#262626] w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative rounded-sm"
                            >
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-6 right-6 z-50 p-2 bg-black/80 hover:bg-gold text-white hover:text-black rounded-full transition-colors backdrop-blur-md border border-white/20"
                                >
                                    ✕
                                </button>

                                {/* SCROLLABLE MEDIA COLUMN - LEFT */}
                                <div className="w-full md:w-[60%] bg-black p-4 md:p-8 overflow-y-auto border-r border-[#262626] scrollbar-hide space-y-8" data-lenis-prevent="true">
                                    {/* Videos */}
                                    {selectedProject.videos?.map((video, idx) => (
                                        <div key={`vid-${idx}`} className="w-full">
                                            {renderMedia(video, true)}
                                        </div>
                                    ))}
                                    {/* Images */}
                                    {selectedProject.images?.map((img, idx) => (
                                        <div key={`img-${idx}`} className="w-full">
                                            {renderMedia(img, false)}
                                        </div>
                                    ))}

                                    {(!selectedProject.videos?.length && !selectedProject.images?.length) && (
                                        <div className="flex items-center justify-center h-full text-gray-500">No Media Available</div>
                                    )}
                                </div>

                                {/* CONTENT COLUMN - RIGHT */}
                                <div className="w-full md:w-[40%] p-8 overflow-y-auto bg-[#0a0a0a]" data-lenis-prevent="true">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="text-gold text-xs tracking-widest uppercase font-bold block mb-4 border-l-2 border-gold pl-3">
                                            {selectedProject.category}
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight font-display">
                                            {selectedProject.title}
                                        </h2>

                                        <div className="space-y-6 text-[#d4d4d4] text-sm leading-relaxed mb-8 font-light tracking-wide">
                                            {selectedProject.fullDescription?.map((desc, i) => (
                                                <p key={i}>{desc}</p>
                                            ))}
                                        </div>

                                        <div className="mb-8">
                                            <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-4 border-b border-[#262626] pb-2">Stack</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.technologies?.map(tech => (
                                                    <span key={tech} className="px-3 py-1 bg-[#171717] border border-[#262626] text-xs text-[#a3a3a3] rounded hover:border-gold/30 hover:text-gold transition-colors cursor-default">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedProject.githubUrl && (
                                            <a
                                                href={selectedProject.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gold transition-colors rounded-sm"
                                            >
                                                View Code on GitHub
                                            </a>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
