import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Sliders, Sparkles } from 'lucide-react';
import { PresetScene, ChannelConfig } from '../types';

interface SceneEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneToEdit: PresetScene | null;
  onSaveScene: (scene: PresetScene) => void;
  onDeleteScene?: (sceneId: string) => void;
  channels: ChannelConfig[];
  currentActiveChannelIds: number[];
}

export const SceneEditorModal: React.FC<SceneEditorModalProps> = ({
  isOpen,
  onClose,
  sceneToEdit,
  onSaveScene,
  onDeleteScene,
  channels,
  currentActiveChannelIds,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedChannelIds, setSelectedChannelIds] = useState<number[]>([]);

  useEffect(() => {
    if (sceneToEdit) {
      setName(sceneToEdit.name);
      setDescription(sceneToEdit.description || '');
      setSelectedChannelIds([...sceneToEdit.activeChannelIds]);
    } else {
      setName('');
      setDescription('');
      setSelectedChannelIds([...currentActiveChannelIds]);
    }
  }, [sceneToEdit, isOpen, currentActiveChannelIds]);

  if (!isOpen) return null;

  const toggleChannel = (id: number) => {
    setSelectedChannelIds((prev) =>
      prev.includes(id) ? prev.filter((chId) => chId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedChannelIds(channels.map((c) => c.id));
  };

  const clearAll = () => {
    setSelectedChannelIds([]);
  };

  const useCurrentActive = () => {
    setSelectedChannelIds([...currentActiveChannelIds]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedScene: PresetScene = {
      id: sceneToEdit ? sceneToEdit.id : `custom_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon: sceneToEdit ? sceneToEdit.icon : 'Sparkles',
      activeChannelIds: selectedChannelIds,
    };

    onSaveScene(updatedScene);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-[#14171d] border-2 border-[#2c3340] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#252c36] bg-[#1a1e27]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#e2e8f0]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {sceneToEdit ? 'Edit Scene' : 'New Lighting Scene'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-[#94a3b8] hover:text-white hover:bg-[#252c38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Scene Name */}
          <div>
            <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">
              Scene Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Trail Crawl, Night Camp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#0d0f14] border border-[#2b313c] rounded text-white focus:outline-none focus:border-slate-400 placeholder-[#475569]"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
              Channels ({selectedChannelIds.length} active)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={useCurrentActive}
                className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#222730] hover:bg-[#2b323e] border border-[#3b4455] text-[#cbd5e1] rounded transition-colors"
                title="Set channels to currently turned ON lights"
              >
                Use Current Lights
              </button>
              <button
                type="button"
                onClick={selectAll}
                className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#222730] hover:bg-[#2b323e] border border-[#3b4455] text-[#94a3b8] hover:text-white rounded transition-colors"
              >
                All On
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#222730] hover:bg-[#2b323e] border border-[#3b4455] text-[#94a3b8] hover:text-white rounded transition-colors"
              >
                All Off
              </button>
            </div>
          </div>

          {/* Channels Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {channels.map((ch) => {
              const isSelected = selectedChannelIds.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => toggleChannel(ch.id)}
                  className={`
                    flex items-center justify-between p-2.5 rounded border text-left transition-colors
                    ${
                      isSelected
                        ? 'bg-[#1e2632] border-emerald-500/80 text-white shadow-sm'
                        : 'bg-[#0f1217] border-[#242a34] text-[#8896aa] hover:border-[#384252] hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        isSelected
                          ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                          : 'bg-[#2f3744]'
                      }`}
                    />
                    <span className="text-xs font-semibold truncate">{ch.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ml-2 flex-shrink-0 bg-[#161a22] border border-[#2b3341]">
                    {isSelected ? 'ON' : 'OFF'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t-2 border-[#252c36] flex items-center justify-between gap-2">
            <div>
              {sceneToEdit && onDeleteScene && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete scene "${sceneToEdit.name}"?`)) {
                      onDeleteScene(sceneToEdit.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-[#251b20] hover:bg-[#34222a] border border-rose-900/60 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-[#94a3b8] hover:text-white bg-[#222730] hover:bg-[#2b323e] border border-[#3b4455] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded text-xs font-black uppercase tracking-wider bg-[#2c3340] hover:bg-[#384252] text-white border-2 border-[#475468] transition-colors shadow-sm active:translate-y-0.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Scene</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
