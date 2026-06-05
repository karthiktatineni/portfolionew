import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, categories } from '../data/projects';
import TiltCard from './TiltCard';
import { ProjectImage, ProjectVideo } from './ProjectMedia';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';

export default function Projects() {
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const isTouch = useIsTouchDevice();

    const closeProject = () => setSelectedProject(null);

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

    useEffect(() => {
        if (!selectedProject) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeProject();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
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

    const renderMedia = (src, isVideo, inModal = false) => {
        const modalClass = 'w-full max-h-[45vh] sm:max-h-[55vh] md:max-h-[70vh] object-contain rounded-sm shadow-2xl bg-black/10 mx-auto block';
        const gridClass = 'w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700';

        if (isVideo) {
            return (
                <ProjectVideo
                    src={src}
                    controls={inModal}
                    autoPlayInView={!inModal && isTouch}
                    muted
                    loop
                    className={inModal ? modalClass : gridClass}
                />
            );
        }
        return (
            <ProjectImage
                src={src}
                alt="Project Media"
                className={inModal ? 'w-full h-auto max-h-[45vh] sm:max-h-[55vh] md:max-h-[70vh] object-contain rounded-sm shadow-xl' : gridClass}
            />
        );
    };

    if (!projects) return <div className="text-white text-center py-20">Loading Projects...</div>;

    return (
        <section id="projects" className="py-20 md:py-32 border-t border-[#262626] relative z-20 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center text-center mb-12 md:mb-16 gap-6 md:gap-8"
                >
                    <div className="space-y-3 md:space-y-4">
                        <span className="text-gold font-display text-xs tracking-[0.3em] uppercase block">03. Showcase</span>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-white">
                            Featured <span className="text-gold">Works</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 max-w-3xl mx-auto">
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center sm:justify-items-stretch perspective-1000 w-full"
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
                                className="h-full w-full max-w-[360px] sm:max-w-none"
                            >
                                <TiltCard className="h-full w-full" disableTilt={isTouch}>
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
                                                    renderMedia(project.images[0], false)
                                                ) : project.videos?.[0] ? (
                                                    <div
                                                        className="w-full h-full"
                                                        onMouseOver={e => !isTouch && e.currentTarget.querySelector('video')?.play().catch(() => {})}
                                                        onMouseOut={e => {
                                                            if (isTouch) return;
                                                            const vid = e.currentTarget.querySelector('video');
                                                            if (vid) { vid.pause(); vid.currentTime = 0; }
                                                        }}
                                                    >
                                                        {renderMedia(project.videos[0], true)}
                                                    </div>
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
                            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg flex items-end sm:items-center justify-center p-0 sm:p-4"
                            onClick={closeProject}
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#0a0a0a] border-0 sm:border border-[#262626] w-full sm:max-w-7xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative sm:rounded-sm"
                            >
                                {/* Mobile sticky header with close */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#0a0a0a] shrink-0 sticky top-0 z-40">
                                    <button
                                        onClick={closeProject}
                                        className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-xs uppercase tracking-widest font-bold"
                                        aria-label="Back to projects"
                                    >
                                        <span className="text-base leading-none">←</span>
                                        <span className="hidden sm:inline">Back</span>
                                    </button>
                                    <span className="text-gold text-xs tracking-widest uppercase font-bold">Project Details</span>
                                    <button
                                        onClick={closeProject}
                                        className="p-2 bg-black/80 hover:bg-gold text-white hover:text-black rounded-full transition-colors border border-white/20"
                                        aria-label="Close project details"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* SCROLLABLE MEDIA COLUMN - LEFT */}
                                <div className="w-full md:w-[60%] bg-black p-3 sm:p-4 md:p-8 overflow-y-auto md:border-r border-[#262626] scrollbar-hide space-y-4 sm:space-y-8 shrink-0 md:shrink md:max-h-none max-h-[42vh] sm:max-h-[45vh] md:max-h-none" data-lenis-prevent="true">
                                    {selectedProject.videos?.map((video, idx) => (
                                        <div key={`vid-${idx}`} className="w-full flex justify-center">
                                            {renderMedia(video, true, true)}
                                        </div>
                                    ))}
                                    {selectedProject.images?.map((img, idx) => (
                                        <div key={`img-${idx}`} className="w-full flex justify-center">
                                            {renderMedia(img, false, true)}
                                        </div>
                                    ))}

                                    {(!selectedProject.videos?.length && !selectedProject.images?.length) && (
                                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">No Media Available</div>
                                    )}
                                </div>

                                {/* CONTENT COLUMN - RIGHT */}
                                <div className="w-full md:w-[40%] p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto bg-[#0a0a0a] flex-1 min-h-0" data-lenis-prevent="true">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="text-gold text-xs tracking-widest uppercase font-bold block mb-4 border-l-2 border-gold pl-3">
                                            {selectedProject.category}
                                        </span>
                                        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-snug font-display pr-2">
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

                                        <div className="flex flex-col gap-3">
                                            {selectedProject.githubUrl && (
                                                <a
                                                    href={selectedProject.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full text-center py-4 bg-[#171717] border border-[#262626] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-sm"
                                                >
                                                    View Code on GitHub
                                                </a>
                                            )}
                                            {selectedProject.websiteUrl && (
                                                <a
                                                    href={selectedProject.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full text-center py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gold transition-colors rounded-sm"
                                                >
                                                    Visit Live Website
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Static escape bar — always visible */}
                                <div
                                    className="absolute inset-x-0 bottom-0 z-50 px-4 pt-3 bg-[#0a0a0a] border-t border-[#262626]"
                                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                                >
                                    <button
                                        onClick={closeProject}
                                        className="w-full py-3.5 bg-[#171717] border border-[#262626] text-white font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold transition-all rounded-sm flex items-center justify-center gap-2"
                                    >
                                        <span>←</span>
                                        <span>Back to Projects</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
