import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,  // Puedes cambiar el puerto si lo necesitas
        hmr: { host: "localhost" },
        watch: { usePolling: true,},
    },
    build: {
        chunkSizeWarningLimit: 100,
        rollupOptions: {
          onwarn(warning, warn) {
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
              return;
            }
            warn(warning);
          },
        },
      },
})
