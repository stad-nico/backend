import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import tsEslint from 'typescript-eslint';

export default tsEslint.config({
	files: ['src/**/*.ts'],
	extends: [js.configs.recommended, ...tsEslint.configs.recommended, ...tsEslint.configs.stylistic, prettierConfig],
	plugins: {
		'@stylistic': stylistic
	},
	languageOptions: {
		parser: typescriptEslintParser,
		parserOptions: {
			project: true,
			tsconfigRootDir: import.meta.dirname
		}
	},
	rules: {
		/**
		 * ##############################################
		 * #                                            #
		 * #              General rules                 #
		 * #                                            #
		 * ##############################################
		 */

		/**
		 * Enforce consistent member delimiter style in interfaces and type literals
		 * @see https://eslint.style/rules/member-delimiter-style
		 */
		'@stylistic/member-delimiter-style': 'error',

		/**
		 * Prevent trailing commas in object literals
		 * @see https://eslint.style/rules/js/comma-dangle
		 */
		'@stylistic/comma-dangle': 'warn',

		/**
		 * Enforce semicolons at the end of statements
		 * @see https://eslint.style/rules/js/semi
		 */
		'@stylistic/semi': 'error',

		/**
		 * Allow declarations (`const foo = 1`) in case clauses
		 * @see https://eslint.org/docs/latest/rules/no-case-declarations
		 */
		'no-case-declarations': 'warn',

		/**
		 * Show an error when using unnecessary double negation
		 * @see https://eslint.org/docs/latest/rules/no-extra-boolean-cast
		 */
		'no-extra-boolean-cast': 'error',

		/**
		 * Disallow nested ternary expressions
		 * @see https://eslint.org/docs/latest/rules/no-nested-ternary
		 */
		'no-nested-ternary': 'error',

		/**
		 * Disallow the use of `Object.prototype` builtins like `hasOwnProperty` directly
		 * @see https://eslint.org/docs/latest/rules/no-prototype-builtins
		 */
		'no-prototype-builtins': 'error',

		/**
		 * Prefer object shorthand syntax `{a,b,c} instead of {a:a, b:b, c:c}`
		 * @see https://eslint.org/docs/latest/rules/object-shorthand
		 */
		'object-shorthand': ['error', 'properties'],

		/**
		 * Enforce template literals instead of string concatenation
		 * @see https://eslint.org/docs/latest/rules/prefer-template
		 */
		'prefer-template': 'error',

		/**
		 * ##############################################
		 * #                                            #
		 * #         TypeScript specific rules          #
		 * #                                            #
		 * ##############################################
		 */

		/**
		 * Enforce the use of the array type (i.e. prever `Array<T>` over `T[]`)
		 * @see https://typescript-eslint.io/rules/array-type
		 */
		'@typescript-eslint/array-type': ['warn', { default: 'generic' }],

		/**
		 * Rule that enforces consistent usage of either index signature or record types
		 * @see https://typescript-eslint.io/rules/consistent-indexed-object-style
		 */
		'@typescript-eslint/consistent-indexed-object-style': ['warn', 'record'],

		/**
		 * Rule that enforces consistent usage of either "type" or "interface" for type definitions
		 * @see https://typescript-eslint.io/rules/consistent-type-definitions
		 */
		'@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],

		/**
		 * Require explicit return types on functions and class methods
		 * @see https://typescript-eslint.io/rules/explicit-function-return-type
		 */
		'@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],

		/**
		 * Require explicit accessibility modifiers on class properties and methods
		 * @see https://typescript-eslint.io/rules/explicit-member-accessibility
		 */
		'@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit', overrides: { constructors: 'no-public' } }],

		/**
		 * Disallow using code marked as deprecated
		 * @see https://typescript-eslint.io/rules/no-deprecated
		 */
		'@typescript-eslint/no-deprecated': 'warn',

		/**
		 * Disallow the `{}` type in object type annotations
		 * @see https://typescript-eslint.io/rules/no-empty-object-type
		 */
		'@typescript-eslint/no-empty-object-type': 'warn',

		/**
		 * Disallow usage of the `any` type
		 * @see https://typescript-eslint.io/rules/no-explicit-any
		 */
		'@typescript-eslint/no-explicit-any': 'error',

		/**
		 * Disallow floating (unused / unawaited) promises
		 * @see https://typescript-eslint.io/rules/no-floating-promises
		 */
		'@typescript-eslint/no-floating-promises': 'warn',

		/**
		 * Allow explicit types where they can be easily inferred
		 * @see https://typescript-eslint.io/rules/no-inferrable-types
		 */
		'@typescript-eslint/no-inferrable-types': 'off',

		/**
		 * Checks that promises are awaited when checking for truthiness
		 * @see https://typescript-eslint.io/rules/no-misused-promises
		 */
		'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],

		/**
		 * Disallow unused variables
		 * @see https://typescript-eslint.io/rules/no-unused-vars
		 */
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

		/**
		 * Prefer `a?.b?.c` over `a && a.b && a.b.c`
		 * @see https://typescript-eslint.io/rules/prefer-optional-chain
		 */
		'@typescript-eslint/prefer-optional-chain': 'error'
	}
});
