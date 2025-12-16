## Folder structure

```bash
.
├── api
│   ├── api.json
│   └── openapi.yaml
├── dist
│   ├── api
│   │   └── index.d.ts
│   └── api
│       └── index.js
├── node_modules
├── package.json
├── src
│   ├── api
│   │   └── api.module.ts
│   └── app.module.ts
├── tsconfig.api.json
├── tsconfig.json
└── yarn.lock
```

## Release & Release Candidate Publishing

- **Production releases** are published automatically on every push to the `master` branch using semantic-release.
- **Release candidates (RCs)** are published on other branches only for commits with messages matching `build(*): [rc]` (or similar, e.g. `build(api): [rc]`).
- RC versions are tagged as `<version>-<branch>-rc.<timestamp>` and published to GitHub Packages.
- To trigger an RC publish, use a commit message like:

  ```
  build(api): [rc] Add new endpoint for testing
  ```

- All other commits on non-master branches will **not** trigger a release.
