import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AsteaiBot() {
    const ref = useRef<HTMLDivElement>(null);
    const [isBlinking, setIsBlinking] = useState(false);

    // Mouse position values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ultra-snappy springs for "hyperactive" eye movement
    const eyeX = useSpring(mouseX, { stiffness: 500, damping: 25, mass: 0.5 });
    const eyeY = useSpring(mouseY, { stiffness: 500, damping: 25, mass: 0.5 });

    // Body rotation based on mouse
    const rotateX = useTransform(eyeY, [-20, 20], [10, -10]);
    const rotateY = useTransform(eyeX, [-20, 20], [-15, 15]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const limit = 18; // Increased range slightly
            // Much higher sensitivity (dividing by 8 instead of 20)
            const x = Math.min(Math.max((e.clientX - centerX) / 8, -limit), limit);
            const y = Math.min(Math.max((e.clientY - centerY) / 8, -limit), limit);

            mouseX.set(x);
            mouseY.set(y);
        };

        // Random blinking interval
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, 4000);

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            clearInterval(blinkInterval);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="relative w-80 h-80 flex items-center justify-center p-10" ref={ref}>
            <motion.div
                drag
                dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                dragElastic={0.1}
                animate={{ y: [-10, 10, -10] }}
                transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-48 h-40 bg-gradient-to-b from-white to-slate-50 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] border-4 border-white flex flex-col items-center justify-center z-10 cursor-grab active:cursor-grabbing"
            >
                {/* Antenna */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-8 bg-slate-300 -z-10 rounded-full" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                />

                {/* Face Screen */}
                <div className="w-36 h-24 bg-slate-900 rounded-2xl flex items-center justify-center gap-4 relative overflow-hidden ring-4 ring-slate-100 shadow-inner">
                    {/* Screen Grid/Reflections */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />

                    {/* Eyes Container */}
                    <motion.div
                        style={{ x: eyeX, y: eyeY }}
                        className="flex gap-4"
                    >
                        {/* LEFT EYE */}
                        <motion.div
                            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                            transition={{ duration: 0.1 }}
                            className="w-3 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        />
                        {/* RIGHT EYE */}
                        <motion.div
                            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                            transition={{ duration: 0.1 }}
                            className="w-3 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        />
                    </motion.div>

                    {/* Mouth */}
                    <div className="absolute bottom-5 w-4 h-1 bg-slate-700/50 rounded-full" />
                </div>
            </motion.div>

            {/* Hands */}
            <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute left-4 top-1/2 w-8 h-8 bg-white rounded-full border-2 border-slate-100 shadow-lg"
            />
            <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute right-4 top-1/2 w-8 h-8 bg-white rounded-full border-2 border-slate-100 shadow-lg"
            />

            {/* Shadow */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-10 w-32 h-4 bg-black/10 blur-md rounded-full -z-10"
            />
        </div>
    );
}
