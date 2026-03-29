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
    react({
      jsxImportSource: "react"
    }),
    tailwindcss()
  ],
  build: {
    sourcemap: false,
    target: "esnext",
    minify: "esbuild",
    chunkSizeWarningLimit: 1600
  },
  optimizeDeps: {
    exclude: [
      "antd",
      "chart.js",
      "leaflet",
      "@fullcalendar/react"
    ]
  },
  esbuild: {
    legalComments: "none"
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@base": path.resolve(__dirname, "./base")
    }
  }
})