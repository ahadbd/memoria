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
  Globe,
  Star,
  Trophy,
  Keyboard,
  Clock,
  Target,
  Flame,
  ArrowRight,
  Check
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
                No credit card required • 100% free
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
                  Don't waste hours manually typing flashcards. Simply paste your notes or text, and our 
                  <span className="text-white"> Gemini-powered engine</span> will extract the most critical concepts into a high-quality study set.
                </p>
                <ul className="space-y-3">
                  {['Intelligent Context Extraction', 'Real-Time Streaming Generation', 'Multi-Language Support'].map((item) => (
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

            {/* Feature 3: Study Experience (NEW) */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                  <Keyboard className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                  BUILT FOR SPEED.<br /> DESIGNED FOR FLOW.
                </h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Our study engine is designed to keep you in <span className="text-white">deep focus</span>. 
                  Keyboard shortcuts, live progress tracking, and instant feedback keep your flow state unbroken.
                </p>
                <ul className="space-y-3">
                  {[
                    'Keyboard Shortcuts (Space / 1-4)',
                    'Live Session Stats & Timer', 
                    '3D Animated Card Flip',
                    'Detailed Completion Reports',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[2rem] blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative aspect-video rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-slate-400">Card <span className="text-white">3</span> of <span className="text-white">10</span></div>
                    <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" animate={{ width: ["0%", "30%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div 
                      className="w-3/4 aspect-[16/10] rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-xl"
                      animate={{ rotateY: [0, 180, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <span className="text-lg font-bold text-slate-300">Hei → Hello</span>
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {["😓", "😐", "😊", "🤩"].map((emoji, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center text-lg">
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Analytics & Gamification (NEW) */}
            <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
              <div className="order-last md:order-first relative group">
                <div className="absolute -inset-4 bg-cyan-500/10 rounded-[2rem] blur-2xl group-hover:bg-cyan-500/20 transition-all" />
                <div className="relative aspect-video rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Your Analytics</div>
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20">
                      <Flame size={12} className="text-orange-400" />
                      <span className="text-[10px] font-black text-orange-400">7 DAY STREAK</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 my-4">
                    {[
                      { label: "Cards Studied", value: "247", color: "text-indigo-400" },
                      { label: "Avg Rating", value: "3.2", color: "text-emerald-400" },
                      { label: "Mastery", value: "78%", color: "text-violet-400" },
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-xl bg-slate-800/50 text-center">
                        <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-[9px] font-bold text-slate-600 uppercase">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[3, 5, 2, 8, 6, 10, 7, 12, 9, 15, 11, 8].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-indigo-500/60 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 6}%` }}
                        transition={{ delay: i * 0.08, duration: 0.8 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                  TRACK YOUR GROWTH.<br /> OWN YOUR DATA.
                </h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  See exactly how your knowledge is growing. Detailed analytics show your <span className="text-white">review history, mastery progression, and study patterns</span> so you can optimize your learning.
                </p>
                <ul className="space-y-3">
                  {[
                    'Personal Analytics Dashboard',
                    'Streak Tracking & Gamification',
                    'Global Leaderboard',
                    'Per-Deck Mastery Progress',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
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
                  { step: "01", title: "Ingest", desc: "Upload notes or paste text. Our AI processes the hierarchy of information and generates flashcards.", icon: FileText },
                  { step: "02", title: "Review", desc: "Study using our high-performance 3D engine with keyboard shortcuts. Rate your recall with a single keystroke.", icon: Brain },
                  { step: "03", title: "Succeed", desc: "Watch your knowledge grow with analytics as the FSRS algorithm handles your optimal schedule.", icon: Trophy },
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

        {/* Pricing Section (NEW) */}
        <section id="pricing" className="px-6 py-32 bg-slate-950/40">
          <div className="max-w-5xl mx-auto space-y-16 text-center">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">SIMPLE PRICING</h2>
              <p className="text-xl text-slate-400 max-w-xl mx-auto font-medium">Everything you need to master any subject. No hidden fees.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free Plan */}
              <div className="relative p-8 rounded-3xl border-2 border-indigo-500/50 bg-gradient-to-b from-indigo-500/5 to-transparent space-y-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-indigo-600 text-xs font-black uppercase tracking-widest text-white">Most Popular</span>
                </div>
                <div className="space-y-2 pt-2">
                  <h3 className="text-2xl font-black text-white">Free Forever</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-white">$0</span>
                    <span className="text-slate-500 font-bold">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 text-left">
                  {[
                    'Unlimited decks & flashcards',
                    'AI-powered card generation',
                    'FSRS 5.0 spaced repetition',
                    '3D study engine + keyboard shortcuts',
                    'Personal analytics dashboard',
                    'Streak tracking & leaderboard',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                      <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                  <Button className="w-full rounded-full h-12 font-black text-base bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25">
                    {isSignedIn ? "Go to Dashboard" : "Get Started"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Pro Plan (Coming Soon) */}
              <div className="relative p-8 rounded-3xl border border-slate-800 bg-slate-900/30 space-y-6 opacity-80">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-slate-800 text-xs font-black uppercase tracking-widest text-slate-400">Coming Soon</span>
                </div>
                <div className="space-y-2 pt-2">
                  <h3 className="text-2xl font-black text-white">Pro</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-white">$9</span>
                    <span className="text-slate-500 font-bold">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 text-left">
                  {[
                    'Everything in Free',
                    'PDF & document upload',
                    'Image occlusion cards',
                    'AI tutor chat per deck',
                    'Advanced analytics & heatmaps',
                    'Priority support',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-500">
                      <Check className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button disabled className="w-full rounded-full h-12 font-black text-base" variant="outline">
                  Notify Me
                </Button>
              </div>
            </div>
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
                   Join students and lifelong learners building a permanent knowledge base with Memoria.
                </p>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                  <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-xl font-black bg-white text-indigo-600 border-none hover:bg-slate-100 shadow-xl transition-all hover:scale-105">
                     {isSignedIn ? "OPEN DASHBOARD" : "GET STARTED FOR FREE"}
                  </Button>
                </Link>
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
              <li><Link href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-400 transition-colors">FSRS Algorithm</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Resources</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Open Source</h4>
            <div className="flex gap-4">
               <a href="https://github.com/ahadbd/memoria" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer">
                 <Globe className="w-4 h-4 text-slate-400" />
               </a>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4">
               © 2026 Memoria • MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
