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
    { key: 'all', label: 'All Lights', icon: SlidersHorizontal },
    { key: 'exterior-front', label: 'Front', icon: Eye },
    { key: 'exterior-side', label: 'Sides', icon: Compass },
    { key: 'exterior-rear', label: 'Rear', icon: Car },
    { key: 'interior', label: 'Interior', icon: Sparkles },
    { key: 'accessory', label: 'Auxiliary', icon: Wind },
  ];

  const activeCount = channels.filter((c) => c.isOn).length;

  return (
    <div className="w-full flex flex-col bg-[#12151b] border-2 border-[#2b313c] rounded-lg p-4 shadow-xl">
      {/* Category Pills & Channel Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#2b313c]">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isCurrent = activeFilter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                id={`filter-pill-${cat.key}`}
                className={`
                  flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors shadow-sm
                  ${
                    isCurrent
                      ? 'bg-[#2a313d] text-white border-2 border-white'
                      : 'bg-[#1a1e26] text-[#94a3b8] border border-[#373f4e] hover:text-white hover:bg-[#242933]'
                  }
                `}
                onClick={() => setActiveFilter(cat.key)}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Channels active count */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#94a3b8]">
          <span className={`w-2.5 h-2.5 rounded-full ${activeCount > 0 ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-[#3b4352]'}`} />
          <span>
            <strong className="text-white font-bold">{activeCount}</strong> / 16 ACTIVE
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
