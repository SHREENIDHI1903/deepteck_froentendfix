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
import { TiltCard } from "@/components/ui/TiltCard";

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



  const domains = Object.entries(domainLabels);

  const engagementModels = [
    {
      icon: Clock,
      title: "Hourly Rate",
      description: "Pay for actual time spent. Flexible & focused.",
      color: "text-amber-600",
      gradient: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50",
      hoverBorder: "hover:border-amber-200",
      shadow: "hover:shadow-amber-500/20"
    },
    {
      icon: Target,
      title: "Fixed Price",
      description: "Set a scope, agree on a price. Done deal.",
      color: "text-blue-600",
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50",
      hoverBorder: "hover:border-blue-200",
      shadow: "hover:shadow-blue-500/20"
    },
    {
      icon: Rocket,
      title: "Sprint Based",
      description: "2-week agile cycles. Fast demos & deliverables.",
      color: "text-purple-600",
      gradient: "from-purple-500 to-pink-600",
      lightBg: "bg-purple-50",
      hoverBorder: "hover:border-purple-200",
      shadow: "hover:shadow-purple-500/20"
    },
    {
      icon: CalendarDays,
      title: "Retainer",
      description: "Ongoing support for long-term growth.",
      color: "text-emerald-600",
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50",
      hoverBorder: "hover:border-emerald-200",
      shadow: "hover:shadow-emerald-500/20"
    },
  ];

  const stats = [
    { label: "Total Experts", value: "2.5k+" },
    { label: "Projects Completed", value: "12k+" },
    { label: "Satisfaction Rate", value: "99%" },
  ];

  const categoryImages: Record<string, string> = {
    // Technology & Development
    ai_ml: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=60", // Abstract AI brains
    data_science: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60", // Data visualization
    web_development: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=60", // Code on screen
    mobile_development: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=60", // Mobile phone
    software_engineering: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&auto=format&fit=crop&q=60", // Server/Tech
    devops_cloud: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=60", // GitHub/Code Flow/CI-CD
    database_administration: "https://images.unsplash.com/photo-1555664424-778a690ea00a?w=600&auto=format&fit=crop&q=60", // SQL/Monitor Data
    qa_testing: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&auto=format&fit=crop&q=60", // User testing/AI analysis
    cybersecurity: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60", // Cyber lock
    blockchain: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=60", // Blockchain nodes
    game_development: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop&q=60", // Cyberpunk/Game Art
    ar_vr: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&auto=format&fit=crop&q=60", // VR Headset
    iot: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60", // Circuit/IoT

    // Deep Tech
    robotics: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60", // Robot arm
    biotech: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=60", // DNA/Lab
    quantum: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60", // Quantum physics
    space_tech: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60", // Earth from space
    climate_tech: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60", // Nature/Wind
    energy: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=60", // Solar panels
    advanced_materials: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=60", // Microstructure
    deep_infrastructure: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60", // Skyscrapers/Grid/Infrastructure

    // Design & Creative
    ui_ux_design: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&auto=format&fit=crop&q=60", // Dark iPhone/App mockups
    graphic_design: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60", // Abstract dreamy oil colors (Dark)
    product_design: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=60", // Retro tech/Gadgets (Darker)
    brand_identity: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&auto=format&fit=crop&q=60", // Neon/Dark branding signs
    motion_graphics: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=60", // Cyberpunk city/motion
    illustration: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60", // Colorful dark art
    video_production: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=600&auto=format&fit=crop&q=60", // Cinema Camera Rig (Distinct from photography)
    photography: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60", // Camera lens/Dark studio 

    // Marketing & Sales
    digital_marketing: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60", // Dark Data Dashboard
    content_marketing: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60", // Dark mood writing
    seo: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=600&auto=format&fit=crop&q=60", // Search magnifying glass
    social_media: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&auto=format&fit=crop&q=60", // Phone apps (Darker)
    email_marketing: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&auto=format&fit=crop&q=60", // Email/Newsletter
    sales_strategy: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&auto=format&fit=crop&q=60", // Handshake/Deal
    market_research: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60", // Research/Data

    // Business & Operations
    business_consulting: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60", // Professional suit/dark
    financial_consulting: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=60", // Dark Finance/Crypto Chart
    accounting: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60", // Calculator/Ledger
    legal_consulting: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=600&auto=format&fit=crop&q=60", // Gavel (Darker)
    hr_recruiting: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop&q=60", // Team meeting (Darker info)
    project_management: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60", // Kanban board
    product_management: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=60", // Dark Team/Strategy (Proven URL)
    operations: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=600&auto=format&fit=crop&q=60", // Logistics/Warehouse

    // Writing & Translation
    content_writing: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=60", // Dark journaling
    copywriting: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=60", // Typewriter
    technical_writing: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop&q=60", // Coding close up
    translation: "https://images.unsplash.com/photo-1543165796-5426273eaab3?w=600&auto=format&fit=crop&q=60", // Books library (Dark)
    editing_proofreading: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&auto=format&fit=crop&q=60", // Red pen/Correction

    // Support & Other
    customer_support: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&auto=format&fit=crop&q=60", // Headset style
    virtual_assistant: "https://images.unsplash.com/photo-1526328828355-69b01701ca6a?w=600&auto=format&fit=crop&q=60", // Home office
    other: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60", // Abstract mesh

    // Fallback
    default: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60" // Generic tech
  };



  return (
    <Layout>
      {/* 
        ========================================
        HERO SECTION (Split Layout)
        ========================================
      */}
      <section id="hero" ref={ref} className="relative pt-24 pb-32 overflow-hidden bg-slate-50/50">
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
              className={`lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0 ${isMobile ? 'min-h-[350px]' : 'lg:min-h-[750px]'}`}
              initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Background Glow - Pulsing */}
              {!isMobile && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10"
                />
              )}

              {/* Animated Slideshow */}
              <div className="relative w-[280px] h-[350px] lg:w-full lg:max-w-[600px] lg:aspect-[3/4]">
                <AnimatePresence mode="popLayout">
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
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={isMobile ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </AnimatePresence>

                {/* Floating Badge overlay */}
                <motion.div
                  animate={isMobile ? {} : { y: [0, -10, 0] }}
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

          {/* Added Glow Effect - Increased Opacity and Brightness */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

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
        {/* Decorative Blob for Categories - Increased Opacity */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 rounded-full blur-[120px] -z-10 pointer-events-none"
        />

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
              const bgImage = categoryImages[key] || categoryImages.default;

              return (
                <motion.div key={key} variants={itemVariants}>
                  <TiltCard
                    className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                    onClick={() => navigate(`/experts?domain=${key}`)}
                  >
                    {/* Background Image with Zoom Effect */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />

                    {/* Dark Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30 group-hover:via-slate-900/50 transition-colors duration-500" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full justify-between p-8">
                      <motion.div
                        className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-inner"
                        whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                      >
                        <IconComponent size={28} />
                      </motion.div>

                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{label}</h3>
                        <div className="h-1 w-12 bg-indigo-500 rounded-full group-hover:w-full transition-all duration-500" />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        FEATURED EXPERTS
        ========================================
      */}
      <section id="experts" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Glow Effect */}
        {/* Glow Effect - Increased Opacity */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
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
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        {/* Center Glow */}
        {/* Center Glow - Increased Opacity */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gradient-to-r from-indigo-500/15 to-purple-500/15 blur-[130px] rounded-full pointer-events-none" />
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
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 group cursor-default ${model.hoverBorder} ${model.shadow} hover:shadow-2xl`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${model.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <model.icon size={32} className="text-white" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{model.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{model.description}</p>

                {/* Subtle decorative line */}
                <div className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${model.gradient} opacity-20 group-hover:opacity-100 group-hover:w-full transition-all duration-500`} />
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
              <Button size="xl" className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-10 h-14 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-500/25" onClick={() => navigate(isAuthenticated ? "/experts" : "/register")}>
                Post a Project <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="xl" className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white font-bold px-10 h-14 rounded-2xl transition-all duration-300" onClick={() => navigate("/register?role=expert")}>
                Apply as Expert
              </Button>
            </div>
          </div>

          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />
        </div>
      </section>

      <ScrollCompanion />

    </Layout>
  );
}
