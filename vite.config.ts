import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// import mkcert from 'vite-plugin-mkcert' // Отключено для работы с Tauri
// import fs from "fs" // Не используется без HTTPS
// import path from "path" // Не используется без HTTPS

// Определяем base path: для Tauri используем корневой путь, для веба - /PANKREATITMED/
// Можно переопределить через переменную окружения VITE_BASE_PATH
const basePath = process.env.VITE_BASE_PATH || (process.env.TAURI_PLATFORM ? '/' : '/PANKREATITMED/')
const manifest = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./public/manifest.json', import.meta.url)),
    'utf-8',
  ),
)

// https://vite.dev/config/
export default defineConfig({
  // base нужен для корректного построения путей на GitHub Pages
  // Для Tauri используем корневой путь
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: [
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-192.png',
        'maskable-512.png',
        'offline.html',
      ],
      manifest,
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
    }),
    // mkcert(), // Отключено для работы с Tauri
  ],
  server: {
    // Allow overriding API proxy target via environment variable when running `vite`.
    // This is useful when you want to target a backend on your LAN (e.g. http://192.168.x.x:80).
    // Set VITE_API_BASE_URL before running dev, e.g.:
    // VITE_API_BASE_URL=http://192.168.1.50:80 npm run dev
    proxy: {
      '/api': process.env.VITE_API_BASE_URL || 'http://localhost:80',
    },
    // HTTPS отключен для работы с Tauri
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "cert.key")),
    //   cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
    // },
    host: true, // чтобы сервер был доступен с телефона/планшета
    port: 5173
  },
})
