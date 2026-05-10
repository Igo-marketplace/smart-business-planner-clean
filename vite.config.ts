import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
