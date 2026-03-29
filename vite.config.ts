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
    minify: "esbuild"
  },
  optimizeDeps: {
    exclude: ["leaflet"]
  },
  ssr: {
    noExternal: ["leaflet"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@base": path.resolve(__dirname, "./base")
    }
  }
})