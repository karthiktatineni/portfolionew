import { useState, useEffect } from 'react';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#hero' },
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Media', href: '#media' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/5' : 'py-8 bg-transparent'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <a href="#hero" className="text-2xl font-bold tracking-tighter text-white group">
                        <span className="text-gold">K</span><span className="group-hover:text-gold transition-colors duration-300">ARTHIK</span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm uppercase tracking-widest text-gray-400 hover:text-gold transition-colors duration-300 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className={`w-8 h-0.5 bg-gold mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                        <div className={`w-8 h-0.5 bg-gold mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                        <div className={`w-8 h-0.5 bg-gold transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-black/95 z-40 flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-3xl font-display font-light text-white hover:text-gold transition-colors duration-300"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
