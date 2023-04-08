# A Detailed Guide to Create a UI5 TypeScript App From Scratch in Five to Ten Steps

This guide explains step-by-step and command-by-command how you get to a complete UI5 TypeScript setup from scratch.

While you can get started faster by just copying and modifying the entire *Hello World* app, this step-by-step guide will help you understand every bit and piece of the setup and how the pieces fit together.

It consists of ten steps, but in fact only the first half is really related to TypeScript. The remaining five steps are about adding the UI5 tools to the project and wrapping everything up nicely, so these steps apply more or less to any UI5 application project.

## Table of Contents

1. [Initialize an Empty Project](#1-initialize-an-empty-project)
1. [Create an Initial TypeScript Resource](#2-create-an-initial-typescript-resource)
1. [Set Up the TypeScript Compilation](#3-set-up-the-typescript-compilation)
1. [Set Up a Lint Check](#4-set-up-a-lint-check)
1. [Set Up the UI5 CLI Tooling](#5-set-up-the-ui5-cli-tooling)
1. [Using a UI5 Tooling Extension for Code Transformation](#6-using-a-ui5-tooling-extension-for-code-transformation)
1. [Complete the App Code](#7-complete-the-app-code)
1. [Set Up Live Reload for Easier Development (Optional)](#8-set-up-live-reload-for-easier-development-optional)
1. [Add an Optimized UI5 Build (Optional)](#9-add-an-optimized-ui5-build-optional)
1. [Add Scripts for Building/Running/Checking to `package.json`](#10-add-scripts-for-buildingrunningchecking-to-packagejson)

## 1. Initialize an Empty Project

Type the following on the command line to create the project directory and go inside:

```sh
mkdir ui5-typescript-from-scratch
cd ui5-typescript-from-scratch
```

Initialize an [npm](https://www.npmjs.com)-based project - this creates the `package.json` file in which also the dependencies will be added:

```sh
npm init -y
```

The `-y` parameter uses default settings for all options without asking - you can adapt them in package.json if needed.

## 2. Create an Initial TypeScript Resource

Inside your project, create a `webapp` folder:

```sh
mkdir webapp
```

Inside this folder, create a file with TypeScript code. In order to test the use of UI5 types and the code transformation, name it `Component.ts` (note: the file ending is `.ts`, not `.js`!) and add the following code inside. Of course, this is so far just a dummy component and not yet a complete app:

```ts
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.typescript.helloworld
 */
export default class Component extends UIComponent {

    public multiply(x : number, y : number) : number {
        return x * y;
    }
}
```

Note that the scope of this tutorial is the TypeScript setup of a project, not the application code itself. Hence the content of the *.ts files will not be explained further. It is plain regular UI5 application code, with two exceptions:

  1. It is **TypeScript** code, which means while mostly being plain JavaScript, it also contains type declarations for variables, parameters and function return values, as seen in the definition of the "multiply" method. You will be able to see how these will be stripped away by the TypeScript compilation.

  1. It is **modern JavaScript** code with [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), which will be transformed to classic UI5 code in a further step of the build process. This is not really related to TypeScript, but it's the way how we recommend to write modern UI5 apps when a build step is anyway needed.

## 3. Set Up the TypeScript Compilation

Now, let's get the TypeScript compiler and the UI5 type definitions:

```sh
npm install --save-dev typescript @types/openui5@1.112.0
```

When you are developing a SAPUI5 application (i.e. also using control libraries which are not available in OpenUI5), use the `@sapui5/ts-types-esm` types instead of the `@types/openui5` ones.

> **Remark:** There are also `@openui5/ts-types-esm` types available - how do they differ from the `@types/openui5` ones?<br>
The one difference is in versioning: while the types in the `@openui5` namespace are exactly in sync with the respective OpenUI5 patch release, the ones in the `@types` namespace follow the DefinitelyTyped versioning and are only released *once* per minor release of OpenUI5 ([more details here](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/openui5#versioning)), not for every patch. In practice it shouldn't make any difference what you use, but note that in the `@types` namespace there is usually only the `*.*.0` patch release available.<br>
The other small difference is [described in detail here](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/openui5#jquery-and-qunit-references-and-their-versions). In essence, UI5 declares the jQuery and QUnit types as dependencies to make sure the type definitions are also loaded because types from those libraries are in some places exposed in UI5 APIs. The difference is that for `@types/openui5` the *latest* version of those types is referenced and for `@openui5/ts-types-esm` the *best matching* version is referenced. But in practice also this difference should not be something to worry about. To enforce using a specific version of the jQuery/QUnit types with the `@types/openui5` type definitions, you can always do e.g.:
> ```sh
> npm install --save-dev @types/jquery@3.5.9 @types/qunit@2.5.4
> ```
>
> The SAPUI5 types are not available in the `@types` namespace.

Now execute

```sh
npx tsc webapp/Component.ts
```

(The `npx` command runs the subsequently written npm module from within the `node_modules` folder, so it does not need to be installed globally.)

The TypeScript compiler tries to compile the component file, but it complains because it finds some unknown JavaScript classes (`Iterator`, `Generator`) in the UI5 type definitions. This is because TypeScript by default works with a pretty old language level of JavaScript (ES3) and we need to tell it to accept a newer language level (ES2022).

Actually, there is some Component.**js** file created inside the `webapp` folder, but the content is really weird and bloated. **Please delete this file to avoid downstream issues!**

So we need to add a `tsconfig.json` configuration file to configure the right language level. Add a file with this name and the following content to the root of the project:

```json
{
    "compilerOptions": {
        "target": "es2022",
        "module": "es2022",
        "moduleResolution": "node",
        "skipLibCheck": true,
        "allowJs": true,
        "strict": true,
        "strictPropertyInitialization": false,
        "rootDir": "./webapp",
        "baseUrl": "./",
        "paths": {
            "ui5/typescript/helloworld/*": ["webapp/*"]
        },
        "composite": true
    },
    "include": ["./webapp/**/*"]
}
```

> **Note:** when you use the `@sapui5/ts-types-esm` (or `@openui5/ts-types-esm`) types instead, you need to add the following section to tsconfig.json:
>
> ```json
>        "typeRoots": [
>            "./node_modules/@types"
>        ],
>        "types": [
>            "@sapui5/ts-types-esm"
>        ],
>```
>
> Why? TypeScript automatically finds all type definition files in a dependency starting with `@types/...` (i.e. all `.d.ts` files in `node_modules/@types/...`). The jQuery d.ts files are there and found, but the SAPUI5 types are only available in a package starting with `@sapui5/...`, hence TypeScript must be explicitly pointed to these types. As this disables the automatic loading of other types from `node_modules/@types/...`, this path must be given as a type root.

There are additional settings in this file, e.g. telling the compiler which files to compile (all matching `./webapp/**/*`) and how the modules should be resolved (`"moduleResolution": "node"`). And a couple of compiler options which are not so important right now. They determine how exactly the compiler behaves. The "paths" section informs TypeScript about the mapping of namespaces used in the app.

Now you can do the following **in the root directory** of your project. TypeScript will pick up all the settings and as result you will find a compiled JavaScript file in the automatically created `dist` folder:

```sh
npx tsc --outDir ./dist
```

Yay! Your first successfully compiled TypeScript code! When inspecting the `dist/Component.js` file, you will see that all TypeScript specifics are gone. Specifically, the type information is stripped from the line defining the `multiply` method:

```js
multiply(x, y) {
    return x * y;
}
```

In case there is a type error, the compilation will let you know. E.g. when you change the return type of the `multiply` function to `string` in `Component.ts`, then there will be an error:

```ts
public multiply(x : number, y : number) : string {
```

will result in:

```sh
src/Component.ts:9:3 - error TS2322: Type 'number' is not assignable to type 'string'.
9       return x * y;
```

You can also invoke this check without creating the compiled output files when you add the `-noEmit` flag to the compiler call:

```sh
npx tsc -noEmit
```

### 4. Set Up a Lint Check

While not strictly required, it makes sense to have your code checked with a linter. The popular [ESLint](https://eslint.org/) tool also understands TypeScript when some plug-ins are added. It is the recommended tool to lint TypeScript code. So let's add ESLint and these plug-ins as dev dependencies!

```sh
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

ESLint needs to be told which plug-ins to use and which JavaScript language level the code should have, so create a `.eslintrc.json` file in the project root with these settings:

```json
{
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": ["./tsconfig.json"],
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ]
}
```

After adding the configuration you can now execute ESLint with the following command:

```sh
npx eslint webapp
```

Your TypeScript code can now be checked for syntax and style problems.

There should not be any output (this means: no error), but if you introduce a syntax error to Component.ts, the check will complain with an error and if e.g. the return type of the `multiply` function is missing, it will show a warning.

If you get an error straight away which says something like "The file does not match your project config: src\Component.**js**.", then this might be a left-over compilation result from step 3 above. Delete it and re-try.

In the configuration file all kinds of details regarding the single ESLint rules can be configured. But for this guide (and because the UI5 team does not currently give a set of actual recommendations) let's stick with the recommended TypeScript defaults, which are referenced in the `extends` section.

### 5. Set Up the UI5 CLI Tooling

To benefit from an improved development experience and the possibility to build and optimize your application before productive use, it is recommended to use the [UI5 CLI Tooling](https://sap.github.io/ui5-tooling/pages/CLI/). You can benefit from an ecosystem of tooling extensions (i.e., livereload, proxies, ...) to simplify your developers life.

You can install the UI5 CLI Tooling with the following command:

```sh
npm install --save-dev @ui5/cli
```

Afterwards you can use the UI5 Tooling to initialize the project and create the UI5 Tooling specific configuration file - the `ui5.yaml`. To do so, just execute the following command:

```sh
npx ui5 init
```

By default the configuration file includes just the following basic metadata (the `specVersion` of the `ui5.yaml` file, the project `name` and the project `type`):

```yaml
specVersion: '2.6'
metadata:
  name: ui5-typescript-from-scratch
type: application
```

For running UI5 applications with the UI5 Tooling we also need some additional `framework` information like framework `name` and `version`) and the required libraries and theme libraries. Now put the following content in your `ui5.yaml` (please adopt the `metadata > name` to `ui5.typescript.helloworld`):

```yaml
specVersion: "3.0"
metadata:
  name: ui5.typescript.helloworld
type: application
framework:
  name: OpenUI5
  version: "1.112.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.ui.unified
    - name: themelib_sap_horizon
```

As seen in the initial content of the `ui5.yaml` after running `ui5 init` only the first four lines are strictly required to use the UI5 Tooling, the rest is still useful: the `framework` section downloads the UI5 framework along with needed libraries and provides it at the virtual path `/resources` when `ui5 serve` is called. This path is from where the index.html file loads UI5. More information about the UI5 Tooling can be found here: [https://sap.github.io/ui5-tooling](https://sap.github.io/ui5-tooling).

The UI5 Tooling commands require at least a `manifest.json` (an [Application Descriptor](https://sapui5.hana.ondemand.com/sdk/#/topic/be0cf40f61184b358b5faedaec98b2da.html)) in the `webapp` folder. A very simple and lightweight `manifest.json` providing the `id`, `type`, and `version` of your application:

```json
{
  "_version": "1.52.0",
  "sap.app": {
    "id": "ui5.typescript.helloworld",
    "type": "application",
    "applicationVersion": {
      "version": "1.0.0"
    }
  }
}
```

What you can do now: create a simple `test.html` file in the `webapp` folder and run it from there using the UI5 Tooling:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>UI5 made easy!</title>
    <script id="sap-ui-bootstrap"
            src="resources/sap-ui-core.js"
            data-sap-ui-libs="sap.m"
            data-sap-ui-theme="sap_horizon"
            data-sap-ui-compatVersion="edge"
            data-sap-ui-oninit="onInit"
            data-sap-ui-async="true"
    ></script>
    <script>
      function onInit() {
        sap.ui.require(["sap/m/Button"], function(Button) {
          new Button({
            text: "Hello World",
            press: function() {
              alert(this.getText());
            }
          }).placeAt(content);
        });
      }
    </script>
  </head>
  <body class="sapUiBody">
    <div id="content"></div>
  </body>
</html>
```

After you can start the `test.html` running inside the development server of the UI5 CLI Tooling:

```sh
npx ui5 serve -o test.html
```

That's it! A web server with the test page is started and it is automatically opened inside your default browser!

## 6. Using a UI5 Tooling Extension for Code Transformation

The code transpiled by `tsc` still uses ES modules and classes which need to be transformed to classic UI5 code. To do so, we need another build step and server middleware, using the [`ui5-tooling-transpile`](https://www.npmjs.com/package/ui5-tooling-transpile) tooling extensions. It uses the [Babel](https://babeljs.io/) transpiler behind the scenes. The TypeScript compiler will no longer be called directly from now on. The UI5 Tooling now integraties the code transformation into its build lifecycle.

Add the dependency to `ui5-tooling-transpile` to your project first:

```sh
npm install --save-dev ui5-tooling-transpile
```

Then add the following configuration at the end of your `ui5.yaml`:

```yaml
builder:
  customTasks:
    - name: ui5-tooling-transpile-task
      afterTask: replaceVersion
server:
  customMiddleware:
    - name: ui5-tooling-transpile-middleware
      afterMiddleware: compression
```

The `ui5-tooling-transpile` tooling extension is by default configuration free. It derives the programming language being TypeScript of JavaScript by the existence of the `tsconfig.json` file in the project root.

Now you can run the build with the following command:

```sh
npx ui5 build --clean-dest
```

By default the `ui5-tooling-transpile` uses a default Babel configuration (which is created internally when running the task or the middleware). As an *optional* step - when you need to customize the code transformation of Babel - you can create a [Babel configuration](https://babeljs.io/docs/configuration) file (i.e. `.babelrc.json`) in the root of the project, with the following content:

```json
{
  "ignore": [
    "**/*.d.ts"
  ],
  "presets": [
    ["@babel/preset-env", {     // applied 3rd
      "targets": "defaults"
    }],
    "transform-ui5",            // applied 2nd
    "@babel/preset-typescript"  // applied 1st
  ],
  "sourceMaps": true
}
```

The default configuration used internally by the tooling extension is similar like the configuration above. If you decide for a custom Babel configuration we recommend for the `@babel/preset-env` to use the targets [`defaults`](https://browsersl.ist/#q=defaults).

Now you are ready to transform your TypeScript code into JavaScript code. Just execute the build with the UI5 Tooling with the following command:

```sh
npx ui5 build --clean-dest
```

The result is a `dist` folder with a `Component.js` file which is converted from TypeScript AND also converted to classic UI5 code!

Open this file to see: the module imports are replaced with the classic `sap.ui.define(...)` and the `Component` class is now defined by calling `UIComponent.extend(...)`:

```js
sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  ...
  const Component = UIComponent.extend("ui5.typescript.helloworld.Component", {
```

This means the complete TypeScript build setup is now done!

### 7. Complete the App Code

To extend the now-complete TypeScript setup into a complete app development setup in the rest of this tutorial, we need a complete and runnable app.

Please copy the entire content of this repository's [webapp](webapp) directory (you can [download the entire repository from here as zip file](../../archive/refs/heads/main.zip)) into your local project's `webapp` directory. Make sure to also replace the dummy `Component.ts` file we have used so far!

Alternatively, you could of course also develop your own UI5 app in TypeScript within the `webapp` folder.

### 8. Set Up Live Reload for Easier Development (Optional)

Making the browser reload the app automatically when you modify the sources you only need to add the [`livereload`](https://www.npmjs.com/package/ui5-middleware-livereload) middleware. This middleware checks for any changes in the `webapp` folder and causes the browser to reload when such a change is detected.

The `livereload` middleware is added as follows. First, add it as another dependency:

```sh
npm install --save-dev ui5-middleware-livereload
```

Second, register the middleware at the end of the `server > customMiddleware` section in your `ui5.yaml` file. The `livreload` middleware is configuration free, you just need to register it:

```yaml
server:
  customMiddleware:
  [...]
    - name: ui5-middleware-livereload
      afterMiddleware: compression
```

Make sure to get the indentation right (first line is not indented) because it is significant in yaml files.

As result, you can now run the development server with the following command:

```sh
npx ui5 serve -o index.html
```

The app in the automatically opened browser window reloads whenever a source file in `webapp` folder was changed and saved.

### 9. Add an Optimized UI5 Build (Optional)

This step is again not at all related to TypeScript, but as the UI5 Tooling are already set up, you can as well use them for building an optimized **self-contained** app: it picks only the needed UI5 framework modules and controls and bundles them with all application resources into one single file.

```sh
npx ui5 build self-contained --clean-dest --all
```

The `self-contained` command takes care of bundling all resources into one single file. This means: app code AND UI5 code. The `--all` switch takes care of building and copying all UI5 framework resources to the `dist` folder as well. The JavaScript resources should not be needed there (because all needed ones should already be in the bundle). But library CSS files etc. are not in the bundle, they are just put aside.

This takes a while, maybe a minute or two, as it also needs to process all UI5 resources. But this is anyway a step which is usually only done once before releasing the app, not for every development roundtrip.

Alternatively, if you don't need the fully optimized one-file bundle and want to load UI5 from elsewhere, you can also just do a regular build:

```sh
npx ui5 build --clean-dest
```

Either way, the result in `dist` can either be put on a static web server or it can be served with the UI5 Tooling. To simulate the latter, a slightly different UI5 tools configuration is needed because it now needs to serve from the `dist` folder. This configuration goes into a new file named `ui5-dist.yaml` in the project root:

```yaml
specVersion: "3.0"
metadata:
  name: ui5.typescript.helloworld
type: application
resources:
  configuration:
    paths:
      webapp: dist
framework:
  name: OpenUI5
  version: "1.112.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.ui.unified
    - name: themelib_sap_fiori_3
```

One difference to the other yaml file is the removed the `builder` and the `middleware` configuration sections as they are not needed anymore and the other one is the addition of the `resources` section which tells the UI5 Tooling to serve from the `dist` directory.

To run the build result from `dist`, `ui5 serve` can then be executed as before, but additionally using this new configuration file:

```sh
npx ui5 serve -o index.html --config ui5-dist.yaml
```

### 10. Add Scripts for Building/Running/Checking to `package.json`

Now it's time to write down the various commands used so far as scripts in `package.json`, so you don't need to type them every time they are used.

Change the `"scripts"` section in the `package.json` file to have the following content. All scripts have already been used and explained earlier, so there is nothing new here, it's just for convenience.

```json
{
    "build": "ui5 build --clean-dest",
    "build:opt": "ui5 build self-contained --clean-dest --all",
    "start": "ui5 serve --port 8080 -o index.html",
    "start:dist": "ui5 serve  --port 8080 -o index.html --config ui5-dist.yaml",
    "ts-typecheck": "tsc --noEmit",
    "lint": "eslint webapp"
}
```

Calling `npx` is not needed here, as the commands are automatically found within the "node_modules" folder when run as npm script.

## Done!

You now have not only a fully functional TypeScript app development setup with all the features and npm scripts described in the [README.md](README.md) file of this repository – but hopefully also an understanding of the different tools and configurations used in this setup!
