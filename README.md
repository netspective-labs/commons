## Packages

### Generating package

---

To create a new JavaScript library using NX, follow these steps:

1. Open a terminal window and navigate to the root directory of your NX workspace.
2. Run the following command:

```bash
npx nx generate @nx/js:library <library-name> --directory=<directory-name> --publishable --importPath=<import-path>
```

Replace <library-name> with the desired name for your library, <directory-name> with the directory where you want the library to be created, and <import-path> with the import path for your library. Here's an explanation of the arguments:

- `@nx/js:library` is the schematic that will be used to generate the library. This is provided by the `@nx/js` package.
- `<library-name>` is the name of your library. This should be in kebab-case (lowercase with hyphens) and should describe the purpose of your library.
- `--directory=\<directory-name>` specifies the directory where your library will be created. This should be in camelCase (lowercase with no spaces, but with the first letter of each word capitalized).
- `--publishable` creates a library that can be published to an external registry (like npm), or in our case Github Packages.
- `--importPath=\<import-path>` is the import path for your library. This should be in the format `@<scope>/<library-name>`, where `<scope>` is your npm scope (if you have one) and `<library-name>` is the name of your library in kebab-case.

For example, if you want to create a library called `math-helpers` in the `nodejs` directory that can be published to npm with an import path of `@netspective-labs/math-helpers`, you would run the following command:

```bash
npx nx generate @nx/js:library math-helpers --directory=nodejs --publishable --importPath=@netspective-labs/math-helpers
```

This will generate a new library in the nodejs directory of your workspace with the necessary files and configuration to get started building your library.

### Building package

---

To build the package run:

```bash
npx nx run <project>:build
```

Replace `<project>` with the name of the project you want to build. You can find the project name in the `project.json` file located at the root directory of the package you are trying to build.

### Publishing package

---

In order to publish the package to _Github Packages_ you'll need to change the `package.json` that's located at the root of it.

```json
"type": "module",
"repository": {
    "type": "git",
    "url": "git+https://github.com/<OWNER>/<REPO>/<PACKAGE_NAME>.git",
    "directory": "path/to/your/package"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
```

- Change the `type` property and set it to _module_.
- Add the `repository` property with an object with the properties seen above.

  An example of a valid `url` value would be:

```
git+https://github.com/netspective-labs/commons/math-helpers.git
```

- Set the `directory` property to the actual path to the package. A valid path for the `math-helpers` package that we created earlier as an example would be `packages/nodejs/math-helpers`

- Set the `publishConfig` in order to point to the _Github Packages registry_.

_Note: <PACKAGE_NAME> doesn't have to be neccessarily the name in the `project.json`. Here you can name the package as you want._

Then we also need to change a little bit the `project.json` located at the root of the package.

The `publish` target should look like this:

```json
"publish": {
  "executor": "nx:run-commands",
  "options": {
    "command": "node tools/scripts/publish.mjs <PACKAGE_NAME> {args.ver} {args.tag}",
    "args": "--ver='0.0.1' --tag='latest'"
  },
  "dependsOn": ["build"]
},
```

_IMPORTANT: before publishing your package, run the build command for that package (see "Building" section above)._

After these changes were made, we are ready to publish our package. Make sure you've created a _Github repository_ before publishing, if you didn't this won't work.

```bash
npx nx run <PACKAGE_NAME>:publish
```

This will run the command specified in the `publish.options.command`.

Note: if it's not the first time the package is being published, it may need a version bump. To do this change the version in the `package.json` and also in the `ver` args in `publish.options.args` at the `project.json` file. Otherwise if you do not do this the publish command will throw an error arguing that you can't publish a package with a version that already exists.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
