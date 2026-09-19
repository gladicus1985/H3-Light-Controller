import React, { useMemo, useState, useRef } from 'react';
import { ChannelConfig } from '../types';
import * as LucideIcons from 'lucide-react';

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
      title={`Channel ${channel.id}: ${channel.name} (Press & Hold to Edit)`}
    >
      <div
        className={`
          relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full font-bold shadow-md transition-all duration-200
          ${
            isPressing
              ? 'scale-125 ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
              : ''
          }
          ${
            isOn
              ? `text-slate-950 font-black ring-2 ring-white shadow-[0_0_14px_rgba(255,255,255,0.7)] ${isStrobing ? 'animate-pulse' : ''}`
              : 'bg-slate-950 text-slate-200 border-2 border-slate-600 hover:border-slate-400'
          }
          ${isSelected && !isPressing ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950' : ''}
        `}
        style={{
          backgroundColor: isOn ? channel.color : undefined,
          boxShadow: isOn ? `0 0 16px ${channel.color}` : undefined,
        }}
      >
        {/* Selectable icon chosen in edit channel menu */}
        <IconComponent
          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 relative z-10 select-none pointer-events-none ${
            isOn ? 'text-slate-950' : 'text-slate-200'
          }`}
        />

        {/* Small corner channel number badge for quick numeric reference */}
        <span
          className="absolute -bottom-1 -right-1 text-[8.5px] font-mono font-black px-1 rounded-full bg-slate-950/95 text-slate-300 border border-slate-700/80 shadow-sm leading-tight select-none pointer-events-none"
        >
          {channel.id}
        </span>
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

  // 5 Amber Cab Marker lights positioned on the vehicle's metal roof panel in front of sunroof
  const CAB_MARKER_PODS = [
    { x: 372, y: 218, cx: 378 },
    { x: 375, y: 249, cx: 381 },
    { x: 377, y: 280, cx: 383 },
    { x: 375, y: 311, cx: 381 },
    { x: 372, y: 342, cx: 378 },
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
    (campLeft.mode === 'strobe' || campLeft.name.toLowerCase().includes('strobe'))
  );
  const isRightStrobe = Boolean(
    campRight?.isOn &&
    campRight.isEnabled !== false &&
    (campRight.mode === 'strobe' || campRight.name.toLowerCase().includes('strobe'))
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
            <g id="rock-light-fl" opacity={rockFlProps.opacity}>
              <g style={rockFlProps.isStrobing ? { animation: `lightStrobeFlash ${rockFlProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam shooting out of wheel toward outer road */}
                <polygon
                  points="160,130 285,130 350,-40 90,-40"
                  fill="url(#rock-fl-outward)"
                  opacity="0.9"
                />
                <ellipse cx="222" cy="120" rx="95" ry="58" fill="url(#rock-fl-glow)" />
                <ellipse cx="222" cy="120" rx="45" ry="26" fill={rockFrontLeft?.color || '#38BDF8'} opacity="0.7" />
                <circle cx="222" cy="120" r="14" fill={rockFrontLeft?.color || '#38BDF8'} />
                <circle cx="222" cy="120" r="7" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 2. Front Right Wheel Rock Light (Ch 8 - Touching Wheel Well) */}
          {rockFrProps.isVisible && (
            <g id="rock-light-fr" opacity={rockFrProps.opacity}>
              <g style={rockFrProps.isStrobing ? { animation: `lightStrobeFlash ${rockFrProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam coming directly from touching the wheel well arch outward onto road */}
                <polygon
                  points="160,412 285,412 350,600 90,600"
                  fill="url(#rock-fr-outward)"
                  opacity="0.9"
                />
                <ellipse cx="222" cy="416" rx="95" ry="58" fill="url(#rock-fr-glow)" />
                <ellipse cx="222" cy="416" rx="45" ry="26" fill={rockFrontRight?.color || '#38BDF8'} opacity="0.7" />
                <circle cx="222" cy="416" r="14" fill={rockFrontRight?.color || '#38BDF8'} />
                <circle cx="222" cy="416" r="7" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 3. Rear Left Wheel Rock Light (Ch 13) */}
          {rockRlProps.isVisible && (
            <g id="rock-light-rl" opacity={rockRlProps.opacity}>
              <g style={rockRlProps.isStrobing ? { animation: `lightStrobeFlash ${rockRlProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam shooting out of wheel toward outer road */}
                <polygon
                  points="655,130 780,130 845,-40 590,-40"
                  fill="url(#rock-rl-outward)"
                  opacity="0.9"
                />
                <ellipse cx="718" cy="120" rx="95" ry="58" fill="url(#rock-rl-glow)" />
                <ellipse cx="718" cy="120" rx="45" ry="26" fill={rockRearLeft?.color || '#38BDF8'} opacity="0.7" />
                <circle cx="718" cy="120" r="14" fill={rockRearLeft?.color || '#38BDF8'} />
                <circle cx="718" cy="120" r="7" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 4. Rear Right Wheel Rock Light (Ch 14 - Touching Wheel Well) */}
          {rockRrProps.isVisible && (
            <g id="rock-light-rr" opacity={rockRrProps.opacity}>
              <g style={rockRrProps.isStrobing ? { animation: `lightStrobeFlash ${rockRrProps.strobeDuration} infinite` } : undefined}>
                {/* Lateral beam coming directly from touching the wheel well arch outward onto road */}
                <polygon
                  points="655,412 780,412 845,600 590,600"
                  fill="url(#rock-rr-outward)"
                  opacity="0.9"
                />
                <ellipse cx="718" cy="416" rx="95" ry="58" fill="url(#rock-rr-glow)" />
                <ellipse cx="718" cy="416" rx="45" ry="26" fill={rockRearRight?.color || '#38BDF8'} opacity="0.7" />
                <circle cx="718" cy="416" r="14" fill={rockRearRight?.color || '#38BDF8'} />
                <circle cx="718" cy="416" r="7" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* ========================================================================= */}
          {/* VEHICLE BODY SCHEMATIC (Accurately scaled top-down Hummer H3) */}
          {/* ========================================================================= */}
          
          {/* If user provided custom image, stretch it to fit the entire display with no filler space */}
          {customImageUrl ? (
            <image
              href={customImageUrl}
              x="0"
              y="0"
              width="1000"
              height="560"
              preserveAspectRatio="none"
            />
          ) : (
            <g id="hummer-h3-model">
              {/* Drop shadow under vehicle body */}
              <rect
                x="115"
                y="130"
                width="720"
                height="300"
                rx="35"
                fill="#05070a"
                opacity="0.8"
                filter="blur(14px)"
              />

              {/* Tires / Wheels sticking out at corners */}
              {/* Front Left Tire */}
              <rect x="175" y="112" width="95" height="34" rx="8" fill="#1b1e23" stroke="#0e1014" strokeWidth="2" />
              {/* Front Right Tire */}
              <rect x="175" y="414" width="95" height="34" rx="8" fill="#1b1e23" stroke="#0e1014" strokeWidth="2" />
              {/* Rear Left Tire */}
              <rect x="670" y="112" width="95" height="34" rx="8" fill="#1b1e23" stroke="#0e1014" strokeWidth="2" />
              {/* Rear Right Tire */}
              <rect x="670" y="414" width="95" height="34" rx="8" fill="#1b1e23" stroke="#0e1014" strokeWidth="2" />

              {/* Rocker Panels / Rock Sliders under doors */}
              <rect x="330" y="128" width="310" height="14" rx="5" fill="#181c20" stroke="#0d0e12" strokeWidth="1.5" />
              <rect x="330" y="418" width="310" height="14" rx="5" fill="#181c20" stroke="#0d0e12" strokeWidth="1.5" />

              {/* Heavy Duty Front Bumper Assembly */}
              <path
                d="M 115 170 C 105 200, 105 360, 115 390 L 135 385 L 135 175 Z"
                fill="#1c2026"
                stroke="#0e1014"
                strokeWidth="2"
              />
              {/* Front Tow Loops & Skid Plate */}
              <rect x="108" y="240" width="10" height="15" rx="3" fill="#333a42" />
              <rect x="108" y="305" width="10" height="15" rx="3" fill="#333a42" />

              {/* Main Hummer H3 Body Outline (Pewter Metallic) */}
              <path
                d="
                  M 130 180
                  C 130 170, 140 162, 155 160
                  L 175 140
                  L 270 140
                  L 290 160
                  L 660 160
                  L 680 140
                  L 775 140
                  L 795 165
                  L 815 175
                  L 815 385
                  L 795 395
                  L 775 420
                  L 680 420
                  L 660 400
                  L 290 400
                  L 270 420
                  L 175 420
                  L 155 400
                  C 140 398, 130 390, 130 380
                  Z
                "
                fill="url(#pewter-body)"
                stroke="#524d45"
                strokeWidth="2.5"
              />

              {/* Prominent H3 Flared Wheel Arches (Fender Flares) */}
              {/* Front Left Flare */}
              <path d="M 170 160 L 180 138 L 265 138 L 275 160 Z" fill="#69645c" stroke="#48443e" strokeWidth="1.5" />
              {/* Front Right Flare */}
              <path d="M 170 400 L 180 422 L 265 422 L 275 400 Z" fill="#69645c" stroke="#48443e" strokeWidth="1.5" />
              {/* Rear Left Flare */}
              <path d="M 675 160 L 685 138 L 770 138 L 780 160 Z" fill="#69645c" stroke="#48443e" strokeWidth="1.5" />
              {/* Rear Right Flare */}
              <path d="M 675 400 L 685 422 L 770 422 L 780 400 Z" fill="#69645c" stroke="#48443e" strokeWidth="1.5" />

              {/* Iconic 7-Slot Grille & Front Fascia */}
              <rect x="128" y="210" width="10" height="140" rx="3" fill="#1a1d22" stroke="#48443e" strokeWidth="1.5" />
              {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
                <rect
                  key={slot}
                  x="129"
                  y={218 + slot * 18}
                  width="7"
                  height="12"
                  rx="2"
                  fill="#0a0c0e"
                />
              ))}

              {/* Headlights & Turn Signals */}
              <circle cx="134" cy="195" r="9" fill={grillePods?.isOn ? (grillePods.color || '#FFFFFF') : '#2d333b'} stroke="#60666f" strokeWidth="1.5" />
              <circle cx="134" cy="365" r="9" fill={grillePods?.isOn ? (grillePods.color || '#FFFFFF') : '#2d333b'} stroke="#60666f" strokeWidth="1.5" />
              {/* Amber Corner Turn Signals */}
              <rect x="156" y="160" width="12" height="4" rx="1" fill="#f59e0b" />
              <rect x="156" y="396" width="12" height="4" rx="1" fill="#f59e0b" />

              {/* Hood Louver / Center Cowl Vent (Iconic H3 feature from photo) */}
              <rect
                x="146"
                y="220"
                width="76"
                height="120"
                rx="6"
                fill="url(#hood-louver)"
                stroke="#121518"
                strokeWidth="2"
              />
              {/* Louver Slits */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <line
                  key={i}
                  x1={155 + i * 8}
                  y1="230"
                  x2={155 + i * 8}
                  y2="330"
                  stroke="#101215"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              ))}

              {/* Windshield & Wiper Cowl */}
              <path
                d="M 285 180 L 325 185 L 325 375 L 285 380 Z"
                fill="#131921"
                stroke="#222b37"
                strokeWidth="1.5"
              />
              {/* Wiper blades */}
              <line x1="290" y1="210" x2="315" y2="260" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
              <line x1="290" y1="295" x2="315" y2="345" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

              {/* Side Mirrors (Black, jutting out at A-pillar) */}
              <rect x="352" y="125" width="24" height="15" rx="3" fill="#1b1f24" stroke="#0e1115" strokeWidth="1.5" />
              <line x1="335" y1="165" x2="356" y2="135" stroke="#121519" strokeWidth="5" strokeLinecap="round" />
              <rect x="352" y="420" width="24" height="15" rx="3" fill="#1b1f24" stroke="#0e1115" strokeWidth="1.5" />
              <line x1="335" y1="395" x2="356" y2="425" stroke="#121519" strokeWidth="5" strokeLinecap="round" />

              {/* Side Windows & Pillars */}
              <rect x="330" y="172" width="160" height="14" rx="2" fill="#131920" />
              <rect x="500" y="172" width="140" height="14" rx="2" fill="#131920" />
              <rect x="650" y="172" width="130" height="14" rx="2" fill="#131920" />

              <rect x="330" y="374" width="160" height="14" rx="2" fill="#131920" />
              <rect x="500" y="374" width="140" height="14" rx="2" fill="#131920" />
              <rect x="650" y="374" width="130" height="14" rx="2" fill="#131920" />

              {/* Sunroof with glass & rubber trim */}
              <rect
                x="408"
                y="218"
                width="92"
                height="124"
                rx="10"
                fill="url(#sunroof-glass)"
                stroke="#151a20"
                strokeWidth="4"
              />
              {/* Roof Longitudinal Stiffening Ribs */}
              <line x1="535" y1="240" x2="770" y2="240" stroke="#716c63" strokeWidth="2.5" />
              <line x1="535" y1="265" x2="770" y2="265" stroke="#716c63" strokeWidth="2.5" />
              <line x1="535" y1="295" x2="770" y2="295" stroke="#716c63" strokeWidth="2.5" />
              <line x1="535" y1="320" x2="770" y2="320" stroke="#716c63" strokeWidth="2.5" />

              {/* Black Roof Rack System */}
              {/* Left & Right Longitudinal Side Rails */}
              <rect x="365" y="190" width="440" height="14" rx="4" fill="#15181c" stroke="#2a3038" strokeWidth="1.5" />
              <rect x="365" y="356" width="440" height="14" rx="4" fill="#15181c" stroke="#2a3038" strokeWidth="1.5" />
              
              {/* Crossbar 1 (Behind Sunroof) */}
              <rect x="518" y="184" width="18" height="192" rx="3" fill="#1e2228" stroke="#333942" strokeWidth="1.5" />
              {/* Crossbar 2 (Rear Cargo Section) */}
              <rect x="718" y="184" width="18" height="192" rx="3" fill="#1e2228" stroke="#333942" strokeWidth="1.5" />

              {/* 5 Amber Cab Marker Lights (Ch 4) - Positioned along roof brow directly above the windscreen */}
              {/* Equally spaced out and smoke grey in color; illuminate in glowing amber when activated */}
              <g id="amber-cab-marker-assembly" opacity={markersProps.isVisible ? markersProps.opacity : 1}>
                <g style={markersProps.isStrobing ? { animation: `lightStrobeFlash ${markersProps.strobeDuration} infinite` } : undefined}>
                  {/* Forward amber ambient wash when activated */}
                  {markersProps.isVisible && (
                    <polygon
                      points="380,200 380,360 290,375 290,185"
                      fill="url(#cab-marker-wash)"
                      opacity="0.8"
                    />
                  )}

                  {CAB_MARKER_PODS.map((pod, idx) => {
                    const isMarkerOn = markersProps.isVisible;
                    const markerColor = markers?.color || '#F59E0B';
                    return (
                      <g key={idx} id={`cab-marker-unit-${idx}`}>
                        {/* Active amber radial glow halo */}
                        {isMarkerOn && (
                          <ellipse cx={pod.cx} cy={pod.y} rx="16" ry="10" fill={markerColor} opacity="0.6" />
                        )}
                        {/* Smoked grey aerodynamic base pod housing */}
                        <rect
                          x={pod.x}
                          y={pod.y - 6}
                          width="13"
                          height="12"
                          rx="4"
                          fill="#222730"
                          stroke="#101317"
                          strokeWidth="1.2"
                        />
                        {/* Smoked lens: deep smoke grey when off, brilliant amber when activated */}
                        <rect
                          x={pod.x + 1.5}
                          y={pod.y - 4.5}
                          width="9.5"
                          height="9"
                          rx="2.5"
                          fill={isMarkerOn ? markerColor : '#3e4450'}
                          stroke={isMarkerOn ? '#FBBF24' : '#272c35'}
                          strokeWidth="0.8"
                        />
                        {/* Inner smoked reflection shine when off */}
                        {!isMarkerOn && (
                          <line
                            x1={pod.x + 3}
                            y1={pod.y - 2}
                            x2={pod.x + 7}
                            y2={pod.y - 2}
                            stroke="#64748b"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                        )}
                        {/* Intense glowing amber LED bulb core when on */}
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

              {/* 50" Curved Lightbar at Roof Brow (Ch 1) */}
              <path
                d="M 324 195 Q 328 280 324 365"
                fill="none"
                stroke={lightbar?.isOn ? (lightbar.color || '#38BDF8') : '#1e2329'}
                strokeWidth={lightbar?.isOn ? 6 : 4.5}
                strokeLinecap="round"
              />

              {/* Rear Tailgate Assembly */}
              <path
                d="M 808 185 L 818 190 L 818 370 L 808 375 Z"
                fill="#544f47"
                stroke="#3e3933"
                strokeWidth="1.5"
              />
              {/* Rear Door Hinges */}
              <rect x="814" y="205" width="6" height="18" rx="2" fill="#1e2228" />
              <rect x="814" y="337" width="6" height="18" rx="2" fill="#1e2228" />

              {/* Tail Lights */}
              <rect x="806" y="180" width="10" height="24" rx="2" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
              <rect x="806" y="356" width="10" height="24" rx="2" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />

              {/* Rear Mounted Heavy Off-Road Spare Tire with Wheel (Iconic H3 feature) */}
              {/* Tire Bracket Mount */}
              <rect x="816" y="260" width="22" height="40" rx="3" fill="#20242a" />
              {/* Massive Spare Tire */}
              <ellipse
                cx="865"
                cy="280"
                rx="52"
                ry="52"
                fill="url(#tire-tread)"
                stroke="#08090b"
                strokeWidth="4"
              />
              {/* Tire Deep Rim Center */}
              <ellipse cx="865" cy="280" rx="28" ry="28" fill="#181c22" stroke="#2c333e" strokeWidth="2.5" />
              <ellipse cx="865" cy="280" rx="14" ry="14" fill="#0c0e12" />
              {/* 6 Lug Nuts */}
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const lx = 865 + Math.cos(rad) * 20;
                const ly = 280 + Math.sin(rad) * 20;
                return <circle key={deg} cx={lx} cy={ly} r="2.2" fill="#8d97a5" />;
              })}
            </g>
          )}

          {/* ========================================================================= */}
          {/* EXTERIOR HIGH-BRIGHTNESS PROJECTION BEAMS (EXITING VEHICLE BODY ONTO ROAD) */}
          {/* ========================================================================= */}

          {/* Front Lightbar Massive Forward Throw (Exiting roof brow forward across hood onto road) */}
          {lightbarProps.isVisible && (
            <g id="front-lightbar-throw" opacity={lightbarProps.opacity}>
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
            <g id="front-grille-beam" opacity={grilleProps.opacity}>
              <g style={grilleProps.isStrobing ? { animation: `lightStrobeFlash ${grilleProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="140,240 140,320 0,400 0,160"
                  fill="url(#grille-beam)"
                  opacity="0.85"
                />
                <polygon
                  points="140,260 140,300 0,340 0,220"
                  fill="url(#grille-beam)"
                  opacity="0.98"
                />
                {/* Lens face focal hotspots */}
                <circle cx="140" cy="265" r="9" fill={grillePods?.color || '#FFFFFF'} />
                <circle cx="140" cy="265" r="5" fill="#FFFFFF" />
                <circle cx="140" cy="295" r="9" fill={grillePods?.color || '#FFFFFF'} />
                <circle cx="140" cy="295" r="5" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* Front Fog Lamps - High-intensity beams projecting directly outward from the front bumper */}
          {fogsProps.isVisible && (
            <g id="front-fogs-group" opacity={fogsProps.opacity}>
              <g style={fogsProps.isStrobing ? { animation: `lightStrobeFlash ${fogsProps.strobeDuration} infinite` } : undefined}>
                <g id="front-fog-driver">
                  {/* Wide forward projection cone exiting driver fog lamp */}
                  <polygon
                    points="135,188 135,202 0,330 0,60"
                    fill="url(#fog-beam-driver)"
                  />
                  {/* Intense focused core beam */}
                  <polygon
                    points="135,192 135,198 0,260 0,130"
                    fill="url(#fog-beam-driver)"
                    opacity="0.92"
                  />
                  {/* Lens face hot spot at front bumper */}
                  <ellipse cx="135" cy="195" rx="16" ry="11" fill={fogs?.color || '#FBBF24'} />
                  <circle cx="135" cy="195" r="7" fill="#FFFFFF" />
                  {/* Ground road pool in front of vehicle */}
                  <ellipse cx="45" cy="195" rx="75" ry="40" fill="url(#fog-beam-driver)" opacity="0.65" />
                </g>
                <g id="front-fog-passenger">
                  {/* Wide forward projection cone exiting passenger fog lamp */}
                  <polygon
                    points="135,358 135,372 0,500 0,230"
                    fill="url(#fog-beam-passenger)"
                  />
                  {/* Intense focused core beam */}
                  <polygon
                    points="135,362 135,368 0,430 0,300"
                    fill="url(#fog-beam-passenger)"
                    opacity="0.92"
                  />
                  {/* Lens face hot spot at front bumper */}
                  <ellipse cx="135" cy="365" rx="16" ry="11" fill={fogs?.color || '#FBBF24'} />
                  <circle cx="135" cy="365" r="7" fill="#FFFFFF" />
                  {/* Ground road pool in front of vehicle */}
                  <ellipse cx="45" cy="365" rx="75" ry="40" fill="url(#fog-beam-passenger)" opacity="0.65" />
                </g>
              </g>
            </g>
          )}

          {/* Ditch Lights (Exiting 45 degrees outward from cowl mirrors) */}
          {ditchLeftProps.isVisible && (
            <g id="ditch-left" opacity={ditchLeftProps.opacity}>
              <g style={ditchLeftProps.isStrobing ? { animation: `lightStrobeFlash ${ditchLeftProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="335,138 315,122 0,-30 180,-30"
                  fill="url(#ditch-beam-left)"
                />
                <circle cx="335" cy="138" r="9" fill={ditchLeft?.color || '#FFFFFF'} />
                <circle cx="335" cy="138" r="5" fill="#FFFFFF" />
              </g>
            </g>
          )}
          {ditchRightProps.isVisible && (
            <g id="ditch-right" opacity={ditchRightProps.opacity}>
              <g style={ditchRightProps.isStrobing ? { animation: `lightStrobeFlash ${ditchRightProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="335,422 315,438 0,590 180,590"
                  fill="url(#ditch-beam-right)"
                />
                <circle cx="335" cy="422" r="9" fill={ditchRight?.color || '#FFFFFF'} />
                <circle cx="335" cy="422" r="5" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* Side Emergency Strobes / Scene Flood Beams */}
          {campLeftProps.isVisible && (
            <g id="side-left-beam" opacity={campLeftProps.opacity} className={isLeftStrobe ? 'emergency-strobe-left' : ''}>
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
                      <circle cx={xPos} cy="158" r="2.5" fill="#FFFFFF" />
                    </g>
                  ))}
                </g>
              )}
            </g>
          )}
          {campRightProps.isVisible && (
            <g id="side-right-beam" opacity={campRightProps.opacity} className={isRightStrobe ? 'emergency-strobe-right' : ''}>
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
                      <circle cx={xPos} cy="402" r="2.5" fill="#FFFFFF" />
                    </g>
                  ))}
                </g>
              )}
            </g>
          )}

          {/* Rear Backup / Reverse Floods (Mounted on Rear Roof Rack Bar, projecting backward) */}
          {rearBackupProps.isVisible && (
            <g id="rear-backup-beam" opacity={rearBackupProps.opacity}>
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
                <circle cx="737" cy="280" r="5" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* Rear Dust / Chase Light Bar */}
          {rearChaseProps.isVisible && (
            <g id="rear-chase-beam" opacity={rearChaseProps.opacity}>
              <g style={rearChaseProps.isStrobing ? { animation: `lightStrobeFlash ${rearChaseProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="805,240 805,320 1000,410 1000,150"
                  fill="url(#rear-chase)"
                />
                <rect x="803" y="245" width="6" height="70" rx="2" fill={rearChase?.color || '#EF4444'} />
              </g>
            </g>
          )}

          {/* Rock Lights Wheel Illumination Overlay: Light bursting directly OUT of the wheels */}
          {/* 1. Front Left Wheel (White beam lines removed) */}
          {rockFlProps.isVisible && (
            <g id="rock-overlay-fl" opacity={rockFlProps.opacity}>
              <g style={rockFlProps.isStrobing ? { animation: `lightStrobeFlash ${rockFlProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD through the wheel rim onto the road */}
                <polygon points="175,120 270,120 310,35 135,35" fill="url(#rock-fl-outward)" opacity="0.95" />
                <ellipse cx="222" cy="115" rx="46" ry="24" fill="url(#rock-fl-glow)" opacity="0.95" />
                <circle cx="222" cy="115" r="11" fill={rockFrontLeft?.color || '#38BDF8'} />
                <circle cx="222" cy="115" r="6" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 2. Front Right Wheel (Touching Wheel Well, White beam lines removed) */}
          {rockFrProps.isVisible && (
            <g id="rock-overlay-fr" opacity={rockFrProps.opacity}>
              <g style={rockFrProps.isStrobing ? { animation: `lightStrobeFlash ${rockFrProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD directly from touching the wheel well */}
                <polygon points="175,412 270,412 310,525 135,525" fill="url(#rock-fr-outward)" opacity="0.95" />
                <ellipse cx="222" cy="416" rx="46" ry="24" fill="url(#rock-fr-glow)" opacity="0.95" />
                <circle cx="222" cy="416" r="11" fill={rockFrontRight?.color || '#38BDF8'} />
                <circle cx="222" cy="416" r="6" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 3. Rear Left Wheel (White beam lines removed) */}
          {rockRlProps.isVisible && (
            <g id="rock-overlay-rl" opacity={rockRlProps.opacity}>
              <g style={rockRlProps.isStrobing ? { animation: `lightStrobeFlash ${rockRlProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD through the wheel rim onto the road */}
                <polygon points="670,120 765,120 805,35 630,35" fill="url(#rock-rl-outward)" opacity="0.95" />
                <ellipse cx="718" cy="115" rx="46" ry="24" fill="url(#rock-rl-glow)" opacity="0.95" />
                <circle cx="718" cy="115" r="11" fill={rockRearLeft?.color || '#38BDF8'} />
                <circle cx="718" cy="115" r="6" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 4. Rear Right Wheel (Touching Wheel Well, White beam lines removed) */}
          {rockRrProps.isVisible && (
            <g id="rock-overlay-rr" opacity={rockRrProps.opacity}>
              <g style={rockRrProps.isStrobing ? { animation: `lightStrobeFlash ${rockRrProps.strobeDuration} infinite` } : undefined}>
                {/* Intense light cone shooting OUTWARD directly from touching the wheel well */}
                <polygon points="670,412 765,412 805,525 630,525" fill="url(#rock-rr-outward)" opacity="0.95" />
                <ellipse cx="718" cy="416" rx="46" ry="24" fill="url(#rock-rr-glow)" opacity="0.95" />
                <circle cx="718" cy="416" r="11" fill={rockRearRight?.color || '#38BDF8'} />
                <circle cx="718" cy="416" r="6" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* If custom image is used, render cab markers overlay on top so they remain visible */}
          {customImageUrl && markersProps.isVisible && (
            <g id="amber-cab-marker-custom-overlay" opacity={markersProps.opacity}>
              <g style={markersProps.isStrobing ? { animation: `lightStrobeFlash ${markersProps.strobeDuration} infinite` } : undefined}>
                <polygon
                  points="380,200 380,360 290,375 290,185"
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
