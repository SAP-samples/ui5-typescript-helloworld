# A Small TypeScript UI5 Example App with Tests

This app demonstrates a TypeScript setup for developing UI5 applications. For general documentation, please see the [`main` branch](https://github.com/SAP-samples/ui5-typescript-helloworld/tree/main) of this repository.

**This `testing` branch explores how tests are best written in TypeScript.**

:construction: **WORK IN PROGRESS** :construction:

* [Unit tests (QUnit)](./src/test/unit/) look good: run `npm start` and open http://localhost:8080/test/unit/unitTests.qunit.html 
* OPA tests still need additional boilerplate code and do NOT represent the final state! OPA APIs do not fit a typed language very well. Type definitions as well as APIs are being improved. Nevertheless, the OPA test code in this repository does work and is streamlined to some degree. The integration tests can be run at http://localhost:8080/test/integration/opaTests.qunit.html.

## Testing

### General Setup

Right now no test runner is present, only the tests themselves which can be run manually.

The testsuite.qunit.html/.ts files in `src/test` are not meant to be used like this, yet. They bundle the OPA and QUnit tests into one runner page.

### Unit Tests (QUnit)

> Note: `QUnit` is globally defined and its types are automatically required by the UI5 types. So there is no setup needed to use it. However, in order to allow cleaner code that does not access any globals, starting with UI5 1.112, QUnit can be explicitly imported like this: `import QUnit from "sap/ui/thirdparty/qunit-2";`

#### The entry point in `unitTests.qunit.html`

[`src/test/unit/unitTests.qunit.html`](src/test/unit/unitTests.qunit.html) is the entry point for running the tests, it loads QUnit etc. and finally, once UI5 is launched, it loads the list of tests configured in `src/test/unit/unitTests.qunit.ts`.

#### The list of tests in `src/test/unit/unitTests.qunit.ts` 

[`src/test/unit/unitTests.qunit.ts`](src/test/unit/unitTests.qunit.ts) imports all test files, which can be done in a very clean way thanks to the ES6 module imports.

`QUnit.config.autostart = false` must be set before QUnit thinks it can start, then the tests are imported, then `QUnit.start()` is called. There are various ways to achieve this:

* `QUnit.config.autostart = false` could be set in a separate script loaded/executed beforehand
* The tests could be imported as dynamic imports like `import("unit/controller/App.qunit")` with Promise.all(...) waiting for them and then triggering `QUnit.start`, but this will only work when the tests actually export something
* `QUnit.config.autostart = false`, the imports and `QUnit.start()` can simply be written one after each other, but only when the `noWrapBeforeImport` transformer setting is active

All three options are mentioned in `src/test/unit/unitTests.qunit.ts` with the third being active.

#### The concrete tests in `src/test/unit/controller/App.qunit.ts`

In the (very minimal) actual tests in [`src/test/unit/controller/App.qunit.ts`](src/test/unit/controller/App.qunit.ts) there is nothing surprising from TypeScript perspective. There isn't any TypeScript-specific syntax required, but of course ES6-style imports are used just like in the application code.

### Integration Tests (OPA)

**IMPORTANT:**
*The OPA tests in TypeScript are experimental work in progress! This means they **do** work as shown in this sample project, **but** the UI5 team is working on making the OPA APIs work better with TypeScript. Therefore, it is expected that the recommended way of writing OPA tests in TypeScript will change and be simplified over time!*

#### The entry point and the list of tests

Just like for the unit tests, [`src/test/integration/opaTests.qunit.html`](src/test/integration/opaTests.qunit.html) is the entry point for running the OPA tests, which loads the list of journeys configured in [`src/test/integration/opaTests.qunit.ts`](src/test/integration/opaTests.qunit.ts).

#### The "Hello" Journey

The test journey [`src/test/integration/HelloJourney.ts`](src/test/integration/HelloJourney.ts) is actually pretty straightforward.

The only thing specific to OPA with TypeScript is that the `Given`/`When`/`Then` types in the `opaTest(...)` callbacks need to be typed. All three are typed as `Opa5`, but in case of `When` and `Then` additionally enriched with the Actions/Assertions defined in the page defiitions (see below).

#### The "App" page

This is where bigger changes are done compared to non-TypeScript OPA tests:

1. The actions and assertions are written as *classes* extending Opa5.
2. These classes have a self-typed `and` property, which is needed for the call chaining.
3. Each `waitFor(...)` result type is cast to `AppPageActions & jQuery.Promise` or `AppPageAssertions & jQuery.Promise`, respectively (otherwise `.and` does not exist on them).
4. In the last line a custom version of `Opa5.createPageObjects()` is called:
  \
  `OPA_Extension.createPageObjects_NEW_OVERLOAD("onTheAppPage", AppPageActions, AppPageAssertions);`
  \
  The implementation of this method resides in [`src/test/integration/OPA_extension.ts`](src/test/integration/OPA_extension.ts) and is expected to move into the OPA framework in some way or another.

Apart from these changes, the implementation of the actions and assertions is done just like in plain JavaScript.

#### Additional files `OPA_extension.ts` and `AllPages.ts`

On top of the already mentioned [`src/test/integration/OPA_extension.ts`](src/test/integration/OPA_extension.ts) file, there is also [`src/test/integration/pages/AllPages.ts`](src/test/integration/pages/AllPages.ts), a file defining the `When`/`Then` types which hold actions/assertions from *all* pages and are hence separated out. `When` and `Then` are manually defined here in order to add the property `onTheAppPage` (as well as any further pages) along with the respective actions/assertions.

## Requirements

Either [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/) for dependency management.

## Download and Installation

1. Clone the project and switch to the `testing` branch:

   ```sh
   git clone https://github.com/SAP-samples/ui5-typescript-helloworld.git
   cd ui5-typescript-helloworld
   git checkout testing
   ```

   (or download from https://github.com/SAP-samples/ui5-typescript-helloworld/archive/refs/heads/testing.zip)
   &nbsp;

1. Install the dependencies:

   ```sh
   npm install
   ```

## Run the App and the Tests

Execute the following command to run the app locally for development in watch mode (the browser reloads the app automatically when there are changes in the source code):

```sh
npm start
```

As shown in the terminal after executing this command, the app is then running on http://localhost:8080/index.html. A browser window with this URL should automatically open.

Open http://localhost:8080/test/unit/unitTests.qunit.html to run the QUnit tests.

## Limitations

The ways how tests are written in TypeScript are still being improved. When you base any work on this code, be prepared to adapt later.

## Known Issues

http://localhost:8080/test/testsuite.qunit.html does not find any tests

## How to Obtain Support

The sample code is provided **as-is**. No support is provided.

[Create an issue](https://github.com/SAP-samples/ui5-typescript-helloworld/issues) in this repository if you find a bug.

## License

Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
