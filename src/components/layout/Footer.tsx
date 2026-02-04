import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Twitter, Linkedin, Github, ArrowRight, Mail } from "lucide-react";

export function Footer() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleComingSoon = (e: React.MouseEvent, featureName: string) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: `${featureName} is currently under development. Stay tuned!`,
    });
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 overflow-hidden border-t border-slate-900">

      {/* Abstract Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/20">
                <span className="text-xl font-black text-white">A</span>
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                ASTEAI
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              The world's first vernacular DeepTech marketplace. Connecting innovators with elite talent in AI, Quantum, and Biotechnology.
            </p>

            {/* Newsletter (Visual Only) */}
            <div className="pt-4">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Stay Updated</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm"
                />
                <button className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-r-lg transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold text-white mb-6">Platform</h3>
            <ul className="space-y-4">
              {['Find Experts', 'How It Works', 'Pricing', 'Verified Talent'].map((item) => (
                <li key={item}>
                  <button
                    onClick={(e) => item === 'Find Experts' ? navigate('/experts') : handleComingSoon(e, item)}
                    className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-white mb-6">Resources</h3>
            <ul className="space-y-4">
              {['Blog', 'Case Studies', 'Help Center', 'Community'].map((item) => (
                <li key={item}>
                  <button
                    onClick={(e) => handleComingSoon(e, item)}
                    className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className="font-bold text-white mb-6">Connect</h3>
            <div className="flex flex-col gap-4">
              <a href="mailto:contact@asteai.com" className="flex items-center gap-3 text-sm hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-primary transition-colors text-slate-400 group-hover:text-white">
                  <Mail size={14} />
                </div>
                contact@asteai.com
              </a>
            </div>

            <div className="mt-8">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Asteai Deeptech Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={(e) => handleComingSoon(e, 'Privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={(e) => handleComingSoon(e, 'Terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
