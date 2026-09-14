"use client";
import React, { useState, useRef } from 'react';
import { ImagePlus, X, Loader2, CheckCircle2, AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react';

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
  const [status, setStatus] = useState('idle'); // idle, processing, result, error
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const mockChecks = [
    { id: 1, passed: true, text: 'Metadata matches upload timestamp' },
    { id: 2, passed: true, text: 'No digital manipulation detected' },
    { id: 3, passed: false, text: 'Damage appears inconsistent with claim type' },
  ];

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

  const handleVerify = () => {
    if (!file) return;
    setStatus('processing');
    
    // Simulate processing -> result
    setTimeout(() => {
      if (Math.random() > 0.1) {
        setStatus('result');
      } else {
        setStatus('error');
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-[640px] mx-auto bg-transparent text-[#ededed] p-3 sm:p-5 rounded-[12px] font-sans">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[18px] font-medium tracking-tight text-white">Damage Claim Verifier</h2>
        <p className="text-[13px] text-[#888] mt-1 leading-snug">
          Upload a photo of vehicle or property damage. A two-stage AI pipeline checks evidence quality, flags inconsistencies, and returns a structured verdict — no sign-up required.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-[12px] font-medium text-[#666]">
          <span>Runs in your browser</span>
          <span className="w-1 h-1 bg-[#444] rounded-full"></span>
          <span>Images are not stored</span>
          <span className="w-1 h-1 bg-[#444] rounded-full"></span>
          <span>Free to try</span>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className={`relative flex flex-col items-center justify-center p-4 border border-dashed rounded-[10px] transition-colors ${
          isDragging ? 'border-[#666] bg-[#141414]' : 'border-[#333] hover:border-[#444] bg-[#0a0a0a]'
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
          <div className="flex flex-col items-center cursor-pointer">
            <ImagePlus className="w-6 h-6 text-[#555] mb-2" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-[#ccc]">Drop an image, or click to upload</span>
            <span className="text-[12px] text-[#666] mt-1">JPG or PNG · not stored after processing</span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full aspect-video sm:aspect-[3/1] max-h-[140px] bg-[#121212] rounded-[8px] border border-[#222] overflow-hidden mb-3">
               {preview ? (
                 <img src={preview} alt="Preview" className="w-full h-full object-contain bg-black/40" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                   <ImagePlus className="w-8 h-8 text-[#666]" />
                 </div>
               )}
            </div>
            
            <div className="w-full flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[#ddd] truncate max-w-[250px]">{file.name}</span>
                <span className="text-[13px] text-[#666]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button 
                onClick={handleRemove}
                className="px-3 py-1.5 text-[#666] hover:text-[#eee] hover:bg-[#1a1a1a] rounded-[6px] transition-colors flex items-center gap-2 text-[13px]"
              >
                <X className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Input */}
      <div className="mt-4">
        <label htmlFor="details" className="block text-[12px] font-medium text-[#888] mb-1.5">
          Additional details (optional)
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe the incident or point out specific damage..."
          className="w-full bg-black/40 border border-[#333] rounded-[8px] p-2 text-[13px] text-[#ddd] placeholder:text-[#555] focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all resize-y min-h-[50px]"
        />
      </div>

      {/* Action Area */}
      <div className="mt-4 flex justify-end">
        <button 
          onClick={handleVerify}
          disabled={!file || status === 'processing'}
          className="px-5 py-2 bg-[#ededed] text-black text-[14px] font-medium rounded-[8px] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Run verification
        </button>
      </div>

      {/* Divider */}
      {status !== 'idle' && (
        <div className="h-px w-full bg-[#1f1f1f] my-4" />
      )}

      {/* Results Section */}
      {status === 'processing' && (
        <div className="flex items-center gap-3 text-[14px] text-[#888]">
          <Loader2 className="w-4 h-4 animate-spin text-[#666]" />
          Analyzing image…
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[14px] text-[#f87171]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Something went wrong analyzing this image — please try again.
          </div>
          <button 
            onClick={handleVerify}
            className="text-[13px] font-medium text-[#ededed] bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-[6px] hover:bg-[#222] transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {status === 'result' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[13px] font-medium text-[#666] uppercase tracking-wider">Result</span>
            <StatusPill variant="needs_review" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#111] rounded-[10px] border border-[#1f1f1f]">
              <div className="text-[13px] text-[#666] mb-1">Damage type</div>
              <div className="text-[14px] font-medium text-[#ddd]">Front Bumper Collision</div>
            </div>
            <div className="p-4 bg-[#111] rounded-[10px] border border-[#1f1f1f]">
              <div className="text-[13px] text-[#666] mb-1">Confidence</div>
              <div className="text-[14px] font-medium text-[#ddd]">92.4%</div>
            </div>
          </div>

          <div className="mt-8">
            <span className="text-[13px] font-medium text-[#666] uppercase tracking-wider">Evidence checks</span>
            <div className="mt-4 flex flex-col gap-3.5">
              {mockChecks.map(check => (
                <div key={check.id} className="flex items-start gap-3">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" strokeWidth={2.5} />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#fbbf24] mt-0.5 shrink-0" strokeWidth={2.5} />
                  )}
                  <span className={`text-[14px] leading-relaxed ${check.passed ? 'text-[#aaa]' : 'text-[#ddd]'}`}>
                    {check.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <details className="mt-8 group border border-[#1f1f1f] rounded-[8px] bg-[#111] [&_summary::-webkit-details-marker]:hidden">
            <summary className="list-none flex items-center justify-between p-4 cursor-pointer text-[13px] font-medium text-[#888] hover:text-[#aaa] transition-colors select-none">
              View model reasoning
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
            </summary>
            <div className="p-4 pt-0 text-[14px] text-[#888] leading-relaxed border-t border-[#1f1f1f] mt-2">
              The image exhibits clear structural deformation to the front bumper and left headlight assembly. However, the shadow angles in the exif data slightly mismatch the stated time of accident. The severity of the damage is consistent with a low-speed impact, but manual review is flagged due to the metadata anomaly.
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
