import { defineConfig } from 'vite'
import restart from 'vite-plugin-restart'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({

    server:
            {
                host: true, // Open to local network and display URL
                open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
            },

    build:
            {
                outDir: 'build/',
                emptyOutDir: true,
                sourcemap: true,
            },

    plugins:
            [
                restart({ restart: [ '../**', ] }), // Restart server on static file change
                wasm(),
                topLevelAwait()
            ],

    assetsInclude: ['**/*.hdr'],
})