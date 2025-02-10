# A Small TypeScript UI5 Example App

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/ui5-typescript-helloworld)](https://api.reuse.software/info/github.com/SAP-samples/ui5-typescript-helloworld)

**The main resource in this repository is [the detailed step-by-step guide](step-by-step.md), which explains how the TypeScript setup is created from scratch and how all the bits and pieces fit together.**

## Description

This app demonstrates the TypeScript setup for developing UI5 applications, including testing. The focus is on *understanding the setup* [step by step](step-by-step.md).

If you are *not* here for understanding the setup, then:
- The *fastest* way to get started with an app is using the yeoman-based [Easy-UI5 template "ts-app"](https://github.com/ui5-community/generator-ui5-ts-app).
- In the *[custom-controls](https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls)* branch, there is an example how custom controls can be developed in TypeScript within applications.
- In the [ui5-2.0](https://github.com/SAP-samples/ui5-typescript-helloworld/tree/ui5-2.0) branch, this repository demonstrates how an application can be tested against the type definitions (and runtime) of the upcoming *UI5 2.x version*.
- A more complete *real-life-like* application is in the [TypeScript branch of the "UI5 CAP Event App"](https://github.com/SAP-samples/ui5-cap-event-app/tree/typescript). It comes with an [explanation](https://github.com/SAP-samples/ui5-cap-event-app/blob/typescript/docs/typescript.md) of what UI5 TypeScript code usually looks like and what to consider.
- All *general information* about UI5 application development in TypeScript and links to tutorials, videos etc. can be found at https://sap.github.io/ui5-typescript.


## Overview of TypeScript-related Entities

- The UI5 type definitions (`*.d.ts` files) are loaded as dev dependency from [npm](https://www.npmjs.com/package/@types/openui5).
- The file [tsconfig.json](tsconfig.json) contains the configuration for the TypeScript compilation, including a reference to the UI5 `*.d.ts` files.
-  The TypeScript-to-JavaScript transpilation is done by [`ui5-tooling-transpile`](https://www.npmjs.com/package/ui5-tooling-transpile), which acts as both a build plugin (build results are stored in the `dist` folder) and middleware (the UI5 dev server transpiles the TypeScript files from `webapp` before sending it to the browser). Under the hood it uses the [Babel](https://babeljs.io/) transpiler.
- In addition to the TypeScript compilation, there is also a conversion from the ES6 module and class syntax used in the source files to the classic UI5 module loading and class definition syntax (`sap.ui.require(...)`/`sap.ui.define(...)` and `SuperClass.extend(...)`). This conversion is also done by `ui5-tooling-transpile`, using the [babel-plugin-transform-modules-ui5](https://github.com/ui5-community/babel-plugin-transform-modules-ui5) project from the UI5 Community (initially developed by Ryan Murphy).

## A Note on Testing

The main differences to tests written in JavaScript relate to a) writing OPA tests and b) configuring code coverage instrumentation:

The *structural* code differences to writing tests in *JavaScript* are:
1. The **OPA Pages are simply classes extending `Opa5`, having the actions and assertions as class methods**.
2. The **OPA Journeys do not use the `Given`/`When`/`Then` objects, but call actions and assertions directly on the Page objects**. 

This simplifies the test code a lot and at the same time avoids type complications in TypeScript caused by OPA APIs not fitting a typed language. 
All other testing code is converted from JavaScript in the same way as regular application code is (i.e. using real ECMAScript classes and modules).

The *setup* difference is in the configuration to instrument code for coverage reporting: the `istanbul` library needs to be added to the Babel config of `ui5-tooling-transpile-middleware` in `ui5.yaml`.

Details can be found in the later sections of [step-by-step.md](step-by-step.md).

> Note: the test setup is now using the [`ui5-test-runner`](https://github.com/ArnaudBuchholz/ui5-test-runner) instead of deprecated `karma`.


## Requirements

Either [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/) for dependency management.

## Setup

1. Clone the project:

```sh
git clone https://github.com/SAP-samples/ui5-typescript-helloworld.git
cd ui5-typescript-helloworld
```

(or download from https://github.com/SAP-samples/ui5-typescript-helloworld/archive/main.zip)

2. Use npm (or any other package manager) to install the dependencies:

```sh
npm install
```

## Run the App

Execute the following command to run the app locally for development in watch mode (the browser reloads the app automatically when there are changes in the source code):

```sh
npm start
```

As shown in the terminal after executing this command, the app is then running on http://localhost:8080/index.html. A browser window with this URL should automatically open.

## Debug the App

In the browser, you can directly debug the original TypeScript code, which is supplied via sourcemaps (need to be enabled in the browser's developer console if it does not work straight away). If the browser doesn't automatically jump to the TypeScript code when setting breakpoints, use e.g. `Ctrl`/`Cmd` + `P` in Chrome to open the `*.ts` file you want to debug.

## Run the Tests

The tests can be executed either manually or in an automated way using [`ui5-test-runner`](https://github.com/ArnaudBuchholz/ui5-test-runner):

1. *Manual execution*: use `npm start` and then execute the tests by opening the [testsuite](http://localhost:8080/test/testsuite.qunit.html) at [http://localhost:8080/test/testsuite.qunit.html](http://localhost:8080/test/testsuite.qunit.html) in your browser. You can also directly launch the [QUnit tests](http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=unit/unitTests) or the [Integration tests](http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=integration/opaTests) individually.
<!-- 2. *Test-driven* development by running Karma in watch mode using `npm run karma` (which triggers the test each time a source file changes) -->
2. *Headless testing*: launch test-runner either *without* coverage reporting using `npm run test-runner` or *with* coverage using `npm run test-runner-coverage`.
While the tests are running, their status can be monitored at http://localhost:8081/_/progress.html

> Note: when the application to test is passed using the `--url` argument (as we do it in this sample), then there is [no "watch" mode of the ui5-test-runner so far](https://github.com/ArnaudBuchholz/ui5-test-runner/issues/119), which automatically re-runs the tests when a resource changes. 

## Build the App

### Unoptimized (but quick)

Execute the following command to build the project and get an app that can be deployed:

```sh
npm run build
```

The result is placed into the `dist` folder. To start the generated package, just run

```sh
npm run start:dist
```

Note that `index.html` still loads the UI5 framework from the relative URL `resources/...`, which does not physically exist, but is only provided dynamically by the UI5 tooling. So for an actual deployment you should change this URL to either [the CDN](https://sdk.openui5.org/#/topic/2d3eb2f322ea4a82983c1c62a33ec4ae) or your local deployment of UI5.

### Optimized

For an optimized self-contained build (takes longer because the UI5 resources are built, too), do:

```sh
npm run build:opt
```

To start the generated package, again just run

```sh
npm run start:dist
```

In this case, all UI5 framework resources are also available within the `dist` folder, so the folder can be deployed as-is to any static web server, without changing the bootstrap URL.<br>
With the self-contained build, the bootstrap URL in `index.html` has already been modified to load the newly created `sap-ui-custom.js` for bootstrapping, which contains all app resources as well as all needed UI5 JavaScript resources. Most UI5 resources inside the `dist` folder are for this reason actually **not** needed to run the app. Only the non-JS-files, like translation texts and CSS files, are used and must also be deployed. (Only when for some reason JS files are missing from the optimized self-contained bundle, they are also loaded separately.)

## Check the Code

Do the following to run a TypeScript check:

```sh
npm run ts-typecheck
```

This checks the application code for any type errors (but will also complain in case of fundamental syntax issues which break the parsing).<br>

To lint the TypeScript code, do:

```sh
npm run lint
```

## Limitations

- At this time, the used eslint rules are not verified to be optimal or to be in sync with UI5 recommendations.
- In the future there might be further improvements to how tests are written and configured.

## Known Issues

None.

## How to Obtain Support

The sample code is provided **as-is**. No support is provided.

[Create an issue](https://github.com/SAP-samples/ui5-typescript-helloworld/issues) in this repository if you find a bug in the sample app code or documentation.

For issues in the UI5 type definitions which are caused by the dts-generator please open [issues in the dts-generator's repository](https://github.com/SAP/ui5-typescript/issues).<br>

Issues in the UI5 type definitions which are also present in the [API documentation](https://ui5.sap.com/#/api) originate from the JSDoc comments in the original OpenUI5/SAPUI5 code, so please directly open an [OpenUI5](https://github.com/SAP/openui5/issues)/SAPUI5 ticket for those.

Questions can be [asked in SAP Community](https://answers.sap.com/questions/ask.html).

## License

Copyright (c) 2023-2025 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
