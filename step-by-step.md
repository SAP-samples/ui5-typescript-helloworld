# A Detailed Guide to Creating a UI5 TypeScript App From Scratch in Five to Fifteen Steps

This guide explains step-by-step and command-by-command how you achieve a complete UI5 TypeScript setup from scratch.

While you can get started faster by using the [Easy-UI5 "ts-app" template](https://github.com/ui5-community/generator-ui5-ts-app) or just copying and modifying the entire Hello World app, this step-by-step guide will help you *understand* every bit and piece of the setup and how the pieces fit together.

It consists of 15 steps, but in fact only steps 2, 3, 4 and 6 are really related to the basic TypeScript setup and steps 11, 12 and 14 to testing in TypeScript. The remaining steps are about adding the UI5 tools to the project and about wrapping everything up nicely, so those steps apply more or less to any UI5 application project regardless of the used language.

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
1. [The Test Code](#11-the-test-code)
1. [Enable TypeScript support for the Test Code](#12-enable-typescript-support-for-the-test-code)
1. [Automated QUnit/OPA Testing using `ui5-test-runner`](#13-automated-qunitopa-testing-using-ui5-test-runner)
1. [Enable Code Coverage Reporting](#14-enable-code-coverage-reporting)
1. [Add Scripts for Testing to `package.json`](#15-add-scripts-for-testing-to-packagejson)

## 1. Initialize an Empty Project

Type the following on the command line to create the project directory and go inside:

```sh
mkdir ui5-typescript-from-scratch
cd ui5-typescript-from-scratch
```

Initialize an [npm](https://www.npmjs.com)-based project - this creates the `package.json` file where also the dependencies will be added:

```sh
npm init -y
```

The `-y` parameter uses default settings for all options without asking - you can adapt them in package.json if needed.

## 2. Create an Initial TypeScript Resource

Inside your project, create a `webapp` folder:

```sh
mkdir webapp
```

Inside this folder (`cd webapp`), create a file with TypeScript code. In order to test the use of UI5 types and the code transformation, name it `Component.ts` (note: the file ending is `.ts`, not `.js`!) and add the following code inside. Of course, this is so far just a dummy component and not yet a complete app:

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

  1. It is **TypeScript** code, which means while mostly being plain JavaScript, it also contains type declarations for variables, parameters and function return values, as seen in the definition of the "multiply" method. In a moment, you will be able to see how these will be stripped away by the TypeScript compilation.

  1. It is **modern JavaScript (/TypeScript)** code with [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), which will be transformed to classic UI5 code (with `sap.ui.require(...)` and `BaseClass.extend(...)`) in a further step of the build process. This is not really related to TypeScript, but it's the way how we recommend to write modern UI5 apps when a build step is anyway needed.

## 3. Set Up the TypeScript Compilation

Now, let's get the TypeScript compiler and the UI5 type definitions as dev dependencies:

```sh
npm install --save-dev typescript @types/openui5
```

When you are developing a SAPUI5 application (i.e. also using control libraries which are not available in OpenUI5), use the `@sapui5/types` types instead of the `@types/openui5` ones.

> **Remark:** There are also `@openui5/types` available - how do they differ from the `@types/openui5` ones?<br>
The content is basically the same, one difference is in versioning: while the types in the `@openui5` namespace are exactly in sync with the respective OpenUI5 patch release, the ones in the `@types` namespace follow the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) versioning and are only released *once* per minor release of OpenUI5 ([more details here](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/openui5#versioning)), not for every patch. In practice, it shouldn't make a noticeable difference which you use, but note that in the `@types` namespace there is usually only the `*.*.0` patch release available.<br>
> The SAPUI5 types are not available in the `@types` namespace.

To trigger the first TypeScript transpilation in this project, now execute

```sh
npx tsc webapp/Component.ts
```

(The `npx` command runs the subsequently written npm module from within the `node_modules` folder, so it does not need to be installed globally.)

The TypeScript compiler tries to compile the component file, but it complains because it finds some unknown JavaScript classes (`Iterator`, `Generator`) in the UI5 type definitions. This is because TypeScript by default works with a pretty old language level of JavaScript (ES3) and we need to tell it to accept a newer language level (ES2022).

Actually, there is some Component.**js** file created inside the `webapp` folder, but the content is really weird and bloated because the transpiler tried to re-build some newer JavaScript features with extra code.<br>
**Please delete this file to avoid downstream issues!**

To configure the transpiler properly, we need to add a `tsconfig.json` configuration file. Add a file with this name and the following content to the *root* of the project, *outside* the `webapp` folder:

```json
{
    "compilerOptions": {
        "target": "es2023",
        "module": "es2022",
        "moduleResolution": "node",
        "skipLibCheck": true,
        "allowJs": true,
        "strict": true,
        "strictPropertyInitialization": false,
        "rootDir": "./webapp",
        "paths": {
            "ui5/typescript/helloworld/*": ["./webapp/*"]
        },
        "composite": true
    },
    "include": ["./webapp/**/*"]
}
```

> **Note:** when you use the `@sapui5/types` or `@openui5/types` types instead, you need to add the following section to tsconfig.json:
>
> ```json
>        "types": [
>            "@sapui5/types"
>        ],
>```
> (or `@openui5/types`, respectively)
>
> Why? TypeScript automatically finds all type definition files in a dependency starting with `@types/...` (i.e. all `.d.ts` files in `node_modules/@types/...`). The SAPUI5 types are only available in a package starting with `@sapui5/...`, hence TypeScript must be explicitly pointed to these types. Note that this disables the automatic loading of other types from `node_modules/@types/...`, so any additional types also need to be added to this list.

There are additional settings in this file, e.g. telling the compiler which files to compile (all matching `./webapp/**/*`) and how the modules should be resolved (`"moduleResolution": "node"`). And a couple of compiler options which are not so important right now. They determine how exactly the compiler should behave. The "paths" section informs TypeScript about the mapping of namespaces used in the app.

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

Again, remember to delete the previously generated `webapp/Component.js` file if you tried transpiling before creating the `tsconfig.json` file.

In case there is a type error, the compilation will let you know. E.g. when you change the return type of the `multiply` function to `string` in `Component.ts`, then there will be an error:

```ts
public multiply(x : number, y : number) : string {
```

will result in:

```sh
webapp/Component.ts:9:3 - error TS2322: Type 'number' is not assignable to type 'string'.
9       return x * y;
```

You can also invoke this check without creating the compiled output files when you add the `-noEmit` flag to the compiler call:

```sh
npx tsc -noEmit
```

Note that the transpilation result still contains ES modules and classes, not the UI5-specific module loading and class definition. This will be taken care of later.

## 4. Set Up a Lint Check

While not required, it makes sense to have your code checked with a linter. The popular [ESLint](https://eslint.org/) tool also understands TypeScript when some plug-ins are added. It is the recommended tool to lint TypeScript code. So let's add ESLint and these plug-ins as dev dependencies!

```sh
npm install --save-dev eslint typescript-eslint
```

ESLint needs to be told which plug-ins to use and which JavaScript language level the code should have, so create a `eslint.config.mjs` file in the project root with these settings:

```js
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				sap: "readonly"
			},
			ecmaVersion: 2023,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		ignores: ["eslint.config.mjs"]
	}
);
```

After adding the configuration, you can now execute ESLint with the following command:

```sh
npx eslint webapp
```

Your TypeScript code can now be checked for syntax and style problems.

There should not be any output (this means: no error), but if you introduce a syntax error to Component.ts, the check will complain with an error and if e.g. the return type of the `multiply` function is missing, it will show a warning.

If you get an error straight away which says something about the file "webapp\Component.**js**", then this might be a left-over compilation result from step 3 above. Delete this file and re-try.

In the configuration file all kinds of details regarding the ESLint rules can be configured. But for this guide (and because the UI5 team does not currently give a set of actual recommendations) let's stick with the recommended TypeScript defaults, which the above configuration extends.

## 5. Set Up the UI5 CLI Tooling

To benefit from an improved development experience and the possibility to build and optimize your application before productive use, it is recommended to use the [UI5 CLI Tooling](https://sap.github.io/ui5-tooling/pages/CLI/). You can benefit from an ecosystem of tooling extensions (e.g., livereload, proxies, ...) to simplify your development. It also nicely integrates the TypeScript transpilation (see the next chapter), so you do not have to invoke the transpiler directly.

You can install the UI5 CLI Tooling with the following command:

```sh
npm install --save-dev @ui5/cli
```

Afterwards, you can use the UI5 Tooling to initialize the project and create the UI5 Tooling specific configuration file - the `ui5.yaml`. To do so, just execute the following command:

```sh
npx ui5 init
```

By default the configuration file includes just the following basic metadata (the `specVersion` of the `ui5.yaml` file, the project `name` and the project `type`):

```yaml
specVersion: "4.0"
metadata:
  name: ui5-typescript-from-scratch
type: application
```

For running UI5 applications with the UI5 Tooling we also need some additional `framework` information (like framework `name` and `version`) and the required libraries and theme libraries. Now put the following content in your `ui5.yaml` (please change the generated `metadata > name` to `ui5.typescript.helloworld` and use a current OpenUI5 version):

```yaml
specVersion: "4.0"
metadata:
  name: ui5.typescript.helloworld
type: application
framework:
  name: OpenUI5
  version: "1.142.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.ui.unified
    - name: themelib_sap_horizon
```

As seen in the initial content of the `ui5.yaml` after running `ui5 init` only the first four lines are strictly required to use the UI5 Tooling, the rest is still useful: the `framework` section downloads the UI5 framework along with needed libraries and provides it at the virtual path `/resources` when `ui5 serve` is called. This path is from where the index.html file loads UI5. More information about the UI5 Tooling can be found here: [https://sap.github.io/ui5-tooling](https://sap.github.io/ui5-tooling).

The UI5 Tooling commands require at least a [`manifest.json`](https://ui5.sap.com/#/topic/be0cf40f61184b358b5faedaec98b2da.html) file in the `webapp` folder. A very simple and lightweight `manifest.json` providing the `id`, `type`, `title` and `version` of your application:

```json
{
    "_version": "1.68.0",
    "sap.app": {
        "id": "ui5.typescript.helloworld",
        "type": "application",
        "title": "UI5 TypeScript Hello World",
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
          data-sap-ui-compat-version="edge"
          data-sap-ui-on-init="onInit"
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

After creating this file you can start the `test.html` running inside the development server of the UI5 CLI Tooling (but note that this is just to test the UI5 tooling setup and not related to TypeScript!):

```sh
npx ui5 serve -o test.html
```

That's it! A web server with the test page is started and it is automatically opened inside your default browser!

## 6. Using a UI5 Tooling Extension for Code Transformation

The code transpiled by `tsc` still uses ES modules and classes, which would still need to be transformed to classic UI5 code to work properly. To apply this transformation, we will use the [`ui5-tooling-transpile`](https://www.npmjs.com/package/ui5-tooling-transpile) tooling extension instead of calling `tsc`. This tooling extension uses the [Babel](https://babeljs.io/) transpiler behind the scenes and configures Babel to 1. transpile the code to JavaScript and 2. transform the code to proper UI5 code (especially UI5-style imports and classes). The TypeScript compiler will no longer be called for the transpilation from now on, only for the type checking.

Add the dependency to `ui5-tooling-transpile` to your project first:

```sh
npm install --save-dev ui5-tooling-transpile
```

Then add the following configuration at the end of your `ui5.yaml`. Make sure the indentation levels are correct, with "builder" and "server" on the same level as "framework":

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

The `ui5-tooling-transpile` tooling extension is by default configuration free. It derives the programming language being TypeScript or JavaScript by the existence of the `tsconfig.json` file in the project root.

> `ui5-tooling-transpile` uses a default Babel configuration. As an *optional* step - when you need to customize the code transformation of Babel - you can create a [Babel configuration](https://babeljs.io/docs/configuration) file (i.e. `.babelrc.json`) in the root of the project, with the following content:
>
> ```json
>  {
>    "ignore": [
>      "**/*.d.ts"
>    ],
>    "presets": [
>      ["@babel/preset-env", {     // applied 3rd
>        "targets": "defaults"
>      }],
>      "transform-ui5",            // applied 2nd
>      "@babel/preset-typescript"  // applied 1st
>    ],
>    "sourceMaps": true
>  }
> ```
> 
> The default configuration used internally by the tooling extension is similar to this. If you decide for a custom Babel configuration we recommend for the `@babel/preset-env` to use the targets [`defaults`](https://browsersl.ist/#q=defaults).

Now you are ready to transform your TypeScript code into proper UI5 JavaScript code. Just execute the build with the UI5 Tooling with the following command:

```sh
npx ui5 build --clean-dest
```

The result is a `dist` folder with (among others) a `Component-dbg.js` file which is converted from TypeScript AND also converted to classic UI5 code!

Open this file to see: the module imports are replaced with the classic `sap.ui.define(...)` and the `Component` class is now defined by calling `UIComponent.extend(...)`:

```js
...
sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  ...
  const Component = UIComponent.extend("ui5.typescript.helloworld.Component", {
```

This means the complete TypeScript build setup is now done!

## 7. Complete the App Code

To extend the now-complete TypeScript setup into a complete app development setup in the rest of this tutorial, we need a complete and runnable app.

Please copy the entire content of this repository's [webapp](webapp) directory (you can [download the entire repository from here as zip file](../../archive/refs/heads/main.zip)) into your local project's `webapp` directory. Make sure to also replace the dummy `Component.ts` file we have used so far and delete the `webapp/test` folder for the time being! The tests will be explained further down.

Alternatively, you could of course also develop your own UI5 app in TypeScript within the `webapp` folder.

## 8. Set Up Live Reload for Easier Development (Optional)

To make the browser reload the app automatically when you modify the sources, you only need to add the [`livereload`](https://www.npmjs.com/package/ui5-middleware-livereload) middleware. This middleware checks for any changes in the `webapp` folder and causes the browser to reload when such a change is detected.

The `livereload` middleware is added as follows. First, add it as another dependency:

```sh
npm install --save-dev ui5-middleware-livereload
```

Second, register the middleware at the end of the `server > customMiddleware` section in your `ui5.yaml` file. The `livreload` middleware is configuration-free, you just need to register it:

```yaml
    - name: ui5-middleware-livereload
      afterMiddleware: compression
```

Make sure to get the indentation right (like the ui5-tooling-transpile-middleware lines) because it is significant in yaml files.

As result, you can now run the development server with the following command:

```sh
npx ui5 serve -o index.html
```

The app in the automatically opened browser window reloads whenever a source file in `webapp` folder was changed and saved.

## 9. Add an Optimized UI5 Build (Optional)

This step is again not at all related to TypeScript, but as the UI5 Tooling are already set up, you can as well use them for building an optimized **self-contained** app: it picks only the needed UI5 framework modules and controls and bundles them with all application resources into one single file.

```sh
npx ui5 build self-contained --clean-dest --all
```

The `self-contained` command takes care of bundling all resources into one single file. This means: app code AND UI5 code! The `--all` switch takes care of building and copying all UI5 framework resources to the `dist` folder as well. The JavaScript resources should not be needed there (because all needed ones should already be in the bundle). But library CSS files etc. are not in the bundle, they are just put aside.

This takes a while, maybe a minute or two, as it also needs to process all UI5 resources and creates not only the optimized bundle, but also all the other UI5 resources. But this is anyway a step which is usually only done once before releasing the app, not for every development roundtrip.

Alternatively, if you don't need the fully optimized one-file bundle and want to load UI5 from CDN or elsewhere, you can also just do a regular build:

```sh
npx ui5 build --clean-dest
```

Either way, the result in `dist` can either be put on a static web server or it can be served with the UI5 Tooling. To set up the latter, a slightly different UI5 tools configuration is needed because it now needs to serve from the `dist` folder. This configuration goes into a new file named `ui5-dist.yaml` in the project root:

```yaml
specVersion: "4.0"
metadata:
  name: ui5.typescript.helloworld
type: application
resources:
  configuration:
    paths:
      webapp: dist
framework:
  name: OpenUI5
  version: "1.142.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.ui.unified
    - name: themelib_sap_horizon
```

One difference from the other yaml file is the removal of the `builder` and `middleware` configuration sections, as they are not needed anymore in a productive build, and the other one is the addition of the `resources` section which tells the UI5 Tooling to serve from the `dist` directory.

To run the build result from `dist`, `ui5 serve` can then be executed as before, but additionally using this new configuration file:

```sh
npx ui5 serve -o index.html --config ui5-dist.yaml
```

## 10. Add Scripts for Building/Running/Checking to `package.json`

Now it's time to write down the various commands used so far as scripts in `package.json`, so you don't need to recall and type them every time they are used.

While we are at it, we can add one more command: the `ui5-linter`, which complements eslint with code checks that make sure the code adheres to the best practices and is ready for UI5 2.x:

```sh
npm install --save-dev @ui5/linter
```

It can be invoked using `npx ui5lint`.

Change the `"scripts"` section in the `package.json` file to have the following content. All scripts have already been used and explained earlier, so there is nothing new here, it's just for convenience.

```json
{
    "build": "ui5 build --clean-dest",
    "build:opt": "ui5 build self-contained --clean-dest --all",
    "start": "ui5 serve --port 8080 -o index.html",
    "start:dist": "ui5 serve  --port 8080 -o index.html --config ui5-dist.yaml",
    "ts-typecheck": "tsc --noEmit",
    "lint": "eslint webapp",
    "ui5lint": "ui5lint"
}
```

Calling `npx` is not needed here, as the commands are automatically found within the `node_modules` folder when run as npm script.

An important topic has been skipped so far - let's take a look into testing!

## 11. The Test Code

### Overview

The location for the QUnit tests for UI5 applications is the `webapp/test` folder. So far we have ignored its content. Now let's step through all parts of it. Below you see the overall structure.

It is [exactly the same structure and files as for JavaScript projects](https://github.com/ui5-community/generator-ui5-app/tree/main/generators/app/templates/webapp/test), so this section does not go into all the details, but focuses on the TypeScript-specific parts.

```text
webapp/test
├── integration               // the OPA integration tests
|   ├── pages                 //  - test pages
|   |   └── AppPage.ts
|   ├── HelloJourney.ts       //  - journey
|   └── opaTests.qunit.ts     //  - the testsuite
├── unit                      // the unit tests
|   ├── controller            //  - user-defined QUnit tests folder
|   |   └── App.qunit.ts      //  - QUnit test for the controller
|   └── unitTests.qunit.ts    //  - the testsuite
├── Test.qunit.html           // the page inside which the tests are run
├── testsuite.qunit.ts        // the general testsuite setup
└── testsuite.qunit.html      // the general testsuite html page
```

Starting from the last item of the above tree:
- `testsuite.qunit.html` is the main entry point and makes the UI5 test starter build the overall testsuite according to the configuration in `testsuite.qunit.ts`.
- `testsuite.qunit.ts` is the overall test configuration as defined and required by the [UI5 test starter](https://ui5.sap.com/sdk/#/topic/22f50c0f0b104bf3ba84620880793d3f).
- `Test.qunit.html` is the generic test page in which the tests are run. It will be called with the test suite and test name in order to run a test.
- `unitTests.qunit.ts` is where all QUnit test pages are registered by simply importing their modules: `import "unit/controller/App.qunit";`
- `App.qunit.ts` is an example of a very basic unit test written in TypeScript.
- `opaTests.qunit.ts` is like for the unit tests the central place where you register your journeys by importing them: `import "integration/HelloJourney";`.
- `HelloJourney.ts` and `AppPage.ts` are the well-known journeys and pages for OPA tests, but they come with a twist in TypeScript, or rather: a simplification. See the main README.md file for details.


### Unit Tests (QUnit)

Writing [Unit tests (QUnit)](./webapp/test/unit/) in TypeScript is straightforward, just as you know it from JavaScript.

In the (very basic) tests in [`webapp/test/unit/controller/App.qunit.ts`](webapp/test/unit/controller/App.qunit.ts) there is nothing surprising from TypeScript perspective. There isn't any TypeScript-specific syntax required, but of course ES6-style imports are used just like in TypeScript application code.

> Note: `QUnit` is globally defined and its types are automatically required by the UI5 types. So there is no setup needed to use it. However, in order to allow clean code that does not access any globals, starting with UI5 1.112, QUnit should be explicitly imported like this: `import QUnit from "sap/ui/thirdparty/qunit-2";`

### Integration Tests (OPA)

OPA tests are written in a simplified and slightly different way compared to JavaScript, so make sure to carefully read this section!

#### The "Hello" Journey

The test journey [`webapp/test/integration/HelloJourney.ts`](webapp/test/integration/HelloJourney.ts) is overall pretty straightforward, but it comes with one significant difference to JavaScript: the `Given`/`When`/`Then` objects normally given to the `opaTest(...)` callback are **not used at all!**<br>
Instead, the actions and assertions are called directly on the OPA test Page (in this case the `AppPage`). The same goes for setup and teardown functions like `iStartMyUIComponent()` and `iTeardownMyApp()`, which are also available on the Page, as it inherits from `Opa5`.

You are free to make the difference between actions and assertions clear with comments, but there is no need to carry different entities around through the code, especially as those entities are hard to fit into the TypeScript world.

#### The "App" Page

This is where the biggest changes are done compared to non-TypeScript OPA tests: the OPA Pages are simply classes extending `Opa5`, having the actions and assertions as class methods.

Apart from this, the implementation of the actions and assertions is done just like in JavaScript.



## 12. Enable TypeScript support for the Test Code

To make TypeScript aware of the additional module paths for the `unit` and the `integration` test code, we need to extend the `paths` information of the `tsconfig.json` with the following entries:

```json
        "paths": {
            "ui5/typescript/helloworld/*": ["./webapp/*"],
            "unit/*": ["./webapp/test/unit/*"],
            "integration/*": ["./webapp/test/integration/*"]
        },
```

Now you should be able to get proper code completion support for your QUnit and OPA tests.

## 13. Automated QUnit/OPA Testing using ui5-test-runner

To automate the execution of the QUnit/OPA tests, we are using [`ui5-test-runner`](https://arnaudbuchholz.github.io/ui5-test-runner/). To add the required dependency you need to run the following command:

```sh
npm install --save-dev ui5-test-runner
```

While `ui5-test-runner` can launch the app in its legacy mode, it requires the app to be available at a given URL in normal mode. Either start the app first (if not running) in a different terminal, then afterwards the test-runner:

```sh
npm start
# in different terminal:
npx ui5-test-runner --url http://localhost:8080/test/testsuite.qunit.html
```

Or, if you do not want to launch the app separately, you can make the test runner start it:

```sh
npx ui5-test-runner --start start --url http://localhost:8080/test/testsuite.qunit.html
```

> Note: if you want to monitor the progress of the tests, you can add the `--port 8081` parameter. Then the progress can be seen at http://localhost:8081/_/progress.html as long as the tests are running.

After running the tests, a `report` folder will be created, which contains all kinds of information about the test run, including screenshots.

Add this `report` folder to your `.gitignore` file, as it is not meant to be checked in.


## 14. Enable Code Coverage Reporting

To measure code coverage, the code needs to be instrumented. In contrast to JavaScript, the code instrumentation for coverage reporting in TypeScript does not work with `@ui5/middleware-code-coverage` at the moment. Instead, the Babel plugin `istanbul` needs to be set up in the Babel configuration of the `ui5-tooling-transpile` middleware. This is also documented by the [`ui5-test-runner`](https://github.com/ArnaudBuchholz/ui5-test-runner/blob/main/docs/coverage.md#typescript-ui5cli-projects).


### a) Configuration in `ui5-coverage.yaml`

Code instrumentation is not always needed, only for coverage tests. Hence, create an additional configuration file `ui5-coverage.yaml` as copy of `ui5.yaml` with the `ui5-tooling-transpile-middleware` section extended like this. The respective npm script in `package.json` will then reference this file.

```yaml
    - name: ui5-tooling-transpile-middleware
      afterMiddleware: compression
      configuration:
        debug: true
        babelConfig:
          sourceMaps: true
          ignore:
          - "**/*.d.ts"
          presets:
          - - "@babel/preset-env"
            - targets: defaults
          - - transform-ui5
          - "@babel/preset-typescript"
          plugins:
          - istanbul
```

### b) Add `babel-plugin-istanbul` Dependency

Add the `babel-plugin-istanbul` referenced in the last line above to the project's dev dependencies:

```sh
npm install --save-dev babel-plugin-istanbul
```

### c) Use `.nycrc.json` to Exclude Test Files from Coverage

To exclude the test files from coverage reporting, create a `.nycrc.json` file with the following content:

```json
{
    "all": true,
    "sourceMap": false,
    "exclude": [
        "**/test/**/*.ts"
    ]
}
```

### Running Tests with Code Coverage

Now, you are ready to run your first test execution with coverage reporting. Again, there are two ways to do it:

Either run the following commands in different terminals. The first one runs the UI5 dev server with the new yaml including coverage configuration (stop the regular `npm start` if still running to free port 8080), and the second one launches the actual tests witch certain coverage thresholds:

```sh
npx ui5 serve --port 8080 --config ui5-coverage.yaml
# in different terminal:
npx ui5-test-runner --url http://localhost:8080/test/testsuite.qunit.html --coverage -ccb 60 -ccf 100 -ccl 80 -ccs 80
```

Or do it within one command (this will look simpler once we create a `package.json` script for the application start):

```sh
npx ui5-test-runner --start "npx ui5 serve --port 8080 --config ui5-coverage.yaml" --url http://localhost:8080/test/testsuite.qunit.html --coverage -ccb 60 -ccf 100 -ccl 80 -ccs 80
```

After the execution finished, you should see a **Coverage summary** in your console and you can find the results of the test coverage run in your `coverage` folder. The following resources are being created for the different report formats:

* `lcovonly`: `coverage/lcov.info`
* `cobertura`: `cobertura-coverage.xml`
* `html`: `coverage/lcov-report/index.html`

Add the `coverage` and `.nyc_output` folders which are created during the tests to your `.gitignore` file.


## 15. Add Scripts for Testing to `package.json`

Now it's time to write down the testing commands used so far to the `"scripts"` section in `package.json`, so you don't need to type the full commands every time they are used:

```json
{
    [...],
    "start-coverage": "ui5 serve --port 8080 --config ui5-coverage.yaml",
    "test-runner": "ui5-test-runner --url http://localhost:8080/test/testsuite.qunit.html",
    "test-runner-coverage": "ui5-test-runner --url http://localhost:8080/test/testsuite.qunit.html --coverage -ccb 60 -ccf 100 -ccl 80 -ccs 80",
    "test-ui5": "ui5-test-runner --start start-coverage --url http://localhost:8080/test/testsuite.qunit.html --coverage -ccb 60 -ccf 100 -ccl 80 -ccs 80",
    "test": "npm run lint && npm run test-ui5",
}
```

The `test-ui5` script is suited well for CI scenarios, as it includes the instruction to start the server. The `test-runner...` scripts, on the other hand, expect the server to already run. You can of course adapt as needed. 

For the general `test` script, we recommend to execute `lint` and `test-ui5` to validate that static code checks and the functional and integration tests are executed when testing your app.


This is the end! You got a comprehensive and complete overview on UI5 application development with TypeScript from the very basics. All setup details, which might be skipped in other tutorials because the setup is already prepared, should be explained now.

## Done!

You now have not only a fully functional TypeScript app development setup with all the features and npm scripts – but hopefully also an understanding of the different tools and configurations used in this setup!
