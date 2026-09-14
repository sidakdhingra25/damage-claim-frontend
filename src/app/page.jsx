"use client";
import { motion } from 'framer-motion';
import DamageClaimVerifier from '@/components/DamageClaimVerifier';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-neutral-200 font-sans relative overflow-x-hidden flex flex-col">
      {/* Film grain noise overlay */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.04] z-50 mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: 'url("/image.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="text-neutral-200 font-semibold text-sm tracking-tight">
            SD
          </div>
        </div>
        <a href="#" className="text-[13px] font-medium text-neutral-200 hover:text-white transition-colors">
          Back to portfolio
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center py-2 px-4 sm:px-6">
        
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
          className="max-w-2xl w-full text-center flex flex-col items-center mt-0 mb-4"
        >
          <span className="text-[12px] font-medium tracking-wide uppercase text-teal-400 mb-2 border border-teal-500/20 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.1)]">
            Live demo · AI agent
          </span>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-white mb-2 leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Verify damage claims in seconds
          </h1>
        </motion.div>

        {/* Browser Window Frame for Component */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.165, 0.84, 0.44, 1] }}
          className="w-full max-w-[680px] rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,1)] relative z-20 group transition-transform duration-500 hover:-translate-y-1 mb-6"
        >
          
          {/* Top Bar */}
          <div className="h-[32px] bg-black/40 border-b border-white/10 flex items-center px-4 relative rounded-t-xl">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] opacity-80"></div>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 ml-2 flex items-center justify-center w-[160px] sm:w-auto">
              <div className="w-full px-3 sm:px-10 py-1 bg-black/50 border border-white/10 rounded-md text-[10px] sm:text-[11px] font-medium text-neutral-300 flex items-center justify-center gap-1.5 sm:gap-2 shadow-inner shadow-black/20">
                <svg className="w-3 h-3 opacity-80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                <span className="truncate">damage-claim-verifier.app</span>
              </div>
            </div>
          </div>

          {/* Component Container */}
          <div className="p-2 sm:p-4 bg-transparent rounded-b-xl flex items-center justify-center">
            {/* The component already has max-w-[640px], we just embed it seamlessly */}
            <div className="w-full">
              <DamageClaimVerifier />
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
          className="max-w-4xl w-full flex flex-col items-center relative z-20 mb-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white font-medium mb-2 shadow-lg backdrop-blur-md text-xs">
                1
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 drop-shadow-md">Upload</h3>
              <p className="text-neutral-300 text-[12px] leading-snug drop-shadow-md">Drop in a photo of the damage, no account needed.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white font-medium mb-2 shadow-lg backdrop-blur-md text-xs">
                2
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 drop-shadow-md">AI analysis</h3>
              <p className="text-neutral-300 text-[12px] leading-snug drop-shadow-md">A two-stage pipeline checks evidence quality and cross-references.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white font-medium mb-2 shadow-lg backdrop-blur-md text-xs">
                3
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 drop-shadow-md">Structured verdict</h3>
              <p className="text-neutral-300 text-[12px] leading-snug drop-shadow-md">Get a confidence score, flagged issues, and the model's reasoning.</p>
            </div>
          </div>
        </motion.div> */}


      </main>
    </div>
  );
}
