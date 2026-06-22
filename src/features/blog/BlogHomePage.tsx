import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Clock, ArrowRight } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { blogTopicsList, blogArticles } from "./blogData"

export default function BlogHomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Deduplicate categories
  const categories = ["All", ...Array.from(new Set(blogTopicsList.map(t => t.category)))]

  // Filter list
  const filteredTopics = blogTopicsList.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || topic.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-16">
        
        {/* Title */}
        <section className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Career Intel
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            The Career & Resume Guide Blog
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Browse our collection of career articles, resume writing tips, and ATS optimization guides designed by hiring experts.
          </p>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search guides (e.g. Google Resume, ATS format)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 backdrop-blur-md"
            />
          </div>

          {/* Categories Grid tags */}
          <div className="flex flex-wrap gap-2.5 justify-center max-w-3xl mx-auto pt-2">
            {categories.slice(0, 15).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white border-transparent"
                    : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
            {categories.length > 15 && (
              <span className="text-xs text-slate-600 self-center font-bold px-2">+{categories.length - 15} More Categories</span>
            )}
          </div>
        </section>

        {/* Articles Feed */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredTopics.map((topic, idx) => {
            const article = blogArticles[topic.slug]
            return (
              <motion.article
                key={topic.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                className="group relative rounded-3xl border border-slate-900 bg-slate-950/40 p-6 flex flex-col justify-between hover:border-slate-800 transition-all backdrop-blur-md overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Category Tag */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                      {topic.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article?.readTime || "10 min read"}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                    {topic.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {article?.summary}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-900 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={article?.author.image}
                      alt={article?.author.name}
                      className="w-7 h-7 rounded-full border border-slate-800 object-cover"
                    />
                    <span className="text-[11px] font-medium text-slate-400">{article?.author.name}</span>
                  </div>
                  <Link
                    to={`/blog/${topic.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-indigo-400 transition-colors"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            )
          })}

          {filteredTopics.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 text-sm">
              No career guides matching your search terms were found.
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  )
}
