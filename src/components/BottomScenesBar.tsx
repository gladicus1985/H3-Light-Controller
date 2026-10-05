import React, { useRef, useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PresetScene } from '../types';

interface BottomScenesBarProps {
  presetScenes: PresetScene[];
  activeSceneId: string | null;
  onApplyScene: (sceneId: string) => void;
  onNewScene: () => void;
  onEditScene: (scene: PresetScene) => void;
}

interface SceneButtonProps {
  scene: PresetScene;
  isActive: boolean;
  onApply: (sceneId: string) => void;
  onEdit: (scene: PresetScene) => void;
}

const SceneButton: React.FC<SceneButtonProps> = ({
  scene,
  isActive,
  onApply,
  onEdit,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isLongPressTriggered.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsPressing(true);
    clearTimer();

    timerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setIsPressing(false);
      try {
        if ('vibrate' in navigator) navigator.vibrate(60);
      } catch {
        // ignore
      }
      onEdit(scene);
    }, 500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPos.current) return;
    const dist = Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y);
    if (dist > 12) {
      clearTimer();
      setIsPressing(false);
    }
  };

  const handlePointerUp = () => {
    const wasLongPress = isLongPressTriggered.current;
    clearTimer();
    setIsPressing(false);
    isLongPressTriggered.current = false;
    startPos.current = null;

    if (!wasLongPress) {
      onApply(scene.id);
    }
  };

  const handlePointerCancel = () => {
    clearTimer();
    setIsPressing(false);
    isLongPressTriggered.current = false;
    startPos.current = null;
  };

  // Dynamically resolve icon from lucide-react or fallback to Sparkles
  const IconComponent = (LucideIcons as any)[scene.icon] || Sparkles;

  return (
    <button
      type="button"
      id={`bottom-scene-${scene.id}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`
        flex-1 min-w-0 flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 transition-all select-none touch-none
        ${
          isActive
            ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
            : 'bg-[#151922]/85 hover:bg-[#1c222e] border-[#2d3644] text-slate-300 hover:text-white'
        }
        ${isPressing ? 'scale-95 bg-[#252e3e] border-cyan-400 text-cyan-200' : ''}
      `}
      title={`${scene.name} (Hold to edit)`}
    >
      <IconComponent
        className={`h-9 w-9 mb-1.5 transition-transform ${
          isActive
            ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.85)] scale-105'
            : isPressing
            ? 'text-cyan-400'
            : 'text-slate-400 group-hover:text-white'
        }`}
        strokeWidth={2}
      />
      <span className="text-[11px] font-black uppercase tracking-wider text-center truncate w-full leading-tight">
        {scene.name}
      </span>
      <span className="text-[9px] text-slate-500 font-semibold tracking-wide mt-0.5 truncate">
        {isActive ? 'Active' : 'Hold to Edit'}
      </span>
    </button>
  );
};

export const BottomScenesBar: React.FC<BottomScenesBarProps> = ({
  presetScenes,
  activeSceneId,
  onApplyScene,
  onNewScene,
  onEditScene,
}) => {
  return (
    <div className="w-full bg-transparent border-none px-3 py-2 select-none z-30 flex-shrink-0">
      <div className="w-full flex items-stretch justify-between gap-2.5">
        {/* Evenly distributed row of Scene Buttons */}
        {presetScenes.map((scene) => (
          <SceneButton
            key={scene.id}
            scene={scene}
            isActive={activeSceneId === scene.id}
            onApply={onApplyScene}
            onEdit={onEditScene}
          />
        ))}

        {/* New Scene Button evenly distributed */}
        <button
          type="button"
          id="btn-add-new-scene"
          onClick={onNewScene}
          className="flex-1 min-w-0 flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 border-dashed border-[#384355] bg-[#141720]/60 hover:bg-[#1c222e] hover:border-cyan-500/80 text-[#94a3b8] hover:text-white transition-all select-none shadow-sm active:scale-95"
          title="Create New Scene"
        >
          <Plus className="h-9 w-9 mb-1.5 text-slate-400 hover:text-cyan-400 transition-colors" strokeWidth={2} />
          <span className="text-[11px] font-black uppercase tracking-wider text-center truncate w-full leading-tight">
            New Scene
          </span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-wide mt-0.5 truncate">
            Add Preset
          </span>
        </button>
      </div>
    </div>
  );
};
