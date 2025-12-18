import { File } from 'src/db/entities/file.entity';

export type FileMetadata = Pick<File, 'id' | 'name' | 'mimeType' | 'size' | 'createdAt' | 'updatedAt'> & {
	parentId: string;
	userId: string;
	path: string;
	idChain: Array<string>;
};
