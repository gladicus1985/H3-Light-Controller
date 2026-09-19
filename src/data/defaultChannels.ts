import { ChannelConfig, PresetScene } from '../types';

export const DEFAULT_CHANNELS: ChannelConfig[] = [
  {
    id: 1,
    name: '50" Roof Lightbar',
    category: 'exterior-front',
    isOn: false,
    color: '#38BDF8', // Ice White / Crisp Blue
    brightness: 100,
    mode: 'toggle',
    iconName: 'SunMedium',
    ampDraw: 18.5,
    position: { x: 31, y: 50 }, // Centered on roof brow
    beamType: 'front-throw',
  },
  {
    id: 2,
    name: 'Grille LED Pods',
    category: 'exterior-front',
    isOn: false,
    color: '#F8FAFC', // Pure Xenon White
    brightness: 100,
    mode: 'toggle',
    iconName: 'Zap',
    ampDraw: 8.0,
    position: { x: 10, y: 50 }, // Centered in front 7-slot chrome grille
    beamType: 'front-spot',
  },
  {
    id: 3,
    name: 'Front Fog Lamps',
    category: 'exterior-front',
    isOn: false,
    color: '#FBBF24', // Amber Fog
    brightness: 90,
    mode: 'toggle',
    iconName: 'Eye',
    ampDraw: 4.5,
    position: { x: 13, y: 32 }, // Front lower bumper fog
    beamType: 'front-spot',
  },
  {
    id: 4,
    name: 'Amber Cab Markers (x5)',
    category: 'exterior-front',
    isOn: false,
    color: '#F59E0B', // Amber
    brightness: 90,
    mode: 'toggle',
    iconName: 'ShieldAlert',
    ampDraw: 1.5,
    position: { x: 24, y: 40 }, // Above windshield centered on roof
    beamType: 'marker-front',
  },
  {
    id: 5,
    name: 'Left Ditch Light',
    category: 'exterior-side',
    isOn: false,
    color: '#F8FAFC',
    brightness: 100,
    mode: 'toggle',
    iconName: 'Compass',
    ampDraw: 4.0,
    position: { x: 32, y: 19 }, // Left A-pillar cowl ditch light
    beamType: 'ditch-left',
  },
  {
    id: 6,
    name: 'Right Ditch Light',
    category: 'exterior-side',
    isOn: false,
    color: '#F8FAFC',
    brightness: 100,
    mode: 'toggle',
    iconName: 'Compass',
    ampDraw: 4.0,
    position: { x: 32, y: 81 }, // Right A-pillar cowl ditch light
    beamType: 'ditch-right',
  },
  {
    id: 7,
    name: 'Left Rock Lights (Front)',
    category: 'exterior-side',
    isOn: false,
    color: '#38BDF8', // Cyan underglow
    brightness: 90,
    mode: 'toggle',
    iconName: 'Sparkles',
    ampDraw: 3.2,
    position: { x: 22, y: 23 }, // Right on Front Left Wheel
    beamType: 'underglow-left',
  },
  {
    id: 8,
    name: 'Right Rock Lights (Front)',
    category: 'exterior-side',
    isOn: false,
    color: '#38BDF8', // Cyan underglow
    brightness: 90,
    mode: 'toggle',
    iconName: 'Sparkles',
    ampDraw: 3.2,
    position: { x: 22, y: 73.5 }, // Snug to Front Right Wheel Well
    beamType: 'underglow-right',
  },
  {
    id: 9,
    name: 'Left Emergency Strobes',
    category: 'exterior-side',
    isOn: false,
    color: '#F59E0B', // Amber Emergency Strobe
    brightness: 100,
    mode: 'strobe',
    strobeSpeed: 200,
    iconName: 'ShieldAlert',
    ampDraw: 4.0,
    position: { x: 47, y: 29 }, // Driver side emergency perimeter strobe (matching Ch 10)
    beamType: 'side-flood-left',
  },
  {
    id: 10,
    name: 'Right Emergency Strobes',
    category: 'exterior-side',
    isOn: false,
    color: '#F59E0B', // Amber Emergency Strobe
    brightness: 100,
    mode: 'strobe',
    strobeSpeed: 200,
    iconName: 'ShieldAlert',
    ampDraw: 4.0,
    position: { x: 47, y: 71 }, // Passenger side emergency perimeter strobe (up and left directly on vehicle)
    beamType: 'side-flood-right',
  },
  {
    id: 11,
    name: 'Rear Chase / Dust',
    category: 'exterior-rear',
    isOn: false,
    color: '#EF4444', // Red / Amber Chase
    brightness: 100,
    mode: 'toggle',
    strobeSpeed: 250,
    iconName: 'Flame',
    ampDraw: 3.0,
    position: { x: 79, y: 50 }, // Upper rear roof wing / chase bar
    beamType: 'rear-throw',
  },
  {
    id: 12,
    name: 'Rear Backup Floods',
    category: 'exterior-rear',
    isOn: false,
    color: '#F8FAFC', // Ultra White
    brightness: 100,
    mode: 'toggle',
    iconName: 'Radio',
    ampDraw: 6.0,
    position: { x: 73, y: 50 }, // Rear roof rack crossbar
    beamType: 'rear-throw',
  },
  {
    id: 13,
    name: 'Left Rock Lights (Rear)',
    category: 'exterior-side',
    isOn: false,
    color: '#38BDF8', // Cyan underglow
    brightness: 85,
    mode: 'toggle',
    iconName: 'Sparkles',
    ampDraw: 3.2,
    position: { x: 72, y: 23 }, // Right on Rear Left Wheel
    beamType: 'underglow-left',
  },
  {
    id: 14,
    name: 'Right Rock Lights (Rear)',
    category: 'exterior-side',
    isOn: false,
    color: '#38BDF8', // Cyan underglow
    brightness: 85,
    mode: 'toggle',
    iconName: 'Sparkles',
    ampDraw: 3.2,
    position: { x: 72, y: 73.5 }, // Snug to Rear Right Wheel Well
    beamType: 'underglow-right',
  },
  {
    id: 15,
    name: 'Cargo Work Light',
    category: 'exterior-rear',
    isOn: false,
    color: '#FDE047', // Warm Work Light
    brightness: 90,
    mode: 'toggle',
    iconName: 'Box',
    ampDraw: 2.0,
    position: { x: 82, y: 28 }, // Left rear corner flood
    beamType: 'interior-cargo',
  },
  {
    id: 16,
    name: 'Rear Corner Scene (Right)',
    category: 'exterior-rear',
    isOn: false,
    color: '#FDE047', // Warm Work Light
    brightness: 90,
    mode: 'toggle',
    iconName: 'Box',
    ampDraw: 2.0,
    position: { x: 82, y: 72 }, // Right rear corner flood
    beamType: 'accessory-status',
  },
];

export const PRESET_SCENES: PresetScene[] = [
  {
    id: 'all_off',
    name: 'Blackout / Off',
    description: 'Instant kill switch — all 16 relays disengaged',
    icon: 'PowerOff',
    activeChannelIds: [],
  },
  {
    id: 'trail_offroad',
    name: 'Trail & Off-Road',
    description: '50" lightbar, grille pods, ditch lights & all 4 rock lights',
    icon: 'Mountain',
    activeChannelIds: [1, 2, 5, 6, 7, 8, 13, 14],
  },
  {
    id: 'camp_setup',
    name: 'Basecamp 360°',
    description: 'Dual side scene floods, rock lights, rear flood & corner floods',
    icon: 'Tent',
    activeChannelIds: [7, 8, 9, 10, 12, 13, 14, 15, 16],
  },
  {
    id: 'hazard_chase',
    name: 'Chase / Warning',
    description: 'Rear dust chase, markers & ditch lights',
    icon: 'AlertTriangle',
    activeChannelIds: [4, 5, 6, 11],
  },
  {
    id: 'rock_lights',
    name: '360° Rock Lights',
    description: 'All four wheel well ground lights',
    icon: 'Sparkles',
    activeChannelIds: [7, 8, 13, 14],
  },
];
