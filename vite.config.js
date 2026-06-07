import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite"; // السطر ده اللي كان ناقص
import electron from "vite-plugin-electron/simple";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // وتفعيل التصميم هنا
    electron({
      main: {
        entry: "electron/main.js",
      },
    }),
  ],
});
