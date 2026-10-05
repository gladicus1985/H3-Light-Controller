import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

// Developer plugin to allow saving channel coordinates directly into src/data/defaultChannels.ts
function saveChannelsPlugin() {
  return {
    name: 'save-default-channels-endpoint',
    configureServer(server: any) {
      server.middlewares.use('/api/save-default-channels', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const updatedChannels = JSON.parse(body);
              if (!Array.isArray(updatedChannels) || updatedChannels.length !== 16) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Expected array of 16 channels' }));
                return;
              }

              const filePath = path.resolve(__dirname, 'src/data/defaultChannels.ts');
              const currentContent = fs.readFileSync(filePath, 'utf-8');

              // Preserve PRESET_SCENES block
              const presetScenesMatch = currentContent.match(/export const PRESET_SCENES: PresetScene\[\] =[\s\S]*$/);
              const presetScenesBlock = presetScenesMatch ? presetScenesMatch[0] : '';

              // Format clean TypeScript array for DEFAULT_CHANNELS
              const channelsCode = updatedChannels
                .map((ch: any) => {
                  const posX = ch.position?.x ?? 50;
                  const posY = ch.position?.y ?? 50;
                  const lightX = ch.lightPosition?.x ?? posX;
                  const lightY = ch.lightPosition?.y ?? posY;

                  return `  {
    id: ${ch.id},
    name: ${JSON.stringify(ch.name)},
    category: ${JSON.stringify(ch.category)},
    isOn: false,
    isEnabled: ${ch.isEnabled !== false ? 'true' : 'false'},
    color: ${JSON.stringify(ch.color)},
    brightness: ${ch.brightness ?? 40},
    mode: ${JSON.stringify(ch.mode ?? 'toggle')},
    iconName: ${JSON.stringify(ch.iconName)},
    ampDraw: ${ch.ampDraw ?? 5.0},
    position: { x: ${posX}, y: ${posY} },
    lightPosition: { x: ${lightX}, y: ${lightY} },
    beamType: ${JSON.stringify(ch.beamType)},
  },`;
                })
                .join('\n');

              const newFileContent = `import { ChannelConfig, PresetScene } from '../types';

export const DEFAULT_CHANNELS: ChannelConfig[] = [
${channelsCode}
];

${presetScenesBlock}
`;

              fs.writeFileSync(filePath, newFileContent, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Saved directly into defaultChannels.ts' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Server error' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), saveChannelsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
