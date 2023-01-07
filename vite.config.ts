import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig({
  // base: '/whiteboard/',
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  // server: {
  //   //设置代理
  //   proxy: {
  //     "/socket.io": {
  //       target: "http://localhost:3007",
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  //   // disableHostCheck: true,
  // },
});
