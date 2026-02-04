import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

export function AsteaiBot() {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for eye movement
    const eyeX = useSpring(mouseX, { stiffness: 150, damping: 15 });
    const eyeY = useSpring(mouseY, { stiffness: 150, damping: 15 });

    // Body rotation based on mouse (looks left/right)
    const rotateX = useTransform(eyeY, [-20, 20], [5, -5]);
    const rotateY = useTransform(eyeX, [-20, 20], [-10, 10]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate mouse position relative to the bot center
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Limit movement range for eyes
            const limit = 15;
            const x = Math.min(Math.max((e.clientX - centerX) / 20, -limit), limit);
            const y = Math.min(Math.max((e.clientY - centerY) / 20, -limit), limit);

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative w-80 h-80 flex items-center justify-center p-10" ref={ref}>
            {/* 
         ========================
         BOT BODY LAYER
         ========================
      */}
            <motion.div
                drag
                dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                dragElastic={0.1}
                animate={{
                    y: [-10, 10, -10],
                }}
                transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-48 h-40 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] border-4 border-slate-50 flex flex-col items-center justify-center z-10 cursor-grab active:cursor-grabbing"
            >
                {/* Antenna */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-8 bg-slate-300 -z-10 rounded-full" />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-[0_0_20px_rgba(248,113,113,0.8)]"
                />

                {/* Face Screen */}
                <div className="w-36 h-24 bg-slate-900 rounded-2xl flex items-center justify-center gap-4 relative overflow-hidden ring-4 ring-slate-100">
                    {/* Screen Reflections */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />

                    {/* LEFT EYE */}
                    <div className="w-8 h-10 bg-black/30 rounded-full relative overflow-hidden flex items-center justify-center">
                        <motion.div
                            style={{ x: eyeX, y: eyeY }}
                            className="w-4 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        />
                    </div>

                    {/* RIGHT EYE */}
                    <div className="w-8 h-10 bg-black/30 rounded-full relative overflow-hidden flex items-center justify-center">
                        <motion.div
                            style={{ x: eyeX, y: eyeY }}
                            className="w-4 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        />
                    </div>

                    {/* Mouth (Happy) */}
                    <div className="absolute bottom-4 w-6 h-1 border-b-2 border-slate-700/50 rounded-full" />
                </div>
            </motion.div>

            {/* 
         ========================
         HOVERING HANDS
         ========================
      */}
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
