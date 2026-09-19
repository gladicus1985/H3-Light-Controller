import React, { useRef } from 'react';
import { ChannelConfig } from '../types';
import * as LucideIcons from 'lucide-react';

interface ChannelSwitchProps {
  channel: ChannelConfig;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
  onEdit: (channel: ChannelConfig) => void;
}

export const ChannelSwitch: React.FC<ChannelSwitchProps> = ({
  channel,
  isSelected,
  onToggle,
  onSelect,
  onEdit,
}) => {
  const momentaryTimer = useRef<number | null>(null);
  const isEnabled = channel.isEnabled !== false;

  // Dynamic Lucide icon lookup with fallback
  const IconComponent = (LucideIcons as Record<string, any>)[channel.iconName] || LucideIcons.Zap;

  const handlePointerDown = () => {
    if (!isEnabled) return;
    if (channel.mode === 'momentary') {
      if (!channel.isOn) onToggle(channel.id);
      momentaryTimer.current = window.setTimeout(() => {}, 100);
    }
  };

  const handlePointerUp = () => {
    if (!isEnabled) return;
    if (channel.mode === 'momentary') {
      if (channel.isOn) onToggle(channel.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEnabled) {
      onEdit(channel);
      return;
    }
    onSelect(channel.id);
    if (channel.mode !== 'momentary') {
      onToggle(channel.id);
    }
  };

  return (
    <div
      id={`switch-card-${channel.id}`}
      className={`
        relative group flex flex-col justify-between p-3.5 rounded-xl border select-none cursor-pointer
        ${
          !isEnabled
            ? 'bg-slate-950/40 border-dashed border-slate-800 opacity-50 hover:opacity-80'
            : channel.isOn
            ? 'bg-slate-900/90 border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
            : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
        }
        ${isSelected && isEnabled ? 'ring-2 ring-cyan-500/80 ring-offset-1 ring-offset-slate-950' : ''}
      `}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Top row: Channel number badge, status indicator, and settings icon */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`
              inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold font-mono
              ${
                !isEnabled
                  ? 'bg-slate-900 text-slate-600 border border-slate-800 line-through'
                  : channel.isOn
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }
            `}
          >
            {channel.id}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            CH {channel.id}
          </span>
          {!isEnabled && (
            <span className="text-[9px] uppercase px-1 py-0.5 rounded font-mono bg-amber-950/60 text-amber-400/90 border border-amber-800/40">
              DISABLED
            </span>
          )}
        </div>

        {/* LED Status Glow Indicator */}
        <div className="flex items-center gap-1.5">
          {channel.mode !== 'toggle' && (
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400 border border-slate-700">
              {channel.mode}
            </span>
          )}
          
          <button
            type="button"
            id={`edit-btn-ch-${channel.id}`}
            aria-label={`Configure Channel ${channel.id}`}
            className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(channel);
            }}
          >
            <LucideIcons.Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle row: Icon and Channel Name */}
      <div className="flex items-center gap-2.5 my-1">
        <div
          className={`
            p-2 rounded-lg transition-all duration-200 flex-shrink-0
            ${channel.isOn ? 'shadow-md' : 'bg-slate-900 text-slate-500'}
          `}
          style={{
            backgroundColor: channel.isOn ? `${channel.color}25` : undefined,
            color: channel.isOn ? channel.color : undefined,
            boxShadow: channel.isOn ? `0 0 12px ${channel.color}40` : undefined,
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className={`
              text-sm font-semibold truncate transition-colors leading-tight
              ${channel.isOn ? 'text-white' : 'text-slate-300'}
            `}
          >
            {channel.name}
          </h4>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
            <span>{channel.mode.toUpperCase()}</span>
            <span>&bull;</span>
            <span>{channel.brightness}%</span>
          </p>
        </div>
      </div>

      {/* Bottom row: Automotive switch tactile bar indicator */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span
          className={`
            text-[11px] font-bold tracking-wider uppercase
            ${
              !isEnabled
                ? 'text-slate-600'
                : channel.isOn
                ? 'text-emerald-400 font-extrabold'
                : 'text-slate-600'
            }
          `}
        >
          {!isEnabled ? 'DISABLED' : channel.isOn ? 'ACTIVE' : 'OFF'}
        </span>

        {/* LED glowing power strip */}
        <div
          className="w-14 h-2 rounded-full overflow-hidden"
          style={{
            backgroundColor: !isEnabled ? '#0f172a' : channel.isOn ? channel.color : '#1e293b',
            boxShadow: isEnabled && channel.isOn ? `0 0 10px ${channel.color}` : 'none',
          }}
        />
      </div>
    </div>
  );
};
