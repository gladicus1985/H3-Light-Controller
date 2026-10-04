/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChannelConfig, HardwareConfig, PresetScene } from './types';
import { DEFAULT_CHANNELS, PRESET_SCENES } from './data/defaultChannels';
import { HummerTopDown } from './components/HummerTopDown';
import { MasterBar } from './components/MasterBar';
import { ChannelEditModal } from './components/ChannelEditModal';
import { HardwareSettingsModal } from './components/HardwareSettingsModal';
import { BottomScenesBar } from './components/BottomScenesBar';
import { SceneEditorModal } from './components/SceneEditorModal';
import { SOSEditModal, SOSConfig } from './components/SOSEditModal';
import { ShieldAlert } from 'lucide-react';
import defaultVehiclePhoto from './assets/images/hummer_top_down_photo_1791094226025.jpg';

const STORAGE_KEY_CHANNELS = 'hummer_h3_channels_v8';
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
            const defaultCh = DEFAULT_CHANNELS.find(d => d.id === ch.id);
            if (ch.id === 2) {
              return {
                ...ch,
                position: { x: 8, y: 50 },
                lightPosition: { x: 8, y: 50 },
              };
            }
            const targetPos = ch.lightPosition || defaultCh?.lightPosition || defaultCh?.position || ch.position;
            return {
              ...ch,
              position: { ...targetPos },
            };
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

  // Optional custom vehicle image URL (defaulting to user-aligned Hummer H3 photo matching zHpkR.jpg)
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_IMAGE) || defaultVehiclePhoto;
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

  // SOS state & config
  const STORAGE_KEY_SOS = 'hummer_h3_sos_config_v1';
  const preSosChannelsRef = useRef<ChannelConfig[] | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);
  const [isSosVerifyOpen, setIsSosVerifyOpen] = useState(false);
  const [isSosEditOpen, setIsSosEditOpen] = useState(false);
  const [sosConfig, setSosConfig] = useState<SOSConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      speed: 200,
      brightness: 100,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOS, JSON.stringify(sosConfig));
    } catch {}
  }, [sosConfig]);

  const handleActivateSosClick = () => {
    setIsSosVerifyOpen(true);
  };

  const handleConfirmSos = () => {
    preSosChannelsRef.current = JSON.parse(JSON.stringify(channels));
    setIsSosVerifyOpen(false);
    setIsSosActive(true);
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.isEnabled === false) return ch;
        dispatchHardwareSignal(ch.id, true);
        return {
          ...ch,
          isOn: true,
          mode: 'strobe',
          brightness: sosConfig.brightness,
          strobeSpeed: sosConfig.speed,
        };
      })
    );
  };

  const handleDeactivateSos = () => {
    setIsSosActive(false);
    if (preSosChannelsRef.current) {
      const restored = preSosChannelsRef.current;
      setChannels(restored);
      restored.forEach((ch) => {
        dispatchHardwareSignal(ch.id, ch.isOn);
      });
      preSosChannelsRef.current = null;
    } else {
      handleMasterAllOff();
    }
  };

  const handleCancelSos = () => {
    setIsSosVerifyOpen(false);
  };

  const handleOpenSosSettings = () => {
    setIsSosEditOpen(true);
  };

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
    setIsSosActive(false);
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
        isSosActive={isSosActive}
        onMasterAllOff={handleMasterAllOff}
        onMasterAllOn={handleMasterAllOn}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onActivateSosClick={handleActivateSosClick}
        onOpenSosSettings={handleOpenSosSettings}
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

      {/* SOS Edit Modal */}
      <SOSEditModal
        isOpen={isSosEditOpen}
        onClose={() => setIsSosEditOpen(false)}
        config={sosConfig}
        onSave={setSosConfig}
      />

      {/* SOS Verification Prompt Modal */}
      {isSosVerifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-[#161a22] border-2 border-red-500/50 rounded-2xl shadow-2xl p-6 text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 mx-auto flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Activate SOS?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All 16 vehicle lighting channels will be engaged in high-intensity emergency strobe mode while retaining their individual colors.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelSos}
                className="py-2.5 rounded-xl bg-[#222936] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-[#323d4e] transition-colors"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmSos}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Large Fixed Deactivate SOS Button Overlay */}
      {isSosActive && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40">
          <button
            type="button"
            id="btn-deactivate-sos-fixed"
            onClick={handleDeactivateSos}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-lg font-black uppercase tracking-wider rounded-2xl shadow-2xl border-4 border-red-300 flex items-center gap-3 cursor-pointer ring-4 ring-red-600/50"
          >
            <ShieldAlert className="w-7 h-7" />
            <span>DEACTIVATE SOS</span>
          </button>
        </div>
      )}
    </div>
  );
}
