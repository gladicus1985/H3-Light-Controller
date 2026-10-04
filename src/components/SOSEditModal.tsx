import React, { useState } from 'react';
import { X, Check, ShieldAlert } from 'lucide-react';

export interface SOSConfig {
  speed: number;
  brightness: number;
}

interface SOSEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SOSConfig;
  onSave: (newConfig: SOSConfig) => void;
}

export const SOSEditModal: React.FC<SOSEditModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<SOSConfig>({ ...config });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#161a22] border-2 border-[#2c3544] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1e232e] border-b border-[#2c3544] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide uppercase">SOS Flash Settings</h2>
              <p className="text-xs text-slate-400">Configure strobe speed & brightness (lights retain their previously selected colors)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#282f3c] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-5 space-y-5">
          {/* Strobe Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Flash Frequency / Speed
              </label>
              <span className="text-xs font-mono text-amber-400 font-bold">{formData.speed} ms</span>
            </div>
            <input
              type="range"
              min="80"
              max="500"
              step="10"
              value={formData.speed}
              onChange={(e) => setFormData({ ...formData, speed: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Hyper Fast (80ms)</span>
              <span>Standard SOS (250ms)</span>
              <span>Slow Pulse (500ms)</span>
            </div>
          </div>

          {/* Brightness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Output Brightness
              </label>
              <span className="text-xs font-mono text-amber-400 font-bold">{formData.brightness}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={formData.brightness}
              onChange={(e) => setFormData({ ...formData, brightness: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed bg-[#1b202a] p-3 rounded-xl border border-[#2c3544]">
            Note: Activating SOS applies strobe flashing to all active channels while preserving each individual light's previously configured color.
          </p>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#2c3544] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#222936] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-[#323d4e] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save SOS Config</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
