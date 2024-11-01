import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8000,
    host: true
  },
  optimizeDeps: {
    include: [
      'three',
      'three/addons/postprocessing/EffectComposer.js',
      'three/addons/postprocessing/RenderPass.js',
      'three/addons/postprocessing/UnrealBloomPass.js'
    ]
  },
  resolve: {
    alias: {
      'three': 'three'
    }
  }
});