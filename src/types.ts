export type LightZoneCategory = 'exterior-front' | 'exterior-side' | 'exterior-rear' | 'interior' | 'accessory';

export type SwitchMode = 'toggle' | 'momentary' | 'strobe' | 'pulse';

export interface ChannelConfig {
  id: number; // 1 to 16
  name: string;
  category: LightZoneCategory;
  isOn: boolean;
  isEnabled?: boolean; // When false, channel/light is disabled and hidden or locked
  color: string; // Hex color for the LED glow (e.g., #FFFFFF, #FFB300, #38BDF8, #EF4444)
  brightness: number; // 10 to 100%
  mode: SwitchMode;
  strobeSpeed?: number; // ms interval
  iconName: string; // Lucide icon identifier
  ampDraw: number; // Estimated amperage when active (e.g., 8.5A for lightbar, 1.2A for rock lights)
  // Pin coordinate on top-down view (percentage 0-100 relative to vehicle canvas)
  position: {
    x: number; // 0 (left front) to 100 (right rear)
    y: number; // 0 (top/passenger side) to 100 (bottom/driver side)
  };
  // Beam orientation & style for lighting simulation
  beamType: 'front-throw' | 'front-spot' | 'side-flood-left' | 'side-flood-right' | 'rear-throw' | 'underglow-left' | 'underglow-right' | 'interior-front' | 'interior-rear' | 'interior-cargo' | 'ditch-left' | 'ditch-right' | 'marker-front' | 'accessory-status';
}

export interface PresetScene {
  id: string;
  name: string;
  description: string;
  icon: string;
  activeChannelIds: number[];
}

export interface HardwareConfig {
  outputMode: 'demo' | 'serial' | 'http';
  httpEndpoint: string; // e.g., http://192.168.4.1/api/switch
  baudRate: number; // 9600, 115200 for USB serial
  autoConnectSerial: boolean;
  lowVoltageCutoff: number; // e.g. 11.8V
}

export interface VehicleTelemetry {
  voltage: number; // e.g. 13.8V
  engineRunning: boolean;
  totalAmps: number;
}
