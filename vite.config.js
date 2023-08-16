import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/index.js'),
            name: 'index',
            fileName: 'index',
            formats: ['cjs', 'es']
        },
        outDir: path.resolve(__dirname, 'dist')
    }
})