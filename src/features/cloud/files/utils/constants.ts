/**
 * The maximum length of a file name
 */
export const MAX_FILE_NAME_LENGTH = 64;

/**
 * The maximum length of a directory name
 */
export const MAX_DIRECTORY_NAME_LENGTH = 64;

/**
 * The regular expression for matching a directory name
 */
export const VALID_DIRECTORY_NAME_REGEXP = new RegExp(
	'^' + // start
		'(?! )' + // no leading space
		'(?=.*\\S)' + // at least one non-space
		'\\.?' + // optional leading dot
		'[\\p{L}\\p{N}()_\\-*"\'? ]+' + // allowed chars including spaces inside
		'(?:\\.[\\p{L}\\p{N}()_\\-*"\'? ]+)?' + // optional one dot + allowed chars (max 1 dot)
		'(?<! )' + // no trailing space
		'$',
	'u'
);

/**
 * The regular expression for matching a file name
 */
export const VALID_FILE_NAME_REGEXP = new RegExp(
	'^' + // start
		'(?! )' + // no leading space
		'(?=.*\\S)' + // at least one non-space
		'\\.?' + // optional leading dot
		'[\\p{L}\\p{N}()_\\-*"\'? ]+' + // allowed chars including spaces inside
		'(?:\\.[\\p{L}\\p{N}()_\\-*"\'? ]+)?' + // optional one dot + allowed chars (max 1 dot)
		'(\.[a-zA-Z0-9]+)?' + // optional extension
		'(?<! )' + // no trailing space
		'$',
	'u'
);
