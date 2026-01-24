
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 注意：如果您 GitHub 專案名稱是 "my-event-app"，請將下面改為 "/my-event-app/"
  // 如果是使用自訂網域或使用者網頁 (username.github.io)，則維持 "/"
  base: '/StyleRank/', 
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
