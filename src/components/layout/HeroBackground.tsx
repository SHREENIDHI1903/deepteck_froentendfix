import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile/touch
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e: MouseEvent) => {
            if (isMobile) return;
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        if (!isMobile) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    return (
        <div className="absolute inset-0 overflow-hidden -z-10 bg-slate-50/50">
            {/* 
        1. Animated Gradient Orbs 
        These move slowly and morph to create a "living" background feel.
            {/* 
        1. Animated Gradient Orbs 
        These move slowly and morph to create a "living" background feel.
        Optimized for mobile: Active movement but with reduced blur (40px vs 100px) and NO scale changes.
      */}
            <motion.div
                animate={isMobile ? {
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0], // Reduced movement range
                    y: [0, -30, 0],
                } : {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full ${isMobile ? 'blur-[40px] opacity-40' : 'blur-[100px]'}`}
            />
            <motion.div
                animate={isMobile ? {
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, -50, 0],
                    y: [0, 30, 0],
                } : {
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                className={`absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/30 rounded-full ${isMobile ? 'blur-[40px] opacity-40' : 'blur-[100px]'}`}
            />
            <motion.div
                animate={isMobile ? {
                    x: [0, 30, 0],
                    y: [0, 50, 0],
                } : {
                    scale: [1, 1.3, 1],
                    x: [0, 50, 0],
                    y: [0, 100, 0],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 5 }}
                className={`absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-indigo-300/20 rounded-full ${isMobile ? 'blur-[50px] opacity-30' : 'blur-[120px]'}`}
            />

            {/* 
        2. Mouse-Interactive Spotlight
        Disabled on mobile to prevent paint flashing.
      */}
            {!isMobile && (
                <motion.div
                    className="absolute w-[800px] h-[800px] bg-white/40 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"
                    animate={{
                        x: mousePosition.x - 400,
                        y: mousePosition.y - 400,
                    }}
                    transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
                />
            )}

            {/* 
        3. Tech Grid Overlay 
        Adds texture and structure.
      */}
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
}
