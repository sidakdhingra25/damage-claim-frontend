"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Loader2, CheckCircle2, AlertTriangle, AlertCircle, ChevronRight, Info } from 'lucide-react';

const StatusPill = ({ variant = 'needs_review' }) => {
  const config = {
    approved: { label: 'Approved', classes: 'bg-[#052e16] text-[#4ade80] border-[#14532d]' },
    needs_review: { label: 'Needs review', classes: 'bg-[#291700] text-[#fbbf24] border-[#4d2b00]' },
    flagged: { label: 'Flagged', classes: 'bg-[#3e0b0b] text-[#f87171] border-[#5c1010]' },
  };
  const { label, classes } = config[variant] || config.needs_review;
  
  return (
    <span className={`px-2.5 py-1 text-[12px] font-medium rounded-full border ${classes}`}>
      {label}
    </span>
  );
};

export default function DamageClaimVerifier() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [details, setDetails] = useState('');
  const [claimObject, setClaimObject] = useState('car');
  const [status, setStatus] = useState('idle'); // idle, processing, result, error
  const [resultData, setResultData] = useState(null);
  const [uiChecks, setUiChecks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEvidenceDropdownOpen, setIsEvidenceDropdownOpen] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (status === 'result' && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150); // slight delay to allow the layout to expand
    }
  }, [status]);

  // Ghost ping to wake up Render free tier on component mount
  useEffect(() => {
    const API_URL = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:8000/ping' 
      : `${process.env.BACKEND_URL}/ping`;
    fetch(API_URL).catch(() => {}); // silently fail if server is unreachable
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFile = e.dataTransfer.files[0];
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
      setStatus('idle');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
      setStatus('idle');
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVerify = async () => {
    if (!file) return;
    setStatus('processing');
    setResultData(null);
    setIsWakingUp(false);
    
    // Timer to update UI if server takes too long to wake up
    const wakeUpTimer = setTimeout(() => {
      setIsWakingUp(true);
    }, 8000);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_claim', details || 'No details provided');
      formData.append('claim_object', claimObject);

      const API_URL = process.env.NODE_ENV === 'development' 
        ? 'http://127.0.0.1:8000/verify-claim' 
        : `${process.env.BACKEND_URL}/verify-claim`;

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.detail === 'MALICIOUS_PROMPT_DETECTED') {
            setStatus('malicious');
            return;
          }
        }
        throw new Error('API response was not ok');
      }

      const data = await response.json();
      setResultData(data);
      
      const checks = [
        { id: 1, passed: data.valid_image === 'true', text: data.valid_image === 'true' ? 'Image quality is acceptable' : 'Image is blurry or unusable' },
        { id: 2, passed: data.evidence_standard_met === 'true', text: data.evidence_standard_met === 'true' ? 'Meets required evidence minimums' : 'Does not meet evidence minimums' }
      ];
      
      const riskFlags = data.risk_flags ? data.risk_flags.split(';') : [];
      if (riskFlags.includes('manual_review_required')) {
        checks.push({ id: 3, passed: false, text: 'Requires manual review due to risk flags' });
      } else {
         checks.push({ id: 3, passed: true, text: 'No high-risk flags detected' });
      }
      
      setUiChecks(checks);
      setStatus('result');
      
    } catch (error) {
      console.error("Verification failed:", error);
      setStatus('error');
    } finally {
      clearTimeout(wakeUpTimer);
    }
  };

  return (
    <div className="w-full h-full bg-transparent text-[#ededed] font-sans flex flex-col rounded-b-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-white/5">
        <h2 className="text-[18px] font-medium tracking-tight text-white">Damage Claim Verifier</h2>
        <p className="text-[13px] text-[#888] mt-1 leading-snug max-w-2xl">
          Upload a photo of vehicle or property damage. A two-stage AI pipeline checks evidence quality, flags inconsistencies, and returns a structured verdict — no sign-up required.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-[12px] font-medium text-[#666]">
          <span>Runs in your browser</span>
          <span className="w-1 h-1 bg-[#444] rounded-full"></span>
          <span>Images are not stored</span>
          <span className="w-1 h-1 bg-[#444] rounded-full"></span>
          <span>Free to try</span>
        </div>

        <div className="mt-4 p-3 bg-zinc-500/10 border border-zinc-500/20 rounded-[8px] flex items-start gap-2.5 max-w-2xl">
          <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[12.5px] text-zinc-300 leading-snug">
            <strong>Heads up:</strong> The backend is hosted on a free Render tier that sleeps when inactive. Your very first claim may take 40–50 seconds to wake the server up, but all requests after that will be instant!
          </p>
        </div>
      </div>

      <div className="w-full flex-1 mt-3 flex flex-col md:grid md:grid-cols-[280px_1fr] md:min-h-[500px]">
        
        {/* --- LEFT COLUMN (Inputs) --- */}
        <div className={`p-4 sm:p-5 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/5 ${['processing', 'result', 'error'].includes(status) ? 'hidden md:flex' : 'flex'}`}>
          
          {/* File Upload Area */}
          <div 
            className={`relative w-full rounded-xl border-2 border-dashed transition-all p-4 ${
              isDragging ? 'border-teal-500 bg-teal-500/5' : 'border-[#333] hover:border-[#555] bg-black/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="image/jpeg, image/png"
            />
            
            {!file ? (
              <div className="flex flex-col items-center cursor-pointer text-center py-2">
                <ImagePlus className="w-6 h-6 text-[#555] mb-2" strokeWidth={1.5} />
                <span className="text-[13px] font-medium text-[#ccc] leading-tight">Drop an image, or click</span>
                <span className="text-[11px] text-[#666] mt-1">JPG or PNG</span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full aspect-[4/3] max-h-[120px] bg-[#121212] rounded-[8px] border border-[#222] overflow-hidden mb-3">
                   {preview ? (
                     <img src={preview} alt="Preview" className="w-full h-full object-contain bg-black/40" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <ImagePlus className="w-8 h-8 text-[#666]" />
                     </div>
                   )}
                </div>
                <div className="w-full flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
                  <div className="flex flex-col overflow-hidden mr-2">
                    <span className="text-[12px] font-medium text-[#ddd] truncate w-full">{file.name}</span>
                    <span className="text-[11px] text-[#666]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <button 
                    onClick={handleRemove}
                    className="p-1.5 text-[#666] hover:text-[#eee] hover:bg-[#1a1a1a] rounded-[6px] transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Details Input */}
          <div className="w-full">
            <label htmlFor="details" className="block text-[12px] font-medium text-[#888] mb-1.5">
              Explain your issue
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the incident"
              className="w-full h-[60px] min-h-[60px] bg-black/40 border border-[#333] rounded-[8px] px-3 py-2 text-[13px] text-[#ddd] placeholder:text-[#555] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all resize-y"
            />
          </div>

          {/* Object Type (Segmented Control) */}
          <div className="w-full relative z-20">
            <label className="block text-[12px] font-medium text-[#888] mb-1.5">
              Object type
            </label>
            <div className="flex bg-black/5 backdrop-blur-xl border border-white/10 rounded-full p-[4px] relative shadow-inner shadow-black/20">
              
              {/* Active Slider */}
              <div
                className="absolute top-[4px] bottom-[4px] w-[calc((100%-8px)/3)] bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translateX(${
                    claimObject === 'car' ? '0%' : 
                    claimObject === 'laptop' ? '100%' : 
                    '200%'
                  })`
                }}
              />

              {['car', 'laptop', 'package'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setClaimObject(option)}
                  className={`flex-1 relative z-10 py-[7px] text-[12.5px] font-medium rounded-full capitalize transition-colors duration-200 ${
                    claimObject === option 
                      ? 'text-white drop-shadow-sm' 
                      : 'text-[#777] hover:text-[#bbb]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-auto pt-4 flex">
            <button 
              onClick={handleVerify}
              disabled={!file || status === 'processing'}
              className="w-full py-2 bg-[#ededed] text-black text-[13px] font-semibold rounded-[8px] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Run verification
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Results/Status) --- */}
        <div className={`relative p-4 sm:p-5 flex flex-col ${status === 'idle' ? 'hidden md:flex items-center justify-center bg-white/[0.02]' : 'flex'}`}>
          
          {/* Mobile Back Button */}
          {status !== 'idle' && (
            <button 
              className="md:hidden self-start mb-4 text-[#888] text-[13px] flex items-center gap-1.5 hover:text-white transition-colors"
              onClick={() => setStatus('idle')}
            >
              ← Back to submit
            </button>
          )}

          {status === 'idle' && (
            <div className="text-center flex flex-col items-center opacity-40">
              <CheckCircle2 className="w-8 h-8 text-[#555] mb-3" strokeWidth={1} />
              <p className="text-[#888] text-[13px] max-w-[220px] leading-relaxed">
                Upload an image and run verification to see the results here.
              </p>
            </div>
          )}

          {status === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#888] min-h-[300px] px-4 text-center">
              <Loader2 className="w-5 h-5 animate-spin text-[#666]" />
              <span className="text-[13px] font-medium tracking-wide">
                {isWakingUp ? 'Waking up the AI server...' : 'Analyzing image…'}
              </span>
              {isWakingUp && (
                <span className="text-[12px] text-[#666] mt-1 max-w-[240px]">
                  Since this uses a free-tier backend, this first request may take ~40 seconds. Hang tight!
                </span>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[300px]">
              <div className="w-10 h-10 rounded-full bg-[#f87171]/10 flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5 text-[#f87171]" />
              </div>
              <p className="text-[13px] text-[#f87171] text-center max-w-[240px]">
                Something went wrong analyzing this image.
              </p>
              <button 
                onClick={handleVerify}
                className="mt-2 text-[13px] font-medium text-[#ededed] bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-[6px] hover:bg-[#222] transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {status === 'malicious' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/30 flex items-center justify-center mb-2 animate-[pulse_2s_ease-in-out_infinite]">
                <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
              </div>
              <h3 className="text-[14px] font-bold text-[#ef4444] text-center uppercase tracking-[0.1em]">
                Security Alert
              </h3>
              <p className="text-[13.5px] text-[#ef4444]/90 text-center max-w-[280px] leading-relaxed">
                Malicious prompt or system override attempt detected. Your request has been blocked.
              </p>
              <button 
                onClick={() => { setStatus('idle'); setDetails(''); }}
                className="mt-4 text-[13px] font-medium text-[#ededed] bg-[#1a1a1a] border border-[#333] px-5 py-2.5 rounded-[6px] hover:bg-[#222] transition-colors"
              >
                Acknowledge
              </button>
            </div>
          )}

          {status === 'result' && resultData && (
            <motion.div 
              ref={resultRef}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 overflow-y-auto pr-1"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f1f1f]">
                <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wider">Verification Result</span>
                <StatusPill variant={
                  resultData.claim_status === 'supported' ? 'approved' : 
                  resultData.claim_status === 'not_enough_information' ? 'needs_review' : 'flagged'
                } />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 bg-[#111] rounded-[8px] border border-[#1f1f1f]">
                  <div className="text-[12px] text-[#666] mb-1">Damage type</div>
                  <div className="text-[13px] font-medium text-[#ddd] capitalize leading-snug">
                    {resultData.issue_type === 'none' ? 'No damage' : `${resultData.issue_type.replace(/_/g, ' ')} (${resultData.object_part.replace(/_/g, ' ')})`}
                  </div>
                </div>
                <div className="p-3.5 bg-[#111] rounded-[8px] border border-[#1f1f1f]">
                  <div className="text-[12px] text-[#666] mb-1">Severity</div>
                  <div className="text-[13px] font-medium text-[#ddd] capitalize">{resultData.severity}</div>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wider mb-3 block">Evidence checks</span>
                <div className="flex flex-col gap-3">
                  {uiChecks.map(check => (
                    <div key={check.id} className="flex items-start gap-2.5">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#22c55e] mt-[2px] shrink-0" strokeWidth={2.5} />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#fbbf24] mt-[2px] shrink-0" strokeWidth={2.5} />
                      )}
                      <span className={`text-[13px] leading-relaxed ${check.passed ? 'text-[#aaa]' : 'text-[#ddd]'}`}>
                        {check.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#1f1f1f] rounded-[8px] bg-[#111] mb-2">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between p-3.5 cursor-pointer text-[12px] font-medium text-[#888] hover:text-[#aaa] transition-colors select-none"
                >
                  View model reasoning
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 pt-0 text-[13px] text-[#888] leading-relaxed">
                        <div className="border-t border-[#1f1f1f] pt-3">
                          {resultData.claim_status_justification}
                          {resultData.risk_flags && resultData.risk_flags !== 'none' && (
                            <div className="mt-3 text-[#fbbf24] p-2 bg-[#fbbf24]/5 rounded text-[12px]">
                              <strong>Risk Flags:</strong> {resultData.risk_flags.replace(/;/g, ', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Evidence Verification Dropdown */}
              <div className="border border-[#1f1f1f] rounded-[8px] bg-[#111] mb-2">
                <button 
                  onClick={() => setIsEvidenceDropdownOpen(!isEvidenceDropdownOpen)}
                  className="w-full flex items-center justify-between p-3.5 cursor-pointer text-[12px] font-medium text-[#888] hover:text-[#aaa] transition-colors select-none"
                >
                  View evidence verification
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isEvidenceDropdownOpen ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {isEvidenceDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 pt-0 text-[13px] text-[#888] leading-relaxed">
                        <div className="border-t border-[#1f1f1f] pt-3 text-[#38bdf8]">
                          <strong>Verdict:</strong> {resultData.evidence_standard_met_reason}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
