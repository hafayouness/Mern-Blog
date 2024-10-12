export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Ensures output goes to the 'client/dist' directory
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
