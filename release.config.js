// @ts-check
const BRANCH_NAME = process.env.GITHUB_REF_NAME;
const DEFAULT_BRANCH = process.env.GITHUB_DEFAULT_BRANCH || 'master';

if (!BRANCH_NAME) {
	throw new Error('Missing GITHUB_REF_NAME');
}

const isDefaultBranch = BRANCH_NAME === DEFAULT_BRANCH;

/**
 * @type {Array<import('semantic-release').PluginSpec>}
 */
const plugins = [
	'@semantic-release/commit-analyzer',
	'@semantic-release/release-notes-generator',
	[
		'@semantic-release/npm',
		{
			npmPublish: true,
			tag: isDefaultBranch ? 'latest' : BRANCH_NAME
		}
	],
	[
		'@semantic-release/git',
		{
			assets: ['package.json', 'CHANGELOG.md'],
			message: 'chore(release): ${nextRelease.version} [skip ci]'
		}
	],
	'@semantic-release/github'
];

/**
 * @type {Array<import('semantic-release').BranchSpec>}
 */
const branches = [DEFAULT_BRANCH, { name: BRANCH_NAME, prerelease: `${BRANCH_NAME.split('/').pop()}-rc.${Date.now()}` }];

module.exports = { branches, plugins };
