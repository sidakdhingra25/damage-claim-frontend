"use client";
import { motion } from 'framer-motion';
import DamageClaimVerifier from '@/components/DamageClaimVerifier';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#161616] text-neutral-200 font-sans relative overflow-x-hidden flex flex-col items-center">

      {/* --- HEADER --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex items-center justify-between px-6 py-6 max-w-[1200px] w-full mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="text-white font-semibold text-[15px] tracking-tight">
            SD
          </div>
        </div>

        <a href="#" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
          To my portfolio
        </a>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex-1 flex flex-col w-full items-center">

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mt-12 sm:mt-24 px-4 mb-16 sm:mb-24 w-full"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#666] mb-8">
            AI-Powered Assessment
          </span>

          <h1 className="text-[40px] sm:text-[68px] font-bold tracking-tight text-white mb-6 leading-[1.05] max-w-[800px]">
            Your damage claims deserve a fast <span className="text-[#38bdf8] italic font-serif tracking-normal">resolution.</span>
          </h1>

          <p className="text-[16px] sm:text-[19px] text-[#888] mb-10 leading-relaxed max-w-[640px] mx-auto">
            You shouldn't have to wait weeks for a manual assessment<br className="hidden sm:block" />
            of property or vehicle damage. ClaimAI analyzes every detail<br className="hidden sm:block" />
            from your photos — instantly, accurately, and securely.
          </p>

          <div className="flex flex-col items-center gap-4 mt-2">
            <button 
              onClick={() => document.getElementById('agent-container')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center justify-center gap-2 px-10 py-4 bg-white text-black font-semibold text-[15px] rounded-full hover:bg-[#f5f5f5] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] ring-1 ring-white/20"
            >
              Try the AI Agent
            </button>
          </div>

          <div className="mt-8 text-[12.5px] text-[#555]">
            Browser-based · Instant results · No account required
          </div>
        </motion.div>

        {/* --- CLOUD BACKGROUND CONTAINER --- */}
        <div id="agent-container" className="w-full relative flex justify-center px-0 flex-1">
          <div className="w-full max-w-[1440px] relative flex flex-col overflow-hidden rounded-t-[40px] sm:rounded-t-[60px]">
            
            <div 
              className="absolute inset-x-0 top-0 h-[200vh] min-h-[1500px] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/bg image.png')" }}
            ></div>

            {/* Component Wrapper inside cloud background */}
            <div className="relative z-10 w-full flex justify-center pt-16 pb-32 sm:pt-24 sm:pb-40 px-4 flex-1">

              {/* Browser Window Frame for Component */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.165, 0.84, 0.44, 1] }}
                className="w-full max-w-[940px] rounded-xl border border-[#333]/50 bg-black/60 backdrop-blur-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative z-20 flex flex-col"
              >
                {/* Top Bar macOS style */}
                <div className="h-[40px] bg-[#1a1a1a]/80 border-b border-white/5 flex items-center px-4 relative rounded-t-xl shrink-0">
                  <div className="flex gap-2">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#ef4444]"></div>
                    <div className="w-[11px] h-[11px] rounded-full bg-[#f59e0b]"></div>
                    <div className="w-[11px] h-[11px] rounded-full bg-[#22c55e]"></div>
                  </div>

                  {/* Simulated mic indicator */}
                  <div className="absolute right-4 flex items-center gap-3">
                    <div className="flex items-center gap-[3px] opacity-80">
                      {[...Array(14)].map((_, i) => (
                        <div key={i} className={`w-[2.5px] bg-[#e26d5a] rounded-full ${i % 2 === 0 ? (i % 4 === 0 ? 'h-3.5' : 'h-2') : 'h-1.5'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Component Container */}
                <div className="p-0 sm:p-1 bg-transparent rounded-b-xl flex-1 flex">
                  <div className="w-full">
                    <DamageClaimVerifier />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
