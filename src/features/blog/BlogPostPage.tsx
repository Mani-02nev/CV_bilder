import { useParams, Link, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { Calendar, Clock, ArrowLeft, ArrowUpRight, Sparkles, Check, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { blogArticles } from "./blogData"
import { useAuth } from "@/context/AuthContext"

export default function BlogPostPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const article = blogArticles[slug || ""]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!article) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-10 text-left">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Career Guides
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 text-left">
          
          {/* ARTICLE CONTENT GRID (8 Columns) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header info */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 items-center pt-3 text-xs text-slate-500 border-b border-slate-900 pb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={article.author.image}
                    alt={article.author.name}
                    className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                  />
                  <div>
                    <span className="font-semibold text-slate-300 block">{article.author.name}</span>
                    <span className="text-[10px] text-slate-500">{article.author.role}</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-900 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Published: {article.publishedAt}</span>
                </div>
                <div className="h-6 w-px bg-slate-900 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>

            {/* ANSWER-FIRST GEO CONTENT BLOCK (Highlighted box at beginning of content) */}
            <section className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 space-y-3">
              <h3 className="text-sm font-extrabold text-indigo-400 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5" /> Quick Guide Summary (AI Answer First)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {article.summary} Always prioritize structured layout schemas, metrics density (using the X-Y-Z formula), and clear keyword alignments matching specific job requirements to successfully bypass automated applicant tracking systems.
              </p>
            </section>

            {/* INTRODUCTION */}
            <section className="text-slate-300 leading-relaxed text-base space-y-4">
              <p>{article.introduction}</p>
            </section>

            {/* ARTICLE BODY SECTIONS */}
            <section className="space-y-8">
              {article.contentBlocks.map((block, idx) => (
                <div key={idx} className="space-y-3">
                  <h2 className="text-2xl font-bold text-white mt-8">{block.heading}</h2>
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">{block.text}</p>
                </div>
              ))}
            </section>

            {/* HOW-TO CHECKLIST TIMELINE */}
            <section className="space-y-6 pt-6">
              <h2 className="text-2xl font-bold text-white">Step-by-Step Implementation Guide</h2>
              <div className="relative border-l border-slate-900 pl-6 ml-2 space-y-6">
                {article.steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{step.title}</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* COMPARISON MATRIX GRID */}
            <section className="space-y-6 pt-6">
              <h2 className="text-2xl font-bold text-white">Resume Optimization Do's and Don'ts</h2>
              <div className="bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-900/30">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Parameter</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Recommended Approach</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-red-400">Avoid Phrasing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {article.comparison.map((row, i) => (
                      <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                        <td className="p-4 text-xs text-slate-300 font-bold">{row.parameter}</td>
                        <td className="p-4 text-slate-400 text-xs flex gap-1.5 items-start">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{row.recommended}</span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs flex gap-1.5 items-start">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{row.avoid}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ ACCORDION SECTION */}
            <section className="space-y-6 pt-6">
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {article.faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 space-y-2">
                    <h4 className="font-extrabold text-white text-sm flex items-start gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                      {faq.q}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* SIDEBAR WIDGETS & NAVIGATION (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Primary Product CTA */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-900 space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl" />
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              {user ? (
                <>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-white text-base">Access Resume Builder</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You are logged in! Go to your workspace dashboard to create, optimize, and scan your professional resumes.
                    </p>
                  </div>
                  <Link to="/dashboard" className="block w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 border-none font-bold text-xs">
                      Go to Dashboard <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-white text-base">Unlock AI Resume Builder</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Please log in or create an account first to build, edit, and scan your resume against ATS tracking parsers.
                    </p>
                  </div>
                  <Link to="/auth/login" className="block w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 border-none font-bold text-xs animate-pulse">
                      Log In to Access AI Tools <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Links Directory */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-900 space-y-4 backdrop-blur-md text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Related Optimization Tools</h4>
              <div className="flex flex-col gap-2.5 text-xs font-bold">
                <Link to="/products/ats-checker" className="text-slate-400 hover:text-white flex justify-between items-center py-1">
                  <span>ATS Resume Checker</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/products/resume-score" className="text-slate-400 hover:text-white flex justify-between items-center py-1">
                  <span>Resume Score Checker</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/products/resume-templates" className="text-slate-400 hover:text-white flex justify-between items-center py-1">
                  <span>Resume Templates</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/products/cover-letter" className="text-slate-400 hover:text-white flex justify-between items-center py-1">
                  <span>AI Cover Letter Generator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Author Credibility Details */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-900 space-y-4 backdrop-blur-md text-left text-xs">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">About the Author</h4>
              <div className="flex items-center gap-3">
                <img
                  src={article.author.image}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full border border-slate-800 object-cover"
                />
                <div>
                  <span className="font-extrabold text-white block text-sm">{article.author.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{article.author.role}</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px] pt-2 border-t border-slate-900">
                Karuppasamy M (Mani) is the architect behind the MR K AI Ecosystem. He specializes in full-stack integrations, NLP document search algorithms, and machine-learning validation pipelines.
              </p>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
