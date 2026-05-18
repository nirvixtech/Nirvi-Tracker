import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return
          }

          if (id.includes("/node_modules/framer-motion/") || id.includes("/node_modules/lucide-react/")) {
            return "ui-vendor"
          }

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/")
          ) {
            return "react-vendor"
          }

          if (id.includes("/node_modules/recharts/")) {
            return "charts-vendor"
          }

          if (id.includes("/node_modules/react-router-dom/") || id.includes("/node_modules/react-router/")) {
            return "router-vendor"
          }

          if (
            id.includes("/node_modules/@radix-ui/") ||
            id.includes("/node_modules/radix-ui/") ||
            id.includes("/node_modules/sonner/") ||
            id.includes("/node_modules/next-themes/")
          ) {
            return "component-vendor"
          }

          return "vendor"
        },
      },
    },
  },
})
