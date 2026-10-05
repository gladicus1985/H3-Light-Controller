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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handlePointerDown = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      try {
        if ('vibrate' in navigator) navigator.vibrate(60);
      } catch {
        // ignore
      }
      onOpenSosSettings();
    }, 550);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isLongPress.current) {
      onActivateSosClick();
    }
  };

  const handlePointerCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isLongPress.current = false;
  };

  return (
    <header className="w-full bg-transparent border-none px-4 py-2 select-none z-30 flex items-center justify-center flex-shrink-0">
      {/* 4 Center-Aligned Evenly Spaced Buttons - Minimalist & Balanced */}
      <div className="grid grid-cols-4 gap-3 max-w-2xl w-full mx-auto">
        {/* 1. ALL ON */}
        <button
          type="button"
          id="btn-master-all-on"
          aria-label="Turn All Lights On"
          onClick={onMasterAllOn}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#1a202c]/85 hover:bg-[#242c3d] text-amber-200 hover:text-white border-2 border-[#333d4e] hover:border-amber-400/80 transition-all shadow-sm active:scale-95 group select-none touch-none"
          title="Turn On All Enabled Relays"
        >
          <Power className="h-9 w-9 mb-1.5 text-amber-400 group-hover:text-amber-300 transition-colors" strokeWidth={2} />
          <span className="text-[11px] font-black uppercase tracking-wider text-center truncate w-full leading-tight">
            ALL ON
          </span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-wide mt-0.5 truncate">
            Master On
          </span>
        </button>

        {/* 2. SOS Button: Outlined in red, middle matches the ON button */}
        <button
          type="button"
          id="btn-master-sos"
          aria-label="SOS Emergency Flash"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`
            flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 border-2 select-none touch-none
            bg-[#1a202c]/85 hover:bg-[#242c3d]
            ${
              isSosActive
                ? 'border-red-500 animate-pulse text-red-200 shadow-[0_0_14px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50'
                : 'border-red-800/70 hover:border-red-500 text-red-300 hover:text-red-200'
            }
          `}
          title="Click to Activate SOS (Hold to Edit Settings)"
        >
          <ShieldAlert className="h-9 w-9 mb-1.5 text-red-400 group-hover:text-red-300 transition-colors" strokeWidth={2} />
          <span className="text-[11px] font-black uppercase tracking-wider text-center truncate w-full leading-tight">
            SOS
          </span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-wide mt-0.5 truncate">
            Hold to Edit
          </span>
        </button>

        {/* 3. SETTINGS: Minimalist theme matching bottom icons (no blue) */}
        <button
          type="button"
          id="btn-open-settings"
          aria-label="App & Hardware Settings"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-[#1a202c]/85 hover:bg-[#242c3d] border-2 border-[#333d4e] hover:border-slate-400 text-slate-200 hover:text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 group select-none touch-none"
          title="Hardware & Switch Setup"
        >
          <Settings className="h-9 w-9 mb-1.5 text-slate-400 group-hover:text-white transition-colors" strokeWidth={2} />
          <span className="text-[11px] font-black uppercase tracking-wider text-center truncate w-full leading-tight">
            SETTINGS
          </span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-wide mt-0.5 truncate">
            Config & Relays
          </span>
        </button>

        {/* 4. ALL OFF: Outlined in red, middle matches the ON button */}
        <button
          type="button"
          id="btn-master-all-off"
          aria-label="Emergency Master All Off"
          onClick={onMasterAllOff}
          className={`
            flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 border-2 select-none touch-none
            bg-[#1a202c]/85 hover:bg-[#242c3d]
            ${
              activeCount > 0
                ? 'border-red-500 hover:border-red-400 text-red-200 hover:text-white shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                : 'border-[#333d4e] hover:border-red-900/60 text-slate-400 hover:text-slate-300'
            }
          `}
          title="Cut All Relays"
        >
          <Power className={`h-9 w-9 mb-1.5 transition-colors ${activeCount > 0 ? 'text-red-400' : 'text-slate-500'}`} strokeWidth={2} />
          <span className="text-[11px] font-black uppercase tracking-wider text-center truncate w-full leading-tight">
            ALL OFF
          </span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-wide mt-0.5 truncate">
            Kill Switch
          </span>
        </button>
      </div>
    </header>
  );
};
