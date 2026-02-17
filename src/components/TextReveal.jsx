import { motion } from 'framer-motion';

export default function TextReveal({ children, className = "", delay = 0 }) {
    const text = typeof children === 'string' ? children : '';
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delay },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", gap: "0.25em" }} // Gap for spaces
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={className}
        >
            {words.map((word, index) => (
                <motion.span variants={child} key={index} className="whitespace-nowrap">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}
