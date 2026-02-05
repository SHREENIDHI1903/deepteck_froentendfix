import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { domainLabels } from "@/lib/constants";
import { useExperts } from "@/hooks/useExperts";
import {
  ArrowRight,
  Shield,
  Clock,
  FileCheck,
  Users,
  Zap,
  Lock,
  TrendingUp,
  BrainCircuit,
  Target,
  Rocket,
  CalendarDays,
  Sparkles,
  Brain,
  Cpu,
  Code2,
  Smartphone,
  ShieldCheck,
  Database,
  Blocks,
  Bot,
  Dna,
  Atom,
  Globe,
  Palette,
  Microscope,
  BarChart3,
  Video,
  PenTool,
  Megaphone,
  Briefcase,
  Headphones,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import heroChar from "@/assets/hero_character_3d.png";
import { HeroBackground } from "@/components/layout/HeroBackground";
import { AsteaiBot } from "@/components/ui/AsteaiBot";
import { ScrollCompanion } from "@/components/ui/ScrollCompanion";

// --- Domain Icon Mapping ---
const domainIcons: Record<string, any> = {
  ai_ml: Brain,
  data_science: BarChart3,
  web_development: Code2,
  mobile_development: Smartphone,
  software_engineering: Cpu,
  cybersecurity: ShieldCheck,
  blockchain: Blocks,
  database_admin: Database,
  robotics: Bot,
  biotech: Dna,
  quantum: Atom,
  energy: Zap,
  space_tech: Rocket,
  ui_ux_design: Palette,
  video_production: Video,
  content_writing: PenTool,
  digital_marketing: Megaphone,
  business_consulting: Briefcase,
  customer_support: Headphones,
  // Default fallback
  default: BrainCircuit,
};

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 15, mass: 0.8 },
  },
};

const bounceHover = {
  scale: 1.05,
  transition: { type: "spring" as const, stiffness: 400, damping: 10 },
};

const floatAnimation = {
  y: [0, -20, 0],
  rotate: [0, 1, -1, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: experts, isLoading } = useExperts({ onlyVerified: true });
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Preload images to prevent flashing
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const imageUrls = [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60"
    ];
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % 7);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ... (inside return)

  {/* Right Illustration - Slideshow */ }
  <motion.div
    className="lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0 min-h-[350px] lg:h-[500px]"
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    {/* Background Glow - Pulsing */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[60px] lg:blur-[80px] -z-10"
    />

    {/* Animated Slideshow */}
    <div className="relative w-[280px] h-[280px] lg:w-full lg:max-w-[380px] lg:aspect-square">
      <AnimatePresence mode="popLayout"> {/* Changed mode to popLayout for smoother transitions */}
        <motion.img
          key={currentHeroImage}
          src={[
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60", // Robotics
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60", // AI Brain
            "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=60", // DNA/Biotech
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60", // Quantum
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60", // Cybersecurity
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60", // Space Tech
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60"  // Blockchain
          ][currentHeroImage]}
          alt="DeepTech Innovation"
          className={`absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/10 ${isMobile ? '' : 'backdrop-blur-sm'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* Floating Badge overlay */}
      <motion.div
        animate={isMobile ? {} : { y: [0, -10, 0] }} // Static on mobile
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-4 -right-2 lg:-bottom-6 lg:-right-6 bg-white/90 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 z-20 ${isMobile ? '' : 'backdrop-blur'}`}
      >
        <span className="text-2xl">
          {["🤖", "🧠", "🧬", "⚛️", "🛡️", "🚀", "🔗"][currentHeroImage]}
        </span>
        <span className="font-bold text-slate-800 text-sm">
          {["Robotics", "AI Neural", "Biotech", "Quantum", "Cybersecurity", "Space Tech", "Blockchain"][currentHeroImage]}
        </span>
      </motion.div>
    </div>
  </motion.div>

  const domains = Object.entries(domainLabels);

  const engagementModels = [
    {
      icon: Clock,
      title: "Hourly Rate",
      description: "Pay for actual time spent. Flexible & focused.",
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200",
    },
    {
      icon: Target,
      title: "Fixed Price",
      description: "Set a scope, agree on a price. Done deal.",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200",
    },
    {
      icon: Rocket,
      title: "Sprint Based",
      description: "2-week agile cycles. Fast demos & deliverables.",
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-200",
    },
    {
      icon: CalendarDays,
      title: "Retainer",
      description: "Ongoing support for long-term growth.",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
    },
  ];

  const stats = [
    { label: "Total Experts", value: "2.5k+" },
    { label: "Projects Completed", value: "12k+" },
    { label: "Satisfaction Rate", value: "99%" },
  ];



  return (
    <Layout>
      <ScrollCompanion />
      {/* 
        ========================================
        HERO SECTION (Split Layout)
        ========================================
      */}
      <section ref={ref} className="relative pt-24 pb-32 overflow-hidden bg-slate-50/50">
        <HeroBackground />

        {/* Full Section Background Motion Slideshow */}
        <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
          {/* Animated Background Gradient - Simplified for Mobile */}
          <motion.div
            animate={{
              backgroundPosition: isMobile ? "0% 0%" : ["0% 0%", "100% 100%"], // Static position on mobile
              opacity: [0.3, 0.5, 0.3] // Opacity pulse remains
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[image:radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent blur-3xl"
          />

          {/* Floating Icons Slideshow - Full Screen - Reduced count on mobile */}
          {(isMobile
            ? [BrainCircuit, Rocket, Globe, Cpu, ShieldCheck].slice(0, 5) // Show only 5 icons on mobile
            : [BrainCircuit, FileCheck, Rocket, Zap, Globe, Cpu, Dna, Database, ShieldCheck, Microscope]
          ).map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute text-indigo-600/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0.1, 1, 0.1],
                scale: [0.5, 1.5, 0.5],
                y: [0, Math.random() * -100 - 50] // Float upwards
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            >
              {/* @ts-ignore - Icon type compatibility */}
              <Icon size={isMobile ? Math.random() * 40 + 30 : Math.random() * 80 + 40} />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Content */}
            <motion.div
              className="lg:w-1/2 z-10 text-center lg:text-left relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-block mb-6 relative group">
                {/* Backdrop Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animation-tilt" />

                <Badge variant="secondary" className="relative px-4 py-2 text-sm font-medium bg-white text-indigo-900 rounded-full border border-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.2)] overflow-hidden">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    <Zap className="w-4 h-4 mr-2 text-indigo-600 inline fill-indigo-100" />
                  </motion.span>
                  Launch Special: Free subscriptions for all users for first 3 months!

                  {/* Holographic Sheen Effect */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent skew-x-12"
                    animate={{ translateX: ["-150%", "150%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight"
              >
                ASTEAI - World’s First <br className="hidden lg:block" />
                Vernacular DeepTech <br className="hidden lg:block" />
                Marketplace!
              </motion.h1>

              <motion.div variants={itemVariants} className="mb-8 font-mono text-lg sm:text-xl font-bold tracking-wide flex flex-wrap gap-2 items-center cursor-default">
                {/* A */}
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.0, type: "spring" }}>
                  <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="inline-block text-blue-600">
                    A
                  </motion.span>
                </motion.span>
                chievements

                <motion.span animate={{ opacity: [0, 1] }} transition={{ delay: 1.2 }}>=</motion.span>

                {/* S */}
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: "spring" }}>
                  <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="inline-block text-amber-500">
                    S
                  </motion.span>
                </motion.span>
                kills

                <motion.span animate={{ opacity: [0, 1] }} transition={{ delay: 1.6 }}>+</motion.span>

                {/* T */}
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: "spring" }}>
                  <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="inline-block text-indigo-600">
                    T
                  </motion.span>
                </motion.span>
                alent

                <motion.span animate={{ opacity: [0, 1] }} transition={{ delay: 2.0 }}>+</motion.span>

                {/* E */}
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2, type: "spring" }}>
                  <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="inline-block text-pink-500">
                    E
                  </motion.span>
                </motion.span>
                fforts

                <motion.span animate={{ opacity: [0, 1] }} transition={{ delay: 2.4 }}>+</motion.span>

                {/* AI */}
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.6, type: "spring" }}>
                  <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="inline-block text-green-600">
                    AI
                  </motion.span>
                </motion.span>
              </motion.div>

              <motion.h2 variants={itemVariants} className="text-2xl lg:text-3xl font-bold text-slate-700 mb-4">
                Build the Future with Specialized Deep-Tech Talent
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Connect with verified specialists in AI, Robotics, Biotech, and Quantum.
                Execute complex R&D with flexible engagement models designed for innovation.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="xl"
                    className="group relative h-14 px-8 text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all bg-indigo-600 hover:bg-indigo-700 text-white overflow-hidden"
                    onClick={() => navigate("/register")}
                  >
                    <span className="relative z-10 flex items-center">
                      Start Building Now
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        className="ml-2"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </span>
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="xl"
                    variant="outline"
                    className="group h-14 px-8 text-lg font-bold rounded-xl border-2 hover:bg-slate-50 text-slate-700 transition-colors"
                    onClick={() => navigate("/howitworks")}
                  >
                    How It Works
                  </Button>
                </motion.div>
              </motion.div>


            </motion.div>

            {/* Right Illustration - Slideshow */}
            <motion.div
              className="lg:w-1/2 relative flex justify-center items-center h-[500px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Background Glow - Pulsing */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10"
              />

              {/* Animated Slideshow */}
              <div className="relative w-full max-w-[320px] lg:max-w-[380px] aspect-square">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentHeroImage}
                    src={[
                      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60", // Robotics
                      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60", // AI Brain
                      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=60", // DNA/Biotech
                      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60", // Quantum
                      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60", // Cybersecurity
                      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60", // Space Tech
                      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60"  // Blockchain
                    ][currentHeroImage]}
                    alt="DeepTech Innovation"
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/10 backdrop-blur-sm"
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                {/* Floating Badge overlay */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-xl flex items-center gap-2"
                >
                  <span className="text-2xl">
                    {["🤖", "🧠", "🧬", "⚛️", "🛡️", "🚀", "🔗"][currentHeroImage]}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {["Robotics", "AI Neural", "Biotech", "Quantum", "Cybersecurity", "Space Tech", "Blockchain"][currentHeroImage]}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 
        ========================================
        WHY CHOOSE US (Serious Engineering)
        ========================================
      */}
      <section id="serious-engineering" className="py-24 bg-slate-950 text-white overflow-hidden relative">
        {/* Grid Background */}
        {/* Animated Cyber Grid */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Moving Data Beams (Horizontal) */}
          <motion.div
            animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)] bg-[length:50%_100%] opacity-20"
            style={{ backgroundSize: "200% 100%" }}
          />

          {/* Random "Glitch" Squares */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.8, 1, 0.8],
                x: [0, Math.random() * 50 - 25, 0],
                y: [0, Math.random() * 50 - 25, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}

          {/* Scanning Line */}
          <motion.div
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Built for Serious Engineering</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Generic platforms fail at deep-tech. We built a system specifically for R&D,
              hardware-software co-design, and scientific commercialization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Deep-Tech Experts",
                desc: "Every expert is vetted for domain expertise, system-level experience, and a proven deep-tech track record."
              },
              {
                icon: FileCheck, // Using FileCheck for "Built-in IP Protection" as generic Check might be too simple
                title: "Built-in IP Protection",
                desc: "Auto-generated NDAs, IP ownership declarations, and versioned agreement records protect your innovations."
              },
              {
                icon: BrainCircuit, // Using BrainCircuit as placeholder for "Problem-First Matching"
                title: "Problem-First Matching",
                desc: "Describe your challenge and get matched with experts who have solved similar frontier technology problems."
              },
              {
                icon: TrendingUp, // Using TrendingUp for "Milestone Tracking"
                title: "Milestone Tracking",
                desc: "Escrow-backed payments released only when specific technical milestones are met and verified."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700">
                  <feature.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================
        DOMAINS (Grid)
        ========================================
      */}
      <section id="domains" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Blob for Categories */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-slate-50/50 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Categories</h2>
              <p className="text-slate-500 max-w-xl">Find specialized talent in emerging technology sectors.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex text-primary hover:text-primary/80 hover:bg-primary/5">
              View All Categories <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {domains.map(([key, label], i) => {
              const IconComponent = domainIcons[key] || domainIcons.default;

              return (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)",
                    borderColor: "rgba(99, 102, 241, 0.4)" // Primary color hint
                  }}
                  className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/experts?domain=${key}`)}
                >
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-white text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors shadow-sm flex items-center justify-center mb-6"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                    >
                      <IconComponent size={28} />
                    </motion.div>
                    <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-primary transition-colors">{label}</h3>
                    <div className="flex items-center text-sm text-slate-400 group-hover:text-slate-500 transition-colors">
                      <span>120+ Experts</span>
                      <motion.span
                        className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      >
                        <ArrowRight size={16} />
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        FEATURED EXPERTS
        ========================================
      */}
      <section id="experts" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Highest Rated Experts</h2>
            <p className="text-slate-500">Work with the best minds in the industry.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-96 bg-white rounded-3xl animate-pulse shadow-sm" />
              ))
            ) : experts && experts.length > 0 ? (
              experts.slice(0, 3).map((expert, i) => (
                <motion.div
                  key={expert.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ExpertCard expert={expert} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No experts found just yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 
        ========================================
        ENGAGEMENT MODELS
        ========================================
      */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Flexible Engagement Models</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Choose the working style that best fits your R&D timeline and budget.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-4 gap-8"
          >
            {engagementModels.map((model, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-slate-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-slate-100 cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl ${model.bg} ${model.color} flex items-center justify-center mb-6`}>
                  <model.icon size={28} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{model.title}</h3>
                <p className="text-slate-500 leading-relaxed">{model.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        CTA BOTTOM
        ========================================
      */}
      <section id="cta" className="py-20 relative overflow-hidden bg-slate-900 mx-4 rounded-[40px] mb-24">
        <div className="container mx-auto max-w-5xl p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Start Building with Confidence
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your intellectual property is protected from day one. Every project includes auto-generated NDAs, version-controlled IP assignments, and bank-grade data security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-10 h-14 rounded-xl" onClick={() => navigate(isAuthenticated ? "/experts" : "/register")}>
                Post a Project <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 hover:text-white h-14 px-10 rounded-xl" onClick={() => navigate("/register?role=expert")}>
                Apply as Expert
              </Button>
            </div>
          </div>

          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>

    </Layout>
  );
}
