import React, { useState } from 'react';
import { HardwareConfig, ChannelConfig } from '../types';
import { X, Usb, Wifi, Upload, RotateCcw, ShieldCheck, Check, Terminal, Eye, EyeOff, Edit3 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface HardwareSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hardwareConfig: HardwareConfig;
  onSaveHardwareConfig: (config: HardwareConfig) => void;
  customImageUrl: string | null;
  onSetCustomImageUrl: (url: string | null) => void;
  onResetToDefaults: () => void;
  channels: ChannelConfig[];
  onUpdateChannels: (channels: ChannelConfig[]) => void;
  onEditChannel?: (channel: ChannelConfig) => void;
}

export const HardwareSettingsModal: React.FC<HardwareSettingsModalProps> = ({
  isOpen,
  onClose,
  hardwareConfig,
  onSaveHardwareConfig,
  customImageUrl,
  onSetCustomImageUrl,
  onResetToDefaults,
  channels,
  onUpdateChannels,
  onEditChannel,
}) => {
  if (!isOpen) return null;

  const [config, setConfig] = useState<HardwareConfig>({ ...hardwareConfig });
  const [serialStatus, setSerialStatus] = useState<string>('Ready to pair with USB relay');
  const [serialPort, setSerialPort] = useState<any>(null);

  // USB WebSerial connection test for Android Headunits
  const handleConnectSerial = async () => {
    if ('serial' in navigator) {
      try {
        setSerialStatus('Requesting USB Serial device...');
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: config.baudRate });
        setSerialPort(port);
        setSerialStatus(`Connected to USB Relay @ ${config.baudRate} baud`);
        setConfig({ ...config, outputMode: 'serial' });
      } catch (err: any) {
        setSerialStatus(`USB Serial Error: ${err?.message || 'Device cancelled'}`);
      }
    } else {
      setSerialStatus('Web Serial not supported in this browser environment. Using HTTP/Demo mode.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSetCustomImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveHardwareConfig(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-[#0e1117] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Hardware & Relay Configuration
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Relay Control Mode Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Relay Board Output Interface
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                className={`
                  p-3 rounded-xl border text-left flex flex-col justify-between transition-all
                  ${
                    config.outputMode === 'demo'
                      ? 'border-cyan-400 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }
                `}
                onClick={() => setConfig({ ...config, outputMode: 'demo' })}
              >
                <ShieldCheck className="w-5 h-5 text-cyan-400 mb-1" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Simulation</div>
                  <div className="text-[10px] text-slate-500">Instant UI Test</div>
                </div>
              </button>

              <button
                type="button"
                className={`
                  p-3 rounded-xl border text-left flex flex-col justify-between transition-all
                  ${
                    config.outputMode === 'serial'
                      ? 'border-cyan-400 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }
                `}
                onClick={() => setConfig({ ...config, outputMode: 'serial' })}
              >
                <Usb className="w-5 h-5 text-emerald-400 mb-1" />
                <div>
                  <div className="text-xs font-bold text-slate-200">USB Serial</div>
                  <div className="text-[10px] text-slate-500">OTG CH340 / ESP</div>
                </div>
              </button>

              <button
                type="button"
                className={`
                  p-3 rounded-xl border text-left flex flex-col justify-between transition-all
                  ${
                    config.outputMode === 'http'
                      ? 'border-cyan-400 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }
                `}
                onClick={() => setConfig({ ...config, outputMode: 'http' })}
              >
                <Wifi className="w-5 h-5 text-amber-400 mb-1" />
                <div>
                  <div className="text-xs font-bold text-slate-200">WiFi / HTTP</div>
                  <div className="text-[10px] text-slate-500">REST / ESP32 AP</div>
                </div>
              </button>
            </div>
          </div>

          {/* USB Serial Details if selected */}
          {config.outputMode === 'serial' && (
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">USB OTG Serial Port</span>
                <select
                  value={config.baudRate}
                  onChange={(e) => setConfig({ ...config, baudRate: Number(e.target.value) })}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                >
                  <option value={9600}>9600 Baud</option>
                  <option value={19200}>19200 Baud</option>
                  <option value={115200}>115200 Baud</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
                Status: {serialStatus}
              </p>
              <button
                type="button"
                onClick={handleConnectSerial}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider"
              >
                <Usb className="w-4 h-4" />
                <span>Pair / Connect USB Device</span>
              </button>
            </div>
          )}

          {/* HTTP REST Details if selected */}
          {config.outputMode === 'http' && (
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                ESP32 / Relay Controller IP Endpoint
              </label>
              <input
                type="text"
                value={config.httpEndpoint}
                onChange={(e) => setConfig({ ...config, httpEndpoint: e.target.value })}
                placeholder="http://192.168.4.1/relay"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">
                Dispatches <code className="text-slate-300">GET /relay/[channel]/[0|1]</code> or JSON on every toggle.
              </p>
            </div>
          )}

          {/* Channel Visibility & Management (16 Channels) */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Channel Visibility & Zone Management
                </label>
                <p className="text-[11px] text-slate-500">
                  Disabled channels are hidden from the vehicle diagram to save screen space. Re-enable any channel here anytime.
                </p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                {channels.filter((c) => c.isEnabled !== false).length} / {channels.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
              {channels.map((ch) => {
                const isEnabled = ch.isEnabled !== false;
                const Icon = (LucideIcons as any)[ch.iconName] || LucideIcons.Zap;
                return (
                  <div
                    key={ch.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
                      isEnabled
                        ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                        : 'bg-slate-950 border-rose-900/30 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                          isEnabled
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {ch.id}
                      </span>
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isEnabled ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      />
                      <span
                        className={`truncate font-medium text-[11px] ${
                          isEnabled ? 'text-slate-200' : 'text-slate-500 line-through'
                        }`}
                      >
                        {ch.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {onEditChannel && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEditChannel(ch);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                          title={`Configure Channel ${ch.id}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const nextChannels = channels.map((c) =>
                            c.id === ch.id
                              ? { ...c, isEnabled: !isEnabled, isOn: !isEnabled ? c.isOn : false }
                              : c
                          );
                          onUpdateChannels(nextChannels);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                          isEnabled
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Re-enable</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle Visual: Custom Photo or SVG schematic */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Hummer Top-Down Visual
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer transition-colors text-xs font-semibold">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload Vehicle Image (e.g. GisDx.jpg)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {customImageUrl && (
                <button
                  type="button"
                  onClick={() => onSetCustomImageUrl(null)}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 hover:text-amber-300 hover:bg-slate-800"
                  title="Revert to Precision Vector Schematic"
                >
                  Use Vector
                </button>
              )}
            </div>
            {customImageUrl && (
              <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                <span>Custom top-down vehicle image is currently active.</span>
              </p>
            )}
          </div>

          {/* Factory Reset button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all 16 channel configurations and names back to default Hummer H3 layout?')) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Channels to Default</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md active:scale-95 transition-transform"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
