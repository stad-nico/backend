import { access } from 'fs/promises';

/**
 * Checks if a path exists on the disk.
 *
 * @param path the path
 * @returns whether the path exists
 */
export async function pathExists(path: string): Promise<boolean> {
	return (await access(path).catch(() => false)) === undefined;
}
