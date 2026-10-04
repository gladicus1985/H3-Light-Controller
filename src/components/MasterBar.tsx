import React, { useRef } from 'react';
import { Power, Settings, ShieldAlert } from 'lucide-react';

interface MasterBarProps {
  activeCount: number;
  isSosActive: boolean;
  onMasterAllOff: () => void;
  onMasterAllOn: () => void;
  onOpenSettings: () => void;
  onActivateSosClick: () => void;
  onOpenSosSettings: () => void;
}

export const MasterBar: React.FC<MasterBarProps> = ({
  activeCount,
  isSosActive,
  onMasterAllOff,
  onMasterAllOn,
  onOpenSettings,
  onActivateSosClick,
  onOpenSosSettings,
}) => {
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const handleMouseDown = () => {
    isLongPress.current = false;
    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true;
      onOpenSosSettings();
    }, 600);
  };

  const handleMouseUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isLongPress.current) {
      onActivateSosClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  return (
    <header className="w-full bg-[#14171d] border-b-2 border-[#252b36] px-3 py-1.5 flex items-center justify-between gap-2 select-none sticky top-0 z-30 shadow-md">
      {/* Brand & Vehicle Title */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-black tracking-wider text-white uppercase font-sans">
          HUMMER H3
        </span>
      </div>

      {/* Quick Controls: Settings, SOS, ALL ON, ALL OFF */}
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

        {/* SOS Button: Click for verification prompt, Hold for editable settings */}
        <button
          type="button"
          id="btn-master-sos"
          aria-label="SOS Emergency Flash"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all shadow-sm active:translate-y-0.5
            ${
              isSosActive
                ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-red-400 animate-pulse ring-2 ring-red-500/50'
                : 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80'
            }
          `}
          title="Click to Activate SOS (Hold to Edit Settings)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SOS</span>
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
