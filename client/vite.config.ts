import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // recharts 体积大、依赖多，显式预构建可避免「Outdated Optimize Dep」导致 504
  optimizeDeps: {
    include: ['recharts'],
  },
  // Vercel 部署配置
  base: process.env.VERCEL ? '/client/' : '/',
  server: {
    proxy: {
      '/v1': {
        target: process.env.VERCEL ? 'https://' + process.env.VERCEL_BRANCH_URL : 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
