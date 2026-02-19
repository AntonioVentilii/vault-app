import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import juno from '@junobuild/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
	plugins: [sveltekit(), juno(), tailwindcss()],
	resolve: {
		alias: {
			$declarations: resolve('./src/declarations')
		}
	},
	worker: {
		plugins: () => [sveltekit()],
		format: 'es'
	}
});
