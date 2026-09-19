import React from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { PresetScene } from '../types';

interface BottomScenesBarProps {
  presetScenes: PresetScene[];
  activeSceneId: string | null;
  onApplyScene: (sceneId: string) => void;
  onNewScene: () => void;
  onEditScene: (scene: PresetScene) => void;
}

export const BottomScenesBar: React.FC<BottomScenesBarProps> = ({
  presetScenes,
  activeSceneId,
  onApplyScene,
  onNewScene,
  onEditScene,
}) => {
  return (
    <div className="w-full bg-[#12151b] border-t-2 border-[#272d38] px-3 py-2 select-none z-30 shadow-2xl flex-shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Label */}
        <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-[#262c37] flex-shrink-0">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#8490a0]">
            SCENES
          </span>
        </div>

        {/* Scrollable Row of Scene Buttons */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {presetScenes.map((scene) => {
            const isActive = activeSceneId === scene.id;

            return (
              <div
                key={scene.id}
                className={`
                  flex items-center rounded-md border-2 transition-all flex-shrink-0
                  ${
                    isActive
                      ? 'bg-[#1b2520] border-emerald-500/90 shadow-md'
                      : 'bg-[#1e232b] hover:bg-[#252b35] border-[#313845]'
                  }
                `}
              >
                {/* Scene Apply Button */}
                <button
                  type="button"
                  id={`bottom-scene-${scene.id}`}
                  onClick={() => onApplyScene(scene.id)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#e2e8f0] hover:text-white transition-colors"
                  title={scene.description || scene.name}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isActive
                        ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                        : 'bg-[#3b4352]'
                    }`}
                  />
                  <span>{scene.name}</span>
                </button>

                {/* Edit Scene Button */}
                <button
                  type="button"
                  aria-label={`Edit ${scene.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditScene(scene);
                  }}
                  className="px-2 py-2 text-[#7d8b9e] hover:text-white border-l border-[#2e3542] hover:bg-[#2c3442] rounded-r transition-colors"
                  title="Configure Scene"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* New Scene Button */}
          <button
            type="button"
            id="btn-add-new-scene"
            onClick={onNewScene}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md border-2 border-dashed border-[#3a4454] bg-[#161a22] hover:bg-[#212733] hover:border-[#526075] text-[#94a3b8] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 shadow-sm"
            title="Create New Scene"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Scene</span>
          </button>
        </div>
      </div>
    </div>
  );
};
