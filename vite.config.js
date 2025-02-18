import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 모든 IP에서 접근 가능하게 설정
    port: 5173, // 사용할 포트 설정
  },
});