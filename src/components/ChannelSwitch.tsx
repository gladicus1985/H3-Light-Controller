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
        relative group flex flex-col justify-between p-4 rounded-lg border-2 select-none cursor-pointer transition-all
        ${
          !isEnabled
            ? 'bg-[#14171d] border-dashed border-[#2b313c] opacity-60'
            : channel.isOn
            ? 'bg-[#222730] border-white shadow-md'
            : 'bg-[#181c24] border-[#313744] hover:border-[#4b5565] hover:bg-[#1e232c]'
        }
        ${isSelected && isEnabled ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : ''}
      `}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Top row: Status indicator and settings icon */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              !isEnabled
                ? 'bg-slate-700'
                : channel.isOn
                ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                : 'bg-slate-600'
            }`}
          />
          <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-bold">
            {!isEnabled ? 'DISABLED' : channel.isOn ? 'ON' : 'OFF'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {channel.mode !== 'toggle' && (
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono bg-[#242933] text-[#94a3b8] border border-[#3b4352]">
              {channel.mode}
            </span>
          )}
          
          <button
            type="button"
            id={`edit-btn-ch-${channel.id}`}
            aria-label={`Configure ${channel.name}`}
            className="p-1 text-[#94a3b8] hover:text-white rounded hover:bg-[#2c3340] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(channel);
            }}
          >
            <LucideIcons.Settings2 className="w-4 h-4" />
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
