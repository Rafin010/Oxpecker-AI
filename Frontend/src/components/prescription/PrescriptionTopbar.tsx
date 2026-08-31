"use client";

import React from "react";
import { Save, Check, Mic, Search, History, Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface PrescriptionTopbarProps {
  onFinalize: () => void;
  onPreview: () => void;
  activeTab?: "prescription" | "report";
  onTabChange?: (tab: "prescription" | "report") => void;
}

export function PrescriptionTopbar({ onFinalize, onPreview, activeTab = "prescription", onTabChange }: PrescriptionTopbarProps) {
  const searchParams = useSearchParams();
  const patientName = searchParams?.get('patientName') || "Select Patient";
  const patientId = searchParams?.get('patientId') || "N/A";
  const appointmentTime = searchParams?.get('appointmentTime') || "Quick Consult";
  const doctorName = "Dr. Patient"; // Mock context
  const clinicName = "ABC Medical Center"; // Mock context

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-none rounded-t-[32px] px-4 md:px-6 py-3 min-h-[72px] flex flex-col md:flex-row items-center justify-between shrink-0 shadow-sm z-30 gap-4 md:gap-0 relative">
      
      {/* Left Section - Title */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-slate-200 text-[16px] md:text-[18px]">Doctor Workspace</h2>
          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200 hidden sm:block">Draft</span>
        </div>
        
        {/* On mobile, show actions here if needed, or just let them wrap */}
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto justify-end">
        {/* Workspace Tabs - Professional Segmented Control */}
        {onTabChange && (
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800/60 shadow-inner w-full md:w-auto">
            <button
              onClick={() => onTabChange("prescription")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-[13.5px] font-bold transition-all duration-300 ${
                activeTab === "prescription" 
                  ? "bg-slate-900 text-sky-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              Prescription
            </button>
            <button
              onClick={() => onTabChange("report")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-[13.5px] font-bold transition-all duration-300 ${
                activeTab === "report" 
                  ? "bg-slate-900 text-sky-400 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              Test Reports
            </button>
          </div>
        )}
        
        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {patientName === "Select Patient" && (
            <button className="flex items-center gap-2 text-[13px] font-bold text-sky-400 bg-sky-900/40 px-4 py-2 rounded-xl hover:bg-sky-800/60 transition-all shrink-0">
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          )}

          <button className="flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors shrink-0">
            <History size={16} />
            <span className="hidden lg:inline">History</span>
          </button>

          <button className="flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors shrink-0">
            <Mic size={16} />
            <span className="hidden lg:inline">Voice</span>
          </button>
          
          <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden md:block"></div>
          
          <button 
            onClick={() => toast.success("Draft Saved")}
            className="flex items-center gap-2 text-[13px] font-bold text-slate-300 bg-slate-900 border border-slate-800 shadow-sm px-4 py-2 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition-all active:scale-95 shrink-0"
          >
            <Save size={16} className="text-sky-400" />
            <span className="hidden sm:inline">Save</span>
          </button>
          
          <button 
            onClick={onPreview} 
            className="flex items-center gap-2 text-[13px] font-bold text-white bg-slate-800 shadow-none border border-slate-700 px-4 py-2 rounded-xl hover:bg-slate-700 transition-all active:scale-95 shrink-0"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          
          <button 
            onClick={onFinalize} 
            className="flex items-center gap-2 text-[13px] font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 font-bold  px-5 py-2 rounded-xl hover:bg-[#5bc95c] transition-all active:scale-95 shrink-0"
          >
            <Check size={16} strokeWidth={3} />
            <span>Finalize</span>
          </button>
        </div>
      </div>
    </div>
  );
}
