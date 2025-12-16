## Build workflow

1. `npm run api:generate` to generate the openapi typescript files from the nestjs endpoints. This consists of two steps:
	- `ts-node scripts/generate-openapi-spec.ts` which generates the openapi spec from the nestjs endpoints
	- `openapi-generator-cli generate` which generates the typescript files from the openapi spec into the `clients/angular20/src` directory
2. `npm run build:api` which builds the angular library from the typescript files in the `clients/angular20/src` directory

This angular library is then published and consumed by the angular frontend.

## Release & Release Candidate Publishing

- **Production releases** are published automatically on every push to the `master` branch using semantic-release.
- **Release candidates (RCs)** are published on other branches only for commits with messages matching `build(*): [rc]` (or similar, e.g. `build(api): [rc]`).
- RC versions are tagged as `<version>-<branch>-rc.<timestamp>` and published to GitHub Packages.
- To trigger an RC publish, use a commit message like:

  ```
  build(api): [rc] Add new endpoint for testing
  ```

- All other commits on non-master branches will **not** trigger a release.
