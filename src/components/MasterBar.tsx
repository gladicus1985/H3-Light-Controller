import React, { useState } from 'react';
import { Power, Maximize2, Minimize2, Settings } from 'lucide-react';

interface MasterBarProps {
  activeCount: number;
  onMasterAllOff: () => void;
  onMasterAllOn: () => void;
  onOpenSettings: () => void;
}

export const MasterBar: React.FC<MasterBarProps> = ({
  activeCount,
  onMasterAllOff,
  onMasterAllOn,
  onOpenSettings,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="w-full bg-[#14171d] border-b-2 border-[#252b36] px-3 py-1.5 flex items-center justify-between gap-2 select-none sticky top-0 z-30 shadow-md">
      {/* Brand & Vehicle Title - Simple OEM GM 2009 Headunit Header */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-black tracking-wider text-white uppercase font-sans">
          HUMMER H3
        </span>
      </div>

      {/* Quick Controls: Settings, Fullscreen, ALL ON, ALL OFF */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          id="btn-open-settings"
          aria-label="App & Hardware Settings"
          onClick={onOpenSettings}
          className="w-8 h-8 flex items-center justify-center rounded bg-[#1e232c] hover:bg-[#282f3a] border border-[#313a48] text-[#cbd5e1] hover:text-white transition-colors"
          title="Hardware & Switch Setup"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          id="btn-toggle-fullscreen"
          aria-label="Toggle Fullscreen"
          onClick={toggleFullscreen}
          className="w-8 h-8 flex items-center justify-center rounded bg-[#1e232c] hover:bg-[#282f3a] border border-[#313a48] text-[#cbd5e1] hover:text-white transition-colors"
          title="Fullscreen Mode"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          id="btn-master-all-on"
          aria-label="Turn All Lights On"
          onClick={onMasterAllOn}
          className="px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider bg-[#282e38] hover:bg-[#343c49] text-white border border-[#444f60] transition-colors shadow-sm active:translate-y-0.5"
        >
          ALL ON
        </button>

        <button
          type="button"
          id="btn-master-all-off"
          aria-label="Emergency Master All Off"
          onClick={onMasterAllOff}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-colors shadow-sm active:translate-y-0.5
            ${
              activeCount > 0
                ? 'bg-[#b91c1c] hover:bg-[#dc2626] text-white border border-[#ef4444]'
                : 'bg-[#1e232c] text-[#64748b] border border-[#2d3440] cursor-default'
            }
          `}
        >
          <Power className="w-3.5 h-3.5" />
          <span>ALL OFF</span>
        </button>
      </div>
    </header>
  );
};

