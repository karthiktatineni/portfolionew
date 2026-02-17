import { motion } from 'framer-motion';
import { skillCategories } from '../data/skills';

export default function Skills() {
    return (
        <section id="skills" className="py-24 bg-[#0a0a0a] border-t border-[#262626]">
            <div className="container mx-auto px-6">

                <div className="mb-16 max-w-2xl">
                    <span className="text-gold font-display text-xs tracking-[0.2em] uppercase block mb-4">02. Expertise</span>
                    {/* Reverted HEADLINE Styling */}
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
                        Technical <span className="text-gold">Arsenal</span>
                    </h2>
                    <p className="text-[#a3a3a3] font-light">
                        Comprehensive toolkit spanning embedded systems, software development, and electronics engineering.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-8 bg-[#171717] border border-[#262626] hover:border-gold/30 transition-colors group rounded-sm"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-gold text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </span>
                                <h3 className="text-xl font-bold text-white font-display">
                                    {category.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 text-xs font-medium text-[#d4d4d4] bg-[#262626] border border-transparent group-hover:border-[#404040] transition-colors cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
