import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// معالجة المسارات عشان إحنا شغالين بـ "type": "module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "ERP System - نظام الإدارة الشامل",
    autoHideMenuBar: true, // عشان نشيل شريط القوائم بتاع الويندوز ويبقى شكله احترافي
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // لو في وضع التطوير (لما تكتب npm run dev)
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // لو عملت بيلد نهائي للبرنامج
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
