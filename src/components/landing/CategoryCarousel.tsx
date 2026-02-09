import React, { useEffect, useState, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
    Brain, Bot, Dna, Zap, Code2, Smartphone, ShieldCheck, Database,
    ArrowRight, ChevronLeft, ChevronRight, BarChart3, Cpu, Blocks, Atom,
    Rocket, Palette, Video, PenTool, Megaphone, Briefcase, Headphones,
    BrainCircuit, Globe, NotebookPen, Calculator, Gavel, Users, LayoutList,
    Truck, BookOpen, Languages, FileEdit, Headset, Keyboard, Layers,
    Leaf, FlaskConical, Component, Wifi, Construction, Monitor, Target
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Data & Helpers ---

const categoryImages: Record<string, string> = {
    // 1. Categories (Tech)
    ai_ml: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=60",
    data_science: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
    web_development: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=60",
    mobile_development: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=60",
    software_engineering: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&auto=format&fit=crop&q=60",
    devops_cloud: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=60",
    cybersecurity: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60",
    blockchain: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=60",
    database_admin: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60",
    qa_testing: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&auto=format&fit=crop&q=60",
    game_development: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop&q=60",
    ar_vr: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&auto=format&fit=crop&q=60",
    iot: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60",
    robotics: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60",
    climate_tech: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60",
    biotech: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=60",
    quantum: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60",
    space_tech: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60",
    advanced_materials: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=60",
    energy: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=60",
    deep_infrastructure: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60",

    // 2. Creative Services
    ui_ux_design: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&auto=format&fit=crop&q=60",
    graphic_design: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
    product_design: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=60",
    brand_identity: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&auto=format&fit=crop&q=60",
    motion_graphics: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=60",
    illustration: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=60",
    video_production: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=600&auto=format&fit=crop&q=60",
    photography: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60",

    // 3. Marketing & Consulting
    digital_marketing: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
    content_marketing: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60",
    seo: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=600&auto=format&fit=crop&q=60",
    social_media: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&auto=format&fit=crop&q=60",
    email_marketing: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&auto=format&fit=crop&q=60",
    sales_strategy: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&auto=format&fit=crop&q=60",
    market_research: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
    business_consulting: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60",
    financial_consulting: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=60",
    accounting: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
    legal_consulting: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=60",
    hr_recruiting: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop&q=60",
    project_management: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60",
    product_management: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=60",
    operations: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=600&auto=format&fit=crop&q=60",

    // 4. Writing Services
    content_writing: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=60",
    copywriting: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=60",
    technical_writing: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop&q=60",
    translation: "https://images.unsplash.com/photo-1543165796-5426273eaab3?w=600&auto=format&fit=crop&q=60",
    editing_proofreading: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&auto=format&fit=crop&q=60",
    customer_support: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&auto=format&fit=crop&q=60",
    virtual_assistant: "https://images.unsplash.com/photo-1526328828355-69b01701ca6a?w=600&auto=format&fit=crop&q=60",

    default: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60"
};

// Define PackageIcon manually to avoid import errors if not available in lucide-react version
const PackageIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22v-9" /></svg>
);

const domainIcons: Record<string, any> = {
    ai_ml: Brain,
    data_science: BarChart3,
    web_development: Code2,
    mobile_development: Smartphone,
    software_engineering: Cpu,
    cybersecurity: ShieldCheck,
    blockchain: Blocks,
    database_admin: Database,
    qa_testing: FlaskConical,
    game_development: Monitor,
    ar_vr: Monitor,
    iot: Wifi,
    robotics: Bot,
    biotech: Dna,
    quantum: Atom,
    energy: Zap,
    space_tech: Rocket,
    climate_tech: Leaf,
    advanced_materials: Layers,
    deep_infrastructure: Construction,

    ui_ux_design: Palette,
    graphic_design: Palette,
    product_design: Component,
    brand_identity: Target,
    motion_graphics: Video,
    illustration: PenTool,
    video_production: Video,
    photography: Video,

    digital_marketing: Megaphone,
    content_marketing: NotebookPen,
    seo: BarChart3,
    social_media: Users,
    email_marketing: Keyboard,
    sales_strategy: Target,
    market_research: Globe,
    business_consulting: Briefcase,
    financial_consulting: Calculator,
    accounting: Calculator,
    legal_consulting: Gavel,
    hr_recruiting: Users,
    project_management: LayoutList,
    product_management: PackageIcon,
    operations: Truck,

    content_writing: PenTool,
    copywriting: FileEdit,
    technical_writing: Code2,
    translation: Languages,
    editing_proofreading: BookOpen,
    customer_support: Headphones,
    virtual_assistant: Headset,

    other: BrainCircuit,
};

const getIcon = (key: string) => {
    if (domainIcons[key]) return domainIcons[key];
    if (key.includes('design')) return Palette;
    if (key.includes('writing')) return PenTool;
    if (key.includes('consulting')) return Briefcase;
    if (key.includes('marketing')) return Megaphone;
    if (key.includes('data')) return Database;
    return BrainCircuit;
};

const categories = [
    // 1. Categories (Tech)
    { id: "ai_ml", title: "AI / Machine Learning", description: "LLMs, Computer Vision" },
    { id: "data_science", title: "Data Science & Analytics", description: "Big Data, Visualization" },
    { id: "web_development", title: "Web Development", description: "Full Stack, React, Node" },
    { id: "mobile_development", title: "Mobile Development", description: "iOS, Android, Flutter" },
    { id: "software_engineering", title: "Software Engineering", description: "System Design, Architecture" },
    { id: "devops_cloud", title: "DevOps & Cloud Computing", description: "AWS, Azure, Docker" },
    { id: "cybersecurity", title: "Cybersecurity", description: "Pen Testing, Security" },
    { id: "blockchain", title: "Blockchain & Web3", description: "Smart Contracts, DeFi" },
    { id: "database_admin", title: "Database Administration", description: "Optimization, SQL/NoSQL" },
    { id: "qa_testing", title: "QA & Testing", description: "Automation, Manual Testing" },
    { id: "game_development", title: "Game Development", description: "Unity, Unreal Engine" },
    { id: "ar_vr", title: "AR / VR Development", description: "Immersive Experiences" },
    { id: "iot", title: "IoT & Embedded Systems", description: "Sensors, Firmware" },
    { id: "robotics", title: "Robotics & Automation", description: "Drones, Control Systems" },
    { id: "climate_tech", title: "Climate Tech", description: "Renewables, Green Tech" },
    { id: "biotech", title: "Biotechnology", description: "Genomics, Bioinformatics" },
    { id: "quantum", title: "Quantum Computing", description: "Algorithms, Cryptography" },
    { id: "space_tech", title: "Space Technology", description: "Aerospace, Satellites" },
    { id: "advanced_materials", title: "Advanced Materials", description: "Nanotech, Composites" },
    { id: "energy", title: "Energy & Storage", description: "Solar, Battery Tech" },
    { id: "deep_infrastructure", title: "Deep Infrastructure", description: "Smart Cities, Transport" },

    // 2. Creative Services
    { id: "ui_ux_design", title: "UI/UX Design", description: "Web & Mobile Interfaces" },
    { id: "graphic_design", title: "Graphic Design", description: "Branding, Identity" },
    { id: "product_design", title: "Product Design", description: "Industrial & Digital" },
    { id: "brand_identity", title: "Brand Identity", description: "Logo, Strategy" },
    { id: "motion_graphics", title: "Motion Graphics", description: "Animation, VFX" },
    { id: "illustration", title: "Illustration", description: "Digital Art, Vector" },
    { id: "video_production", title: "Video Production", description: "Editing, Filming" },
    { id: "photography", title: "Photography", description: "Commercial, Product" },

    // 3. Marketing & Consulting
    { id: "digital_marketing", title: "Digital Marketing", description: "SEO, PPC, Growth" },
    { id: "content_marketing", title: "Content Marketing", description: "Strategy, Blogs" },
    { id: "seo", title: "SEO & SEM", description: "Search Optimization" },
    { id: "social_media", title: "Social Media Marketing", description: "Management, Ads" },
    { id: "email_marketing", title: "Email Marketing", description: "Campaigns, Automation" },
    { id: "sales_strategy", title: "Sales Strategy", description: "Funnels, Outreach" },
    { id: "market_research", title: "Market Research", description: "Data, Trends" },
    { id: "business_consulting", title: "Business Consulting", description: "Strategy, Operations" },
    { id: "financial_consulting", title: "Financial Consulting", description: "Modeling, Valuation" },
    { id: "accounting", title: "Accounting & Bookkeeping", description: "Audits, Payroll" },
    { id: "legal_consulting", title: "Legal Consulting", description: "IP, Contracts" },
    { id: "hr_recruiting", title: "HR & Recruiting", description: "Hiring, Culture" },
    { id: "project_management", title: "Project Management", description: "Agile, Scrum" },
    { id: "product_management", title: "Product Management", description: "Roadmap, User Research" },
    { id: "operations", title: "Operations Management", description: "Logistics, Process" },

    // 4. Writing Services
    { id: "content_writing", title: "Content Writing", description: "Articles, Web Copy" },
    { id: "copywriting", title: "Copywriting", description: "Sales, Advertising" },
    { id: "technical_writing", title: "Technical Writing", description: "Docs, Manuals" },
    { id: "translation", title: "Translation", description: "Localization, Multi-lang" },
    { id: "editing_proofreading", title: "Editing & Proofreading", description: "Review, Polish" },
    { id: "customer_support", title: "Customer Support", description: "Technical, Service" },
    { id: "virtual_assistant", title: "Virtual Assistant", description: "Admin, Scheduling" },
].map(cat => ({
    ...cat,
    icon: getIcon(cat.id),
    image: categoryImages[cat.id] || categoryImages.default
}));

import Autoplay from 'embla-carousel-autoplay'

export const CategoryCarousel = () => {
    // 3D Carousel Configuration
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
        dragFree: false,
        duration: 45, // Adding "Duration" to make the transition animation smoother/slower
    }, [
        Autoplay({ delay: 3000, stopOnInteraction: false })
    ]);

    const [nodes, setNodes] = useState<HTMLElement[]>([]);

    const TWEEN_FACTOR_BASE = 0.52; // How much to rotate/scale
    const numberWithinRange = (number: number, min: number, max: number): number =>
        Math.min(Math.max(number, min), max)

    const applyTween = useCallback((emblaApi: any, eventName?: string) => {
        const engine = emblaApi.internalEngine()
        const scrollProgress = emblaApi.scrollProgress()
        const slides = emblaApi.scrollSnapList()
        const styles = emblaApi.slideNodes().map((slideNode: any) => slideNode.style)

        emblaApi.scrollSnapList().forEach((scrollSnap: number, index: number) => {
            let diffToTarget = scrollSnap - scrollProgress
            const slidesInView = engine.slideRegistry[index]

            // Handle infinite loop logic for calculations
            if (engine.options.loop) {
                engine.slideLooper.loopPoints.forEach((loopItem: any) => {
                    const target = loopItem.target()

                    if (index === loopItem.index && target !== 0) {
                        const sign = Math.sign(target)
                        if (sign === -1) {
                            diffToTarget = scrollSnap - (1 + scrollProgress)
                        }
                        if (sign === 1) {
                            diffToTarget = scrollSnap + (1 - scrollProgress)
                        }
                    }
                })
            }

            // --- Strict Cover Flow Logic ---

            // 1. Calculate distance from center
            // diffToTarget is usually between -1 and 1 for neighbors
            const diff = diffToTarget;
            const roundDiff = Math.abs(diff);
            const tweenValue = 1 - Math.min(roundDiff, 1);

            // --- "Circular Cylinder" Logic ---

            // Rotation: Boosted to 45 degrees per step for clearer "bent" look
            const rotation = diffToTarget * -45;

            // Z-Position: Strong curve
            const translateZ = (1 - Math.cos(diffToTarget * 0.5)) * -800;

            // Scale: Re-introduce dynamic scaling for "Animation" feel
            // Center = 1, Neighbors = 0.85
            const scale = numberWithinRange(1 - Math.abs(diffToTarget), 0.85, 1).toString();

            const zIndex = Math.round((1 - Math.abs(diffToTarget)) * 100);

            if (slidesInView) {
                slidesInView.forEach((slideIndex: any) => {
                    if (!styles[slideIndex]) return;

                    styles[slideIndex].transform = `
                        perspective(1000px)
                        rotateY(${rotation}deg)
                        translateZ(${translateZ}px)
                        scale(${scale})
                    `
                    styles[slideIndex].zIndex = zIndex
                    styles[slideIndex].opacity = '1'
                })
            }
        })
    }, []);

    useEffect(() => {
        if (!emblaApi) return

        // Initial setup
        applyTween(emblaApi)
        emblaApi.on('reInit', applyTween)
        emblaApi.on('scroll', applyTween)
        emblaApi.on('slideFocus', applyTween) // Extra hook for safety

    }, [emblaApi, applyTween])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-24 bg-white/90 relative overflow-hidden backdrop-filter-none">
            {/* Header */}
            <div className="container mx-auto px-4 mb-20 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4"
                >
                    Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Categories</span>
                </motion.h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Find specialized talent in emerging technology sectors.
                </p>
            </div>

            <div className="embla relative max-w-[1200px] mx-auto px-4 md:px-0">
                <div className="overflow-visible" ref={emblaRef}>
                    <div className="flex touch-pan-y" style={{ transformStyle: 'preserve-3d' }}>
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className="flex-[0_0_60%] sm:flex-[0_0_40%] md:flex-[0_0_30%] min-w-0 pl-4 relative"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="h-[500px] w-full relative rounded-3xl overflow-hidden shadow-2xl bg-white select-none border border-slate-100">
                                    {/* Background */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${category.image})` }}
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-z-10">
                                        <div className="mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg shadow-black/20">
                                                {category.icon && <category.icon className="w-7 h-7" />}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-3 text-shadow-sm">{category.title}</h3>
                                        <p className="text-slate-200 text-sm line-clamp-2 leading-relaxed opacity-90">{category.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="container mx-auto px-4 mt-16 flex flex-col items-center gap-6">
                {/* Arrows (Visible on desktop) */}
                <div className="hidden md:flex gap-4">
                    <button
                        onClick={scrollPrev}
                        className="p-4 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all z-20"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="p-4 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all z-20"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

        </section>
    );

};
