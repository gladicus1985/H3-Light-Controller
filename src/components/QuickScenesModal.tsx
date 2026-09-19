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
      <div className="w-full max-w-md bg-[#12151b] border-2 border-[#2c3340] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b313c] bg-[#181c24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#242932] border border-[#3d4554] flex items-center justify-center text-[#e2e8f0]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Lighting Scenes
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#252c38] transition-colors"
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
                  p-4 rounded-md border-2 flex items-center justify-between gap-3 cursor-pointer transition-all duration-150
                  ${
                    isActive
                      ? 'border-emerald-500/80 bg-[#1a2820] text-white shadow-md'
                      : 'border-[#29303c] bg-[#181d26] text-[#cbd5e1] hover:border-[#3e4858] hover:bg-[#1f2530]'
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
                      w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 border
                      ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-[#242a35] text-[#94a3b8] border-[#374050]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                      <span>{scene.name}</span>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Active
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{scene.description}</p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className={`
                      px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-colors shadow-sm active:translate-y-0.5
                      ${
                        isActive
                          ? 'bg-emerald-600 text-white border border-emerald-400'
                          : 'bg-[#272e3a] text-white border border-[#3e4858] hover:bg-[#323b49]'
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
        <div className="p-3.5 border-t border-[#272d38] bg-[#15181f] text-center">
          <p className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold">
            OEM PRESET 12V RELAY SCENES
          </p>
        </div>
      </div>
    </div>
  );
};
