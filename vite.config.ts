import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tanstackRouter from "@tanstack/router-plugin/vite"

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react"
    }),
    react(),
    tailwindcss()
  ],

  build: {
    sourcemap: false,
    target: "esnext",
    minify: "esbuild",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ["leaflet", "react-leaflet"],
          antd: ["antd", "@ant-design/icons"],
          fullcalendar: [
            "@fullcalendar/core",
            "@fullcalendar/daygrid",
            "@fullcalendar/timegrid",
            "@fullcalendar/interaction",
            "@fullcalendar/react"
          ]
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ["leaflet"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@base": path.resolve(__dirname, "./base")
    }
  }
})