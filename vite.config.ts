import { defineConfig } from 'vite'
import laravel from 'vite-plugin-laravel'
import vue from '@vitejs/plugin-vue';
import VueTypeImports from 'vite-plugin-vue-type-imports'

export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        }
      }
    },
    server: {
      host: '0.0.0.0'
    },
    plugins: [
      laravel(),
      vue(),
      VueTypeImports(),
    ],
    build: {
      minify: false
    }
  })