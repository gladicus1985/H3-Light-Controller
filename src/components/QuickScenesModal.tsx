import React from 'react';
import { PresetScene } from '../types';
import { X, PowerOff, Mountain, Tent, AlertTriangle, Moon, Check, Sparkles } from 'lucide-react';

interface QuickScenesModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetScenes: PresetScene[];
  onApplyScene: (sceneId: string) => void;
  activeChannelIds: number[];
}

const SCENE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PowerOff,
  Mountain,
  Tent,
  AlertTriangle,
  Moon,
  Sparkles,
};

export const QuickScenesModal: React.FC<QuickScenesModalProps> = ({
  isOpen,
  onClose,
  presetScenes,
  onApplyScene,
  activeChannelIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-[#0e1117] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Preset Lighting Scenes</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {presetScenes.map((scene) => {
            const Icon = SCENE_ICONS[scene.icon] || Sparkles;
            
            // Check if this scene matches current active state
            const isActive =
              scene.activeChannelIds.length === activeChannelIds.length &&
              scene.activeChannelIds.every((id) => activeChannelIds.includes(id));

            return (
              <div
                key={scene.id}
                id={`scene-row-${scene.id}`}
                className={`
                  p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-150
                  ${
                    isActive
                      ? 'border-cyan-500/70 bg-cyan-950/20 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                  }
                `}
                onClick={() => {
                  onApplyScene(scene.id);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      p-2.5 rounded-xl flex-shrink-0
                      ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{scene.name}</span>
                      {isActive && (
                        <span className="text-[10px] font-mono font-normal uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Active
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{scene.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      {scene.activeChannelIds.length === 0
                        ? 'All channels OFF'
                        : `Channels: ${scene.activeChannelIds.join(', ')} (${scene.activeChannelIds.length} active)`}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors
                      ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }
                    `}
                  >
                    {isActive ? <Check className="w-4 h-4" /> : 'Apply'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/40 text-center">
          <p className="text-[11px] text-slate-500">
            Tapping a scene engages predefined 12V relay channels immediately.
          </p>
        </div>
      </div>
    </div>
  );
};
