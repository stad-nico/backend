import { input } from '@inquirer/prompts';
import { execSync } from 'child_process';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
	const pkgName = await input({ message: 'Package name' });
	const fullPkgName = `@stad-nico/${pkgName}`;

	console.log('Generating OpenAPI Angular client...');
	execSync(`cd ${__dirname} && npx openapi-generator-cli generate`, { stdio: 'inherit' });

	const pkgPath = path.join(__dirname, '../generated/package.json');
	if (fs.existsSync(pkgPath)) {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
		pkg.name = fullPkgName;
		fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
		console.log(`Updated package name to ${fullPkgName}`);
	} else {
		console.error('package.json not found in generated folder.');
		process.exit(1);
	}

	console.log('Publishing to npm...');
	execSync('npm publish --access public', { cwd: path.join(__dirname, '../generated'), stdio: 'inherit' });
	console.log('Published successfully!');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
