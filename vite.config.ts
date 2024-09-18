import { defineConfig } from 'vite';
import { resolve } from 'path'; 

export default defineConfig({
  root: '.',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {

        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        home: resolve(__dirname, 'home.html'), 
        viewmore: resolve(__dirname, 'viewmore.html'),
        add: resolve(__dirname, 'add.html'),
        overview: resolve(__dirname, 'overview.html'),
        overview1: resolve(__dirname, 'overview1.html'),
        profile: resolve(__dirname, 'profile.html'),
        feed: resolve(__dirname, 'feed.html'),
        aboutme: resolve(__dirname, 'aboutme.html'),
        
      },
    },
  },
});

