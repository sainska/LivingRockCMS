import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Vite configuration for React project
// Ensures '@' alias points to './src' for cleaner imports
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all IPv4/IPv6 interfaces
    port: 8080, // Change if you want a different dev port
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Use path.resolve for cross-platform compatibility
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
// If you have issues with the alias, try restarting the dev server after changes.
