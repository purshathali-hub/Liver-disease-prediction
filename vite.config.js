import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || dotenv.config().parsed?.API_KEY || '')
  },
  server: {
    port: 3000,
    open: true
  }
});