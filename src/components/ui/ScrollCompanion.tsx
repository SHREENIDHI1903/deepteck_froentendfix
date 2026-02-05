import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AsteaiBot } from "@/components/ui/AsteaiBot";



// Typewriter Effect Component
function TypewriterText({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30); // Speed of typing

        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
}

export function ScrollCompanion() {
    const [activeSection, setActiveSection] = useState("hero");
    const [isVisible, setIsVisible] = useState(false);

    // Simplified Messages - Direct & Helpful
    const sectionMessages: Record<string, string> = {
        hero: "Hi! I'm Asteai. Scroll down to see the magic! 👇",
        "serious-engineering": "We verify every expert. Your IP is safe with us! �",
        domains: "👉 HOVER over these cards! They have a 3D Tilt effect! 🧊",
        experts: "Verified PhDs and Engineers ready to help. 👨‍🔬",
        features: "Hourly or Fixed? Pick the model that fits your budget. ⚖️",
        cta: "Don't wait! Let's build something amazing together. 🚀",
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);

        const handleScroll = () => {
            const sections = Object.keys(sectionMessages);
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Detect if section is in middle of viewport
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        setActiveSection(section);
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timer);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none"
                >
                    {/* Speech Bubble - Always Visible Context */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        className="mb-4 mr-10 bg-white px-5 py-3 rounded-2xl rounded-tr-none shadow-xl border border-slate-100 max-w-[240px]"
                    >
                        <p className="text-sm font-bold text-indigo-600 mb-1 uppercase tracking-wider text-[10px]">
                            Asteai Guide
                        </p>
                        <p className="text-sm font-medium text-slate-700 leading-snug">
                            <TypewriterText text={sectionMessages[activeSection] || sectionMessages.hero} />
                        </p>
                        {/* Bubble Tail */}
                        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 border-b border-r border-slate-100" />
                    </motion.div>

                    {/* The Bot - No Click Interaction Needed */}
                    <div className="w-32 h-32 pointer-events-auto hover:scale-105 transition-transform relative">
                        <div className="scale-[0.45] origin-bottom-right absolute bottom-0 right-0 w-80 h-80">
                            <AsteaiBot />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
