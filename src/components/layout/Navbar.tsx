import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Menu,
  ChevronDown,
  Sparkles,
  FileText,
  Search,
  Zap,
  Layout,
  ArrowRight
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import logo from "@/assets/logo.png"
import { useAuth } from "@/context/AuthContext"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown and mobile menu on navigation
  useEffect(() => {
    setIsProductsOpen(false)
    setIsMobileMenuOpen(false)
  }, [pathname])

  const productsList = [
    { name: "AI Resume Builder", href: "/products/resume-builder", icon: Sparkles, desc: "Create high-impact CVs with AI recommendations." },
    { name: "ATS Resume Checker", href: "/products/ats-checker", icon: Search, desc: "Scan your resume against ATS tracking parsers." },
    { name: "Resume Score", href: "/products/resume-score", icon: Zap, desc: "Get structural scores & actionable checklists." },
    { name: "Resume Analyzer", href: "/products/resume-analyzer", icon: FileText, desc: "Detailed breakdown of formatting & content errors." },
    { name: "Resume Templates", href: "/products/resume-templates", icon: Layout, desc: "Recruiter-approved modern templates." }
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#030712]/80 backdrop-blur-md border-b border-slate-800/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src={logo} alt="KS CV-Bilder Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            KS CV-<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-medium">Bilder</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <Link
              to="/products"
              onClick={() => setIsProductsOpen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2 focus:outline-none"
            >
              Products
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? "rotate-180" : ""}`} />
            </Link>

            <AnimatePresence>
              {isProductsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] bg-slate-900/95 backdrop-blur-lg border border-slate-800/80 rounded-2xl p-6 shadow-2xl z-40 grid grid-cols-2 gap-4 before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 before:content-['']"
                >
                    {productsList.map((product) => {
                      const Icon = product.icon
                      return (
                        <Link
                          key={product.name}
                          to={product.href}
                          className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {product.desc}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/blog"
            className={`text-sm font-medium transition-colors ${
              pathname === "/blog" ? "text-indigo-400" : "text-slate-300 hover:text-white"
            }`}
          >
            Blog
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors ${
              pathname === "/about" ? "text-indigo-400" : "text-slate-300 hover:text-white"
            }`}
          >
            Company
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden lg:block text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Dashboard
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="hidden lg:inline-flex text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900/50 rounded-full px-4 h-9"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="hidden lg:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link to="/auth/signup" className="hidden lg:block">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 py-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all font-semibold"
                >
                  Get Started Free
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-slate-950 border-slate-800 text-white p-6 overflow-y-auto">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Access builder sections and tools</SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-2.5 mb-10 pb-6 border-b border-slate-800">
                <img src={logo} alt="KS CV-Bilder Logo" className="h-9 w-9 object-contain" />
                <span className="font-extrabold text-lg text-white">KS CV-Bilder</span>
              </div>
              <nav className="flex flex-col gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Products</h4>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {productsList.map((product) => (
                      <Link
                        key={product.name}
                        to={product.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 py-1.5"
                      >
                        <product.icon className="w-4 h-4 text-indigo-400" />
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-800" />

                <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white py-1">
                  Blog Feed
                </Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white py-1">
                  Company Info
                </Link>

                <hr className="border-slate-800" />

                <div className="flex flex-col gap-3 pt-4">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
                          Go to Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                        className="w-full border-slate-700 text-slate-300 hover:text-white bg-transparent"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white bg-transparent">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/auth/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
                          Create Resume <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
export default Navbar
