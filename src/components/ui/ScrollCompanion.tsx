import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AsteaiBot } from "@/components/ui/AsteaiBot";



// Typewriter Effect Component
function TypewriterText({ text }: { text: string }) {
    const [displayedLength, setDisplayedLength] = useState(0);

    useEffect(() => {
        setDisplayedLength(0);
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedLength((prev) => prev + 1);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30); // Speed of typing

        return () => clearInterval(timer);
    }, [text]);

    return <span>{text.slice(0, displayedLength)}</span>;
}

export function ScrollCompanion() {
    const [activeSection, setActiveSection] = useState("hero");
    const [isVisible, setIsVisible] = useState(false);

    // Context-Aware Content Guide
    const sectionMessages: Record<string, string> = {
        hero: "ASTEAI is the World's First Vernacular DeepTech Marketplace, connecting achievements, skills, and talent with AI.",
        "serious-engineering": "Built for serious engineering. We ensure verified expertise and IP protection for every project.",
        domains: "Explore specialized talent across emerging technology sectors, from AI to Quantum Computing.",
        experts: "Work with highest-rated experts, vetted for their domain expertise and proven track record.",
        features: "Choose the engagement model that fits your needs: Hourly, Fixed Price, Sprint, or Retainer.",
        cta: "Start building with confidence. Secure your intellectual property from day one.",
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
                            ASTEAI Guide
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
