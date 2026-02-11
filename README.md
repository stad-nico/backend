# Developing workflow

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

# Coding guidelines

## Endpoints

### Response codes

- Create/Post endpoints: `201 (Created)`
- Update/Patch endpoints: `204 (No content)`
- Delete endpoints: `204 (No content)`
- Every other endpoint: `200 (OK)`

### Implementation

Implementation of endpoints should always follow this pattern:

1. Parse the request data and prepare data for the authorization query
2. Execute the authorization query
3. Prepare the data for the service layer
4. Call the service layer to get the data
5. Postprocess the data
6. Create a response object from the data
7. Return the response object

Example:

```ts
@Get('/all')
public async getTodos(@UserDecorator() user: User): Promise<GetAllTodosResponse> {
	const { id: userId } = user; // Step 3

	const todos = await this.todoService.getTodosByUserId(userId); // Step 4

	return GetAllTodosResponse.fromTodos(todos); // Step 5, 6 and 7
}
```

> [!IMPORTANT]
> Never convert the data to a response object inside the service layer. This prevents
> the service call to be reused for other endpoints because it is now dependent on the
> response object.
