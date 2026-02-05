import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AsteaiBot } from "@/components/ui/AsteaiBot";

// Messages
const sectionMessages: Record<string, string> = {
    hero: "Welcome to ASTEAI! I'm your DeepTech guide. 🤖",
    domains: "From Quantum to BioTech, find any expert here! 🧬",
    experts: "Verified PhDs and Engineers ready to help. 👨‍🔬",
    features: "Hourly, Fixed, or Retainer - you choose! ⚖️",
    cta: "Ready to build the future? Let's go! 🚀",
};

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

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);

        const handleScroll = () => {
            const sections = Object.keys(sectionMessages);
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Detect center of screen
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
                    {/* Speech Bubble */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        className="mb-4 mr-10 bg-white px-5 py-3 rounded-2xl rounded-tr-none shadow-xl border border-slate-100 max-w-[220px]"
                    >
                        <p className="text-sm font-medium text-slate-700 leading-snug">
                            <TypewriterText text={sectionMessages[activeSection] || sectionMessages.hero} />
                        </p>
                        {/* Bubble Tail */}
                        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 border-b border-r border-slate-100" />
                    </motion.div>

                    {/* The Bot (Interactive) */}
                    <div className="w-24 h-24 pointer-events-auto cursor-pointer hover:scale-105 transition-transform relative">
                        <div className="scale-[0.35] origin-bottom-right absolute bottom-0 right-0 w-80 h-80">
                            <AsteaiBot />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
