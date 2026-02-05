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
  BarChart3,
  Video,
  PenTool,
  Megaphone,
  Briefcase,
  Headphones,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Content */}
            <motion.div
              className="lg:w-1/2 z-10 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-block mb-6">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shadow-sm">
                  <Zap className="w-4 h-4 mr-2 text-indigo-600 inline fill-indigo-100" />
                  Launch Special: Free subscriptions for all users for first 3 months!
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

              <motion.div variants={itemVariants} className="mb-8 font-mono text-lg sm:text-xl font-bold tracking-wide">
                <span className="text-blue-600">A</span>chievements = <span className="text-amber-500">S</span>kills + <span className="text-indigo-600">T</span>alent + <span className="text-pink-500">E</span>fforts + <span className="text-green-600">AI</span>
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
                <motion.div whileHover={bounceHover} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="xl"
                    className="h-14 px-8 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    onClick={() => navigate(isAuthenticated ? "/experts" : "/register")}
                  >
                    Hire Experts
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>

                <motion.div whileHover={bounceHover} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="xl"
                    variant="outline"
                    className="h-14 px-8 text-lg font-bold rounded-xl border-2 hover:bg-slate-50 text-slate-700"
                    onClick={() => navigate("/register?role=expert")}
                  >
                    Apply as Expert
                  </Button>
                </motion.div>
              </motion.div>


            </motion.div>

            {/* Right Illustration */}
            <motion.div
              className="lg:w-1/2 relative flex justify-center items-center h-[500px]" // Added fixed height for centering
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Background Glow */}
              <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-[100px] -z-10 opacity-60" />

              {/* Interactive Bot */}
              <motion.img
                src={heroChar}
                alt="DeepTech Expert"
                className="relative z-10 w-full max-w-[320px] lg:max-w-[380px] object-contain drop-shadow-2xl"
                animate={floatAnimation}
              />



            </motion.div>
          </div>
        </div>
      </section>


      {/* 
        ========================================
        WHY CHOOSE US (Serious Engineering)
        ========================================
      */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Built for Serious Engineering</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Generic platforms fail at deep-tech. We built a system specifically for R&D,
              hardware-software co-design, and scientific commercialization.
            </p>
          </div>

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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
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
        WHY CHOOSE US (Serious Engineering)
        ========================================
      */}


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
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">Flexible Engagement Models</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {engagementModels.map((model, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-slate-100">
                <div className={`w-14 h-14 rounded-2xl ${model.bg} ${model.color} flex items-center justify-center mb-6`}>
                  <model.icon size={28} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{model.title}</h3>
                <p className="text-slate-500 leading-relaxed">{model.description}</p>
              </div>
            ))}
          </div>
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
              Ready to future-proof your business?
            </h2>
            <Button
              size="xl"
              className="h-16 px-12 text-lg font-bold bg-white text-slate-900 hover:bg-slate-100 rounded-2xl"
              onClick={() => navigate(isAuthenticated ? "/projects/new" : "/register")}
            >
              Post a Project
            </Button>
          </div>

          {/* Abstract BG */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[150px]" />
          </div>
        </div>
      </section>

    </Layout>
  );
}

