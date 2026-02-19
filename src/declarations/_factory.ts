import { idlFactory as idlFactoryBucket } from '$declarations/bucket/bucket.idl';
import { idlFactory as idlFactoryDirectory } from '$declarations/directory/directory.idl';

import { idlFactory as idlFactoryCertifiedDirectory } from '$declarations/directory/directory.certified.idl';
import { idlFactory as idlFactoryCertifiedBucket } from '$declarations/bucket/bucket.certified.idl';

import type { _SERVICE as DirectoryService } from '$declarations/directory/directory';
import type { _SERVICE as BucketService } from '$declarations/bucket/bucket';

export {
	idlFactoryCertifiedBucket,
	idlFactoryBucket,
	type BucketService,
	idlFactoryCertifiedDirectory,
	idlFactoryDirectory,
	type DirectoryService
};
