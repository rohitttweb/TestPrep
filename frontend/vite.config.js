import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from "vite-plugin-environment";
// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true
  },

  plugins: [
    react(),
    EnvironmentPlugin({
      API_URL: import.meta.env.VITE_API_URL || "http://192.168.1.25:3001" // Provide a fallback value
    })
  ],
})
