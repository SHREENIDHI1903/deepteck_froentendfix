import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AsteaiBot } from "@/components/ui/AsteaiBot";

// Messages for each section ID
const sectionMessages: Record<string, string> = {
    hero: "Welcome to ASTEAI! I'm your DeepTech guide. 🤖",
    trust: "We're trusted by top research institutes worldwide. 🌍",
    domains: "From Quantum to BioTech, find any expert here! 🧬",
    features: "Hourly, Fixed, or Retainer - you choose! ⚖️",
    experts: "Verified PhDs and Engineers ready to help. 👨‍🔬",
    cta: "Ready to build the future? Let's go! 🚀",
};

export function ScrollCompanion() {
    const [activeSection, setActiveSection] = useState("hero");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a short delay
        const timer = setTimeout(() => setIsVisible(true), 1000);

        const handleScroll = () => {
            const sections = Object.keys(sectionMessages);

            // Find the section currently most visible in the viewport
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If the top of the section is within the top half of the screen
                    if (rect.top >= -300 && rect.top <= window.innerHeight / 2) {
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
                    className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none" // pointer-events-none to let clicks pass through, enable on bot if interactive needed
                >
                    {/* Speech Bubble */}
                    <motion.div
                        key={activeSection} // Re-animate when text changes
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        className="mb-4 mr-4 bg-white px-6 py-4 rounded-2xl rounded-tr-none shadow-xl border border-slate-100 max-w-[200px]"
                    >
                        <p className="text-sm font-medium text-slate-700 leading-snug">
                            {sectionMessages[activeSection] || sectionMessages.hero}
                        </p>
                        {/* Bubble Tail */}
                        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 border-b border-r border-slate-100" />
                    </motion.div>

                    {/* The Bot (Scaled Down) */}
                    <div className="w-24 h-24 pointer-events-auto cursor-pointer hover:scale-110 transition-transform relative">
                        {/* 
                Reusing the AsteaiBot visual but scaling it fit a small widget. 
                We might need a 'mini' version, but scaling the CSS/SVG works for now.
             */}
                        <div className="scale-[0.35] origin-bottom-right absolute bottom-0 right-0 w-80 h-80">
                            <AsteaiBot />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
