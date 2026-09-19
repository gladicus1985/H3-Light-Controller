/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChannelConfig, HardwareConfig, PresetScene } from './types';
import { DEFAULT_CHANNELS, PRESET_SCENES } from './data/defaultChannels';
import { HummerTopDown } from './components/HummerTopDown';
import { MasterBar } from './components/MasterBar';
import { ChannelEditModal } from './components/ChannelEditModal';
import { HardwareSettingsModal } from './components/HardwareSettingsModal';
import { BottomScenesBar } from './components/BottomScenesBar';
import { SceneEditorModal } from './components/SceneEditorModal';

const STORAGE_KEY_CHANNELS = 'hummer_h3_channels_v5';
const STORAGE_KEY_HARDWARE = 'hummer_h3_hardware_v2';
const STORAGE_KEY_IMAGE = 'hummer_h3_custom_img_v2';
const STORAGE_KEY_SCENES = 'hummer_h3_scenes_v2';

export default function App() {
  // 16-Channel state loaded from localStorage or defaults
  const [channels, setChannels] = useState<ChannelConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 16) {
          return parsed.map((ch: ChannelConfig) => {
            // Align Grille LED Pods (Channel 2) on Y axis with Fog Light button (x: 13)
            if (ch.id === 2 && (ch.position.x !== 13 || ch.position.y !== 60)) {
              return { ...ch, position: { x: 13, y: 60 } };
            }
            // Center Roof Marker Pods (Channel 4) on roof just behind the pods (x: 43, y: 50)
            if (ch.id === 4 && (ch.position.x !== 43 || ch.position.y !== 50)) {
              return { ...ch, name: 'Amber Cab Markers (x5)', position: { x: 43, y: 50 } };
            }
            if (ch.id === 7 && (ch.position.x !== 22 || ch.position.y !== 23)) {
              return { ...ch, position: { x: 22, y: 23 } };
            }
            if (ch.id === 8 && (ch.position.x !== 22 || ch.position.y !== 73.5)) {
              return { ...ch, position: { x: 22, y: 73.5 } };
            }
            if (ch.id === 9 && (ch.name === 'Left Camp Scene' || ch.mode !== 'strobe' || ch.position.x !== 47 || ch.position.y !== 29)) {
              return { ...ch, name: 'Left Emergency Strobes', mode: 'strobe', color: ch.color === '#FEF08A' ? '#F59E0B' : ch.color, position: { x: 47, y: 29 } };
            }
            if (ch.id === 10 && (ch.name === 'Right Camp Scene' || ch.mode !== 'strobe' || ch.position.x !== 47 || ch.position.y !== 71)) {
              return { ...ch, name: 'Right Emergency Strobes', mode: 'strobe', color: ch.color === '#FEF08A' ? '#F59E0B' : ch.color, position: { x: 47, y: 71 } };
            }
            if (ch.id === 12 && (ch.position.x !== 73 || ch.position.y !== 50)) {
              return { ...ch, position: { x: 73, y: 50 } };
            }
            if (ch.id === 13 && (ch.position.x !== 72 || ch.position.y !== 23)) {
              return { ...ch, position: { x: 72, y: 23 } };
            }
            if (ch.id === 14 && (ch.position.x !== 72 || ch.position.y !== 73.5)) {
              return { ...ch, position: { x: 72, y: 73.5 } };
            }
            return ch;
          });
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_CHANNELS;
  });

  // Hardware integration config
  const [hardwareConfig, setHardwareConfig] = useState<HardwareConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HARDWARE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      outputMode: 'demo',
      httpEndpoint: 'http://192.168.4.1/relay',
      baudRate: 115200,
      autoConnectSerial: false,
      lowVoltageCutoff: 11.8,
    };
  });

  // Optional custom vehicle image URL
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_IMAGE);
  });

  // Selected channel for inspecting / editing
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [editingChannel, setEditingChannel] = useState<ChannelConfig | null>(null);

  // Scenes state loaded from localStorage or defaults
  const [scenes, setScenes] = useState<PresetScene[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCENES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return PRESET_SCENES;
  });

  // Modals state
  const [isSceneEditorOpen, setIsSceneEditorOpen] = useState(false);
  const [sceneToEdit, setSceneToEdit] = useState<PresetScene | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync channels to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(channels));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [channels]);

  // Sync scenes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCENES, JSON.stringify(scenes));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [scenes]);

  // Sync hardware config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HARDWARE, JSON.stringify(hardwareConfig));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [hardwareConfig]);

  // Sync custom image to localStorage
  useEffect(() => {
    try {
      if (customImageUrl) {
        localStorage.setItem(STORAGE_KEY_IMAGE, customImageUrl);
      } else {
        localStorage.removeItem(STORAGE_KEY_IMAGE);
      }
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [customImageUrl]);

  // Handle hardware relay dispatch (HTTP or Serial)
  const dispatchHardwareSignal = useCallback(
    async (channelId: number, newState: boolean) => {
      if (hardwareConfig.outputMode === 'http' && hardwareConfig.httpEndpoint) {
        try {
          // Send non-blocking HTTP REST ping to vehicle relay
          fetch(`${hardwareConfig.httpEndpoint}/${channelId}/${newState ? 1 : 0}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channel: channelId, state: newState }),
            mode: 'no-cors',
          }).catch(() => {});
        } catch {
          // Silent catch in vehicle offline network
        }
      }
    },
    [hardwareConfig]
  );

  // Toggle single channel state
  const handleToggleChannel = useCallback(
    (id: number) => {
      setChannels((prev) => {
        const target = prev.find((c) => c.id === id);
        if (target && target.isEnabled === false) {
          return prev; // Disabled channels cannot be switched on
        }
        const next = prev.map((ch) => {
          if (ch.id === id) {
            const nextState = !ch.isOn;
            dispatchHardwareSignal(id, nextState);
            return { ...ch, isOn: nextState };
          }
          return ch;
        });
        return next;
      });
    },
    [dispatchHardwareSignal]
  );

  // Master ALL OFF - Instant safety cutoff
  const handleMasterAllOff = useCallback(() => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.isOn) dispatchHardwareSignal(ch.id, false);
        return { ...ch, isOn: false };
      })
    );
  }, [dispatchHardwareSignal]);

  // Master ALL ON (Only enables active/enabled channels)
  const handleMasterAllOn = useCallback(() => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.isEnabled === false) return ch; // Skip disabled channels
        if (!ch.isOn) dispatchHardwareSignal(ch.id, true);
        return { ...ch, isOn: true };
      })
    );
  }, [dispatchHardwareSignal]);

  // Apply a Preset Scene
  const handleApplyScene = useCallback(
    (sceneId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;

      setChannels((prev) =>
        prev.map((ch) => {
          const shouldBeOn = scene.activeChannelIds.includes(ch.id);
          if (ch.isOn !== shouldBeOn) {
            dispatchHardwareSignal(ch.id, shouldBeOn);
          }
          return { ...ch, isOn: shouldBeOn };
        })
      );
    },
    [scenes, dispatchHardwareSignal]
  );

  // Scene creation & edit handlers
  const handleNewScene = useCallback(() => {
    setSceneToEdit(null);
    setIsSceneEditorOpen(true);
  }, []);

  const handleEditScene = useCallback((scene: PresetScene) => {
    setSceneToEdit(scene);
    setIsSceneEditorOpen(true);
  }, []);

  const handleSaveScene = useCallback((savedScene: PresetScene) => {
    setScenes((prev) => {
      const exists = prev.some((s) => s.id === savedScene.id);
      if (exists) {
        return prev.map((s) => (s.id === savedScene.id ? savedScene : s));
      }
      return [...prev, savedScene];
    });
  }, []);

  const handleDeleteScene = useCallback((sceneId: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== sceneId));
  }, []);

  // Save edited channel
  const handleSaveChannel = useCallback((updated: ChannelConfig) => {
    setChannels((prev) => prev.map((ch) => (ch.id === updated.id ? updated : ch)));
  }, []);

  // Live update channel in real-time while editing (e.g. brightness slider & strobe mode preview)
  const handleLiveUpdateChannel = useCallback((updated: ChannelConfig) => {
    setChannels((prev) => prev.map((ch) => (ch.id === updated.id ? updated : ch)));
  }, []);

  // Reset to Factory Default Channels
  const handleResetToDefaults = useCallback(() => {
    setChannels(DEFAULT_CHANNELS);
    setScenes(PRESET_SCENES);
    setCustomImageUrl(null);
  }, []);

  // Active channels count
  const activeChannels = useMemo(() => channels.filter((c) => c.isOn), [channels]);
  const activeCount = activeChannels.length;
  const activeChannelIds = useMemo(() => activeChannels.map((c) => c.id), [activeChannels]);

  // Determine which scene is currently active if channels match
  const activeSceneId = useMemo(() => {
    const onIds = [...activeChannelIds].sort((a, b) => a - b).join(',');
    const matched = scenes.find(
      (s) => [...s.activeChannelIds].sort((a, b) => a - b).join(',') === onIds
    );
    return matched ? matched.id : null;
  }, [activeChannelIds, scenes]);

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Cockpit Master Bar - Narrow & Simple */}
      <MasterBar
        activeCount={activeCount}
        onMasterAllOff={handleMasterAllOff}
        onMasterAllOn={handleMasterAllOn}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Kiosk Touchscreen View: Vehicle stretched to fit display with zero filler space */}
      <main className="flex-1 w-full min-h-0 p-0 m-0 flex flex-col items-stretch justify-stretch overflow-hidden relative">
        <div className="w-full h-full flex-1 flex flex-col items-stretch justify-stretch">
          <HummerTopDown
            channels={channels}
            selectedChannelId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
            onToggleChannel={handleToggleChannel}
            onEditChannel={(ch) => setEditingChannel(ch)}
            customImageUrl={customImageUrl}
          />
        </div>
      </main>

      {/* Bottom Persistent Scenes Row with Scene Editor & Creator */}
      <BottomScenesBar
        presetScenes={scenes}
        activeSceneId={activeSceneId}
        onApplyScene={handleApplyScene}
        onNewScene={handleNewScene}
        onEditScene={handleEditScene}
      />

      {/* Channel Edit Modal */}
      <ChannelEditModal
        channel={editingChannel}
        isOpen={Boolean(editingChannel)}
        onClose={() => setEditingChannel(null)}
        onSave={handleSaveChannel}
        onLiveUpdate={handleLiveUpdateChannel}
      />

      {/* Scene Creator & Editor Modal */}
      <SceneEditorModal
        isOpen={isSceneEditorOpen}
        onClose={() => {
          setIsSceneEditorOpen(false);
          setSceneToEdit(null);
        }}
        sceneToEdit={sceneToEdit}
        onSaveScene={handleSaveScene}
        onDeleteScene={handleDeleteScene}
        channels={channels}
        currentActiveChannelIds={activeChannelIds}
      />

      {/* Hardware Relay Settings Modal */}
      <HardwareSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        hardwareConfig={hardwareConfig}
        onSaveHardwareConfig={setHardwareConfig}
        customImageUrl={customImageUrl}
        onSetCustomImageUrl={setCustomImageUrl}
        onResetToDefaults={handleResetToDefaults}
        channels={channels}
        onUpdateChannels={setChannels}
        onEditChannel={(ch) => setEditingChannel(ch)}
      />
    </div>
  );
}
