import { useState } from "react"
import { Shield, Sparkles, Compass, Rocket, Mail, Send, Award, Cpu } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"

export default function CompanyPage() {
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.msg) {
      setSubmitted(true)
      setTimeout(() => {
        setFormData({ name: "", email: "", msg: "" })
        setSubmitted(false)
      }, 3000)
    }
  }

  const values = [
    { title: "Technical Excellence", desc: "We prioritize clean compilation, valid structured metadata, and strict accessibility benchmarks in all products.", icon: Cpu },
    { title: "User Ownership", desc: "Your data belongs to you. We encrypt and store your profiles privately without sell-offs.", icon: Shield },
    { title: "Helpful Innovation", desc: "No AI fluff. We build practical tools designed for measurable impact in career search and workflows.", icon: Sparkles },
    { title: "Accessibility First", desc: "Democratizing powerful resume optimization tools at affordable rates for all global talent.", icon: Compass }
  ]

  const products = [
    { title: "KS CV-Bilder", status: "Active", desc: "High-fidelity ATS resume optimizer and vector PDF builder." },
    { title: "Document Intelligence Engine", status: "Beta", desc: "Semantic parsing and analyzer for professional assets." },
    { title: "Smart Code Optimizer", status: "Roadmap", desc: "AI-powered developer utility and prompt accelerator." }
  ]

  const milestones = [
    { period: "Q3 2026", target: "Vector Portfolio Hosting", detail: "Generate one-click personal portfolio landing sites linked to resume profiles." },
    { period: "Q4 2026", target: "Real-Time Recruitment Connect", detail: "Seamlessly push resumes directly to Greenhouse and Workday endpoints." },
    { period: "H1 2027", target: "AI Agent Interview Coach", detail: "Launch video-based mock reviews with detailed transcript scoring." }
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-28">
        
        {/* Intro Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold tracking-wider text-purple-400 uppercase">
            MR K AI Ecosystem
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Accelerating Human <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Potential</span> With AI
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            MR K AI Ecosystem designs and deploys next-generation platforms that bridge the gap between human ambition and algorithmic sorting. From resume crawlers to document search engines, we build clean, secure, and semantic products.
          </p>
        </section>

        {/* Vision & Mission Cards */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-8 md:p-12 rounded-3xl bg-slate-950/40 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-all backdrop-blur-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Our Mission</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                To build high-performance, crawlable tools that reduce documentation friction and help candidates successfully bypass automated applicant tracking gates.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-3xl bg-slate-950/40 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-all backdrop-blur-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Our Vision</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                To create a unified dashboard where resume builders, portfolios, credential checks, and matching metrics collaborate to optimize search workflows.
              </p>
            </div>
          </div>
        </section>

        {/* Product Suite */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Product Portfolio</span>
            <h2 className="text-3xl font-black">AI & Career Optimization Suite</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950/60 border border-slate-900 space-y-4 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                    p.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    p.status === "Beta" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                    "bg-slate-800 text-slate-400"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{p.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Core Ideals</span>
            <h2 className="text-3xl font-black">How We Build Products</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon
              return (
                <div key={idx} className="p-6 md:p-8 rounded-3xl bg-slate-950/40 border border-slate-900 flex gap-6 hover:border-slate-800 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{v.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="space-y-12 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Roadmap Milestones</span>
            <h2 className="text-3xl font-black">Ecosystem Expansion Plan</h2>
          </div>
          <div className="relative border-l border-slate-800/80 pl-6 ml-2 space-y-8 max-w-3xl mx-auto">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">{m.period}</span>
                  <h4 className="text-lg font-bold text-white mt-1">{m.target}</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Module */}
        <section className="p-8 md:p-16 rounded-[40px] bg-slate-950 border border-slate-900 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact details */}
            <div className="space-y-6 text-left">
              <h3 className="text-2xl font-extrabold text-white">Contact MR K AI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Looking to partner with MR K AI Ecosystem, request custom APIs, or explore collaborative career engineering opportunities? Reach out using our direct contact coordinates.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>karuppasamym.mani@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Founder: Karuppasamy M</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you'd like to discuss..."
                  value={formData.msg}
                  onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none resize-none"
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl border-none">
                {submitted ? "Message Sent!" : <span className="flex items-center justify-center gap-2">Send Message <Send className="w-4 h-4" /></span>}
              </Button>
            </form>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
