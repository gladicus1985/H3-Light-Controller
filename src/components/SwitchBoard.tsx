import React, { useState } from 'react';
import { ChannelConfig, LightZoneCategory } from '../types';
import { ChannelSwitch } from './ChannelSwitch';
import { SlidersHorizontal, Eye, Compass, Car, Sparkles, Wind } from 'lucide-react';

interface SwitchBoardProps {
  channels: ChannelConfig[];
  selectedChannelId: number | null;
  onToggleChannel: (id: number) => void;
  onSelectChannel: (id: number) => void;
  onEditChannel: (channel: ChannelConfig) => void;
}

type FilterCategory = 'all' | LightZoneCategory;

export const SwitchBoard: React.FC<SwitchBoardProps> = ({
  channels,
  selectedChannelId,
  onToggleChannel,
  onSelectChannel,
  onEditChannel,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredChannels = channels.filter((ch) => {
    if (activeFilter === 'all') return true;
    return ch.category === activeFilter;
  });

  const categories: { key: FilterCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'all', label: 'All 16 Ch', icon: SlidersHorizontal },
    { key: 'exterior-front', label: 'Front', icon: Eye },
    { key: 'exterior-side', label: 'Sides', icon: Compass },
    { key: 'exterior-rear', label: 'Rear', icon: Car },
    { key: 'interior', label: 'Interior', icon: Sparkles },
    { key: 'accessory', label: 'Auxiliary', icon: Wind },
  ];

  const activeCount = channels.filter((c) => c.isOn).length;

  return (
    <div className="w-full flex flex-col bg-[#0d0f14] border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* Category Pills & Channel Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isCurrent = activeFilter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                id={`filter-pill-${cat.key}`}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors
                  ${
                    isCurrent
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                  }
                `}
                onClick={() => setActiveFilter(cat.key)}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Channels active count */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>
            <strong className="text-white">{activeCount}</strong> / 16 ON
          </span>
        </div>
      </div>

      {/* Grid of 16 switches - responsive 2, 3, or 4 columns for landscape headunits */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredChannels.map((channel) => (
          <ChannelSwitch
            key={channel.id}
            channel={channel}
            isSelected={selectedChannelId === channel.id}
            onToggle={onToggleChannel}
            onSelect={onSelectChannel}
            onEdit={onEditChannel}
          />
        ))}
      </div>
    </div>
  );
};
