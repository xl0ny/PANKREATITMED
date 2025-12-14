import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from "fs"
import path from "path"
import type { Plugin } from 'vite'

const basePath = '/PANKREATITMED/'
const manifest = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./public/manifest.json', import.meta.url)),
    'utf-8',
  ),
)

// Плагин для добавления CORS заголовков, чтобы GitHub Pages мог обращаться к локальному фронтенду
const corsPlugin = (): Plugin => {
  return {
    name: 'cors-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const origin = req.headers.origin
        
        // Разрешаем запросы с GitHub Pages и любых других источников
        if (origin) {
          res.setHeader('Access-Control-Allow-Origin', origin)
        } else {
          res.setHeader('Access-Control-Allow-Origin', '*')
        }
        
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        
        // Обрабатываем preflight запросы
        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }
        
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // base нужен для корректного построения путей на GitHub Pages
  base: basePath,
  plugins: [
    react(),
    corsPlugin(), // Плагин для CORS, чтобы GitHub Pages мог обращаться к локальному фронтенду
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
    mkcert(),
  ],
  server: {
    // Allow overriding API proxy target via environment variable when running `vite`.
    // This is useful when you want to target a backend on your LAN (e.g. http://192.168.x.x:80).
    // Set VITE_API_BASE_URL before running dev, e.g.:
    // VITE_API_BASE_URL=http://192.168.1.50:80 npm run dev
    proxy: {
      '/api': process.env.VITE_API_BASE_URL || 'http://localhost:80',
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "cert.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
    },
    host: true, // чтобы сервер был доступен с телефона/планшета
    port: 5173
  },
})
