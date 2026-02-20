import { defineConfig } from '@junobuild/config';

export default defineConfig({
	satellite: {
		ids: {
			development: '<DEV_SATELLITE_ID>',
			production: 'z6kq3-iqaaa-aaaal-asxhq-cai'
		},
		source: 'build',
		predeploy: ['npm run build']
	},
	orbiter: {
		id: 'gfpjj-5iaaa-aaaal-amr4a-cai'
	}
});
