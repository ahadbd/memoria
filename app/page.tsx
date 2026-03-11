"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  UserButton,
  useUser
} from "@clerk/nextjs";
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Rocket, 
  ChevronRight, 
  CheckCircle2, 
  FileText, 
  BarChart3, 
  ShieldCheck,
  Smartphone,
  Globe,
  Star,
  Trophy
} from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full px-6 py-6 border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
            MEMO<span className="text-indigo-500">RIA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            {isLoaded && !isSignedIn && (
              <>
                <Link href="/sign-in" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4">Log in</Link>
                <Link href="/sign-up">
                  <Button size="sm" className="rounded-full px-5 font-bold">Try for free</Button>
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4">Dashboard</Link>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-24 pb-32 text-center space-y-12 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 text-sm font-medium mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>Next-Gen Learning: Optimized with FSRS 5.0</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1] md:leading-[1.05]">
              DOMINATE ANY SUBJECT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                WITH AI PRECISION.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
              Stop wasting time on inefficient studying. Memoria combines <span className="text-white">Generative AI</span> with 
              <span className="text-indigo-400 italic"> Spaced Repetition Science</span> to ensure you remember everything you learn, forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                <Button size="lg" className="rounded-full px-10 h-16 text-xl font-black group shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                  {isSignedIn ? "Go to Dashboard" : "Start Learning Now"}
                  <ChevronRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                No credit card required • Free forever plan
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Showcase */}
        <section id="features" className="px-6 py-32 bg-slate-950/40">
          <div className="max-w-7xl mx-auto space-y-32">
            
            {/* Feature 1: AI Generation */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                  FROM NOTES TO DECK<br /> IN NANOSECONDS.
                </h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Don't waste hours manually typing flashcards. Simply paste your notes, PDFs, or slides, and our 
                  <span className="text-white"> Gemini-powered engine</span> will extract the most critical concepts into a high-quality study set.
                </p>
                <ul className="space-y-3">
                  {['Intelligent Context Extraction', 'Automatic Image Occlusion Support', 'Multi-Language Support'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2rem] blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                <div className="relative aspect-video rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    </div>
                    <div className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Memoria AI Engine</div>
                  </div>
                  <div className="flex-1 flex gap-4 overflow-hidden">
                    <div className="w-1/2 space-y-2">
                      <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase">Source Context</div>
                      <div className="h-2 w-full bg-slate-800 rounded animate-pulse" />
                      <div className="h-2 w-4/5 bg-slate-800 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="h-2 w-full bg-slate-800 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <div className="h-2 w-2/3 bg-slate-800 rounded animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <div className="w-px bg-white/5" />
                    <div className="w-1/2 space-y-3">
                      <div className="text-[10px] font-bold text-indigo-400 mb-1 uppercase">Generated Cards</div>
                      {[0, 1].map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + (i * 0.5), repeat: Infinity, repeatDelay: 3 }}
                          className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-1.5"
                        >
                          <div className="h-1.5 w-1/3 bg-indigo-400/30 rounded" />
                          <div className="h-1.5 w-full bg-slate-700/50 rounded" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-6">
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600 text-[10px] font-black italic tracking-widest text-white animate-bounce shadow-lg shadow-indigo-500/50">
                        PROCESSING...
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: FSRS Science */}
            <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
              <div className="order-last md:order-first relative group">
                <div className="absolute -inset-4 bg-violet-500/10 rounded-[2rem] blur-2xl group-hover:bg-violet-500/20 transition-all" />
                <div className="relative aspect-video rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden p-8 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recall Probability</div>
                        <div className="text-3xl font-black text-white italic">98.4<span className="text-violet-500">%</span></div>
                      </div>
                      <div className="px-3 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase italic">Optimum Interval</div>
                   </div>
                   
                   <div className="flex-1 flex items-end gap-1.5 justify-between py-6">
                      {[40, 60, 45, 80, 55, 90, 70, 95, 85].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.1, duration: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                          className={`w-full rounded-t-sm ${i > 5 ? 'bg-violet-500' : 'bg-slate-800'}`}
                        />
                      ))}
                   </div>

                   <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">FSRS Target</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Traditional</span>
                         </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Stability: 12.4 Days</div>
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-indigo-400/10 flex items-center justify-center border border-indigo-400/20">
                  <Brain className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                  SCIENTIFICALLY OPTIMIZED<br /> RECALL SYSTEMS.
                </h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Memory is a formula, and we've solved it. Memoria uses the <span className="text-white">FSRS (Free Spaced Repetition Scheduler)</span> algorithm 
                  to predict exactly when you're about to forget a concept.
                </p>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-2xl font-black text-indigo-400">2x</div>
                      <div className="text-xs font-bold text-slate-500 uppercase">Faster Learning</div>
                   </div>
                   <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-2xl font-black text-violet-400">95%+</div>
                      <div className="text-xs font-bold text-slate-500 uppercase">Retention Rate</div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="px-6 py-32 text-center overflow-hidden">
           <div className="max-w-7xl mx-auto space-y-20">
             <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">HOW IT WORKS</h2>
                <p className="text-xl text-slate-400 max-w-xl mx-auto font-medium">From zero to mastery in three simple steps.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Connector Line */}
                <div className="hidden md:block absolute top-[25%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent z-0" />
                
                {[
                  { step: "01", title: "Ingest", desc: "Upload notes or paste text. Our AI processes the hierarchy of information.", icon: FileText },
                  { step: "02", title: "Review", desc: "Study using our high-performance 3D engine. Rate your recall status.", icon: Brain },
                  { step: "03", title: "Succeed", desc: "Watch your knowledge level up as the algorithm handles your schedule.", icon: Trophy },
                ].map((item, i) => (
                  <div key={i} className="relative z-10 space-y-6 flex flex-col items-center group">
                    <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-2xl font-black text-indigo-500 transition-all group-hover:border-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                      <item.icon size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{item.title}</h3>
                      <p className="text-slate-400 font-medium px-4">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </section>

        {/* Social Proof Placeholder */}
        <section className="px-6 py-20 border-y border-white/5 bg-slate-900/10">
           <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
              {['Stanford', 'MIT', 'Harvard', 'Microsoft', 'Google'].map((name) => (
                <span key={name} className="text-3xl font-black italic tracking-tighter text-slate-100">{name}</span>
              ))}
           </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32 text-center">
           <div className="max-w-4xl mx-auto p-12 md:p-24 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                   READY TO TRANSFORM<br /> YOUR BRAIN?
                </h2>
                <p className="text-xl text-white/80 font-medium max-w-xl mx-auto">
                   Join the thousands of students, researchers, and polymaths building a permanent knowledge base with Memoria.
                </p>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                  <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-xl font-black bg-white text-indigo-600 border-none hover:bg-slate-100 shadow-xl transition-all hover:scale-105">
                     {isSignedIn ? "OPEN DASHBOARD" : "GET STARTED FOR FREE"}
                  </Button>
                </Link>
                <p className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center justify-center gap-2">
                   <Star className="w-4 h-4" /> Trusted by 50,000+ users worldwide
                </p>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
          <div className="space-y-4">
            <Link href="/" className="text-xl font-black tracking-tighter text-white italic">
               MEMORIA
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed">
              The high-performance study engine for the agentic era. 
              Built on Spaced Repetition Science.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Product</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><Link href="#features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-indigo-400 transition-colors">Study Engine</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-400 transition-colors">FSRS Algorithm</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Company</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Connect</h4>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer">
                 <Globe className="w-4 h-4 text-slate-400" />
               </div>
               <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer">
                 <Smartphone className="w-4 h-4 text-slate-400" />
               </div>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4">
               © 2026 Memoria • All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
