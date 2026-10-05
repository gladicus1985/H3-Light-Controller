import React, { useMemo, useState, useRef } from 'react';
import { ChannelConfig } from '../types';
import { DEFAULT_CHANNELS } from '../data/defaultChannels';
import * as LucideIcons from 'lucide-react';
import defaultVehiclePhoto from '../assets/images/hummer_top_down_photo_1791094226025.jpg';

interface VehicleHotspotProps {
  channel: ChannelConfig;
  isSelected: boolean;
  onToggleChannel: (id: number) => void;
  onSelectChannel: (id: number) => void;
  onEditChannel?: (channel: ChannelConfig) => void;
}

const VehicleHotspot: React.FC<VehicleHotspotProps> = ({
  channel,
  isSelected,
  onToggleChannel,
  onSelectChannel,
  onEditChannel,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const isLongPressTriggered = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  // Dynamic Lucide icon lookup with fallback
  const IconComponent = (LucideIcons as Record<string, any>)[channel.iconName] || LucideIcons.Zap;
  const isOn = channel.isOn;
  const isStrobing = channel.mode === 'strobe' && isOn;

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isLongPressTriggered.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsPressing(true);

    clearTimer();
    timerRef.current = window.setTimeout(() => {
      isLongPressTriggered.current = true;
      setIsPressing(false);
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      } catch {}
      if (onEditChannel) {
        onEditChannel(channel);
      }
    }, 500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPos.current) return;
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    // If finger moves more than 10px, cancel hold
    if (dx > 10 || dy > 10) {
      clearTimer();
      setIsPressing(false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    clearTimer();
    setIsPressing(false);

    if (isLongPressTriggered.current) {
      // Long press fired edit menu, do not toggle
      return;
    }

    // Quick tap: toggle and select
    onToggleChannel(channel.id);
    onSelectChannel(channel.id);
  };

  const handlePointerCancel = () => {
    clearTimer();
    setIsPressing(false);
    isLongPressTriggered.current = false;
  };

  return (
    <div
      id={`zone-hotspot-${channel.id}`}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer touch-none select-none"
      style={{
        left: `${channel.position.x}%`,
        top: `${channel.position.y}%`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      title={`${channel.name} (Hold to configure)`}
    >
      <div
        className={`
          relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-lg font-bold shadow-lg transition-all duration-150
          ${
            isPressing
              ? 'scale-110 ring-4 ring-amber-400 ring-offset-2 ring-offset-black bg-[#2d3440]'
              : ''
          }
          ${
            isOn
              ? `border-2 border-white shadow-[0_0_18px_rgba(255,255,255,0.7)] ${isStrobing ? 'animate-pulse' : ''}`
              : 'bg-[#181c24] border-2 border-[#384152] hover:border-[#64748b] hover:bg-[#222733]'
          }
          ${isSelected && !isPressing ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : ''}
        `}
        style={{
          backgroundColor: isOn ? channel.color : '#181c24',
          opacity: 1,
        }}
      >
        {/* Selectable icon chosen in edit channel menu - Large and high-contrast OEM laser etched */}
        <IconComponent
          className={`w-6 h-6 sm:w-6.5 sm:h-6.5 relative z-10 select-none pointer-events-none ${
            isOn
              ? (channel.color === '#F8FAFC' || channel.color === '#FEF08A' || channel.color === '#F59E0B' ? 'text-slate-950 stroke-[2.5]' : 'text-white stroke-[2.5]')
              : 'text-[#e2e8f0] stroke-[2]'
          }`}
        />
      </div>
    </div>
  );
};


interface HummerTopDownProps {
  channels: ChannelConfig[];
  selectedChannelId: number | null;
  onSelectChannel: (id: number) => void;
  onToggleChannel: (id: number) => void;
  onEditChannel?: (channel: ChannelConfig) => void;
  customImageUrl?: string | null;
}

export const HummerTopDown: React.FC<HummerTopDownProps> = ({
  channels,
  selectedChannelId,
  onSelectChannel,
  onToggleChannel,
  onEditChannel,
  customImageUrl,
}) => {
  const activeVehicleImage = customImageUrl || defaultVehiclePhoto;

  // Map channels by ID for fast lookup
  const channelMap = useMemo(() => {
    const map = new Map<number, ChannelConfig>();
    channels.forEach((c) => map.set(c.id, c));
    return map;
  }, [channels]);

  // Specific channel states for lighting effects
  const lightbar = channelMap.get(1);
  const grillePods = channelMap.get(2);
  const fogs = channelMap.get(3);
  const markers = channelMap.get(4);
  const ditchLeft = channelMap.get(5);
  const ditchRight = channelMap.get(6);
  const rockFrontLeft = channelMap.get(7);
  const rockFrontRight = channelMap.get(8);
  const campLeft = channelMap.get(9);
  const campRight = channelMap.get(10);
  const rearChase = channelMap.get(11);
  const rearBackup = channelMap.get(12);
  const rockRearLeft = channelMap.get(13);
  const rockRearRight = channelMap.get(14);
  const rearCornerLeft = channelMap.get(15);
  const rearCornerRight = channelMap.get(16);

  const getLightOffset = (ch?: ChannelConfig, svgBaselineX = 50, svgBaselineY = 50) => {
    if (!ch) return { dx: 0, dy: 0 };
    const lp = ch.lightPosition || ch.position || { x: svgBaselineX, y: svgBaselineY };
    const targetX = (lp.x / 100) * 1000;
    const targetY = (lp.y / 100) * 560;
    const baseCenterX = (svgBaselineX / 100) * 1000;
    const baseCenterY = (svgBaselineY / 100) * 560;
    return {
      dx: targetX - baseCenterX,
      dy: targetY - baseCenterY,
    };
  };

  const lbOffset = getLightOffset(lightbar, 31, 50);
  const grilleOffset = getLightOffset(grillePods, 8, 50);
  const fogsOffset = getLightOffset(fogs, 13.5, 50);
  const markersOffset = getLightOffset(markers, 43, 50);
  const markerDx = markersOffset.dx;
  const markerDy = markersOffset.dy;
  const ditchLOffset = getLightOffset(ditchLeft, 32, 19);
  const ditchROffset = getLightOffset(ditchRight, 32, 81);
  const rockFlOffset = getLightOffset(rockFrontLeft, 22, 20);
  const rockFrOffset = getLightOffset(rockFrontRight, 22, 78);
  const campLOffset = getLightOffset(campLeft, 47, 21);
  const campROffset = getLightOffset(campRight, 47, 79);
  const rearChaseOffset = getLightOffset(rearChase, 79, 50);
  const rearBackupOffset = getLightOffset(rearBackup, 73.6, 50);
  const rockRlOffset = getLightOffset(rockRearLeft, 72, 20);
  const rockRrOffset = getLightOffset(rockRearRight, 72, 78);
  const rearCornerLOffset = getLightOffset(rearCornerLeft, 82, 28);
  const rearCornerROffset = getLightOffset(rearCornerRight, 82, 72);

  const CAB_MARKER_PODS = [
    { x: 350 + markerDx, y: 200 + markerDy, cx: 356 + markerDx },
    { x: 352 + markerDx, y: 240 + markerDy, cx: 358 + markerDx },
    { x: 354 + markerDx, y: 280 + markerDy, cx: 360 + markerDx },
    { x: 352 + markerDx, y: 320 + markerDy, cx: 358 + markerDx },
    { x: 350 + markerDx, y: 360 + markerDy, cx: 356 + markerDx },
  ] as const;

  // Helper to compute visual illustration properties based on channel state, brightness and strobe mode
  const getBeamProps = (channel?: ChannelConfig, baseOpacity = 1) => {
    if (!channel || !channel.isOn || channel.isEnabled === false) {
      return { isVisible: false, opacity: 0, isStrobing: false, strobeDuration: '0.22s' };
    }
    const brightness = typeof channel.brightness === 'number' ? channel.brightness : 100;
    // Map brightness (10-100) directly to opacity: 10% = 0.14, 100% = 1.0 * baseOpacity
    const brightnessFactor = 0.08 + (brightness / 100) * 0.92;
    const opacity = Number((baseOpacity * brightnessFactor).toFixed(3));
    const isStrobing = channel.mode === 'strobe';
    const speed = channel.strobeSpeed || 4; // Hz
    const strobeDuration = `${Math.max(0.08, 1 / speed).toFixed(2)}s`;

    return { isVisible: true, opacity, isStrobing, strobeDuration };
  };

  // Precompute visual properties for all light zones
  const lightbarProps = getBeamProps(lightbar, 1);
  const grilleProps = getBeamProps(grillePods, 1);
  const fogsProps = getBeamProps(fogs, 1);
  const markersProps = getBeamProps(markers, 1);
  const ditchLeftProps = getBeamProps(ditchLeft, 1);
  const ditchRightProps = getBeamProps(ditchRight, 1);
  const rockFlProps = getBeamProps(rockFrontLeft, 1);
  const rockFrProps = getBeamProps(rockFrontRight, 1);
  const campLeftProps = getBeamProps(campLeft, 1);
  const campRightProps = getBeamProps(campRight, 1);
  const rearChaseProps = getBeamProps(rearChase, 1);
  const rearBackupProps = getBeamProps(rearBackup, 1);
  const rockRlProps = getBeamProps(rockRearLeft, 1);
  const rockRrProps = getBeamProps(rockRearRight, 1);

  // Emergency side strobe status detection
  const isLeftStrobe = Boolean(
    campLeft?.isOn &&
    campLeft.isEnabled !== false &&
    campLeft.mode === 'strobe'
  );
  const isRightStrobe = Boolean(
    campRight?.isOn &&
    campRight.isEnabled !== false &&
    campRight.mode === 'strobe'
  );

  return (
    <div className="relative w-full h-full min-h-0 select-none flex items-stretch justify-stretch overflow-hidden bg-[#0a0c10]">
      {/* Asphalt road background texture with subtle automotive road surface */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '24px 24px, 12px 12px',
          backgroundPosition: '0 0, 6px 6px',
        }}
      />

      {/* Center vehicle container fills the available screen space cleanly with zero filler space */}
      <div className="relative w-full h-full flex items-stretch justify-stretch p-0">
        
        {/* SVG BEAMS & VEHICLE LAYER */}
        <svg
          viewBox="0 0 1000 560"
          className="w-full h-full overflow-visible pointer-events-none drop-shadow-2xl"
          preserveAspectRatio="none"
        >
          <defs>
            {/* CSS Strobe Animations for Emergency Responders */}
            <style>{`
              @keyframes lightStrobeFlash {
                0%, 46% { opacity: 1; }
                46.1%, 100% { opacity: 0.04; }
              }
              @keyframes emergencyStrobeBurstLeft {
                0%, 8% { opacity: 1; }
                12%, 18% { opacity: 0.08; }
                22%, 30% { opacity: 1; }
                34%, 100% { opacity: 0.05; }
              }
              @keyframes emergencyStrobeBurstRight {
                0%, 48% { opacity: 0.05; }
                52%, 60% { opacity: 1; }
                64%, 70% { opacity: 0.08; }
                74%, 82% { opacity: 1; }
                86%, 100% { opacity: 0.05; }
              }
              .emergency-strobe-left {
                animation: emergencyStrobeBurstLeft 0.5s infinite;
              }
              .emergency-strobe-right {
                animation: emergencyStrobeBurstRight 0.5s infinite;
              }
            `}</style>

            {/* Gradients for lighting beams */}
            {/* Front Lightbar Beam - High Brightness */}
            <linearGradient id="lightbar-beam" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="12%" stopColor={lightbar?.color || '#38BDF8'} stopOpacity="0.95" />
              <stop offset="45%" stopColor={lightbar?.color || '#38BDF8'} stopOpacity="0.75" />
              <stop offset="80%" stopColor={lightbar?.color || '#38BDF8'} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lightbar?.color || '#38BDF8'} stopOpacity="0" />
            </linearGradient>

            {/* Front Grille Spot Beam */}
            <linearGradient id="grille-beam" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="15%" stopColor={grillePods?.color || '#FFFFFF'} stopOpacity="0.98" />
              <stop offset="50%" stopColor={grillePods?.color || '#FFFFFF'} stopOpacity="0.7" />
              <stop offset="80%" stopColor={grillePods?.color || '#FFFFFF'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={grillePods?.color || '#FFFFFF'} stopOpacity="0" />
            </linearGradient>

            {/* Fog Lamp Forward Beams (High-intensity linear gradients projecting forward from front bumper) */}
            <linearGradient id="fog-beam-driver" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="8%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0.98" />
              <stop offset="35%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0.8" />
              <stop offset="70%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0.45" />
              <stop offset="100%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fog-beam-passenger" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="8%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0.98" />
              <stop offset="35%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0.8" />
              <stop offset="70%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0.45" />
              <stop offset="100%" stopColor={fogs?.color || '#FBBF24'} stopOpacity="0" />
            </linearGradient>

            {/* Ditch Light Beams (Angled 45 deg) */}
            <radialGradient id="ditch-beam-left" cx="20%" cy="70%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="15%" stopColor={ditchLeft?.color || '#FFFFFF'} stopOpacity="0.95" />
              <stop offset="55%" stopColor={ditchLeft?.color || '#FFFFFF'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={ditchLeft?.color || '#FFFFFF'} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ditch-beam-right" cx="20%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="15%" stopColor={ditchRight?.color || '#FFFFFF'} stopOpacity="0.95" />
              <stop offset="55%" stopColor={ditchRight?.color || '#FFFFFF'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={ditchRight?.color || '#FFFFFF'} stopOpacity="0" />
            </radialGradient>

            {/* Rock Light Wheel Puddles - individual gradient for each wheel */}
            <radialGradient id="rock-fl-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="25%" stopColor={rockFrontLeft?.color || '#38BDF8'} stopOpacity={((rockFrontLeft?.brightness || 100) / 100) * 0.95} />
              <stop offset="60%" stopColor={rockFrontLeft?.color || '#38BDF8'} stopOpacity={((rockFrontLeft?.brightness || 100) / 100) * 0.45} />
              <stop offset="100%" stopColor={rockFrontLeft?.color || '#38BDF8'} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rock-fr-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="25%" stopColor={rockFrontRight?.color || '#38BDF8'} stopOpacity={((rockFrontRight?.brightness || 100) / 100) * 0.95} />
              <stop offset="60%" stopColor={rockFrontRight?.color || '#38BDF8'} stopOpacity={((rockFrontRight?.brightness || 100) / 100) * 0.45} />
              <stop offset="100%" stopColor={rockFrontRight?.color || '#38BDF8'} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rock-rl-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="25%" stopColor={rockRearLeft?.color || '#38BDF8'} stopOpacity={((rockRearLeft?.brightness || 100) / 100) * 0.95} />
              <stop offset="60%" stopColor={rockRearLeft?.color || '#38BDF8'} stopOpacity={((rockRearLeft?.brightness || 100) / 100) * 0.45} />
              <stop offset="100%" stopColor={rockRearLeft?.color || '#38BDF8'} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rock-rr-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="25%" stopColor={rockRearRight?.color || '#38BDF8'} stopOpacity={((rockRearRight?.brightness || 100) / 100) * 0.95} />
              <stop offset="60%" stopColor={rockRearRight?.color || '#38BDF8'} stopOpacity={((rockRearRight?.brightness || 100) / 100) * 0.45} />
              <stop offset="100%" stopColor={rockRearRight?.color || '#38BDF8'} stopOpacity="0" />
            </radialGradient>

            {/* Outward Rock Light Wheel Spray Gradients (Directly coming out of the wheels) */}
            <linearGradient id="rock-fl-outward" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="18%" stopColor={rockFrontLeft?.color || '#38BDF8'} stopOpacity={((rockFrontLeft?.brightness || 100) / 100) * 0.95} />
              <stop offset="55%" stopColor={rockFrontLeft?.color || '#38BDF8'} stopOpacity={((rockFrontLeft?.brightness || 100) / 100) * 0.5} />
              <stop offset="100%" stopColor={rockFrontLeft?.color || '#38BDF8'} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rock-fr-outward" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="18%" stopColor={rockFrontRight?.color || '#38BDF8'} stopOpacity={((rockFrontRight?.brightness || 100) / 100) * 0.95} />
              <stop offset="55%" stopColor={rockFrontRight?.color || '#38BDF8'} stopOpacity={((rockFrontRight?.brightness || 100) / 100) * 0.5} />
              <stop offset="100%" stopColor={rockFrontRight?.color || '#38BDF8'} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rock-rl-outward" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="18%" stopColor={rockRearLeft?.color || '#38BDF8'} stopOpacity={((rockRearLeft?.brightness || 100) / 100) * 0.95} />
              <stop offset="55%" stopColor={rockRearLeft?.color || '#38BDF8'} stopOpacity={((rockRearLeft?.brightness || 100) / 100) * 0.5} />
              <stop offset="100%" stopColor={rockRearLeft?.color || '#38BDF8'} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rock-rr-outward" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="18%" stopColor={rockRearRight?.color || '#38BDF8'} stopOpacity={((rockRearRight?.brightness || 100) / 100) * 0.95} />
              <stop offset="55%" stopColor={rockRearRight?.color || '#38BDF8'} stopOpacity={((rockRearRight?.brightness || 100) / 100) * 0.5} />
              <stop offset="100%" stopColor={rockRearRight?.color || '#38BDF8'} stopOpacity="0" />
            </linearGradient>

            {/* Cab marker forward amber light wash */}
            <linearGradient id="cab-marker-wash" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor={markers?.color || '#F59E0B'} stopOpacity="0.85" />
              <stop offset="50%" stopColor={markers?.color || '#F59E0B'} stopOpacity="0.35" />
              <stop offset="100%" stopColor={markers?.color || '#F59E0B'} stopOpacity="0" />
            </linearGradient>

            {/* Side Scene Floods / Emergency Strobes */}
            <radialGradient id="camp-beam-left" cx="50%" cy="100%" r="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="15%" stopColor={campLeft?.color || '#FEF08A'} stopOpacity="0.95" />
              <stop offset="50%" stopColor={campLeft?.color || '#FEF08A'} stopOpacity="0.5" />
              <stop offset="100%" stopColor={campLeft?.color || '#FEF08A'} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="camp-beam-right" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="15%" stopColor={campRight?.color || '#FEF08A'} stopOpacity="0.95" />
              <stop offset="50%" stopColor={campRight?.color || '#FEF08A'} stopOpacity="0.5" />
              <stop offset="100%" stopColor={campRight?.color || '#FEF08A'} stopOpacity="0" />
            </radialGradient>

            {/* Rear Backup / Reverse Floods */}
            <linearGradient id="rear-flood" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="15%" stopColor={rearBackup?.color || '#FFFFFF'} stopOpacity="0.95" />
              <stop offset="55%" stopColor={rearBackup?.color || '#FFFFFF'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={rearBackup?.color || '#FFFFFF'} stopOpacity="0" />
            </linearGradient>

            {/* Rear Dust / Chase Light */}
            <linearGradient id="rear-chase" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="15%" stopColor={rearChase?.color || '#EF4444'} stopOpacity="0.95" />
              <stop offset="55%" stopColor={rearChase?.color || '#EF4444'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={rearChase?.color || '#EF4444'} stopOpacity="0" />
            </linearGradient>

            {/* Vehicle body metallic gradient */}
            <linearGradient id="pewter-body" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78736a" />
              <stop offset="18%" stopColor="#969085" />
              <stop offset="35%" stopColor="#a9a397" />
              <stop offset="50%" stopColor="#b4ae9f" />
              <stop offset="65%" stopColor="#a9a397" />
              <stop offset="82%" stopColor="#969085" />
              <stop offset="100%" stopColor="#78736a" />
            </linearGradient>

            {/* Hood louvers gradient */}
            <linearGradient id="hood-louver" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1f2328" />
              <stop offset="50%" stopColor="#2e343c" />
              <stop offset="100%" stopColor="#1f2328" />
            </linearGradient>

            {/* Sunroof glass tint */}
            <linearGradient id="sunroof-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16202c" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#243447" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#111923" stopOpacity="0.95" />
            </linearGradient>

            {/* Tire rubber */}
            <radialGradient id="tire-tread" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#111316" />
              <stop offset="60%" stopColor="#252a30" />
              <stop offset="85%" stopColor="#191c21" />
              <stop offset="100%" stopColor="#0d0e11" />
            </radialGradient>
          </defs>

          {/* ========================================================================= */}
          {/* UNDERBODY CHASSIS GLOW (Rendered beneath the vehicle body)               */}
          {/* ========================================================================= */}

          {/* Rock Lights: Positioned right on each of the four wheels with light casting OUT of the wheels */}
          {/* 1. Front Left Wheel Rock Light (Ch 7) */}
          {rockFlProps.isVisible && (
            <g id="rock-light-fl" opacity={rockFlProps.opacity} transform={`translate(${rockFlOffset.dx}, ${rockFlOffset.dy})`}>
              <g style={rockFlProps.isStrobing ? { animation: `lightStrobeFlash ${rockFlProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam shooting out of wheel toward outer road */}
                <polygon
                  points="160,130 285,130 350,-40 90,-40"
                  fill="url(#rock-fl-outward)"
                  opacity="0.9"
                />
                <ellipse cx="222" cy="120" rx="95" ry="58" fill="url(#rock-fl-glow)" />
                <ellipse cx="222" cy="120" rx="45" ry="26" fill={rockFrontLeft?.color || '#38BDF8'} opacity="0.7" />
              </g>
            </g>
          )}

          {/* 2. Front Right Wheel Rock Light (Ch 8 - Touching Wheel Well) */}
          {rockFrProps.isVisible && (
            <g id="rock-light-fr" opacity={rockFrProps.opacity} transform={`translate(${rockFrOffset.dx}, ${rockFrOffset.dy})`}>
              <g style={rockFrProps.isStrobing ? { animation: `lightStrobeFlash ${rockFrProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam coming directly from touching the wheel well arch outward onto road */}
                <polygon
                  points="160,412 285,412 350,600 90,600"
                  fill="url(#rock-fr-outward)"
                  opacity="0.9"
                />
                <ellipse cx="222" cy="416" rx="95" ry="58" fill="url(#rock-fr-glow)" />
                <ellipse cx="222" cy="416" rx="45" ry="26" fill={rockFrontRight?.color || '#38BDF8'} opacity="0.7" />
              </g>
            </g>
          )}

          {/* 3. Rear Left Wheel Rock Light (Ch 13) */}
          {rockRlProps.isVisible && (
            <g id="rock-light-rl" opacity={rockRlProps.opacity} transform={`translate(${rockRlOffset.dx}, ${rockRlOffset.dy})`}>
              <g style={rockRlProps.isStrobing ? { animation: `lightStrobeFlash ${rockRlProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam shooting out of wheel toward outer road */}
                <polygon
                  points="655,130 780,130 845,-40 590,-40"
                  fill="url(#rock-rl-outward)"
                  opacity="0.9"
                />
                <ellipse cx="718" cy="120" rx="95" ry="58" fill="url(#rock-rl-glow)" />
                <ellipse cx="718" cy="120" rx="45" ry="26" fill={rockRearLeft?.color || '#38BDF8'} opacity="0.7" />
              </g>
            </g>
          )}

          {/* 4. Rear Right Wheel Rock Light (Ch 14 - Touching Wheel Well) */}
          {rockRrProps.isVisible && (
            <g id="rock-light-rr" opacity={rockRrProps.opacity} transform={`translate(${rockRrOffset.dx}, ${rockRrOffset.dy})`}>
              <g style={rockRrProps.isStrobing ? { animation: `lightStrobeFlash ${rockRrProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam coming directly from touching the wheel well arch outward onto road */}
                <polygon
                  points="655,412 780,412 845,600 590,600"
                  fill="url(#rock-rr-outward)"
                  opacity="0.9"
                />
                <ellipse cx="718" cy="416" rx="95" ry="58" fill="url(#rock-rr-glow)" />
                <ellipse cx="718" cy="416" rx="45" ry="26" fill={rockRearRight?.color || '#38BDF8'} opacity="0.7" />
              </g>
            </g>
          )}

          {/* ========================================================================= */}
          {/* VEHICLE PHOTO BASE (Default Hummer H3 photo image stretched to full frame) */}
          {/* ========================================================================= */}
          <image
            href={activeVehicleImage}
            x="0"
            y="0"
            width="1000"
            height="560"
            preserveAspectRatio="none"
          />

          {/* ========================================================================= */}
          {/* EXTERIOR HIGH-BRIGHTNESS PROJECTION BEAMS (EXITING VEHICLE BODY ONTO ROAD) */}
          {/* ========================================================================= */}

          {/* Front Lightbar Massive Forward Throw (Exiting roof brow forward across hood onto road) */}
          {lightbarProps.isVisible && !lightbar?.name.toLowerCase().includes('aux') && (
            <g id="front-lightbar-throw" opacity={lightbarProps.opacity} transform={`translate(${lbOffset.dx}, ${lbOffset.dy})`}>
              <g style={lightbarProps.isStrobing ? { animation: `lightStrobeFlash ${lightbarProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="315,185 315,375 0,550 0,10"
                  fill="url(#lightbar-beam)"
                  opacity="0.88"
                />
                <polygon
                  points="315,225 315,335 0,440 0,120"
                  fill="url(#lightbar-beam)"
                  opacity="0.95"
                />
                {/* High intensity lightbar lens face highlight */}
                <line x1="318" y1="195" x2="318" y2="365" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.95" />
              </g>
            </g>
          )}

          {/* Front Grille Spot Pods (Exiting center chrome grille forward) */}
          {grilleProps.isVisible && (
            <g id="front-grille-beam" opacity={grilleProps.opacity} transform={`translate(${grilleOffset.dx}, ${grilleOffset.dy})`}>
              <g style={grilleProps.isStrobing ? { animation: `lightStrobeFlash ${grilleProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="80,240 80,320 -20,390 -20,170"
                  fill="url(#grille-beam)"
                  opacity="0.85"
                />
                <polygon
                  points="80,260 80,300 -20,330 -20,230"
                  fill="url(#grille-beam)"
                  opacity="0.98"
                />
              </g>
            </g>
          )}

          {/* Front Fog Lamps - High-intensity beams projecting directly outward from the front bumper */}
          {fogsProps.isVisible && (
            <g id="front-fogs-group" opacity={fogsProps.opacity} transform={`translate(${fogsOffset.dx}, ${fogsOffset.dy})`}>
              <g style={fogsProps.isStrobing ? { animation: `lightStrobeFlash ${fogsProps.strobeDuration} infinite` } : undefined}>
                <g id="front-fog-driver">
                  {/* Wide forward projection cone exiting driver fog lamp */}
                  <polygon
                    points="135,140 135,154 0,282 0,12"
                    fill="url(#fog-beam-driver)"
                  />
                  {/* Intense focused core beam */}
                  <polygon
                    points="135,144 135,150 0,212 0,82"
                    fill="url(#fog-beam-driver)"
                    opacity="0.92"
                  />
                  {/* Lens face hot spot at front bumper */}
                  <ellipse cx="135" cy="147" rx="16" ry="11" fill={fogs?.color || '#FBBF24'} />
                  {/* Ground road pool in front of vehicle */}
                  <ellipse cx="45" cy="147" rx="75" ry="40" fill="url(#fog-beam-driver)" opacity="0.65" />
                </g>
                <g id="front-fog-passenger">
                  {/* Wide forward projection cone exiting passenger fog lamp */}
                  <polygon
                    points="135,406 135,420 0,548 0,278"
                    fill="url(#fog-beam-passenger)"
                  />
                  {/* Intense focused core beam */}
                  <polygon
                    points="135,410 135,416 0,478 0,348"
                    fill="url(#fog-beam-passenger)"
                    opacity="0.92"
                  />
                  {/* Lens face hot spot at front bumper */}
                  <ellipse cx="135" cy="413" rx="16" ry="11" fill={fogs?.color || '#FBBF24'} />
                  {/* Ground road pool in front of vehicle */}
                  <ellipse cx="45" cy="413" rx="75" ry="40" fill="url(#fog-beam-passenger)" opacity="0.65" />
                </g>
              </g>
            </g>
          )}

          {/* Ditch Lights (Exiting 45 degrees outward from cowl mirrors) */}
          {ditchLeftProps.isVisible && (
            <g id="ditch-left" opacity={ditchLeftProps.opacity} transform={`translate(${ditchLOffset.dx}, ${ditchLOffset.dy})`}>
              <g style={ditchLeftProps.isStrobing ? { animation: `lightStrobeFlash ${ditchLeftProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="335,138 315,122 0,-30 180,-30"
                  fill="url(#ditch-beam-left)"
                />
              </g>
            </g>
          )}
          {ditchRightProps.isVisible && (
            <g id="ditch-right" opacity={ditchRightProps.opacity} transform={`translate(${ditchROffset.dx}, ${ditchROffset.dy})`}>
              <g style={ditchRightProps.isStrobing ? { animation: `lightStrobeFlash ${ditchRightProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="335,422 315,438 0,590 180,590"
                  fill="url(#ditch-beam-right)"
                />
              </g>
            </g>
          )}

          {/* Side Emergency Strobes / Scene Flood Beams */}
          {campLeftProps.isVisible && (
            <g id="side-left-beam" opacity={campLeftProps.opacity} className={isLeftStrobe ? 'emergency-strobe-left' : ''} transform={`translate(${campLOffset.dx}, ${campLOffset.dy})`}>
              <polygon
                points="400,162 680,162 830,-20 250,-20"
                fill="url(#camp-beam-left)"
              />
              {/* Flashing emergency strobe lightheads along left perimeter directly off vehicle body */}
              {isLeftStrobe && (
                <g id="emergency-heads-left">
                  {[400, 470, 560].map((xPos, idx) => (
                    <g key={idx}>
                      <ellipse cx={xPos} cy="158" rx="14" ry="7" fill={campLeft?.color || '#F59E0B'} opacity="0.85" />
                      <rect x={xPos - 7} y="154" width="14" height="8" rx="2" fill="#FFFFFF" stroke={campLeft?.color || '#F59E0B'} strokeWidth="1.5" />
                    </g>
                  ))}
                </g>
              )}
            </g>
          )}
          {campRightProps.isVisible && (
            <g id="side-right-beam" opacity={campRightProps.opacity} className={isRightStrobe ? 'emergency-strobe-right' : ''} transform={`translate(${campROffset.dx}, ${campROffset.dy})`}>
              <polygon
                points="400,398 680,398 830,580 250,580"
                fill="url(#camp-beam-right)"
              />
              {/* Flashing emergency strobe lightheads along right perimeter directly off vehicle body */}
              {isRightStrobe && (
                <g id="emergency-heads-right">
                  {[400, 470, 560].map((xPos, idx) => (
                    <g key={idx}>
                      <ellipse cx={xPos} cy="402" rx="14" ry="7" fill={campRight?.color || '#F59E0B'} opacity="0.85" />
                      <rect x={xPos - 7} y="398" width="14" height="8" rx="2" fill="#FFFFFF" stroke={campRight?.color || '#F59E0B'} strokeWidth="1.5" />
                    </g>
                  ))}
                </g>
              )}
            </g>
          )}

          {/* Rear Backup / Reverse Floods (Mounted on Rear Roof Rack Bar, projecting backward) */}
          {rearBackupProps.isVisible && (
            <g id="rear-backup-beam" opacity={rearBackupProps.opacity} transform={`translate(${rearBackupOffset.dx}, ${rearBackupOffset.dy})`}>
              <g style={rearBackupProps.isStrobing ? { animation: `lightStrobeFlash ${rearBackupProps.strobeDuration} infinite` } : undefined}>
                {/* Wide flood dispersion cone originating from rear roof rack crossbar */}
                <polygon
                  points="736,200 736,360 1000,500 1000,60"
                  fill="url(#rear-flood)"
                />
                {/* Focused intense core beam */}
                <polygon
                  points="736,235 736,325 1000,410 1000,150"
                  fill="url(#rear-flood)"
                  opacity="0.92"
                />
                {/* High-output flood pods mounted directly on the rear roof rack crossbar */}
                <rect x="734" y="235" width="6" height="90" rx="2" fill="#FFFFFF" stroke={rearBackup?.color || '#FFFFFF'} strokeWidth="1" />
                <ellipse cx="737" cy="280" rx="10" ry="46" fill={rearBackup?.color || '#FFFFFF'} opacity="0.85" />
              </g>
            </g>
          )}

          {/* Rear Dust / Chase Light Bar */}
          {rearChaseProps.isVisible && (
            <g id="rear-chase-beam" opacity={rearChaseProps.opacity} transform={`translate(${rearChaseOffset.dx}, ${rearChaseOffset.dy})`}>
              <g style={rearChaseProps.isStrobing ? { animation: `lightStrobeFlash ${rearChaseProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="795,240 795,320 1000,410 1000,150"
                  fill="url(#rear-chase)"
                />
                <rect x="793" y="245" width="6" height="70" rx="2" fill={rearChase?.color || '#EF4444'} />
              </g>
            </g>
          )}

          {/* Rock Lights Wheel Illumination Overlay: Light bursting directly OUT of the wheels */}
          {/* 1. Front Left Wheel (White beam lines removed) */}
          {rockFlProps.isVisible && (
            <g id="rock-overlay-fl" opacity={rockFlProps.opacity} transform={`translate(${rockFlOffset.dx}, ${rockFlOffset.dy})`}>
              <g style={rockFlProps.isStrobing ? { animation: `lightStrobeFlash ${rockFlProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD through the wheel rim onto the road */}
                <polygon points="175,120 270,120 310,35 135,35" fill="url(#rock-fl-outward)" opacity="0.95" />
                <ellipse cx="222" cy="115" rx="46" ry="24" fill="url(#rock-fl-glow)" opacity="0.95" />
              </g>
            </g>
          )}

          {/* 2. Front Right Wheel (Touching Wheel Well, White beam lines removed) */}
          {rockFrProps.isVisible && (
            <g id="rock-overlay-fr" opacity={rockFrProps.opacity} transform={`translate(${rockFrOffset.dx}, ${rockFrOffset.dy})`}>
              <g style={rockFrProps.isStrobing ? { animation: `lightStrobeFlash ${rockFrProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD directly from touching the wheel well */}
                <polygon points="175,412 270,412 310,525 135,525" fill="url(#rock-fr-outward)" opacity="0.95" />
                <ellipse cx="222" cy="416" rx="46" ry="24" fill="url(#rock-fr-glow)" opacity="0.95" />
              </g>
            </g>
          )}

          {/* 3. Rear Left Wheel (White beam lines removed) */}
          {rockRlProps.isVisible && (
            <g id="rock-overlay-rl" opacity={rockRlProps.opacity} transform={`translate(${rockRlOffset.dx}, ${rockRlOffset.dy})`}>
              <g style={rockRlProps.isStrobing ? { animation: `lightStrobeFlash ${rockRlProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD through the wheel rim onto the road */}
                <polygon points="670,120 765,120 805,35 630,35" fill="url(#rock-rl-outward)" opacity="0.95" />
                <ellipse cx="718" cy="115" rx="46" ry="24" fill="url(#rock-rl-glow)" opacity="0.95" />
              </g>
            </g>
          )}

          {/* 4. Rear Right Wheel (Touching Wheel Well, White beam lines removed) */}
          {rockRrProps.isVisible && (
            <g id="rock-overlay-rr" opacity={rockRrProps.opacity} transform={`translate(${rockRrOffset.dx}, ${rockRrOffset.dy})`}>
              <g style={rockRrProps.isStrobing ? { animation: `lightStrobeFlash ${rockRrProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD directly from touching the wheel well */}
                <polygon points="670,412 765,412 805,525 630,525" fill="url(#rock-rr-outward)" opacity="0.95" />
                <ellipse cx="718" cy="416" rx="46" ry="24" fill="url(#rock-rr-glow)" opacity="0.95" />
              </g>
            </g>
          )}

          {/* Cab markers illuminated overlay */}
          {markersProps.isVisible && (
            <g id="amber-cab-marker-custom-overlay" opacity={markersProps.opacity}>
              <g style={markersProps.isStrobing ? { animation: `lightStrobeFlash ${markersProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points={`${380 + markerDx},${200 + markerDy} ${380 + markerDx},${360 + markerDy} ${290 + markerDx},${375 + markerDy} ${290 + markerDx},${185 + markerDy}`}
                  fill="url(#cab-marker-wash)"
                  opacity="0.8"
                />
                {CAB_MARKER_PODS.map((pod, idx) => {
                  const isMarkerOn = markersProps.isVisible;
                  const markerColor = markers?.color || '#F59E0B';
                  return (
                    <g key={`custom-cab-${idx}`}>
                      {isMarkerOn && (
                        <ellipse cx={pod.cx} cy={pod.y} rx="16" ry="10" fill={markerColor} opacity="0.6" />
                      )}
                      <rect x={pod.x} y={pod.y - 6} width="13" height="12" rx="4" fill="#222730" stroke="#101317" strokeWidth="1.2" />
                      <rect x={pod.x + 1.5} y={pod.y - 4.5} width="9.5" height="9" rx="2.5" fill={isMarkerOn ? markerColor : '#3e4450'} stroke={isMarkerOn ? '#FBBF24' : '#272c35'} strokeWidth="0.8" />
                      {isMarkerOn && (
                        <>
                          <circle cx={pod.cx} cy={pod.y} r="2.8" fill="#FFFBEB" />
                          <circle cx={pod.cx} cy={pod.y} r="1.4" fill="#FFFFFF" />
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            </g>
          )}
        </svg>

        {/* ========================================================================= */}
        {/* INTERACTIVE SWITCH HOTSPOTS (16 CHANNELS - SELECTABLE ICONS, HOLD TO EDIT) */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 pointer-events-auto">
          {channels.map((ch) => {
            // If a channel is disabled, fully hide the icon (can be re-enabled in settings menu)
            if (ch.isEnabled === false) return null;

            return (
              <VehicleHotspot
                key={ch.id}
                channel={ch}
                isSelected={selectedChannelId === ch.id}
                onToggleChannel={onToggleChannel}
                onSelectChannel={onSelectChannel}
                onEditChannel={onEditChannel}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
