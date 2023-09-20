import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/

// https://blog.csdn.net/qq_43519131/article/details/127408209

export default defineConfig({
	plugins: [vue()],
	root: './',
	base: process.env.VITE_APP_MODE !== 'staging' ? '/shin-feng-frontend' : '',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			images: './public/images',
			svgs: './public/svgs',
		},
	},
});
