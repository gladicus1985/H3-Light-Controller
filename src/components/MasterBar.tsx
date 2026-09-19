import React, { useState, useEffect } from 'react';
import { Power, Maximize2, Minimize2, Settings, Layers } from 'lucide-react';
import { PresetScene } from '../types';

interface MasterBarProps {
  activeCount: number;
  onMasterAllOff: () => void;
  onMasterAllOn: () => void;
  onOpenScenes: () => void;
  onOpenSettings: () => void;
  presetScenes: PresetScene[];
  onApplyScene: (sceneId: string) => void;
}

export const MasterBar: React.FC<MasterBarProps> = ({
  activeCount,
  onMasterAllOff,
  onMasterAllOn,
  onOpenScenes,
  onOpenSettings,
  presetScenes,
  onApplyScene,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Clock for in-vehicle headunit dashboard
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <header className="w-full bg-[#0b0d12] border-b border-slate-800/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none sticky top-0 z-30 shadow-md">
      {/* Brand & Vehicle Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-inner font-black text-xs tracking-wider text-slate-200">
          H3
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold tracking-wide text-white leading-none">
              HUMMER H3
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              16 CH
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
            <span>{currentTime}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              SYSTEM READY
            </span>
          </p>
        </div>
      </div>

      {/* Active Channels Status Pill */}
      <div className="flex items-center gap-2.5 bg-slate-950/90 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-xs">
        <span className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
        <span className="text-slate-300">
          <strong className="text-white font-bold">{activeCount}</strong> OF 16 ACTIVE
        </span>
      </div>

      {/* Quick Scenes Buttons */}
      <div className="hidden lg:flex items-center gap-1.5">
        {presetScenes.slice(1, 4).map((scene) => (
          <button
            key={scene.id}
            type="button"
            id={`quick-scene-${scene.id}`}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => onApplyScene(scene.id)}
          >
            {scene.name}
          </button>
        ))}
      </div>

      {/* Action Buttons: Scenes Modal, Settings, Fullscreen, ALL ON, and ALL OFF */}
      <div className="flex items-center gap-2">
        {/* Scenes button */}
        <button
          type="button"
          id="btn-open-scenes"
          aria-label="Preset Lighting Scenes"
          onClick={onOpenScenes}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Lighting Scenes"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          type="button"
          id="btn-open-settings"
          aria-label="App & Hardware Settings"
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Relay & Hardware Setup"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Fullscreen toggle for Android headunit */}
        <button
          type="button"
          id="btn-toggle-fullscreen"
          aria-label="Toggle Fullscreen"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Fullscreen Headunit Mode"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Master ALL ON Button */}
        <button
          type="button"
          id="btn-master-all-on"
          aria-label="Turn All Lights On"
          onClick={onMasterAllOn}
          className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
        >
          ALL ON
        </button>

        {/* Master ALL OFF Kill Switch (Safety Priority) */}
        <button
          type="button"
          id="btn-master-all-off"
          aria-label="Emergency Master All Off"
          onClick={onMasterAllOff}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md
            ${
              activeCount > 0
                ? 'bg-red-600 hover:bg-red-500 text-white border border-red-400'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700 cursor-default'
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
