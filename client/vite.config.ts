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
})
