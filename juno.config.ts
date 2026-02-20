import { defineConfig } from '@junobuild/config';

export default defineConfig({
	satellite: {
		ids: {
			development: 'auamu-4x777-77775-aaaaa-cai',
			production: 'z6kq3-iqaaa-aaaal-asxhq-cai'
		},
		source: 'build',
		predeploy: ['npm run build']
	},
	orbiter: {
		id: 'gfpjj-5iaaa-aaaal-amr4a-cai'
	}
});
