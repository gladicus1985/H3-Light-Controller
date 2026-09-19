import React, { useState } from 'react';
import { ChannelConfig, SwitchMode, LightZoneCategory } from '../types';
import {
  X,
  Check,
  Zap,
  SunMedium,
  Eye,
  Compass,
  Tent,
  Flame,
  Radio,
  Gauge,
  Box,
  Lightbulb,
  Wind,
  Sparkles,
  ShieldAlert,
  Power,
  PowerOff,
  Siren,
  Sun,
  Moon,
  AlertTriangle,
  Activity,
  Volume2,
  Disc,
  Sliders,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ChannelEditModalProps {
  channel: ChannelConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedChannel: ChannelConfig) => void;
  onLiveUpdate?: (updatedChannel: ChannelConfig) => void;
}

const PRESET_COLORS = [
  { label: 'Navy Blue', value: '#000080' },
  { label: 'White', value: '#F8FAFC' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Warm', value: '#FEF08A' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Green', value: '#10B981' },
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Purple', value: '#A855F7' },
];

const AVAILABLE_ICONS = [
  { name: 'SunMedium', label: 'Lightbar', icon: SunMedium },
  { name: 'Zap', label: 'Pods / Spot', icon: Zap },
  { name: 'Eye', label: 'Fogs', icon: Eye },
  { name: 'Compass', label: 'Ditch', icon: Compass },
  { name: 'Sparkles', label: 'Rock Lights', icon: Sparkles },
  { name: 'Tent', label: 'Camp Scene', icon: Tent },
  { name: 'Flame', label: 'Dust Chase', icon: Flame },
  { name: 'Radio', label: 'Reverse', icon: Radio },
  { name: 'ShieldAlert', label: 'Cab Markers', icon: ShieldAlert },
  { name: 'Siren', label: 'Strobes', icon: Siren },
  { name: 'Sun', label: 'Roof Flood', icon: Sun },
  { name: 'Moon', label: 'Night / Amber', icon: Moon },
  { name: 'Gauge', label: 'Cockpit', icon: Gauge },
  { name: 'Lightbulb', label: 'Dome', icon: Lightbulb },
  { name: 'Box', label: 'Cargo', icon: Box },
  { name: 'Wind', label: 'Compressor', icon: Wind },
  { name: 'AlertTriangle', label: 'Warning', icon: AlertTriangle },
  { name: 'Power', label: 'Aux Power', icon: Power },
  { name: 'Activity', label: 'Beacon', icon: Activity },
  { name: 'Volume2', label: 'Air Horn', icon: Volume2 },
  { name: 'Disc', label: 'Winch', icon: Disc },
  { name: 'Sliders', label: 'PWM Dim', icon: Sliders },
];

export const ChannelEditModal: React.FC<ChannelEditModalProps> = ({
  channel,
  isOpen,
  onClose,
  onSave,
  onLiveUpdate,
}) => {
  if (!isOpen || !channel) return null;

  const [formData, setFormData] = useState<ChannelConfig>({ ...channel });

  const updateFormData = (patch: Partial<ChannelConfig>) => {
    setFormData((prev) => {
      const next = { ...prev, ...patch };
      onLiveUpdate?.(next);
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-[#0e1117] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d3440] bg-[#161a22]">
          <div className="flex items-center gap-2.5">
            {/* Live preview of the channel's selectable icon */}
            <div className="w-8 h-8 rounded-md bg-[#242a35] text-white flex items-center justify-center border border-[#3b4455]">
              {React.createElement((LucideIcons as any)[formData.iconName] || Zap, { className: 'w-4 h-4' })}
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {formData.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#252b37] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Enable / Disable Channel Toggle & Live Preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Light Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${formData.isEnabled !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
                  {formData.isEnabled !== false ? 'ACTIVE / ENABLED' : 'DISABLED / INACTIVE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formData.isEnabled !== false
                  ? 'Channel is active on vehicle switch panel.'
                  : 'Disabled light is fully hidden from schematic panel.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="toggle-channel-preview-on"
                aria-label={formData.isOn ? 'Turn Light Off' : 'Turn Light On'}
                onClick={() => {
                  updateFormData({ isOn: !formData.isOn });
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md
                  ${
                    formData.isOn
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-1 ring-amber-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }
                `}
                title="Toggle light on to preview brightness and strobe on the illustration"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{formData.isOn ? 'Light ON' : 'Light OFF'}</span>
              </button>
              <button
                type="button"
                id="toggle-channel-enabled"
                aria-label={formData.isEnabled !== false ? 'Disable Light' : 'Enable Light'}
                onClick={() => {
                  const nextEnabled = formData.isEnabled === false ? true : false;
                  updateFormData({
                    isEnabled: nextEnabled,
                    isOn: nextEnabled ? formData.isOn : false,
                  });
                }}
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md
                  ${
                    formData.isEnabled !== false
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-1 ring-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/40'
                  }
                `}
              >
                {formData.isEnabled !== false ? (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    <span>Enabled</span>
                  </>
                ) : (
                  <>
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Channel Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
              placeholder="e.g. 50 Inch Lightbar"
              required
            />
          </div>

          {/* Category & Switch Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Zone / Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  updateFormData({ category: e.target.value as LightZoneCategory })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="exterior-front">Front Exterior</option>
                <option value="exterior-side">Side Exterior</option>
                <option value="exterior-rear">Rear Exterior</option>
                <option value="interior">Interior Cabin</option>
                <option value="accessory">Aux / Accessory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Trigger Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => {
                  const newMode = e.target.value as SwitchMode;
                  updateFormData({ mode: newMode, isOn: true });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="toggle">Standard Toggle (On / Off)</option>
                <option value="momentary">Momentary (Hold to Activate)</option>
                <option value="strobe">Strobe / Emergency Flash</option>
              </select>
            </div>
          </div>

          {/* Strobe speed adjustment if strobe mode is selected */}
          {formData.mode === 'strobe' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Siren className="w-4 h-4 text-amber-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-amber-300">Strobe Animation Active</span>
                  <p className="text-[10px] text-amber-400/80">Vehicle illustration flashes to match strobe speed</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[2, 4, 6, 8].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => updateFormData({ strobeSpeed: rate, isOn: true })}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                      (formData.strobeSpeed || 4) === rate
                        ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-300'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}Hz
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Palettes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              LED Color Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`
                    flex items-center gap-2 p-2 rounded-xl text-xs font-medium border transition-all
                    ${
                      formData.color.toLowerCase() === c.value.toLowerCase()
                        ? 'border-white bg-slate-800 ring-1 ring-white/50 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }
                  `}
                  onClick={() => updateFormData({ color: c.value })}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/40 flex-shrink-0"
                    style={{ backgroundColor: c.value }}
                  />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Switch Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-xl border text-xs gap-1 transition-colors
                      ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }
                    `}
                    onClick={() => updateFormData({ iconName: item.name })}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] truncate max-w-[50px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brightness / PWM Dimming */}
          <div className="pt-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Brightness / PWM Output
              </label>
              <span className="text-xs font-mono text-cyan-400 font-bold">{formData.brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={formData.brightness}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateFormData({ brightness: val, isOn: true });
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Mode description note */}
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500 italic">
              Vehicle lighting coordinates are fixed to schematic diagram presets.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#2d3440] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider text-[#94a3b8] hover:text-white bg-[#222730] hover:bg-[#2c3340] border border-[#3b4455] shadow-sm active:translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-md text-xs font-black uppercase tracking-wider bg-[#2a303b] hover:bg-[#343c49] text-white border-2 border-[#454f60] shadow-sm active:translate-y-0.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
