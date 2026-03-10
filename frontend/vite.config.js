import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/TIDE_VAULT/',
    plugins: [react()],
    server: {
        port: 8888,
        strictPort: true,
    }
})
