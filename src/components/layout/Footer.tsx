import { Link } from "react-router-dom"
import { Mail, Linkedin, Github, Instagram, Heart, ExternalLink } from "lucide-react"
import logo from "@/assets/logo.png"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: "AI Resume Builder", href: "/products/resume-builder" },
    { name: "Resume Templates", href: "/products/resume-templates" }
  ]

  const toolLinks = [
    { name: "ATS Resume Checker", href: "/products/ats-checker" },
    { name: "Resume Score Checker", href: "/products/resume-score" },
    { name: "Resume Analyzer", href: "/products/resume-analyzer" }
  ]

  const companyLinks = [
    { name: "About Ecosystem", href: "/about" },
    { name: "Career Guides", href: "/blog" },
    { name: "Privacy Policy", href: "/#privacy" },
    { name: "Terms of Service", href: "/#terms" }
  ]

  return (
    <footer className="bg-[#020617] border-t border-slate-900 text-slate-400 py-16 px-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-900/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          {/* Logo & Pitch */}
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white group">
              <img src={logo} alt="KS Logo" className="h-8 w-8 object-contain group-hover:rotate-6 transition-transform" />
              <span>KS Resume Builder</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Transforming career prospects globally with intelligent, AI-powered parsing, optimization, and content design.
            </p>
            <div className="pt-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest block mb-3">An Official Product of</span>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-bold text-white transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                MR K AI Ecosystem
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="space-y-4">
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white">Resume Tools</h5>
            <ul className="space-y-2.5 text-sm">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-white hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Tools */}
          <div className="space-y-4">
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white">Analysis Tools</h5>
            <ul className="space-y-2.5 text-sm">
              {toolLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-white hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white">Company</h5>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-white hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-900">
          <p className="text-xs text-slate-500">
            © {currentYear} KS Resume Builder by <span className="text-slate-400 font-medium">Karuppasamy M (Mani)</span>. All rights reserved.
          </p>

          {/* Social Profiles */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/karuppasamym"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Founder LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/karuppasamym"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Founder GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/karuppasamym"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Founder Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="mailto:karuppasamym.mani@gmail.com"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Contact Founder"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for modern job seekers
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
