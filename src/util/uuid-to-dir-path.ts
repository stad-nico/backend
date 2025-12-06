import { StoragePath } from 'src/modules/disk/disk.service';

/**
 * Converts a uuid v4 to a directory path inside the data directory.
 *
 * @example
 * ```ts
 * const uuid = 'ded9d04b-b18f-4bce-976d-7a36acb42eb9';
 * uuidToDirPath(uuid); // returns /data/de/d9/d04b-b18f-4bce-976d-7a36acb42eb9
 * ```
 *
 * @param uuid the uuid to convert
 * @returns the directory path
 */
export function uuidToDirPath(uuid: string): string {
	const match = uuid.match(/.{1,2}/g);

	if (!match) {
		throw new Error('The uuid does not match the expected format');
	}

	const directoryPath = match.reduce((acc, curr, ind) => (acc += ind === 1 || ind === 2 ? '/' + curr : curr));

	return `${StoragePath.Data}/${directoryPath}`;
}
