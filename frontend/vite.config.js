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
    EnvironmentPlugin(["API_URL"]) // Add your env variables here
  ],
})
