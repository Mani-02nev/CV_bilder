import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, ArrowRight } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { productData } from "./productData"
import * as LucideIcons from "lucide-react"

export default function ProductsListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  // Map slugs to lucide icons manually to match Navbar.tsx
  const productSlugsAndIcons: Record<string, keyof typeof LucideIcons> = {
    "resume-builder": "Sparkles",
    "ats-checker": "Search",
    "resume-score": "Zap",
    "resume-analyzer": "FileText",
    "resume-templates": "Layout"
  }

  // Get products list from data
  const products = Object.entries(productData).map(([slug, data]) => {
    const iconName = productSlugsAndIcons[slug] || "FileText"
    const IconComponent = (LucideIcons[iconName] as any) || LucideIcons.FileText
    return {
      slug,
      icon: IconComponent,
      ...data
    }
  })

  // Filter based on search query
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Ecosystem Suite
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Our AI Career Tools
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Maximize your hiring success rate with our suite of ATS-optimized analyzers, cover letter builders, roadmaps, and profile generators.
          </p>
        </section>

        {/* Search Input */}
        <section className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools (e.g. ATS, cover letter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 backdrop-blur-md"
            />
          </div>
        </section>

        {/* Products Grid */}
        <section className="grid md:grid-cols-2 gap-8 text-left">
          {filteredProducts.map((product, idx) => {
            const Icon = product.icon
            return (
              <motion.article
                key={product.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="group relative rounded-3xl border border-slate-900 bg-slate-950/40 p-8 flex flex-col justify-between hover:border-indigo-500/55 hover:shadow-lg hover:shadow-indigo-500/5 transition-all backdrop-blur-md overflow-hidden cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      Standard & Pro
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors pt-2">
                    {product.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.keywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-slate-900/50 border border-slate-800/80 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-900 flex justify-between items-center">
                  <Link
                    to="/auth/signup"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Get Started
                  </Link>
                  <Link
                    to={`/products/${product.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-indigo-400 transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            )
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 text-sm">
              No products matching your search query were found.
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  )
}
